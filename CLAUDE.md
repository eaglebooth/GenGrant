# CLAUDE.md — GenLayer Intelligent Contract Rules

## Purpose

These rules ensure any GenLayer Intelligent Contract deploys successfully to GenLayer Studio on the first attempt. They are derived from the verified GenGrant contract (`0xD34bc86F52afe2D5C7312E07b037DA7FB12d7597`), which passed all 12 Studio validation checks and is live on testnet.

## File Header (Required)

Every contract file MUST start with exactly these two header lines, in this order:

```
# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
```

- The version line tells the runtime which Python bytecode dialect to use. Do NOT change the version string.
- The `Depends` line pins the exact py-genlayer release. Copy it verbatim; do not update to a different hash.
- The import line must be the very next line: `from genlayer import *`

## Imports

- Only `from genlayer import *` and `import typing` are allowed.
- `import json` is permitted for `json.loads` / `json.dumps` in evaluation logic.
- No other third-party imports are allowed.

## Storage Types

Use ONLY the following persistent types. Never use `int`, `float`, `tuple`, `NamedTuple`, `list`, `dict`, or any custom class as a storage field.

| Type | Use case |
|------|----------|
| `TreeMap[u256, str]` | String value indexed by numeric ID (titles, descriptions, URLs, statuses) |
| `TreeMap[u256, u256]` | Numeric value indexed by ID (budgets, scores, amounts) |
| `DynArray[str]` | Append-only string list (recipient names) |
| `DynArray[u256]` | Append-only numeric list (amounts, timestamps) |
| `u256` (scalar) | Single counters (`count` fields) |

Rules:
- Declare every storage field as a class attribute of the `gl.Contract` subclass.
- Initialize counters to `u256(0)` inside `__init__`.
- Use `u256(<int>)` for every numeric literal written to storage.

## Contract Class Shape

- Contract class MUST inherit from `gl.Contract`.
- Class body: storage declarations only. No method logic at class scope.
- `__init__(self)` initializes every scalar counter to `u256(0)`. Do NOT initialize TreeMap / DynArray fields (they are created on first write).

## Method Visibility

- State-mutating methods MUST use `@gl.public.write`.
- Read-only methods MUST use `@gl.public.view`.
- Do NOT use `@gl.public.any_of`, `@gl.public.complex`, or any other decorator.
- Every public method returns `typing.Any` (or `str` / `u256` for views).

## Method Signature Rules

- All parameter and return types MUST use one of: `u256`, `str`, `typing.Any`.
- No `int`, `float`, `bool`, `Optional`, `List`, or user-defined types in signatures.
- Keep signatures flat: at most 6 parameters per method. Split into multiple methods if a call needs more data.
- `DynArray.append(item)` is allowed on `self.<field>` for write methods only.

## Determinism Requirements

This is the most important rule. The LLM jury nodes execute the contract independently and compare outputs with `eq_principle.strict_eq`. Both copies must produce byte-identical outputs.

Requirements:
- Every branch must produce the same output regardless of execution order.
- No calls that depend on execution environment: no `time.time()`, `os.getenv()`, network calls, random, `id()`, hash ordering.
- JSON key order must be deterministic. Build JSON strings using `json.dumps(..., sort_keys=True, separators=(",", ":"))` when producing consensus outputs.
- String comparison MUST use `gl.eq_principle.strict_eq` when two independent LLM executions must agree.
- `gl.nondet.*` calls (web fetch, exec_prompt) are allowed ONLY inside a local function that is then wrapped by `gl.eq_principle.strict_eq(...)`.

## Nondeterministic Operations Pattern

If the contract needs to fetch URLs or run an LLM prompt, follow this exact pattern:

```python
@gl.public.write
def evaluate(self, id: u256) -> typing.Any:
    # 1. Read all inputs deterministically
    url = self.urls[id]
    name = self.names[id]

    # 2. Define a local function with all nondeterminism inside
    def run() -> str:
        content = ""
        if len(url) > 0:
            resp = gl.nondet.web.get(url)
            content = resp.body.decode("utf-8")
        prompt = f"<your prompt using {name} and {content}>"
        return gl.nondet.exec_prompt(prompt)

    # 3. Run twice and compare — this is the consensus step
    result = gl.eq_principle.strict_eq(run)

    # 4. Parse the deterministic JSON string and write to storage
    data = json.loads(result)
    self.scores[id] = u256(int(data["score"]))
    return result
```

Rules:
- The function passed to `strict_eq` MUST be a local function, not a method on the contract class.
- The local function MUST return `str`. Do not return dicts or custom objects from `strict_eq`.
- Truncate fetched content with a helper BEFORE putting it into the prompt, to avoid excessively long context. Typical limit: 4000 characters per URL.

## Numeric Precision

- ALWAYS use `u256` for on-chain numeric storage: budgets, amounts, scores, counters.
- Cast every literal: `u256(0)`, `u256(100)`, `u256(1)`.
- Arithmetic: use `+`, `-`, `*` between `u256` values only. Never mix with `int`.
- Comparison: use `==`, `!=`, `<`, `>`, `<=`, `>=` between `u256` values.
- Division and modulo are NOT supported on `u256`. Use multiplication by reciprocal (e.g., `x * u256(3) // u256(10)`) if needed.

## State-Machine Pattern

Use explicit `str` status fields to model lifecycle transitions. Typical flow:

```
"PENDING" → "APPROVED" / "NEEDS_REVIEW" / "REJECTED" → "FUNDED"
```

Rules:
- Guard each transition with explicit status checks that return a string error code on violation.
- Return string status codes (`"NOT_APPROVED"`, `"ALREADY_EVALUATED"`, `"INSUFFICIENT_BUDGET"`, etc.) from write methods so callers can react.
- Never silently mutate state on invalid input — return an error code and leave storage untouched.

## Budget Safety Pattern

When a write method moves funds against a program budget:

```python
@gl.public.write
def release(self, application_id: u256) -> typing.Any:
    status = self.application_statuses[application_id]
    if status != "APPROVED":
        return "NOT_APPROVED"

    amount = self.application_requested_amounts[application_id]
    program_id = self.application_program_ids[application_id]
    max_grant = self.program_max_grants[program_id]
    if amount > max_grant:
        return "EXCEEDS_MAX_GRANT"

    already_disbursed = self.program_disbursed[program_id]
    total_budget = self.program_budgets[program_id]
    new_disbursed = already_disbursed + amount
    if new_disbursed > total_budget:
        return "INSUFFICIENT_BUDGET"

    self.program_disbursed[program_id] = new_disbursed
    # ... record treasury and update status
    return "FUNDED"
```

Rules:
- Always check max_grant before touching budget.
- Always compute `new_disbursed` before mutating `program_disbursed`, then guard the write with a comparison.
- Update `program_disbursed` BEFORE flipping the application status so a partial failure leaves the system consistent.

## Counter / Auto-ID Pattern

For entities identified by sequential integer IDs:

```python
class MyContract(gl.Contract):
    entity_count: u256
    # storage maps ...

    def __init__(self):
        self.entity_count = u256(0)

    @gl.public.write
    def create(self, ...) -> typing.Any:
        entity_id = self.entity_count
        self.entity_field[entity_id] = ...
        self.entity_count = entity_id + u256(1)
        return entity_id
```

Rules:
- Assign `entity_id = self.entity_count` BEFORE writing any field for that entity.
- Increment the counter AFTER all fields are written: `self.entity_count = entity_id + u256(1)`.
- Never use `len(self.<DynArray>)` as a counter for TreeMap-keyed entities — the two counters may diverge.

## Validation Rules

Every public write method MUST validate inputs before mutating state:
1. Bounds check: reject IDs that are `>= self.<entity>_count`.
2. Status check: reject already-finalized entities (e.g., calling `evaluate` twice).
3. Value-range check: reject amounts that exceed `max_grant` or the remaining `budget - disbursed`.
4. Return an explicit string error code on any violation. Do NOT raise exceptions — the contract runtime does not surface Python tracebacks to callers.

## Prompt Design (for contracts that use AI evaluation)

If your contract calls `gl.nondet.exec_prompt`, follow these rules:
- Include all relevant fetched content (website, GitHub, docs) inline in the prompt, truncated to ~4000 chars each.
- List the exact scoring criteria with numeric ranges and the formula for the final score.
- List the decision thresholds clearly (e.g., APPROVED if score ≥ 80 and scam_risk < 30).
- Demand strict JSON output with `Respond with ONLY this JSON, no other text or explanation`.
- Use double-brace `{{{{...}}}}` if the prompt itself is inside an f-string so the LLM receives single-brace JSON.
- Keep the total prompt under ~6000 tokens to fit inside the LLM context window.

## Pre-Deploy Verification Checklist

Before running `genlayer deploy`, confirm every item:

1. File header: lines 1–3 match the required pattern exactly.
2. `from genlayer import *` is the first import, `import typing` is the second, `import json` is allowed as third.
3. No `int`, `float`, `tuple`, `list`, `dict`, `bool`, `NamedTuple`, `Optional`, `List`, `Dict` appear in storage declarations or public method signatures.
4. Every `@gl.public.write` method has explicit input validation and returns a string error code on violation.
5. Every use of `gl.nondet.web.get` or `gl.nondet.exec_prompt` lives inside a local function passed to `gl.eq_principle.strict_eq`.
6. All numeric literals in storage writes are wrapped in `u256(...)`.
7. No state is mutated before input validation passes.
8. `__init__` initializes every `u256` counter to `u256(0)`.
9. Auto-increment counters are updated as `entity_id + u256(1)` AFTER all fields are written.
10. The contract file name matches the class name (e.g., `GenGrant.py` → `class GenGrant(gl.Contract)`).
11. The contract file contains only the contract class — no demo scripts, no `if __name__ == "__main__"`, no global function calls with side effects.
12. Run `python -c "import ast; ast.parse(open('<file>').read())"` — exits with code 0.
13. Run `genlayer lint <file>` — zero errors, zero warnings.

## Deployment Steps

```bash
# 1. Verify contract
python -c "import ast; ast.parse(open('MyContract.py').read())"
genlayer lint MyContract.py

# 2. Deploy
genlayer deploy MyContract.py --name MyContract

# 3. Copy the contract address from CLI output and verify on GenLayer Explorer
#    https://genlayer.com/explorer

# 4. Wire the address into your frontend .env.local:
#    NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed address>
```

## Common Rejection Causes (from GenLayer Studio)

| Rejection reason | Fix |
|---|---|
| "Forbidden import" | Remove any import other than `genlayer`, `typing`, `json` |
| "Forbidden type" | Replace `int`, `float`, `tuple`, `list`, `dict` in signatures/storage with `u256`, `str`, `TreeMap`, `DynArray` |
| "Non-deterministic comparison" | Wrap the nondeterministic local function in `gl.eq_principle.strict_eq` |
| "Missing dependency header" | Ensure lines 1–3 match exactly |
| "State mutated before validation" | Move all `self.<field>[id] = ...` lines below the validation guards |
| "Counter not u256" | Use `u256(0)`, `u256(1)` — never bare `0` or `1` |
