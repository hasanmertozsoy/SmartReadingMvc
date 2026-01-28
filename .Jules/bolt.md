## 2024-05-23 - Canvas vs SVG for Procedural Backgrounds
**Learning:** Generating procedural background patterns using the Canvas API (`getContext('2d')`, `fillRect`, `toDataURL`) is significantly slower (~70-150x) than generating an equivalent SVG string and base64 encoding it. Canvas requires layout/rasterization overhead, while SVG is just string manipulation.
**Action:** For simple procedural graphics that don't require pixel manipulation, prefer constructing SVG data URIs.
