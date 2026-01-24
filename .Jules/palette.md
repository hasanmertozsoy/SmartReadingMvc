## 2026-01-24 - Accessibility in No-Build React
**Learning:** Verifying `aria-label` coverage in a no-build React app (via `app.js` + babel-standalone) requires creating a mock HTML environment (`verification.html`) and running browser-based tests (Playwright), as static analysis is unreliable with JSX strings and component logic.
**Action:** When working on similar "no-build" architectures, immediately set up a `verification.html` harness to run Playwright tests against the actual DOM, ensuring dynamic attributes like `aria-label={translate(...)}` are correctly resolved.
