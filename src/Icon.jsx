// One stroke weight, one grid: drawn icons instead of unicode arrows.
const PATHS = {
  down: 'M12 4v15M6 13l6 6 6-6',
  out: 'M8 16 17 7M9 7h8v8',
  back: 'M20 12H5M11 6l-6 6 6 6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
}

export default function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" />
    </svg>
  )
}
