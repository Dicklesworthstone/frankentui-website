import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Skull } from "lucide-react";
import { warStories, warStoriesExtended, optimizations, performanceSLAs } from "@/lib/content";
import SectionShell from "@/components/section-shell";
import WarStoryCard from "@/components/war-story-card";
import OptimizationCard from "@/components/optimization-card";

export const metadata: Metadata = {
  title: "War Stories & Optimizations",
  description:
    "Critical bugs fought and performance milestones achieved during the 5-day build of FrankenTUI.",
};

export default function WarStoriesPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-black">
      {/* ── Page header ──────────────────────────────────────── */}
      <header className="relative pt-44 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-8">
              <Skull className="h-3 w-3" />
              Battle Reports
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8">
              War <br /><span className="text-animate-green">Stories.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Building a TUI kernel in 5 days meant fighting 
              synchronized output deadlocks, battling character 
              collisions, and optimizing allocations into oblivion.
            </p>
          </div>
        </div>
      </header>

      {/* ── War Stories ──────────────────────────────────────── */}
      <SectionShell
        id="bugs"
        icon="skull"
        title="Critical Bugs"
        kicker="The most dangerous defects encountered and neutralized during development."
      >
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {warStories.map((story) => (
            <WarStoryCard key={story.title} story={story} />
          ))}
        </div>
      </SectionShell>

      {/* ── Extended War Stories ──────────────────────────────── */}
      <SectionShell
        id="deep-fixes"
        icon="shield"
        title="Deep Fixes"
        kicker="The subtle, multi-layered bugs that required understanding terminal internals, Unicode edge cases, and performance profiling to resolve."
      >
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {warStoriesExtended.map((story) => (
            <WarStoryCard key={story.title} story={story} />
          ))}
        </div>
      </SectionShell>

      {/* ── Performance SLAs ───────────────────────────────────── */}
      <SectionShell
        id="slas"
        icon="barChart3"
        title="Performance SLAs"
        kicker="Hard performance targets enforced in CI. Violations are test failures, not warnings."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-6 font-bold text-white">Metric</th>
                <th className="pb-3 pr-6 font-bold text-green-400">Target</th>
                <th className="pb-3 pr-6 font-bold text-yellow-400">Hard Cap</th>
                <th className="pb-3 font-bold text-slate-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {performanceSLAs.map((sla) => (
                <tr key={sla.metric} className="border-b border-white/5">
                  <td className="py-3 pr-6 font-medium text-white">{sla.metric}</td>
                  <td className="py-3 pr-6 font-mono text-xs text-green-400">{sla.target}</td>
                  <td className="py-3 pr-6 font-mono text-xs text-yellow-400">{sla.hardCap}</td>
                  <td className="py-3 text-xs text-slate-500">{sla.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Optimizations ────────────────────────────────────── */}
      <SectionShell
        id="optimizations"
        icon="zap"
        title="Performance Wins"
        kicker="Key architectural decisions that ensure FrankenTUI runs at 60 FPS even on potato hardware."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {optimizations.map((opt) => (
            <OptimizationCard key={opt.name} opt={opt} />
          ))}
        </div>
      </SectionShell>

      {/* ── CTA section ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-green-900/40 bg-gradient-to-br from-green-950/50 via-emerald-950/30 to-black p-10 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-900/15 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                See the code that fixed them
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-400/90 md:text-lg">
                Explore the repository to see the fixes and optimizations in their full context.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://github.com/Dicklesworthstone/frankentui"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-green-500/30 hover:bg-green-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                View on GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/getting-started"
                className="group inline-flex items-center gap-2.5 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:shadow-green-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
