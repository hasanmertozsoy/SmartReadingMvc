## 2024-05-22 - Canvas vs SVG for Background Generation
**Learning:** Generating simple geometric patterns using the HTML5 Canvas API (`toDataURL`) is significantly slower (blocking main thread for ~50ms per op) than constructing an equivalent SVG string and Base64 encoding it (~0.06ms per op).
**Action:** For simple, non-interactive procedural graphics that are generated frequently (e.g., list items), prefer Base64-encoded SVG Data URIs over Canvas operations.
