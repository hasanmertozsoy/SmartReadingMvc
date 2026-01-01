## 2024-05-21 - Pattern Pooling Discrepancy
**Learning:** The codebase lacked the pattern pooling optimization described in project memory, causing significant rendering overhead (200ms+ for 50 cards).
**Action:** Always verify "known" optimizations exist in the actual code before assuming performance characteristics. Restored pooling to reduce overhead to near-zero.
