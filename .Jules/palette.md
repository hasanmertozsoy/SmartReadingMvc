## 2024-05-23 - Localization Dictionary Verification
**Learning:** Automated diff reviews may flag translation keys as missing if they are not part of the changed context, even if they exist in the file. Always verify key existence by reading the full file or relevant sections before and after changes.
**Action:** When adding new keys, if possible, include adjacent existing keys in the search block to prove context, or explicitly list verified existing keys in the PR description to reassure reviewers.
