import { Link } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDateShort, formatMoney, invoiceStatusLabel } from '../lib/format'

export function Invoices() {
  const { user, state } = useAppState()
  if (!user) return null

  const list = state.invoices
    .filter((i) => i.userId === user.id)
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
        <p className="mt-1 text-slate-600">What you owe, what’s paid — plain and simple.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    to={`/invoices/${inv.id}`}
                    className="font-medium text-amber-800 hover:underline"
                  >
                    {inv.number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDateShort(inv.issuedAt)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateShort(inv.dueAt)}</td>
                <td className="px-4 py-3 font-medium tabular-nums text-slate-900">
                  {formatMoney(inv.total, inv.currency)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {invoiceStatusLabel(inv.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
