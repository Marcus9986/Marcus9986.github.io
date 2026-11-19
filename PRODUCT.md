# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (Vite), deployed to GitHub Pages (`Marcus9986.github.io`). The user chose React when offered static HTML, Astro or Vite with vanilla JS. The current site is plain HTML/CSS, and a full overhaul will replace it.

## Users

There are two audiences, with the portfolio audience first:

- **Employers and recruiters** judging Marcus as a developer, with a focus on backend and web work.
- **Friends, players and fellow developers** who come for the projects and games.

## Product Purpose

This is Marcus Secord's personal site. He has a Bachelor's in Computer Science, specializing in Software Design, from Queen's University in Kingston, Ontario. The site presents him as a web developer who leans toward backend work, with game development as a side passion. A visit succeeds when the visitor either **gets in touch** (email or LinkedIn) or **browses his projects**. Both are primary actions.

The overhaul starts with a new landing page as the main page. Other surfaces come later.

## Positioning

He is a developer focused on backend and web work who also ships games. Animutate, released on itch.io, shows he can finish and publish work.

## Operating Context

- The site is hosted on GitHub Pages, so it must be static output with no server runtime.
- Visitors usually arrive from a LinkedIn profile, a GitHub profile, a CV link, or a link shared by Marcus.

## Capabilities and Constraints

- Contact email: `marcussecord@gmail.com`, which may be shown publicly on the site.
- External profiles: GitHub `https://github.com/Marcus9986`, LinkedIn `https://www.linkedin.com/in/marcus-secord`, itch.io `https://marcus9986.itch.io/`.
- Animutate is embedded from itch.io (embed id `7705905`). If the embed fails, the page links to the game on itch.io.

## Brand Commitments

- Name: Marcus Secord. The current site title is "Marcus' Website".
- No other voice, logo or identity commitments yet.

## Evidence on Hand

- **Rouge Valley Conservation Centre site** (Queen's Web Development Club group project, Next.js + Express + MongoDB). Marcus wrote most of the Express REST API (`src/server/app.js`, 18 of 20 commits): CRUD routes for alerts, education programs, kids' programs, special events and general content, MongoDB/Mongoose models and the database connection, Cloudinary photo uploads, and the content dashboards. The JWT admin login was written by a teammate, so don't credit it to Marcus. The repo is private. The public demo, a stripped-down version without the dashboard or outdated information, is at `https://ws26t04-rougevalley-test.vercel.app/`.
- **Animutate**: a Unity (C#) game on itch.io, with a public repo at `https://github.com/Marcus9986/Animutate-main` (all 30 commits by Marcus) and a screenshot at `img/Animutate.png`.
- The old pages (rental mockup, loading screen, JS test, projects list) don't carry over to the new site.
- **Absent, do not fabricate**: testimonials, employers and metrics. Leave them off the site until real ones exist, with no placeholder slots. The skills list is deferred, so leave it off for now. Don't show the graduation year.

## Product Principles

1. **Backend first, games second.** Lead with developer credibility. Games show range and can ship, but they don't define him.
2. **Two equal exits.** Every surface should make both actions easy: contacting Marcus and seeing more work.
3. **Real work only.** Show projects that exist. A missing project gets a placeholder slot, not filler.
4. **Static and fast.** Everything must build to static files for GitHub Pages.
