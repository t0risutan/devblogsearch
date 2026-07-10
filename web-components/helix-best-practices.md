# Helix/Milo Framework Best Practices

## 1. Block Structure & Naming Convention

- Each block lives in its own folder: `blocks/<block-name>/<block-name>.js` and `blocks/<block-name>/<block-name>.css`
- The folder name, JS file name, CSS file name, and primary CSS class on the block element must all match (kebab-case)
- Example: `/blocks/devblog-tags/devblog-tags.js` adds class `tags` and is styled by `devblog-tags.css`

## 2. Default Export Pattern

Every block module must export a single default async function:

```javascript
export default async function init(blockEl) { ... }
```

- The parameter is the block's root DOM element (conventionally named `blockEl`)
- No return value; the function mutates `blockEl` in place
- Guard with early return if prerequisites are missing

## 3. Milo Library Path Abstraction

- Use `setLibs()` / `getLibs()` (from `scripts/devblog/devblog.js`) for all dynamic Milo imports
- Never hardcode `/libs/...` paths; always resolve via `getLibs()` so the block works across local, stage (`.hlx.`/`.aem.`), and production environments

```javascript
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);
```

## 4. Post-Process / Override Pattern

- When extending a Milo block, import and call the original block first, then enhance:

```javascript
await miloBlock.default(blockEl);
blockEl.classList.add('my-override');
```

- Use `MutationObserver` to react to DOM mutations made by the parent block

## 5. Web Components

- Extend `HTMLElement`; initialize exclusively in `connectedCallback()`
- Attach shadow DOM with `attachShadow({ mode: 'open' })` for encapsulation
- Inject styles into shadow DOM via `adoptedStyleSheets` (not a `<style>` tag or external `<link>`)
- Register with `customElements.define('element-name', ClassName)`
- Only load web component scripts when the element is actually present in the document (`document.querySelector(name)`)

## 6. CSS Encapsulation

- All block CSS must be scoped under the block's own class selector (`.block-name ...`)
- Global design tokens are defined as custom properties on `:root` in `styles/styles.css`; blocks consume them, never redefine them
- No global style pollution: never write bare element selectors (`a { }`, `p { }`) inside a block CSS file

## 7. Modern JavaScript

- Use `async`/`await` consistently; avoid raw `.then()` chains except in legacy fetch utilities
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of verbose null checks
- Use `DocumentFragment` for batch DOM insertion to minimize reflows
- Use `data-*` attributes to attach metadata to DOM elements
- Debounce user input events (300 ms) before triggering expensive operations

## 8. Environment-Aware Configuration

- Centralise constants in a `SITE` or `CONFIG` export object (paths, breakpoints, defaults)
- Never scatter magic strings or paths across block files

## 9. Module Loading

- Load dependencies with dynamic `import()` inside `init()`, not at module top level, so the browser only fetches them when the block is actually on the page
- Load CSS at runtime using Milo's `loadStyle()` utility when the stylesheet is a runtime concern (e.g. for an override block loading a parent's CSS)
