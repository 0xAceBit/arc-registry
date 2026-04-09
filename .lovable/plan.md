

## Plan: Fix Arc Testnet Configuration + API Key Discussion

### What Changes

The current `ARC_TESTNET` config in `src/contexts/WalletContext.tsx` has incorrect values compared to the official chainlist data. This is likely why "Add & Switch Network" fails silently in some wallets.

### Corrections (from chainlist.org/chain/5042002)

| Field | Current (Wrong) | Correct |
|-------|-----------------|---------|
| `chainId` | `"0x4CF5D2"` | `"0x4CEF52"` |
| `rpcUrls` | `["https://rpc.testnet.arc.network"]` | `["https://rpc.testnet.arc.network", "https://arc-testnet.drpc.org"]` (fallback RPC) |
| `blockExplorerUrls` | `["https://testnet.arc.network"]` | `["https://testnet.arcscan.app"]` |
| `isCorrectNetwork` check | `chainId === 5042002` | No change needed (5042002 decimal = 0x4CEF52 hex) |

Wait — let me verify: `0x4CF5D2` = 5,043,666 which is **wrong**. `0x4CEF52` = 5,042,002 which is **correct**. This hex mismatch is the root cause of network add/switch failures.

### Files Changed

| File | Change |
|------|--------|
| `src/contexts/WalletContext.tsx` | Fix `chainId` hex to `"0x4CEF52"`, update `rpcUrls` to include drpc.org fallback, fix `blockExplorerUrls` to `"https://testnet.arcscan.app"` |

### About Entity / API Key Tracking

You do **not** need to integrate an external API key to track transactions. Since every onchain review already stores the `tx_hash` in your database (`project_insights` table), you can track all developer activity through your existing data. The block explorer at `https://testnet.arcscan.app` can be used to verify any transaction by hash.

If you later want analytics on gas usage, transaction volume, or user activity across your app, that can be built as an admin dashboard feature using the data already in your database — no third-party API key needed.

