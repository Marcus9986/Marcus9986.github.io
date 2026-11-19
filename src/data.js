// Every fact here comes from the project repos or from Marcus. Don't add claims that can't be checked.
//
// Adding a project:
//   1. Add an entry to `projectList` below (copy an existing one). `when.end` (YYYY-MM) sets its
//      place on the timeline; newest is shown first. Use `end: null` for work that's still ongoing.
//   2. Put a screenshot in public/img/ and point `image` at it (optional: without one, the project
//      gets a generated star-field plate).
//   3. Copy projects/animutate/index.html to projects/<slug>/index.html and change the <title>,
//      the description and data-page="<slug>". The build picks up the folder automatically.

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
    when: { start: '2023-02', end: '2024-06', label: 'Feb 2023 – Jun 2024' },
    name: 'Animutate',
    tagline: 'A 2D platformer where you change animal to get through',
    href: '/projects/animutate/',
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

// Newest first; ongoing work (end: null) sorts to the top.
export const projects = projectList
  .map((p) => ({ href: `/projects/${p.slug}/`, ...p }))
  .sort((a, b) => (b.when.end ?? '9999').localeCompare(a.when.end ?? '9999'))
