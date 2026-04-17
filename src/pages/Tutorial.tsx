import { Link, useSearchParams } from 'react-router-dom'
import { JasmineLogo } from '../components/JasmineLogo'
import { useAppState } from '../contexts/AppStateContext'
import { WarehouseAddressCard } from '../components/WarehouseAddressCard'

const STEPS = [
  {
    title: '1 · Your Florida address',
    body:
      'After you’re approved, copy your personal warehouse address. Use it as the shipping address when you shop online in the US — that’s how we match boxes to you.',
  },
  {
    title: '2 · Tell us what’s coming',
    body:
      'Optional but helpful: submit an incoming package with your order details and a receipt or invoice. It speeds up receiving and naming your freight.',
  },
  {
    title: '3 · Track & pay',
    body:
      'Shipments, invoices, and alerts live in your dashboard. Track anytime — even share-friendly links without login.',
  },
] as const

export function Tutorial() {
  const { user, markTutorialComplete } = useAppState()
  const [params] = useSearchParams()
  const welcome = params.get('welcome') === '1'

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <JasmineLogo variant="full" theme="dark" className="h-10 w-auto" />
          <h1 className="text-2xl font-semibold text-slate-900">How it works</h1>
        </div>
        <p className="mt-3 text-slate-600">
          Quick walkthrough — come back here anytime from the menu.
        </p>
        {welcome ? (
          <p className="mt-3 rounded-2xl border border-rose-100/80 bg-gradient-to-r from-rose-50 to-teal-50 px-4 py-2.5 text-sm text-slate-800">
            You’re in — here’s the short version.
          </p>
        ) : null}
      </div>

      <WarehouseAddressCard fullName={user.fullName} suiteCode={user.suiteCode} />

      <ol className="space-y-6">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-2xl border border-violet-100/80 bg-white/90 p-5 shadow-md shadow-violet-100/40"
          >
            <h2 className="font-semibold text-slate-900">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/incoming"
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-105 active:scale-[0.99]"
        >
          Log an incoming package
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-violet-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/50"
        >
          Go to dashboard
        </Link>
        <button
          type="button"
          onClick={() => markTutorialComplete()}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Mark walkthrough complete
        </button>
      </div>
    </div>
  )
}
