## 2024-05-23 - Accessibility in Single-File React/Babel Apps
**Learning:** In a "no-build" React app using `esm.sh` and Babel Standalone, standard linter checks for accessibility (like `jsx-a11y`) are not available. This makes manual verification of `aria-label` and other accessibility attributes even more critical.
**Action:** Always verify accessibility attributes by inspecting the DOM or using a script that visualizes them (e.g., creating tooltips from `aria-label` values) to ensure they are correctly applied and localized.

## 2024-05-23 - Localization of ARIA Labels
**Learning:** When adding `aria-label` to dynamic components, ensure the keys exist in the `dictionary` object. The `translate` function fails silently (returns empty string) if a key is missing, which can lead to empty `aria-label=""` attributes, confusing screen readers.
**Action:** Double-check the existence of dictionary keys before using them in `translate()`, or implement a "safe translate" wrapper during development that warns on missing keys.
