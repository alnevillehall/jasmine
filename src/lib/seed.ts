import type { AppState, Shipment, TrackingEvent } from './types'
import { loadState, saveState } from './storage'

const DEMO_EMAIL = 'demo@jasmine.global'
const DEMO_PASSWORD = 'demo123'

function uid() {
  return crypto.randomUUID()
}

function isoDaysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function isoDaysFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

/** Milestones typical of our US → Jamaica corridor (demo data). */
function makeEvents(status: Shipment['status']): TrackingEvent[] {
  const base: TrackingEvent[] = [
    {
      id: uid(),
      at: isoDaysAgo(3),
      location: 'Miami, FL, United States',
      description: 'Booking confirmed — label created',
      status: 'label_created',
    },
    {
      id: uid(),
      at: isoDaysAgo(2),
      location: 'Miami, FL, United States',
      description: 'Pickup completed at US origin facility',
      status: 'picked_up',
    },
    {
      id: uid(),
      at: isoDaysAgo(1),
      location: 'Miami export hub',
      description: 'Departed US gateway — en route to Jamaica',
      status: 'in_transit',
    },
  ]
  if (status === 'in_transit') {
    base.push({
      id: uid(),
      at: isoDaysAgo(0),
      location: 'Caribbean transit',
      description: 'In transit to Jamaica — on schedule for estimated delivery',
      status: 'in_transit',
    })
  }
  if (status === 'customs') {
    base.push({
      id: uid(),
      at: isoDaysAgo(0),
      location: 'Kingston, Jamaica',
      description: 'Jamaica customs review in progress',
      status: 'customs',
    })
  }
  if (status === 'out_for_delivery') {
    base.push(
      {
        id: uid(),
        at: isoDaysAgo(0),
        location: 'Kingston, Jamaica',
        description: 'Cleared customs — out for delivery',
        status: 'out_for_delivery',
      },
    )
  }
  if (status === 'delivered') {
    base.push(
      {
        id: uid(),
        at: isoDaysAgo(2),
        location: 'Kingston, Jamaica',
        description: 'Arrived in Jamaica — customs cleared',
        status: 'in_transit',
      },
      {
        id: uid(),
        at: isoDaysAgo(1),
        location: 'Montego Bay, Jamaica',
        description: 'Delivered — signed for by recipient',
        status: 'delivered',
      },
    )
  }
  return base
}

export function ensureSeed(): void {
  const state = loadState()
  if (state.users.some((u) => u.email === DEMO_EMAIL)) {
    return
  }

  const userId = uid()
  const demoUser = {
    id: userId,
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    fullName: 'Alex Morgan',
    company: 'Caribbean Horizon Trading LLC',
    phone: '+1 555 010 2233',
    role: 'customer' as const,
    savedAddresses: [
      {
        line1: '14 Main Street',
        city: 'Kingston',
        postalCode: 'JMKN05',
        country: 'Jamaica',
      },
    ],
    notificationPrefs: {
      emailStatus: true,
      emailInvoice: true,
      smsDelivery: false,
      pushEnabled: true,
    },
    createdAt: isoDaysAgo(30),
    accountStatus: 'approved' as const,
    suiteCode: 'JGL-DEMO1',
    idVerification: {
      submittedAt: isoDaysAgo(31),
      idType: 'passport' as const,
      fileName: 'id-on-file.pdf',
    },
    tutorialCompletedAt: isoDaysAgo(29),
  }

  const s1: Shipment = {
    id: uid(),
    trackingNumber: 'JGL' + Date.now().toString().slice(-10),
    userId,
    service: 'express',
    status: 'in_transit',
    origin: {
      line1: '1845 NW 79th Ave',
      city: 'Miami',
      state: 'FL',
      postalCode: '33126',
      country: 'United States',
    },
    destination: {
      line1: '8-10 Ocean Boulevard',
      city: 'Kingston',
      postalCode: 'JMKN05',
      country: 'Jamaica',
    },
    shipper: {
      name: 'Alex Morgan',
      company: 'Caribbean Horizon Trading LLC',
      email: DEMO_EMAIL,
    },
    recipient: {
      name: 'Jordan Lee',
      company: 'Island Fresh Market Ltd.',
      phone: '+1 876 555 0188',
    },
    weightKg: 12.4,
    reference: 'PO-88421',
    estimatedDelivery: isoDaysFromNow(2),
    createdAt: isoDaysAgo(3),
    events: makeEvents('in_transit'),
  }

  const s2: Shipment = {
    id: uid(),
    trackingNumber: 'JGL' + (Date.now() - 1000).toString().slice(-10),
    userId,
    service: 'standard',
    status: 'delivered',
    origin: {
      line1: '2500 NW 79th Ave',
      city: 'Miami',
      state: 'FL',
      postalCode: '33122',
      country: 'United States',
    },
    destination: {
      line1: 'Shop 3, Fairview Plaza',
      city: 'Montego Bay',
      postalCode: 'JMCR01',
      country: 'Jamaica',
    },
    shipper: {
      name: 'Alex Morgan',
      company: 'Caribbean Horizon Trading LLC',
      email: DEMO_EMAIL,
    },
    recipient: {
      name: 'Harriet Wilson',
      company: 'MoBay Home & Gift',
      phone: '+1 876 555 0162',
    },
    weightKg: 4.2,
    reference: 'RMA-202',
    estimatedDelivery: isoDaysAgo(1),
    createdAt: isoDaysAgo(8),
    events: makeEvents('delivered'),
  }

  const inv1Id = uid()
  const inv2Id = uid()

  const next: AppState = {
    ...state,
    users: [...state.users, demoUser],
    shipments: [...state.shipments, s1, s2],
    invoices: [
      ...state.invoices,
      {
        id: inv1Id,
        number: 'INV-2026-0142',
        userId,
        shipmentId: s1.id,
        status: 'sent',
        currency: 'USD',
        subtotal: 420,
        tax: 33.6,
        total: 453.6,
        issuedAt: isoDaysAgo(2),
        dueAt: isoDaysFromNow(12),
        lineItems: [
          { description: 'Express US–Jamaica corridor — 12.4 kg', quantity: 1, unitPrice: 380 },
          { description: 'Fuel & handling (corridor)', quantity: 1, unitPrice: 40 },
        ],
      },
      {
        id: inv2Id,
        number: 'INV-2026-0098',
        userId,
        shipmentId: s2.id,
        status: 'paid',
        currency: 'USD',
        subtotal: 186.5,
        tax: 14.92,
        total: 201.42,
        issuedAt: isoDaysAgo(10),
        dueAt: isoDaysAgo(3),
        lineItems: [
          { description: 'Standard US–Jamaica — 4.2 kg', quantity: 1, unitPrice: 186.5 },
        ],
      },
    ],
    paymentMethods: [
      {
        id: uid(),
        userId,
        type: 'card',
        label: 'Corporate Visa',
        last4: '4242',
        brand: 'Visa',
        expires: '08/27',
        isDefault: true,
      },
    ],
    payments: [
      {
        id: uid(),
        userId,
        invoiceId: inv2Id,
        amount: 201.42,
        currency: 'USD',
        status: 'completed',
        description: 'Invoice INV-2026-0098',
        createdAt: isoDaysAgo(4),
      },
    ],
    alerts: [
      {
        id: uid(),
        userId,
        type: 'status_change',
        title: 'Shipment in transit',
        body: `Package ${s1.trackingNumber} departed our Miami gateway — on the way to Jamaica.`,
        shipmentId: s1.id,
        read: false,
        createdAt: isoDaysAgo(1),
      },
      {
        id: uid(),
        userId,
        type: 'invoice',
        title: 'New invoice available',
        body: 'Invoice INV-2026-0142 is ready for payment.',
        invoiceId: inv1Id,
        read: false,
        createdAt: isoDaysAgo(2),
      },
      {
        id: uid(),
        userId,
        type: 'delivery',
        title: 'Delivered',
        body: `Shipment ${s2.trackingNumber} was delivered.`,
        shipmentId: s2.id,
        read: true,
        createdAt: isoDaysAgo(1),
      },
    ],
  }

  saveState(next)
}

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD }
