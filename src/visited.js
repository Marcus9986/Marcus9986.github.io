// Which project pages this visitor has opened, for the footprints on the deck.
// Storage can be blocked (private mode, previews), so every access is guarded.
const KEY = 'pool:visited'

export function getVisited() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function markVisited(slug) {
  try {
    const v = getVisited()
    v.add(slug)
    localStorage.setItem(KEY, JSON.stringify([...v]))
  } catch {
    /* footprints are a nicety; ignore */
  }
}
