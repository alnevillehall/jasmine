import { Link, Navigate } from 'react-router-dom'
import { BloomLogo } from '../components/BloomLogo'
import { useAppState } from '../contexts/AppStateContext'

const WHY = [
  { t: 'Gets there faster', d: 'Lanes built for real delivery dates — not vague “maybe next week.”' },
  { t: 'Fees that make sense', d: 'Straightforward pricing so you’re not surprised at checkout.' },
  { t: 'Easy to use', d: 'Track, pay, and get alerts in one calm, simple place.' },
] as const

const EXTRAS = [
  'See every step from pickup to your door',
  'Heads-up alerts so you’re never left guessing',
  'Invoices & payments without the headache',
  'Box & barrel lists plus care packages for overseas family',
] as const

export function Landing() {
  const { user } = useAppState()

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-gradient-to-b from-[#100818] via-[#1a1035] to-[#0c1a28] text-white">
      {/* Soft ambient glow — modern, warm */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl sm:top-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 safe-px">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex max-w-[min(100%,280px)] shrink-0"
            aria-label="Bloom Shipping home"
          >
            <BloomLogo variant="full" theme="light" className="h-[52px] w-auto sm:h-[60px]" />
          </Link>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <Link
              to="/track"
              className="min-h-[44px] rounded-2xl border border-white/20 px-5 py-2.5 text-center text-sm font-medium text-violet-100 transition hover:bg-white/10 active:scale-[0.98]"
            >
              Track a package
            </Link>
            <Link
              to="/login"
              className="min-h-[44px] rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:brightness-105 active:scale-[0.98]"
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300/90">
              US → Jamaica
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-white">
              Shipping that feels simple — fast routes, fair prices, zero drama.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-violet-100/85 sm:text-lg">
              Running a shop, sending a care package, or restocking? We’ve got you. Less chasing, more
              peace of mind.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20 transition hover:bg-violet-50 active:scale-[0.98]"
              >
                Create an account
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98]"
              >
                I already have one
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-violet-950/40 backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Why people pick us</h2>
            <ul className="mt-5 space-y-5 text-sm text-violet-100/90">
              {WHY.map((item) => (
                <li key={item.t} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                  <p className="font-semibold text-white">{item.t}</p>
                  <p className="mt-1.5 leading-relaxed">{item.d}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-rose-100/90">
              Try the demo:{' '}
              <code className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-amber-200">
                demo@bloomshipping.demo
              </code>{' '}
              ·{' '}
              <code className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-amber-200">
                demo123
              </code>
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {[
            { h: 'Your lane', s: 'US ↔ Jamaica' },
            { h: 'Need it soon?', s: 'Express options' },
            { h: 'Fair pricing', s: 'No mystery fees' },
          ].map((row) => (
            <div
              key={row.h}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-5 text-center backdrop-blur-md transition hover:bg-white/[0.1] sm:py-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300/90">{row.h}</p>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{row.s}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-md sm:p-8">
          <h2 className="text-lg font-semibold text-white">Nice little extras</h2>
          <ul className="mt-4 space-y-3 text-sm text-violet-100/90">
            {EXTRAS.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-300 text-xs font-bold text-slate-900">
                  ✓
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm text-violet-200/80">Ready when you are.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition hover:brightness-105 active:scale-[0.98]"
            >
              Let’s go
            </Link>
            <Link
              to="/track"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              Track something
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
