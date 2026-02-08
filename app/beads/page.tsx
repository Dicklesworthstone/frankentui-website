"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Network, Share2, Info, Binary } from "lucide-react";
import SectionShell from "@/components/section-shell";
import { FrankenContainer } from "@/components/franken-elements";
import FrankenEye from "@/components/franken-eye";

const VIEWER_REPO = "https://github.com/Dicklesworthstone/beads-for-frankentui";

export default function BeadsPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-black overflow-x-hidden">
      {/* ── CINEMATIC HEADER ─────────────────────────────────── */}
      <header className="relative pt-44 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-8">
              <Network className="h-3 w-3" />
              Infrastructure Visualization
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8">
              Project <br /><span className="text-animate-green">Graph.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Explore the dependency-aware view of the work: 
              epics, tasks, blockers, and the critical path 
              that brought the monster to life.
            </p>
          </motion.div>
        </div>

        {/* Floating Peeking Eye */}
        <div className="absolute top-48 right-[15%] hidden lg:block opacity-30 hover:opacity-100 transition-opacity">
          <FrankenEye className="scale-[2.2] rotate-[15deg]" />
        </div>
      </header>

      {/* ── INFO & ACCESS ───────────────────────────────────── */}
      <SectionShell
        id="graph-info"
        eyebrow="Execution Backbone"
        title="Bead Intelligence"
        kicker="The project graph was the source of truth during the 5-day sprint. Every feature was a bead in a complex directed acyclic graph (DAG)."
      >
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <FrankenContainer withBolts={false} className="glass-modern p-8 md:p-10">
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                    <Binary className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Live Viewer
                  </h2>
                </div>
                
                <p className="text-slate-400 font-medium leading-relaxed text-base">
                  The interactive graph viewer provides a real-time perspective on the project&apos;s 
                  evolution. You can filter by status, priority, and dependency depth.
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    href="/beads-viewer/"
                    target="_blank"
                    className="group flex items-center justify-between p-5 rounded-2xl bg-green-500 text-black font-black text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>OPEN FULLSCREEN</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={VIEWER_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>VIEW REPOSITORY</span>
                  </a>
                </div>
              </div>
            </FrankenContainer>

            <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] text-left">
               <div className="flex items-center gap-3 mb-4 text-green-500">
                  <Info className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Graph Protocol</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed font-bold">
                  Note: The viewer below is an embedded instance of the standalone 
                  graph intelligence engine. For the best experience on mobile or 
                  low-powered devices, use the fullscreen link.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <FrankenContainer className="bg-black/60 p-1 overflow-hidden shadow-2xl">
              <div className="bg-black/80 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">beads_embedded_stream</span>
                </div>
                <div className="aspect-[4/3] w-full">
                  <iframe
                    title="Beads viewer"
                    src="/beads-viewer/"
                    className="h-full w-full border-0 grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </FrankenContainer>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}