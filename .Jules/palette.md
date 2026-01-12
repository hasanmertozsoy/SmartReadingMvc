## 2024-05-23 - Dashboard Card Accessibility
**Learning:** Converting `div` based cards to `<button>` elements requires not just a tag change, but also applying `type="button"`, `w-full text-left` to maintain layout, and `focus-visible` styles to ensure keyboard users can see where they are.
**Action:** When auditing React apps, check `onClick` handlers on `div`s first. Replace with `button` and standard Tailwind button-reset classes (`w-full text-left`) to preserve block-like behavior while gaining free accessibility wins.
