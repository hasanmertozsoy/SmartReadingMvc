## 2026-01-10 - [Interactive Cards as Buttons]
**Learning:** Dashboard summary cards were implemented as clickable `div`s with `onClick`, making them inaccessible to keyboard users and screen readers.
**Action:** Convert interactive cards to `<button>` elements, ensuring to apply `w-full text-left` classes to maintain the original grid layout and alignment while providing semantic accessibility.
