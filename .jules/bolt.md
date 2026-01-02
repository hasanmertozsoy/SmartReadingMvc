## 2024-05-23 - [Frontend] Replaced Expensive Canvas Generation with CSS Gradients
**Learning:** `canvas.toDataURL()` is extremely expensive (synchronous compression/encoding) and blocks the main thread when used in a loop. Even for "simple" random patterns, generating images on the fly is a major bottleneck.
**Action:** Prefer CSS gradients for random background generation. They are instant, hardware-accelerated, and don't block the JS thread.
