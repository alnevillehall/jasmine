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
      className={`rounded-xl border border-amber-200 bg-amber-50/80 ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">
            Your Florida warehouse address
          </p>
          <p className="mt-1 text-xs text-amber-900/70">
            Use this at checkout so we know the package is yours.
          </p>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
        >
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      <pre
        className={`mt-3 font-sans text-sm leading-relaxed text-slate-900 ${compact ? 'text-xs sm:text-sm' : ''}`}
      >
        {lines.join('\n')}
      </pre>
      <p className="mt-2 text-xs text-amber-900/70">
        Suite code: <span className="font-mono font-semibold">{suiteCode}</span>
      </p>
    </div>
  )
}
