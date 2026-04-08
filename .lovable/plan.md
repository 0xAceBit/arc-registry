

## Plan: Wallet Connection + Onchain Review Hashing on Arc Testnet

### What This Does
When a user submits a review (insight) on a project detail page, their browser wallet (MetaMask) will sign and broadcast a transaction to the **Arc Testnet** that stores a hash of the review content onchain. This creates a verifiable, tamper-proof record of every review.

### Arc Testnet Details
- **Chain ID**: 5042002
- **RPC**: `https://rpc.testnet.arc.network`
- **Currency**: USDC (used as gas)
- **Finality**: Sub-second

### How It Works

1. User clicks "Submit Review" on a project detail page
2. App prompts wallet connection (MetaMask) if not already connected
3. App computes a keccak256 hash of the review content + project ID + timestamp
4. A transaction is sent to Arc Testnet with the hash in the `data` field (self-transfer of 0 value)
5. Once the transaction is confirmed, the review is saved to the database along with the transaction hash
6. The transaction hash is displayed alongside the review as proof

### Implementation Steps

**Step 1 — Install ethers.js**
Add `ethers` (v6) as a dependency for wallet interaction and hashing.

**Step 2 — Create a Wallet Context (`src/contexts/WalletContext.tsx`)**
- Manage wallet connection state (address, chain, connected status)
- Provide `connectWallet()` and `switchToArcTestnet()` helpers
- Auto-detect if MetaMask is installed; show install prompt if not
- Store Arc Testnet chain config (chainId 5042002, RPC, USDC as native currency)

**Step 3 — Add a "Connect Wallet" button to the Header**
- Show truncated wallet address when connected
- Show network indicator (green dot for Arc Testnet, warning for wrong network)

**Step 4 — Database migration: add `tx_hash` column to `project_insights`**
- `ALTER TABLE project_insights ADD COLUMN tx_hash text;`
- Stores the onchain transaction hash for each review

**Step 5 — Update review submission flow (`src/pages/ProjectDetail.tsx`)**
- Before saving to DB, require wallet connection
- Compute `keccak256(projectId + reviewContent + timestamp)` 
- Send a 0-value transaction to the user's own address with the hash as calldata
- Wait for confirmation, capture `tx_hash`
- Save review + `tx_hash` to `project_insights`
- Display the tx hash as a link to an explorer (or raw hash) next to each review

**Step 6 — Fix existing MetaMask runtime error**
- The current "Failed to connect to MetaMask" error is likely from stale code or a global detection script. Will clean this up so it only triggers on user action.

### Important Notes
- Users need USDC on Arc Testnet to pay gas. The app will show a clear message about this and link to the Arc testnet faucet if available.
- Reviews can still be viewed by anyone (no wallet needed for reading).
- The wallet connection is optional for browsing — only required when submitting a review.

### Files Changed
| File | Change |
|------|--------|
| `package.json` | Add `ethers` v6 |
| `src/contexts/WalletContext.tsx` | New — wallet connection logic |
| `src/App.tsx` | Wrap with `WalletProvider` |
| `src/components/Header.tsx` | Add wallet connect button |
| `src/pages/ProjectDetail.tsx` | Onchain tx before DB insert |
| Migration SQL | Add `tx_hash` to `project_insights` |

