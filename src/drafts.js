// Project entries drafted by the /draft-projects command in Claude Code.
// Once reviewed they're yours: edit them freely, move them into src/data.js, or delete them.
// Same shape as the entries in src/data.js; anything left out is filled from the synced repo.
// Fill in every TODO before committing; an unresolved TODO shows on the site as written.
export const drafts = [
  {
    slug: 'svmods',
    repo: 'SVMODS',
    name: 'Stardew Valley Mods',
    tagline: 'Two small mods for Stardew Valley',
    bands: {
      surface: {
        title: 'Two small Stardew Valley mods',
        body: 'Blue Cursor swaps the game’s default cursor for a plain blue one. FirstMod was my first SMAPI mod. TODO: what FirstMod does in the game.',
      },
      logic: {
        title: 'A SMAPI mod and a Content Patcher pack',
        body: 'FirstMod is a compiled SMAPI mod that needs SMAPI 3.0 or later. Blue Cursor needs no code: it’s a Content Patcher pack that edits the game’s cursor sprite sheet.',
        routes: [
          ['SMAPI', 'FirstMod.dll'],
          ['Content Patcher', 'EditImage → LooseSprites/Cursors'],
        ],
      },
      data: {
        title: 'A manifest per mod, one patch file',
        body: 'Each mod describes itself in a manifest.json: name, version and unique ID. Blue Cursor’s content.json replaces a 10×10 area of the cursor sprite with its own image.',
        models: ['manifest.json', 'content.json'],
      },
    },
    credit: { mine: 'TODO: what you built yourself', team: null },
    stack: ['SMAPI', 'Content Patcher', 'JSON'],
  },
  {
    slug: 'cisc486gd-extraterrestrial-entertainment',
    repo: 'CISC486GD-extraterrestrial-entertainment',
    when: { start: '2025-09', end: '2025-12', label: 'Sep - Dec 2025' },
    name: 'Extraterrestrial Entertainment',
    tagline: 'A stand-up comedy game played to a crowd of aliens',
    bands: {
      surface: {
        title: 'Win over an alien crowd at a galactic comedy bar',
        body: 'You play a human stand-up comedian at an intergalactic comedy bar. You build jokes from alien words you don’t understand yet, and each alien race likes different kinds of jokes. Made in Unity by a team of three for CISC 486 at Queen’s.',
      },
      logic: {
        title: 'State machines and a behaviour tree',
        body: 'Player movement, the joke system and alien emotions each run as a finite state machine. Alien movement runs on a behaviour tree with weighted random choices, and Unity’s NavMesh handles pathfinding with seek, arrive and collision avoidance.',
        routes: [
          ['C#', 'PlayerScript · CameraController'],
          ['C#', 'Bar Entrance · Revolution'],
          ['C#', 'JokeManager · Joke · Word'],
          ['C#', 'AlienMovement · WeightedRandomSequence'],
        ],
      },
      data: {
        title: 'Alien moods and the audience score',
        body: 'Each alien keeps a happiness value that moves it between six emotion states, from Very Angry to Very Happy, and sets how many points a joke earns. Only aliens sitting in listening chairs count toward the score.',
        models: ['JokeManager', 'Joke', 'Word', 'ScoreScript', 'CurrentScore'],
      },
    },
    credit: {
      mine: 'I found the free assets (terrain, planets and sun, skybox, building, character model), built the terrain and the bar’s interior, and did the level design. I wrote the player and camera movement, the animation state machine (idle, running, floating), the orbiting planets, and the gravity change when entering or leaving the bar. TODO: add your Assignment 3 and later work (e.g. LevelSelect, PauseMenu, CurrentScore, AudioLevel).',
      team: 'Nicholas Tillo built the joke system, its UI, the microphone and scoring. Kabeer Adil handled the alien assets and the alien emotion states.',
    },
    stack: ['Unity', 'C#', 'Unity NavMesh', 'Unity Input System'],
    links: [
      { label: 'Watch the demo', href: 'https://www.youtube.com/watch?v=O5wmU3lJKOU', external: true },
      { label: 'View on GitHub', href: 'https://github.com/Marcus9986/CISC486GD-extraterrestrial-entertainment', external: true },
    ],
        image: { src: '/img/EE-Screenshot.png', alt: 'The title screen for Extraterrestial Entertainment, a space bar, with the comedy stage and alien audience', width: 1200, height: 750 },
  },
  {
    slug: 'nsa-spherex',
    repo: 'NSA-SPHEREX',
    when: { start: '2026-11', end: '2026-11', label: 'Nov 2026' },
    name: 'Planet X and SPHEREx',
    tagline: 'A web app for exploring NASA’s SPHEREx infrared sky survey',
    bands: {
      surface: {
        title: 'Every SPHEREx image of any spot in the sky',
        body: 'Pick a position or search an object by name, and see every image SPHEREx has taken of it. Play them back over time, sweep across wavelengths from 0.75 to 5 µm, and subtract one night from another to look for anything that moved. Built by a team for the 2026 NASA Space Apps Challenge.',
      },
      logic: {
        title: 'A FastAPI backend and a WebGL2 renderer',
        body: 'The Python backend asks NASA/IPAC’s IRSA for every image covering the target, downloads a small cutout of each, and lines them all up on the same north-up grid. The React front end draws the raw pixels with WebGL2, and the image processing runs as GPU shaders.',
        routes: [
          ['GET', '/api/spherex/images'],
          ['GET', '/api/spherex/image/meta · /image/data'],
          ['GET', '/api/spherex/diff/meta · /diff/data'],
          ['GET', '/api/survey/list · /images · /data'],
          ['GET', '/api/solar-system/bodies'],
          ['GET', '/api/resolve'],
        ],
      },
      data: {
        title: 'Live survey data, cached at every step',
        body: 'Every image is real SPHEREx data fetched live from IRSA, with 2MASS, WISE and DSS2 for comparison. Search results are cached for a day in a JSON file per position, cutouts sit in a size-limited disk cache, and the view state lives in the URL so any view can be shared.',
        models: ['useFrames', 'urlState', 'processing', 'data/objects', 'data/land'],
      },
    },
    credit: {
      mine: 'The FastAPI backend’s SPHEREx side: searching IRSA, cutouts and difference imaging, plus the API docs and Python setup. On the front end I wrote the client that talks to the backend, the image timeline and playback, the sidebar with every frame’s metadata, the target form, shareable URLs, drag-to-change inputs and the coastlines on the sky gizmo. I also built the export menu and deployed it to Vercel.',
      team: 'Hunter Coker set up the React and Vite app and its panel layout, and wrote the WebGL2 renderer, the image-processing shaders, the sky gizmo, the measure tool, object search, the known-bodies overlay and the survey comparison views, with their backend endpoints.',
    },
    stack: ['React', 'TypeScript', 'Vite', 'WebGL2', 'Python', 'FastAPI', 'astropy', 'astroquery', 'NumPy', 'SciPy', 'Vercel'],
  },
  // END DRAFTS (new drafts are inserted above this line)
]
