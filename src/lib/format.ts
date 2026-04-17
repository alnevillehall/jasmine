export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
      new Date(iso),
    )
  } catch {
    return iso
  }
}

const STATUS_LABELS: Record<string, string> = {
  label_created: 'Label created',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  customs: 'Customs',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  exception: 'Exception',
}

export function shipmentStatusLabel(status: string) {
  return STATUS_LABELS[status] ?? status
}

export function invoiceStatusLabel(status: string) {
  const map: Record<string, string> = {
    draft: 'Draft',
    sent: 'Unpaid',
    paid: 'Paid',
    overdue: 'Overdue',
    void: 'Void',
  }
  return map[status] ?? status
}
