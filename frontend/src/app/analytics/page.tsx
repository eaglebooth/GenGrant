"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

const metrics = [
  { label: "Total Budget", value: "$1.95M", change: "+12.4%", icon: Wallet, color: "text-accent" },
  { label: "Disbursed", value: "$685k", change: "35% of total", icon: TrendingUp, color: "text-accent-secondary" },
  { label: "Applications", value: "147", change: "+23 this week", icon: Users, color: "text-status-pending" },
  { label: "Approval Rate", value: "38%", change: "56 approved", icon: CheckCircle2, color: "text-status-approved" },
];

const approvalsOverTime = [20, 35, 28, 45, 52, 48, 61, 55, 68, 72, 65, 78];

const breakdown = [
  { name: "AI Agents Grant", approved: 12, rejected: 4, review: 8 },
  { name: "Web3 Infrastructure", approved: 8, rejected: 6, review: 17 },
  { name: "Developer Tooling", approved: 15, rejected: 2, review: 1 },
  { name: "Open Source Builders", approved: 0, rejected: 0, review: 0 },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-text-secondary">Funding metrics, approval statistics, and treasury overview</p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {metrics.map((m) => (
            <motion.div key={m.label} variants={fadeUp as any} className="rounded-2xl border border-white/6 bg-card-bg p-5">
              <div className={`inline-flex rounded-lg bg-white/5 p-2 ${m.color}`}>
                <m.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">{m.value}</div>
              <div className="text-xs text-text-muted">{m.label}</div>
              <div className="mt-1 text-[11px] text-text-secondary">{m.change}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-white/6 bg-card-bg p-6"
          >
            <h2 className="text-sm font-semibold text-white">Approvals over time</h2>
            <div className="mt-4 flex h-40 items-end gap-1.5">
              {approvalsOverTime.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 80) * 100}%` }}
                  transition={{ duration: 0.7, delay: i * 0.04 }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-accent/70 to-accent-secondary/80"
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-text-muted">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
          </motion.div>

          {/* status breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/6 bg-card-bg p-6"
          >
            <h2 className="text-sm font-semibold text-white">Status Breakdown</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: "Approved", count: 56, color: "bg-status-approved" },
                { label: "Needs Review", count: 26, color: "bg-status-pending" },
                { label: "Rejected", count: 12, color: "bg-status-rejected" },
                { label: "Pending", count: 53, color: "bg-white/20" },
              ].map((s) => (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">{s.label}</span>
                    <span className="font-medium text-white">{s.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.count / 147) * 100}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${s.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* per-program */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/6 bg-card-bg"
        >
          <div className="border-b border-white/6 px-6 py-4">
            <h2 className="text-sm font-semibold text-white">By Program</h2>
          </div>
          <div className="divide-y divide-white/4">
            {breakdown.map((p) => {
              const total = p.approved + p.rejected + p.review;
              return (
                <div key={p.name} className="flex items-center gap-6 px-6 py-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="mt-1 flex gap-3 text-[11px] text-text-muted">
                      <span><CheckCircle2 className="mr-1 inline h-3 w-3 text-status-approved" />{p.approved}</span>
                      <span><Clock className="mr-1 inline h-3 w-3 text-status-pending" />{p.review}</span>
                      <span><XCircle className="mr-1 inline h-3 w-3 text-status-rejected" />{p.rejected}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${total ? (p.approved / total) * 100 : 0}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-status-approved"
                    />
                  </div>
                  <div className="w-16 text-right text-xs text-text-secondary">{total ? `${((p.approved / total) * 100).toFixed(0)}%` : "—"}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
