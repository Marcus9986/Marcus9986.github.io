// Finds repos that need a drafted entry and prints what's needed to write it. Used by the
// /draft-projects command in Claude Code (.claude/commands/draft-projects.md). Calls no AI.
//
//   node scripts/draft-context.mjs                    report + full context for each repo
//   node scripts/draft-context.mjs --list             just the report
//   node scripts/draft-context.mjs --previous <file>  compare against this snapshot (testing)
//
// "New" = tagged `portfolio` since the last committed src/repos.json and with no entry in
// src/data.js or src/drafts.js. "Changed" = has an entry and was pushed since that snapshot.
// Run `npm run sync` first so src/repos.json is current.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const OWNER = 'Marcus9986'
const LIST_ONLY = process.argv.includes('--list')
const README_LIMIT = 40000
const SKIP = /(^|\/)(node_modules|Library|Packages|Temp|Logs|obj|bin|dist|build|\.git|vendor)(\/|$)|\.(meta|png|jpe?g|gif|webp|ico|svg|mp3|wav|ogg|fbx|mat|asset|prefab|unity|lock)$/i

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site-drafts' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function github(path, raw = false) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: raw ? { ...headers, Accept: 'application/vnd.github.raw' } : headers,
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`)
  return raw ? res.text() : res.json()
}

const current = JSON.parse(readFileSync('src/repos.json', 'utf8'))
const prevArg = process.argv.indexOf('--previous')
let previous
try {
  previous = JSON.parse(prevArg > 0
    ? readFileSync(process.argv[prevArg + 1], 'utf8')
    : execSync('git show HEAD:src/repos.json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))
} catch { previous = current } // no committed snapshot yet: treat every repo as known

const entrySource = readFileSync('src/data.js', 'utf8') + '\n' + readFileSync('src/drafts.js', 'utf8')
const withEntry = new Set([...entrySource.matchAll(/repo:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))
const before = new Map(previous.map((r) => [r.name, r]))

const fresh = current.filter((r) => !before.has(r.name) && !withEntry.has(r.name))
const changed = current.filter((r) => withEntry.has(r.name) && before.has(r.name) && before.get(r.name).pushed !== r.pushed)

console.log(`NEW (draft an entry): ${fresh.map((r) => r.name).join(', ') || 'none'}`)
console.log(`CHANGED (suggest updates): ${changed.map((r) => r.name).join(', ') || 'none'}`)
if (LIST_ONLY || (!fresh.length && !changed.length)) process.exit(0)

async function context(r) {
  const [readme, languages, tree] = await Promise.all([
    github(`/repos/${OWNER}/${r.name}/readme`, true),
    github(`/repos/${OWNER}/${r.name}/languages`),
    github(`/repos/${OWNER}/${r.name}/git/trees/HEAD?recursive=1`),
  ])
  const files = (tree?.tree || []).filter((t) => t.type === 'blob' && !SKIP.test(t.path)).map((t) => t.path)
  let text = readme || '(no README)'
  if (text.length > README_LIMIT) text = text.slice(0, README_LIMIT) + `\n\n[README cut here: it is ${text.length} characters]`
  return [
    `Repository: ${OWNER}/${r.name} (${r.url})`,
    `Description: ${r.description || '(none)'}`,
    `Homepage: ${r.homepage || '(none)'}`,
    `Topics: ${r.topics.join(', ') || '(none)'}`,
    `Repo dates: created ${r.created.slice(0, 10)}, last pushed ${r.pushed.slice(0, 10)}`,
    `Languages (bytes): ${JSON.stringify(languages || {})}`,
    `Files (${files.length}${files.length > 300 ? ', first 300 shown' : ''}):\n${files.slice(0, 300).join('\n')}`,
    `README:\n${text}`,
  ].join('\n\n')
}

for (const r of fresh) {
  console.log(`\n${'='.repeat(70)}\nNEW: ${r.name}\n<repo>\n${await context(r)}\n</repo>`)
}
for (const r of changed) {
  const since = before.get(r.name).pushed
  const commits = (await github(`/repos/${OWNER}/${r.name}/commits?since=${since}&per_page=30`)) || []
  const start = entrySource.search(new RegExp(`repo:\\s*['"]${r.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`))
  const entry = entrySource.slice(Math.max(0, entrySource.lastIndexOf('\n  {', start)), entrySource.indexOf('\n  },', start) + 5)
  console.log(`\n${'='.repeat(70)}\nCHANGED: ${r.name} (since ${since.slice(0, 10)})`)
  console.log(`<repo>\n${await context(r)}\n\nCommits since then:\n${commits.map((c) => `- ${c.commit.message.split('\n')[0]}`).join('\n') || '(none listed)'}\n</repo>`)
  console.log(`<current-entry>\n${entry}\n</current-entry>`)
}
