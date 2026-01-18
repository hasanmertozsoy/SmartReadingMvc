## 2026-01-18 - Dashboard Card Accessibility
**Learning:** Replacing clickable `div`s with semantic `<button>` elements on the dashboard improved accessibility without breaking the layout. The key was adding `w-full text-left` classes to override default button centering and width behaviors, maintaining the original card appearance.
**Action:** When refactoring interactive cards to buttons, always check for alignment shifts and explicitly set width and text alignment classes to match the previous `div` styling.
