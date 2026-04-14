# Code Guidelines — Adobe Developers Blog

This document defines the coding standards, tooling, and structural conventions for the `@adobecom/devblog` project. All contributions must adhere to these guidelines.

---

## 1. Framework & Architecture

This project is built on **Adobe's Helix/Milo framework** (Edge Delivery Services). All implementation must follow the patterns and conventions defined in [helix-best-practices.md](./helix-best-practices.md). Adherence to that document is mandatory and will be evaluated as part of the grading criteria.

---

## 2. Linting

All code must pass linting before being committed. Linting is enforced via two tools:

### JavaScript — ESLint

- Config: `.eslintrc.js`
- Extends: [`airbnb-base`](https://github.com/airbnb/javascript)
- Parser: `@babel/eslint-parser` (ES modules, no config file required)
- Run: `npm run lint:js`

### CSS — Stylelint

- Config: `.stylelintrc.json`
- Extends: `stylelint-config-standard` + `stylelint-config-prettier`
- Scope: `blocks/**/*.css` and `styles/*.css`
- Run: `npm run lint:css`

---

## 3. Project Structure

```
/
├── blocks/                  # Helix blocks (one folder per block)
│   └── <block-name>/
│       ├── <block-name>.js
│       └── <block-name>.css
├── scripts/                 # Shared utilities and page initialisation
│   ├── scripts.js           # Main entry point
│   └── devblog/             # Project-specific helpers and constants
├── styles/                  # Global styles and design tokens
│   └── styles.css
├── web-components/          # Custom Elements (shadow DOM components)
├── test/                    # Unit tests (.mjs files, Mocha/Chai)
└── head.html                # Document <head> template
```

### Rules

- **One block per folder.** Folder name, JS file name, CSS file name, and primary CSS class must all match in kebab-case.
- **No shared state between blocks.** Blocks must be self-contained; cross-block communication happens through the DOM or shared utilities in `scripts/devblog/`.
- **No new global utilities** without prior discussion. Extend `scripts/devblog/devblog.js` for project-wide helpers only when the function is genuinely reusable.

---

## 4. JavaScript Conventions

- **ES modules only.** Use `import`/`export`; CommonJS (`require`) is not permitted.
- **Always include the `.js` extension** in import paths (enforced by ESLint).
- **Async/await** is preferred over `.then()` chains.
- **Modern syntax required:** optional chaining (`?.`), nullish coalescing (`??`), destructuring, template literals.
- **No external runtime dependencies.** The project has no production dependencies; do not introduce them.
- Follow all JavaScript patterns in [helix-best-practices.md](./helix-best-practices.md).

---

## 5. CSS Conventions

- All block styles must be **scoped** to the block's own class (`.block-name ...`). Bare element selectors are not permitted inside block CSS files.
- **Design tokens** (colours, spacing, typography) are defined as CSS custom properties on `:root` in `styles/styles.css`. Blocks must consume these variables — never redefine or override them at block level.
- Follow all CSS patterns in [helix-best-practices.md](./helix-best-practices.md).

---

## 6. Testing

- Tests live in `/test/` and use `.mjs` extensions.
- Test runner: **Mocha** (`npm test`); assertion library: **Chai**.
- Non-trivial utility functions exported from `scripts/` must have corresponding unit tests.

---

## 7. Security

- No secrets, tokens, or credentials may be committed to the repository.
- User input must be sanitised before being inserted into the DOM (`textContent` over `innerHTML` where possible).
- External URLs must not be constructed from unvalidated user input.
 