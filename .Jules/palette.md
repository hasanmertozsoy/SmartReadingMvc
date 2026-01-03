## 2024-05-23 - Modal Accessibility Patterns
**Learning:** This app uses vanilla JS to toggle modals (`display: none/flex`), which completely breaks keyboard and screen reader accessibility by default.
**Action:** Always add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to the modal container. Manually trap focus on open (save `activeElement`, focus first input) and restore it on close. This pattern should be replicated for any new modals added to this codebase.

## 2024-05-23 - Labels vs Placeholders
**Learning:** The minimalist design relied solely on placeholders, which vanish on input and are inaccessible to screen readers.
**Action:** When working on minimalist forms here, add visible `<label>` elements with a utility class (e.g., `.input-label`) to maintain the aesthetic while ensuring WCAG compliance.
