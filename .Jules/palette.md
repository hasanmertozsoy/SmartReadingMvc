## 2024-05-22 - [Accessibilizing Icon-Only Buttons in Custom Localization System]
**Learning:** The application's custom dictionary-based localization system requires explicit keys for all interactive elements, including icon-only buttons which were previously overlooked.
**Action:** When adding new interactive elements, verify if a corresponding key exists in the `dictionary` object in `app.js` or add one, and always bind `aria-label` to the `translate()` function.
