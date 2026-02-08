"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Monitor } from "lucide-react";
import type { Screenshot } from "@/lib/content";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils";
import { FrankenContainer } from "./franken-elements";

export default function ScreenshotGallery({
  screenshots,
  columns = 2,
}: {
  screenshots: Screenshot[];
  columns?: 2 | 3;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isLightboxOpen = lightboxIndex !== null;

  useBodyScrollLock(isLightboxOpen);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goNext = useCallback(() => {
    if (screenshots.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % screenshots.length : null));
  }, [screenshots.length]);

  const goPrev = useCallback(() => {
    if (screenshots.length === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : null));
  }, [screenshots.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goNext, goPrev]);

  return (
    <>
      <div className={cn(
        "grid gap-6 lg:gap-8",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
      )}>
        {screenshots.map((screenshot, index) => (
          <motion.button
            key={screenshot.src}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 4) * 0.1 }}
            viewport={{ once: true }}
            onClick={() => openLightbox(index)}
            aria-label={`Open screenshot: ${screenshot.title}`}
            className="group relative text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <FrankenContainer withBolts={false} className="overflow-hidden glass-modern group-hover:border-green-500/30 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] group-hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay Detail */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Expand Icon */}
                <div className="absolute top-4 right-4 h-10 w-10 rounded-full glass-modern flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500">
                   <Maximize2 className="h-4 w-4" />
                </div>

                {/* Content Info */}
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0 transition-all duration-500">
                   <div className="flex items-center gap-2 mb-2">
                      <Monitor className="h-3 w-3 text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Terminal Render</span>
                   </div>
                   <h4 className="text-xl font-black text-white leading-tight">{screenshot.title}</h4>
                </div>
              </div>
            </FrankenContainer>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
            onClick={closeLightbox}
          >
            {/* Cinematic Background Detail */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[150px]" />
               <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Top Bar */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 mb-1">Snapshot Details</span>
                  <h3 className="text-2xl font-black text-white">{screenshots[lightboxIndex].title}</h3>
               </div>
               <button
                 type="button"
                 onClick={closeLightbox}
                 aria-label="Close lightbox"
                 className="h-12 w-12 rounded-full glass-modern flex items-center justify-center text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
               >
                  <X className="h-6 w-6" />
               </button>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
               <button
                 type="button"
                 aria-label="Previous screenshot"
                 onClick={(e) => { e.stopPropagation(); goPrev(); }}
                 className="h-16 w-16 rounded-full glass-modern flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
               >
                  <ChevronLeft className="h-8 w-8" />
               </button>
               <button
                 type="button"
                 aria-label="Next screenshot"
                 onClick={(e) => { e.stopPropagation(); goNext(); }}
                 className="h-16 w-16 rounded-full glass-modern flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
               >
                  <ChevronRight className="h-8 w-8" />
               </button>
            </div>

            {/* Main Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full max-w-6xl max-h-[70vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={screenshots[lightboxIndex].src}
                alt={screenshots[lightboxIndex].alt}
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                priority
              />
            </motion.div>

            {/* Bottom Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  {lightboxIndex + 1} / {screenshots.length}
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
