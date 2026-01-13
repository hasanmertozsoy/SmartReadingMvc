# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Record critical performance learnings here.

## 2024-05-22 - Canvas vs SVG Pattern Generation
**Learning:** Generating background patterns using the Canvas API (`createElement`, `getContext`, `fillRect`, `toDataURL`) is significantly slower (~53ms/op) than generating an equivalent SVG Data URI via string manipulation (~0.04ms/op).
**Action:** Prefer SVG Data URIs over Canvas `toDataURL` for dynamically generated simple graphics, especially when done in loops or initialization.
