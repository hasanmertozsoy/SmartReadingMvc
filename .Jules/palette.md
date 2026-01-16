## 2024-10-24 - Icon-Only Button Accessibility Pattern
**Learning:** The application extensively uses Lucide-react icons for buttons (e.g., Settings, Fullscreen, Edit, Delete) without accompanying text labels. These buttons were consistently missing `aria-label` attributes, rendering them inaccessible to screen readers.
**Action:** Always verify icon-only buttons have an `aria-label`. Use the `translate` helper to provide localized accessible names for these controls.
