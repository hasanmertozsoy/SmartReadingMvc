## 2024-05-23 - Canvas vs SVG for Procedural Patterns
**Learning:** Using Canvas API + `toDataURL` for generating simple procedural background patterns is extremely expensive (blocking main thread for ~200ms for 5 images) compared to generating SVG strings (blocking for ~0.4ms).
**Action:** For simple geometric patterns that need to be generated at runtime (e.g. unique backgrounds per list item), prefer Base64-encoded SVG strings over Canvas generation. It significantly reduces main thread blocking time and eliminates image compression overhead.
