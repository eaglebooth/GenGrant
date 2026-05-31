# AI Evaluation Prompt — GenGrant

This document contains the exact LLM prompt used by `evaluate_application()` in `GenGrant.py` and a breakdown of the scoring rubric.

## The Prompt (as embedded in GenGrant.py)

```text
You are a senior technical analyst evaluating a Web3 project for a decentralized grant program on GenLayer.

Project Name: {project_name}
Description: {description}
Requested Funding: {requested_amount} tokens

=== WEBSITE ({website_url}) ===
{website_content}

=== GITHUB ({github_url}) ===
{github_content}

=== DOCUMENTATION ({docs_url}) ===
{docs_content}

Evaluate ONLY using the information provided above. Score each criterion from 0-100:
- technical_quality: Code quality, architecture, implementation standards
- innovation: Novel approach and creative problem-solving
- ecosystem_value: Contribution to GenLayer and Web3 ecosystem
- documentation_quality: Clarity, completeness, and usability of docs
- scam_risk: Red flags, suspicious patterns (0 = no risk, 100 = high risk)

Compute overall_score = round((technical_quality + innovation + ecosystem_value + documentation_quality) / 4 - scam_risk * 0.3)

Decision rules:
- APPROVED if overall_score >= 80 AND scam_risk < 30
- NEEDS_REVIEW if overall_score >= 60 AND scam_risk < 50
- REJECTED otherwise

Respond with ONLY this JSON, no other text or explanation:
{{"technical_quality":N,"innovation":N,"ecosystem_value":N,"documentation_quality":N,"scam_risk":N,"overall_score":N,"decision":"APPROVED|NEEDS_REVIEW|REJECTED","reason":"brief explanation"}}
```

## Scoring Rubric

| Criterion | 0–25 | 26–50 | 51–75 | 76–100 |
|---|---|---|---|---|
| **technical_quality** | No code, placeholder repo, unmaintained | Basic scaffold, outdated dependencies | Solid architecture, tested, documented | Production-grade, audited, best-practices |
| **innovation** | Copy-paste of existing project | Minor variations on known patterns | New mechanism or novel combination | Breakthrough approach / new primitive |
| **ecosystem_value** | Irrelevant to GenLayer | Tangential benefit | Directly useful to GenLayer ecosystem | Critical infrastructure / ecosystem-defining |
| **documentation_quality** | Empty README, no setup guide | README present but incomplete | Full setup + API docs + examples | Comprehensive docs with tutorials + videos |
| **scam_risk** (inverted) | High risk signals (impersonation, fake team) | Some red flags (unverifiable claims) | No obvious red flags | Fully verified, reputable team, transparent |

## Decision Logic

```
overall = round((tech + innov + eco + docs) / 4 - scam * 0.3)

if overall >= 80 and scam < 30  →  APPROVED
elif overall >= 60 and scam < 50 →  NEEDS_REVIEW
else                             →  REJECTED
```

- **APPROVED**: eligible for immediate treasury release via `release_funding()`
- **NEEDS_REVIEW**: requires human committee review; contract blocks automatic funding
- **REJECTED**: application closed; cannot be re-submitted for the same program

## Consensus Mechanism

`evaluate_application()` uses GenLayer's `gl.eq_principle.strict_eq(run_evaluation)` pattern:

1. Multiple GenLayer nodes execute `run_evaluation()` independently (each with its own LLM call).
2. Each node produces a JSON evaluation.
3. `strict_eq` requires all nodes to converge on the **same** JSON output.
4. If any node diverges, the call is rejected and retried.
5. This guarantees the AI evaluation result is deterministic and cannot be gamed by a single malicious node.

## Content Truncation

To stay within LLM context limits, each fetched source is truncated to **4000 characters** before being injected into the prompt. This ensures:
- Website HTML body ≤ 4000 chars
- GitHub README or repo page ≤ 4000 chars
- Documentation page ≤ 4000 chars

## Output Contract

The contract expects the LLM to return **only** a JSON object matching this schema:

```typescript
interface EvaluationResult {
  technical_quality: number;     // 0-100
  innovation: number;            // 0-100
  ecosystem_value: number;       // 0-100
  documentation_quality: number; // 0-100
  scam_risk: number;             // 0-100 (lower is better)
  overall_score: number;         // computed
  decision: "APPROVED" | "NEEDS_REVIEW" | "REJECTED";
  reason: string;                // brief explanation
}
```

Post-processing in the contract strips markdown fences (```json … ```) and parses with `json.loads()`.

## Usage in Frontend

The frontend displays the same 5 criteria as animated score rings (in `applications/[id]/page.tsx`):

- Technical Quality → `technical_quality`
- Innovation → `innovation`
- Ecosystem Value → `ecosystem_value`
- Documentation → `documentation_quality`
- Scam Risk → `scam_risk` (displayed inverted: low = green)
