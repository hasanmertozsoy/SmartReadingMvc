# Bolt's Journal

## 2024-05-22 - Canvas vs SVG for Procedural Backgrounds
**Learning:** Replaced a `canvas` based pattern generator (drawing 20 shapes + `toDataURL`) with a pure string-based SVG Data URI generator.
**Impact:** `generatePattern` went from ~57ms to ~0.6ms per call (100x speedup).
**Action:** For simple procedural graphics, prefer Base64 encoded SVG strings over Canvas API to avoid main thread blocking and expensive rasterization.
