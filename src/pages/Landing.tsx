import { Link, Navigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

const WHY = [
  { t: 'Gets there faster', d: 'US → Jamaica lanes built for real delivery dates — not vague “maybe next week.”' },
  { t: 'Fees that make sense', d: 'Straightforward pricing so you’re not surprised at checkout.' },
  { t: 'Easy to use', d: 'Track, pay, and get alerts in one calm, simple place.' },
] as const

const EXTRAS = [
  'See every step from pickup to your door',
  'Heads-up alerts so you’re never left guessing',
  'Invoices & payments without the headache',
] as const

export function Landing() {
  const { user } = useAppState()

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1222] via-[#121a2e] to-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-xl font-bold text-slate-900">
              J
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Jasmine Global Logistics</h1>
              <p className="text-sm text-slate-400">Shipping from the US to Jamaica</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/track"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Track a package
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-medium text-amber-400/95">US → Jamaica</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Shipping that feels simple — fast routes, fair prices, zero drama.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Running a shop, sending a care package, or restocking? We’ve got you. Less chasing, more
              peace of mind.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm hover:bg-white/10"
              >
                I already have one
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-white">Why people pick us</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              {WHY.map((item) => (
                <li key={item.t}>
                  <p className="font-medium text-white">{item.t}</p>
                  <p className="mt-0.5 leading-relaxed">{item.d}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-100">
              Try the demo: <code className="text-amber-300">demo@jasmine.global</code> ·{' '}
              <code className="text-amber-300">demo123</code>
            </p>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { h: 'Your lane', s: 'US ↔ Jamaica' },
            { h: 'Need it soon?', s: 'Express options' },
            { h: 'Fair pricing', s: 'No mystery fees' },
          ].map((row) => (
            <div
              key={row.h}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur"
            >
              <p className="text-xs font-medium text-amber-400/95">{row.h}</p>
              <p className="mt-1 text-lg font-semibold text-white">{row.s}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">Nice little extras</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {EXTRAS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-amber-400">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm text-slate-400">Ready when you are.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Let’s go
            </Link>
            <Link to="/track" className="rounded-lg border border-white/20 px-5 py-2.5 text-sm hover:bg-white/10">
              Track something
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
