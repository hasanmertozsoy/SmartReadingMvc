## 2024-05-23 - Empty State Pattern
**Learning:** Users arriving at the "Smart Reading" dashboard with 0 notes saw a blank screen, creating confusion about the app's purpose.
**Action:** When implementing list views, always handle the `length === 0` case with a guiding message (e.g., "Press + to start").
