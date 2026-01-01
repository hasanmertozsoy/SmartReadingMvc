## 2024-05-23 - Accessibility in Minimalist Forms
**Learning:** In minimalist designs heavily reliant on placeholders, adding visible `<label>` elements requires global styling adjustments (`display: block`, color contrast) to maintain aesthetic coherence while ensuring WCAG compliance.
**Action:** When adding labels to existing form inputs in this repo, ensure `label` tag is styled globally in `style.css` to match the dark theme (grey text, small font) rather than relying on browser defaults or adding per-element classes.
