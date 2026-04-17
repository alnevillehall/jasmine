import { useId } from 'react'

type Variant = 'full' | 'compact' | 'mark'

type Props = {
  variant?: Variant
  theme?: 'light' | 'dark'
  className?: string
}

const FONT = '"Plus Jakarta Sans", system-ui, sans-serif'

/** Short wordmark “Bloom” + flower mark — legal name is Bloomers Company Ltd (footer only). */
export function BloomLogo({ variant = 'full', theme = 'light', className = '' }: Props) {
  const uid = useId().replace(/:/g, '')
  const gradId = `blm-${uid}`
  const shineId = `bls-${uid}`
  const text = theme === 'light' ? '#faf8fc' : '#131022'
  const sub = theme === 'light' ? '#c9bed9' : '#6b6680'

  const defs = (
    <defs>
      <linearGradient id={gradId} x1="4" y1="4" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="0.38" stopColor="#fbbf24" />
        <stop offset="1" stopColor="#14b8a6" />
      </linearGradient>
      <linearGradient id={shineId} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  )

  /** Five-petal bloom + center — reads as “Bloom” without long text. */
  const markBody = (
    <g>
      <rect width="44" height="44" rx="14" fill={`url(#${gradId})`} />
      <rect width="44" height="44" rx="14" fill={`url(#${shineId})`} />
      <g transform="translate(22,22)">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-11"
            rx="7"
            ry="12"
            fill="#fff"
            fillOpacity={0.92}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="5.5" fill="#1e1b2e" fillOpacity={0.12} />
        <circle r="4" fill="#fff" />
      </g>
    </g>
  )

  if (variant === 'mark') {
    return (
      <svg
        className={className}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bloom shipping"
        role="img"
      >
        <title>Bloom shipping</title>
        {defs}
        {markBody}
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <svg
        className={className}
        viewBox="0 0 178 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bloom shipping"
        role="img"
      >
        <title>Bloom shipping</title>
        {defs}
        {markBody}
        <text
          x="52"
          y="29"
          fill={text}
          fontFamily={FONT}
          fontSize="20"
          fontWeight="700"
          letterSpacing="-0.03em"
        >
          Bloom
        </text>
      </svg>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 214 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bloom shipping"
      role="img"
    >
      <title>Bloom shipping</title>
      {defs}
      <g transform="translate(0,3)">{markBody}</g>
      <text
        x="52"
        y="26"
        fill={text}
        fontFamily={FONT}
        fontSize="21"
        fontWeight="700"
        letterSpacing="-0.03em"
      >
        Bloom
      </text>
      <text
        x="52"
        y="44"
        fill={sub}
        fontFamily={FONT}
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.28em"
      >
        SHIPPING
      </text>
    </svg>
  )
}
