## 2026-01-27 - Icon-only Button Accessibility
**Learning:** Dynamic icon-only buttons (like Mute/Unmute) require dynamic `aria-label` values that mirror the state logic (e.g., `isMuted ? 'Unmute' : 'Mute'`) to be truly accessible.
**Action:** Always check component state when adding `aria-label` to toggle buttons, rather than using a static label.

## 2026-01-27 - Visualizing Invisible Attributes
**Learning:** Validating `aria-label` presence in screenshots can be achieved by injecting CSS that displays the attribute value as a pseudo-element tooltip.
**Action:** Use CSS injection for "visual" verification of accessibility attributes in future tasks.
