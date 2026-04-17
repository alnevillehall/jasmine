import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/incoming', label: 'Incoming' },
  { to: '/shipments', label: 'Shipments' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/payments', label: 'Payments' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/tutorial', label: 'How it works' },
  { to: '/profile', label: 'Profile' },
  { to: '/support', label: 'Support' },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-white/15 text-white'
      : 'text-slate-300 hover:bg-white/10 hover:text-white',
  ].join(' ')
}

export function Layout() {
  const { user, logout, state } = useAppState()
  const navigate = useNavigate()
  const unread = user
    ? state.alerts.filter((a) => a.userId === user.id && !a.read).length
    : 0

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0c1222] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-bold text-slate-900 shadow">
              J
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                Jasmine Global
              </span>
              <span className="text-xs text-slate-400">US → Jamaica · Simple &amp; fair</span>
            </span>
          </button>

          <nav className="hidden flex-wrap items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                end={item.to === '/dashboard' || item.to === '/tutorial'}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.to === '/alerts' && unread > 0 ? (
                    <span className="rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-slate-900">
                      {unread}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="hidden rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 sm:inline"
            >
              Track shipment
            </button>
            <div className="hidden text-right text-xs sm:block">
              <div className="font-medium text-white">{user?.fullName}</div>
              <div className="text-slate-400">{user?.company ?? user?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 border-t border-white/10 px-4 py-2 md:hidden">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
              {item.to === '/alerts' && unread > 0 ? ` (${unread})` : ''}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p className="font-medium text-slate-700">Jasmine Global Logistics</p>
        <p className="mt-1 max-w-md mx-auto text-slate-600">
          We help you ship from the US to Jamaica — clearly, kindly, and without the fuss.
        </p>
        <p className="mt-3 text-xs text-slate-400">Preview: your data stays in this browser for now.</p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} Jasmine Global Logistics. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
