import { Link, useParams } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { contentCategoryLabel } from '../lib/contentCategories'
import { formatDate, formatDateShort, shipmentStatusLabel } from '../lib/format'
import type { ContentCategory } from '../lib/types'

export function ShipmentDetail() {
  const { id } = useParams()
  const { user, state } = useAppState()
  if (!user) return null

  const shipment = state.shipments.find((s) => s.id === id && s.userId === user.id)

  if (!shipment) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Shipment not found.</p>
        <Link to="/shipments" className="mt-4 inline-block text-amber-700 hover:underline">
          Back to list
        </Link>
      </div>
    )
  }

  const events = [...shipment.events].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )

  const categoryEntries = shipment.contentNotesByCategory
    ? (Object.entries(shipment.contentNotesByCategory) as [ContentCategory, string][]).filter(
        ([, text]) => text.trim().length > 0,
      )
    : []

  return (
    <div className="space-y-8">
      <div>
        <Link to="/shipments" className="text-sm font-medium text-amber-700 hover:underline">
          ← Shipments
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl font-semibold text-slate-900">
              {shipment.trackingNumber}
            </h1>
            <p className="mt-1 text-slate-600">
              {shipment.origin.city} → {shipment.destination.city} ·{' '}
              <span className="capitalize">{shipment.service}</span>
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
            {shipmentStatusLabel(shipment.status)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {(shipment.overseasPackaging ||
            shipment.carePackage ||
            categoryEntries.length > 0) && (
            <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">Load &amp; care details</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {shipment.carePackage ? (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-900">
                    Care package
                  </span>
                ) : null}
                {shipment.overseasPackaging ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                    {shipment.overseasPackaging === 'box' ? 'Box consolidation' : 'Barrel consolidation'}
                  </span>
                ) : null}
              </div>
              {categoryEntries.length > 0 ? (
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {categoryEntries.map(([cat, text]) => (
                    <li key={cat}>
                      <span className="font-medium text-slate-900">{contentCategoryLabel(cat)}</span>
                      <p className="mt-0.5 whitespace-pre-wrap text-slate-600">{text}</p>
                    </li>
                  ))}
                </ul>
              ) : shipment.overseasPackaging || shipment.carePackage ? (
                <p className="mt-3 text-sm text-slate-500">
                  No category list was added — contact support if you need to update this shipment.
                </p>
              ) : null}
            </section>
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">What’s happened so far</h2>
            <ol className="mt-6 space-y-6 border-l-2 border-slate-200 pl-6">
              {events.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-[1.4rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500 shadow" />
                  <p className="text-sm font-medium text-slate-900">{ev.description}</p>
                  <p className="text-xs text-slate-500">{ev.location}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(ev.at)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">When it should arrive</h3>
            <p className="mt-2 text-sm text-slate-600">
              Estimated: <strong>{formatDateShort(shipment.estimatedDelivery)}</strong>
            </p>
            {shipment.reference ? (
              <p className="mt-2 text-sm text-slate-600">
                Reference: <span className="font-mono">{shipment.reference}</span>
              </p>
            ) : null}
            <p className="mt-2 text-sm text-slate-600">
              Weight: <strong>{shipment.weightKg} kg</strong>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Who it’s for</h3>
            <p className="mt-2 text-sm text-slate-800">{shipment.recipient.name}</p>
            {shipment.recipient.company ? (
              <p className="text-sm text-slate-600">{shipment.recipient.company}</p>
            ) : null}
            {shipment.recipient.email ? (
              <p className="text-sm text-slate-600">{shipment.recipient.email}</p>
            ) : null}
            {shipment.recipient.phone ? (
              <p className="text-sm text-slate-600">{shipment.recipient.phone}</p>
            ) : null}
            <p className="mt-3 text-xs uppercase text-slate-400">Deliver to</p>
            <p className="text-sm text-slate-700">
              {shipment.destination.line1}
              {shipment.destination.line2 ? `, ${shipment.destination.line2}` : ''}
            </p>
            <p className="text-sm text-slate-700">
              {shipment.destination.city}
              {shipment.destination.state ? `, ${shipment.destination.state}` : ''}{' '}
              {shipment.destination.postalCode}
            </p>
            <p className="text-sm text-slate-700">{shipment.destination.country}</p>
          </div>
          <Link
            to={`/track?q=${encodeURIComponent(shipment.trackingNumber)}`}
            className="block rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-amber-800 hover:bg-slate-50"
          >
            Share-friendly tracking link
          </Link>
        </aside>
      </div>
    </div>
  )
}
