export type ShipmentStatus =
  | 'label_created'
  | 'picked_up'
  | 'in_transit'
  | 'customs'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'

export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface Contact {
  name: string
  company?: string
  phone?: string
  email?: string
}

export interface TrackingEvent {
  id: string
  at: string
  location: string
  description: string
  status: ShipmentStatus
}

export interface Shipment {
  id: string
  trackingNumber: string
  userId: string
  service: 'express' | 'standard' | 'freight'
  status: ShipmentStatus
  origin: Address
  destination: Address
  shipper: Contact
  recipient: Contact
  weightKg: number
  reference?: string
  estimatedDelivery: string
  createdAt: string
  events: TrackingEvent[]
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void'

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  number: string
  userId: string
  shipmentId?: string
  status: InvoiceStatus
  currency: string
  subtotal: number
  tax: number
  total: number
  issuedAt: string
  dueAt: string
  lineItems: InvoiceLineItem[]
}

export type PaymentMethodType = 'card' | 'ach' | 'wire'

export interface SavedPaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  label: string
  last4?: string
  brand?: string
  expires?: string
  isDefault: boolean
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  userId: string
  invoiceId?: string
  amount: number
  currency: string
  methodId?: string
  status: PaymentStatus
  description: string
  createdAt: string
}

export type AlertType = 'status_change' | 'delivery' | 'exception' | 'invoice' | 'system'

export interface PackageAlert {
  id: string
  userId: string
  type: AlertType
  title: string
  body: string
  shipmentId?: string
  invoiceId?: string
  read: boolean
  createdAt: string
}

export interface NotificationPrefs {
  emailStatus: boolean
  emailInvoice: boolean
  smsDelivery: boolean
  pushEnabled: boolean
}

export type AccountStatus = 'pending_id' | 'pending_review' | 'approved' | 'rejected'

export type IdDocumentType = 'drivers_license' | 'passport' | 'national_id'

export interface IdVerificationSubmission {
  submittedAt: string
  idType: IdDocumentType
  fileName: string
  notes?: string
}

/** Customer tells us about a purchase headed to the FL warehouse (invoice helps processing). */
export interface IncomingPackageNotice {
  id: string
  userId: string
  storeName: string
  orderNumber?: string
  carrierTracking?: string
  itemsDescription: string
  invoiceFileName?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  password: string
  fullName: string
  company?: string
  phone?: string
  role: 'customer' | 'admin'
  savedAddresses: Address[]
  notificationPrefs: NotificationPrefs
  createdAt: string
  /** New signups start at pending_id until ID is submitted, then pending_review until approved. */
  accountStatus: AccountStatus
  /** Unique code used on the warehouse address line so we can match packages to you. */
  suiteCode: string
  idVerification?: IdVerificationSubmission
  rejectionReason?: string
  /** When null, first-time tutorial has not been completed. */
  tutorialCompletedAt: string | null
}

export interface AppState {
  users: UserProfile[]
  shipments: Shipment[]
  invoices: Invoice[]
  payments: Payment[]
  paymentMethods: SavedPaymentMethod[]
  alerts: PackageAlert[]
  incomingPackages: IncomingPackageNotice[]
}
