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
//   landed    sitting on a dot while that dot is near the 45% line (the rail's two ends count too)
//   launching leaving a dot: lifts off, then flies one loop around it
//   flying    following the scroll line, floating and swaying
//   landing   easing down onto the next dot the line reaches
// Decorative and hidden from screen readers. With reduced motion: no loop, no float, no easing.
const ROCKET = { SNAP_IN: 60, SNAP_OUT: 80, LIFT: 18, LAUNCH_MS: 1100, FOLLOW: 0.12, SETTLE: 0.16 }
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

function Rocket({ areaRef }) {
  const el = useRef(null)
  useEffect(() => {
    const area = areaRef.current, rocket = el.current
    if (!area || !rocket) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const s = { mode: null, node: 0, x: 0, y: 0, a: 0, t0: 0 }
    let raf = 0

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const box = area.getBoundingClientRect()
      const nodes = [...area.querySelectorAll('.when__node')].map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, r: r.height / 2 }
      })
      if (!nodes.length) return
      const h = rocket.offsetHeight
      const line = window.innerHeight * 0.45 - box.top
      const last = nodes.length - 1
      const rm = reduce.matches
      // Rocket centre when sitting on dot i: its base just above the dot.
      const seat = (i) => ({ x: nodes[i].x, y: nodes[i].y - nodes[i].r - h / 2 - 1 })
      const dist = (i) => Math.abs(line - nodes[i].y)
      // The dot to land on: one near the line, or an end of the rail once the line is past it.
      const target = () => {
        if (line <= nodes[0].y) return 0
        if (line >= nodes[last].y) return last
        return nodes.findIndex((_, k) => dist(k) < ROCKET.SNAP_IN)
      }
      const set = (mode) => { s.mode = mode; s.t0 = now; rocket.dataset.mode = mode }

      if (s.mode === null) { s.node = Math.max(target(), 0); Object.assign(s, seat(s.node)); set('landed') }

      if (s.mode === 'landed') {
        Object.assign(s, seat(s.node)); s.a = 0
        const leaving = s.node === 0 ? line > nodes[0].y + ROCKET.SNAP_OUT
          : s.node === last ? line < nodes[last].y - ROCKET.SNAP_OUT
          : dist(s.node) > ROCKET.SNAP_OUT
        if (leaving) set(rm ? 'flying' : 'launching')
      } else if (s.mode === 'launching') {
        const k = Math.min((now - s.t0) / ROCKET.LAUNCH_MS, 1)
        const n = nodes[s.node], start = seat(s.node)
        if (k < 0.2) {
          // Lift-off: straight up.
          s.x = start.x; s.y = start.y - ROCKET.LIFT * easeInOut(k / 0.2); s.a = 0
        } else {
          // Then one anticlockwise loop that starts around the dot and drifts toward the scroll
          // line as it goes, so a fast scroll doesn't leave the rocket looping off-screen.
          // Nose points the way it's travelling.
          const p = easeInOut((k - 0.2) / 0.8)
          const R = n.y - (start.y - ROCKET.LIFT)
          const lineY = Math.min(Math.max(line, nodes[0].y), nodes[last].y)
          const cy = n.y + (lineY + R - n.y) * p // loop ends with the rocket on the line
          const th = -Math.PI / 2 - 2 * Math.PI * p
          s.x = n.x + R * Math.cos(th); s.y = cy + R * Math.sin(th)
          s.a = ((th + Math.PI / 2) * 180) / Math.PI
        }
        if (k >= 1) { s.a = 0; set('flying') }
      } else if (s.mode === 'flying') {
        const ty = Math.min(Math.max(line, nodes[0].y), nodes[last].y)
        const vy = (ty - s.y) * (rm ? 1 : ROCKET.FOLLOW)
        s.y += vy; s.x += (nodes[0].x - s.x) * (rm ? 1 : 0.2)
        // Lean a little into the direction of travel.
        const lean = Math.max(-18, Math.min(18, vy * 1.5))
        s.a += (lean - s.a) * 0.15
        const i = target()
        if (i >= 0 && !(i === s.node && now - s.t0 < 400)) { s.node = i; set('landing') }
      } else if (s.mode === 'landing') {
        const t = seat(s.node), f = rm ? 1 : ROCKET.SETTLE
        s.x += (t.x - s.x) * f; s.y += (t.y - s.y) * f; s.a *= 0.75
        if (Math.abs(t.y - s.y) < 0.6 && Math.abs(t.x - s.x) < 0.6) set('landed')
        else if (target() !== s.node) set('flying')
      }

      // Float: a gentle bob and sway while flying (render only, so landings stay exact).
      const floating = s.mode === 'flying' && !rm
      const fx = floating ? Math.sin(now / 650) * 3 : 0
      const fy = floating ? Math.sin(now / 460) * 2.5 : 0
      const fa = floating ? Math.sin(now / 820) * 6 : 0
      rocket.style.transform = `translate(${s.x + fx}px, ${s.y + fy}px) translate(-50%, -50%) rotate(${s.a + fa}deg)`
    }

    // Only animate while the timeline is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame)
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { rootMargin: '200px 0px' })
    io.observe(area)
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [areaRef])

  return (
    <div className="rocket" ref={el} aria-hidden="true">
      <svg viewBox="0 0 20 40" focusable="false">
        <path className="rocket__flame" d="M7 30c0 4 1.5 7 3 9 1.5-2 3-5 3-9z" />
        <path className="rocket__fin" d="M5 20 1 27v3l5-3zM15 20l4 7v3l-5-3z" />
        <path className="rocket__body" d="M10 1c3.5 3 5 8 5 14v12H5V15C5 9 6.5 4 10 1z" />
        <circle className="rocket__window" cx="10" cy="14" r="2.6" />
        <path className="rocket__fin" d="M8 27h4v3H8z" />
      </svg>
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
        <ol className="timeline">
          {projects.map((p, i) => (
            <li key={p.slug} className={`timeline__item ${i === rocket.active ? 'is-current' : ''}`}>
              <p className="when"><span className="when__node" aria-hidden="true" /><time dateTime={p.when.start}>{p.when.label}</time></p>
              <ProjectEntry project={p} />
            </li>
          ))}
        </ol>
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
