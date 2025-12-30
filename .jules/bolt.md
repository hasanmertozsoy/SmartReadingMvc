## 2025-12-30 - Lazy Loading Canvas Patterns
**Learning:** Generating HTML5 Canvas patterns and converting them to Data URLs synchronously (e.g., `canvas.toDataURL()`) is extremely expensive and blocks the main thread. In a list rendering context, this can cause multi-second delays.
**Action:** Use `IntersectionObserver` to defer pattern generation until the element is near the viewport (lazy loading), effectively unblocking the initial render and distributing the computational load.
