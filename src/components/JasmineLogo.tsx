import { useId } from 'react'

type Variant = 'full' | 'compact' | 'mark'

type Props = {
  variant?: Variant
  theme?: 'light' | 'dark'
  className?: string
}

const FONT = '"Plus Jakarta Sans", system-ui, sans-serif'

/**
 * Jasmine Shipping — squircle mark, rose→amber→teal gradient,
 * parcel + route arc (unique, modern).
 */
export function JasmineLogo({ variant = 'full', theme = 'light', className = '' }: Props) {
  const uid = useId().replace(/:/g, '')
  const gradId = `jsg-${uid}`
  const shineId = `jss-${uid}`
  const text = theme === 'light' ? '#faf8fc' : '#131022'
  const sub = theme === 'light' ? '#c9bed9' : '#6b6680'

  const defs = (
    <defs>
      <linearGradient id={gradId} x1="4" y1="4" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="0.42" stopColor="#fbbf24" />
        <stop offset="1" stopColor="#14b8a6" />
      </linearGradient>
      <linearGradient id={shineId} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  )

  const markBody = (
    <g>
      <rect width="44" height="44" rx="14" fill={`url(#${gradId})`} />
      <rect width="44" height="44" rx="14" fill={`url(#${shineId})`} />
      <path d="M11 17h14v12H11V17z" fill="#fff" fillOpacity={0.98} />
      <path
        d="M11 17l7-4.5 7 4.5"
        stroke="#1e1b2e"
        strokeOpacity={0.07}
        strokeWidth={0.75}
        fill="none"
      />
      <path
        d="M18 12.5v16.5"
        stroke="#1e1b2e"
        strokeOpacity={0.09}
        strokeWidth={0.85}
      />
      <path
        d="M26 28c4-2 7-6 7-11"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="33" cy="15" r="2.2" fill="#fff" />
    </g>
  )

  if (variant === 'mark') {
    return (
      <svg
        className={className}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Jasmine Shipping"
        role="img"
      >
        <title>Jasmine Shipping</title>
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
        aria-label="Jasmine Shipping"
        role="img"
      >
        <title>Jasmine Shipping</title>
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
          Jasmine
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
      aria-label="Jasmine Shipping"
      role="img"
    >
      <title>Jasmine Shipping</title>
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
        Jasmine
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
