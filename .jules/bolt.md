## 2026-01-16 - Canvas vs SVG Data URI Performance
**Learning:** Generating procedural background patterns using the Canvas API (`ctx.fill`, `canvas.toDataURL`) is significantly slower than constructing an SVG string and Base64 encoding it.
**Measurement:** Canvas implementation took ~80ms per operation, while SVG implementation took ~0.06ms per operation (a ~1300x improvement).
**Action:** When generating simple geometric patterns for `background-image`, prefer constructing SVG strings and using `data:image/svg+xml;base64,...` to avoid blocking the main thread.
