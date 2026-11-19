import { useMemo } from 'react'

// Deterministic PRNG so the star field is the same on every load (and between server and client).
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Three dust columns rising from the bottom edge, tallest on the left (1600 x 1000 space).
const PILLARS = [
  'M700 1000 C705 820 720 640 742 520 C750 470 770 430 790 440 C815 455 820 520 826 600 C835 720 850 860 860 1000 Z',
  'M880 1000 C890 880 900 760 915 690 C922 655 945 640 962 655 C980 672 982 740 990 800 C1000 880 1010 940 1020 1000 Z',
  'M1040 1000 C1048 930 1058 880 1070 850 C1078 832 1096 830 1104 846 C1114 870 1118 930 1126 1000 Z',
]

// A synthetic deep-sky exposure: blue gas, a rust column of dust, and a seeded star field.
export default function StarExposure({ seed = 7, className = '' }) {
  const { stars, bright } = useMemo(() => {
    const rnd = mulberry32(seed)
    const stars = Array.from({ length: 420 }, () => ({
      x: rnd() * 1600, y: rnd() * 1000, r: 0.5 + rnd() ** 3 * 1.8, o: 0.35 + rnd() * 0.65,
    }))
    const bright = Array.from({ length: 14 }, () => ({ x: rnd() * 1600, y: rnd() * 1000, r: 2 + rnd() * 2.5 }))
    return { stars, bright }
  }, [seed])
  const id = `x${seed}`
  return (
    <svg className={`exposure ${className}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-gas`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0034" numOctaves="5" seed={seed} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.36  0 0 0 0 0.72  1.6 0 0 0 -0.55" />
        </filter>
        <filter id={`${id}-dust`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.0016" numOctaves="4" seed={seed + 3} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.3  0 0 0 0 0.14  0 1.9 0 0 -0.78" />
        </filter>
        <filter id={`${id}-rough`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed={seed + 5} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" result="b" />
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.016" numOctaves="4" seed={seed + 9} result="fine" />
          <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -0.55" result="fa" />
          <feComposite in="b" in2="fa" operator="in" result="mottled" />
          <feComponentTransfer in="b" result="soft"><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feMerge><feMergeNode in="soft" /><feMergeNode in="mottled" /></feMerge>
        </filter>
        <filter id={`${id}-rim`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed={seed + 5} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>
        <linearGradient id={`${id}-pillar`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#120a07" />
          <stop offset="0.55" stopColor="#4a2516" />
          <stop offset="1" stopColor="#a65a2c" />
        </linearGradient>
        <radialGradient id={`${id}-col`} cx="0.6" cy="0.8" r="0.45">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="1600" height="1000" fill={`url(#${id}-col)`} />
        </mask>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#eaf6ff" />
          <stop offset="0.25" stopColor="#8fd3ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8fd3ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="#071326" />
      <rect width="1600" height="1000" filter={`url(#${id}-gas)`} />
      <rect width="1600" height="1000" filter={`url(#${id}-dust)`} mask={`url(#${id}-mask)`} />
      {/* Dust columns, lit along their rims from above. */}
      <g transform="translate(160 0)">
        <g filter={`url(#${id}-rim)`} fill="none" stroke="#ffd2a0" strokeWidth="12" opacity="0.6">
          {PILLARS.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g filter={`url(#${id}-rough)`} fill={`url(#${id}-pillar)`} opacity="0.9">
          {PILLARS.map((d, i) => <path key={i} d={d} />)}
        </g>
      </g>
      <g fill="#dfeefc">
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />)}
      </g>
      {bright.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r * 7} fill={`url(#${id}-glow)`} />
          <circle cx={s.x} cy={s.y} r={s.r * 0.6} fill="#fff" />
        </g>
      ))}
    </svg>
  )
}
