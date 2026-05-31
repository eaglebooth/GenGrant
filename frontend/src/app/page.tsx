"use client";

import { motion } from "framer-motion";
import {
  Plus,
  ChevronRight,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  BarChart3,
  Users,
  Coins,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
} as const;

const programs = [
  { id: 0, name: "AI Agents Grant", budget: 500_000, spent: 340_000, max: 50_000, applicants: 24, status: "ACTIVE" },
  { id: 1, name: "Web3 Infrastructure", budget: 750_000, spent: 120_000, max: 75_000, applicants: 31, status: "ACTIVE" },
  { id: 2, name: "Developer Tooling", budget: 300_000, spent: 225_000, max: 30_000, applicants: 18, status: "ACTIVE" },
  { id: 3, name: "Open Source Builders", budget: 400_000, spent: 0, max: 25_000, applicants: 0, status: "DRAFT" },
];

const applications = [
  { id: 0, name: "Nexus Protocol", program: "AI Agents Grant", score: 87, status: "APPROVED", requested: 45_000 },
  { id: 1, name: "ChainScribe", program: "Web3 Infrastructure", score: 72, status: "NEEDS_REVIEW", requested: 30_000 },
  { id: 2, name: "VaultMesh", program: "Developer Tooling", score: 91, status: "APPROVED", requested: 25_000 },
  { id: 3, name: "DataFlow DAO", program: "AI Agents Grant", score: 54, status: "REJECTED", requested: 60_000 },
  { id: 4, name: "RelayNode", program: "Web3 Infrastructure", score: 68, status: "NEEDS_REVIEW", requested: 40_000 },
];

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "accent" | "accent-secondary" | "status-approved" | "status-pending";
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp as any}
      custom={delay}
      className="rounded-2xl border border-white/6 bg-card-bg p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">{label}</div>
        <div className={`rounded-lg bg-${accent}/10 p-2`}>
          <Icon className={`h-4 w-4 text-${accent}`} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-text-muted">{sub}</div>}
    </motion.div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 80
      ? "var(--status-approved)"
      : score >= 60
      ? "var(--status-pending)"
      : "var(--status-rejected)";

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-white">{score}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-status-approved/15 text-status-approved",
    NEEDS_REVIEW: "bg-status-pending/15 text-status-pending",
    REJECTED: "bg-status-rejected/15 text-status-rejected",
    PENDING: "bg-status-pending/15 text-status-pending",
    FUNDED: "bg-accent/15 text-accent",
    DRAFT: "bg-white/5 text-text-muted",
    ACTIVE: "bg-accent/15 text-accent",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[status] || "bg-white/5 text-text-muted"}`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const totalBudget = programs.reduce((a, p) => a + p.budget, 0);
  const totalSpent = programs.reduce((a, p) => a + p.spent, 0);
  const totalApplications = applications.length;

  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Overview of your grant programs and applications
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/15 transition hover:shadow-accent/35"
          >
            <Plus className="h-4 w-4" />
            New Program
          </Link>
        </motion.div>

        {/* stat cards */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatCard label="Total Budget" value={`$${(totalBudget / 1000).toFixed(0)}k`} sub="Across 4 programs" icon={Wallet} accent="accent" delay={0} />
          <StatCard label="Disbursed" value={`$${(totalSpent / 1000).toFixed(0)}k`} sub={`${((totalSpent / totalBudget) * 100).toFixed(0)}% utilized`} icon={TrendingUp} accent="accent-secondary" delay={1} />
          <StatCard label="Applications" value={totalApplications} sub="5 pending evaluation" icon={Users} accent="status-pending" delay={2} />
          <StatCard label="Funded" value="2" sub="Awaiting treasury release" icon={CheckCircle2} accent="status-approved" delay={3} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* programs table */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-white/6 bg-card-bg"
          >
            <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
              <div className="text-sm font-semibold text-white">Programs</div>
              <Link href="/programs" className="flex items-center gap-1 text-xs text-accent transition hover:underline">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/4">
              {programs.map((p) => {
                const pct = (p.spent / p.budget) * 100;
                return (
                  <Link
                    key={p.id}
                    href={`/programs/${p.id}`}
                    className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{p.name}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
                        />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-text-muted">
                        <span>${p.spent.toLocaleString()} / ${p.budget.toLocaleString()}</span>
                        <span>·</span>
                        <span>{p.applicants} applicants</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-text-muted" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* applications */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-white/6 bg-card-bg"
          >
            <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
              <div className="text-sm font-semibold text-white">Applications</div>
              <Link href="/applications" className="flex items-center gap-1 text-xs text-accent transition hover:underline">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/4">
              {applications.map((a) => (
                <Link
                  key={a.id}
                  href={`/applications/${a.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.02]"
                >
                  <ScoreRing score={a.score} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white">{a.name}</div>
                    <div className="text-[11px] text-text-muted">{a.program}</div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={a.status} />
                    <div className="mt-1 text-[11px] text-text-muted">
                      ${a.requested.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
