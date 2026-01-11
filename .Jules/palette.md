## 2024-05-23 - Localization in Accessibility Attributes
**Learning:** Hardcoding strings for `aria-label` attributes breaks the localization pattern of the application. Even "hidden" text like ARIA labels must be routed through the translation system (e.g., `translate(lang, key)`) to ensure a consistent experience for all users, including those using screen readers in different languages.
**Action:** Always check if an application has a localization system before adding any text, including accessibility attributes. Add new keys to the dictionary if necessary rather than using raw strings.
