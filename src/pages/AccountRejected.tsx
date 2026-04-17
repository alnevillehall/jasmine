import { Navigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

export function AccountRejected() {
  const { user, logout } = useAppState()

  if (!user) return <Navigate to="/login" replace />
  if (user.accountStatus !== 'rejected') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">We couldn’t approve this account</h1>
        {user.rejectionReason ? (
          <p className="mt-3 text-sm text-slate-600">{user.rejectionReason}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Please reach out so we can help fix any issues with your verification.
          </p>
        )}
        <p className="mt-4 text-sm text-slate-600">
          Email us:{' '}
          <a href="mailto:care@jasmine.global" className="font-semibold text-amber-800 hover:underline">
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
