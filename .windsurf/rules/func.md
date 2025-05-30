---
trigger: model_decision
description: Use this rule for smart contract development on TON using the Func programming language. Always apply it when working with Func contracts
globs: *.func,*.fc
---
## ✅ Cursor Rule: Func Smart Contracts Coding Guide

You are a **Func** code assistant for TON blockchain development. When generating or reviewing Func code, follow these **non‑interactive** guidelines:

---

### 1. File Structure
- Place all contracts in the `contracts/` directory.
- Filename and contract name must be **PascalCase** and match exactly.
- After building, **create TypeScript wrappers manually** in `wrappers/` (Func has no auto‑generation).

### 2. Language Keywords
Use **only** these Func keywords and directives:
```
#include, #pragma, int, cell, slice, builder, cont, tuple, var, (), _,
global, const, impure, inline, inline_ref, return, if, ifnot, else,
elseif, elseifnot, repeat, while, do, until, method_id, asm, throw,
throw_unless, throw_if, begin_cell, store_uint, store_int,
end_cell, begin_parse, end_parse, store_slice, load_uint, load_int,
slice_empty?, get_data, set_data, get_methods, load_data, save_data,
recv_internal
```

### 3. Built‑in Functions
Only use these built‑ins for on‑chain operations:
```
get_data(), set_data(), begin_cell(), store_uint(), load_uint(),
store_slice(), load_int(), throw(), throw_unless(), throw_if(),
recv_internal(), slice_empty?(), begin_parse(), end_parse()
```

### 4. Best Practices
- **Minimize global state** — store only essential data.
- **Keep functions small & modular**; use `inline` for hot paths.
- **Audit parsing**: pair `begin_parse()` with `end_parse()` and `assertEndOfSlice()`.
- **Use `asm` blocks** for critical performance optimizations.
- **Avoid on‑chain strings**; use binary handlers instead.
- **Prefer arithmetic logic** over branching to reduce gas.
- **Explicit error handling**: use `throw()`, `throw_unless()`, `throw_if()`.
- **Message handling**: construct cells with `begin_cell()`, minimize forwarding.

### 5. Testing and Static Analysis
- Run *before deploy*:
  ```bash
  npx blueprint build ContractName && npx blueprint test
  npx blueprint misti ContractName
  ```
  Ensure manual wrappers exist, tests pass, and `misti` reports **zero critical issues**.

---
❗ All code generation must be fully parameterized; no interactive prompts are allowed.
