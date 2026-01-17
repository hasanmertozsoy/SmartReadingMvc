## 2024-05-22 - [Refactoring Nested Interactive Elements]
**Learning:** Converting interactive `div` cards to `<button>` elements creates invalid HTML (nested buttons) if the card itself contains other buttons (like "Edit" or "Delete"). This breaks the accessibility tree and is technically invalid.
**Action:** For complex interactive cards containing other interactive elements, use `div` with `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler (for Enter/Space) instead of a semantic `<button>` tag. This maintains accessibility without invalid nesting.
