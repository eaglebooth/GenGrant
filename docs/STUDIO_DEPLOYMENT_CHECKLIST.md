# Studio Deployment Checklist — GenGrant

Use this checklist to deploy GenGrant to GenLayer Studio step-by-step.

## Phase 1: Environment Setup

- [ ] Python 3.10+ installed and on PATH
- [ ] Node.js ≥ 18 installed (`node --version`)
- [ ] npm ≥ 9 installed (`npm --version`)
- [ ] GenLayer account created and funded
- [ ] GenLayer Studio CLI installed: `pip install py-genlayer`
- [ ] GenLayer wallet configured: `genlayer wallet create` or `genlayer wallet import`

## Phase 2: Contract Preparation

- [ ] `GenGrant.py` is in its own directory (no other `.py` files that could conflict)
- [ ] Line 1 of `GenGrant.py` is exactly `# v0.2.16`
- [ ] Line 2 of `GenGrant.py` is exactly `# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }`
- [ ] Line 3 is exactly `from genlayer import *`
- [ ] No syntax errors: `python -c "import ast; ast.parse(open('GenGrant.py').read())"` passes
- [ ] No forbidden types: grep confirms no `int`, `float`, `tuple`, `NamedTuple`, `list`, `dict` in public method signatures or storage declarations

## Phase 3: Contract Deployment

- [ ] Run `genlayer lint GenGrant.py` — zero errors
- [ ] Run `genlayer deploy GenGrant.py --name GenGrant`
- [ ] Copy the deployed contract address from the CLI output
- [ ] Verify contract on GenLayer Explorer: https://genlayer.com/explorer
- [ ] Confirm contract has `create_program`, `submit_application`, `evaluate_application`, `release_funding` methods listed

## Phase 4: Program Creation

- [ ] Create a Python test script (see `SAMPLE_DATA.md`)
- [ ] Call `create_program` for each of the 4 sample programs
- [ ] Verify with `get_program_count` returns 4
- [ ] Verify with `get_program_title(0..3)` returns expected titles

## Phase 5: Application Submission

- [ ] Submit all 6 sample applications
- [ ] Verify with `get_application_count` returns 6
- [ ] Verify all applications have status "PENDING" via `get_application_status`

## Phase 6: AI Evaluation

- [ ] Call `evaluate_application(0)` — expect JSON result within 60 seconds
- [ ] Verify result contains all 7 required fields
- [ ] Verify score is 0-100 range
- [ ] Verify decision is one of: APPROVED, NEEDS_REVIEW, REJECTED
- [ ] Repeat for applications 1–5; confirm expected outcomes per `SAMPLE_DATA.md`
- [ ] Verify `get_application_score(id)` returns the stored score
- [ ] Verify `get_application_status(id)` updates to the decision

## Phase 7: Treasury / Funding

- [ ] Verify `get_treasury_count` returns 0 before any funding
- [ ] Call `release_funding(0)` for an APPROVED application — expect "FUNDED"
- [ ] Verify `get_treasury_count` returns 1
- [ ] Verify `get_treasury_recipient(0)` returns "Nexus Protocol"
- [ ] Verify `get_treasury_amount(0)` returns 45000
- [ ] Call `release_funding(3)` for a REJECTED application — expect "NOT_APPROVED"
- [ ] Call `release_funding` twice for the same application — expect "ALREADY_EVALUATED" on second call

## Phase 8: Frontend Setup

- [ ] `cd GenGrant/frontend && npm install` — zero errors
- [ ] `npm run dev` — dev server starts on http://localhost:3000
- [ ] Open browser, verify landing page loads with dark theme
- [ ] Verify sidebar navigation (Dashboard, Programs, Applications, Analytics, Settings)
- [ ] Navigate to Programs — 4 program cards render with budget progress bars
- [ ] Navigate to Applications — 6 rows with score rings and status badges
- [ ] Click an application row — detail page loads with tabs (Overview / Evaluation / Treasury)
- [ ] Navigate to Analytics — bar chart and status breakdown render
- [ ] Navigate to Settings — contract address is visible with copy button
- [ ] Test mobile responsiveness: sidebar collapses to hamburger menu below md breakpoint

## Phase 9: Build Verification

- [ ] `npm run build` exits with "✓ Compiled successfully"
- [ ] Build output shows all 6 routes: `/`, `/programs`, `/applications`, `/applications/[id]`, `/analytics`, `/settings`
- [ ] No TypeScript errors in build output
- [ ] No `lucide-react` export errors
- [ ] No Framer Motion type errors

## Phase 10: Frontend ↔ Contract Connection

- [ ] Replace mock contract address in `settings/page.tsx` with real address
- [ ] Replace mock API calls in pages with real GenLayer RPC calls
- [ ] Verify live data from contract populates Programs page
- [ ] Verify live data from contract populates Applications page
- [ ] Verify "Run AI Evaluation" button calls `evaluate_application` on-chain
- [ ] Verify "Release Funding" button calls `release_funding` on-chain

## Phase 11: Production Deployment

- [ ] Push frontend to GitHub
- [ ] Import repo into Vercel
- [ ] Set Vercel environment variables (`NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_GENLAYER_RPC`, `NEXT_PUBLIC_NETWORK`)
- [ ] Trigger production deploy
- [ ] Verify production URL returns the app
- [ ] Verify dark mode renders correctly in production
- [ ] Run Lighthouse audit — aim for Performance ≥ 90, Accessibility ≥ 90

## Phase 12: Post-Deploy Verification

- [ ] Create a real test program on production contract
- [ ] Submit a real test application via frontend or script
- [ ] Trigger AI evaluation via frontend — confirm it completes within timeout
- [ ] Confirm evaluation result appears in UI
- [ ] Release funding via frontend — confirm treasury entry appears
- [ ] Monitor GenLayer Explorer for contract transactions

## Rollback Plan

If anything breaks in production:
1. Revert Vercel deployment to previous deploy (Vercel dashboard → Deployments → Promote previous)
2. Contract is immutable on-chain — no rollback needed for contract
3. Frontend rollback: `vercel rollback` or promote previous deploy in Vercel UI
