# Deployment Guide — GenGrant

## Part 1: Deploy the GenLayer Intelligent Contract

### Prerequisites
- Python 3.10+
- GenLayer Studio CLI (`pip install py-genlayer`)
- A funded GenLayer account

### Step 1 — Install the SDK

```bash
pip install py-genlayer
```

### Step 2 — Verify contract syntax

```bash
cd C:/Users/admin/OneDrive/Documents/Genlayer/GenGrant
genlayer lint GenGrant.py
```

### Step 3 — Deploy

```bash
genlayer deploy GenGrant.py --name GenGrant
```

The CLI prints the deployed contract address. Copy it — you'll need it for the frontend.

### Step 4 — Create a test program

```python
from genlayer import *
import GenGrant

contract = GenGrant.GenGrant.at("<DEPLOYED_ADDRESS>")
contract.create_program(
    title="AI Agents Grant",
    description="Funding AI agent infrastructure on GenLayer",
    total_budget=u256(500_000),
    max_grant_amount=u256(50_000),
)
```

### Step 5 — Submit a test application

```python
contract.submit_application(
    program_id=u256(0),
    project_name="Nexus Protocol",
    description="Autonomous AI agents for DeFi strategies",
    website_url="https://nexusprotocol.ai",
    github_url="https://github.com/nexus/nexus",
    docs_url="https://docs.nexusprotocol.ai",
    requested_amount=u256(45_000),
)
```

### Step 6 — Run AI evaluation

```python
result = contract.evaluate_application(u256(0))
print(result)  # JSON string with scores + decision
```

### Step 7 — Release funding (if APPROVED)

```python
result = contract.release_funding(u256(0))
print(result)  # "FUNDED"
```

---

## Part 2: Deploy the Frontend

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- Vercel account (free tier works)

### Step 1 — Install dependencies

```bash
cd C:/Users/admin/OneDrive/Documents/Genlayer/GenGrant/frontend
npm install
```

### Step 2 — Verify the build

```bash
npm run build
# Should end with: "✓ Compiled successfully"
```

### Step 3 — Configure environment

Create `.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
NEXT_PUBLIC_GENLAYER_RPC=https://rpc.genlayer.com
NEXT_PUBLIC_NETWORK=mainnet
```

### Step 4 — Run locally

```bash
npm run dev
# → http://localhost:3000
```

### Step 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or push to GitHub and import into Vercel dashboard.

### Step 6 — Connect frontend to contract

In the frontend, replace the mock contract address in `settings/page.tsx` with the real one:

```ts
const contract = "<DEPLOYED_ADDRESS>";
```

Then replace mock API calls with real GenLayer RPC calls using `viem` or `ethers`.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `genlayer: command not found` | Reinstall: `pip install --force-reinstall py-genlayer` |
| `ModuleNotFoundError: genlayer` | Ensure Python 3.10+ is used, not system Python |
| `ImportError` on deploy | Verify `GenGrant.py` is in current directory |
| Frontend build fails on `lucide-react` | Pin to `lucide-react@1.17.0` in package.json |
| Type errors from Framer Motion | Use `variants={fadeUp as any}` cast (FM v12 types are strict) |
