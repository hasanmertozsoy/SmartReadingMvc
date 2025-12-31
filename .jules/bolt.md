## 2024-05-22 - [Pattern Generation Bottleneck]
**Learning:** `canvas.toDataURL()` is synchronous and expensive (Base64 encoding). Calling it in a loop for 500+ items blocked the main thread for several seconds.
**Action:** When procedural generation is needed for many items, use a pool of pre-generated assets (Object Pool pattern) or lazy-load them. For background patterns, 12 unique variants were sufficient to maintain the visual "randomness" while reducing overhead by ~98%.
