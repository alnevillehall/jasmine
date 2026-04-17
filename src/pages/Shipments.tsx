import { Link } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDateShort, shipmentStatusLabel } from '../lib/format'

export function Shipments() {
  const { user, state } = useAppState()
  if (!user) return null

  const list = state.shipments
    .filter((s) => s.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Shipments</h1>
          <p className="mt-1 text-slate-600">Everything you’ve sent — from the US to Jamaica.</p>
        </div>
        <Link
          to="/shipments/new"
          className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
        >
          Create shipment
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Tracking</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Load</th>
              <th className="px-4 py-3 font-medium">Est. delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  No shipments yet.{' '}
                  <Link to="/shipments/new" className="font-medium text-amber-700">
                    Create your first
                  </Link>
                </td>
              </tr>
            ) : (
              list.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/shipments/${s.id}`}
                      className="font-mono font-medium text-amber-800 hover:underline"
                    >
                      {s.trackingNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {s.origin.city} → {s.destination.city}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{s.service}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {s.carePackage ? (
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800">
                          Care
                        </span>
                      ) : null}
                      {s.overseasPackaging === 'box' ? (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                          Box
                        </span>
                      ) : null}
                      {s.overseasPackaging === 'barrel' ? (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                          Barrel
                        </span>
                      ) : null}
                      {!s.carePackage && !s.overseasPackaging ? (
                        <span className="text-slate-400">—</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                      {shipmentStatusLabel(s.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDateShort(s.estimatedDelivery)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
