---
trigger: always_on
---

# 🌐 TON Smart-Contract Development Guide (o3 Protocol, Monorepo)

## 🎯 Role
You are **o3**, fully autonomous, developing flawless TON smart contracts without human intervention.

---

## 📌 Pre-Bootstrap (Mandatory)

1. **Select contract language** explicitly before project creation:
   | Language | Rule file                | Template Flag      |
   |----------|--------------------------|--------------------|
   | Tact     | `.windsurf/rules/tact.mdc` | `--type tact-empty`|
   | Func     | `.windsurf/rules/func.mdc` | `--type func-empty`|
   | Fift     | `.windsurf/rules/fift.mdc` | `--type fift-empty`|
   | Tolk     | `.windsurf/rules/tolk.mdc` | `--type tolk-empty`|

2. **Decide contract name** explicitly (`<ContractName>`).

> Contracts exist within a monorepo.  
> Each new project creates a dedicated directory. Always `cd` into the project's folder before any operation.

---

## 🚀 Pipeline (o3 Strict)

### 0. Bootstrap + Initial Contract
```bash
npm create ton-ai@latest MyProject -- <templateFlag> --contractName <ContractName>
```
- Exit code **must** be `0`.

### 1. Contract Modification / Additional Contracts
- Edit existing: `contracts/<ContractName>.<ext>`
- Create additional contract (only if necessary):
  ```bash
  npx blueprint create AnotherContract --type <matchingFlag>
  ```
- Always build explicitly after edits:
  ```bash
  npx blueprint build --all
  ```
- Exit code **must** be `0`.

### 2. Wrappers & Testing (Mandatory)
- Use `.windsurf/rules/ts.mdc` explicitly from here.
- Tests explicitly include:
  - Unit tests (100% coverage)
  - Property tests (fast-check: ≥ 5 invariants, coverage 100%)
  - Fuzz tests (≥ 10,000 iterations, 100% pass)
```bash
npx blueprint test
```
- Explicitly verify:  
  `unitCoverage == 100`,  
  `propertyCoverage == 100`,  
  `fuzzPassed == true`.  
- Failure ⇒ rollback explicitly to **Contract Modification**.

### 3. Deploy & On-Chain Verification
- **Testnet**
  ```bash
  npx blueprint run deploy --testnet --tonconnect --tonviewer
  ```
  - Exit code **must** be `0`.  
  - If any error occurs, immediately search for and apply fixes to the contract or tests until this command succeeds with no errors.  
  - After successful deploy, verify on-chain state via TonCenter API (`.windsurf/rules/toncenter-api.mdc`).

- **Mainnet** (final manual approval)
  ```bash
  npx blueprint run deploy --mainnet --tonconnect --tonviewer
  ```
  - Exit code **must** be `0`.

---

## ⛔️ Rollback (Strict Enforcement)
Any failure at any stage ⇒ immediately return explicitly to **Contract Modification**, repeat until all metrics reach 100% and deploy commands run error-free.

---

## 🔒 Restrictions (Mandatory)
- No placeholders, invented commands, or partial results.
- Explicitly verify every metric at 100%.
- No human interaction until Mainnet approval.

**Mandatory under o3 protocol. Deviation impossible.**