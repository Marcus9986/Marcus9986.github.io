import { useEffect, useRef, useState } from 'react'
import StarExposure from './Exposure.jsx'
import Icon from './Icon.jsx'
import { contact, layers, projects } from './data.js'
import { getVisited, markVisited } from './visited.js'

const Sep = () => <span className="sep" aria-hidden="true">·</span>

function Ext({ href, children, className = '' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon name="out" />
      <span className="vh"> (opens in a new tab)</span>
    </a>
  )
}

// Cream contact card: the primary action lives here.
function Correspondence({ id, heading, children }) {
  return (
    <section className="card card--contact" aria-labelledby={id}>
      <h2 id={id} className="card__title">{heading}</h2>
      {children}
      <dl className="fields">
        <dt>Email</dt>
        <dd><a className="fields__email" href={`mailto:${contact.email}`}>{contact.email}</a></dd>
        <dt>LinkedIn</dt>
        <dd><Ext href={contact.linkedin}>in/marcus-secord</Ext></dd>
        <dt>GitHub</dt>
        <dd><Ext href={contact.github}>Marcus9986</Ext></dd>
      </dl>
    </section>
  )
}

// Brightens a screenshot once it scrolls into view. Content is visible either way.
function useLit() {
  const ref = useRef(null)
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setLit(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLit(true); io.disconnect() } }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, lit]
}

function Glass({ project, large = false }) {
  const [ref, lit] = useLit()
  const { image } = project
  return (
    <figure className={`glass ${large ? 'glass--large' : ''} ${lit ? 'is-lit' : ''}`} ref={ref}>
      <div className="glass__frame">
        {image ? (
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={large ? 'eager' : 'lazy'} />
        ) : (
          <StarExposure seed={project.slug.length * 7 + 3} className="glass__sky" />
        )}
      </div>
    </figure>
  )
}

// A ruled card row: the layer's name as a typed field label, the band's own title as the heading.
function Layer({ layer, band, level = 3, children }) {
  const H = `h${level}`
  return (
    <div className={`layer layer--${layer.id}`}>
      <p className="layer__name">{layer.name}</p>
      <div className="layer__content">
      <H className="layer__title">{band.title}</H>
      <p className="layer__body">{band.body}</p>
      {children}
      {band.routes && (
        <table className="routes">
          <tbody>
            {band.routes.map(([method, path]) => (
              <tr key={path}><td className="routes__m">{method}</td><td><code>{path}</code></td></tr>
            ))}
          </tbody>
        </table>
      )}
      {band.models && (
        <ul className="tags">{band.models.map((m) => <li key={m}><code>{m}</code></li>)}</ul>
      )}
      </div>
    </div>
  )
}

function Row({ name, title, children }) {
  return (
    <div className="layer">
      <p className="layer__name">{name}</p>
      <div className="layer__content">
        <h2 className="layer__title">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function ProjectEntry({ project }) {
  return (
    <article className="entry" id={`project-${project.slug}`} aria-labelledby={`t-${project.slug}`}>
      <Glass project={project} />
      <div className="card card--entry">
        <h2 id={`t-${project.slug}`} className="card__title">{project.name}</h2>
        {project.tagline && <p className="card__tagline">{project.tagline}</p>}
        {project.synced ? (
          project.stack.length > 0 && <ul className="tags tags--synced">{project.stack.map((t) => <li key={t}>{t}</li>)}</ul>
        ) : (
          layers.map((l) => <Layer key={l.id} layer={l} band={project.bands[l.id]} />)
        )}
        <p className="actions">
          {project.synced ? (
            project.links.map((l, i) => <Ext key={l.href} href={l.href} className={`btn ${i ? 'btn--line' : ''}`}>{l.label}</Ext>)
          ) : (
            <>
              {project.href && <a className="btn" href={project.href}>Open the project<span className="vh">: {project.name}</span></a>}
              {(project.links || []).slice(0, project.href ? 1 : 2).map((l, i) => <Ext key={l.href} href={l.href} className={`btn ${project.href || i ? 'btn--line' : ''}`}>{l.label}</Ext>)}
            </>
          )}
        </p>
      </div>
    </article>
  )
}

function Footer() {
  return (
    <footer className="close">
      <div className="close__inner">
        <Correspondence id="close-h" heading="Correspondence">
          <p className="card__lede">Questions about any of these projects, or something you’d like built? Write to me.</p>
        </Correspondence>
        <p className="colophon">© {new Date().getFullYear()} Marcus Secord<Sep />Kingston, Ontario<Sep />The star field is computer-generated</p>
      </div>
    </footer>
  )
}

// Ringed stars on the hero: each links to a project below. Dashed until opened, solid after.
// Star positions on the hero, used in timeline order (newest first). Each star has its own row,
// so labels can't collide; stars on the right put their label to the left (`flip`). Projects beyond
// the last slot get no star (they're still listed below); add a row here, keeping rows ~9% apart.
const STAR_SLOTS = [
  { left: '72%', top: '6%', flip: true },
  { left: '34%', top: '15%' },
  { left: '86%', top: '24%', flip: true },
  { left: '18%', top: '33%' },
  { left: '62%', top: '42%', flip: true },
]

// Which project is in view: the last one whose top has passed 45% of the screen (its dot glows).
function useCurrentProject() {
  const areaRef = useRef(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    let raf = 0
    const pick = () => {
      raf = 0
      const items = areaRef.current?.querySelectorAll('.timeline__item') || []
      const line = window.innerHeight * 0.45
      let i = 0
      items.forEach((li, k) => { if (li.getBoundingClientRect().top <= line) i = k })
      setActive(i)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick) }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return { areaRef, active }
}

// The rocket rides the timeline rail at the height you've scrolled to (45% down the screen).
//   landed    upright on a dot while that dot is near the 45% line
//   charging  you scrolled up, the way it faces: it builds power on the pad (shake, growing flame)
//   lifting   ...then accelerates straight up to the scroll line
//   turning   you scrolled down, against it: it swings round the dot in a wide half-circle
//   flying    following the scroll line with momentum (eases up to your speed and back down), floating;
//             before the first project it hovers above the earth; past the last it curves off the rail to
//             hover above the moon below the list
//   assist    scrolling fast past a dot: a full, accelerating lap round it, flung off faster (gravity assist)
//   landing   easing onto the dot the line reaches when you're scrolling slowly
// Decorative and hidden from screen readers. With reduced motion it just follows and sits on dots.
const ROCKET = {
  SNAP_IN: 60, SNAP_OUT: 80, SETTLE: 0.16,
  PULL: 4, MAX_SPEED: 2400, ACCEL: 4500, // following: catch-up rate (1/s), top speed (px/s), acceleration (px/s²)
  CHARGE_MS: 700, LIFT_MS: 650, TURN_MS: 1300, FAST_TURN_MS: 650, TURN_R: 70, ASSIST_MS: 900, ASSIST_R: 46, FLING: 900, // FLING: top speed (px/s) carried out of an animation
  ORBIT_MS: 6000, // one lap round the earth or moon while parked there
  SLACK: 30, // how far it may drift either side of the rail while following
  FAST: 700, // scroll speed (px per second) above which it slingshots past dots instead of landing
  ASSIST_PAST: 10, // ...starting the loop once the scroll line is this far past the dot (px)
  LAND: 150, // it only lands once you're scrolling slower than this (px/s), so it skips dots you scroll past
  LAND_DELAY: 350, // ...and have stayed that slow this long (ms), so brief pauses mid-scroll don't trigger a landing
}
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
// Turn angle `from` toward `to` (degrees) by fraction f, the short way round.
const turn = (from, to, f) => from + ((((to - from) % 360) + 540) % 360 - 180) * f

// Pixel art: one string per row, one character per pixel ('.' = empty). `ink` maps each character
// to the props for its pixels (a fill or a className). Runs of the same character become one rect.
function PixelArt({ rows, ink }) {
  const rects = []
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      let end = x + 1
      while (row[end] === row[x]) end++
      if (ink[row[x]]) rects.push(<rect key={`${x},${y}`} x={x} y={y} width={end - x} height={1} {...ink[row[x]]} />)
      x = end
    }
  })
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" focusable="false">
      {rects}
    </svg>
  )
}

// The fins end 3/4 of the way down (row 12 of 16); Rocket's seat() relies on that. Below is flame.
const ROCKET_ART = [
  '...ff...',
  '..bbbs..',
  '..bbbs..',
  '.bbbbbs.',
  '.bcwwcs.',
  '.bcwwcs.',
  '.bbbbbs.',
  '.bbbbbs.',
  '.bbbbbs.',
  'fbbbbbsf',
  'fbbbbbsf',
  'f.ffff.f',
  '..yyyy..',
  '..yyyy..',
  '...yy...',
  '...yy...',
]
const ROCKET_INK = {
  b: { className: 'rocket__body' }, s: { className: 'rocket__shade' }, f: { className: 'rocket__fin' },
  c: { className: 'rocket__frame' }, w: { className: 'rocket__window' }, y: { className: 'rocket__flame' },
}
const EARTH_ART = [
  '.....ooowoo.....',
  '...oowwooolld...',
  '..oollloooolld..',
  '.ollllloooolldd.',
  '.olllllgooooldd.',
  'oolllggloooooodd',
  'oolllllloooooodd',
  'ooolllloooolllod',
  'oooollooooollldd',
  'wwoooooooolllldd',
  'ooowwoooooolgldd',
  '.oooooooooolldd.',
  '.oolloooooooddd.',
  '..ollllooooodd..',
  '...oolooooddd...',
  '.....oddddd.....',
]
const EARTH_INK = { o: { fill: '#2f6fb3' }, d: { fill: '#173d6b' }, l: { fill: '#5f9a6a' }, g: { fill: '#3f7550' }, w: { fill: '#eef3f8' } }
const MOON_ART = [
  '.....hhhmmm.....',
  '...hhhhmmmmms...',
  '..hhccmmmmmmss..',
  '.hhccmmmmcmmmss.',
  '.hmmmmmmmmmmmss.',
  'hmmmmmmmmmmmmmss',
  'hmmmccmmmmmmmmss',
  'mmmcccmmmmmcmmss',
  'mmmmcmmmmmmmmsss',
  'mmmmmmmmccmmmsss',
  'mmcmmmmmcccmmsss',
  '.mmmmmmmmcmmsss.',
  '.mmmmmmmmmmssss.',
  '..msmmmcmmssss..',
  '...mmsmmsssss...',
  '.....ssssss.....',
]
// Each timeline dot is a small planet: 7x7 pixels (sized in styles.css), lit from the top left.
// h highlight, a surface, c surface detail (bands, craters), s shadow side.
const DOT_ART = [
  '..hha..',
  '.haaas.',
  'haccaas',
  'aaacass',
  'aaaaass',
  '.acass.',
  '..ass..',
]
const DOT_INKS = [
  { h: '#f0a37a', a: '#c0703a', c: '#8f4a26', s: '#6b3418' }, // rusty desert world
  { h: '#f3e2b8', a: '#d4b47c', c: '#a8834e', s: '#7a5c34' }, // banded gas giant
  { h: '#e6f6ff', a: '#8fd3ff', c: '#5aa6d6', s: '#2f6f9e' }, // ice world
  { h: '#d9c2f5', a: '#9b74cf', c: '#6e4ea3', s: '#4a3373' }, // violet world
  { h: '#c8efb4', a: '#6fb35a', c: '#4a8a3c', s: '#2f5e27' }, // jungle world
].map((pal) => Object.fromEntries(Object.entries(pal).map(([k, fill]) => [k, { fill }])))
const MOON_INK ={ h: { fill: '#eef3f8' }, m: { fill: '#b9c6d4' }, s: { fill: '#7d8ea3' }, c: { fill: '#8d9db1' } }

function Rocket({ areaRef }) {
  const el = useRef(null)
  useEffect(() => {
    const area = areaRef.current, rocket = el.current
    if (!area || !rocket) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const s = { mode: null, node: 0, x: 0, y: 0, a: 0, t0: 0, dir: 0, fxAt: 0, scroll: window.scrollY, speed: 0, at: 0, from: null, assisted: -1, assistAt: 0, vx: 0, vy: 0, px: 0, py: 0, tx: null, ty: null }
    let raf = 0, live = 0

    // Launch effects: short-lived smoke puffs and sparks, drawn behind the rocket.
    const puff = (kind, x, y, dx, dy) => {
      if (live > 70) return
      const p = document.createElement('span')
      p.className = `rocket-fx rocket-fx--${kind}`
      area.appendChild(p); live++
      const at = (px, py, sc) => `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${sc})`
      const smoke = kind === 'smoke'
      p.animate(
        [{ transform: at(x, y, smoke ? 0.4 : 1), opacity: smoke ? 0.6 : 1 }, { transform: at(x + dx, y + dy, smoke ? 2.6 : 0.2), opacity: 0 }],
        { duration: (smoke ? 900 : 260) + Math.random() * (smoke ? 500 : 160), easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      ).onfinish = () => { p.remove(); live-- }
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const box = area.getBoundingClientRect()
      const nodes = [...area.querySelectorAll('.when__node')].map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, r: r.height / 2 }
      })
      if (!nodes.length) return
      // Which way and how fast you're scrolling. Nose down = 180; kept when you stop.
      const scrolled = window.scrollY - s.scroll, dt = Math.max(now - (s.at || now - 16), 1), sec = Math.min(dt, 50) / 1000
      s.scroll = window.scrollY; s.at = now
      // The smoothing fractions below are tuned per 60fps frame; this scales them to the real frame
      // time, so the motion is the same speed on 120Hz screens and doesn't stutter on dropped frames.
      const per = (f) => 1 - (1 - f) ** (sec * 60)
      // Wheels scroll in bursts, so take the peak and let it fade over ~1/3 s rather than averaging.
      s.speed = Math.max(s.speed * (1 - per(0.04)), (Math.abs(scrolled) / dt) * 1000)
      // How fast you're scrolling right now (~0.1 s smoothing): drops quickly once you stop, so the
      // rocket doesn't start or keep circling a dot you've already stopped on.
      s.inst = (s.inst ?? 0) + ((Math.abs(scrolled) / dt) * 1000 - (s.inst ?? 0)) * per(0.15)
      if (s.inst >= ROCKET.LAND) s.movedAt = now
      const settled = now - (s.movedAt ?? 0) > ROCKET.LAND_DELAY // stopped scrolling for a moment, not just pausing
      if (scrolled > 0.5) s.dir = 180
      else if (scrolled < -0.5) s.dir = 0
      const heading = s.dir === 180 ? 1 : -1

      const h = rocket.offsetHeight
      const line = window.innerHeight * 0.45 - box.top
      const last = nodes.length - 1
      const rm = reduce.matches
      // Where it parks below the list: circling the moon. And before the list: circling the earth.
      // (x, y) is the top of that circle, where the paths to and from the rail meet it.
      const above = (sel, fallback) => {
        const r = area.querySelector(`${sel} svg`)?.getBoundingClientRect()
        if (!r) return fallback
        const cx = r.left - box.left + r.width / 2, cy = r.top - box.top + r.height / 2, R = r.width / 2 + h * 0.5 + 14
        return { x: cx, y: cy - R, cx, cy, R, name: sel }
      }
      const hover = above('.moon', nodes[last])
      const earth = above('.earth', nodes[0])
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      // Rocket centre when sitting on dot i. The drawing's fins end 3/4 of the way down (the rest is
      // flame room), so put that line on the dot's top edge, overlapping 2px so it stands on it.
      const seat = (i) => ({ x: nodes[i].x, y: nodes[i].y - nodes[i].r - h * 0.25 + 2 })
      const dist = (i) => Math.abs(line - nodes[i].y)
      // The dot to land on: one near the line.
      const target = () => nodes.findIndex((_, k) => dist(k) < ROCKET.SNAP_IN)
      // Where the scroll line puts the rocket: hovering above the earth, then along a curve down to
      // the rail, along the rail (which runs to the bottom of the last project), then along a curve
      // to the moon, all the way there at the bottom of the page.
      // Along the way it drifts lazily up to SLACK either side (two slow, out-of-step waves, so it
      // doesn't look like a metronome), kept clear of the screen's left edge on phones.
      // `hover` is true while it's parked at the earth or the moon (so it stands upright).
      const railEnd = area.querySelector('.timeline__item:last-child').getBoundingClientRect().bottom - box.top
      const rail = nodes[0].x
      const wander = ROCKET.SLACK * (0.7 * Math.sin(now / 550) + 0.3 * Math.sin(now / 320 + 1))
      const minX = rocket.offsetWidth / 2 + 4 - box.left
      const path = () => {
        if (line < nodes[0].y) {
          // Off the earth: sideways first (ease-out) and down later (ease-in), so it clears the planet.
          const t = Math.min(Math.max((line - earth.y) / Math.max(nodes[0].y - earth.y, 1), 0), 1)
          return { x: Math.max(earth.x + (rail - earth.x) * (1 - (1 - t) ** 2) + wander, minX), y: earth.y + (nodes[0].y - earth.y) * t * t, hover: t <= 0, planet: t <= 0 && earth.R ? earth : null }
        }
        if (line <= railEnd && !atBottom) {
          return { x: Math.max(rail + wander, minX), y: Math.min(line, railEnd), hover: false }
        }
        const t = atBottom ? 1 : Math.min((line - railEnd) / Math.max(hover.y - railEnd, 1), 1)
        return { x: Math.max(rail + (hover.x - rail) * easeInOut(t) + wander, minX), y: railEnd + (hover.y - railEnd) * t, hover: t >= 1, planet: t >= 1 && hover.R ? hover : null }
      }
      const set = (mode) => { s.mode = mode; s.t0 = now; rocket.dataset.mode = mode; s.tx = s.ty = null }
      const progress = (ms) => Math.min((now - s.t0) / ms, 1)
      // Move to (x, y), turning the nose toward the direction of travel.
      const moveTo = (x, y) => {
        const dx = x - s.x, dy = y - s.y
        if (dx * dx + dy * dy > 0.01) s.a = turn(s.a, (Math.atan2(dx, -dy) * 180) / Math.PI, per(0.3))
        s.x = x; s.y = y
      }
      // A point on a path round dot i: angle th0 + sweep*t (0 = right of the dot). The radius widens
      // from r0 to r1 over the first third, so the arc swings out wide rather than spiralling.
      // Its centre starts on the dot and drifts toward the scroll line as t goes on, so if you keep
      // scrolling, the dot can scroll away but the rocket stays with you on screen. It drifts to
      // where the arc's end point lands on the line, so the rocket finishes there, not past it.
      // With follow=false (gravity assist) the centre stays on the dot, so it really loops round it.
      // On phones the rail is near the screen edge: shift a circle of radius r right just enough to stay on screen.
      const edgeShift = (i, r) => Math.max(0, r + h * 0.5 + 4 - (box.left + nodes[i].x))
      const orbit = (i, th0, sweep, r0, r1, t, follow = true) => {
        const th = th0 + sweep * t, r = r1 - (r1 - r0) * (1 - Math.min(t / 0.33, 1)) ** 2
        const end = Math.min(Math.max(line, nodes[0].y), railEnd) - r1 * Math.sin(th0 + sweep)
        const cy = follow ? nodes[i].y + (end - nodes[i].y) * t * t : nodes[i].y
        // A gravity assist keeps one fixed centre (sized for its full radius), the same one its start
        // angle was measured from, so on phones it doesn't jump sideways into the loop.
        const cx = nodes[i].x + edgeShift(i, follow ? r : r1)
        return [cx + r * Math.cos(th), cy + r * Math.sin(th)]
      }
      // Fire and smoke out of the tail, opposite the nose.
      const exhaust = () => {
        if (now - s.fxAt < 30) return
        s.fxAt = now
        const rad = (s.a * Math.PI) / 180, nx = Math.sin(rad), ny = -Math.cos(rad)
        const tx = s.x - nx * h * 0.3, ty = s.y - ny * h * 0.3, j = () => (Math.random() - 0.5) * 8
        puff('fire', tx, ty, -nx * 14 + j(), -ny * 14 + j())
        puff('smoke', tx, ty, -nx * 22 + j() * 2, -ny * 22 + j() * 2 - 6)
      }
      const padSmoke = (n) => {
        for (let k = 0; k < n; k++) puff('smoke', s.x, nodes[s.node].y - 4, (k % 2 ? 1 : -1) * (16 + Math.random() * 34), -4 - Math.random() * 14)
      }

      if (s.mode === null) {
        const i = target()
        if (i >= 0) { s.node = i; Object.assign(s, seat(i)); set('landed') }
        else { const T = path(); s.x = T.x; s.y = T.y; set('flying') } // loaded mid-page: start in flight
      }

      if (s.mode === 'landed') {
        Object.assign(s, seat(s.node)); s.a = 0
        const leaving = dist(s.node) > ROCKET.SNAP_OUT
        if (leaving) {
          if (rm) set('flying')
          else if (s.dir === 0) set('charging') // scrolling up: the way it faces
          else { s.from = { fast: s.speed > ROCKET.FAST }; set('turning'); padSmoke(12) } // scrolling down: against it
        }
      } else if (s.mode === 'charging') {
        // Building power on the pad: smoke billows out, the flame grows, the rocket shakes.
        const k = progress(ROCKET.CHARGE_MS)
        Object.assign(s, seat(s.node)); s.a = 0
        if (now - s.fxAt > 70) { s.fxAt = now; padSmoke(2) }
        if (target() === s.node && dist(s.node) < ROCKET.SNAP_IN) set('landed') // you scrolled back: stand down
        else if (s.dir === 180) { s.from = { fast: false }; set('turning'); padSmoke(8) }
        else if (k >= 1) { s.from = { x: s.x, y: s.y }; set('lifting'); padSmoke(14) }
      } else if (s.mode === 'lifting') {
        // Straight up, accelerating, to the scroll line.
        const k = progress(ROCKET.LIFT_MS)
        moveTo(s.from.x, s.from.y + (path().y - s.from.y) * k * k)
        s.a = 0
        exhaust()
        if (k >= 1) set('flying')
      } else if (s.mode === 'turning') {
        // A wide half-circle round the dot: from above it, out through the gap on the right, to below it.
        // Leaving at speed, it turns as quickly as a gravity assist so it isn't left far behind.
        const k = easeInOut(progress(s.from?.fast ? ROCKET.FAST_TURN_MS : ROCKET.TURN_MS)), r0 = nodes[s.node].y - seat(s.node).y
        moveTo(...orbit(s.node, -Math.PI / 2, Math.PI, r0, Math.min(ROCKET.TURN_R, window.innerWidth * 0.18), k))
        exhaust()
        // Reached a dot (or scrolled back to this one) mid-swing: break off and land instead of circling.
        const i = target()
        if (i >= 0 && settled) { s.node = i; set('landing') }
        else if (k >= 1) set('flying')
      } else if (s.mode === 'assist') {
        // Gravity assist: a full lap round the dot, speeding up as it goes (k^1.6: gentle enough that
        // the whole circle is visible), flung off the right side heading the way you're scrolling.
        // It then catches back up to the scroll line.
        const k = progress(ROCKET.ASSIST_MS) ** 1.6
        moveTo(...orbit(s.node, s.from.th, s.from.sweep, s.from.r, ROCKET.ASSIST_R, k, false))
        exhaust()
        // Always finishes the lap, even if you stop; it lands afterwards if you've stopped on a dot.
        if (k >= 1) { s.assisted = s.node; s.assistAt = now; set('flying') }
      } else if (s.mode === 'flying') {
        const T = path()
        if (rm) s.orb = null
        // The planet it's circling: the one it's parked at, or the one it's still finishing a lap of.
        const p = T.planet || (s.orb === earth.name ? earth : s.orb === hover.name ? hover : null)
        if (rm) { s.x = T.x; s.y = T.y; s.vx = s.vy = 0 } else if (p) {
          // Parked at the earth or moon: circle it, clockwise, once per ORBIT_MS. The lap starts from
          // wherever the rocket is, and the radius eases from there to R, so joining it never jumps.
          const W = (2 * Math.PI * 1000) / ROCKET.ORBIT_MS // rad/s
          if (s.orb !== p.name) { s.orb = p.name; s.orbTh = Math.atan2(s.y - p.cy, s.x - p.cx); s.orbR = Math.hypot(s.x - p.cx, s.y - p.cy); s.orbAt = now; s.orbW = W }
          // Scrolled away: speed up (smoothly, up to 4x) and let go only at the bottom of the circle,
          // where it's heading left, so it sweeps straight on toward the rail instead of stopping dead.
          const leaving = !T.planet, prev = s.orbTh
          s.orbW += ((leaving ? 4 : 1) * W - s.orbW) * per(0.06)
          s.orbTh += s.orbW * sec
          const r = p.R + (s.orbR - p.R) * Math.exp(-(now - s.orbAt) / 500)
          const x = p.cx + r * Math.cos(s.orbTh), y = p.cy + r * Math.sin(s.orbTh)
          s.vx = (x - s.x) / sec; s.vy = (y - s.y) / sec // carried on into free flight when it lets go
          moveTo(x, y)
          const lap = (th) => Math.floor((th - Math.PI / 2) / (2 * Math.PI)) // +1 each time it passes the bottom
          if (leaving && lap(s.orbTh) !== lap(prev)) s.orb = null
        } else {
          // Your scrolling carries it directly, like the page itself, so it never lags behind and has
          // to catch up. Momentum only closes leftover gaps (after a half-circle, a slingshot, or the
          // curve to the moon): it eases up and eases off, changing speed no faster than ACCEL.
          if (s.ty !== null) s.y += T.y - s.ty
          let gx = T.x - s.x, gy = T.y - s.y
          const d = Math.hypot(gx, gy)
          if (s.ty === null && d > 0.5) {
            // Just came out of an animation: keep only the motion heading toward the target (no faster
            // than FLING), so it never carries on past where it should be and has to come back.
            const along = Math.min(Math.max((s.vx * gx + s.vy * gy) / d, 0), ROCKET.FLING)
            s.vx = (gx / d) * along; s.vy = (gy / d) * along
          }
          // Target speed: slow enough that ACCEL can always brake to a stop exactly on the target.
          const want = d > 0.5 ? Math.min(d * ROCKET.PULL, Math.sqrt(2 * ROCKET.ACCEL * d), ROCKET.MAX_SPEED) / d : 0
          let dvx = gx * want - s.vx, dvy = gy * want - s.vy
          const dv = Math.hypot(dvx, dvy), cap = ROCKET.ACCEL * sec
          if (dv > cap) { dvx *= cap / dv; dvy *= cap / dv }
          s.vx += dvx; s.vy += dvy
          s.x += s.vx * sec; s.y += s.vy * sec
          // Stepped past the target this frame: stop on it rather than overshoot and correct.
          if ((T.x - s.x) * gx + (T.y - s.y) * gy < 0) { s.x = T.x; s.y = T.y; s.vx = s.vy = 0 }
        }
        s.tx = T.x; s.ty = T.y
        // Nose along any catch-up move; otherwise the way you're scrolling (upright hovering at the earth or moon).
        const aim = Math.hypot(s.vx, s.vy) > 120 ? (Math.atan2(s.vx, -s.vy) * 180) / Math.PI
          : T.hover && s.speed < 40 ? 0 : s.dir
        if (rm) s.a = T.hover ? 0 : s.dir
        else if (!p) s.a = turn(s.a, aim, per(0.12)) // orbiting: moveTo already noses along the circle
        const fast = !rm && s.speed > ROCKET.FAST
        // Scrolling fast: slingshot round the dot the rocket is passing, but only once your scrolling
        // has carried the line past it, so it never circles a dot you're stopping on.
        const ahead = fast && nodes.findIndex((n, k) => k !== 0
          && !(k === s.assisted && now - s.assistAt < 1500)
          && Math.abs(n.y - s.y) < 150
          && (line - n.y) * heading > ROCKET.ASSIST_PAST && (line - n.y) * heading < 150)
        if (s.orb) {
          // Still circling the earth or moon: no slingshots or landings until it has let go.
        } else if (fast && s.inst > ROCKET.FAST && ahead >= 0) {
          const n = nodes[ahead]
          s.node = ahead
          // From where it is now, round to the dot's right side (angle 0) a full lap later, which is
          // where the orbit's direction of travel matches the scroll (down when sweeping clockwise).
          const cx = n.x + edgeShift(ahead, ROCKET.ASSIST_R)
          const th = Math.atan2(s.y - n.y, s.x - cx)
          s.from = { th, sweep: heading * 2 * Math.PI - th, r: Math.hypot(s.x - cx, s.y - n.y) }
          set('assist')
        } else if (settled) { // only once you've (nearly) stopped on a dot, not while passing it
          const i = target()
          if (i >= 0 && !(i === s.node && now - s.t0 < 400)) { s.node = i; set('landing') }
        }
      } else if (s.mode === 'landing') {
        const t = seat(s.node), f = rm ? 1 : per(ROCKET.SETTLE)
        // Swing upright as it comes in, so it touches down on its fins.
        s.x += (t.x - s.x) * f; s.y += (t.y - s.y) * f; s.a = rm ? 0 : turn(s.a, 0, per(0.22))
        if (Math.abs(t.y - s.y) < 0.6 && Math.abs(t.x - s.x) < 0.6 && Math.abs(turn(s.a, 0, 1) - s.a) < 2) { s.a = 0; set('landed') }
        else if (target() !== s.node || s.inst > ROCKET.LAND * 2) set('flying') // scrolling on again: carry on, don't touch down
      }

      // Outside free flight, keep its velocity relative to the scroll line, so free flight (which
      // already moves with your scrolling) carries the motion on smoothly without counting it twice.
      const lineNow = Math.min(Math.max(line, nodes[0].y), railEnd)
      if (s.mode !== 'flying') { s.vx = (s.x - s.px) / sec; s.vy = (s.y - s.py - (lineNow - (s.pl ?? lineNow))) / sec }
      s.px = s.x; s.py = s.y; s.pl = lineNow

      // Float while flying, shake while charging (render only, so positions stay exact). The float
      // fades in and out over ~1/4 s so the rocket doesn't pop by a few px/degrees on mode changes.
      s.float = (s.float ?? 0) + ((s.mode === 'flying' && !rm ? 1 : 0) - (s.float ?? 0)) * per(0.07)
      const shake = s.mode === 'charging' ? progress(ROCKET.CHARGE_MS) * 1.6 : 0
      const fx = Math.sin(now / 650) * 3 * s.float + (Math.random() - 0.5) * shake
      const fy = Math.sin(now / 460) * 2.5 * s.float + (Math.random() - 0.5) * shake
      const fa = Math.sin(now / 820) * 6 * s.float
      rocket.style.transform = `translate(${s.x + fx}px, ${s.y + fy}px) translate(-50%, -50%) rotate(${s.a + fa}deg)`
    }

    // Only animate while the timeline is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame)
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { rootMargin: '200px 0px' })
    io.observe(area)
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); area.querySelectorAll('.rocket-fx').forEach((p) => p.remove()) }
  }, [areaRef])

  return (
    <div className="rocket" ref={el} aria-hidden="true">
      <PixelArt rows={ROCKET_ART} ink={ROCKET_INK} />
    </div>
  )
}

export function Home() {
  const rocket = useCurrentProject()
  const [visited, setVisited] = useState(() => new Set())
  useEffect(() => setVisited(getVisited()), [])
  return (
    <>
      <a className="skip" href="#projects">Skip to the projects</a>
      <header className="lightbox">
        <div className="lightbox__inner">
          <div className="hero">
            <StarExposure seed={11} className="hero__sky" />
            {projects.slice(0, STAR_SLOTS.length).map((p, i) => {
              const s = STAR_SLOTS[i]
              return (
                <a key={p.slug} className={`star-link ${s.flip ? 'star-link--flip' : ''} ${visited.has(p.slug) ? 'is-visited' : ''}`} href={`#project-${p.slug}`} style={{ left: s.left, top: s.top }}>
                  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="27" /><circle cx="32" cy="32" r="3.5" className="star-link__core" /></svg>
                  <span className="star-link__label"><span className="star-link__n">{i + 1}</span>{p.name}</span>
                </a>
              )
            })}
            <div className="hero__text">
              <h1 className="hero__name">Marcus Secord</h1>
              <p className="hero__role">Backend developer<Sep />Kingston, ON</p>
              <p className="hero__intro">
                Computer Science, Software Design specialization, Queen’s University. I build the APIs and
                databases under the page, and I make games on the side.
              </p>
            </div>
          </div>
          <Correspondence id="contact-h" heading="Get in touch">
            <a className="card__dive" href="#projects"><Icon name="down" />Or browse the projects</a>
          </Correspondence>
        </div>
      </header>
      <main id="projects" className="drawer" tabIndex="-1">
        <h2 className="vh">Projects</h2>
        <div className="timeline-area" ref={rocket.areaRef}>
        <Rocket areaRef={rocket.areaRef} />
        <div className="earth" aria-hidden="true">
          <PixelArt rows={EARTH_ART} ink={EARTH_INK} />
        </div>
        <ol className="timeline">
          {projects.map((p, i) => (
            <li key={p.slug} className={`timeline__item ${i === rocket.active ? 'is-current' : ''}`}>
              <p className="when"><span className="when__node" aria-hidden="true"><PixelArt rows={DOT_ART} ink={DOT_INKS[i % DOT_INKS.length]} /></span><time dateTime={p.when.start}>{p.when.label}</time></p>
              <ProjectEntry project={p} />
            </li>
          ))}
        </ol>
        <div className="moon" aria-hidden="true">
          <PixelArt rows={MOON_ART} ink={MOON_INK} />
        </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// Click-to-load: itch.io's player only loads (and only contacts itch.io) when the visitor asks for it.
function GameEmbed({ id }) {
  const [playing, setPlaying] = useState(false)
  return playing ? (
    <div className="embed">
      <iframe src={`https://itch.io/embed-upload/${id}?color=05070c`} title="Animutate, playable in the page" allowFullScreen />
    </div>
  ) : (
    <button type="button" className="btn btn--play" onClick={() => setPlaying(true)}>Play it here</button>
  )
}

export function ProjectPage({ slug }) {
  const p = projects.find((x) => x.slug === slug)
  useEffect(() => { if (p) markVisited(slug) }, [p, slug])
  // The project is hidden (its repo lost the `portfolio` topic) but its page folder remains.
  if (!p) { window.location.replace('/'); return null }
  return (
    <>
      <a className="skip" href="#details">Skip to the details</a>
      <header className="lightbox lightbox--project">
        <div className="lightbox__inner lightbox__inner--project">
          <div className="project-head">
            <a className="back" href="/"><Icon name="back" />Back to the home page</a>
            <h1 className="hero__name hero__name--project">{p.name}</h1>
            <p className="hero__role">{p.when.label}<Sep />{p.tagline}</p>
          </div>
          <div className="project-glass">
            <Glass project={p} large />
          </div>
        </div>
      </header>
      <main id="details" className="drawer drawer--project" tabIndex="-1">
        <div className="card card--entry card--wide">
          <Layer layer={layers[0]} band={p.bands.surface} level={2}>
            {p.embed && <GameEmbed id={p.embed} />}
            <p className="actions">
              {p.links.map((l) => <Ext key={l.href} href={l.href} className="btn btn--line">{l.label}</Ext>)}
            </p>
            {p.note && <p className="card__note">{p.note}</p>}
          </Layer>
          {layers.slice(1).map((l) => <Layer key={l.id} layer={l} band={p.bands[l.id]} level={2} />)}
          <Row name="Credit" title="Who built what">
            <dl className="fields fields--credit">
              <dt>Mine</dt>
              <dd>{p.credit.mine}</dd>
              {p.credit.team && (<><dt>The team’s</dt><dd>{p.credit.team}</dd></>)}
            </dl>
          </Row>
          <Row name="Stack" title="Built with">
            <ul className="tags tags--lg">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </Row>
        </div>
      </main>
      <Footer />
    </>
  )
}
