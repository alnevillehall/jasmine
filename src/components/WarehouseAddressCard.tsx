import { useState } from 'react'
import { formatWarehouseLines } from '../lib/warehouse'

type Props = {
  fullName: string
  suiteCode: string
  compact?: boolean
}

export function WarehouseAddressCard({ fullName, suiteCode, compact }: Props) {
  const lines = formatWarehouseLines(fullName, suiteCode)
  const [copied, setCopied] = useState(false)

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={`rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-white to-teal-50/40 shadow-sm ring-1 ring-rose-100/50 ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-900/70">
            Your Florida warehouse address
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Use this at checkout so we know the package is yours.
          </p>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="shrink-0 rounded-xl bg-gradient-to-r from-rose-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/20 transition hover:brightness-105 active:scale-[0.98]"
        >
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      <pre
        className={`mt-4 overflow-x-auto rounded-xl border border-white/80 bg-white/70 p-3 font-sans text-slate-900 shadow-inner ${compact ? 'text-xs sm:text-sm' : 'text-sm'}`}
      >
        {lines.join('\n')}
      </pre>
      <p className="mt-3 text-xs text-slate-600">
        Suite code:{' '}
        <span className="font-mono font-semibold text-teal-800">{suiteCode}</span>
      </p>
    </div>
  )
}
