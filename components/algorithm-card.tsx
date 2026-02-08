"use client";

import { Binary } from "lucide-react";
import type { Algorithm } from "@/lib/content";
import { FrankenContainer } from "./franken-elements";

export default function AlgorithmCard({ algorithm }: { algorithm: Algorithm }) {
  return (
    <FrankenContainer withStitches={false} className="group h-full glass-modern transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1">
      <div className="flex h-full flex-col p-8">
        <div className="mb-8 flex items-center justify-between">
          <span className="inline-flex rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-green-400">
            {algorithm.category}
          </span>
          <Binary className="h-4 w-4 text-slate-700 group-hover:text-green-500/40 transition-colors" />
        </div>

        <h3 className="text-xl font-black text-white mb-3 group-hover:text-green-400 transition-colors">
          {algorithm.name}
        </h3>
        
        <p className="text-sm font-medium leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors mb-8 flex-1">
          {algorithm.description}
        </p>

        {algorithm.formula && (
          <div className="relative group/code mt-auto">
            <div className="absolute -inset-2 bg-green-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity" />
            <code className="relative font-mono text-[11px] font-bold text-green-300/70 group-hover:text-green-400 transition-colors">
              {algorithm.formula}
            </code>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Impact</span>
          <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-tighter">{algorithm.impact}</span>
        </div>
      </div>
    </FrankenContainer>
  );
}
