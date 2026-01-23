## 2024-10-26 - Interactive Dashboard Cards Accessibility
**Learning:** Interactive dashboard elements (like Favorites and Review cards) should be implemented as semantic `<button type="button">` elements rather than `<div>`s to ensure keyboard accessibility.
**Action:** When auditing React apps, specifically check `onClick` handlers on `div` elements that serve as primary navigation or action triggers and convert them to buttons with explicit focus styles.
