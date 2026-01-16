## 2024-05-22 - Visualizing Hidden A11y Attributes
**Learning:** Verifying invisible attributes like `aria-label` via screenshots is impossible without DOM manipulation. Injecting a script to create visible tooltips from these attributes allows for instant visual verification of accessibility coverage.
**Action:** When verifying accessibility improvements, inject a JS helper that renders `aria-label` values as visible overlays before capturing the screenshot.

## 2024-05-22 - Localization Key Verification
**Learning:** Adding translated ARIA labels requires ensuring the keys exist in the dictionary. The `translate` function returns empty strings for missing keys, which can silently fail accessibility checks if not verified.
**Action:** Always grep/search the dictionary object for existing keys before adding new ones, and add any missing keys to both language objects (TR/EN).
