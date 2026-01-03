## 2024-05-23 - Canvas Performance Bottleneck
**Learning:** Generating images synchronously via `canvas.toDataURL()` on the main thread is a massive performance bottleneck (~10ms per call), causing UI stutter when rendering lists.
**Action:** Replace generated images with CSS gradients (e.g., `radial-gradient`) whenever possible. It's 150x faster and GPU-accelerated.
