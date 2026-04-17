import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppState } from '../contexts/AppStateContext'
import type { IdDocumentType } from '../lib/types'

const ID_TYPES: { value: IdDocumentType; label: string }[] = [
  { value: 'drivers_license', label: 'Driver’s license' },
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
]

export function IdVerification() {
  const { user, logout, submitIdVerification } = useAppState()
  const navigate = useNavigate()
  const [idType, setIdType] = useState<IdDocumentType>('drivers_license')
  const [fileName, setFileName] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!user) return <Navigate to="/login" replace />

  if (user.accountStatus === 'approved') {
    return <Navigate to="/dashboard" replace />
  }
  if (user.accountStatus === 'pending_review') {
    return <Navigate to="/pending-approval" replace />
  }
  if (user.accountStatus === 'rejected') {
    return <Navigate to="/account-rejected" replace />
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!fileName.trim()) {
      setError('Please choose a photo or scan of your ID.')
      return
    }
    submitIdVerification({
      idType,
      fileName: fileName.trim(),
      notes: notes.trim() || undefined,
    })
    navigate('/pending-approval', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Jasmine Global</span>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="text-sm text-amber-800 hover:underline"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Verify it’s you</h1>
          <p className="mt-2 text-sm text-slate-600">
            We need a clear photo of a government ID before we can approve your account. Your suite
            code for shipping is already reserved:{' '}
            <span className="font-mono font-semibold text-slate-900">{user.suiteCode}</span>
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="idType">
                ID type
              </label>
              <select
                id="idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value as IdDocumentType)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              >
                {ID_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="file">
                Upload ID (photo or PDF)
              </label>
              <input
                id="file"
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setFileName(f ? f.name : '')
                }}
                className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
              <p className="mt-1 text-xs text-slate-500">
                This demo only stores the file name — hook up secure upload for production.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="notes">
                Notes <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Anything we should know?"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#0c1222] py-2.5 text-sm font-semibold text-white hover:bg-[#161f36]"
            >
              Submit for review
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already submitted?{' '}
            <Link to="/pending-approval" className="font-medium text-amber-800 hover:underline">
              Check status
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
