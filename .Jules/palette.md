## 2024-10-25 - Dynamic Text vs. ARIA Label
**Learning:** Applying `aria-label` to a button with dynamic visible text (e.g., a timer "25:00") overrides the text content for screen readers. This hides the dynamic updates from assistive technology users.
**Action:** Do not apply `aria-label` to buttons where the visible text is the primary accessible name and changes dynamically. Use `aria-labelledby` or rely on text content.

## 2024-10-25 - Verifying Invisible Attributes
**Learning:** Standard screenshot verification fails for accessibility attributes like `aria-label` because they are invisible.
**Action:** Inject a temporary JavaScript snippet during the verification script to render these attributes as visible overlays (tooltips) before capturing the screenshot.
