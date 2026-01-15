## 2026-01-15 - Icon-Only Button Accessibility
**Learning:** The application relies heavily on icon-only buttons (using `lucide-react`) which lack accessible names by default. The existing `translate` helper and dictionary structure make it straightforward to add localized `aria-label` attributes without introducing new dependencies.
**Action:** When encountering icon-only buttons, systematically verify `aria-label` presence and add corresponding keys to the `dictionary` object in `app.js` to support both Turkish and English.
