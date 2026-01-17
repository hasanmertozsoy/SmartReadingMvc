## 2024-05-22 - [Canvas vs SVG for Background Generation]
**Learning:** Generating simple geometric patterns for backgrounds using the Canvas API (`toDataURL`) is significantly slower (~60ms) than constructing an equivalent SVG string and Base64 encoding it (~0.06ms). This is because Canvas operations involve the GPU context and rasterization, while string manipulation is purely CPU-bound and very fast for simple shapes.
**Action:** Prefer SVG Data URIs over Canvas for generated background images when the shapes are simple (rectangles, circles, polygons) and static.
