---
trigger: always_on
description: 
globs: 
---
<toncenter-api>
# TON Center API Verification Rule

**CRITICAL**: Always verify blockchain results with curl after any contract operation.

## API Endpoints
- **Testnet**: `https://testnet.toncenter.com/api/v2/`
- **Mainnet**: `https://toncenter.com/api/v2/`

## Essential curl Commands

### Contract Status Check
```bash
curl -s "https://testnet.toncenter.com/api/v2/getAddressInformation?address={ADDRESS}" | jq '.result.state'
```
Must return `"active"` for successful deployment.

### Get Method Call
```bash
curl -s -X POST "https://testnet.toncenter.com/api/v2/runGetMethod" \
  -H "Content-Type: application/json" \
  -d '{"address":"{ADDRESS}","method":"{METHOD}","stack":[]}' | jq
```

### Transaction History
```bash
curl -s "https://testnet.toncenter.com/api/v2/getTransactions?address={ADDRESS}&limit=5" | jq
```

## Verification Checklist
After any contract operation:
- [ ] Contract state is `"active"`
- [ ] Get methods return expected data
- [ ] Transaction history shows success

## Best Practices
- Always use `-s` flag and pipe to `jq`
- Check testnet before mainnet
- Verify state before proceeding
</toncenter-api>