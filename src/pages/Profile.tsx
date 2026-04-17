import { useState } from 'react'
import { WarehouseAddressCard } from '../components/WarehouseAddressCard'
import { useAppState } from '../contexts/AppStateContext'
import type { Address } from '../lib/types'

export function Profile() {
  const { user, updateProfile } = useAppState()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [company, setCompany] = useState(user?.company ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const account = user
  const prefs = account.notificationPrefs

  function onSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({
      fullName: fullName.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function togglePref(key: keyof typeof prefs) {
    updateProfile({
      notificationPrefs: { ...prefs, [key]: !prefs[key] },
    })
  }

  function addAddress() {
    const next: Address[] = [
      ...account.savedAddresses,
      { line1: '', city: '', postalCode: '', country: '' },
    ]
    updateProfile({ savedAddresses: next })
  }

  function patchAddress(idx: number, patch: Partial<Address>) {
    const next = account.savedAddresses.map((a, i) =>
      i === idx ? { ...a, ...patch } : a,
    )
    updateProfile({ savedAddresses: next })
  }

  function removeAddress(idx: number) {
    updateProfile({
      savedAddresses: account.savedAddresses.filter((_, i) => i !== idx),
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile &amp; settings</h1>
        <p className="mt-1 text-slate-600">Your details and how we ping you — you’re in control.</p>
      </div>

      <WarehouseAddressCard fullName={account.fullName} suiteCode={account.suiteCode} />

      <form
        onSubmit={onSaveProfile}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              disabled
              value={account.email}
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
            />
            <p className="mt-1 text-xs text-slate-500">Changing email? Ask us for now.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="+1 …"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
          >
            Save profile
          </button>
          {saved ? (
            <span className="text-sm text-emerald-600">Saved.</span>
          ) : null}
        </div>
      </form>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Saved addresses
          </h2>
          <button
            type="button"
            onClick={addAddress}
            className="text-sm font-medium text-amber-700 hover:underline"
          >
            Add address
          </button>
        </div>
        <div className="mt-4 space-y-6">
          {account.savedAddresses.length === 0 ? (
            <p className="text-sm text-slate-500">No saved addresses.</p>
          ) : (
            account.savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    placeholder="Line 1"
                    value={addr.line1}
                    onChange={(e) => patchAddress(idx, { line1: e.target.value })}
                    className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
                  />
                  <input
                    placeholder="City"
                    value={addr.city}
                    onChange={(e) => patchAddress(idx, { city: e.target.value })}
                    className="rounded border border-slate-200 px-2 py-1.5 text-sm"
                  />
                  <input
                    placeholder="Postal code"
                    value={addr.postalCode}
                    onChange={(e) => patchAddress(idx, { postalCode: e.target.value })}
                    className="rounded border border-slate-200 px-2 py-1.5 text-sm"
                  />
                  <input
                    placeholder="Country"
                    value={addr.country}
                    onChange={(e) => patchAddress(idx, { country: e.target.value })}
                    className="rounded border border-slate-200 px-2 py-1.5 text-sm sm:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress(idx)}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          How we reach you
        </h2>
        <p className="mt-1 text-sm text-slate-600">Pick what you want to hear about. (Saved on this device.)</p>
        <ul className="mt-4 space-y-3">
          {(
            [
              ['emailStatus', 'Email when a shipment moves'],
              ['emailInvoice', 'Email for new or paid invoices'],
              ['smsDelivery', 'Text me on delivery day (demo only)'],
              ['pushEnabled', 'Alerts inside this app'],
            ] as const
          ).map(([key, label]) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => togglePref(key)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-800">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
