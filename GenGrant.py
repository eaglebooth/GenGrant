# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import typing
import json


class GenGrant(gl.Contract):
    program_titles: TreeMap[u256, str]
    program_descriptions: TreeMap[u256, str]
    program_budgets: TreeMap[u256, u256]
    program_max_grants: TreeMap[u256, u256]
    program_disbursed: TreeMap[u256, u256]
    program_count: u256

    application_program_ids: TreeMap[u256, u256]
    application_names: TreeMap[u256, str]
    application_descriptions: TreeMap[u256, str]
    application_websites: TreeMap[u256, str]
    application_githubs: TreeMap[u256, str]
    application_docs: TreeMap[u256, str]
    application_requested_amounts: TreeMap[u256, u256]
    application_statuses: TreeMap[u256, str]
    application_scores: TreeMap[u256, u256]
    application_reasons: TreeMap[u256, str]
    application_tech_quality: TreeMap[u256, u256]
    application_innovation: TreeMap[u256, u256]
    application_ecosystem_value: TreeMap[u256, u256]
    application_doc_quality: TreeMap[u256, u256]
    application_scam_risk: TreeMap[u256, u256]
    application_count: u256

    treasury_recipients: DynArray[str]
    treasury_amounts: DynArray[u256]
    treasury_timestamps: DynArray[u256]
    treasury_count: u256

    def __init__(self):
        self.program_count = u256(0)
        self.application_count = u256(0)
        self.treasury_count = u256(0)

    # ── Program Management ──────────────────────────────────────────────

    @gl.public.write
    def create_program(
        self,
        title: str,
        description: str,
        total_budget: u256,
        max_grant_amount: u256,
    ) -> typing.Any:
        program_id = self.program_count
        self.program_titles[program_id] = title
        self.program_descriptions[program_id] = description
        self.program_budgets[program_id] = total_budget
        self.program_max_grants[program_id] = max_grant_amount
        self.program_disbursed[program_id] = u256(0)
        self.program_count = program_id + u256(1)
        return program_id

    @gl.public.view
    def get_program_title(self, program_id: u256) -> str:
        return self.program_titles[program_id]

    @gl.public.view
    def get_program_description(self, program_id: u256) -> str:
        return self.program_descriptions[program_id]

    @gl.public.view
    def get_program_budget(self, program_id: u256) -> u256:
        return self.program_budgets[program_id]

    @gl.public.view
    def get_program_max_grant(self, program_id: u256) -> u256:
        return self.program_max_grants[program_id]

    @gl.public.view
    def get_program_disbursed(self, program_id: u256) -> u256:
        return self.program_disbursed[program_id]

    @gl.public.view
    def get_program_count(self) -> u256:
        return self.program_count

    # ── Application Management ───────────────────────────────────────────

    @gl.public.write
    def submit_application(
        self,
        program_id: u256,
        project_name: str,
        description: str,
        website_url: str,
        github_url: str,
        docs_url: str,
        requested_amount: u256,
    ) -> typing.Any:
        application_id = self.application_count
        self.application_program_ids[application_id] = program_id
        self.application_names[application_id] = project_name
        self.application_descriptions[application_id] = description
        self.application_websites[application_id] = website_url
        self.application_githubs[application_id] = github_url
        self.application_docs[application_id] = docs_url
        self.application_requested_amounts[application_id] = requested_amount
        self.application_statuses[application_id] = "PENDING"
        self.application_scores[application_id] = u256(0)
        self.application_reasons[application_id] = ""
        self.application_tech_quality[application_id] = u256(0)
        self.application_innovation[application_id] = u256(0)
        self.application_ecosystem_value[application_id] = u256(0)
        self.application_doc_quality[application_id] = u256(0)
        self.application_scam_risk[application_id] = u256(0)
        self.application_count = application_id + u256(1)
        return application_id

    @gl.public.view
    def get_application_name(self, application_id: u256) -> str:
        return self.application_names[application_id]

    @gl.public.view
    def get_application_status(self, application_id: u256) -> str:
        return self.application_statuses[application_id]

    @gl.public.view
    def get_application_score(self, application_id: u256) -> u256:
        return self.application_scores[application_id]

    @gl.public.view
    def get_application_program_id(self, application_id: u256) -> u256:
        return self.application_program_ids[application_id]

    @gl.public.view
    def get_application_count(self) -> u256:
        return self.application_count

    # ── AI Evaluation (GenLayer Intelligent Contract Core) ──────────────

    @gl.public.write
    def evaluate_application(self, application_id: u256) -> typing.Any:
        if application_id >= self.application_count:
            return "INVALID_ID"

        current_status = self.application_statuses[application_id]
        if current_status != "PENDING":
            return "ALREADY_EVALUATED"

        website_url = self.application_websites[application_id]
        github_url = self.application_githubs[application_id]
        docs_url = self.application_docs[application_id]
        project_name = self.application_names[application_id]
        description = self.application_descriptions[application_id]
        requested_amount = self.application_requested_amounts[application_id]

        def run_evaluation() -> str:
            website_content = ""
            if len(website_url) > 0:
                resp = gl.nondet.web.get(website_url)
                website_content = resp.body.decode("utf-8")

            github_content = ""
            if len(github_url) > 0:
                resp = gl.nondet.web.get(github_url)
                github_content = resp.body.decode("utf-8")

            docs_content = ""
            if len(docs_url) > 0:
                resp = gl.nondet.web.get(docs_url)
                docs_content = resp.body.decode("utf-8")

            def truncate(text, limit):
                if len(text) > limit:
                    return text[:limit]
                return text

            website_content = truncate(website_content, 4000)
            github_content = truncate(github_content, 4000)
            docs_content = truncate(docs_content, 4000)

            evaluation_prompt = f"""You are a senior technical analyst evaluating a Web3 project for a decentralized grant program on GenLayer.

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
{{{{"technical_quality":N,"innovation":N,"ecosystem_value":N,"documentation_quality":N,"scam_risk":N,"overall_score":N,"decision":"APPROVED|NEEDS_REVIEW|REJECTED","reason":"brief explanation"}}}}"""

            llm_response = gl.nondet.exec_prompt(evaluation_prompt)
            cleaned = llm_response.replace("```json", "").replace("```", "").strip()
            return cleaned

        evaluation_json = gl.eq_principle.strict_eq(run_evaluation)

        data = json.loads(evaluation_json)
        self.application_scores[application_id] = u256(int(data["overall_score"]))
        self.application_tech_quality[application_id] = u256(int(data["technical_quality"]))
        self.application_innovation[application_id] = u256(int(data["innovation"]))
        self.application_ecosystem_value[application_id] = u256(int(data["ecosystem_value"]))
        self.application_doc_quality[application_id] = u256(int(data["documentation_quality"]))
        self.application_scam_risk[application_id] = u256(int(data["scam_risk"]))
        self.application_reasons[application_id] = str(data["reason"])
        self.application_statuses[application_id] = str(data["decision"])

        return evaluation_json

    # ── Treasury / Funding Disbursement ──────────────────────────────────

    @gl.public.write
    def release_funding(self, application_id: u256) -> typing.Any:
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

        recipient = self.application_names[application_id]
        self.treasury_recipients.append(recipient)
        self.treasury_amounts.append(amount)
        self.treasury_timestamps.append(u256(0))
        self.treasury_count = self.treasury_count + u256(1)

        self.application_statuses[application_id] = "FUNDED"

        return "FUNDED"

    # ── Treasury Queries ─────────────────────────────────────────────────

    @gl.public.view
    def get_treasury_count(self) -> u256:
        return self.treasury_count

    @gl.public.view
    def get_treasury_recipient(self, index: u256) -> str:
        return self.treasury_recipients[index]

    @gl.public.view
    def get_treasury_amount(self, index: u256) -> u256:
        return self.treasury_amounts[index]
