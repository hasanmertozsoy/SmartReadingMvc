## 2024-05-22 - [Keyboard Accessibility for Card Components]
**Learning:** In Tailwind-styled projects, converting interactive cards from `div` to `button` (for accessibility) typically requires adding `w-full text-left` to preserve the block-level, left-aligned layout of the original card. Without this, the button centers text and shrinks to fit content by default.
**Action:** Always verify layout regression visually or via computed styles when semantically upgrading containers to buttons. Add `w-full text-left` to the button classes immediately.
