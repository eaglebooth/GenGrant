"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  Home,
  FolderOpen,
  BarChart3,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Programs", href: "/programs", icon: FolderOpen },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-secondary">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">GenGrant</div>
          <div className="text-[10px] text-text-muted">GenLayer · Testnet</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/6 px-4 py-4">
        <a
          href="https://genlayer.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs text-text-muted transition hover:text-white"
        >
          <ExternalLink className="h-3 w-3" />
          GenLayer Docs
        </a>
        <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3">
          <div className="text-[10px] uppercase tracking-wider text-text-muted">
            Contract
          </div>
          <div className="mt-1 font-mono text-[10px] text-text-secondary">
            0x7a3f...9c2d
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex lg:h-screen lg:w-60 lg:flex-col lg:border-r lg:border-white/6 lg:bg-secondary-bg">
        <SidebarContent />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 h-full w-[280px] border-r border-white/6 bg-secondary-bg"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-text-muted transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* top bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/6 bg-secondary-bg/80 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-text-muted transition hover:bg-white/5 hover:text-white lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden text-xs text-text-muted lg:block">
              {pathname === "/" ? "Dashboard" : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/6 bg-white/5 px-3 py-1.5 md:flex">
              <div className="h-2 w-2 rounded-full bg-status-pending" />
              <span className="text-xs text-text-secondary">Testnet</span>
            </div>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
