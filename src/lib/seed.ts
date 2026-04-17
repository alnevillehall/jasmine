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

function makeEvents(
  tracking: string,
  status: Shipment['status'],
): TrackingEvent[] {
  const base = [
    {
      id: uid(),
      at: isoDaysAgo(3),
      location: 'Singapore, SG',
      description: 'Shipment information received',
      status: 'label_created' as const,
    },
    {
      id: uid(),
      at: isoDaysAgo(2),
      location: 'Singapore, SG',
      description: 'Picked up by courier',
      status: 'picked_up' as const,
    },
    {
      id: uid(),
      at: isoDaysAgo(1),
      location: 'Hong Kong, HK',
      description: 'Arrived at hub',
      status: 'in_transit' as const,
    },
  ]
  if (status === 'customs') {
    base.push({
      id: uid(),
      at: isoDaysAgo(0),
      location: 'Los Angeles, US',
      description: 'Customs clearance in progress',
      status: 'customs',
    })
  }
  if (status === 'out_for_delivery') {
    base.push(
      {
        id: uid(),
        at: isoDaysAgo(0),
        location: 'Chicago, US',
        description: 'Cleared customs — in transit',
        status: 'in_transit' as const,
      },
      {
        id: uid(),
        at: isoDaysAgo(0),
        location: 'Chicago, US',
        description: 'Out for delivery',
        status: 'out_for_delivery',
      },
    )
  }
  if (status === 'delivered') {
    base.push(
      {
        id: uid(),
        at: isoDaysAgo(1),
        location: 'London, GB',
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
    company: 'Northwind Trading Ltd.',
    phone: '+1 555 010 2233',
    role: 'customer' as const,
    savedAddresses: [
      {
        line1: '221B Baker Street',
        city: 'London',
        postalCode: 'NW1 6XE',
        country: 'United Kingdom',
      },
    ],
    notificationPrefs: {
      emailStatus: true,
      emailInvoice: true,
      smsDelivery: false,
      pushEnabled: true,
    },
    createdAt: isoDaysAgo(30),
  }

  const s1: Shipment = {
    id: uid(),
    trackingNumber: 'JGL' + Date.now().toString().slice(-10),
    userId,
    service: 'express',
    status: 'in_transit',
    origin: {
      line1: '12 Marina View',
      city: 'Singapore',
      postalCode: '018961',
      country: 'Singapore',
    },
    destination: {
      line1: '350 West Hubbard',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60654',
      country: 'United States',
    },
    shipper: {
      name: 'Alex Morgan',
      company: 'Northwind Trading Ltd.',
      email: DEMO_EMAIL,
    },
    recipient: {
      name: 'Jordan Lee',
      company: 'Great Lakes Retail',
      phone: '+1 312 555 0199',
    },
    weightKg: 12.4,
    reference: 'PO-88421',
    estimatedDelivery: isoDaysFromNow(2),
    createdAt: isoDaysAgo(3),
    events: makeEvents('s1', 'in_transit'),
  }

  const s2: Shipment = {
    id: uid(),
    trackingNumber: 'JGL' + (Date.now() - 1000).toString().slice(-10),
    userId,
    service: 'standard',
    status: 'delivered',
    origin: {
      line1: 'Unit 5, Industrial Park',
      city: 'Rotterdam',
      postalCode: '3044 BC',
      country: 'Netherlands',
    },
    destination: {
      line1: '10 Downing Street',
      city: 'London',
      postalCode: 'SW1A 2AA',
      country: 'United Kingdom',
    },
    shipper: {
      name: 'Alex Morgan',
      email: DEMO_EMAIL,
    },
    recipient: {
      name: 'Harriet Wilson',
      phone: '+44 20 7946 0958',
    },
    weightKg: 4.2,
    reference: 'RMA-202',
    estimatedDelivery: isoDaysAgo(1),
    createdAt: isoDaysAgo(8),
    events: makeEvents('s2', 'delivered'),
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
          { description: 'Express international — 12.4 kg', quantity: 1, unitPrice: 380 },
          { description: 'Fuel surcharge', quantity: 1, unitPrice: 40 },
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
          { description: 'Standard international — 4.2 kg', quantity: 1, unitPrice: 186.5 },
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
        body: `Package ${s1.trackingNumber} departed Hong Kong hub.`,
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
