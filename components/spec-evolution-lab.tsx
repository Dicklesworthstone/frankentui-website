"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Filter,
  HelpCircle,
  Info,
  Link2,
  Search,
} from "lucide-react";

import styles from "./spec-evolution-lab.module.css";

type BucketKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type BucketMode = "day" | "hour" | "15m" | "5m";
type MetricKey = "groups" | "lines" | "patchBytes";
type TabKey = "diff" | "snapshot" | "raw" | "ledger" | "files";
type DiffFormat = "unified" | "sideBySide";

type NumStat = { path: string; added: number; deleted: number };
type Author = { name: string; email: string };

type ReviewGroup = {
  title?: string;
  buckets?: number[];
  confidence?: number;
  rationale?: string;
  evidence?: string[];
};

type Review = {
  groups?: ReviewGroup[];
  notes?: string[];
};

type SnapshotMeta = { lines: number; words: number; bytes: number };

type Commit = {
  sha: string;
  short: string;
  epoch: number;
  date: string;
  subject?: string;
  author?: Author;
  numstat: NumStat[];
  totals: { added: number; deleted: number; files: number };
  patch: string;
  files: { path: string; content: string }[];
  snapshot?: SnapshotMeta;
  review?: Review | null;
};

type Dataset = {
  generated_at: string;
  scope_paths: string[];
  bucket_defs: Record<string, string>;
  commits: Commit[];
};

type CommitView = Commit & {
  idx: number;
  reviewed: boolean;
  dateShort: string;
  bucketMask: number; // bit i indicates bucket i is present
  magnitude: { groups: number; lines: number; patchBytes: number };
};

const BUCKET_KEYS: BucketKey[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const bucketColors: Record<BucketKey, string> = {
  0: "#64748b",
  1: "#fb7185",
  2: "#fbbf24",
  3: "#60a5fa",
  4: "#a78bfa",
  5: "#94a3b8",
  6: "#34d399",
  7: "#22c55e",
  8: "#06b6d4",
  9: "#cbd5e1",
  10: "#e2e8f0",
};

const bucketNames: Record<BucketKey, string> = {
  0: "Unreviewed",
  1: "Logic / Math Fixes",
  2: "FTUI Codebase Accuracy",
  3: "External Ecosystem Accuracy",
  4: "Concept / Architecture",
  5: "Scrivening / Ministerial",
  6: "Background / Context",
  7: "Engineering Improvements",
  8: "Alien Artifact",
  9: "Elaboration",
  10: "Other",
};

function clampInt(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function hasBucket(mask: number, b: BucketKey) {
  return (mask & (1 << b)) !== 0;
}

function computeCommitBucketMask(c: Commit): number {
  const groups = c.review?.groups || null;
  if (!groups) return 1 << 0;
  let mask = 0;
  for (const g of groups) {
    const buckets = g.buckets || [];
    if (!buckets.length) {
      mask |= 1 << 10;
      continue;
    }
    for (const b of buckets) {
      if (typeof b !== "number") continue;
      if (b < 0 || b > 10) continue;
      mask |= 1 << b;
    }
  }
  if (mask === 0) mask |= 1 << 10;
  return mask;
}

function bucketKey(commit: CommitView, mode: BucketMode) {
  // Uses commit's own ISO-with-offset string as stable wall-clock key.
  const iso = commit.date;
  const day = iso.slice(0, 10);
  const hour = iso.slice(11, 13);
  const minute = parseInt(iso.slice(14, 16), 10);

  if (mode === "day") return day;
  if (mode === "hour") return `${day} ${hour}:00`;
  if (mode === "15m") {
    const mm = String(Math.floor(minute / 15) * 15).padStart(2, "0");
    return `${day} ${hour}:${mm}`;
  }
  if (mode === "5m") {
    const mm = String(Math.floor(minute / 5) * 5).padStart(2, "0");
    return `${day} ${hour}:${mm}`;
  }
  return day;
}

function perCommitBucketWeights(commit: CommitView, softMode: boolean): Record<number, number> {
  // Metric: change-groups. Soft assignment spreads 1 group across its bucket labels.
  if (!commit.review) return { 0: 1 };
  const out: Record<number, number> = {};
  const groups = commit.review.groups || [];
  for (const g of groups) {
    const buckets = g.buckets || [];
    if (!buckets.length) {
      out[10] = (out[10] || 0) + 1;
      continue;
    }
    if (softMode) {
      const w = 1 / buckets.length;
      for (const b of buckets) out[b] = (out[b] || 0) + w;
    } else {
      for (const b of buckets) out[b] = (out[b] || 0) + 1;
    }
  }
  return out;
}

function perCommitBucketMagnitude(commit: CommitView, metric: MetricKey, softMode: boolean): Record<number, number> {
  // Metric: lines or patchBytes. Distribute per-commit magnitude across groups, then across bucket labels.
  const magnitude = commit.magnitude[metric] ?? 0;
  if (!commit.review) return { 0: magnitude };
  const groups = commit.review.groups || [];
  const groupsN = Math.max(1, groups.length);
  const perGroup = magnitude / groupsN;

  const out: Record<number, number> = {};
  for (const g of groups) {
    const buckets = g.buckets || [];
    if (!buckets.length) {
      out[10] = (out[10] || 0) + perGroup;
      continue;
    }
    if (softMode) {
      const w = perGroup / buckets.length;
      for (const b of buckets) out[b] = (out[b] || 0) + w;
    } else {
      for (const b of buckets) out[b] = (out[b] || 0) + perGroup;
    }
  }
  return out;
}

function buildSnapshotMarkdown(c: CommitView, fileChoice: string) {
  if (fileChoice && fileChoice !== "__ALL__") {
    const f = c.files.find((x) => x.path === fileChoice);
    if (!f) return "";
    return `# ${f.path}\n\n${f.content}`;
  }

  const parts: string[] = [];
  parts.push(`# FrankenTUI Spec Corpus (snapshot)\n`);
  for (const f of c.files) {
    parts.push(`\n---\n\n## ${f.path}\n\n${f.content}`);
  }
  return parts.join("\n");
}

function computeEditDistanceLines(prevText: string, nextText: string, maxCost: number): number {
  // Levenshtein distance on lines (token = line). Uses hashing for faster comparisons.
  const a = prevText.split(/\n/);
  const b = nextText.split(/\n/);

  const k = typeof maxCost === "number" ? maxCost : Number.POSITIVE_INFINITY;
  if (Math.abs(a.length - b.length) > k) return k + 1;

  function fnv1a(str: string) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const ah = new Uint32Array(a.length);
  const bh = new Uint32Array(b.length);
  for (let i = 0; i < a.length; i++) ah[i] = fnv1a(a[i]);
  for (let j = 0; j < b.length; j++) bh[j] = fnv1a(b[j]);

  const m = b.length;
  let prev = new Uint32Array(m + 1);
  let curr = new Uint32Array(m + 1);
  for (let j = 0; j <= m; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let minRow = curr[0];
    const ai = ah[i - 1];
    for (let j = 1; j <= m; j++) {
      const cost = ai === bh[j - 1] ? 0 : 1;
      const del = prev[j] + 1;
      const ins = curr[j - 1] + 1;
      const sub = prev[j - 1] + cost;
      let v = del < ins ? del : ins;
      if (sub < v) v = sub;
      curr[j] = v;
      if (v < minRow) minRow = v;
    }

    if (minRow > k) return k + 1;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }

  return prev[m];
}

type PatchLineKind = "meta" | "hunk" | "context" | "add" | "del";
type PatchLine = { kind: PatchLineKind; text: string };
type PatchHunk = { header: string; lines: PatchLine[] };
type PatchFile = { pathA: string; pathB: string; headerLines: PatchLine[]; hunks: PatchHunk[] };

function parseGitPatch(patch: string): PatchFile[] {
  const lines = patch.split("\n");
  const files: PatchFile[] = [];
  let currentFile: PatchFile | null = null;
  let currentHunk: PatchHunk | null = null;

  const flushFile = () => {
    if (!currentFile) return;
    files.push(currentFile);
    currentFile = null;
    currentHunk = null;
  };

  for (const line of lines) {
    if (line.startsWith("diff --git ")) {
      flushFile();
      const m = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
      const pathA = m?.[1] ?? "unknown";
      const pathB = m?.[2] ?? "unknown";
      currentFile = { pathA, pathB, headerLines: [{ kind: "meta", text: line }], hunks: [] };
      currentHunk = null;
      continue;
    }

    if (!currentFile) continue;

    if (line.startsWith("@@")) {
      currentHunk = { header: line, lines: [] };
      currentFile.hunks.push(currentHunk);
      continue;
    }

    const kind: PatchLineKind =
      line.startsWith("+") && !line.startsWith("+++")
        ? "add"
        : line.startsWith("-") && !line.startsWith("---")
          ? "del"
          : line.startsWith(" ")
            ? "context"
            : "meta";

    const pl: PatchLine = { kind, text: line };
    if (currentHunk) currentHunk.lines.push(pl);
    else currentFile.headerLines.push(pl);
  }

  flushFile();
  return files;
}

function parseHunkHeader(header: string): { oldStart: number; newStart: number } | null {
  const m = /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(header);
  if (!m) return null;
  return { oldStart: parseInt(m[1], 10), newStart: parseInt(m[3], 10) };
}

type SideCell = { kind: "context" | "add" | "del" | "empty"; lineNo?: number; text?: string };
type SideRow = { left: SideCell; right: SideCell };

function hunkToSideBySideRows(hunk: PatchHunk): SideRow[] {
  const start = parseHunkHeader(hunk.header);
  let oldLine = start?.oldStart ?? 0;
  let newLine = start?.newStart ?? 0;

  const rows: SideRow[] = [];
  const dels: PatchLine[] = [];
  const adds: PatchLine[] = [];

  const flush = () => {
    while (dels.length || adds.length) {
      const dl = dels.shift() || null;
      const al = adds.shift() || null;

      const left: SideCell = dl
        ? { kind: "del", lineNo: oldLine++, text: dl.text.slice(1) }
        : { kind: "empty" };
      const right: SideCell = al
        ? { kind: "add", lineNo: newLine++, text: al.text.slice(1) }
        : { kind: "empty" };
      rows.push({ left, right });
    }
  };

  for (const l of hunk.lines) {
    if (l.kind === "del") {
      dels.push(l);
      continue;
    }
    if (l.kind === "add") {
      adds.push(l);
      continue;
    }
    flush();
    if (l.kind === "context") {
      const text = l.text.slice(1);
      rows.push({
        left: { kind: "context", lineNo: oldLine++, text },
        right: { kind: "context", lineNo: newLine++, text },
      });
      continue;
    }
    // meta inside hunk
    rows.push({
      left: { kind: "empty" },
      right: { kind: "empty" },
    });
  }
  flush();
  return rows;
}

function enhanceMarkdownTables(root: HTMLElement | null) {
  if (!root) return;
  const tables = root.querySelectorAll("table");
  tables.forEach((table) => {
    table.classList.add("responsiveTable");

    const headers: string[] = [];
    const thead = table.querySelectorAll("thead th");
    if (thead.length) {
      thead.forEach((th) => headers.push((th.textContent || "").trim()));
    } else {
      const firstRow = table.querySelector("tr");
      if (firstRow) {
        firstRow.querySelectorAll("th, td").forEach((cell) => headers.push((cell.textContent || "").trim()));
      }
    }
    if (!headers.length) return;

    table.querySelectorAll("tbody tr").forEach((tr) => {
      const cells = tr.querySelectorAll("th, td");
      cells.forEach((cell, idx) => {
        const label = headers[idx] || "";
        cell.setAttribute("data-label", label);
      });
    });
  });
}

function formatMetricLabel(metric: MetricKey) {
  if (metric === "groups") return "change-groups";
  if (metric === "lines") return "lines changed (+/-)";
  return "patch bytes";
}

function downloadObjectAsJson(obj: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function BucketChip({
  bucket,
  showLabel = true,
  onClick,
}: {
  bucket: BucketKey;
  showLabel?: boolean;
  onClick?: () => void;
}) {
  const name = bucketNames[bucket] || `Bucket ${bucket}`;
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
      title={name}
      onClick={onClick}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: bucketColors[bucket] }} />
      <span className="font-mono">{bucket}</span>
      {showLabel ? <span className="hidden sm:inline text-slate-300">{name}</span> : null}
    </button>
  );
}

function DialogShell({
  dialogRef,
  title,
  subtitle,
  children,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="w-[min(820px,92vw)] rounded-2xl border border-white/10 bg-[#050a0f] p-0 text-slate-100 shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
        <div className="min-w-0">
          <h3 className="font-black tracking-tight">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
          onClick={() => dialogRef.current?.close()}
        >
          Close
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}

function StackedBars({
  xKeys,
  seriesByBucket,
  focusBucket,
  onSelectKey,
}: {
  xKeys: string[];
  seriesByBucket: Record<BucketKey, number[]>;
  focusBucket: BucketKey | null;
  onSelectKey: (k: string) => void;
}) {
  // Pure SVG stacked bars (small n, avoids pulling in heavy chart libs).
  const height = 340;
  const barW = 28;
  const gap = 8;
  const margin = { top: 18, right: 18, bottom: 56, left: 38 };
  const innerH = height - margin.top - margin.bottom;
  const width = Math.max(720, margin.left + margin.right + xKeys.length * (barW + gap));

  const totals = xKeys.map((_, idx) => {
    let sum = 0;
    for (const b of BUCKET_KEYS) sum += seriesByBucket[b][idx] || 0;
    return sum;
  });
  const maxTotal = Math.max(1, ...totals);

  const yTicks = 5;
  const tickVals = new Array(yTicks + 1).fill(0).map((_, i) => (maxTotal * i) / yTicks);

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="block"
        role="img"
        aria-label="Stacked bar chart of revision buckets over time"
      >
        {/* grid + y axis */}
        {tickVals.map((v, i) => {
          const y = margin.top + innerH - (v / maxTotal) * innerH;
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="rgba(148,163,184,0.9)"
              >
                {Math.round(v * 100) / 100}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {xKeys.map((k, idx) => {
          const x = margin.left + idx * (barW + gap);
          let y = margin.top + innerH;
          return (
            <g
              key={k}
              className="cursor-pointer"
              onClick={() => onSelectKey(k)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelectKey(k);
              }}
              tabIndex={0}
              role="button"
              aria-label={`Select bucket ${k}`}
            >
              {BUCKET_KEYS.map((b) => {
                const v = seriesByBucket[b][idx] || 0;
                const h = (v / maxTotal) * innerH;
                y -= h;
                if (h <= 0.25) return null;
                const opacity = focusBucket !== null && b !== focusBucket ? 0.18 : 0.95;
                return (
                  <rect
                    key={b}
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx={3}
                    fill={bucketColors[b]}
                    opacity={opacity}
                  />
                );
              })}

              {/* x label */}
              <text
                x={x + barW / 2}
                y={height - 18}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="rgba(148,163,184,0.9)"
                transform={xKeys.length > 12 ? `rotate(25, ${x + barW / 2}, ${height - 18})` : undefined}
              >
                {k}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MarkdownView({ markdown }: { markdown: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setErr("");
    setHtml("");

    (async () => {
      try {
        const [{ marked }, { default: DOMPurify }, { default: hljs }] = await Promise.all([
          import("marked"),
          import("dompurify"),
          import("highlight.js"),
        ]);

        marked.setOptions({
          gfm: true,
          breaks: false,
        } as Parameters<typeof marked.setOptions>[0]);

        const rawHtml = await marked.parse(markdown);
        const safeHtml = DOMPurify.sanitize(String(rawHtml), { USE_PROFILES: { html: true } });
        if (!cancelled) setHtml(String(safeHtml));
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  useEffect(() => {
    enhanceMarkdownTables(rootRef.current);
  }, [html]);

  if (err) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-200">
        Failed to render markdown: <span className="font-mono">{err}</span>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={clsx(
        "rounded-2xl border border-white/10 bg-black/30 p-4 overflow-auto max-h-[72vh]",
        styles.mdProse
      )}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function SpecEvolutionLab() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [commits, setCommits] = useState<CommitView[]>([]);
  const [loadError, setLoadError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<TabKey>("diff");
  const [diffFormat, setDiffFormat] = useState<DiffFormat>("unified");

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [fileChoice, setFileChoice] = useState<string>("__ALL__");

  const [showReviewedOnly, setShowReviewedOnly] = useState<boolean>(false);
  const [softMode, setSoftMode] = useState<boolean>(true);
  const [bucketMode, setBucketMode] = useState<BucketMode>("day");
  const [metric, setMetric] = useState<MetricKey>("groups");
  const [bucketFilter, setBucketFilter] = useState<BucketKey | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [distanceOut, setDistanceOut] = useState<string>("");

  const legendDialogRef = useRef<HTMLDialogElement | null>(null);
  const bucketInfoDialogRef = useRef<HTMLDialogElement | null>(null);
  const controlsDialogRef = useRef<HTMLDialogElement | null>(null);
  const commitsDialogRef = useRef<HTMLDialogElement | null>(null);
  const helpDialogRef = useRef<HTMLDialogElement | null>(null);

  const [bucketInfo, setBucketInfo] = useState<BucketKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadError("");
    (async () => {
      try {
        const res = await fetch("/how-it-was-built/frankentui_spec_evolution_dataset.json", {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ds = (await res.json()) as Dataset;
        if (cancelled) return;

        const cv: CommitView[] = ds.commits.map((c, idx) => ({
          ...c,
          idx,
          reviewed: !!c.review,
          dateShort: c.date.replace("T", " ").slice(0, 19),
          bucketMask: computeCommitBucketMask(c),
          magnitude: {
            groups: c.review?.groups?.length ? c.review.groups.length : 1,
            lines: (c.totals?.added || 0) + (c.totals?.deleted || 0),
            patchBytes: new TextEncoder().encode(c.patch || "").length,
          },
        }));

        setDataset(ds);
        setCommits(cv);
        setSelectedIndex(0);
        setFileChoice("__ALL__");
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const reviewedCount = useMemo(() => commits.filter((c) => c.reviewed).length, [commits]);

  const filteredCommits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return commits.filter((c) => {
      if (showReviewedOnly && !c.reviewed) return false;
      if (bucketFilter !== null && !hasBucket(c.bucketMask, bucketFilter)) return false;
      if (!q) return true;
      return (c.subject || "").toLowerCase().includes(q) || c.short.toLowerCase().includes(q);
    });
  }, [bucketFilter, commits, searchQuery, showReviewedOnly]);

  const selectedCommit = commits[selectedIndex];

  useEffect(() => {
    setDistanceOut("");
  }, [selectedIndex]);

  const chartModel = useMemo(() => {
    const base = commits.filter((c) => (!showReviewedOnly ? true : c.reviewed));

    const buckets = new Map<string, CommitView[]>();
    for (const c of base) {
      if (bucketFilter !== null && !hasBucket(c.bucketMask, bucketFilter)) continue;
      const k = bucketKey(c, bucketMode);
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k)!.push(c);
    }

    const xKeys = Array.from(buckets.keys()).sort();

    const seriesByBucket: Record<BucketKey, number[]> = BUCKET_KEYS.reduce(
      (acc, b) => {
        acc[b] = new Array(xKeys.length).fill(0);
        return acc;
      },
      {} as Record<BucketKey, number[]>
    );

    xKeys.forEach((k, idx) => {
      const commitsIn = buckets.get(k) || [];
      for (const c of commitsIn) {
        const dist = metric === "groups" ? perCommitBucketWeights(c, softMode) : perCommitBucketMagnitude(c, metric, softMode);
        for (const [bk, val] of Object.entries(dist)) {
          const b = parseInt(bk, 10);
          if (b < 0 || b > 10) continue;
          seriesByBucket[b as BucketKey][idx] += val;
        }
      }
    });

    const firstCommitByKey = new Map<string, number>();
    for (const k of xKeys) {
      const list = buckets.get(k) || [];
      if (list.length) firstCommitByKey.set(k, list[0].idx);
    }

    return { xKeys, seriesByBucket, firstCommitByKey };
  }, [bucketFilter, bucketMode, commits, metric, showReviewedOnly, softMode]);

  const patchFiles = useMemo(() => {
    if (!selectedCommit) return [];
    if (activeTab !== "diff") return [];
    return parseGitPatch(selectedCommit.patch || "");
  }, [activeTab, selectedCommit]);

  const snapshotMarkdown = useMemo(() => {
    if (!selectedCommit) return "";
    return buildSnapshotMarkdown(selectedCommit, fileChoice);
  }, [fileChoice, selectedCommit]);

  const bucketInfoDesc = useMemo(() => {
    if (!dataset || bucketInfo === null) return "";
    return dataset.bucket_defs?.[String(bucketInfo)] || "";
  }, [bucketInfo, dataset]);

  function openLegend() {
    legendDialogRef.current?.showModal();
  }

  function openControls() {
    controlsDialogRef.current?.showModal();
  }

  function openCommits() {
    commitsDialogRef.current?.showModal();
  }

  function openBucketInfo(b: BucketKey) {
    setBucketInfo(b);
    bucketInfoDialogRef.current?.showModal();
  }

  function toggleBucketFilter(b: BucketKey) {
    setBucketFilter((prev) => (prev === b ? null : b));
  }

  function selectCommit(idx: number) {
    setSelectedIndex(clampInt(idx, 0, Math.max(0, commits.length - 1)));
    setDistanceOut("");
  }

  function computeDistancePrevToCurrent() {
    if (!selectedCommit) return;
    if (selectedIndex === 0) {
      setDistanceOut("Edit distance: (no previous commit)");
      return;
    }

    const prev = commits[selectedIndex - 1];
    const c = selectedCommit;
    const prevMd = prev.files.map((f) => `## ${f.path}\n${f.content}`).join("\n");
    const nextMd = c.files.map((f) => `## ${f.path}\n${f.content}`).join("\n");

    const ub = (c.totals.added + c.totals.deleted) * 4 + 200; // loose upper bound
    const t0 = performance.now();
    const dist = computeEditDistanceLines(prevMd, nextMd, ub);
    const t1 = performance.now();
    const label = dist > ub ? `>${ub} (early-exit)` : String(dist);
    setDistanceOut(
      `Edit distance (lines, prev→current): ${label} · computed in ${(t1 - t0).toFixed(1)}ms · upper bound ${ub}`
    );
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        helpDialogRef.current?.showModal();
        e.preventDefault();
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const input = document.getElementById("specLabSearch") as HTMLInputElement | null;
        input?.focus();
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowLeft") {
        selectCommit(selectedIndex - 1);
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowRight") {
        selectCommit(selectedIndex + 1);
        e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        [legendDialogRef, bucketInfoDialogRef, controlsDialogRef, commitsDialogRef, helpDialogRef].forEach((r) => {
          if (r.current?.open) r.current.close();
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);

  if (loadError) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-2xl font-black tracking-tight">Spec Evolution Lab</h1>
        <p className="mt-2 text-slate-400">Failed to load dataset.</p>
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-200">
          <span className="font-mono">{loadError}</span>
        </div>
      </main>
    );
  }

  if (!dataset || !commits.length || !selectedCommit) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-2xl font-black tracking-tight">Spec Evolution Lab</h1>
        <p className="mt-2 text-slate-400">Loading forensic dataset…</p>
        <div className="mt-6 h-40 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
      </main>
    );
  }

  const metricLabel = formatMetricLabel(metric);
  const filterNote =
    bucketFilter === null ? "" : ` · Filter: ${bucketFilter}. ${bucketNames[bucketFilter] || `Bucket ${bucketFilter}`}`;

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[radial-gradient(1200px_700px_at_20%_-10%,rgba(34,197,94,0.12),transparent_50%),radial-gradient(900px_600px_at_110%_20%,rgba(45,212,191,0.10),transparent_55%),linear-gradient(to_bottom,#020508,#070c11)] text-slate-100"
    >
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-[1480px] px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 grid place-items-center">
                  <span className="font-mono text-xs text-green-400">ftui</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-base md:text-lg font-black tracking-tight truncate">Spec Evolution Lab</h1>
                  <p className="text-[11px] md:text-xs text-slate-400 truncate">
                    FrankenTUI specs from inception, reconstructed from git history + manual categorization
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="specLabSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commits…"
                  className="w-[340px] rounded-full border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/60"
                />
              </div>

              <select
                value={bucketMode}
                onChange={(e) => setBucketMode(e.target.value as BucketMode)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              >
                <option value="day">Bucket: Day</option>
                <option value="hour">Bucket: Hour</option>
                <option value="15m">Bucket: 15m</option>
                <option value="5m">Bucket: 5m</option>
              </select>

              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as MetricKey)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              >
                <option value="groups">Metric: Change-Groups</option>
                <option value="lines">Metric: Lines (+/-)</option>
                <option value="patchBytes">Metric: Patch Bytes</option>
              </select>

              <button
                type="button"
                onClick={openLegend}
                className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 hover:bg-green-500/15 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              >
                Legend
              </button>
              <button
                type="button"
                onClick={() => downloadObjectAsJson(dataset, "frankentui_spec_evolution_dataset.json")}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              >
                Download JSON
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={openControls}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold"
              >
                Controls
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="font-mono">{commits.length} commits</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono">scope: {dataset.scope_paths.join(" + ")}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono">
                review coverage: {reviewedCount}/{commits.length}
              </span>
            </span>

            {bucketFilter !== null ? (
              <button
                type="button"
                title="Clear bucket filter"
                onClick={() => setBucketFilter(null)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400/60"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: bucketColors[bucketFilter] }} />
                <span className="font-mono">
                  filter: {bucketFilter}. {bucketNames[bucketFilter]}
                </span>
                <span className="text-slate-500">×</span>
              </button>
            ) : null}

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="font-mono text-slate-500">Tip:</span>
              <span>
                Use <span className="font-mono text-slate-300">←/→</span> to scrub commits,{" "}
                <span className="font-mono text-slate-300">/</span> to search, and{" "}
                <span className="font-mono text-slate-300">?</span> for help.
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06),_0_20px_60px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <h2 className="font-black tracking-tight">Commits</h2>
                  <p className="text-xs text-slate-400">Filtered list; select to inspect.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviewedOnly((v) => !v)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  {showReviewedOnly ? "Reviewed: Only" : "Reviewed: All"}
                </button>
              </div>
              <div className="max-h-[72vh] overflow-auto">
                {filteredCommits.map((c) => {
                  const weights = perCommitBucketWeights(c, softMode);
                  const bucketKeys = Object.keys(weights)
                    .map((x) => parseInt(x, 10))
                    .filter((b) => Number.isFinite(b) && b >= 0 && b <= 10) as BucketKey[];
                  const showBuckets = (c.reviewed ? bucketKeys.filter((b) => b !== 0) : bucketKeys).slice(0, 4);
                  const isActive = c.idx === selectedIndex;
                  return (
                    <button
                      key={c.sha}
                      type="button"
                      onClick={() => selectCommit(c.idx)}
                      className={clsx(
                        "w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-400/60",
                        isActive ? "bg-white/5" : ""
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500">{c.short}</span>
                            <span className="font-mono text-[11px] text-slate-500">{c.dateShort}</span>
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-100 truncate">{c.subject || ""}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {c.reviewed ? (
                            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                              Reviewed
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                              Unreviewed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                        {showBuckets.length ? (
                          showBuckets.map((b) => (
                            <button
                              key={b}
                              type="button"
                              title={bucketNames[b]}
                              onClick={(e) => {
                                e.stopPropagation();
                                openBucketInfo(b);
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:bg-white/10"
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: bucketColors[b] }} />
                              {b}
                            </button>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">(no buckets yet)</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {/* Chart card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06),_0_20px_60px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight">Revision Taxonomy Over Time</h2>
                  <p className="text-xs text-slate-400">
                    Stacked bars grouped by time window; click a bar to jump to the first commit in that bucket.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSoftMode((v) => !v)}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300 hover:bg-green-500/15"
                  >
                    {softMode ? "Soft assignment" : "Multi-label"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBucketFilter(null);
                      setShowReviewedOnly(false);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="p-4">
                <StackedBars
                  xKeys={chartModel.xKeys}
                  seriesByBucket={chartModel.seriesByBucket}
                  focusBucket={bucketFilter}
                  onSelectKey={(k) => {
                    const idx = chartModel.firstCommitByKey.get(k);
                    if (typeof idx === "number") selectCommit(idx);
                  }}
                />
                <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="text-xs text-slate-400">
                    Mode: {softMode ? "soft assignment" : "multi-label"} · Metric: {metricLabel} · Bucket: {bucketMode}
                    {filterNote} · Unreviewed commits are bucket 0.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openLegend}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Legend
                    </button>
                    <button
                      type="button"
                      onClick={openCommits}
                      className="lg:hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Commits
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline scrubber */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06),_0_20px_60px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-black tracking-tight">Timeline Scrubber</h2>
                  <p className="text-xs text-slate-400">Select a commit, then explore diff, snapshot, and ledger.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectCommit(selectedIndex - 1)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" /> Prev
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommit(selectedIndex + 1)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-1">
                      Next <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
                  <span>{commits[0]?.dateShort || ""}</span>
                  <span>{commits[commits.length - 1]?.dateShort || ""}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, commits.length - 1)}
                  value={selectedIndex}
                  onChange={(e) => selectCommit(parseInt(e.target.value, 10))}
                  className="mt-2 w-full"
                />
                <div className="mt-3">
                  <div className="text-xs font-mono text-slate-500">{selectedCommit.short}</div>
                  <div className="mt-1 text-base font-black tracking-tight">{selectedCommit.subject || ""}</div>
                  <div className="mt-1 text-xs font-mono text-slate-500">
                    {selectedCommit.date} · (+{selectedCommit.totals.added}/-{selectedCommit.totals.deleted})
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(location.href);
                      } catch {
                        // best-effort
                      }
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Copy Link
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => helpDialogRef.current?.showModal()}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={computeDistancePrevToCurrent}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 hover:bg-green-500/15"
                  >
                    Compute Edit Distance
                  </button>
                </div>
              </div>
            </div>

            {/* Inspector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06),_0_20px_60px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-black tracking-tight">Commit Inspector</h2>
                  <p className="text-xs text-slate-400">Diff, snapshot, evidence ledger, and file changes.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={fileChoice}
                    onChange={(e) => setFileChoice(e.target.value)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
                    title="Select spec file for snapshot view"
                  >
                    <option value="__ALL__">Snapshot: All spec files</option>
                    {selectedCommit.files.map((f) => (
                      <option key={f.path} value={f.path}>
                        {f.path}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setDiffFormat("unified")}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold",
                      diffFormat === "unified"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    )}
                    title="Unified diff"
                  >
                    Unified
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiffFormat("sideBySide")}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold",
                      diffFormat === "sideBySide"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    )}
                    title="Side-by-side diff"
                  >
                    Side
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-white/10">
                {(
                  [
                    ["diff", "Diff"],
                    ["snapshot", "Snapshot (Markdown)"],
                    ["raw", "Snapshot (Raw)"],
                    ["ledger", "Ledger"],
                    ["files", "Files"],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActiveTab(k)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold",
                      activeTab === k
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === "diff" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-slate-500">
                        {patchFiles.length} file{patchFiles.length === 1 ? "" : "s"} in patch
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadObjectAsJson(selectedCommit, `${selectedCommit.short}.json`)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Download className="h-4 w-4" /> Commit JSON
                        </span>
                      </button>
                    </div>

                    {patchFiles.map((pf, idx) => (
                      <div key={`${pf.pathA}-${pf.pathB}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30">
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
                          <div className="min-w-0">
                            <div className="text-xs font-mono text-slate-500">diff</div>
                            <div className="mt-1 font-mono text-sm text-slate-100 truncate">
                              {pf.pathA} → {pf.pathB}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          {pf.hunks.map((h, hi) => (
                            <div key={hi} className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                              <div className="px-3 py-2 text-xs font-mono text-slate-400 bg-white/5 border-b border-white/10">
                                {h.header}
                              </div>

                              {diffFormat === "unified" ? (
                                <pre className="p-3 overflow-auto text-xs font-mono leading-relaxed">
                                  {h.lines.map((l, li) => (
                                    <div
                                      key={li}
                                      className={clsx(
                                        "whitespace-pre",
                                        l.kind === "add"
                                          ? "bg-green-500/10 text-green-100"
                                          : l.kind === "del"
                                            ? "bg-rose-500/10 text-rose-100"
                                            : l.kind === "meta"
                                              ? "text-slate-500"
                                              : "text-slate-200"
                                      )}
                                    >
                                      {l.text}
                                    </div>
                                  ))}
                                </pre>
                              ) : (
                                <div className="grid grid-cols-2 gap-px bg-white/10">
                                  {hunkToSideBySideRows(h).map((row, ri) => {
                                    const cellCls = (c: SideCell) =>
                                      clsx(
                                        "min-w-0 px-3 py-1 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words",
                                        c.kind === "add"
                                          ? "bg-green-500/10 text-green-100"
                                          : c.kind === "del"
                                            ? "bg-rose-500/10 text-rose-100"
                                            : c.kind === "context"
                                              ? "bg-black/20 text-slate-200"
                                              : "bg-black/10 text-slate-500"
                                      );

                                    const lnCls = "select-none text-slate-500 text-[10px] pr-2";

                                    return (
                                      <React.Fragment key={ri}>
                                        <div className={cellCls(row.left)}>
                                          <span className={lnCls}>{row.left.lineNo ?? ""}</span>
                                          {row.left.text ?? ""}
                                        </div>
                                        <div className={cellCls(row.right)}>
                                          <span className={lnCls}>{row.right.lineNo ?? ""}</span>
                                          {row.right.text ?? ""}
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeTab === "snapshot" ? <MarkdownView markdown={snapshotMarkdown} /> : null}
                {activeTab === "raw" ? (
                  <pre className="rounded-2xl border border-white/10 bg-black/30 p-4 overflow-auto max-h-[72vh] text-xs font-mono text-slate-200">
                    {snapshotMarkdown}
                  </pre>
                ) : null}

                {activeTab === "ledger" ? (
                  <div className="space-y-3">
                    {!selectedCommit.review ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="font-black tracking-tight">Unreviewed commit</div>
                        <p className="mt-1 text-sm text-slate-400">
                          No manual change-groups have been logged for this commit yet. The chart counts it as bucket{" "}
                          <span className="font-mono">0</span>.
                        </p>
                      </div>
                    ) : (
                      <>
                        {(selectedCommit.review.groups || []).map((g, gi) => {
                          const conf = typeof g.confidence === "number" ? Math.max(0, Math.min(1, g.confidence)) : 0;
                          const confPct = Math.round(conf * 100);
                          const buckets = (g.buckets || []).filter((b) => b >= 0 && b <= 10) as BucketKey[];
                          return (
                            <div key={gi} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                  <div className="text-xs font-mono text-slate-500">Group {gi + 1}</div>
                                  <div className="mt-1 text-base font-black tracking-tight">
                                    {g.title || "Untitled"}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {(buckets.length ? buckets : ([10] as BucketKey[])).map((b) => (
                                      <BucketChip key={b} bucket={b} onClick={() => openBucketInfo(b)} />
                                    ))}
                                  </div>
                                </div>

                                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                                  <div className="text-[11px] font-mono text-slate-400">confidence</div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
                                      <div
                                        className="h-2 rounded-full"
                                        style={{ width: `${confPct}%`, background: "rgba(34,197,94,0.85)" }}
                                      />
                                    </div>
                                    <div className="text-xs font-mono text-slate-200">{confPct}%</div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 text-sm text-slate-300">
                                <div className="text-xs font-mono text-slate-500">Rationale</div>
                                <p className="mt-1">{g.rationale || ""}</p>
                              </div>

                              <div className="mt-3">
                                <div className="text-xs font-mono text-slate-500">Evidence ledger</div>
                                <ul className="mt-1 list-disc pl-5 space-y-1">
                                  {(g.evidence || []).length ? (
                                    (g.evidence || []).map((e, ei) => (
                                      <li key={ei} className="text-sm text-slate-300">
                                        {e}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-slate-400">(none)</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          );
                        })}

                        {(selectedCommit.review.notes || []).length ? (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="font-black tracking-tight">Notes / Open Questions</div>
                            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300">
                              {(selectedCommit.review.notes || []).map((n, ni) => (
                                <li key={ni}>{n}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}

                {activeTab === "files" ? (
                  <div className="grid gap-3">
                    {selectedCommit.numstat.map((ns) => (
                      <div key={ns.path} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-mono text-xs text-slate-500">{ns.path}</div>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-mono text-green-200">
                                +{ns.added || 0}
                              </span>
                              <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-rose-200">
                                -{ns.deleted || 0}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-mono text-slate-500">Δ {(ns.added || 0) + (ns.deleted || 0)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {distanceOut ? <div className="mt-4 text-[11px] text-slate-500 font-mono">{distanceOut}</div> : null}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Legend */}
      <DialogShell
        dialogRef={legendDialogRef}
        title="Legend (Revision Buckets)"
        subtitle="Tap a bucket to filter commits; chips open bucket details."
      >
        <div className="grid gap-2 md:grid-cols-2">
          {BUCKET_KEYS.map((b) => {
            const active = bucketFilter === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => {
                  toggleBucketFilter(b);
                  legendDialogRef.current?.close();
                }}
                className={clsx(
                  "w-full text-left rounded-2xl border border-white/10 px-4 py-3",
                  active ? "bg-green-500/10 ring-1 ring-green-400/40" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full" style={{ background: bucketColors[b] }} />
                  <div className="min-w-0">
                    <div className="font-black tracking-tight">
                      {b}. {bucketNames[b]}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{dataset.bucket_defs?.[String(b)] || ""}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DialogShell>

      {/* Bucket info */}
      <DialogShell
        dialogRef={bucketInfoDialogRef}
        title={bucketInfo !== null ? `${bucketInfo}. ${bucketNames[bucketInfo]}` : "Bucket"}
        subtitle={bucketInfoDesc}
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] font-mono text-slate-400">
              Filter: {bucketFilter === null ? "none" : `${bucketFilter}. ${bucketNames[bucketFilter]}`}
            </div>
            <div className="mt-1 text-xs text-slate-300">
              Tip: filtering isolates commits that include this category; clear via the pill in the header.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (bucketInfo === null) return;
                toggleBucketFilter(bucketInfo);
              }}
              className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 hover:bg-green-500/15"
            >
              <span className="inline-flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {bucketInfo !== null && bucketFilter === bucketInfo ? "Clear this filter" : "Filter commits"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                bucketInfoDialogRef.current?.close();
                openLegend();
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <Info className="h-4 w-4" />
                Open full legend
              </span>
            </button>
          </div>
        </div>
      </DialogShell>

      {/* Controls (mobile) */}
      <DialogShell
        dialogRef={controlsDialogRef}
        title="Controls"
        subtitle="Mobile-friendly controls for search, bucketing, metrics, and legend."
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commits…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/60"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <select
              value={bucketMode}
              onChange={(e) => setBucketMode(e.target.value as BucketMode)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
            >
              <option value="day">Bucket: Day</option>
              <option value="hour">Bucket: Hour</option>
              <option value="15m">Bucket: 15m</option>
              <option value="5m">Bucket: 5m</option>
            </select>

            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricKey)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
            >
              <option value="groups">Metric: Change-Groups</option>
              <option value="lines">Metric: Lines (+/-)</option>
              <option value="patchBytes">Metric: Patch Bytes</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                controlsDialogRef.current?.close();
                openLegend();
              }}
              className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 hover:bg-green-500/15"
            >
              Legend
            </button>
            <button
              type="button"
              onClick={() => downloadObjectAsJson(dataset, "frankentui_spec_evolution_dataset.json")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={() => {
                controlsDialogRef.current?.close();
                openCommits();
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Commits
            </button>
          </div>
        </div>
      </DialogShell>

      {/* Commits (mobile) */}
      <DialogShell dialogRef={commitsDialogRef} title="Commits" subtitle="Tap to select. Use Controls to search and filter.">
        <div className="max-h-[72vh] overflow-auto -mx-4">
          {filteredCommits.map((c) => (
            <button
              key={c.sha}
              type="button"
              onClick={() => {
                selectCommit(c.idx);
                commitsDialogRef.current?.close();
              }}
              className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500">{c.short}</span>
                    <span className="font-mono text-[11px] text-slate-500">{c.dateShort}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-100 truncate">{c.subject || ""}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {c.reviewed ? (
                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                      Reviewed
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      Unreviewed
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogShell>

      {/* Help */}
      <DialogShell dialogRef={helpDialogRef} title="Keyboard Shortcuts" subtitle="Designed for fast forensic browsing.">
        <div className="grid gap-2 text-sm text-slate-200">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono">← / →</span>
            <span className="text-slate-400">Previous / next commit</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono">?</span>
            <span className="text-slate-400">Open this dialog</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono">/</span>
            <span className="text-slate-400">Focus search (desktop)</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono">Esc</span>
            <span className="text-slate-400">Close dialogs</span>
          </div>
        </div>
      </DialogShell>
    </main>
  );
}

