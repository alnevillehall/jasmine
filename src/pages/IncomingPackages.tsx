import { useState } from 'react'
import { useAppState } from '../contexts/AppStateContext'
import { WarehouseAddressCard } from '../components/WarehouseAddressCard'
import { formatDate } from '../lib/format'

export function IncomingPackages() {
  const { user, state, addIncomingPackageNotice } = useAppState()
  const [storeName, setStoreName] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [carrierTracking, setCarrierTracking] = useState('')
  const [itemsDescription, setItemsDescription] = useState('')
  const [invoiceFileName, setInvoiceFileName] = useState('')
  const [sent, setSent] = useState(false)

  if (!user) return null

  const rows = state.incomingPackages
    .filter((p) => p.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    addIncomingPackageNotice({
      storeName: storeName.trim(),
      orderNumber: orderNumber.trim() || undefined,
      carrierTracking: carrierTracking.trim() || undefined,
      itemsDescription: itemsDescription.trim(),
      invoiceFileName: invoiceFileName.trim() || undefined,
    })
    setStoreName('')
    setOrderNumber('')
    setCarrierTracking('')
    setItemsDescription('')
    setInvoiceFileName('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Incoming to warehouse</h1>
        <p className="mt-1 text-slate-600">
          Bought something online? Tell us what’s on the way — invoice or receipt helps us speed things
          up.
        </p>
      </div>

      <WarehouseAddressCard fullName={user.fullName} suiteCode={user.suiteCode} />

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          New heads-up
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="store">
              Store / website
            </label>
            <input
              id="store"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="e.g. Amazon, Target"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="order">
              Order # <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="order"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="track">
              Carrier tracking <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="track"
              value={carrierTracking}
              onChange={(e) => setCarrierTracking(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="UPS, FedEx, USPS…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="items">
              What’s inside
            </label>
            <textarea
              id="items"
              required
              rows={3}
              value={itemsDescription}
              onChange={(e) => setItemsDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Sizes, colors, quantities…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="inv">
              Invoice or receipt (file)
            </label>
            <input
              id="inv"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setInvoiceFileName(f ? f.name : '')
              }}
              className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5"
            />
            <p className="mt-1 text-xs text-slate-500">Demo stores the file name only.</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
          >
            Send heads-up
          </button>
          {sent ? <span className="text-sm text-emerald-600">Got it — thanks!</span> : null}
        </div>
      </form>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your recent heads-ups
        </h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nothing logged yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id} className="px-4 py-3 text-sm">
                <p className="font-medium text-slate-900">{r.storeName}</p>
                <p className="text-slate-600">{r.itemsDescription}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(r.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
