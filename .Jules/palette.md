# Palette's Journal

## 2024-05-22 - Semantic Elements for Interactive Cards
**Learning:** Interactive dashboard elements (like Favorites and Review cards) implemented as `div`s with `onClick` are inaccessible to keyboard users.
**Action:** Always implement such cards as `<button type="button">` elements. Use `w-full text-left` to maintain the block-like layout and text alignment while gaining native keyboard accessibility (tab focus, Enter/Space activation).
