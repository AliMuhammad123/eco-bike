# Eco Bike — Ride the Future

Cinematic brand site for the Eco Bike electric motorcycle.
Next.js 15 (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploys as a fully static page: push to GitHub and import into Vercel (or run `next build` on any Node host).

## Structure

```
app/
  layout.tsx            SEO metadata, viewport, fonts, grain overlay
  page.tsx              Section order + JSON-LD Product schema
  opengraph-image.tsx   Generated social card
  sitemap.ts, robots.ts, icon.svg
components/
  bike/Bike.tsx         Code-drawn, configurable bike (colour, wheels, seat, lights, accessories)
  bike/Scenes.tsx       Code-drawn environments (city, sunrise, road, coast, mountain, night, commute)
  bike/SceneStage.tsx   Crossfading scene + riding bike; optional real video per scene
  core/                 SmoothScroll (Lenis↔GSAP), Nav, Intro, Cursor, Magnetic, SplitText,
                        Counter, Modal, SectionHead, SpeedField (WebGL), Logo
  sections/             One file per section, in page order
lib/
  content.ts            ALL copy and product figures — edit here
  bike.ts               Build options, prices, range maths, share-link encoding
  ride-ai.ts            Ride AI answer engine (on-device, deterministic)
  build-context.tsx     Shared state: current build, test-ride + film dialogs
```

## Sections

Hero (pinned scroll: camera orbit, headlight, battery fill, call-outs, night → sunrise → open road, WebGL speed field) ·
Bike Explorer (8 hotspots, zoom + info card) · Spec scroll (pinned, animated counters) · Energy Flow (live schematic) ·
Smart Dashboard (Eco/City/Sport/Boost) · Sound → Silence (pinned waveform story) · Build Your Bike (saves locally + share link) ·
Ride AI · Charging map (filters, charge-time calculator, route planner) · Technology story (horizontal pin) ·
Performance (torque curves + small multiples, table view) · Lifestyle (5 environments) · Lifecycle · Final CTA · Footer.
"Watch the Experience" opens a full-screen film reel; "Book a Test Ride" opens a validated form.

> **Update:** the page has been simplified — see "Page order" below. The list above describes every section file.

## Real bike photos

Put your photos in `public/images/` with these names (paths are set in `PHOTOS` in `lib/content.ts`):

| File | Where it shows | Best shot |
|---|---|---|
| `bike-hero.jpg` | Full-screen hero background | Wide landscape (≥ 2400 px), bike on the right, darker space on the left for the headline |
| `bike-riding.jpg` | "Easy to use" section | 4:3, a rider on the bike in the city |

Until a file exists, the drawn bike is shown in its place. The Bike Explorer and Configurator keep the drawn
bike on purpose: their hotspots and live colour changes need the vector drawing.

## Page order (simplified)

Hero · How it works (easy to understand) · Why go electric (benefits) · Eco Bike vs petrol (savings calculator + table) ·
Easy to use · Bike Explorer · Build Your Bike · Charging map · Lifestyle · Lifecycle · Final CTA.
Petrol-comparison prices live in `COMPARE_ASSUMPTIONS` in `lib/content.ts` — set them to your local rates.
Retired from the page (files kept): SpecScroll, EnergyFlow, SmartDashboard, SoundSilence, RideAI, TechStory, Performance.

## Before launch — things to wire up

- **Figures** in `lib/content.ts` and `lib/bike.ts` are illustrative placeholders. Replace with verified specs.
- **Real footage:** drop MP4s in `public/video/` and list them in `SCENE_VIDEO` (`components/bike/SceneStage.tsx`).
  They lazy-load only when their scene is active; the drawn scene stays as poster/fallback.
- **Test-ride form:** `components/sections/TestRideModal.tsx` → replace the `TODO` with a POST to your CRM/booking API.
- **Ride AI:** answers are scripted from `lib/ride-ai.ts`. To use a live model, call your API inside `ask()` in
  `components/sections/RideAI.tsx` and keep the scripted engine as a fallback.
- **Domain:** replace `https://ecobike.example` in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## Accessibility & performance

- `prefers-reduced-motion`: no pinning, no smooth scroll, no WebGL, static compositions, instant counters.
- Skip link, semantic landmarks, labelled controls, focus-trapped dialogs, keyboard-operable hotspots, map and charts.
- Performance chart colours validated for colour-blind separation and contrast; table view available.
- Three.js is code-split and only loads in the hero on motion-enabled devices; fewer particles on mobile.
- No image downloads: all artwork is SVG.
