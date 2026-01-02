## 2024-05-23 - Accessibility in Micro-Interactions
**Learning:** Even in minimalist designs, form inputs must have labels. Relying solely on placeholders is a common pattern in this codebase that hurts accessibility.
**Action:** When working on "modal" or "card" interfaces here, always check if placeholders are being used as labels. If so, add explicit `<label>` tags. Since the design is minimal, using simple block labels with subtle colors (`#aaa`) works well without breaking the aesthetic.
