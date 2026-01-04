## 2024-10-24 - Modal Accessibility & Focus Management
**Learning:** Simple `display: none` / `flex` toggles for modals are insufficient for accessibility. Users relying on keyboards get trapped or lost when focus isn't managed.
**Action:** Always implement `openModal` with focus trapping (or at least initial focus) and `closeModal` with focus restoration. Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to all modal containers.
