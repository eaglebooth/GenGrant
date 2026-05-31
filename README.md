# GenGrant — AI-Powered Decentralized Grant Funding on GenLayer

GenGrant is an MVP platform that combines **GenLayer Intelligent Contracts** with a premium Next.js frontend to evaluate, approve, and disburse grant funding through AI-powered analysis — all on-chain, fully transparent, and community-governed.

## How It Works

1. **Grant Provider** deploys a GenGrant contract and creates grant programs (budget, max per award).
2. **Applicants** submit applications with project info, website, GitHub, and docs URLs.
3. **The Contract's AI evaluator** (via `gl.nondet.web.get` + `gl.nondet.exec_prompt`) reads every URL, runs a senior-technical-analyst prompt, and produces a structured score.
4. **Consensus enforcement**: `gl.eq_principle.strict_eq` runs the evaluation across multiple LLM-backed nodes; the result must converge.
5. **Treasury release**: approved applications within budget are funded automatically via `release_funding`.

```
[Grant Provider] → create_program
[Applicant]      → submit_application
[AI Evaluator]   → evaluate_application  (web fetch + LLM, strict_eq consensus)
[Grant Provider] → release_funding       (on approval + within budget)
```

## Architecture

| Layer | Tech |
|---|---|
| Smart Contract | GenLayer Intelligent Contract (Python, py-genlayer v1jb45aa8…) |
| Consensus | `gl.eq_principle.strict_eq` across multiple non-deterministic executions |
| Frontend | Next.js 16 (App Router) + TypeScript + TailwindCSS v4 |
| UI/Animations | Framer Motion v12, Lucide React v1.17 |
| Design | Dark-mode premium UI matching Coinbase/EigenLayer quality |

## Project Structure

```
GenGrant/
├── GenGrant.py                          # GenLayer Intelligent Contract
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Dashboard (landing + stats)
│   │   │   ├── programs/page.tsx        # Program cards with budget progress
│   │   │   ├── applications/
│   │   │   │   ├── page.tsx             # Filterable application table
│   │   │   │   └── [id]/page.tsx        # Application detail + AI evaluation tabs
│   │   │   ├── analytics/page.tsx       # Funding metrics + approval charts
│   │   │   └── settings/page.tsx        # Profile + contract address
│   │   ├── components/layout/
│   │   │   ├── AppShell.tsx             # Sidebar nav + mobile drawer
│   │   │   └── TopBar.tsx               # Search + notifications
│   │   └── lib/utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── package.json
├── docs/
│   ├── AI_EVALUATION_PROMPT.md          # Full LLM prompt + scoring rubric
│   ├── DEPLOYMENT_GUIDE.md              # Deploy contract + frontend
│   ├── SAMPLE_DATA.md                   # Sample programs + applications
│   └── STUDIO_DEPLOYMENT_CHECKLIST.md   # Step-by-step checklist
└── README.md                            # ← you are here
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js ≥ 18
- npm ≥ 9
- GenLayer Studio CLI (`pip install py-genlayer`)

### Run the Frontend

```bash
cd GenGrant/frontend
npm install
npm run dev
# → http://localhost:3000
```

### Deploy the Contract

```bash
cd GenGrant
genlayer deploy GenGrant.py --name GenGrant
```

## GenLayer Rules Checklist

The contract strictly follows all 12 GenLayer rules:

| # | Rule | Status |
|---|---|---|
| 1 | Header `# v0.2.16` on line 1 | ✅ |
| 2 | Depends JSON on line 2 | ✅ |
| 3 | `from genlayer import *` on line 3 | ✅ |
| 4 | Class extends `gl.Contract` | ✅ |
| 5 | Methods decorated with `@gl.public.write` / `@gl.public.view` | ✅ |
| 6 | Non-deterministic ops inside inner function, called via `gl.eq_principle.strict_eq(fn)` | ✅ |
| 7 | `gl.nondet.web.get(url)` + `.body.decode("utf-8")` for HTTP reads | ✅ |
| 8 | `gl.nondet.exec_prompt(prompt)` for LLM calls | ✅ |
| 9 | Storage uses `TreeMap[K, V]` / `DynArray[T]` only, never `dict`/`list` | ✅ |
| 10 | Numeric storage uses `u256`, never `int`/`float` | ✅ |
| 11 | No custom `@gl.storage` class | ✅ |
| 12 | No `tuple`/`NamedTuple` in public method returns | ✅ |

## Color System

```
--bg-primary:       #080B12   (near-black)
--bg-card:          #0E1219   (dark card)
--bg-elevated:      #131825   (slightly lighter)
--border:           rgba(255,255,255,0.06)
--accent:           #00D4FF   (electric cyan)
--accent-secondary: #8B5CF6   (deep violet)
--text-primary:     #F1F5F9
--text-secondary:   #94A3B8
--text-muted:       #475569
--status-approved:  #10B981
--status-pending:   #F59E0B
--status-rejected:  #EF4444
```

## Tech Stack

- **GenLayer** — AI-native blockchain (Intelligent Contracts)
- **Next.js 16** — React 19 App Router
- **TypeScript** — strict typing
- **TailwindCSS v4** — utility-first styling
- **Framer Motion 12** — scroll-triggered + hover animations
- **Lucide React 1.17** — icon library

## License

MIT
