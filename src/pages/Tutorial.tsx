import { Link, useSearchParams } from 'react-router-dom'
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
        <h1 className="text-2xl font-semibold text-slate-900">How Jasmine works</h1>
        <p className="mt-1 text-slate-600">
          Quick walkthrough — come back here anytime from the menu.
        </p>
        {welcome ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
            You’re in — here’s the short version.
          </p>
        ) : null}
      </div>

      <WarehouseAddressCard fullName={user.fullName} suiteCode={user.suiteCode} />

      <ol className="space-y-6">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/incoming"
          className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
        >
          Log an incoming package
        </Link>
        <Link
          to="/dashboard"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Go to dashboard
        </Link>
        <button
          type="button"
          onClick={() => markTutorialComplete()}
          className="text-sm font-medium text-amber-800 hover:underline"
        >
          Mark walkthrough complete
        </button>
      </div>
    </div>
  )
}
