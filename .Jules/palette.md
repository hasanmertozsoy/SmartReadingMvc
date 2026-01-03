## 2024-05-23 - Modal Accessibility Pattern
**Learning:** This app uses vanilla JS to toggle modals (`display: flex/none`). Without explicit focus management, keyboard users get lost, and screen readers don't perceive the modal context.
**Action:** Always implement `lastFocusedElement` tracking and `aria-modal="true"` for vanilla JS modals. Use `tabIndex="-1"` on the modal container if it lacks inputs to ensure focus moves inside.

## 2024-05-23 - Minimalist Forms vs. Labels
**Learning:** The "minimalist" dark theme relied solely on placeholders, which fails accessibility checks.
**Action:** Adding explicit `.input-label` classes that are subtle (small font, low contrast `#aaa`) balances the aesthetic requirements with accessibility needs better than removing labels or using "sr-only" classes when visual cues are helpful.
