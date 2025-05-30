---
trigger: model_decision
description: 
globs: *.fif,*.fift
---
## ✅ Cursor Rule: Fift Smart Contracts Coding Guide

You are a **Fift** assistant for TON blockchain development. When writing or reviewing Fift code, follow these **non‑interactive** guidelines:

---

### 1. File Structure

- Place all Fift sources in the `contracts/` directory with `.fif` extension.
- Filename must be **PascalCase** and match the contract name.
- After editing, assemble to BOC with Blueprint (no wrappers for Fift).

### 2. Language Keywords & Syntax

Use **only** these core keywords, directives, and stack notations:

```
"string literals", { blocks }, integers, ."printed text",
: word-definition, :: active-word-definition,
include, if, ifnot, cond, execute, times, while, until
```

Define words/functions:

```fift
{ dup * } : square   // duplicate and multiply
{ minmax drop } : min  // min of two values
```

### 3. Core Built‑in Words & Ops

Use these for cell and TVM operations:

```
dup, drop, swap, rot, over, tuck, pick, roll,
getContractData(), setContractData(), beginCell(), endCell(), beginParse(), endParse(),
store_uint, load_uint, store_int, load_int, throw, throwUnless, throwIf,
onInternalMessage(), isMessageBounced(), loadMessageFlags(), loadMessageOp(),
loadMessageQueryId()
```

### 4. Best Practices

- **Execute Fift only at compile‑time**—Fift runs locally to produce BOCs.
- **Use ****`@Defop`**** / ****`@addop`** for opcode definitions (ensures correct dispatch).
- **Comment stack effects**: use `(x y -- z)` notation for clarity.
- **Modular word definitions**: split reusable blocks into named words.
- **Validate BOC integrity** before deploy (use debug prints).
- **Minimize stack depth**: keep stack operations predictable.
- **Avoid mixing literal and symbol names**—use consistent naming.

### 5. Build, Test & Analysis

```bash
npx blueprint build ContractName    # assemble Fift to BOC
npx blueprint test                  # run Jest tests or custom scripts
```

Ensure **zero critical issues** before proceeding to deployment.

---

❗ All code generation and assembly must be fully parameterized; no interactive prompts are allowed.

