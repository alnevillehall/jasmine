import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDateShort, formatMoney, invoiceStatusLabel } from '../lib/format'

export function InvoiceDetail() {
  const { id } = useParams()
  const { user, state, payInvoice } = useAppState()

  const printInvoice = useCallback(() => {
    window.print()
  }, [])

  if (!user) return null

  const invoice = state.invoices.find((i) => i.id === id && i.userId === user.id)

  if (!invoice) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Invoice not found.</p>
        <Link to="/invoices" className="mt-4 inline-block text-amber-700 hover:underline">
          Back to invoices
        </Link>
      </div>
    )
  }

  const inv = invoice

  const shipment = inv.shipmentId
    ? state.shipments.find((s) => s.id === inv.shipmentId)
    : undefined

  const defaultMethod = state.paymentMethods.find(
    (m) => m.userId === user.id && m.isDefault,
  )

  function onPay() {
    const res = payInvoice(inv.id, defaultMethod?.id)
    if (!res.ok) alert(res.error ?? 'Payment failed')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 print:space-y-4">
      <div className="print:hidden">
        <Link to="/invoices" className="text-sm font-medium text-amber-700 hover:underline">
          ← Invoices
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm print:p-0 print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Invoice</p>
            <h1 className="font-mono text-2xl font-semibold text-slate-900">{inv.number}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Issued {formatDateShort(inv.issuedAt)} · Due {formatDateShort(inv.dueAt)}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                inv.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {invoiceStatusLabel(inv.status)}
            </span>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">
              {formatMoney(inv.total, inv.currency)}
            </p>
          </div>
        </div>

        {shipment ? (
          <p className="mt-6 text-sm text-slate-600">
            Related shipment:{' '}
            <Link
              to={`/shipments/${shipment.id}`}
              className="font-mono font-medium text-amber-800 hover:underline print:hidden"
            >
              {shipment.trackingNumber}
            </Link>
            <span className="hidden font-mono print:inline">{shipment.trackingNumber}</span>
          </p>
        ) : null}

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 font-medium">Qty</th>
              <th className="py-2 font-medium text-right">Unit</th>
              <th className="py-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inv.lineItems.map((line, i) => (
              <tr key={i}>
                <td className="py-3 text-slate-800">{line.description}</td>
                <td className="py-3 tabular-nums text-slate-600">{line.quantity}</td>
                <td className="py-3 text-right tabular-nums text-slate-600">
                  {formatMoney(line.unitPrice, inv.currency)}
                </td>
                <td className="py-3 text-right font-medium tabular-nums text-slate-900">
                  {formatMoney(line.quantity * line.unitPrice, inv.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-6 max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoney(inv.subtotal, inv.currency)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax</span>
            <span className="tabular-nums">{formatMoney(inv.tax, inv.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(inv.total, inv.currency)}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-100 pt-6 print:hidden">
          <button
            type="button"
            onClick={printInvoice}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Print / PDF
          </button>
          {inv.status !== 'paid' ? (
            <button
              type="button"
              onClick={onPay}
              className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
            >
              Pay now
              {defaultMethod ? ` (${defaultMethod.brand ?? 'Card'} ·••• ${defaultMethod.last4})` : ''}
            </button>
          ) : (
            <Link
              to="/payments"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              View payment history
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
