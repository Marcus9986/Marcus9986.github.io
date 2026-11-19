# Marcus Secord's portfolio site

The source for [marcus9986.github.io](https://marcus9986.github.io/): a React site built with Vite and published to GitHub Pages. Projects come from two places: entries written by hand, and GitHub repos tagged `portfolio`.

## Quick start

```bash
npm install      # once, after cloning
npm run dev      # local preview at http://localhost:5173 (syncs repos first)
npm run build    # production build into dist/ (also syncs repos first)
npm run sync     # just refresh the GitHub repo snapshot
```

## How it fits together

```
index.html                    home page shell
projects/<slug>/index.html    one shell per project page (found automatically)
src/
  main.jsx                    starts React, picks the page from data-page="..."
  pages.jsx                   what the pages look like (components)
  Exposure.jsx                the generated star field and nebula
  data.js                     your content: contact details + hand-written projects
  drafts.js                   entries drafted by /draft-projects (yours once committed)
  repos.json                  snapshot of your tagged GitHub repos (generated)
  styles.css                  all styling; colours are variables at the top
scripts/
  sync-repos.mjs              fetches public repos tagged `portfolio` into src/repos.json
  draft-context.mjs           finds new or changed repos for /draft-projects
.claude/commands/
  draft-projects.md           the /draft-projects command for Claude Code
.github/workflows/deploy.yml  builds and publishes the site
```

Every word and link on the site comes from `src/data.js`, `src/drafts.js` and `src/repos.json`. To change content, edit those files rather than the components.

## How projects are put together

- **Synced repos (`src/repos.json`).** Each public repo with the `portfolio` topic, except forks and archived repos, is saved here: name, description, language, topics, homepage and dates. The snapshot only changes when something changes on GitHub.
- **Hand-written entries (`src/data.js` and `src/drafts.js`).** An entry with `repo: '<repo-name>'` is merged with that repo:
  - **Every field you write wins.**
  - Any field you leave out (`name`, `tagline`, `when`, `stack`, `links`) is filled from GitHub and stays current.
- **Simple and full cards.** A tagged repo with no entry gets a simple card: description, tags, dates and a GitHub link. An entry with `bands` (the Interface / Logic / Data rows) gets the full card. It gets its own page too if `projects/<slug>/index.html` exists.
- **Order.** Projects are listed newest first by `when.end`, and `end: null` (ongoing) goes on top. The first five also get a star on the home page.

## Adding or updating projects

### The usual way: tag the repo, then run `/draft-projects`

1. **Tag the repo on GitHub.** On the repo's page, click ⚙ next to **About** and add `portfolio` under **Topics**. It must be a public repo.

   The site picks it up as a simple card on the next deploy, either your next push or the daily scheduled build.

2. **Draft the entry with Claude Code.** In this project, run:

   ```
   /draft-projects
   ```

   It syncs your repos and compares them with the `src/repos.json` in your **last commit**:
   - **New repos** (tagged since then, no entry yet) get a drafted entry in `src/drafts.js` and a page in `projects/<slug>/`.
   - **Changed repos** (already have an entry, pushed since then) get suggested edits listed in the reply. Your entries are never edited.

   It finishes with a checklist of what you need to confirm. It runs on your Claude plan, with no API key or bill.

   To see what's pending without drafting anything:

   ```bash
   node scripts/draft-context.mjs --list
   ```

3. **Review.** Run `npm run dev` and check the new project on the timeline and its page. Then edit `src/drafts.js`:
   - Replace every `TODO`. It shows on the site exactly as written. Always fill in `credit.mine` (what you built).
   - Add real dates if the repo's are wrong:
     ```js
     when: { start: '2024-01', end: '2024-03', label: 'Jan – Mar 2024' },
     ```
   - Fix anything that's wrong or doesn't sound like you.
   - For changed repos, apply whichever suggested edits you agree with to the entry.

4. **Commit and push, including `src/repos.json`.**

   ```bash
   git add -A
   git commit -m "Add drafted project entries"
   git push
   ```

   `src/repos.json` is the snapshot `/draft-projects` compares against. If you leave it out, the same repos are reported as new or changed again next time.

**Don't want a draft?** Delete its entry from `src/drafts.js` and its `projects/<slug>/` folder, then commit (with `src/repos.json`). The repo stays as a simple card while it has the topic; remove the topic to take it off the site.

### Writing an entry by hand

1. Add an entry to `projectList` in `src/data.js`; copying the Rouge Valley entry is the easiest start. Set `repo` if it has a tagged repo to merge with.
2. Optionally put a screenshot in `public/img/` and point `image` at it. Without one, the project gets a generated star-field picture.
3. For a project page, copy `projects/rouge-valley/index.html` to `projects/<slug>/index.html`, then change the `<title>`, the description and `data-page="<slug>"`.

### Other common edits

| To… | Do this |
|---|---|
| Hide a repo | Remove its `portfolio` topic |
| Let GitHub keep a field current | Delete that field from the hand-written entry |
| Change contact details | Edit `contact` at the top of `src/data.js` |
| Change colours, fonts or spacing | Edit the variables at the top of `src/styles.css` |
| Add a star position on the home page | Add a slot to `STAR_SLOTS` in `src/pages.jsx` |

## Publishing

Pushing to `main` deploys the site through `.github/workflows/deploy.yml`, which installs, syncs repos, builds and publishes `dist/`. It also runs daily, so newly tagged repos appear without a push.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

## Design and product notes

- `PRODUCT.md` records the facts about Marcus and his projects that the site may state.
- `DESIGN.md` records the design system: colours, type, components, and what to avoid. The site's copy uses plain words; the observatory "plate" idea is in the visuals only.
- `.impeccable/` holds working files for the design tooling.
