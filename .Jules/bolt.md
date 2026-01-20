## 2026-01-20 - [Optimizing Canvas to SVG Data URI]
**Learning:** For simple, procedural background generation, creating an SVG string and Base64 encoding it is orders of magnitude faster (0.06ms vs 28.5ms) and lighter (4.7KB vs 17KB) than using the Canvas API's `toDataURL('image/jpeg')`.
**Action:** When needing procedural graphics that don't require pixel-level manipulation, prefer SVG Data URIs over Canvas operations to avoid blocking the main thread and reduce memory usage.
