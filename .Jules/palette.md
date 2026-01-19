## 2024-10-18 - Dynamic ARIA Labels
**Learning:** Dynamic accessibility labels for toggle buttons (e.g., Mute/Unmute) must be implemented using ternary operators within the `aria-label` attribute (e.g., `translate(lang, isMuted ? 'unmute' : 'mute')`) to ensure screen readers announce the correct action.
**Action:** When adding accessibility labels to state-toggling buttons, always verify that the label updates dynamically with the state.
