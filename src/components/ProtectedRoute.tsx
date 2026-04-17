import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

export function ProtectedRoute() {
  const { user } = useAppState()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
