import type {
  AppState,
  IncomingPackageNotice,
  Invoice,
  PackageAlert,
  Payment,
  SavedPaymentMethod,
  Shipment,
  UserProfile,
} from './types'
import { migrateShipment, migrateUser } from './migrate'

const KEYS = {
  state: 'bloom-shipping-app-state',
  session: 'bloom-shipping-app-session',
} as const

/** Reads legacy localStorage from the previous app id so upgrades don’t lose data. */
const LEGACY_KEYS = {
  state: 'jasmine-global-logistics-state',
  session: 'jasmine-global-logistics-session',
} as const

function defaultState(): AppState {
  return {
    users: [],
    shipments: [],
    invoices: [],
    payments: [],
    paymentMethods: [],
    alerts: [],
    incomingPackages: [],
  }
}

export function loadState(): AppState {
  try {
    const fromNew = localStorage.getItem(KEYS.state)
    const fromLegacy = localStorage.getItem(LEGACY_KEYS.state)
    const raw = fromNew ?? fromLegacy
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    const users = (parsed.users ?? []).map((u) => migrateUser(u as UserProfile))
    const shipments = (parsed.shipments ?? []).map((s) => migrateShipment(s as Shipment))
    const next: AppState = {
      ...defaultState(),
      ...parsed,
      users,
      shipments,
      invoices: parsed.invoices ?? [],
      payments: parsed.payments ?? [],
      paymentMethods: parsed.paymentMethods ?? [],
      alerts: parsed.alerts ?? [],
      incomingPackages: parsed.incomingPackages ?? [],
    }
    /** One-time upgrade: persist under new key and drop legacy blob. */
    if (!fromNew && fromLegacy) {
      try {
        localStorage.setItem(KEYS.state, JSON.stringify(next))
        localStorage.removeItem(LEGACY_KEYS.state)
      } catch {
        /* ignore */
      }
    }
    return next
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEYS.state, JSON.stringify(state))
}

export function getSessionUserId(): string | null {
  const next = localStorage.getItem(KEYS.session)
  if (next) return next
  const legacy = localStorage.getItem(LEGACY_KEYS.session)
  if (legacy) {
    try {
      localStorage.setItem(KEYS.session, legacy)
      localStorage.removeItem(LEGACY_KEYS.session)
    } catch {
      /* ignore */
    }
    return legacy
  }
  return null
}

export function setSessionUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(KEYS.session, userId)
    try {
      localStorage.removeItem(LEGACY_KEYS.session)
    } catch {
      /* ignore */
    }
  } else {
    localStorage.removeItem(KEYS.session)
    try {
      localStorage.removeItem(LEGACY_KEYS.session)
    } catch {
      /* ignore */
    }
  }
}

export function upsertUser(
  state: AppState,
  user: UserProfile,
): AppState {
  const idx = state.users.findIndex((u) => u.id === user.id)
  const users =
    idx >= 0
      ? state.users.map((u) => (u.id === user.id ? user : u))
      : [...state.users, user]
  return { ...state, users }
}

export function upsertShipment(
  state: AppState,
  shipment: Shipment,
): AppState {
  const idx = state.shipments.findIndex((s) => s.id === shipment.id)
  const shipments =
    idx >= 0
      ? state.shipments.map((s) => (s.id === shipment.id ? shipment : s))
      : [...state.shipments, shipment]
  return { ...state, shipments }
}

export function upsertInvoice(state: AppState, invoice: Invoice): AppState {
  const idx = state.invoices.findIndex((i) => i.id === invoice.id)
  const invoices =
    idx >= 0
      ? state.invoices.map((i) => (i.id === invoice.id ? invoice : i))
      : [...state.invoices, invoice]
  return { ...state, invoices }
}

export function upsertPayment(state: AppState, payment: Payment): AppState {
  const idx = state.payments.findIndex((p) => p.id === payment.id)
  const payments =
    idx >= 0
      ? state.payments.map((p) => (p.id === payment.id ? payment : p))
      : [...state.payments, payment]
  return { ...state, payments }
}

export function upsertPaymentMethod(
  state: AppState,
  method: SavedPaymentMethod,
): AppState {
  const idx = state.paymentMethods.findIndex((m) => m.id === method.id)
  const paymentMethods =
    idx >= 0
      ? state.paymentMethods.map((m) =>
          m.id === method.id ? method : m,
        )
      : [...state.paymentMethods, method]
  return { ...state, paymentMethods }
}

export function pushAlert(state: AppState, alert: PackageAlert): AppState {
  return { ...state, alerts: [alert, ...state.alerts] }
}

export function pushIncomingPackage(
  state: AppState,
  row: IncomingPackageNotice,
): AppState {
  return { ...state, incomingPackages: [row, ...state.incomingPackages] }
}

export function patchState(
  updater: (s: AppState) => AppState,
): AppState {
  const next = updater(loadState())
  saveState(next)
  return next
}
