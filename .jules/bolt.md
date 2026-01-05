## 2024-05-23 - [Frontend] - Canvas toDataURL Performance
**Learning:** `canvas.toDataURL()` is a synchronous operation that can block the main thread, especially when called repeatedly in a loop (e.g., rendering a list of items). This causes UI stuttering during the "render" phase of the application.
**Action:** Replace `canvas.toDataURL()` with SVG Data URIs (`data:image/svg+xml;base64,...`) when generating simple procedural graphics. SVG string manipulation is significantly faster and non-blocking compared to rasterizing a canvas.
