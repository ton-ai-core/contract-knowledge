---
trigger: model_decision
description: Use this rule for smart contract development on TON using the TACT programming language. Always apply it when working with TACT contracts
globs: *.tact
---
## 🚀 Core Tact Guidelines

### 1. Contract Declaration
```tact
contract MyContract(owner: Address) { … }
````

* **Header parameters** auto-generate `init`—do not write a separate `init` with the same fields.
* Filenames in snake_case (e.g., `my_contract.tact`); contract names in PascalCase.

### 2. Imports

```tact
import "./other_contract.tact";
import "@stdlib/stdlib.tact";
```

* Use relative paths for local contracts.
* Use `@stdlib` for standard libraries.

### 3. Messages & Structs

```tact
message(0x01) Transfer { to: Address; amount: Int as coins; }
struct User { id: Address; balance: Int; }
```

* Always specify explicit opcode (`message(0x…)`) to avoid collisions.
* Use `as coins` for currency fields.

### 4. Built-in Functions

Key reserved keywords in Tact:
```plaintext
fun, let, return, receive, native, primitive, null, 
if, else, while, repeat, do, until, try, catch, 
foreach, as, map, message, mutates, extends, external, import,
with, trait, initOf, override, abstract, virtual, 
inline, const, extend, public, true, false, null
```

* **Context & System**
  `context()`, `sender()`, `myAddress()`, `myBalance()`, `now()`, `commit()`
* **Messaging**
  `send()`, `message()`, `deploy()`, `cashback()`
* **Errors & Debug**
  `require(cond)`, `throwUnless(cond)`, `dump()`, `dumpStack()`
* **Crypto & Hash**
  `checkSignature(pubkey, sig)`, `sha256(data)`, `keccak256(data)`
* **Cell Ops**
  `beginCell()`, `.storeUint()`, `.loadUint()`, `.endCell()`


### 5. Security Patterns

* Validate `sender()` and all input via `require()` or `throwUnless()`.
* Use a unique `seqno` for each critical action to prevent replay.
* Always verify any external signature before processing.

### 6. Gas Efficiency

* Minimize state writes and variables—store only essential fields.
* Use compact types (`uint8`, `coins`) for counters and amounts.
* Favor standard library functions over custom cell manipulation.

---

## ⛔️ Error Handling & Rollback

* On any Tact compile or runtime error, immediately fix the same file (do not duplicate or create new files), rebuild, and retest until no errors remain.