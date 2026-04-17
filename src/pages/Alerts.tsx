import { Link } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDate } from '../lib/format'

const TYPE_LABEL: Record<string, string> = {
  status_change: 'Shipment',
  delivery: 'Delivery',
  exception: 'Exception',
  invoice: 'Billing',
  system: 'System',
}

export function Alerts() {
  const { user, state, markAlertRead, markAllAlertsRead } = useAppState()
  if (!user) return null

  const alerts = state.alerts
    .filter((a) => a.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your updates</h1>
          <p className="mt-1 text-slate-600">Heads-ups on packages and bills — no fluff.</p>
        </div>
        {alerts.some((a) => !a.read) ? (
          <button
            type="button"
            onClick={() => markAllAlertsRead()}
            className="text-sm font-medium text-amber-700 hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      <ul className="space-y-3">
        {alerts.length === 0 ? (
          <li className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            All quiet — start a shipment or pay a bill and updates will show up here.
          </li>
        ) : (
          alerts.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border p-5 shadow-sm transition ${
                a.read
                  ? 'border-slate-200 bg-white'
                  : 'border-amber-200 bg-amber-50/50'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {TYPE_LABEL[a.type] ?? a.type}
                  </span>
                  <h2 className="mt-1 font-semibold text-slate-900">{a.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{a.body}</p>
                  <p className="mt-3 text-xs text-slate-400">{formatDate(a.createdAt)}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {a.shipmentId ? (
                      <Link
                        to={`/shipments/${a.shipmentId}`}
                        className="font-medium text-amber-800 hover:underline"
                      >
                        View shipment
                      </Link>
                    ) : null}
                    {a.invoiceId ? (
                      <Link
                        to={`/invoices/${a.invoiceId}`}
                        className="font-medium text-amber-800 hover:underline"
                      >
                        View invoice
                      </Link>
                    ) : null}
                  </div>
                </div>
                {!a.read ? (
                  <button
                    type="button"
                    onClick={() => markAlertRead(a.id)}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
