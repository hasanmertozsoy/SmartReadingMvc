## 2024-05-22 - Accessibility in Minimalist React Apps
**Learning:** In "no-build" single-file React applications, there's a strong tendency to prioritize visual minimalism, leading to icon-only buttons without `aria-label` attributes.
**Action:** Always scan for `lucide-react` (or similar icon library) usage and ensure every interactive element wrapping an icon has a corresponding `aria-label`, utilizing the existing `translate` helper for internationalization.
