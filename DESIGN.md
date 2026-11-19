---
name: Marcus Secord
description: A dark room of lit glass plates, each project a deep-space image with a cream catalogue card beside it.
colors:
  archive-void: "#05070c"
  plate-glass: "#0b1f3a"
  lightbox-glow: "#2f6fb3"
  ice-ink: "#dfeefc"
  ice-ink-dim: "#9fb8d3"
  cyan-ring-ink: "#8fd3ff"
  nebula-rust: "#c0703a"
  nebula-rust-hi: "#e3a06d"
  catalogue-cream: "#e9e2cf"
  card-ink: "#1a1d24"
  card-ink-2: "#3a3f4a"
  card-muted: "#5a5f6a"
  header-rule-red: "#a8402f"
  ruling-blue: "rgb(52 96 168 / 0.6)"
  star-white: "#ffffff"
  frame-black: "#000000"
  glass-sheen: "rgb(255 255 255 / 0.07)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  display-project:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline-narrow:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  intro:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  tag-large:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  role:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  card: "2px"
  plate: "3px"
spacing:
  pad: "64px"
  pad-narrow: "20px"
  card: "28px"
  card-narrow: "22px"
  column-gap: "48px"
  plate-stack: "128px"
components:
  button-primary:
    backgroundColor: "{colors.plate-glass}"
    textColor: "{colors.catalogue-cream}"
    typography: "{typography.body}"
    rounded: "0px"
    padding: "0.72rem 1rem 0.64rem"
  button-primary-hover:
    backgroundColor: "{colors.lightbox-glow}"
    textColor: "#ffffff"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.plate-glass}"
    padding: "0.72rem 1rem 0.64rem"
  button-line-hover:
    backgroundColor: "{colors.plate-glass}"
    textColor: "{colors.catalogue-cream}"
  button-play:
    backgroundColor: "{colors.header-rule-red}"
    textColor: "{colors.catalogue-cream}"
    padding: "0.72rem 1rem 0.64rem"
  catalogue-card:
    backgroundColor: "{colors.catalogue-cream}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  glass-plate:
    backgroundColor: "{colors.plate-glass}"
    padding: "14px"
  tag:
    textColor: "{colors.card-ink}"
    typography: "{typography.code}"
    padding: "0.1rem 0.45rem"
---

# Design System: Marcus Secord

## Overview

**Creative North Star: "The Plate Archive"**

Visually, the site is an observatory's glass plate collection, kept in the dark. Each project is a plate: a deep-blue image lit on a light box, glowing out of a near-black room. Beside every plate sits a cream catalogue card that records what is underneath the picture: interface, logic, data. The metaphor lives only in the visuals; the copy speaks plainly about projects. The picture is what people see; the card is the computing, and the card is where the reading happens.

Density is low and deliberate. One plate fills the first viewport; project plates stack below it like a drawer, one per entry, each with its card in the next column. Light comes only from the plates and the light box (soft radial blue glows); everything else is the void. The hero sky is procedural SVG (a seeded star field, rust nebula columns mottled by anisotropic noise, a bright warm rim, fine dust), never a stock photograph, and the colophon says it is computer-generated.

The card side is a paper world: cream stock, a thick red header rule, thin blue ruling between rows, and typed mono field labels in a left column. The two worlds meet but never blend: dark ice-ink type on the void, near-black ink on the cream.

**Key Characteristics:**
- Near-black archive room (#05070c) lit only by blue light-box glows.
- Glass plates: deep glass-blue holders around full-colour screenshots.
- Cream catalogue cards with a red header rule, blue row ruling and mono field labels.
- Archivo ExtraBold display, tightly tracked; JetBrains Mono for typed field labels and routes.
- One ring geometry, used only on the hero plate as project links: dashed until visited, solid after.
- Square corners (2-3px at most); depth from glow, not from elevation stacks.

## Colors

A cold blue-black palette with one warm nebula accent and a paper stock that carries its own ink.

### Primary
- **Lightbox Glow** (lightbox-glow): the blue that the light box throws. Radial washes behind the hero and footer, the glow under every plate, button hover fill, scrollbar thumb.
- **Plate Glass** (plate-glass): the deep blue of a plate holder and the default button fill. Also the focus outline colour inside cards.

### Secondary
- **Cyan Ring Ink** (cyan-ring-ink): annotation ink on the dark side. Hero link rings, their hairline leaders and labels, the role line under the name, the global focus outline, selection and caret.

### Tertiary
- **Nebula Rust / Rust Hi** (nebula-rust, nebula-rust-hi): the warm dust of the sky. Rust Hi is the hover stroke of a hero ring; the rest of the rust ramp (#120a07 to #a65a2c, rim #ffd2a0) lives inside the procedural sky. Never a surface fill.
- **Header Rule Red** (header-rule-red): the catalogue card's red. The 3px rule under every card title, the mono layer names, HTTP method cells, link hover inside cards, and the one playable-embed button.

### Neutral
- **Archive Void** (archive-void): page background, theme colour, text shadow behind ring labels.
- **Ice Ink / Ice Ink Dim** (ice-ink, ice-ink-dim): body text and secondary text on the void (intro, plate labels, back link, colophon).
- **Catalogue Cream** (catalogue-cream): card stock; also the text colour on glass buttons and the skip link background.
- **Card Ink, Card Ink 2, Card Muted** (card-ink, card-ink-2, card-muted): headings, body and field labels on cream, in that order of weight.
- **Ruling Blue** (ruling-blue): 1px rules between card rows, field rows and route rows.
- **Star White** (star-white): star cores (hero ring cores, the brightest points of the sky) and button text on the glow hover. Nowhere else.
- **Frame Black** (frame-black): the ground inside a plate frame, behind the toned image.
- **Glass Sheen** (glass-sheen): a 125deg white-to-transparent wash over the hero plate, ending at 35%, so it reads as glass.

### Named Rules
**The Two Stocks Rule.** Dark side and paper side keep their own inks. Ice and cyan inks live on the void; card inks and the red rule live on cream. Never set cream-side ink on the void or ice ink on a card.

**The Blue Plate Rule.** Every project image sits in a glass holder, in full colour. Marcus asked for the blue tone over screenshots to be removed, so don't tone, tint or desaturate them.

## Typography

**Display Font:** Archivo (variable 100-900, self-hosted, with system-ui fallback)
**Body Font:** Archivo
**Label/Mono Font:** JetBrains Mono (variable 100-800, self-hosted, with ui-monospace, Cascadia Mono, Menlo, Consolas)

**Character:** A heavy, tightly tracked grotesque for names and titles against a typed mono for anything that is filed: labels, routes, models. Numerals are tabular everywhere.

### Hierarchy
- **Display** (800, clamp(3.25rem, 7.4vw, 6rem), 0.92): the name on the hero plate. Balanced wrapping.
- **Display, project** (800, clamp(3rem, 6vw, 5.5rem), 0.92): the project name on a project page.
- **Headline** (800, 2rem, 1.05): catalogue card titles, always over the red header rule; 1.75rem under 520px.
- **Title** (700, 1.25rem, 1.25): the heading inside each ruled card row.
- **Body** (400, 1.0625rem, 1.6): running text; card ledes cap at 44ch, row bodies at 62ch.
- **Intro** (400, 1.125rem): the hero intro under the role line, 46ch; drops to body size under 960px.
- **Small** (400, 0.875rem): the colophon, and hero ring labels under 520px.
- **Tag, large** (700, 1rem): stack names on project pages.
- **Role** (700, 0.9375rem, 0.14em tracking, uppercase): the one line under a display name, in cyan ink.
- **Label** (JetBrains Mono, 600-700, 0.75rem, 0.06-0.08em tracking, uppercase): field labels and layer names (Interface, Logic, Data).
- **Code** (JetBrains Mono, 600, 0.8125rem): routes, model tags.
- **Micro** (JetBrains Mono, 700, 0.6875rem, 0.04em): HTTP method cells, and layer names when they become vertical tabs under 520px.

### Named Rules
**The Typed Field Rule.** Mono uppercase belongs to things that are filed: the label column of a ruled row, field labels, route methods. It sits beside its content, never as a decorative line set above a heading.

## Layout

A centred column of 1360px max with a side pad of 64px (20px at 960px and below). The hero is a two-column grid (fluid plate, 440px card) where the plate spans both columns and the contact card overlaps its lower right corner, inset 32px. The plate is min(84vh, 780px) tall (560px on narrow screens).

The drawer below stacks one entry per project: a 7fr / 5fr grid with a 48px gap, 128px between entries, the plate sticky at 32px from the top while its card scrolls. Project pages flip the head to 5fr / 7fr (name left, plate right) and set the card at 820px max, centred.

Card rows are a two-column grid: a 6.25rem mono label column and the content column, separated by a 1px blue rule above. Field lists use 5.5rem (6.5rem for credit) label columns. Under 960px everything collapses to one column and plates stop being sticky. Under 520px field lists stack, route rows become two-line grids, and a layer name turns into a vertical tab (vertical-rl, rotated to read bottom to top) in a 1.1rem column beside its heading; it never stacks above it.

## Elevation & Depth

Depth is light, not lift. The room is flat black; plates glow from behind with a large, soft, blue-tinted shadow, and the light box is a radial blue gradient. Cards cast a soft dark drop as paper resting on the glass. Nothing stacks more than one level, and there are no hover elevations.

### Shadow Vocabulary
- **Plate Glow** (`box-shadow: 0 0 0 1px rgb(143 211 255 / 0.22), 0 40px 90px -30px rgb(47 111 179 / 0.7)`): the hero plate. Project plates use a 1px cyan border plus `0 40px 80px -30px rgb(47 111 179 / 0.65)`.
- **Paper Drop** (`box-shadow: 0 24px 50px -18px rgb(0 0 0 / 0.75)`): every catalogue card.

### Named Rules
**The Light Box Rule.** Only plates emit light. Blue glow belongs under glass; cards get the dark paper drop; nothing else glows.

## Shapes

Square-edged archive objects. Plates round to 3px, cards to 2px, buttons and tags not at all. Borders are thin and functional: 1px tag outlines, a 2px inset line on outline buttons, a 2px glass border around an embed. The one circular form is the hero link ring (r 27 in a 64 viewBox, 1.5 stroke) with a small white core and a 24px hairline leader to its label.

## Components

### Buttons
Flat, square, heavy-weight text; a block of glass on cream.
- **Shape:** square corners (0).
- **Primary:** plate-glass fill, cream text, 700 weight, padding 0.72rem 1rem 0.64rem, optional trailing icon at 0.4rem gap.
- **Hover / Focus:** fill shifts to lightbox-glow with white text over 160ms (cubic-bezier(0.16, 1, 0.3, 1)); focus is a 2px outline offset 3px (plate-glass inside cards, cyan elsewhere).
- **Line:** transparent with a 2px inset plate-glass line; hover fills with glass.
- **Play:** header-rule-red fill, used once for the click-to-load game embed.

### Cards / Containers
- **Corner Style:** 2px.
- **Background:** catalogue cream with card inks.
- **Shadow Strategy:** Paper Drop (see Elevation).
- **Border:** none; the title carries a 3px red rule beneath it, rows are divided by 1px ruling blue.
- **Internal Padding:** 28px (22px under 960px).

### Glass Plate (signature)
A glass-blue holder (14px padding, 1px cyan border at 22%, blue glow) around a black frame, with nothing written on it. The image inside is toned blue and starts dimmed (brightness 0.6); when 20% of the plate enters the viewport it brightens over 1100ms (cubic-bezier(0.16, 1, 0.3, 1)). Reduced motion removes the transition; without JS the plate is lit from the start.

### Hero Link Rings
Ringed stars on the hero plate only, each a link to that project on the page. Dashed (5 5) cyan ring until that project page has been visited, solid after; ring stroke turns rust-hi on hover and the label underlines. Labels sit beyond a hairline leader, a mono project number in ice ink before the project name, with a void text shadow for legibility over the sky. Rings shrink to 48px under 520px.

### Ruled Rows and Fields
Card content is filed in rows (Interface, Logic, Data, then Credit and Stack on project pages): mono red layer name in the left column, title and body in the right, a blue rule above. Contact and credit use the same idea as a definition list with muted mono labels and bold values. Routes are a mono table with red method cells; data models and stacks are outlined tags.

### Navigation
No nav bar. A skip link (cream on ink, revealed on focus), anchor links from the hero rings and the contact card's browse link, and a back link (ice-ink-dim to ice on hover, leading arrow icon) on project pages.

### Icons
Drawn 24px-grid strokes at 2.25 width with square caps, sized 1.05em, in currentColor: down, out (new tab), back, mail.

## Do's and Don'ts

### Do:
- **Do** show every project image in full colour inside a glass holder; never tint or desaturate it.
- **Do** put primary actions (email, LinkedIn, GitHub) on a cream catalogue card with typed field labels.
- **Do** separate card rows with 1px ruling blue and lead each with a mono red layer name in a label column.
- **Do** keep the 3px red rule under every card title.
- **Do** keep the ring geometry to the hero plate, dashed for unvisited and solid for visited links.
- **Do** keep the sky imagery procedural and say so in the colophon.
- **Do** respect reduced motion: no smooth scroll and no plate brightening transition.

### Don't:
- **Don't** put annotation rings or numbered legends on project plates; rings mark hero links only.
- **Don't** give project cards a glow or make them dark glass cards; cards are cream paper with a dark drop.
- **Don't** round corners beyond 3px or add pills.
- **Don't** set a mono uppercase line above a heading as a kicker or eyebrow.
- **Don't** use unicode arrows or glyph icons; use the drawn stroke icons.
- **Don't** use plate, archive, exposure or similar observatory jargon in site copy (user decision: plain words everywhere). Say project; the plate idea lives in the visuals only.
- **Don't** print labels, stamps or captions on the plates themselves.
- **Don't** introduce a second warm accent; rust and the header red cover every warm role.
