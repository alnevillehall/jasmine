import { useState } from 'react'
import { SUPPORT_EMAIL } from '../lib/brand'
import { useAppState } from '../contexts/AppStateContext'

export function Support() {
  const { user, addAlert } = useAppState()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  if (!user) return null

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    addAlert({
      userId: user.id,
      type: 'system',
      title: `Support: ${subject.trim()}`,
      body: message.trim(),
    })
    setSent(true)
    setSubject('')
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Need help?</h1>
        <p className="mt-1 text-slate-600">
          Ask us anything — shipping, customs, or billing.
          {!import.meta.env.PROD
            ? ' In local preview, replies land in your alerts.'
            : ' We’ll follow up by email.'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="e.g. Help with customs for my Jamaica box"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Describe your question or issue…"
          />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-[#0c1222] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f36]"
          >
            Submit request
          </button>
          {sent ? (
            <span className="text-sm text-emerald-600">Saved to your alerts.</span>
          ) : null}
        </div>
      </form>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Rather call?</p>
        <p className="mt-2">
          US <strong className="text-slate-800">+1 (800) 555-0199</strong> · JM{' '}
          <strong className="text-slate-800">+1 (876) 555-0142</strong>
        </p>
        <p className="mt-2">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-amber-800 hover:underline">
            {SUPPORT_EMAIL}
          </a>{' '}
          · Mon–Sat, 8am–8pm ET
        </p>
        {!import.meta.env.PROD ? (
          <p className="mt-2 text-xs text-slate-500">Sample numbers for local preview.</p>
        ) : null}
      </div>
    </div>
  )
}
