## 2024-05-23 - [Accessibility First]
**Learning:** This project relies heavily on icon-only buttons for critical interactions (navigation, playback control, editing), but completely lacks ARIA labels, making it inaccessible to screen reader users.
**Action:** In future audits, check for icon-only buttons immediately as they are a common pattern in "modern" UI that often fails accessibility checks. I will prioritize adding `aria-label` to these elements.
