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
  // END DRAFTS (new drafts are inserted above this line)
]
