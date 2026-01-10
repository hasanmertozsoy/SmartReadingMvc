## 2024-05-22 - Canvas vs SVG for Static Backgrounds
**Learning:** Generating static background patterns with `canvas.toDataURL` is extremely expensive (~60ms/op) and blocks the main thread. Switching to Base64-encoded SVG strings (~0.15ms/op) provides a ~400x speedup and removes the main thread blockage.
**Action:** Prefer SVG Data URIs over Canvas for procedural static images, especially when generated in loops or sensitive render paths.
