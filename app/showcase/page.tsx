import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { screenshots, videos } from "@/lib/content";
import type { Video } from "@/lib/content";
import SectionShell from "@/components/section-shell";
import ScreenshotGallery from "@/components/screenshot-gallery";
import VideoPlayer from "@/components/video-player";
import FrankenEye from "@/components/franken-eye";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Screenshots and demos of FrankenTUI terminal UI framework",
};

export default function ShowcasePage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-black overflow-x-hidden">
      {/* ── CINEMATIC HEADER ─────────────────────────────────── */}
      <header className="relative pt-44 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[60px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-8">
              <Eye className="h-3 w-3" />
              Visual Gallery
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8">
              The <br /><span className="text-animate-green">Showcase.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Explore dashboards, data visualizations, 
              and complex visual effects rendered entirely 
              within the terminal grid.
            </p>
          </div>
        </div>

        {/* Floating Peeking Eye */}
        <div className="absolute top-48 right-[15%] hidden lg:block opacity-30 hover:opacity-100 transition-opacity">
          <FrankenEye className="scale-[2] rotate-12" />
        </div>
      </header>

      {/* ── Screenshot gallery section ───────────────────────── */}
      <SectionShell
        id="screenshots"
        icon="eye"
        title="Screenshots"
        kicker="All ten showcase views — dashboards, widgets, visual effects, data visualization, and more. Click any image to enlarge."
      >
        <ScreenshotGallery screenshots={screenshots} columns={2} />
      </SectionShell>

      {/* ── Video demos section ──────────────────────────────── */}
      <SectionShell
        id="video-demos"
        icon="play"
        title="Video Demos"
        kicker="Watch FrankenTUI running live in real terminal emulators with resize handling, CRT effects, and full interactivity."
      >
        <div className="mx-auto max-w-4xl space-y-8">
          {videos.map((video: Video) => (
            <VideoPlayer key={video.title} video={video} />
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
                Ready to build with FrankenTUI?
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-400/90 md:text-lg">
                Get started in minutes with our step-by-step guide. Add the
                crate, write your first Model, and see it render.
              </p>
            </div>

            <Link
              href="/getting-started"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-500 hover:shadow-green-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
