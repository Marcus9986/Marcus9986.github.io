// Fetches public GitHub repos tagged with the `portfolio` topic and writes them to src/repos.json.
// Runs before every dev server start and build. If GitHub can't be reached, the last
// src/repos.json is kept so the site still builds.
import { writeFileSync, existsSync } from 'node:fs'

const USER = 'Marcus9986'
const TOPIC = 'portfolio'
const OUT = new URL('../src/repos.json', import.meta.url)

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site-sync' }
// In GitHub Actions this raises the API rate limit; locally it's optional.
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

try {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?type=owner&per_page=100&sort=pushed`, { headers })
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`)
  const repos = (await res.json())
    .filter((r) => !r.fork && !r.archived && !r.private && r.topics?.includes(TOPIC))
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      topics: r.topics.filter((t) => t !== TOPIC),
      created: r.created_at,
      pushed: r.pushed_at,
    }))
  writeFileSync(OUT, JSON.stringify(repos, null, 2) + '\n')
  console.log(`sync-repos: ${repos.length} repo(s) tagged "${TOPIC}"`)
} catch (err) {
  if (!existsSync(OUT)) writeFileSync(OUT, '[]\n')
  console.warn(`sync-repos: keeping the previous src/repos.json (${err.message})`)
}
