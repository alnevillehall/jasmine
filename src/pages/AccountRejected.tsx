import { Navigate } from 'react-router-dom'
import { JasmineLogo } from '../components/JasmineLogo'
import { useAppState } from '../contexts/AppStateContext'

export function AccountRejected() {
  const { user, logout } = useAppState()

  if (!user) return <Navigate to="/login" replace />
  if (user.accountStatus !== 'rejected') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-violet-100/80 via-rose-50 to-teal-50 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-3xl border border-red-100/80 bg-white/95 p-8 text-center shadow-2xl shadow-rose-200/40 backdrop-blur-md">
        <div className="mb-5 flex justify-center">
          <JasmineLogo variant="full" theme="dark" className="h-10 w-auto opacity-90" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">We couldn’t approve this account</h1>
        {user.rejectionReason ? (
          <p className="mt-3 text-sm text-slate-600">{user.rejectionReason}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Please reach out so we can help fix any issues with your verification.
          </p>
        )}
        <p className="mt-4 text-sm text-slate-600">
          Email us:{' '}
          <a href="mailto:care@jasmine.global" className="font-semibold text-rose-600 hover:text-rose-700 hover:underline">
            care@jasmine.global
          </a>
        </p>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-8 block w-full text-sm text-slate-500 hover:text-slate-800"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
