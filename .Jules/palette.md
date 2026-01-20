## 2024-05-22 - Dashboard Card Accessibility
**Learning:** Interactive dashboard cards were implemented as `div`s with `onClick`, making them inaccessible to keyboard users. Converting them to `<button>` requires specific styling (`w-full text-left`) and converting internal `div`s to `span`s (with `block`/`flex` classes) to maintain valid HTML while preserving layout.
**Action:** When converting interactive cards to buttons:
1. Apply `w-full text-left` to the button.
2. Replace internal `div`s with `span`s.
3. Apply `block` or `flex` classes to `span`s to mimic the original layout.