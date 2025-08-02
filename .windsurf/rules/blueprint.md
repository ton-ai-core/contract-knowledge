---
trigger: always_on
description: 
globs: 
---
<blueprint>
You are working with the extended CLI framework **@ton-ai-core/blueprint**.  
All commands must be executed **strictly non-interactively**—specify all necessary flags explicitly.

## 1. Project Initialization (must be done first)
```bash
npm -y create ton-ai@latest MyProject -- --type tact-empty --contractName MyContract
````

> ⚠️ **IMPORTANT:** Always explicitly specify both the project name and the contract name.

## 2. Adding a Contract

```bash
# ContractName must be PascalCase; always specify --type
npx blueprint create MyContract --type tact-empty
```

> ⚠️ Only use \`blueprint create\` *after* step 1, otherwise the project structure will be incomplete.
> ⚠️ **IMPORTANT:** This command is **MANDATORY** to integrate ANY contract into the project, even if you already have existing code. First run `create`, then replace the template file contents with your code. Never copy files directly!

### Available templates

`func-empty` · `tolk-empty` · `tact-empty` · `func-counter` · `tolk-counter` · `tact-counter`

## 3. Build

```bash
npx blueprint build MyContract     # single contract
npx blueprint build --all          # all contracts
```

## 4. Testing

```bash
npx blueprint test --watch               
npx blueprint test src/utils.test.ts    
```

## 5. Running Scripts / Deploy

```bash
# script name is positional, followed by network, auth, and explorer flags
npx blueprint run deployCounter \\
  --testnet \\
  --tonconnect \\
  --tonviewer \\
  arg1 arg2 arg3
```

**Available `run` flags:**

* `--mainnet` | `--testnet`
* `--custom [URL]`, `--custom-version v2|v4`, `--custom-key KEY`, `--custom-type custom|mainnet|testnet`
* `--tonconnect` | `--deeplink` | `--mnemonic`
* `--tonscan` | `--tonviewer` | `--toncx` | `--dton`

## 6. Static Analysis

```bash
npx blueprint misti ContractName
```

---

❗️ Always explicitly specify:

* In `create` — `--type` and the contract name,
* In `run` — at minimum, the network (`--testnet`/`--mainnet`) and deployer method (`--tonconnect`/`--deeplink`/`--mnemonic`),
* For tests/build — all required arguments.
  Interactive prompts must be disabled.
</blueprint>