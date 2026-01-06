## 2024-05-23 - Localized ARIA Labels
**Learning:** Icon-only buttons in this codebase require `aria-label` attributes populated via the `translate(lang, key)` function to ensure accessibility across languages.
**Action:** When adding or modifying icon-only buttons, always add corresponding keys to the `dictionary` object in `app.js` and bind them to `aria-label`.
