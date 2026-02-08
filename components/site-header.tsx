"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { navItems, siteConfig } from "@/lib/content";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils";
import { FrankenBolt } from "./franken-elements";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* ── DESKTOP FLOATING NAVBAR ──────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
          scrolled 
            ? "w-[90%] lg:w-[1000px] py-2 px-6 glass-modern rounded-full" 
            : "w-[95%] lg:w-[1200px] py-4 px-8 bg-transparent"
        )}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo with "Life" Indicator */}
          <Link
            href="/"
            className="group flex items-center gap-4 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-green-600 via-green-400 to-lime-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-110 active:scale-95">
              <FrankenBolt className="absolute -left-1 -top-1 z-20 scale-50" />
              <FrankenBolt className="absolute -right-1 -bottom-1 z-20 scale-50" />
              <span className="text-xl font-black text-black select-none">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white uppercase leading-none">
                {siteConfig.name}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">System Alive</span>
              </div>
            </div>
          </Link>

          {/* Centered Navigation */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    active ? "text-green-400" : "text-slate-400 hover:text-white"
                  )}
                >
                  {hoveredItem === item.href && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-green-500/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {active && !hoveredItem && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 border border-green-500/20 bg-green-500/5 rounded-full"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-black hover:bg-green-400 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Github className="h-4 w-4" />
              <span>GITHUB</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── MOBILE ADAPTIVE HEADER ───────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[60] md:hidden px-4 py-4 flex items-center justify-between glass-modern border-b-0 m-2 rounded-2xl">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center font-black text-black">F</div>
          <span className="text-xs font-black tracking-widest text-white uppercase">{siteConfig.name}</span>
        </Link>
        
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 active:scale-90 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu (Bottom-Sheet Style) */}
      <AnimatePresence>
        {open && (
          <>
	            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
	              id="mobile-nav"
	              className="fixed bottom-0 left-0 right-0 z-[80] bg-[#051205] border-t border-green-500/20 rounded-t-[32px] p-8 pb-12 md:hidden"
	            >
              <div className="w-12 h-1.5 bg-green-500/20 rounded-full mx-auto mb-8" />
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 active:bg-green-500/10 active:border-green-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span className="text-xl font-bold text-white">{item.label}</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                  </Link>
                ))}
	                <a
	                  href={siteConfig.github}
	                  target="_blank"
	                  rel="noopener noreferrer"
	                  className="mt-4 flex items-center justify-center gap-3 p-5 rounded-2xl bg-green-500 text-black font-black text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
	                >
	                  <Github /> STAR ON GITHUB
	                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
