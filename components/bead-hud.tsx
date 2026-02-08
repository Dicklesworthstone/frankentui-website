"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Shield, Zap } from "lucide-react";
import { AnimatedNumber } from "./animated-number";

export default function BeadHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Scanline Effect */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[2px] bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.3)] z-10"
      />

      {/* Corners / Brackets */}
      <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-green-500/40 rounded-tl-sm" />
      <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-green-500/40 rounded-tr-sm" />
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-green-500/40 rounded-bl-sm" />
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-green-500/40 rounded-br-sm" />

      {/* Telemetry HUD - Top Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-[10px] font-black text-green-500/60 uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-green-500/10 backdrop-blur-sm">
          <Activity className="h-3 w-3 animate-pulse" />
          <span>System Active</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-green-500/60 uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-green-500/10 backdrop-blur-sm">
          <Cpu className="h-3 w-3" />
          <span>Load: 4.2%</span>
        </div>
      </motion.div>

      {/* Telemetry HUD - Bottom Right */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-8 right-8 flex flex-col items-end gap-2"
      >
        <div className="flex items-center gap-2 text-[10px] font-black text-green-500/60 uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-green-500/10 backdrop-blur-sm">
          <span>Integrity: 100%</span>
          <Shield className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-green-500/60 uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-green-500/10 backdrop-blur-sm">
          <span>Sync: <AnimatedNumber value={98} />%</span>
          <Zap className="h-3 w-3" />
        </div>
      </motion.div>

      {/* Static / Noise Overlay (Very subtle) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}
