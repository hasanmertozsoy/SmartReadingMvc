## 2024-05-23 - Synchronous Canvas vs SVG Data URI
**Learning:** Generating background patterns using `canvas.toDataURL()` is a synchronous operation that blocks the main thread. In `generatePattern`, this took ~74ms per call. When generating 50 patterns (e.g., for a list), this froze the UI for ~3.7 seconds.
**Action:** Replaced with SVG string generation encoded to Base64 (`data:image/svg+xml;base64,...`). This reduced the operation time to ~0.16ms (99.8% faster) and is non-blocking. Always prefer SVG Data URIs over Canvas for simple generated backgrounds.
