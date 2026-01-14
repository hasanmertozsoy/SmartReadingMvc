## 2026-01-14 - Canvas vs SVG for Static Backgrounds
**Learning:** Generating static background patterns using the Canvas API (`canvas.toDataURL`) is significantly slower (~60ms) compared to generating Base64-encoded SVG Data URIs (~0.06ms) on the main thread.
**Action:** For purely decorative, static, and geometric backgrounds, prefer constructing SVG strings and encoding them with `btoa()` over using the Canvas API to avoid blocking the main thread, especially in loops or during scrolling.
