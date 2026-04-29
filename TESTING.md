# Testing

This repository uses **three** automated test layers. Pick the layer that matches what you want to verify: fast pure logic (Node), browser APIs without the full site (Web Test Runner), or the full page against a local dev server (Playwright).

## Quick reference

| Command | Runner | Scope |
|---------|--------|--------|
| `npm test` | Mocha (Node) | `test/**/*.test.mjs` **except** `test/browser/**` — pure JS, no browser |
| `npm run test:browser` | [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) | `test/browser/**/*.test.mjs` — real Chromium, DOM |
| `npm run test:e2e` | [Playwright](https://playwright.dev/) | `test/e2e/**` — full app, needs a running site |

Optional: `npm run test:watch` runs Mocha in watch mode. `npm run test:e2e:ui` opens Playwright’s UI mode.

---

## Prerequisites

```bash
npm install
```

For E2E tests, install Playwright browsers once (if not already done):

```bash
npx playwright install chromium
```

---

## Unit tests (Node)

- **Config:** [`.mocharc.json`](./.mocharc.json) — pattern `test/**/*.test.mjs`, ignores `test/browser/**`, uses [`test/esm-loader.mjs`](./test/esm-loader.mjs) for ESM resolution.
- **Use for:** Functions with clear inputs/outputs (e.g. [`web-components/search/blog-search-filter-data.js`](./web-components/search/blog-search-filter-data.js) — `filterData` used by [`blog-search.js`](./web-components/search/blog-search.js)).
- **Avoid importing** [`blog-search.js`](./web-components/search/blog-search.js) directly in Node: it references `window` at load time. Keep pure logic in separate modules and test those.

---

## Browser / integration tests (Web Test Runner)

- **Config:** [`web-test-runner.config.mjs`](./web-test-runner.config.mjs) — files `test/browser/**/*.test.mjs`, `nodeResolve: true`.
- **Use for:** Same production modules as the site, plus `document` / DOM (e.g. building a list from `filterData` output) without starting AEM.
- **Run:** `npm run test:browser`

---

## End-to-end tests (Playwright)

- **Config:** [`playwright.config.js`](./playwright.config.js) — `testDir: ./test/e2e`, Chromium, timeouts tuned for slow first paint.
- **Requires** a running local site (e.g. `aem up`) so `scripts.js` loads and `<blog-search>` is injected after Milo’s `loadArea()`.

| Environment variable | Default | Purpose |
|----------------------|---------|---------|
| `E2E_BASE_URL` | `http://localhost:3000` | Origin of the dev server |
| `E2E_START_PATH` | `/` | First navigation path (try `/en/` if the top nav only exists there) |

**Run:** `npm run test:e2e`

---

## Project layout (tests)

```
test/
├── *.test.mjs              # Mocha (Node), except browser/
├── browser/                # Web Test Runner only
│   └── *.test.mjs
└── e2e/                    # Playwright
    └── *.spec.js
```

---

## Coverage

There is **no** coverage gate in CI in this repo yet. If you add a tool (e.g. c8 with Mocha, or WTR coverage), define **include/exclude** paths (e.g. exclude `node_modules`, generated JSON) and document the target (project-wide vs. feature folder) in your IPA report.

---

## Related docs

- [README.md](./README.md) — local development and `aem up`
- IPA planning: [`IPA-Antrittsgespraeche-Fachexperte.md`](./IPA-Antrittsgespraeche-Fachexperte.md), [`IPA-ARCHITECTURE.md`](./IPA-ARCHITECTURE.md)
