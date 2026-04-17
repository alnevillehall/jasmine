import { Navigate, useNavigate } from 'react-router-dom'
import { BloomLogo } from '../components/BloomLogo'
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
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-violet-100/80 via-rose-50 to-teal-50 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/60 bg-white/90 p-6 text-center shadow-2xl shadow-violet-200/50 backdrop-blur-md sm:p-10">
        <div className="mb-6 flex justify-center">
          <BloomLogo variant="full" theme="dark" className="h-12 w-auto sm:h-14" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">We’re reviewing your ID</h1>
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

        <div className="mt-8 rounded-2xl border border-dashed border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-teal-50/80 p-4 text-left text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Trying the prototype?</p>
          <p className="mt-1 text-slate-700">
            In production, staff approves accounts. Here you can simulate approval to explore the app.
          </p>
          <button
            type="button"
            onClick={onDemoApprove}
            className="mt-4 min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-rose-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-105 active:scale-[0.99]"
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
          className="mt-8 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
