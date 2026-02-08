import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Terminal,
  Layers,
  ArrowRight,
  Github,
  BookOpen,
} from "lucide-react";
import {
  codeExample, dashboardExample, inlineModeExample, faq, siteConfig,
  widgets, featureFlags, screenModes, troubleshooting, envVars,
  glyphOverrides, visualFxExample, keybindingExample,
  type Widget, type FeatureFlag, type ScreenModeRow, type TroubleshootItem, type EnvVar,
  type GlyphOverride,
} from "@/lib/content";
import SectionShell from "@/components/section-shell";
import RustCodeBlock from "@/components/rust-code-block";
import CrateGrid from "@/components/crate-grid";
import FrankenEye from "@/components/franken-eye";
import { FrankenContainer } from "@/components/franken-elements";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Install FrankenTUI and build your first terminal UI application in Rust",
};

export default function GettingStartedPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-black">
      {/* ── Page header ──────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/30 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 md:pb-24 md:pt-44 lg:px-8">
          {/* Peeking eyes */}
          <div className="absolute top-24 right-10 hidden md:block opacity-30 hover:opacity-100 transition-opacity">
            <FrankenEye className="rotate-[-20deg] scale-75" />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-6 bg-gradient-to-r from-green-500/80 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-widest text-green-400/90">
              Quick Start
            </p>
          </div>

          <h1
            className="font-bold tracking-tighter text-white"
            style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
          >
            Get Started
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400/90 md:text-xl md:leading-relaxed">
            Install FrankenTUI, write your first Elm-architecture app, and
            render it in your terminal in under five minutes.
          </p>
        </div>
      </header>

      {/* ── Installation ─────────────────────────────────────── */}
      <SectionShell
        id="installation"
        icon="terminal"
        title="Installation"
        kicker="Add the umbrella crate to pull in everything, or pick only the sub-crates you need."
      >
        <div className="space-y-6">
          {/* Umbrella crate */}
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-500">terminal</span>
            </div>
            <div className="p-4">
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-slate-500">$</span>{" "}
                  <span className="text-green-400">cargo</span>{" "}
                  <span className="text-white">add ftui</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Individual crates */}
          <p className="text-sm text-slate-400">
            Or, for fine-grained control, add only the crates you need:
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-500">terminal</span>
            </div>
            <div className="p-4">
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-slate-500">$</span>{" "}
                  <span className="text-green-400">cargo</span>{" "}
                  <span className="text-white">
                    add ftui-core ftui-render ftui-runtime
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ── Minimal Example ──────────────────────────────────── */}
      <SectionShell
        id="minimal-example"
        icon="rocket"
        title="Minimal Example"
        kicker="A complete, runnable app in under 50 lines. This counter increments on every event and quits when you press 'q'."
      >
        <RustCodeBlock code={codeExample} title="src/main.rs" />
      </SectionShell>

      {/* ── Crate Overview ───────────────────────────────────── */}
      <SectionShell
        id="crate-overview"
        icon="package"
        title="Crate Overview"
        kicker="FrankenTUI ships as 12 focused, composable crates. Use the umbrella ftui crate for convenience, or depend on individual crates when binary size and compile time matter."
      >
        <CrateGrid />
      </SectionShell>

      {/* ── Key Concepts ─────────────────────────────────────── */}
      <SectionShell
        id="key-concepts"
        icon="layers"
        title="Key Concepts"
        kicker="Three ideas that set FrankenTUI apart from other terminal UI frameworks."
      >
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {/* Elm Architecture */}
          <FrankenContainer withStitches={false} className="group bg-black/30 transition-all hover:border-green-500/20 hover:bg-black/40">
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">Elm Architecture</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                Every app is a <code className="text-green-400">Model</code> +{" "}
                <code className="text-green-400">update</code> +{" "}
                <code className="text-green-400">view</code>. Side effects flow
                through typed <code className="text-green-400">Cmd</code> values,
                never raw I/O. The runtime drives the loop, so your logic stays
                pure and testable.
              </p>
            </div>
          </FrankenContainer>

          {/* Inline Mode */}
          <FrankenContainer withStitches={false} className="group bg-black/30 transition-all hover:border-green-500/20 hover:bg-black/40">
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">Inline Mode</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                Render a stable UI region at the top or bottom of your terminal
                while logs and output scroll above. Unlike alternate-screen
                frameworks, your scrollback history is fully preserved.
              </p>
            </div>
          </FrankenContainer>

          {/* Screen Modes */}
          <FrankenContainer withStitches={false} className="group bg-black/30 transition-all hover:border-green-500/20 hover:bg-black/40">
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">Screen Modes</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                Choose{" "}
                <code className="text-green-400">ScreenMode::Alternate</code> for
                full-screen dashboards, or{" "}
                <code className="text-green-400">ScreenMode::Inline</code> for
                CLI tools that live alongside your shell. Switch modes at
                any time without losing state.
              </p>
            </div>
          </FrankenContainer>
        </div>
      </SectionShell>

      {/* ── More Examples ──────────────────────────────────── */}
      <SectionShell
        id="examples"
        icon="terminal"
        title="More Examples"
        kicker="Explore dashboard layouts, inline mode, and more patterns to jumpstart your next TUI project."
      >
        <div className="space-y-8">
          <RustCodeBlock code={dashboardExample} title="examples/dashboard.rs" />
          <RustCodeBlock code={inlineModeExample} title="examples/inline_progress.rs" />
        </div>
      </SectionShell>

      {/* ── Widget Table ──────────────────────────────────── */}
      <SectionShell
        id="widgets"
        icon="blocks"
        title="Widget Library"
        kicker="FrankenTUI ships 15+ production-ready widgets. Each is composable, styleable, and tested."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-green-400">Widget</th>
                <th className="py-3 pr-4 text-left font-bold text-xs uppercase tracking-widest text-slate-500">Description</th>
                <th className="py-3 text-left font-bold text-xs uppercase tracking-widest text-slate-500">Key Feature</th>
              </tr>
            </thead>
            <tbody>
              {widgets.map((w: Widget) => (
                <tr key={w.name} className="border-b border-white/5 transition-colors hover:bg-green-500/[0.03]">
                  <td className="py-3 pr-4 font-mono text-sm font-semibold text-white">{w.name}</td>
                  <td className="py-3 pr-4 text-sm text-slate-400">{w.description}</td>
                  <td className="py-3 text-sm text-slate-500">{w.keyFeature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Feature Flags ──────────────────────────────────── */}
      <SectionShell
        id="feature-flags"
        icon="package"
        title="Feature Flags"
        kicker="Fine-grained control over what gets compiled. Enable only the features you need to minimize binary size and compile time."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-green-400">Crate</th>
                <th className="py-3 pr-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-lime-400">Flag</th>
                <th className="py-3 text-left font-bold text-xs uppercase tracking-widest text-slate-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {featureFlags.map((f: FeatureFlag) => (
                <tr key={`${f.crate}-${f.flag}`} className="border-b border-white/5 transition-colors hover:bg-green-500/[0.03]">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{f.crate}</td>
                  <td className="py-3 pr-4 font-mono text-sm font-semibold text-white">{f.flag}</td>
                  <td className="py-3 text-sm text-slate-400">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Screen Modes ───────────────────────────────────── */}
      <SectionShell
        id="screen-modes"
        icon="layers"
        title="Screen Modes"
        kicker="Choose Inline for CLI tools that live alongside your shell, or Alternate for full-screen dashboards. Switch at any time without losing state."
      >
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-6">
            <h3 className="text-lg font-bold text-green-400 mb-3">Inline Mode</h3>
            <pre className="font-mono text-xs text-slate-400 leading-relaxed mb-4">{`[prior shell output]
[log line 1]
[log line 2]
+----------------------------+
| Status: Running tool...    |
| > Command: _               |
+----------------------------+`}</pre>
            <p className="text-sm text-slate-400 leading-relaxed">Scrollback is preserved. Logs remain visible after exit. UI occupies a fixed-height region anchored to the bottom.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">Alt-Screen Mode</h3>
            <pre className="font-mono text-xs text-slate-400 leading-relaxed mb-4">{`+----------------------------+
| Full-screen UI             |
| (no scrollback)            |
|                            |
|                            |
+----------------------------+`}</pre>
            <p className="text-sm text-slate-400 leading-relaxed">Full-screen clears are safe. Previous screen restores on exit. Classic TUI experience.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-left font-bold text-xs uppercase tracking-widest text-slate-500">Feature</th>
                <th className="py-3 pr-4 text-center font-bold text-xs uppercase tracking-widest text-green-400">Inline</th>
                <th className="py-3 text-center font-bold text-xs uppercase tracking-widest text-emerald-400">Alt-Screen</th>
              </tr>
            </thead>
            <tbody>
              {screenModes.map((row: ScreenModeRow) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-sm text-white">{row.feature}</td>
                  <td className="py-3 pr-4 text-center text-sm text-slate-400">{row.inline}</td>
                  <td className="py-3 text-center text-sm text-slate-400">{row.altScreen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Environment Variables ──────────────────────────── */}
      <SectionShell
        id="env-vars"
        icon="terminal"
        title="Environment Variables"
        kicker="Configure FrankenTUI's harness and runtime behavior without changing code."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-green-400">Variable</th>
                <th className="py-3 pr-4 text-left font-bold text-xs uppercase tracking-widest text-slate-500">Description</th>
                <th className="py-3 text-left font-mono text-xs font-bold uppercase tracking-widest text-slate-600">Example</th>
              </tr>
            </thead>
            <tbody>
              {envVars.map((v: EnvVar) => (
                <tr key={v.name} className="border-b border-white/5 transition-colors hover:bg-green-500/[0.03]">
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-white whitespace-nowrap">{v.name}</td>
                  <td className="py-3 pr-4 text-sm text-slate-400">{v.description}</td>
                  <td className="py-3 font-mono text-xs text-slate-600">{v.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Glyph Policy Overrides ─────────────────────────── */}
      <SectionShell
        id="glyph-overrides"
        icon="eye"
        title="Glyph Policy Overrides"
        kicker="Force deterministic glyph behavior via environment variables. Useful for CI, accessibility, or terminals with limited Unicode support."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-6 font-bold text-white">Variable</th>
                <th className="pb-3 pr-6 font-bold text-white">Values</th>
                <th className="pb-3 font-bold text-white">Description</th>
              </tr>
            </thead>
            <tbody>
              {glyphOverrides.map((g: GlyphOverride) => (
                <tr key={g.envVar} className="border-b border-white/5 transition-colors hover:bg-green-500/[0.03]">
                  <td className="py-3 pr-6 font-mono text-xs font-semibold text-green-400 whitespace-nowrap">{g.envVar}</td>
                  <td className="py-3 pr-6 font-mono text-xs text-slate-400">{g.values}</td>
                  <td className="py-3 text-sm text-slate-400">{g.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Visual Effects Example ──────────────────────────── */}
      <SectionShell
        id="visual-fx"
        icon="sparkles"
        title="Visual Effects Example"
        kicker="Layer animated backgrounds behind any widget without modifying the child's rendering logic. Stacked effects, opacity control, and automatic quality degradation."
      >
        <RustCodeBlock code={visualFxExample} title="fx_demo.rs" />
      </SectionShell>

      {/* ── Keybinding Config Example ──────────────────────── */}
      <SectionShell
        id="keybinding-config"
        icon="terminal"
        title="Keybinding Configuration"
        kicker="Configure key behavior via runtime config or environment variables. Ctrl+C idle action, Esc sequence detection timing, and multi-key sequence control."
      >
        <RustCodeBlock code={keybindingExample} title="keybinding_config.rs" />
      </SectionShell>

      {/* ── Troubleshooting ────────────────────────────────── */}
      <SectionShell
        id="troubleshooting"
        icon="shield"
        title="Troubleshooting"
        kicker="Common issues and how to fix them."
      >
        <div className="space-y-4">
          {troubleshooting.map((item: TroubleshootItem) => (
            <div key={item.symptom} className="rounded-2xl border border-white/5 bg-black/20 p-6 transition-all hover:border-red-500/10 hover:bg-black/30">
              <h3 className="text-sm font-bold text-red-400">{item.symptom}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-slate-600">Cause</p>
              <p className="mt-1 text-sm text-slate-400">{item.cause}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-green-400/60">Fix</p>
              <p className="mt-1 text-sm text-slate-300">{item.fix}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <SectionShell
        id="faq"
        icon="shield"
        title="Frequently Asked Questions"
        kicker="Common questions about installing, configuring, and building with FrankenTUI."
      >
        <div className="space-y-3">
          {faq.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-white/5 bg-black/20 transition-all open:border-green-500/20 open:bg-black/30">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-white md:p-6 md:text-base [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="ml-4 shrink-0 text-green-400/60 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-slate-400 md:px-6 md:pb-6">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </SectionShell>

      {/* ── Links / CTA ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-green-900/40 bg-gradient-to-br from-green-950/50 via-emerald-950/30 to-black p-10 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-900/15 via-transparent to-transparent" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Keep exploring
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-400/90 md:text-lg">
              Dive deeper into the architecture, browse the glossary, or jump
              straight to the source.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {/* GitHub */}
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-green-500/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
                <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>

              {/* Architecture */}
              <Link
                href="/architecture"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-green-500/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <BookOpen className="h-4 w-4" />
                Architecture
                <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>

              {/* Glossary */}
              <Link
                href="/glossary"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-green-500/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <BookOpen className="h-4 w-4" />
                Glossary
                <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
