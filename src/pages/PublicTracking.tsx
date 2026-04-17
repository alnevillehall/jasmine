import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { formatDate, shipmentStatusLabel } from '../lib/format'

export function PublicTracking() {
  const [params] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)
  const { state } = useAppState()

  const normalized = query.trim().toUpperCase().replace(/\s+/g, '')

  const shipment = useMemo(() => {
    if (!normalized) return null
    return (
      state.shipments.find(
        (s) => s.trackingNumber.toUpperCase().replace(/\s+/g, '') === normalized,
      ) ?? null
    )
  }, [state.shipments, normalized])

  const events = shipment
    ? [...shipment.events].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
      )
    : []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-[#0c1222] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 font-bold text-slate-900">
              J
            </span>
            <span className="leading-tight">
              <span className="block">Jasmine Global</span>
              <span className="text-xs font-normal text-slate-400">US → Jamaica</span>
            </span>
          </Link>
          <div className="flex gap-3 text-sm">
            <Link to="/track" className="text-slate-300 hover:text-white">
              Track
            </Link>
            <Link to="/login" className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Where’s my box?</h1>
        <p className="mt-2 text-slate-600">
          Pop in your tracking number — no account needed.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. JGL…"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono text-lg outline-none ring-amber-500/30 focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#0c1222] px-6 py-3 font-semibold text-white hover:bg-[#161f36]"
        >
          Track
        </button>
      </form>

      {!normalized ? (
        <p className="text-center text-sm text-slate-500">Add a number above to see updates.</p>
      ) : !shipment ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <p className="font-medium text-amber-900">Hmm — we can’t find that number.</p>
          <p className="mt-2 text-sm text-amber-800">
            Double-check the code, or sign in to see packages on your account.
          </p>
          <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-amber-900 underline">
            Sign in
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <p className="text-xs font-medium uppercase text-slate-500">Tracking number</p>
            <p className="font-mono text-xl font-semibold text-slate-900">{shipment.trackingNumber}</p>
            <p className="mt-2 text-sm text-slate-600">
              {shipment.origin.city}, {shipment.origin.country} → {shipment.destination.city},{' '}
              {shipment.destination.country}
            </p>
            <p className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-800 ring-1 ring-slate-200">
              {shipmentStatusLabel(shipment.status)}
            </p>
          </div>
          <ol className="divide-y divide-slate-100 px-6 py-4">
            {events.map((ev) => (
              <li key={ev.id} className="py-4 first:pt-0">
                <p className="font-medium text-slate-900">{ev.description}</p>
                <p className="text-sm text-slate-500">{ev.location}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(ev.at)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      </div>
    </div>
  )
}
