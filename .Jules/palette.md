## 2026-01-19 - Interactive Cards Semantics
**Learning:** Using `div`s with `onClick` for card-like interactive elements hurts accessibility (no keyboard focus). Converting them to `<button>` is the right fix, but requires careful HTML structure (avoiding `div` inside `button`) and styling (re-adding `cursor-pointer` if CSS reset removes it, and ensuring `w-full text-left` to maintain layout).
**Action:** When refactoring interactive cards to buttons, always replace inner `div`s with `span`s (block/flex) and verify `cursor` style.
