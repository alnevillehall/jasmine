import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { JasmineLogo } from '../components/JasmineLogo'
import { useAppState } from '../contexts/AppStateContext'
import { demoCredentials } from '../lib/seed'

export function Login() {
  const { login, user } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to={from} replace />

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = login(email.trim(), password)
    if (!res.ok) {
      setError(res.error ?? 'Could not sign in.')
      return
    }
    navigate(from, { replace: true })
  }

  function fillDemo() {
    setEmail(demoCredentials.email)
    setPassword(demoCredentials.password)
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-gradient-to-br from-violet-100/80 via-rose-50 to-teal-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-violet-200/50 backdrop-blur-md sm:p-8">
        <div className="mb-6 flex justify-center">
          <JasmineLogo variant="full" theme="dark" className="h-12 w-auto sm:h-14" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hi again</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to see your shipments and bills.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 min-h-[48px] w-full rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 min-h-[48px] w-full rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200/60"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-[#141028] to-[#4c1d95] py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:brightness-110 active:scale-[0.99]"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-2xl border border-violet-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50"
          >
            Use demo credentials
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
