import { Navigate, Route, Routes } from 'react-router-dom'
import { ApprovedRoute } from './components/ApprovedRoute'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Alerts } from './pages/Alerts'
import { Dashboard } from './pages/Dashboard'
import { InvoiceDetail } from './pages/InvoiceDetail'
import { Invoices } from './pages/Invoices'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { NewShipment } from './pages/NewShipment'
import { Payments } from './pages/Payments'
import { Profile } from './pages/Profile'
import { PublicTracking } from './pages/PublicTracking'
import { Register } from './pages/Register'
import { ShipmentDetail } from './pages/ShipmentDetail'
import { Shipments } from './pages/Shipments'
import { Support } from './pages/Support'
import { IdVerification } from './pages/IdVerification'
import { PendingApproval } from './pages/PendingApproval'
import { AccountRejected } from './pages/AccountRejected'
import { Tutorial } from './pages/Tutorial'
import { IncomingPackages } from './pages/IncomingPackages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/track" element={<PublicTracking />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding/id" element={<IdVerification />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/account-rejected" element={<AccountRejected />} />
        <Route element={<ApprovedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/shipments/new" element={<NewShipment />} />
            <Route path="/shipments/:id" element={<ShipmentDetail />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/incoming" element={<IncomingPackages />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
