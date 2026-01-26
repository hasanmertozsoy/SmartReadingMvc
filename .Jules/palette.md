## 2026-01-26 - Regex Verification Pitfalls
**Learning:** Regex-based static analysis of JSX files (like `wwwroot/js/app.js`) is unreliable for verifying attributes like `aria-label` because multi-line attributes or arrow functions in props (e.g., `onClick={() => ...}`) can break simple regex patterns.
**Action:** Prefer runtime verification via Playwright (inspecting the DOM) or robust AST parsers over regex for checking code correctness in complex files. If quick verification is needed, use `grep` for simple existence checks of specific strings rather than parsing structure.

## 2026-01-26 - Frontend Verification in .NET/React Mix
**Learning:** Verifying a React app embedded in a .NET MVC view (`Index.cshtml`) without the .NET runtime requires creating a standalone `verification.html` that mimics the Razor view but uses relative paths. However, dependencies on external CDNs (like `esm.sh`) and in-browser Babel compilation can cause timeouts in headless Playwright environments.
**Action:** Increase Playwright timeouts for initial page load and selector waiting when testing apps that rely on client-side compilation or external ESM imports. Ensure the verification script captures browser console logs to debug loading issues.
