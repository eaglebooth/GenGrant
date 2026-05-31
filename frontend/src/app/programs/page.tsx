"use client";

import { motion } from "framer-motion";
import { Plus, ChevronRight, TrendingUp, Wallet, Users, CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

const programs = [
  { id: 0, name: "AI Agents Grant", desc: "Funding AI agent infrastructure on GenLayer.", budget: 500_000, spent: 340_000, max: 50_000, applicants: 24, status: "ACTIVE" },
  { id: 1, name: "Web3 Infrastructure", desc: "Supporting core protocol development and tooling.", budget: 750_000, spent: 120_000, max: 75_000, applicants: 31, status: "ACTIVE" },
  { id: 2, name: "Developer Tooling", desc: "Improving developer experience across ecosystems.", budget: 300_000, spent: 225_000, max: 30_000, applicants: 18, status: "ACTIVE" },
  { id: 3, name: "Open Source Builders", desc: "Rewarding sustained open-source contributions.", budget: 400_000, spent: 0, max: 25_000, applicants: 0, status: "DRAFT" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-accent/15 text-accent", DRAFT: "bg-white/5 text-text-muted",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[status] || "bg-white/5 text-text-muted"}`}>{status}</span>;
}

export default function ProgramsPage() {
  const total = programs.reduce((a, p) => a + p.budget, 0);
  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Programs</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage grant programs and allocation budgets</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/15">
            <Plus className="h-4 w-4" /> New Program
          </button>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="grid gap-5 md:grid-cols-2">
          {programs.map((p) => {
            const pct = (p.spent / p.budget) * 100;
            return (
              <motion.div key={p.id} variants={fadeUp as any} whileHover={{ y: -3 }}>
                <Link href={`/programs/${p.id}`} className="block rounded-2xl border border-white/6 bg-card-bg p-6 transition hover:border-white/15">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">{p.name}</h2>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">{p.desc}</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>${p.spent.toLocaleString()} / ${p.budget.toLocaleString()}</span>
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>{p.applicants} applicants · max ${p.max.toLocaleString()}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
