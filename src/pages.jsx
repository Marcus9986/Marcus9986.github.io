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
        <p className="card__tagline">{project.tagline}</p>
        {layers.map((l) => <Layer key={l.id} layer={l} band={project.bands[l.id]} />)}
        <p className="actions">
          <a className="btn" href={project.href}>Open the project<span className="vh">: {project.name}</span></a>
          {project.links.slice(0, 1).map((l) => <Ext key={l.href} href={l.href} className="btn btn--line">{l.label}</Ext>)}
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
// Star positions on the hero, used in timeline order (newest first). Projects beyond the last
// slot get no star; they're still listed below. Add a slot here if you want one for them.
const STAR_SLOTS = [
  { left: '70%', top: '17%', flip: true },
  { left: '52%', top: '38%' },
  { left: '86%', top: '36%', flip: true },
  { left: '38%', top: '12%' },
  { left: '58%', top: '9%' },
]

export function Home() {
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
        <ol className="timeline">
          {projects.map((p) => (
            <li key={p.slug} className="timeline__item">
              <p className="when"><span className="when__node" aria-hidden="true" /><time dateTime={p.when.start}>{p.when.label}</time></p>
              <ProjectEntry project={p} />
            </li>
          ))}
        </ol>
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
  useEffect(() => markVisited(slug), [slug])
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
