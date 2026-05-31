"use client";

import { motion } from "framer-motion";
import {
  User,
  Shield,
  Bell,
  Palette,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

const settings = [
  { section: "Profile", icon: User, items: ["Display name", "Email", "Bio"] },
  { section: "Security", icon: Shield, items: ["Wallet connection", "Two-factor auth", "Session management"] },
  { section: "Notifications", icon: Bell, items: ["Email alerts", "Evaluation complete", "Funding released"] },
  { section: "Appearance", icon: Palette, items: ["Theme", "Accent color", "Compact mode"] },
];

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  return (
    <AppShell>
      <div className="space-y-6 p-5 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage your profile and platform preferences</p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-5 lg:grid-cols-3"
        >
          <div className="lg:col-span-1 space-y-5">
            <motion.div variants={fadeUp as any} className="rounded-2xl border border-white/6 bg-card-bg p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-secondary text-sm font-semibold text-white">
                  AD
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Admin User</div>
                  <div className="text-[11px] text-text-muted">Grant Provider</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-text-muted">Contract Address</div>
                <div className="mt-1 break-all font-mono text-[11px] text-text-secondary">{contract}</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(contract); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-accent transition hover:underline"
                >
                  {copied ? <><CheckCircle2 className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy address</>}
                </button>
              </div>
              <a href="https://genlayer.com" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-muted transition hover:text-white">
                View on GenLayer Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp as any} className="lg:col-span-2 space-y-5">
            {settings.map((s) => (
              <div key={s.section} className="rounded-2xl border border-white/6 bg-card-bg p-5">
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-semibold text-white">{s.section}</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {s.items.map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">{item}</span>
                      <span className="text-xs text-text-muted">—</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}
