import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BloomLogo } from './BloomLogo'
import { COMPANY_LEGAL_NAME } from '../lib/brand'
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
    'shrink-0 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/20'
      : 'text-violet-100/90 hover:bg-white/10 hover:text-white active:scale-[0.98]',
  ].join(' ')
}

export function Layout() {
  const { user, logout, state } = useAppState()
  const navigate = useNavigate()
  const unread = user
    ? state.alerts.filter((a) => a.userId === user.id && !a.read).length
    : 0

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-[#faf8fc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-br from-[#141028] via-[#1c1538] to-[#12102a] text-white shadow-lg shadow-violet-950/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8 safe-px">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex min-h-[44px] min-w-[44px] items-center justify-start sm:min-w-0"
            aria-label="Home"
          >
            <BloomLogo variant="compact" theme="light" className="h-9 w-auto sm:h-10" />
          </button>

          <nav className="scrollbar-hide hidden max-w-[min(100vw-12rem,52rem)] items-center gap-1 overflow-x-auto md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                end={item.to === '/dashboard' || item.to === '/tutorial'}
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  {item.label}
                  {item.to === '/alerts' && unread > 0 ? (
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-rose-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
                      {unread}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="hidden min-h-[40px] rounded-2xl border border-white/20 px-3 py-2 text-sm text-violet-100 transition hover:bg-white/10 sm:inline-flex sm:items-center"
            >
              Track
            </button>
            <div className="hidden max-w-[140px] text-right text-xs leading-tight sm:block sm:max-w-[200px]">
              <div className="truncate font-medium text-white">{user?.fullName}</div>
              <div className="truncate text-violet-200/70">{user?.company ?? user?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="min-h-[40px] rounded-2xl bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20 active:scale-[0.98]"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="scrollbar-hide flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2.5 md:hidden safe-px safe-pb">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span className="whitespace-nowrap">
                {item.label}
                {item.to === '/alerts' && unread > 0 ? ` (${unread})` : ''}
              </span>
            </NavLink>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 safe-px">
        <Outlet />
      </main>

      <footer className="border-t border-violet-100 bg-gradient-to-b from-white to-violet-50/50 py-10 text-center text-sm text-slate-600">
        <div className="flex justify-center px-4">
          <BloomLogo variant="full" theme="dark" className="h-10 w-auto sm:h-11" />
        </div>
        <p className="mx-auto mt-4 max-w-md px-4 text-slate-600">
          US → Jamaica — clear, simple, and without the fuss.
        </p>
        {!import.meta.env.PROD ? (
          <p className="mt-4 text-xs text-slate-400">
            Development: your data stays in this browser until you connect a backend.
          </p>
        ) : null}
        <p className="mt-2 text-xs text-slate-400">
          © {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
