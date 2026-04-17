import { Navigate, Outlet } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

/** Full app (shipments, billing, etc.) — only for approved accounts. */
export function ApprovedRoute() {
  const { user } = useAppState()
  if (!user) return <Navigate to="/login" replace />

  if (user.accountStatus === 'pending_id') {
    return <Navigate to="/onboarding/id" replace />
  }
  if (user.accountStatus === 'pending_review') {
    return <Navigate to="/pending-approval" replace />
  }
  if (user.accountStatus === 'rejected') {
    return <Navigate to="/account-rejected" replace />
  }
  return <Outlet />
}
