## 2024-05-23 - Lucide React Class Behavior
**Learning:** When passing a `className` prop to a Lucide React icon component (e.g., `<Heart className="..." />`), the default `lucide lucide-icon-name` classes may be overwritten rather than appended, depending on the implementation/version. This can break CSS selectors relying on those default classes.
**Action:** When styling or selecting Lucide icons that have custom classes, verify the rendered class list or target the custom class/SVG tag directly instead of relying on the default `lucide-*` classes.
