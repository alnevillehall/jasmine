import { Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

export function PendingApproval() {
  const { user, logout, simulateAccountApproval } = useAppState()
  const navigate = useNavigate()

  if (!user) return <Navigate to="/login" replace />

  if (user.accountStatus === 'approved') {
    return <Navigate to="/dashboard" replace />
  }
  if (user.accountStatus === 'pending_id') {
    return <Navigate to="/onboarding/id" replace />
  }
  if (user.accountStatus === 'rejected') {
    return <Navigate to="/account-rejected" replace />
  }

  function onDemoApprove() {
    simulateAccountApproval()
    navigate('/tutorial?welcome=1', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-semibold text-slate-900">We’re reviewing your ID</h1>
        <p className="mt-3 text-slate-600">
          Thanks — we have your documents. Our team will approve your account as soon as everything
          checks out. You’ll use your suite code{' '}
          <span className="font-mono font-semibold text-slate-900">{user.suiteCode}</span> on your
          Florida address once you’re in.
        </p>
        {user.idVerification ? (
          <p className="mt-4 text-xs text-slate-500">
            Submitted {new Date(user.idVerification.submittedAt).toLocaleString()} ·{' '}
            {user.idVerification.fileName}
          </p>
        ) : null}

        <div className="mt-8 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-950">
          <p className="font-medium">Trying the prototype?</p>
          <p className="mt-1 text-amber-900/90">
            In production, staff approves accounts. Here you can simulate approval to explore the app.
          </p>
          <button
            type="button"
            onClick={onDemoApprove}
            className="mt-3 w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-500"
          >
            Simulate approval (demo)
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="mt-8 text-sm text-slate-500 hover:text-slate-800"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
