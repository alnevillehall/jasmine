import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
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
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Hi again</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to see your shipments and bills.</p>

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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500/40 focus:ring-2"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500/40 focus:ring-2"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-[#0c1222] py-2.5 text-sm font-semibold text-white hover:bg-[#161f36]"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={fillDemo}
          className="w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Use demo credentials
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{' '}
        <Link to="/register" className="font-medium text-amber-700 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
