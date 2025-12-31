## 2024-05-23 - Modal Focus Management
**Learning:** Simple `display: flex` modals trap keyboard users outside the modal context unless focus is explicitly moved.
**Action:** Always pair `display` toggles with an explicit `.focus()` call to the first interactive element inside the modal.

## 2024-05-23 - Implicit Labels via Placeholders
**Learning:** "Minimalist" forms relying on placeholders confuse screen readers and vanish upon typing, hurting usability.
**Action:** Retrofit visible labels even in "clean" designs; use consistent inline styles if CSS classes are restricted.
