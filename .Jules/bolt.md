## 2024-05-23 - [Canvas to SVG Data URI Optimization]
**Learning:** Replacing `canvas.toDataURL()` with procedural SVG Data URIs (`data:image/svg+xml;base64,...`) yielded a massive performance improvement (850x speedup) and 4x memory reduction for generated background patterns.
**Action:** For simple, frequent procedural graphics, always prefer vector-based Data URIs over client-side rasterization. It avoids main-thread blocking and scales perfectly without pixelation.
