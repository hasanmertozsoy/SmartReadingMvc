## 2024-05-23 - [Modal Accessibility Pattern]
**Learning:** Vanilla JS modals often miss critical a11y features like focus trapping and ARIA roles. Focus management (saving/restoring focus) is essential for keyboard users.
**Action:** When working with custom modals, always implement `openModal` (save focus, focus inside) and `closeModal` (restore focus) logic, and add `role="dialog"` + `aria-modal="true"`.
