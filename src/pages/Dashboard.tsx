import { Link } from 'react-router-dom'
import { WarehouseAddressCard } from '../components/WarehouseAddressCard'
import { useAppState } from '../contexts/AppStateContext'
import { formatDateShort, formatMoney, shipmentStatusLabel } from '../lib/format'

export function Dashboard() {
  const { user, state } = useAppState()
  if (!user) return null

  const shipments = state.shipments.filter((s) => s.userId === user.id)
  const invoices = state.invoices.filter((i) => i.userId === user.id)
  const unpaid = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue')
  const inTransit = shipments.filter(
    (s) => s.status !== 'delivered' && s.status !== 'exception',
  )

  const recent = [...shipments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ).slice(0, 5)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user.fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-slate-600">Here’s what’s moving — shipments, bills, and heads-ups.</p>
      </div>

      {!user.tutorialCompletedAt ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <Link to="/tutorial?welcome=1" className="font-semibold text-amber-900 underline">
            Take the quick tour
          </Link>{' '}
          — your Florida address &amp; how everything fits together.
        </div>
      ) : null}

      <WarehouseAddressCard fullName={user.fullName} suiteCode={user.suiteCode} compact />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active shipments', value: String(inTransit.length), to: '/shipments' },
          { label: 'Open invoices', value: String(unpaid.length), to: '/invoices' },
          { label: 'Total shipments', value: String(shipments.length), to: '/shipments' },
          {
            label: 'Alerts',
            value: String(
              state.alerts.filter((a) => a.userId === user.id && !a.read).length,
            ),
            to: '/alerts',
          },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Recent shipments</h2>
            <Link to="/shipments/new" className="text-sm font-medium text-amber-700 hover:underline">
              New shipment
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recent.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-slate-500">
                No shipments yet.{' '}
                <Link to="/shipments/new" className="font-medium text-amber-700">
                  Create one
                </Link>
              </li>
            ) : (
              recent.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/shipments/${s.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium text-slate-900">
                        {s.trackingNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.origin.city} → {s.destination.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {shipmentStatusLabel(s.status)}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">
                        Est. {formatDateShort(s.estimatedDelivery)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Billing snapshot</h2>
            <p className="mt-1 text-xs text-slate-500">What’s open right now</p>
          </div>
          <div className="space-y-4 px-5 py-4">
            {unpaid.length === 0 ? (
              <p className="text-sm text-slate-600">No outstanding invoices.</p>
            ) : (
              unpaid.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{inv.number}</p>
                    <p className="text-xs text-slate-500">Due {formatDateShort(inv.dueAt)}</p>
                  </div>
                  <p className="font-medium tabular-nums text-slate-900">
                    {formatMoney(inv.total, inv.currency)}
                  </p>
                </div>
              ))
            )}
            <Link
              to="/invoices"
              className="inline-block text-sm font-medium text-amber-700 hover:underline"
            >
              View all invoices →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
