## 2026-01-13 - Interactive Dashboard Cards
**Learning:** Interactive dashboard summaries (like "Favorites" or "Review" stats) implemented as clickable `div`s are inaccessible to keyboard users.
**Action:** Refactor to `<button type="button">` with `w-full text-left` to preserve layout while ensuring native accessibility (tab index, enter/space activation).
