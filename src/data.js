// Every fact here comes from the project repos or from Marcus. Don't add claims that can't be checked.
import syncedRepos from './repos.json'
import { drafts } from './drafts.js'

// Slugs that have a page folder (projects/<slug>/index.html); found at build time.
const PAGES = new Set(Object.keys(import.meta.glob('/projects/*/index.html')).map((k) => k.split('/')[2]))
//
// Adding a project:
//   1. Add an entry to `projectList` below (copy an existing one). `when.end` (YYYY-MM) sets its
//      place on the timeline; newest is shown first. Use `end: null` for work that's still ongoing.
//   2. Put a screenshot in public/img/ and point `image` at it (optional: without one, the project
//      gets a generated star-field plate).
//   3. Copy projects/rouge-valley/index.html to projects/<slug>/index.html and change the <title>,
//      the description and data-page="<slug>". The build picks up the folder automatically.
//
// GitHub sync: public repos tagged with the `portfolio` topic are saved to src/repos.json
// (scripts/sync-repos.mjs, run before every build and daily on GitHub Actions) and added to the
// timeline. A repo with no entry here gets a simple card: description, language, topics, dates
// and a GitHub link. To add hand-written parts, write an entry here with `repo` set to the repo's
// name: every field you write wins, and any field you leave out (name, tagline, when, stack,
// links) is filled from GitHub. Give it `bands` and a page folder for the full card and page.

export const contact = {
  email: 'marcussecord@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marcus-secord',
  github: 'https://github.com/Marcus9986',
}

// How every project is read, top to bottom: what people see, the logic that runs it, and the data underneath.
export const layers = [
  { id: 'surface', name: 'Interface' },
  { id: 'logic', name: 'Logic' },
  { id: 'data', name: 'Data' },
]

const projectList = [
  {
    slug: 'rouge-valley',
    when: { start: '2026-03', end: '2026-09', label: 'Mar – Sep 2026' },
    name: 'Rouge Valley',
    tagline: 'The REST API under a conservation centre’s website',
    href: '/projects/rouge-valley/',
    image: { src: '/img/rouge-valley.webp', alt: 'The Rouge Valley Conservation Centre home page: the centre’s name and introduction on green beside a photo of children examining pond samples with a magnifying glass.', width: 1200, height: 750 },
    bands: {
      surface: {
        title: 'A site for the Rouge Valley Conservation Centre',
        body: 'Built with a Queen’s Web Development Club team: programs, camps, events, trails and a photo gallery, all served from one database the centre’s staff can update.',
        links: [{ label: 'Open the live site', href: 'https://ws26t04-rougevalley-test.vercel.app/', external: true }],
      },
      logic: {
        title: 'An Express REST API, which I wrote',
        body: 'Create, read, update and delete for every kind of content on the site, with request validation through express-validator.',
        routes: [
          ['GET POST PUT DELETE', '/alerts'],
          ['GET POST PUT DELETE', '/educationProgram'],
          ['GET POST PUT DELETE', '/kidsProgram'],
          ['GET POST PUT DELETE', '/specialEvents'],
          ['GET POST PUT DELETE', '/general'],
          ['POST', '/img'],
        ],
      },
      data: {
        title: 'MongoDB through Mongoose, photos on Cloudinary',
        body: 'Each content type is a Mongoose model. Uploaded photos go to Cloudinary, and the database stores their URLs.',
        models: ['Alert', 'EducationProgram', 'KidsProgram', 'SpecialEvent', 'General', 'Photo'],
      },
    },
    credit: {
      mine: 'The Express API (18 of 20 commits to the server), the KidsProgram and Photo models, the database connection, Cloudinary uploads, and the staff content dashboards.',
      team: 'The Next.js front end, the other models, and the admin login.',
    },
    stack: ['Express 5', 'Node.js', 'MongoDB', 'Mongoose', 'Cloudinary', 'Next.js', 'React'],
    links: [
      { label: 'Open the live site', href: 'https://ws26t04-rougevalley-test.vercel.app/', external: true },
    ],
    note: 'The public site is a stripped-down version without the staff dashboard. The repository is private.',
  },
  {
    slug: 'animutate',
    repo: 'Animutate-main',
    when: { start: '2023-02', end: '2024-06', label: 'Feb 2023 – Jun 2024' },
    name: 'Animutate',
    tagline: 'A 2D platformer where you change animal to get through',
    embed: '7705905', // itch.io embed-upload id
    image: { src: '/img/animutate.webp', alt: 'Animutate title screen: hand-drawn lettering with a hare, frog and fish over a teal pixel-art forest, with Play and Quit buttons.', width: 1200, height: 747 },
    bands: {
      surface: {
        title: 'A shapeshifting platformer, playable in the browser',
        body: 'Switch between a hare, a frog, a fish and a spider to get through each level. Made in Unity for CISC 226 at Queen’s.',
        links: [{ label: 'Play on itch.io', href: 'https://marcus9986.itch.io/animutate', external: true }],
      },
      logic: {
        title: 'One player controller, four animal forms',
        body: 'Each form is its own C# script on a shared PlayerController. The spider fires webs. The levels add moving platforms, shooting spikes, and mushrooms that flip gravity, light the way, or rewind you.',
        routes: [
          ['C#', 'PlayerController'],
          ['C#', 'Hare · Frog · Fish · Spider'],
          ['C#', 'GravityShroom · RewindShroom'],
        ],
      },
      data: {
        title: 'Checkpoints, unlocks and a speedrun timer',
        body: 'Checkpoints and respawns hold your progress through a level. Levels unlock in order from a level select, and a speedrun timer and death counter keep score.',
        models: ['Checkpoint', 'Respawn', 'LevelSelect', 'LockLevels', 'SpeedrunTimer', 'DeathCounter'],
      },
    },
    credit: {
      mine: 'Every commit in the repository (30 of 30).',
      team: null,
    },
    stack: ['Unity', 'C#'],
    links: [
      { label: 'Play on itch.io', href: 'https://marcus9986.itch.io/animutate', external: true },
      { label: 'Read the code on GitHub', href: 'https://github.com/Marcus9986/Animutate-main', external: true },
    ],
    note: null,
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const month = (ym) => `${MONTHS[+ym.slice(5, 7) - 1]} ${ym.slice(0, 4)}`

// A synced repo's dates are when the repo was created and last pushed, not necessarily when the work happened.
export function repoToProject(r) {
  // A fork's `created` is the day it was forked, which can be after its last push and says nothing
  // about the work, so then the last push is used for both ends.
  const end = r.pushed.slice(0, 7)
  const start = r.created.slice(0, 7) <= end ? r.created.slice(0, 7) : end
  return {
    slug: r.name.toLowerCase(),
    repo: r.name,
    synced: true,
    name: r.name.replace(/[-_]+/g, ' '),
    tagline: r.description || '',
    when: { start, end, label: start === end ? month(end) : `${month(start)} – ${month(end)}` },
    stack: [r.language, ...r.topics].filter(Boolean),
    links: [
      ...(r.homepage ? [{ label: 'Open the live site', href: r.homepage, external: true }] : []),
      { label: 'View on GitHub', href: r.url, external: true },
    ],
  }
}

// Hand-written fields win; the synced repo named in `repo` fills in whatever the entry leaves out.
// Entries without `repo` (e.g. a private project) always show and must have their own `when`.
// Entries with `bands` get the full card and a project page; the rest use the simple card.
export function mergeProjects(handWritten, repos) {
  const byName = new Map(repos.map((r) => [r.name, r]))
  const full = (p) => ({ href: PAGES.has(p.slug) ? `/projects/${p.slug}/` : null, ...p, synced: false })
  const merged = handWritten
    // The `portfolio` topic is the on/off switch: an entry linked to a repo shows only while that
    // repo is tagged. Your text stays in the file, so re-tagging brings it back.
    .filter((p) => !p.repo || byName.has(p.repo))
    .map((p) => {
      const base = p.repo ? { ...repoToProject(byName.get(p.repo)), ...p } : p
      return base.bands ? full(base) : { ...base, synced: true }
    })
  const covered = new Set(handWritten.map((p) => p.repo).filter(Boolean))
  return [...merged, ...repos.filter((r) => !covered.has(r.name)).map(repoToProject)]
    .sort((a, b) => (b.when.end ?? '9999').localeCompare(a.when.end ?? '9999')) // newest first; ongoing on top
}

export const projects = mergeProjects([...projectList, ...drafts], syncedRepos)
