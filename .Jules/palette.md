## 2024-05-22 - Dashboard Card Accessibility
**Learning:** The dashboard cards were implemented as `div`s with `onClick`, making them inaccessible to keyboard users.
**Action:** Convert these cards to `<button>` elements with `w-full text-left` classes to preserve the visual layout while gaining native keyboard focus and semantic role support.
