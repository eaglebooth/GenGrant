"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Link2,
  FileText,
  Wand2,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Shield,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const sampleEval = {
  technical_quality: 92,
  innovation: 85,
  ecosystem_value: 88,
  documentation_quality: 81,
  scam_risk: 10,
  overall_score: 87,
  decision: "APPROVED",
  reason:
    "Strong technical execution with well-documented architecture and active GitHub maintenance. Clear ecosystem alignment with GenLayer's vision. No red flags detected.",
};

const criteria = [
  { label: "Technical Quality", field: "technical_quality", value: 92, icon: Globe },
  { label: "Innovation", field: "innovation", value: 85, icon: Sparkles },
  { label: "Ecosystem Value", field: "ecosystem_value", value: 88, icon: TrendingUp },
  { label: "Documentation", field: "documentation_quality", value: 81, icon: FileText },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-status-approved/15 text-status-approved",
    NEEDS_REVIEW: "bg-status-pending/15 text-status-pending",
    REJECTED: "bg-status-rejected/15 text-status-rejected",
    PENDING: "bg-status-pending/15 text-status-pending",
    FUNDED: "bg-accent/15 text-accent",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        map[status] || "bg-white/5 text-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 80
      ? "var(--status-approved)"
      : score >= 60
        ? "var(--status-pending)"
        : "var(--status-rejected)";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2 as const }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-white">{score}</span>
    </div>
  );
}

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [tab, setTab] = useState<"overview" | "evaluation" | "treasury">(
    "overview",
  );

  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-xs text-text-muted transition hover:text-white"
        >
          <ChevronLeft className="h-3 w-3" />
          Applications
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white md:text-3xl">
                Nexus Protocol
              </h1>
              <StatusBadge status={sampleEval.decision} />
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Applied to AI Agents Grant · ID #{params.id}
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/15 transition hover:shadow-accent/35">
            <Wand2 className="h-4 w-4" />
            Run AI Evaluation
          </button>
        </motion.div>

        {/* tabs */}
        <div className="flex gap-1 rounded-xl border border-white/6 bg-card-bg p-1">
          {(["overview", "evaluation", "treasury"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-5 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-white/6 bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-white">
                  Project Information
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Nexus Protocol is building autonomous AI agents that execute
                  complex DeFi strategies across GenLayer&apos;s Intelligent
                  Contract ecosystem. The platform uses LLM-powered reasoning to
                  optimize yield farming, risk management, and portfolio
                  rebalancing in real-time.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {[
                    { label: "Website", value: "nexusprotocol.ai", icon: Globe },
                    { label: "GitHub", value: "github.com/nexus", icon: GitBranch },
                    {
                      label: "Documentation",
                      value: "docs.nexusprotocol.ai",
                      icon: FileText,
                    },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href="#"
                      className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] p-3 transition hover:border-white/15"
                    >
                      <link.icon className="h-4 w-4 text-accent" />
                      <div className="min-w-0">
                        <div className="text-[10px] text-text-muted">
                          {link.label}
                        </div>
                        <div className="truncate text-xs text-white">
                          {link.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-white">
                  Funding Request
                </h2>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-white">
                    $45,000
                  </span>
                  <span className="mb-1 text-xs text-text-muted">GEN tokens</span>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  Requested for 6-month development runway covering core team,
                  audits, and ecosystem grants.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/6 bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-white">AI Score</h2>
                <div className="mt-4 flex flex-col items-center">
                  <ScoreRing score={sampleEval.overall_score} size={88} />
                  <div className="mt-3 text-sm font-semibold text-white">
                    Overall Score
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-white">Timeline</h2>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Application Submitted", time: "2026-05-15", icon: Clock },
                    {
                      label: "AI Evaluation Complete",
                      time: "2026-05-16",
                      icon: Wand2,
                    },
                    {
                      label: "Approved by Committee",
                      time: "2026-05-17",
                      icon: CheckCircle2,
                    },
                  ].map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-accent/10 p-1.5">
                        <e.icon className="h-3 w-3 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">
                          {e.label}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {e.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "evaluation" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="rounded-2xl border border-white/6 bg-card-bg p-6">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-white">
                  Evaluation Report
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {sampleEval.reason}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {criteria.map((c, i) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-white/6 bg-card-bg p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <c.icon className="h-4 w-4 text-accent" />
                      <span className="text-sm text-text-secondary">
                        {c.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {sampleEval[c.field as keyof typeof sampleEval] ??
                        c.value}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.value}%` }}
                      transition={{
                        duration: 1,
                        delay: i * 0.12,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/6 bg-card-bg p-5">
                <div className="text-sm text-text-secondary">Scam Risk</div>
                <div className="mt-1 text-lg font-semibold text-status-approved">
                  {sampleEval.scam_risk} / 100
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "10%" }}
                    transition={{
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="h-full rounded-full bg-status-approved"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-card-bg p-5">
                <div className="text-sm text-text-secondary">Decision</div>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={sampleEval.decision} />
                </div>
                <div className="mt-2 text-xs text-text-muted">
                  Score threshold: ≥ 80 → APPROVED
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "treasury" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/6 bg-card-bg p-6"
          >
            <h2 className="text-sm font-semibold text-white">Treasury Status</h2>
            {sampleEval.decision === "APPROVED" ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-status-approved/20 bg-status-approved/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-status-approved" />
                  <div>
                    <div className="text-sm font-medium text-white">
                      Eligible for funding
                    </div>
                    <div className="text-xs text-text-secondary">
                      Application meets all criteria for treasury release.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-text-muted">Recipient</div>
                    <div className="mt-1 text-sm font-medium text-white">
                      Nexus Protocol
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">Amount</div>
                    <div className="mt-1 text-sm font-medium text-white">
                      $45,000 GEN
                    </div>
                  </div>
                </div>
                <button className="w-full rounded-2xl bg-gradient-to-r from-accent to-accent-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-accent/15 transition hover:shadow-accent/35">
                  Release Funding
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-status-pending/20 bg-status-pending/5 p-4">
                <AlertTriangle className="h-5 w-5 text-status-pending" />
                <div className="text-sm text-text-secondary">
                  Funding not yet available. Complete AI evaluation first.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
