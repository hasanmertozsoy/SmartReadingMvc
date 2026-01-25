## 2024-05-22 - Icon-Only Button Accessibility
**Learning:** Checking for `aria-label` attributes on icon-only buttons is a high-impact, low-effort accessibility win. However, verification requires inspecting the DOM as these changes are visually invisible.
**Action:** Use `playwright` scripts to programmatically assert the presence of `aria-label` attributes on all buttons that lack text content.
