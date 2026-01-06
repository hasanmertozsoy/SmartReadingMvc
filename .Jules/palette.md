# Palette's Journal

## 2024-05-23 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like Pomodoro toggles, settings, and CRUD actions) were completely inaccessible to screen readers. Adding dynamic `aria-label` attributes using the existing localization system (`translate`) is a scalable way to fix this without cluttering the UI.
**Action:** When creating or modifying icon-only buttons, always ensure an `aria-label` is present, leveraging the `translate` function to maintain multi-language support.
