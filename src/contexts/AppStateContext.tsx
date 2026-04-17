import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  IdDocumentType,
  IncomingPackageNotice,
  Invoice,
  PackageAlert,
  Payment,
  SavedPaymentMethod,
  Shipment,
  UserProfile,
} from '../lib/types'
import {
  getSessionUserId,
  loadState,
  patchState,
  pushAlert,
  pushIncomingPackage,
  setSessionUserId,
  upsertInvoice,
  upsertPayment,
  upsertPaymentMethod,
  upsertShipment,
  upsertUser,
} from '../lib/storage'
import { ensureSeed } from '../lib/seed'
import { generateSuiteCode } from '../lib/warehouse'

ensureSeed()

type Ctx = {
  state: ReturnType<typeof loadState>
  refresh: () => void
  user: UserProfile | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (data: {
    email: string
    password: string
    fullName: string
    company?: string
  }) => { ok: boolean; error?: string }
  logout: () => void
  updateProfile: (patch: Partial<
    Pick<
      UserProfile,
      'fullName' | 'company' | 'phone' | 'savedAddresses' | 'notificationPrefs'
    >
  >) => void
  createShipment: (
    partial: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'events' | 'userId'>,
  ) => Shipment
  updateShipment: (shipment: Shipment) => void
  addAlert: (a: Omit<PackageAlert, 'id' | 'createdAt' | 'read'>) => void
  markAlertRead: (id: string) => void
  markAllAlertsRead: () => void
  payInvoice: (invoiceId: string, methodId?: string) => { ok: boolean; error?: string }
  addPaymentMethod: (m: Omit<SavedPaymentMethod, 'id'>) => void
  setDefaultPaymentMethod: (id: string) => void
  submitIdVerification: (data: {
    idType: IdDocumentType
    fileName: string
    notes?: string
  }) => void
  /** Demo only — real deployments use staff/admin tools. */
  simulateAccountApproval: () => void
  markTutorialComplete: () => void
  addIncomingPackageNotice: (
    data: Omit<IncomingPackageNotice, 'id' | 'userId' | 'createdAt'>,
  ) => void
}

const AppStateContext = createContext<Ctx | null>(null)

function uid() {
  return crypto.randomUUID()
}

function trackingNumber() {
  const n = Date.now().toString(36).toUpperCase().slice(-9)
  return `JGL${n}`
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0)
  const state = useMemo(() => {
    void tick
    return loadState()
  }, [tick])
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const sessionId = getSessionUserId()
  const user = sessionId
    ? state.users.find((u) => u.id === sessionId) ?? null
    : null

  const login = useCallback(
    (email: string, password: string) => {
      const u = state.users.find(
        (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
      )
      if (!u) return { ok: false as const, error: 'Invalid email or password.' }
      setSessionUserId(u.id)
      refresh()
      return { ok: true as const }
    },
    [state.users, refresh],
  )

  const register = useCallback(
    (data: {
      email: string
      password: string
      fullName: string
      company?: string
    }) => {
      if (state.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { ok: false as const, error: 'An account with this email already exists.' }
      }
      const newUser: UserProfile = {
        id: uid(),
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
        company: data.company?.trim() || undefined,
        phone: undefined,
        role: 'customer',
        savedAddresses: [],
        notificationPrefs: {
          emailStatus: true,
          emailInvoice: true,
          smsDelivery: false,
          pushEnabled: true,
        },
        createdAt: new Date().toISOString(),
        accountStatus: 'pending_id',
        suiteCode: generateSuiteCode(),
        tutorialCompletedAt: null,
      }
      patchState((s) => upsertUser(s, newUser))
      setSessionUserId(newUser.id)
      refresh()
      return { ok: true as const }
    },
    [state.users, refresh],
  )

  const logout = useCallback(() => {
    setSessionUserId(null)
    refresh()
  }, [refresh])

  const updateProfile = useCallback(
    (patch: Partial<
      Pick<
        UserProfile,
        'fullName' | 'company' | 'phone' | 'savedAddresses' | 'notificationPrefs'
      >
    >) => {
      if (!user) return
      const next: UserProfile = {
        ...user,
        ...patch,
        notificationPrefs: patch.notificationPrefs
          ? { ...user.notificationPrefs, ...patch.notificationPrefs }
          : user.notificationPrefs,
      }
      patchState((s) => upsertUser(s, next))
      refresh()
    },
    [user, refresh],
  )

  const createShipment = useCallback(
    (partial: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'events' | 'userId'>) => {
      if (!user) throw new Error('Not authenticated')
      if (user.accountStatus !== 'approved') throw new Error('Account not approved')
      const createdAt = new Date().toISOString()
      const shipment: Shipment = {
        ...partial,
        id: uid(),
        trackingNumber: trackingNumber(),
        userId: user.id,
        createdAt,
        events: [
          {
            id: uid(),
            at: createdAt,
            location: `${partial.origin.city}, ${partial.origin.country}`,
            description: 'Label created — awaiting pickup',
            status: 'label_created',
          },
        ],
      }
      patchState((s) => {
        let next = upsertShipment(s, shipment)
        if (user.notificationPrefs.emailStatus) {
          next = pushAlert(next, {
            id: uid(),
            userId: user.id,
            type: 'status_change',
            title: 'Shipment created',
            body: `Tracking ${shipment.trackingNumber} is live — US to Jamaica.`,
            shipmentId: shipment.id,
            read: false,
            createdAt: new Date().toISOString(),
          })
        }
        return next
      })
      refresh()
      return shipment
    },
    [user, refresh],
  )

  const updateShipment = useCallback((shipment: Shipment) => {
    patchState((s) => upsertShipment(s, shipment))
    refresh()
  }, [refresh])

  const addAlert = useCallback(
    (a: Omit<PackageAlert, 'id' | 'createdAt' | 'read'>) => {
      patchState((s) =>
        pushAlert(s, {
          ...a,
          id: uid(),
          createdAt: new Date().toISOString(),
          read: false,
        }),
      )
      refresh()
    },
    [refresh],
  )

  const markAlertRead = useCallback((id: string) => {
    patchState((s) => ({
      ...s,
      alerts: s.alerts.map((x) => (x.id === id ? { ...x, read: true } : x)),
    }))
    refresh()
  }, [refresh])

  const markAllAlertsRead = useCallback(() => {
    if (!user) return
    patchState((s) => ({
      ...s,
      alerts: s.alerts.map((x) =>
        x.userId === user.id ? { ...x, read: true } : x,
      ),
    }))
    refresh()
  }, [user, refresh])

  const payInvoice = useCallback(
    (invoiceId: string, methodId?: string) => {
      if (!user) return { ok: false as const, error: 'Not signed in.' }
      const inv = state.invoices.find((i) => i.id === invoiceId && i.userId === user.id)
      if (!inv) return { ok: false as const, error: 'Invoice not found.' }
      if (inv.status === 'paid') return { ok: false as const, error: 'Already paid.' }
      const payment: Payment = {
        id: uid(),
        userId: user.id,
        invoiceId: inv.id,
        amount: inv.total,
        currency: inv.currency,
        methodId,
        status: 'completed',
        description: `Invoice ${inv.number}`,
        createdAt: new Date().toISOString(),
      }
      const paid: Invoice = { ...inv, status: 'paid' }
      patchState((s) => {
        let next = upsertPayment(upsertInvoice(s, paid), payment)
        if (user.notificationPrefs.emailInvoice) {
          next = pushAlert(next, {
            id: uid(),
            userId: user.id,
            type: 'invoice',
            title: 'Payment received',
            body: `${inv.number} marked as paid.`,
            invoiceId: inv.id,
            read: false,
            createdAt: new Date().toISOString(),
          })
        }
        return next
      })
      refresh()
      return { ok: true as const }
    },
    [state.invoices, user, refresh],
  )

  const addPaymentMethod = useCallback(
    (m: Omit<SavedPaymentMethod, 'id'>) => {
      if (!user) return
      const method: SavedPaymentMethod = {
        ...m,
        id: uid(),
        userId: user.id,
      }
      patchState((s) => {
        let next = s
        if (method.isDefault) {
          next = {
            ...next,
            paymentMethods: next.paymentMethods.map((pm) =>
              pm.userId === user.id ? { ...pm, isDefault: false } : pm,
            ),
          }
        }
        return upsertPaymentMethod(next, method)
      })
      refresh()
    },
    [user, refresh],
  )

  const setDefaultPaymentMethod = useCallback(
    (id: string) => {
      if (!user) return
      patchState((s) => ({
        ...s,
        paymentMethods: s.paymentMethods.map((pm) =>
          pm.userId === user.id
            ? { ...pm, isDefault: pm.id === id }
            : pm,
        ),
      }))
      refresh()
    },
    [user, refresh],
  )

  const submitIdVerification = useCallback(
    (data: { idType: IdDocumentType; fileName: string; notes?: string }) => {
      if (!user) return
      if (user.accountStatus !== 'pending_id') return
      const idVerification = {
        submittedAt: new Date().toISOString(),
        idType: data.idType,
        fileName: data.fileName,
        notes: data.notes?.trim() || undefined,
      }
      patchState((s) => {
        const current = s.users.find((x) => x.id === user.id)
        if (!current) return s
        return upsertUser(s, {
          ...current,
          accountStatus: 'pending_review',
          idVerification,
        })
      })
      refresh()
    },
    [user, refresh],
  )

  const simulateAccountApproval = useCallback(() => {
    if (!user) return
    patchState((s) => {
      const current = s.users.find((x) => x.id === user.id)
      if (!current) return s
      let next = upsertUser(s, {
        ...current,
        accountStatus: 'approved',
        rejectionReason: undefined,
      })
      next = pushAlert(next, {
        id: uid(),
        userId: user.id,
        type: 'system',
        title: 'You are approved',
        body: 'Welcome to Jasmine Shipping — your account is active.',
        read: false,
        createdAt: new Date().toISOString(),
      })
      return next
    })
    refresh()
  }, [user, refresh])

  const markTutorialComplete = useCallback(() => {
    if (!user) return
    patchState((s) => {
      const current = s.users.find((x) => x.id === user.id)
      if (!current) return s
      return upsertUser(s, {
        ...current,
        tutorialCompletedAt: new Date().toISOString(),
      })
    })
    refresh()
  }, [user, refresh])

  const addIncomingPackageNotice = useCallback(
    (data: Omit<IncomingPackageNotice, 'id' | 'userId' | 'createdAt'>) => {
      if (!user) return
      const row: IncomingPackageNotice = {
        ...data,
        id: uid(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      }
      patchState((s) => {
        let next = pushIncomingPackage(s, row)
        next = pushAlert(next, {
          id: uid(),
          userId: user.id,
          type: 'system',
          title: 'Incoming package noted',
          body: `We logged your order from ${data.storeName}.`,
          read: false,
          createdAt: new Date().toISOString(),
        })
        return next
      })
      refresh()
    },
    [user, refresh],
  )

  const value = useMemo(
    () => ({
      state,
      refresh,
      user,
      login,
      register,
      logout,
      updateProfile,
      createShipment,
      updateShipment,
      addAlert,
      markAlertRead,
      markAllAlertsRead,
      payInvoice,
      addPaymentMethod,
      setDefaultPaymentMethod,
      submitIdVerification,
      simulateAccountApproval,
      markTutorialComplete,
      addIncomingPackageNotice,
    }),
    [
      state,
      refresh,
      user,
      login,
      register,
      logout,
      updateProfile,
      createShipment,
      updateShipment,
      addAlert,
      markAlertRead,
      markAllAlertsRead,
      payInvoice,
      addPaymentMethod,
      setDefaultPaymentMethod,
      submitIdVerification,
      simulateAccountApproval,
      markTutorialComplete,
      addIncomingPackageNotice,
    ],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components -- hook paired with provider */
export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
