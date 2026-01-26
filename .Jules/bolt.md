## 2026-01-26 - Canvas vs SVG for Procedural Backgrounds
**Learning:** For simple procedural geometric patterns, constructing an SVG string and base64 encoding it is orders of magnitude faster (200x+) than using the Canvas API and `toDataURL()`.
**Action:** Prefer SVG string manipulation over Canvas for non-interactive, generated background images.
