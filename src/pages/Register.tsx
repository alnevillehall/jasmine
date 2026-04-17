import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { JasmineLogo } from '../components/JasmineLogo'
import { useAppState } from '../contexts/AppStateContext'

export function Register() {
  const { register, user } = useAppState()

  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    if (user.accountStatus === 'pending_id') {
      return <Navigate to="/onboarding/id" replace />
    }
    if (user.accountStatus === 'pending_review') {
      return <Navigate to="/pending-approval" replace />
    }
    if (user.accountStatus === 'rejected') {
      return <Navigate to="/account-rejected" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = register({ email, password, fullName, company: company || undefined })
    if (!res.ok) {
      setError(res.error ?? 'Could not register.')
      return
    }
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-gradient-to-br from-violet-100/80 via-rose-50 to-teal-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-violet-200/50 backdrop-blur-md sm:p-8">
        <div className="mb-6 flex justify-center">
          <JasmineLogo variant="full" theme="dark" className="h-12 w-auto sm:h-14" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Ship US → Jamaica with us — it only takes a minute.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 min-h-[48px] w-full rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="company">
              Company <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 min-h-[48px] w-full rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
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
              required
              minLength={6}
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
            className="min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-rose-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-105 active:scale-[0.99]"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
