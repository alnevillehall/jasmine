import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BloomLogo } from '../components/BloomLogo'
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
    <div className="min-h-screen min-h-[100dvh] bg-[#faf8fc]">
      <header className="border-b border-white/10 bg-gradient-to-br from-[#141028] via-[#1c1538] to-[#12102a] text-white shadow-lg shadow-violet-950/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 safe-px">
          <Link
            to="/"
            className="flex min-h-[44px] items-center"
            aria-label="Home"
          >
            <BloomLogo variant="compact" theme="light" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/track"
              className="rounded-2xl px-3 py-2 text-sm font-medium text-violet-100/90 hover:bg-white/10"
            >
              Track
            </Link>
            <Link
              to="/login"
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 safe-px">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Where’s my box?
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Pop in your tracking number — no account needed.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. BLM…"
            className="min-h-[48px] flex-1 rounded-2xl border border-violet-200 bg-white px-4 py-3 font-mono text-base shadow-sm outline-none ring-rose-400/20 transition focus:border-rose-300 focus:ring-2 sm:text-lg"
          />
          <button
            type="submit"
            className="min-h-[48px] rounded-2xl bg-gradient-to-r from-[#141028] to-[#2d2650] px-8 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110 active:scale-[0.98] sm:min-w-[120px]"
          >
            Track
          </button>
        </form>

        {!normalized ? (
          <p className="text-center text-sm text-slate-500">Add a number above to see updates.</p>
        ) : !shipment ? (
          <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-amber-50/50 px-5 py-8 text-center shadow-sm sm:px-8">
            <p className="font-semibold text-rose-900">Hmm — we can’t find that number.</p>
            <p className="mt-2 text-sm text-slate-700">
              Double-check the code, or sign in to see packages on your account.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg shadow-violet-200/40">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/80 to-teal-50/50 px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tracking number
              </p>
              <p className="font-mono text-xl font-semibold text-slate-900">{shipment.trackingNumber}</p>
              <p className="mt-2 text-sm text-slate-600">
                {shipment.origin.city}, {shipment.origin.country} → {shipment.destination.city},{' '}
                {shipment.destination.country}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                {shipmentStatusLabel(shipment.status)}
              </p>
            </div>
            <ol className="divide-y divide-violet-100 px-5 py-2 sm:px-6">
              {events.map((ev) => (
                <li key={ev.id} className="py-4 first:pt-3">
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
