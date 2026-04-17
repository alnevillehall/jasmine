import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import { CONTENT_CATEGORY_OPTIONS } from '../lib/contentCategories'
import type {
  Address,
  Contact,
  ContentCategory,
  OverseasPackaging,
  Shipment,
} from '../lib/types'

function emptyAddress(): Address {
  return { line1: '', city: '', postalCode: '', country: '' }
}

function emptyCategoryNotes(): Record<ContentCategory, string> {
  return {
    grocery: '',
    household: '',
    construction: '',
    clothing: '',
    decor: '',
    vacation: '',
    event: '',
    other: '',
  }
}

export function NewShipment() {
  const { user, createShipment } = useAppState()
  const navigate = useNavigate()

  const [service, setService] = useState<Shipment['service']>('express')
  const [weightKg, setWeightKg] = useState('10')
  const [reference, setReference] = useState('')

  const [overseasChoice, setOverseasChoice] = useState<'none' | OverseasPackaging>('none')
  const [carePackage, setCarePackage] = useState(false)
  const [categoryNotes, setCategoryNotes] = useState(emptyCategoryNotes())

  const [origin, setOrigin] = useState<Address>(emptyAddress())
  const [destination, setDestination] = useState<Address>(emptyAddress())
  const [recipient, setRecipient] = useState<Contact>({ name: '', email: '', phone: '' })

  if (!user) return null

  function patchOrigin(p: Partial<Address>) {
    setOrigin((o) => ({ ...o, ...p }))
  }
  function patchDest(p: Partial<Address>) {
    setDestination((d) => ({ ...d, ...p }))
  }

  function patchCategoryNote(id: ContentCategory, value: string) {
    setCategoryNotes((prev) => ({ ...prev, [id]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const w = Number(weightKg)
    if (Number.isNaN(w) || w <= 0) return

    const est = new Date()
    est.setDate(est.getDate() + (service === 'express' ? 3 : service === 'standard' ? 7 : 14))

    const shipper: Contact = {
      name: user.fullName,
      company: user.company,
      email: user.email,
    }

    const contentNotesByCategory = Object.fromEntries(
      (Object.entries(categoryNotes) as [ContentCategory, string][]).filter(
        ([, text]) => text.trim().length > 0,
      ),
    ) as Partial<Record<ContentCategory, string>>

    const shipment = createShipment({
      service,
      status: 'label_created',
      origin,
      destination,
      shipper,
      recipient: {
        name: recipient.name,
        email: recipient.email || undefined,
        phone: recipient.phone || undefined,
      },
      weightKg: w,
      reference: reference.trim() || undefined,
      estimatedDelivery: est.toISOString(),
      overseasPackaging: overseasChoice === 'none' ? undefined : overseasChoice,
      carePackage: carePackage || undefined,
      contentNotesByCategory:
        Object.keys(contentNotesByCategory).length > 0 ? contentNotesByCategory : undefined,
    })

    navigate(`/shipments/${shipment.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link to="/shipments" className="text-sm font-medium text-amber-700 hover:underline">
          ← Back to shipments
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Create shipment</h1>
        <p className="mt-1 text-slate-600">
          Tell us where it’s going — add a box or barrel list and care-package details if this load is
          for family overseas.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Service
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(
              [
                ['express', 'Express'],
                ['standard', 'Standard'],
                ['freight', 'Freight'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border px-4 py-3 text-sm ${
                  service === value
                    ? 'border-amber-500 bg-amber-50 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  className="sr-only"
                  checked={service === value}
                  onChange={() => setService(value)}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="weight">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0.1"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="mt-1 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="ref">
              Reference <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="PO number, order ID…"
            />
          </div>
        </section>

        <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-amber-50/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Box, barrel &amp; care packages
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Building a consolidated <strong>box</strong> or <strong>barrel</strong> for overseas? List
            what you want below. Tick <strong>care package</strong> when you’re sending essentials or
            gifts for family.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <input
                type="checkbox"
                checked={carePackage}
                onChange={(e) => setCarePackage(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium text-slate-800">Care package</span>
            </label>
          </div>

          <fieldset className="mt-4">
            <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Overseas packaging
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ['none', 'Regular parcel', 'No dedicated box/barrel list'],
                  ['box', 'Box', 'Consolidated carton'],
                  ['barrel', 'Barrel', 'Steel / plastic drum load'],
                ] as const
              ).map(([value, title, sub]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-lg border px-3 py-3 text-sm ${
                    overseasChoice === value
                      ? 'border-amber-500 bg-white ring-1 ring-amber-200'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="overseas"
                    className="sr-only"
                    checked={overseasChoice === value}
                    onChange={() => setOverseasChoice(value)}
                  />
                  <span className="font-medium text-slate-900">{title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{sub}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              List items by category
            </p>
            {CONTENT_CATEGORY_OPTIONS.map((cat) => (
              <div key={cat.id}>
                <label className="block text-sm font-medium text-slate-700" htmlFor={`cat-${cat.id}`}>
                  {cat.label}
                </label>
                <p className="text-xs text-slate-400">{cat.hint}</p>
                <textarea
                  id={`cat-${cat.id}`}
                  rows={2}
                  value={categoryNotes[cat.id]}
                  onChange={(e) => patchCategoryNote(cat.id, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Items, brands, quantities…"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Origin
            </h2>
            <div className="mt-3 space-y-3">
              <input
                required
                placeholder="Address line 1"
                value={origin.line1}
                onChange={(e) => patchOrigin({ line1: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                placeholder="Address line 2"
                value={origin.line2 ?? ''}
                onChange={(e) => patchOrigin({ line2: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="City"
                  value={origin.city}
                  onChange={(e) => patchOrigin({ city: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="State / region"
                  value={origin.state ?? ''}
                  onChange={(e) => patchOrigin({ state: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Postal code"
                  value={origin.postalCode}
                  onChange={(e) => patchOrigin({ postalCode: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  required
                  placeholder="Country"
                  value={origin.country}
                  onChange={(e) => patchOrigin({ country: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Destination
            </h2>
            <div className="mt-3 space-y-3">
              <input
                required
                placeholder="Address line 1"
                value={destination.line1}
                onChange={(e) => patchDest({ line1: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                placeholder="Address line 2"
                value={destination.line2 ?? ''}
                onChange={(e) => patchDest({ line2: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="City"
                  value={destination.city}
                  onChange={(e) => patchDest({ city: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="State / region"
                  value={destination.state ?? ''}
                  onChange={(e) => patchDest({ state: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Postal code"
                  value={destination.postalCode}
                  onChange={(e) => patchDest({ postalCode: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  required
                  placeholder="Country"
                  value={destination.country}
                  onChange={(e) => patchDest({ country: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recipient
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              required
              placeholder="Full name"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={recipient.email ?? ''}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              placeholder="Phone"
              value={recipient.phone ?? ''}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            to="/shipments"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-[#0c1222] px-5 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
          >
            Create &amp; view tracking
          </button>
        </div>
      </form>
    </div>
  )
}
