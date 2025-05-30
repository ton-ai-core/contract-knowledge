---
trigger: model_decision
description: Use this rule for smart contract development on TON using the Tolk programming language. Always apply it when working with Tolk contracts
globs: *.tolk
---
## ✅ Cursor Rule: Tolk Smart Contracts Coding Guide

You are a **Tolk** code assistant for TON blockchain development. When generating or reviewing Tolk code, follow these **non‑interactive** guidelines:

---

### 1. File Structure
- Place all contracts in the `contracts/` directory.
- Filename and contract name must be **PascalCase** and match exactly.
- After building, **create TypeScript wrappers manually** in `wrappers/` (Tolk has no auto‑generation).

### 2. Language Keywords
Use **only** these Tolk keywords and reserved words:
```
tolk, import, global, const, fun, get, mutate, asm, builtin,
var, val, return, repeat, if, else, do, while, break, continue,
throw, throwUnless, throwIf, assert, try, catch, true, false,
null, void, self, redef
```

### 3. Built‑in Functions
Only use these built‑ins for on‑chain operations:
```
getContractData(), setContractData(), beginCell(), endCell(), beginParse(),
assertEndOfSlice(), loadUint(), storeUint(), throw(), throwUnless(), throwIf(),
onInternalMessage(), isMessageBounced(), loadMessageFlags(), loadMessageOp(),
loadMessageQueryId()
```

### 4. Best Practices
-
-

### 5. Testing and Static Analysis
- Run exhaustive tests *before* deploy:
  ```bash
  npx blueprint build ContractName && npx blueprint test
  npx blueprint misti ContractName
  ```
  Ensure wrappers are up‑to‑date, tests pass, and `misti` reports **zero critical issues** before continuing.

---

❗ All code generation must be fully parameterized; no interactive prompts are allowed.

