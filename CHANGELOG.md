# Changelog

All notable changes to the **FrankenTUI Website** are documented here.

> This project has no formal release tags or GitHub Releases.
> History is organized by landed capability and date, with representative commit links.
> Repo: <https://github.com/Dicklesworthstone/frankentui_website>

---

## Unreleased (HEAD)

Latest: [`cb52e1b`](https://github.com/Dicklesworthstone/frankentui_website/commit/cb52e1b1b86ed8d3811eda379d5bba1099d2062c) — 2026-03-18

### Bug Fixes

- **Cursor:** Stop DataDebris particles from corrupting shared Framer Motion mouse `MotionValue`s ([`6f29f41`](https://github.com/Dicklesworthstone/frankentui_website/commit/6f29f411a77dc69f541b0a1e6cb13992e67679cd)).
- **Tests:** Resolve ESLint errors and warnings across the test suite ([`61e3d2c`](https://github.com/Dicklesworthstone/frankentui_website/commit/61e3d2cadbab27fb6ab60f45cc6cc58e24ab035e)).

### Housekeeping

- Add MCP configs and runtime SQLite to `.gitignore` ([`cb52e1b`](https://github.com/Dicklesworthstone/frankentui_website/commit/cb52e1b1b86ed8d3811eda379d5bba1099d2062c)).
- Add `.env` and `.claude/settings.local.json` to `.gitignore`; refresh `bun.lock` ([`b8acb81`](https://github.com/Dicklesworthstone/frankentui_website/commit/b8acb81e96e7e33a3baa8332555dae5b22c878b2)).

---

## 2026-02-21 — License & Social Preview

### Governance

- Update license to MIT with OpenAI/Anthropic Rider ([`9354676`](https://github.com/Dicklesworthstone/frankentui_website/commit/93546768af7216943dbe74baee9f1a0fbc129848)).

### Branding

- Add GitHub social preview image (1280x640) ([`cf549d8`](https://github.com/Dicklesworthstone/frankentui_website/commit/cf549d8b46c4217c7a6b161545a1e3cc533986ab)).

---

## 2026-02-20 — WASM Showcase Resync & Mobile Touch Polish

6 commits. Upstream WASM sync and final round of mobile interaction fixes.

### WASM Demo Sync

- Sync WASM showcase to upstream `805d38f3` ([`532bfb0`](https://github.com/Dicklesworthstone/frankentui_website/commit/532bfb0f78f0ef96a31fb1ffd030765aa7472220), [`41c29ca`](https://github.com/Dicklesworthstone/frankentui_website/commit/41c29ca4a920181edb27764dff8001acf5c5a2d8)).
- Map source-tree asset paths and restore OG image for `/web` route ([`68de379`](https://github.com/Dicklesworthstone/frankentui_website/commit/68de379eec53d2309c99dca4639143dff6b5f053)).

### Mobile Touch Interaction

- Restore touch-first mobile interactions with keyboard toggle ([`443db16`](https://github.com/Dicklesworthstone/frankentui_website/commit/443db1694512ec13cb761d00b49ce9591fa6aae2)).
- Add pane-safe long-press keyboard mode; remove zoom buttons on mobile ([`6ac43c1`](https://github.com/Dicklesworthstone/frankentui_website/commit/6ac43c11c02cdb546b3c296625dea378b0aa57e1)).
- Normalize touch pane pointer buttons for mobile drags ([`5d7cf59`](https://github.com/Dicklesworthstone/frankentui_website/commit/5d7cf594b57d36ce84a4254603012ab1ca39e98e)).

---

## 2026-02-10 to 2026-02-11 — Live WASM Terminal Demo

25 commits. A major capability milestone: ship a **live, in-browser FrankenTUI terminal** powered by WASM, embedded as a React widget and as a standalone page.

### WASM Infrastructure & Serving

- Add WASM serving infrastructure with Next.js rewrites, cache headers, and Playwright WebGPU config ([`8c4d152`](https://github.com/Dicklesworthstone/frankentui_website/commit/8c4d1525c10b0c56ce1a1f88c34955c4599f0b0e)).
- Track WASM `pkg` binaries and add `/web_react` demo page ([`37fc803`](https://github.com/Dicklesworthstone/frankentui_website/commit/37fc803896b1d27de1716f2ee9f6a22d2d17c284)).
- Initial WASM showcase sync from upstream `d15f7412` ([`888ea94`](https://github.com/Dicklesworthstone/frankentui_website/commit/888ea94bba4bcf1fdb0f47aac8c1e4ecddce3cf2), [`1292c28`](https://github.com/Dicklesworthstone/frankentui_website/commit/1292c28370850c022ff517ddd4bc3fed9b9037c4)).

### FrankenTerminal React Widget

- Add `FrankenTerminal` React component: `forwardRef` wrapper around the WASM renderer with a full state machine (`checking-webgpu` -> `running`/`error`/`unsupported`), input forwarding, `ResizeObserver`-driven reflow, and `AbortController` cleanup ([`47a23a7`](https://github.com/Dicklesworthstone/frankentui_website/commit/47a23a7b84ad99483ad1603b1e671a0c927f42bf)).
- Port touch, zoom, and input improvements to the React widget ([`0f87027`](https://github.com/Dicklesworthstone/frankentui_website/commit/0f87027a1c344cb66ee7e9179f8cb9939954391d)).
- Enable keyboard navigation and fix zoom state bugs in the widget ([`ffc00b4`](https://github.com/Dicklesworthstone/frankentui_website/commit/ffc00b4bcf7874d5c8540d64ef28efe839f8bc4f)).

### Site-Wide Integration

- Integrate live WASM demo across all pages; add "Live Demo" nav item, "Browser Native" feature card, browser FAQ, and cross-platform design principle ([`7b713e9`](https://github.com/Dicklesworthstone/frankentui_website/commit/7b713e9ccc244463aa5c262433125c0a490a5224)).
- Move React Widget CTA from navbar to hero button ([`ad52fff`](https://github.com/Dicklesworthstone/frankentui_website/commit/ad52ffff81a65b10e1c66c4073f6e57b01886c2b)).
- Port full touch/zoom/perf features from standalone Cloudflare demo to Next.js `/web` route -- touch state machine, pinch-to-zoom, on-screen zoom buttons, loading overlay, zero-copy WASM patch path, URL parameter support, and `100dvh` CSS for mobile Safari ([`584d1ac`](https://github.com/Dicklesworthstone/frankentui_website/commit/584d1ac379530120fe635ae2e059b5598337e788)).

### Browser Compatibility

- Remove incorrect WebGPU requirement -- WASM renderer has WebGL/Canvas2D fallback and works on Safari/iOS without WebGPU ([`ea78508`](https://github.com/Dicklesworthstone/frankentui_website/commit/ea78508bb6841e84994d2fc85fc8dd5359b922ae)).
- Fix Safari/iOS: use absolute `/web/` paths for WASM imports since `import()` and `fetch()` do not respect `<base href>` ([`ba6de6b`](https://github.com/Dicklesworthstone/frankentui_website/commit/ba6de6bbdcb7165ffa4f03cf301468784e76418d)).
- Add then remove WebGPU guard -- initially added to prevent loading on unsupported browsers ([`93ddf8e`](https://github.com/Dicklesworthstone/frankentui_website/commit/93ddf8ec89db0cd3c813729d634c2327b9787758)), then removed once WebGL fallback was confirmed working everywhere ([`ea78508`](https://github.com/Dicklesworthstone/frankentui_website/commit/ea78508bb6841e84994d2fc85fc8dd5359b922ae)).

### OG / Social Images

- Add OG and Twitter share images for `/web_react` page ([`c98ff48`](https://github.com/Dicklesworthstone/frankentui_website/commit/c98ff4855eae0ee9e8801077127f038688611b8b)).
- Add static OG share image for `/web` live demo page (static HTML route requires pre-rendered PNGs) ([`587832c`](https://github.com/Dicklesworthstone/frankentui_website/commit/587832cbec963f1b52cbf2c9d79feb00e0cf01c6)).
- Satori compliance fixes for OG/Twitter images; per-page Twitter cards ([`b2e86db`](https://github.com/Dicklesworthstone/frankentui_website/commit/b2e86dbeaea7016af8270354868e7f25ecfd601a)).
- Add image dimensions to `/web` OG meta tags for social crawlers ([`aadbfc2`](https://github.com/Dicklesworthstone/frankentui_website/commit/aadbfc293fb1fa17d9dda895aa4cd425e1f93aee)).

### Architecture Page

- Replace broken ASCII cell diagram with CSS grid; widen algorithm cards ([`af1a192`](https://github.com/Dicklesworthstone/frankentui_website/commit/af1a192cb80c38b681a391069ea07b2118755af1)).

### Content

- Extirpate war stories section entirely ([`4a959e3`](https://github.com/Dicklesworthstone/frankentui_website/commit/4a959e31ef82b6cd71659dfac3684647b83d3806)).

### Testing

- Comprehensive E2E and unit test suite for the WASM terminal widget ([`7046705`](https://github.com/Dicklesworthstone/frankentui_website/commit/704670533eb1bd07cf38e3d32fe6e367b00bbea6)).

### Bug Fixes

- Resolve vanishing custom cursor over technical content areas ([`3c6f24c`](https://github.com/Dicklesworthstone/frankentui_website/commit/3c6f24cbd7790bc1bc11a5cd2611e364891c9aa2)).

---

## 2026-02-09 — Visual Overhaul, Flywheel Visualization & Performance

25 commits. A full-day sprint focusing on visual identity, interactive data visualization, and rendering performance.

### Flywheel Visualization (New Feature)

Interactive flywheel diagram showing the agentic coding ecosystem with animated tool nodes and connections.

- Initial implementation with animated nodes, mobile-responsive beads tables, TSV copy, and CSV export ([`4419852`](https://github.com/Dicklesworthstone/frankentui_website/commit/441985246f22f29b44a2dcbe58e3bbf7ae7c9e92)).
- Add per-tool accent colors and spectrum-colored particles ([`e2eb636`](https://github.com/Dicklesworthstone/frankentui_website/commit/e2eb636191637fd84b18e416bbc7cf492d6c18db)).
- Overhaul with hover HUD (spatially-aware tooltip that flips left/right based on node position), expanded two-column forensic dashboard, `AnimatedNumber` count-ups for GitHub stars and connectivity, and widened layout from 1400px to 1600px max-width ([`21c19ab`](https://github.com/Dicklesworthstone/frankentui_website/commit/21c19ab5bf247b262253a71d552d752efa532499)).
- Remove duplicate flywheel visualization files; differentiate tool colors ([`4c87656`](https://github.com/Dicklesworthstone/frankentui_website/commit/4c8765660a17ee388d60a4c150d208130b710c16)).

### Visual Overhaul

- Per-tool color theming across all card types (algorithm, feature, optimization, war-story); redesigned glow orbits, memory-dump columns, and spectral background ([`91dbefe`](https://github.com/Dicklesworthstone/frankentui_website/commit/91dbefe272f4d9ffdee1b067c9481da2f48c60de)).
- Animate spectral background film grain with oscillating frequency ([`4bc8de1`](https://github.com/Dicklesworthstone/frankentui_website/commit/4bc8de161f997ce5c7d966f45244f85fa9734dd3)).
- Add data-stream border animations and flickering status to site header ([`cac9ccf`](https://github.com/Dicklesworthstone/frankentui_website/commit/cac9ccfb6237394254ce477122fcce54d39374af)).
- Introduce skin layer in `FrankenContainer` and refine `NeuralPulse` rendering ([`20d51cf`](https://github.com/Dicklesworthstone/frankentui_website/commit/20d51cfa1a3a77e0bb06927a3eae1457483e1b68)).
- Add TLDR tool star ratings dataset ([`ff00156`](https://github.com/Dicklesworthstone/frankentui_website/commit/ff00156d65128afbf76046a305c85784663a9512)).

### Performance Optimization

- Rewrite Myers diff algorithm: replace `Map<number, number>` trace storage with `Int32Array` for O(1) indexed access; add FNV-1a hash pre-computation for input lines to short-circuit expensive string equality checks ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Switch highlight.js import from full build to `highlight.js/lib/common` for smaller bundle ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Pre-tokenize `DecodingText` character array; replace `.map().join()` with direct for-loop concatenation to reduce GC pressure during RAF callbacks ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Precompute per-column alpha-variant color strings in `MemoryDump` canvas; add Page Visibility API integration to pause canvas animation on hidden tabs ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Optimize scroll handler in site header with functional `setState` to avoid unnecessary re-renders ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Disable ambient animated background layers (MemoryDump canvas + SpectralBackground scanlines) for baseline performance improvement ([`7ac6152`](https://github.com/Dicklesworthstone/frankentui_website/commit/7ac6152a5aa37b4163b5017c1a076f86ee55615c)).

### Accessibility

- Add `useSyncExternalStore` for React-canonical client detection in `BeadsView`, replacing `useState`/`useEffect`/`requestAnimationFrame` Portal hydration ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Use `useReducedMotion` from Framer Motion in `SpectralBackground`: disable scanline opacity animation, freeze interference line, and switch from `top`-based to `transform`-based `y` animation for compositor-layer rendering ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Update search tokenizer to Unicode property escapes (`/[^\p{L}\p{N}']+/u`) for proper non-ASCII tokenization ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).
- Add highlight.js Franken-Green syntax highlighting theme with semantic color assignments ([`3950252`](https://github.com/Dicklesworthstone/frankentui_website/commit/3950252c60c3ca59fc5d3597d856879ae3f07b77)).

### Content & Home Page

- Tweet wall masonry layout and bigger author artifact ([`6da9e7e`](https://github.com/Dicklesworthstone/frankentui_website/commit/6da9e7e3239296b7898dcca152d2372f45b9b387)).
- Update author note copy ([`19d7bf2`](https://github.com/Dicklesworthstone/frankentui_website/commit/19d7bf24661dee857f99c646fdc47d5dd8df80f0)).
- Increase author artifact header size ([`00803f7`](https://github.com/Dicklesworthstone/frankentui_website/commit/00803f7062fdffcf9eafc6b6e02f06876a0dfbb6)).

### Bug Fixes

- Resolve mouse freeze on bead modal (#13) and cursor lag (#14) ([`7e68a74`](https://github.com/Dicklesworthstone/frankentui_website/commit/7e68a7484449450efd5884fc8072ae90bd35dd42)).
- Fix array mutation pattern in memory-dump rain animation ([`3ab4ce8`](https://github.com/Dicklesworthstone/frankentui_website/commit/3ab4ce841075334eb56cd64a976bad5ddb81b566)).
- Add React key to spec-evolution-lab inspector for proper remount ([`a493688`](https://github.com/Dicklesworthstone/frankentui_website/commit/a493688d68893520ced849cb8349469bae3119d9)).
- Fix missing framer-motion imports in optimization-card, war-story-card, algorithm-card, and feature-card ([`aeac12c`](https://github.com/Dicklesworthstone/frankentui_website/commit/aeac12c09b92bec811c91ec92dc3b70e577d4701), [`557f703`](https://github.com/Dicklesworthstone/frankentui_website/commit/557f7034c3bc5a63b302309f033f96402b3afb41), [`afa6c84`](https://github.com/Dicklesworthstone/frankentui_website/commit/afa6c84ff0a1ea830c6120ecc63282ce2eb534fc)).
- Refine algorithm card component styling ([`d33e193`](https://github.com/Dicklesworthstone/frankentui_website/commit/d33e1936f924830b74a5f4fc9081106f3b9a743e)).
- React lint cleanup and component polish across website ([`963a235`](https://github.com/Dicklesworthstone/frankentui_website/commit/963a235d04ca7cab17892dcc29f16303e18ad2cf)).
- Update component import paths and extend color definitions ([`14ec04f`](https://github.com/Dicklesworthstone/frankentui_website/commit/14ec04f5d26eab0d1c888f0b67af97763b346f2f)).

---

## 2026-02-08 — Spec Evolution Lab, Accessibility, OG Images & Frankenstein Theme

115 commits -- the densest day of development. Spans the Spec Evolution Lab, accessibility epic, OG images, Streamdown renderer, mobile navigation redesign, beads viewer overhaul, FrankenGlitch/NeuralPulse effects, FrankenEye refinement, tweet wall, and the full war-stories lifecycle.

### Spec Evolution Lab (New Feature)

Interactive forensic visualization of the FrankenTUI spec corpus -- the marquee feature of the "How It Was Built" section. Lets users scrub through spec revisions, compare diffs, and render markdown snapshots.

- Initial implementation with corpus A-vs-B diff mode, side-by-side rendering, syntax highlighting via highlight.js, and FrankenTUI-themed dialogs ([`4d01602`](https://github.com/Dicklesworthstone/frankentui_website/commit/4d01602a9fb64569c7505c6a36bae53fe4a12105)).
- Visual overhaul and repair of duplicated code blocks ([`9f2cc9e`](https://github.com/Dicklesworthstone/frankentui_website/commit/9f2cc9e15eb9cf118ebdece48c4e50be5d9436a1)).
- Enhanced comparison engine with improved diff utilities ([`47ec178`](https://github.com/Dicklesworthstone/frankentui_website/commit/47ec1783b6017167236597d35bb5e4a6b5b98ded)).
- Full-text search across spec revisions ([`28a89e5`](https://github.com/Dicklesworthstone/frankentui_website/commit/28a89e578a7d87308771a2e738c48efd84a988fe)).
- Timeline visualization for spec evolution ([`c1b991a`](https://github.com/Dicklesworthstone/frankentui_website/commit/c1b991aaa2bce94f9cfd579dc00f4d0adfbe9e40)).
- Add Frankenstein-themed CTA on landing page ([`4b91d27`](https://github.com/Dicklesworthstone/frankentui_website/commit/4b91d27829266b002af0e8019786b424a5670cd8)).
- ARIA roles, reduced-motion support, and 44px touch targets ([`308d477`](https://github.com/Dicklesworthstone/frankentui_website/commit/308d4770677bd4046e234cf41843686ffaecf0e4)).
- Eyebrow labels and enhanced animations on Architecture page ([`d9a548b`](https://github.com/Dicklesworthstone/frankentui_website/commit/d9a548bda67a3a42f80adb0a06506d5b70e45a07)).

### Streamdown Markdown-Lite Renderer (New Component)

Custom regex-based markdown parser for headings, bold, italic, inline code, links, lists, and fenced code blocks, routed through `RustCodeBlock` for syntax highlighting.

- Initial implementation ([`6d860fb`](https://github.com/Dicklesworthstone/frankentui_website/commit/6d860fb9076b6170810b52e6b422c794ef5375ec)).
- Integrate across glossary entries, war story cards, and bead detail modals ([`f9ad219`](https://github.com/Dicklesworthstone/frankentui_website/commit/f9ad2196dcc646edf447c1c6f0e8745a18bd2f2f), [`32f4ade`](https://github.com/Dicklesworthstone/frankentui_website/commit/32f4adec879ab71203450a5ccb80db94c9d13d53)).
- Harden inline tokenizer against empty-content tokens ([`4cce71a`](https://github.com/Dicklesworthstone/frankentui_website/commit/4cce71acb0b867211caf93314d18746ba7be9443)).
- Fix Streamdown regex literals that broke the Turbopack parser ([`e24a3d0`](https://github.com/Dicklesworthstone/frankentui_website/commit/e24a3d0a47f1b60fa58836bbb013f98732a96704)).

### FrankenGlitch & NeuralPulse Effects (New Components)

- Add `FrankenGlitch` effect and `NeuralPulse` animation components with content enrichments ([`7adc47a`](https://github.com/Dicklesworthstone/frankentui_website/commit/7adc47a9b118bfb37d6988e15dd97d750d020c83)).
- Integrate across all components and pages ([`c7e84db`](https://github.com/Dicklesworthstone/frankentui_website/commit/c7e84db8c67a7b89589f3c7cce0e0d454575cd45), [`ca2f034`](https://github.com/Dicklesworthstone/frankentui_website/commit/ca2f0342c6d9c049e7092250b9b66b7d29e38349)).
- Lower `NeuralPulse` z-index so spark renders behind card content ([`64150c9`](https://github.com/Dicklesworthstone/frankentui_website/commit/64150c9bda1723f48d010a56caed1cd80d0f32ed)).

### Beads Viewer Overhaul

- Rewrite beads page with native viewer and Frankenstein-themed styles ([`0f5c541`](https://github.com/Dicklesworthstone/frankentui_website/commit/0f5c5412d136f5a4905b4f36bf4e0a9f54d868c6)).
- Overhaul viewer with robust script loading and improved UX ([`a8fd414`](https://github.com/Dicklesworthstone/frankentui_website/commit/a8fd414ca2d19048305623bfe43171950232ee5e)).
- Fix loading failures: error spinner hang and script race condition ([`0a7e436`](https://github.com/Dicklesworthstone/frankentui_website/commit/0a7e4363e64d3dfa57411fd949751f846639c254)).
- Fix beads detail modal with Portal rendering and responsive graph sizing ([`a970ddc`](https://github.com/Dicklesworthstone/frankentui_website/commit/a970ddc39b65fd51090234f462bf1b113094e8bc)).
- Dynamically import `BeadsView` with `ssr: false` to prevent SSR crashes ([`9af4573`](https://github.com/Dicklesworthstone/frankentui_website/commit/9af457336fb11802f47cba4df1b8e967c45142a0)).
- Unify render tree so `<Script>` tags persist across state transitions ([`5823872`](https://github.com/Dicklesworthstone/frankentui_website/commit/582387219da36e21d6405362653241109957f688)).
- Improve graph rendering, detect pre-loaded globals, z-index telemetry cards ([`da4d157`](https://github.com/Dicklesworthstone/frankentui_website/commit/da4d15733afdb6ca3bb7d3c857dc1d71858bc0d8)).
- Improve graph node glow rendering and mobile responsiveness ([`a246ba9`](https://github.com/Dicklesworthstone/frankentui_website/commit/a246ba914ff92810bad0080b53e8ea4e5d3836ad)).
- Improve BeadsView graph rendering, script detection, and layout ([`bac1483`](https://github.com/Dicklesworthstone/frankentui_website/commit/bac148325e1a3936b14d6638a4587831a2123377)).
- Responsive card layout for tables on mobile viewports ([`77faf24`](https://github.com/Dicklesworthstone/frankentui_website/commit/77faf246e5420658dc5dc685dc9b3a0f451881d2)).
- Add table view toggle, TSV copy, and CSV export ([`31766e5`](https://github.com/Dicklesworthstone/frankentui_website/commit/31766e534693b30e9b5203a624afcd6410124e3c)).
- Replace all `@ts-ignore` with proper types in `BeadsView` ([`9302db0`](https://github.com/Dicklesworthstone/frankentui_website/commit/9302db0504282c17c185f6950b7adfed35106578)).
- Fix `BeadsView` script polling effect to run once on mount ([`ae1e004`](https://github.com/Dicklesworthstone/frankentui_website/commit/ae1e004fea65de018f74402f09c721845a240fda)).
- Enhance beads viewer resilience, custom cursor, streamdown rendering, and site assets ([`c7d210a`](https://github.com/Dicklesworthstone/frankentui_website/commit/c7d210ad48d2cda7832877197a8cdee159cc4f69)).

### Mobile Navigation Redesign

- Redesign mobile nav: fixed bottom tab bar at thumb-reach zone with icon+label for first 5 items plus "MORE" overflow button; right-side drawer replaces bottom-sheet; drawer includes Anatomy Mode and Audio toggles in 2-column grid ([`febe611`](https://github.com/Dicklesworthstone/frankentui_website/commit/febe6113be83e27fcc7162f5749ccfaf0e0c062c)).
- Shorten mobile bottom nav labels and limit to 5 items ([`6e54193`](https://github.com/Dicklesworthstone/frankentui_website/commit/6e54193ef2af8c08dc66e021a22ab5ea7efb26d1)).
- Add Rocket icon for "Built in 5 Days" nav + dynamic goto targets ([`66a3906`](https://github.com/Dicklesworthstone/frankentui_website/commit/66a390624918d0bd2fd5889b645a5e9a4919a638)).
- Wrap nav links in Magnetic component for subtle hover magnetism ([`dc9c627`](https://github.com/Dicklesworthstone/frankentui_website/commit/dc9c6273c8b72d368bee78ec5fb4e3300814a090)).
- Fix desktop nav centering with CSS grid; resolve `layoutId` collision ([`6bf90b5`](https://github.com/Dicklesworthstone/frankentui_website/commit/6bf90b53084ff785cce8395377eb6c0eae6ba7cf)).
- Streamline site header: reduce animations, simplify nav chrome ([`c5f45bb`](https://github.com/Dicklesworthstone/frankentui_website/commit/c5f45bb77e9fa5919bf9fc4bde9741efce64901a)).

### FrankenEye Component

- Improve with `clipPath` blink and centered iris positioning ([`8795b72`](https://github.com/Dicklesworthstone/frankentui_website/commit/8795b7214efb36f22f3572f59ab3a6750bb9037d)).
- Rewrite eyelids from `clipPath` to `scaleY`; tune tracking feel ([`87a68ea`](https://github.com/Dicklesworthstone/frankentui_website/commit/87a68ea36c749895ca230708b447bec511a0f5f1)).
- Isolate blink interval into its own `useEffect` ([`1479b9a`](https://github.com/Dicklesworthstone/frankentui_website/commit/1479b9a658b7bc576d7861a81946ccf6930b9ea4)).
- Show FrankenEye on mobile across 4 subpages ([`8df5e2f`](https://github.com/Dicklesworthstone/frankentui_website/commit/8df5e2fded7ba802f73d957eec29c25c31bcd08f)).

### DecodingText & Motion System

- Rewrite `DecodingText` scramble effect and tune `FrankenGlitch` timing ([`188dfbf`](https://github.com/Dicklesworthstone/frankentui_website/commit/188dfbf4cdd7d377d49b43a2aad2d9f2daf04503)).
- Replace `DecodingText` scramble with clean motion entrance; refine hero layout ([`4f4d46a`](https://github.com/Dicklesworthstone/frankentui_website/commit/4f4d46aaf0f459cc5a3010ef8304df5c20eb7a6d)).
- Add hover-triggered re-scramble to `DecodingText` for interactive feel ([`c6545b0`](https://github.com/Dicklesworthstone/frankentui_website/commit/c6545b0c948d6be711491ce174a3c6327da5d529)).
- Simplify `DecodingText` from `requestAnimationFrame` scramble to Framer Motion fade-in ([`774c9b2`](https://github.com/Dicklesworthstone/frankentui_website/commit/774c9b2b74a5de6ecfffa6ba816b0336393d07b0)).
- Remove `DecodingText` wrappers from all page hero headings ([`2797af7`](https://github.com/Dicklesworthstone/frankentui_website/commit/2797af7dfea5cbe87264eb900fabf11936d5ddbc)).
- Remove unused `DecodingText` imports from all page files ([`098bbd2`](https://github.com/Dicklesworthstone/frankentui_website/commit/098bbd2e11edb6be03d4d5bed30a184272d9cd00)).
- Strip heavy page transition effects and `DecodingText` animation overhead ([`10009ca`](https://github.com/Dicklesworthstone/frankentui_website/commit/10009ca7fffeb91e78ceb6a1b3a1716899afd97a)).

### Tweet Wall

- Redesign with glassmorphic Frankenstein theme and `react-tweet` integration ([`37f0b25`](https://github.com/Dicklesworthstone/frankentui_website/commit/37f0b25ae70a2cf00244a1c4729a516589a9cb78)).

### OpenGraph / Social Images

- Redesign OG images with Frankenstein-themed branding ([`f66ba9d`](https://github.com/Dicklesworthstone/frankentui_website/commit/f66ba9db636f17a45e404eaf85803267ee4a72e8)).
- Convert OG images from WebP to PNG to fix Satori crash ([`643ea60`](https://github.com/Dicklesworthstone/frankentui_website/commit/643ea6083301a270c674cd9162828224c6a1c17b)).

### Accessibility & Reduced Motion

- Add `prefers-reduced-motion` support and fix React purity issues ([`5f85aad`](https://github.com/Dicklesworthstone/frankentui_website/commit/5f85aadff1cc35e2f9eaf0eaaf0a859541883a38)).
- Remove unused imports, add reduced-motion + intersection gating ([`6e1b6b0`](https://github.com/Dicklesworthstone/frankentui_website/commit/6e1b6b09e7329f6402265ae646e57241b3b1d412)).
- Close mobile tables epic + add accessibility E2E tests ([`2a8fb08`](https://github.com/Dicklesworthstone/frankentui_website/commit/2a8fb08d056a8e623a354a70be56a03b3d49f9bd)).
- Accessibility and responsive polish across 6 files ([`e1963d9`](https://github.com/Dicklesworthstone/frankentui_website/commit/e1963d9ceea7d39c839f916d7136f8f002da5e18)).
- Fix accessibility, type safety, and cleanup across 5 files ([`c307f71`](https://github.com/Dicklesworthstone/frankentui_website/commit/c307f71f99df1d0b7dc23c2ea0c6d36ac572c454)).
- Strict equality checks, reduced-motion support, and UI polish ([`e09af3f`](https://github.com/Dicklesworthstone/frankentui_website/commit/e09af3f6f14378687ebdc9452f6bb85dece4f5ac)).

### War Stories Lifecycle

The war-stories section was added, iterated, then removed in favor of redistributing content to other pages:

- Add three new war stories ([`6348b9c`](https://github.com/Dicklesworthstone/frankentui_website/commit/6348b9c1a9de015fd688cbb451a97becd4d64fb8)).
- Improve accuracy and remove unverified entries ([`c905399`](https://github.com/Dicklesworthstone/frankentui_website/commit/c9053993f4b8179b88a71b5f5592132d2ca527e2)).
- Hard-disable scroll animations, remove `whileInView` animations, remove from navigation ([`1083c98`](https://github.com/Dicklesworthstone/frankentui_website/commit/1083c988cf4b1c1504ff91b65ee26f590d78e9f0), [`bd25f0b`](https://github.com/Dicklesworthstone/frankentui_website/commit/bd25f0b8f686e91a61ed94e746f13e578584bb3e), [`43fd168`](https://github.com/Dicklesworthstone/frankentui_website/commit/43fd168e46a6091051af8cb03863cda3d142ec35)).
- Redistribute content to Architecture and "Built in 5 Days" pages ([`83e4f01`](https://github.com/Dicklesworthstone/frankentui_website/commit/83e4f01f08a663471ffcaf097426510febde330e)).
- Portal-wrap war-stories overlay to escape transform stacking context ([`03a184e`](https://github.com/Dicklesworthstone/frankentui_website/commit/03a184e3f9c9d0a40e0000386321d4dc3ea0e6da), [`c0e7180`](https://github.com/Dicklesworthstone/frankentui_website/commit/c0e71803f8b37de35b79f01b43f3e6638f44b07e)).
- Dynamic-import `WarStoriesMap` and sanitize layout animation keys ([`19b19ff`](https://github.com/Dicklesworthstone/frankentui_website/commit/19b19ffbf6232a758cdf688c076ef9c84ec3782e)).
- Fix duplicate `useState` import in `WarStoriesMap` ([`1787954`](https://github.com/Dicklesworthstone/frankentui_website/commit/1787954f9e3a87f2a6de9c7699f0d4306bb70a45)).
- Clean up war-stories page: remove unused icons, tighten layout ([`2a02ba6`](https://github.com/Dicklesworthstone/frankentui_website/commit/2a02ba6adb5788196f8a2db43eddb8c80d87be38)).
- Expand war story icon map and remove duplicate content entry ([`1ddbb72`](https://github.com/Dicklesworthstone/frankentui_website/commit/1ddbb72a0a0057bfd66251fe1b216ba040bdd1f6)).
- Stable motion layout IDs for war stories ([`7481553`](https://github.com/Dicklesworthstone/frankentui_website/commit/7481553e59a3b08941f6ceb8de8d5214b30076bf)).

### Rendering & Stacking Context Fixes

- Portal-wrap overlays to escape transform stacking contexts: BottomSheet ([`81e130d`](https://github.com/Dicklesworthstone/frankentui_website/commit/81e130d0620ad222884b9c96193465db8a7b435e)), screenshot lightbox ([`5a08bb3`](https://github.com/Dicklesworthstone/frankentui_website/commit/5a08bb33aa08d587c84645017bd4af9ea15562ea)).
- Defer Portal mount via `requestAnimationFrame` in 3 components ([`6855db3`](https://github.com/Dicklesworthstone/frankentui_website/commit/6855db33677d86d2c226e10db92b6fd8862f378d)).
- Prevent `SectionShell` content from vanishing on page load ([`f45afb5`](https://github.com/Dicklesworthstone/frankentui_website/commit/f45afb5e6e664483d1737c435c060ec0474acbc9)).
- Fix `FrankenContainer` z-index layering for proper content stacking ([`4a89ace`](https://github.com/Dicklesworthstone/frankentui_website/commit/4a89ace710c91400d620d211a55a1e3ac8db088b)).
- Strip dynamic import and Portal from War Stories page ([`3e031e8`](https://github.com/Dicklesworthstone/frankentui_website/commit/3e031e8ba8cd8bc43dc3c845250c1aa4889ced0c)).
- Simplify page transitions and add header clearance to Spec Evolution Lab ([`3f39a1a`](https://github.com/Dicklesworthstone/frankentui_website/commit/3f39a1a28c1d37866a6a2610632f0cc637093636)).

### Hero Section & Home Page

- Enhance hero section: wider layout, more breathing room, parallax orbs ([`6386239`](https://github.com/Dicklesworthstone/frankentui_website/commit/6386239c26cddfe19fbed2e22534bf64ca9f6cd0)).
- Improve home page mobile experience and video reliability ([`26cc30f`](https://github.com/Dicklesworthstone/frankentui_website/commit/26cc30f76be58dbd7f9abe0e17cac94fd940d1ae)).
- Fix hero video: center container at 1200px max-width, scale to hide CRT edges ([`60e0676`](https://github.com/Dicklesworthstone/frankentui_website/commit/60e06763eb2df97d75a8c8108c85f70b8d272395)).
- Remove video `scale-[1.08]` that was clipping left-side content ([`ff0a9d8`](https://github.com/Dicklesworthstone/frankentui_website/commit/ff0a9d823e62f84d6a927470c53cf135432a993e)).
- Trim right-side CRT black strip from hero video ([`9d6ccba`](https://github.com/Dicklesworthstone/frankentui_website/commit/9d6ccba8d695d3ab208eee40bd38cf906b75eecd)).
- Match video container aspect ratio to cropped video; fix `marked` v17 types ([`c31d6d1`](https://github.com/Dicklesworthstone/frankentui_website/commit/c31d6d11401956f6c91e120ea954f02deb3adb86)).
- Hero video layout, inline noise texture, and tweet wall refinements ([`3dfc8ff`](https://github.com/Dicklesworthstone/frankentui_website/commit/3dfc8ff5e609d417fab8cf7be2fac0751a36101e)).
- Add touch interaction support to feature cards and glitch effect ([`db5cdc7`](https://github.com/Dicklesworthstone/frankentui_website/commit/db5cdc7eed7e22c4a19e2a8644b67c1f3d4ac34e)).
- Improve mobile spacing, scroll animation triggers, and bottom nav coverage ([`8861fee`](https://github.com/Dicklesworthstone/frankentui_website/commit/8861feeee85d64ee0350b5219b55caa2ff0f8b30)).

### Inline Noise Texture & Error Boundary

- Inline noise texture, restore decoding animation, and retheme error boundary ([`56d1500`](https://github.com/Dicklesworthstone/frankentui_website/commit/56d150042d46b9c5db393df631c39d09b75c70b3)).
- JSX entity fix in error boundary + beads-viewer button styling tweaks ([`271f96d`](https://github.com/Dicklesworthstone/frankentui_website/commit/271f96d87a16f0c6fafaf403c5fa397c4df9803b)).

### React Correctness Fixes

- Fix React rendering compliance in `MemoryDump` and Streamdown tokenizer ([`b0ec355`](https://github.com/Dicklesworthstone/frankentui_website/commit/b0ec355b971638c43efcccbb63c65c83e2cb60d8)).
- Revert illegal `useRef` inside `useEffect` and restore missing imports ([`dd21d55`](https://github.com/Dicklesworthstone/frankentui_website/commit/dd21d55d24a51c88ac009e920971590c573d0808)).
- Use functional `setState` updater in `toggleAudio` for atomic state sync ([`f994d08`](https://github.com/Dicklesworthstone/frankentui_website/commit/f994d08416d275d08b07cd16c9c31da950ee5598)).
- Eliminate stale closures, redundant refs, and misindented JSX ([`860bca6`](https://github.com/Dicklesworthstone/frankentui_website/commit/860bca6e57d8dcbe3259a4afab497aeae38e6161)).
- Component rendering correctness and performance improvements ([`227b1ff`](https://github.com/Dicklesworthstone/frankentui_website/commit/227b1ffeb7217d16514eb14001ed6b6fbbedd9fe)).
- Fix `ScrollToTop` hydration mismatch with deterministic initial state ([`0f93819`](https://github.com/Dicklesworthstone/frankentui_website/commit/0f93819339a1baa30b943d1e9d7d6e2eb6070e8c)).
- Case-insensitive navigation and polish terminal help descriptions ([`c2cacc0`](https://github.com/Dicklesworthstone/frankentui_website/commit/c2cacc04e945d7c460c9ab93d62e768950bc2900)).
- Fix anatomy mode menu breakage, soften audio, eliminate `DecodingText` flashing ([`4781e4c`](https://github.com/Dicklesworthstone/frankentui_website/commit/4781e4cd8cca8faff03f3b722c3c2910374cee0f)).

### Testing

- Harden Spec Evolution Lab E2E smoke tests; close bd-2eu.1 ([`d06b520`](https://github.com/Dicklesworthstone/frankentui_website/commit/d06b520753aad78b12f2b5a93fdb325a42ce0767)).
- Add unit and E2E tests for Spec Evolution Compare module ([`46fd194`](https://github.com/Dicklesworthstone/frankentui_website/commit/46fd19463dd6736989879be42d5b5effa81a3183)).
- Add spec evolution search module tests ([`0d7ddea`](https://github.com/Dicklesworthstone/frankentui_website/commit/0d7ddeaaecfa74ec99f1e8f2bdcd1623788e9a2e)).
- Update E2E and unit tests for spec evolution and war stories ([`725a823`](https://github.com/Dicklesworthstone/frankentui_website/commit/725a823478ef2dad5da71c8554e339bf26922a27)).
- Drop war-stories navbar expectation from nav tests ([`d637a4b`](https://github.com/Dicklesworthstone/frankentui_website/commit/d637a4b2f8856cbc0c569fbccce7b7fdd20794aa)).

### Refactoring

- Extract `isTextInputLike` to shared utils module ([`cc89e99`](https://github.com/Dicklesworthstone/frankentui_website/commit/cc89e9948f3fb9f02eb66fe4db62a07c69ed1f53)).
- Remove unused imports and dead constants from beads page and HUD ([`4696e09`](https://github.com/Dicklesworthstone/frankentui_website/commit/4696e09d3c895b0c6f24611ba48c0eba4e516c29)).

### Dependencies & Infrastructure

- Add `react-tweet`, `react-force-graph`, `sql.js`, and `d3` dependencies ([`9f3f3b4`](https://github.com/Dicklesworthstone/frankentui_website/commit/9f3f3b42205e9b124493e1b141616bb0af53ca99)).
- Update React 19.2.4, `@types/node` 24; document ESLint 10 skip ([`caeb307`](https://github.com/Dicklesworthstone/frankentui_website/commit/caeb307a60c546e3060a9e80cb808bb4a3c87510)).
- Add TypeScript declarations, update deps, and harden spec evolution test ([`08df99d`](https://github.com/Dicklesworthstone/frankentui_website/commit/08df99dcac2b1f6db34dcbd6743dafe90eb5dc35)).
- Add Playwright test dependency and sync lockfile ([`6c1939b`](https://github.com/Dicklesworthstone/frankentui_website/commit/6c1939b4afc3d60106b05abf90530d6f86741f59)).
- Fix broken beads viewer, fix build errors, enhance site-wide UI ([`1280fb0`](https://github.com/Dicklesworthstone/frankentui_website/commit/1280fb0b095fd79aeb871152b1c1e4a7da0e60c0)).
- Update gitignore and refine custom cursor component ([`e7b55a9`](https://github.com/Dicklesworthstone/frankentui_website/commit/e7b55a974271ab9677f9f065fd6b874d67edca54)).
- Ignore macOS resource forks (`._*`) and compiled binaries (`a.out`) ([`4504921`](https://github.com/Dicklesworthstone/frankentui_website/commit/45049211d4b6f88fec79b97e31a252d1649047bf)).
- Add supporting modules and update config ([`b148792`](https://github.com/Dicklesworthstone/frankentui_website/commit/b14879250579830eb123c523f5bef31d3f1be0f4)).
- Adjust Spec Evolution Lab padding and fix Portal/AnimatePresence nesting ([`c27d792`](https://github.com/Dicklesworthstone/frankentui_website/commit/c27d792e30cd3b910c268b4edd518fcdb2b0df4b)).

---

## 2026-02-07 — Initial Launch

5 commits. The project goes from zero to a complete, deployed Next.js 16 website in a single day.

### Foundation

- **Initial commit**: Complete Next.js 16 website with 7 pages (Home, Showcase, Architecture, War Stories, Built in 5 Days, Glossary, Getting Started), Frankenstein monster theme (animated eyes, bolts, stitches), terminal typing demo, screenshot gallery with lightbox, dynamic OG image and favicon generation, 12 crate descriptions, 12 algorithm cards, 20 changelog entries, FAQ, Framer Motion animations with reduced-motion support, and Tailwind CSS 4 with custom green design system ([`ba4b940`](https://github.com/Dicklesworthstone/frankentui_website/commit/ba4b940bf1e480274c910b01c8a840877990ed49)).

### Content Enrichment

- Enrich architecture, war-stories, and getting-started pages with ADR content, terminal compatibility tables, visual effects descriptions, keybinding policy, and state machine documentation; add PostCSS config for Tailwind CSS v4; add beads-viewer static assets for `/beads` project graph page ([`319e979`](https://github.com/Dicklesworthstone/frankentui_website/commit/319e97929fe3a89278bd3bebb329856dc4483ee0)).
- Add Making Of section with dev sprint insights (7 sprint highlights) and stats (commit velocity, session count) on the "How It Was Built" page ([`9627c84`](https://github.com/Dicklesworthstone/frankentui_website/commit/9627c846eaf9fcaa50d85bf43f5c7941dc3be7a8)).

### Day-One Bug Fixes

- Fix perf bottlenecks: remove body `::before` noise overlay (full-viewport GPU layer), permanent `will-change` from `.glass-modern`, `animate-pulse` on hero blur divs, `animate-bounce`/`animate-float` from hero elements; rewrite beads page with stats bar and wider 16:10 aspect ratio viewer ([`f3c7899`](https://github.com/Dicklesworthstone/frankentui_website/commit/f3c7899e585b40db6e7a82e2538e450dc2e98c45)).
- Fix broken getting-started page (duplicate server/client import block), add Bug icon to `SectionShell` icon map, lint terminal-demo ([`fb17564`](https://github.com/Dicklesworthstone/frankentui_website/commit/fb175649abb1a65837f7a7dfeba6d20ebb2c79c2)).

---

*182 commits, 0 tags, 0 GitHub Releases. This changelog was rebuilt from `git log` on 2026-03-21.*
