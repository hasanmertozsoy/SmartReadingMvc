## 2026-01-28 - Dynamic ARIA Labels
**Learning:** Toggle buttons (like Mute/Unmute) require dynamic `aria-label` values to accurately convey state to screen readers, rather than a static label.
**Action:** Use ternary operators in `aria-label` props (e.g., `isMuted ? 'Unmute' : 'Mute'`) for state-toggling buttons.

## 2026-01-28 - ARIA vs Visible Text
**Learning:** Applying `aria-label` to a button with visible dynamic text (like a timer) overrides the reading of that text.
**Action:** Use `title` or `aria-describedby` instead of `aria-label` when the visible text is meaningful and should be read.
