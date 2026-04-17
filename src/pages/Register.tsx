import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Ship US → Jamaica with us — it only takes a minute.</p>

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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500/40 focus:ring-2"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500/40 focus:ring-2"
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
            required
            minLength={6}
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
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-amber-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
