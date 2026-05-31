"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Wand2,
  Globe,
  GitBranch,
  FileText,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

const applications = [
  { id: 0, name: "Nexus Protocol", program: "AI Agents Grant", score: 87, status: "APPROVED", requested: 45_000, date: "2026-05-15" },
  { id: 1, name: "ChainScribe", program: "Web3 Infrastructure", score: 72, status: "NEEDS_REVIEW", requested: 30_000, date: "2026-05-14" },
  { id: 2, name: "VaultMesh", program: "Developer Tooling", score: 91, status: "APPROVED", requested: 25_000, date: "2026-05-14" },
  { id: 3, name: "DataFlow DAO", program: "AI Agents Grant", score: 54, status: "REJECTED", requested: 60_000, date: "2026-05-13" },
  { id: 4, name: "RelayNode", program: "Web3 Infrastructure", score: 68, status: "NEEDS_REVIEW", requested: 40_000, date: "2026-05-12" },
  { id: 5, name: "BlockForge", program: "Developer Tooling", score: 95, status: "APPROVED", requested: 20_000, date: "2026-05-11" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-status-approved/15 text-status-approved",
    NEEDS_REVIEW: "bg-status-pending/15 text-status-pending",
    REJECTED: "bg-status-rejected/15 text-status-rejected",
    PENDING: "bg-status-pending/15 text-status-pending",
    FUNDED: "bg-accent/15 text-accent",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[status] || "bg-white/5 text-text-muted"}`}>{status}</span>;
}

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "var(--status-approved)" : score >= 60 ? "var(--status-pending)" : "var(--status-rejected)";
  return (
    <div className="relative inline-flex h-12 w-12 items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1 }} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[11px] font-semibold text-white">{score}</span>
    </div>
  );
}

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = applications.filter((a) => {
    if (filter !== "ALL" && a.status !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Applications</h1>
            <p className="mt-1 text-sm text-text-secondary">{applications.length} total applications across {new Set(applications.map(a => a.program)).size} programs</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/15">
            <Plus className="h-4 w-4" /> Submit Application
          </button>
        </div>

        {/* filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="w-full rounded-xl border border-white/6 bg-card-bg py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-text-muted transition focus:border-accent/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-white/6 bg-card-bg p-1">
            {["ALL", "APPROVED", "NEEDS_REVIEW", "REJECTED", "PENDING"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filter === s ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-2xl border border-white/6 bg-card-bg">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-4 border-b border-white/6 px-5 py-3 text-xs font-medium text-text-muted">
            <div>Application</div>
            <div>Program</div>
            <div className="text-right">Score</div>
            <div className="text-right">Status</div>
            <div className="text-right pr-2">Amount</div>
          </div>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
            {filtered.map((a) => (
              <motion.div key={a.id} variants={fadeUp as any}>
                <Link href={`/applications/${a.id}`} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-3.5 transition hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <ScoreRing score={a.score} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{a.name}</div>
                      <div className="text-[11px] text-text-muted">ID #{a.id} · {a.date}</div>
                    </div>
                  </div>
                  <div className="text-xs text-text-secondary">{a.program}</div>
                  <div className="text-right text-sm font-semibold text-white">{a.score}</div>
                  <div className="text-right"><StatusBadge status={a.status} /></div>
                  <div className="text-right text-xs text-text-muted pr-2">${a.requested.toLocaleString()}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
