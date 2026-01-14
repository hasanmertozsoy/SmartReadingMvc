## 2024-05-22 - Dynamic Content in Buttons vs ARIA Labels
**Learning:** The Pomodoro timer button contains dynamic text (the remaining time). Adding a static `aria-label="Timer"` to this button overrides the visible text content for screen readers, preventing them from reading the time.
**Action:** For buttons with dynamic text content, rely on the text content for the accessible name, or use `aria-labelledby` if additional context is needed, rather than a static `aria-label`.
