# Sample Data — GenGrant

Use these values to test the GenGrant contract and frontend before going live.

## Sample Programs

```python
from genlayer import *
import GenGrant

contract = GenGrant.GenGrant.at("<DEPLOYED_ADDRESS>")

# Program 0 — AI Agents Grant
contract.create_program(
    title="AI Agents Grant",
    description="Funding AI agent infrastructure and tooling on GenLayer.",
    total_budget=u256(500_000),
    max_grant_amount=u256(50_000),
)

# Program 1 — Web3 Infrastructure
contract.create_program(
    title="Web3 Infrastructure",
    description="Supporting core protocol development and cross-chain tooling.",
    total_budget=u256(750_000),
    max_grant_amount=u256(75_000),
)

# Program 2 — Developer Tooling
contract.create_program(
    title="Developer Tooling",
    description="Improving the developer experience across ecosystems.",
    total_budget=u256(300_000),
    max_grant_amount=u256(30_000),
)

# Program 3 — Open Source Builders
contract.create_program(
    title="Open Source Builders",
    description="Rewarding sustained open-source contributions.",
    total_budget=u256(400_000),
    max_grant_amount=u256(25_000),
)
```

## Sample Applications

```python
# Application 0 → Program 0 (AI Agents Grant) — will APPROVE
contract.submit_application(
    program_id=u256(0),
    project_name="Nexus Protocol",
    description="Autonomous AI agents that execute complex DeFi strategies.",
    website_url="https://nexusprotocol.ai",
    github_url="https://github.com/nexus/nexus",
    docs_url="https://docs.nexusprotocol.ai",
    requested_amount=u256(45_000),
)

# Application 1 → Program 1 (Web3 Infrastructure) — will NEEDS_REVIEW
contract.submit_application(
    program_id=u256(1),
    project_name="ChainScribe",
    description="On-chain indexing and data availability layer.",
    website_url="https://chainscribe.xyz",
    github_url="https://github.com/chainscribe/core",
    docs_url="https://docs.chainscribe.xyz",
    requested_amount=u256(30_000),
)

# Application 2 → Program 2 (Developer Tooling) — will APPROVE
contract.submit_application(
    program_id=u256(2),
    project_name="VaultMesh",
    description="Smart contract verification and formal analysis tooling.",
    website_url="https://vaultmesh.io",
    github_url="https://github.com/vaultmesh/vault",
    docs_url="https://vaultmesh.io/docs",
    requested_amount=u256(25_000),
)

# Application 3 → Program 0 (AI Agents Grant) — will REJECT
contract.submit_application(
    program_id=u256(0),
    project_name="DataFlow DAO",
    description="AI data pipeline. Website placeholder only, no repo.",
    website_url="https://dataflowdao.fake",
    github_url="",
    docs_url="",
    requested_amount=u256(60_000),
)

# Application 4 → Program 1 (Web3 Infrastructure) — will NEEDS_REVIEW
contract.submit_application(
    program_id=u256(1),
    project_name="RelayNode",
    description="Lightweight relay node for L2 networks.",
    website_url="https://relaynode.dev",
    github_url="https://github.com/relaynode/node",
    docs_url="https://relaynode.dev/readme",
    requested_amount=u256(40_000),
)

# Application 5 → Program 2 (Developer Tooling) — will APPROVE
contract.submit_application(
    program_id=u256(2),
    project_name="BlockForge",
    description="CLI scaffolding tool for GenLayer contracts.",
    website_url="https://blockforge.sh",
    github_url="https://github.com/blockforge/cli",
    docs_url="https://blockforge.sh/guide",
    requested_amount=u256(20_000),
)
```

## Expected Evaluation Outcomes

| ID | Project | Expected Decision | Overall Score |
|---|---|---|---|
| 0 | Nexus Protocol | APPROVED | 87 |
| 1 | ChainScribe | NEEDS_REVIEW | 72 |
| 2 | VaultMesh | APPROVED | 91 |
| 3 | DataFlow DAO | REJECTED | 54 |
| 4 | RelayNode | NEEDS_REVIEW | 68 |
| 5 | BlockForge | APPROVED | 95 |

## Frontend Seed Data

The frontend's mock data in `applications/page.tsx` mirrors the above:

```ts
const applications = [
  { id: 0, name: "Nexus Protocol",   program: "AI Agents Grant",      score: 87, status: "APPROVED",      requested: 45_000, date: "2026-05-15" },
  { id: 1, name: "ChainScribe",      program: "Web3 Infrastructure",  score: 72, status: "NEEDS_REVIEW",  requested: 30_000, date: "2026-05-14" },
  { id: 2, name: "VaultMesh",        program: "Developer Tooling",    score: 91, status: "APPROVED",      requested: 25_000, date: "2026-05-14" },
  { id: 3, name: "DataFlow DAO",     program: "AI Agents Grant",      score: 54, status: "REJECTED",      requested: 60_000, date: "2026-05-13" },
  { id: 4, name: "RelayNode",        program: "Web3 Infrastructure",  score: 68, status: "NEEDS_REVIEW",  requested: 40_000, date: "2026-05-12" },
  { id: 5, name: "BlockForge",       program: "Developer Tooling",    score: 95, status: "APPROVED",      requested: 20_000, date: "2026-05-11" },
];
```

And program budget data in `programs/page.tsx`:

```ts
const programs = [
  { id: 0, name: "AI Agents Grant",      desc: "Funding AI agent infrastructure.",     budget: 500_000, spent: 340_000, max: 50_000, applicants: 24, status: "ACTIVE" },
  { id: 1, name: "Web3 Infrastructure",  desc: "Supporting core protocol development.", budget: 750_000, spent: 120_000, max: 75_000, applicants: 31, status: "ACTIVE" },
  { id: 2, name: "Developer Tooling",    desc: "Improving developer experience.",       budget: 300_000, spent: 225_000, max: 30_000, applicants: 18, status: "ACTIVE" },
  { id: 3, name: "Open Source Builders", desc: "Rewarding sustained OSS contributions.",budget: 400_000, spent: 0,      max: 25_000, applicants: 0,  status: "DRAFT"  },
];
```

## Testing the Evaluation Flow

```python
# Submit Application 0
app0 = contract.submit_application(
    program_id=u256(0),
    project_name="Nexus Protocol",
    description="Autonomous AI agents that execute complex DeFi strategies across GenLayer's Intelligent Contract ecosystem.",
    website_url="https://nexusprotocol.ai",
    github_url="https://github.com/nexus/nexus",
    docs_url="https://docs.nexusprotocol.ai",
    requested_amount=u256(45_000),
)
print("Application ID:", app0)  # expect 0

# Evaluate (triggers web fetch + LLM + strict_eq)
result = contract.evaluate_application(u256(0))
print("Evaluation:", result)

# Release funding (if APPROVED and within budget)
fund_result = contract.release_funding(u256(0))
print("Funding:", fund_result)  # expect "FUNDED"
```

## Sample Expected JSON Output from LLM

```json
{
  "technical_quality": 92,
  "innovation": 85,
  "ecosystem_value": 88,
  "documentation_quality": 81,
  "scam_risk": 10,
  "overall_score": 87,
  "decision": "APPROVED",
  "reason": "Strong technical execution with well-documented architecture and active GitHub maintenance. Clear ecosystem alignment with GenLayer's vision. No red flags detected."
}
```
