import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDate, formatMoney } from '../lib/format'

export function Payments() {
  const { user, state, addPaymentMethod, setDefaultPaymentMethod } = useAppState()
  const [showAdd, setShowAdd] = useState(false)
  const [label, setLabel] = useState('Business card')
  const [last4, setLast4] = useState('4242')
  const [brand, setBrand] = useState('Visa')

  if (!user) return null

  const methods = state.paymentMethods.filter((m) => m.userId === user.id)
  const payments = state.payments
    .filter((p) => p.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  function onAddCard(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    addPaymentMethod({
      userId: user.id,
      type: 'card',
      label: label.trim() || 'Card',
      last4: last4.replace(/\D/g, '').slice(-4) || '0000',
      brand: brand || 'Card',
      expires: '12/30',
      isDefault: methods.length === 0,
    })
    setShowAdd(false)
    setLabel('Business card')
    setLast4('4242')
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
        <p className="mt-1 text-slate-600">
          Cards on file and what you’ve paid. (Demo only — no real charges here.)
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-900">Payment methods</h2>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
          >
            Add card (mock)
          </button>
        </div>

        {showAdd ? (
          <form onSubmit={onAddCard} className="mt-6 max-w-md space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <input
              required
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Last 4"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value)}
                className="rounded border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-slate-900">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <ul className="mt-6 divide-y divide-slate-100">
          {methods.length === 0 ? (
            <li className="py-4 text-sm text-slate-500">No saved methods yet.</li>
          ) : (
            methods.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium text-slate-900">{m.label}</p>
                  <p className="text-sm text-slate-600">
                    {m.brand} ·••• {m.last4}
                    {m.expires ? ` · ${m.expires}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {m.isDefault ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      Default
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultPaymentMethod(m.id)}
                      className="text-sm font-medium text-amber-700 hover:underline"
                    >
                      Set default
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No payments yet. Pay an invoice from the{' '}
                    <Link to="/invoices" className="font-medium text-amber-700">
                      invoices
                    </Link>{' '}
                    page.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-800">{p.description}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium capitalize text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                      {formatMoney(p.amount, p.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
