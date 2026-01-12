## 2024-03-21 - Canvas vs. SVG Pattern Generation
**Learning:** Generating background patterns using the Canvas API (`fillRect`, `arc`, `toDataURL`) on the main thread is extremely expensive (approx 54ms per call in this environment).
**Action:** For simple geometric patterns, constructing an SVG string and using it as a Base64 Data URI is ~1000x faster (approx 0.05ms per call) and produces equivalent visual results without blocking the UI.
