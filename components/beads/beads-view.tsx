"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Binary, 
  Activity, 
  Cpu, 
  Shield, 
  Zap, 
  Search, 
  LayoutGrid, 
  Network, 
  List as ListIcon,
  Maximize2,
  ChevronRight,
  Clock,
  User,
  AlertTriangle
} from "lucide-react";
import { FrankenContainer, NeuralPulse } from "@/components/franken-elements";
import FrankenGlitch from "@/components/franken-glitch";
import { cn, formatDate } from "@/lib/utils";
import Script from "next/script";
import BeadHUD from "@/components/bead-hud";

// --- Types ---
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  issue_type: string;
  assignee: string;
  labels: string; // JSON string
  created_at: string;
  updated_at: string;
  blocks_count?: number;
  blocked_by_count?: number;
  triage_score?: number;
}

interface GraphData {
  nodes: any[];
  links: any[];
}

// --- Constants ---
const THEME = {
  bg: "#020a02",
  green: "#22c55e",
  emerald: "#10b981",
  slate: "#64748b",
  red: "#ef4444",
  amber: "#f59e0b",
  purple: "#a855f7"
};

const STATUS_COLORS: Record<string, string> = {
  open: THEME.green,
  in_progress: THEME.amber,
  blocked: THEME.red,
  closed: THEME.slate
};

// --- Helper Components ---

function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || THEME.green;
  return (
    <span 
      className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
      style={{ 
        color, 
        borderColor: `${color}40`,
        backgroundColor: `${color}10`
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// --- Main Component ---

export default function BeadsView() {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing System...");
  const [activeTab, setActiveTab] = useState<"dashboard" | "graph" | "issues">("dashboard");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [forceGraphLoaded, setForceGraphLoaded] = useState(false);
  
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reassemble database chunks
  const loadDatabase = useCallback(async () => {
    try {
      setLoadingMessage("Fetching Core Data...");
      const configResp = await fetch("/beads-viewer/beads.sqlite3.config.json");
      if (!configResp.ok) throw new Error("Failed to load database configuration.");
      const config = await configResp.json();
      
      const chunks = [];
      for (let i = 0; i < config.chunk_count; i++) {
        setLoadingMessage(`Downloading Neural Chunk ${i+1}/${config.chunk_count}...`);
        const chunkPath = `/beads-viewer/chunks/${String(i).padStart(5, '0')}.bin`;
        const response = await fetch(chunkPath);
        if (!response.ok) throw new Error(`Failed to download chunk ${i}.`);
        const buffer = await response.arrayBuffer();
        chunks.push(new Uint8Array(buffer));
      }

      setLoadingMessage("Stitching Synapses...");
      const totalSize = chunks.reduce((sum, c) => sum + c.length, 0);
      const combined = new Uint8Array(totalSize);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // @ts-ignore
      if (typeof window.initSqlJs !== "function") {
        throw new Error("SQL.js not loaded correctly.");
      }

      // @ts-ignore
      const SQL = await window.initSqlJs({
        locateFile: (file: string) => `/beads-viewer/vendor/${file}`
      });

      const database = new SQL.Database(combined);
      setDb(database);
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to load database:", err);
      setError(err.message || "Unknown system failure.");
      setLoadingMessage("CRITICAL_FAILURE: System corruption detected.");
      setLoading(false);
    }
  }, []);

  // Initialize data once DB is ready
  useEffect(() => {
    if (!db) return;

    const fetchInitialData = () => {
      try {
        // Stats
        const statusCounts = db.exec(`SELECT status, COUNT(*) as count FROM issues GROUP BY status`);
        const statsObj: any = {};
        if (statusCounts.length) {
          statusCounts[0].values.forEach((row: any) => {
            statsObj[row[0]] = row[1];
          });
        }
        
        const totalRes = db.exec(`SELECT COUNT(*) FROM issues`);
        if (totalRes.length) {
          statsObj.total = totalRes[0].values[0][0];
        }
        setStats(statsObj);

        // Issues for list
        const issuesResult = db.exec(`SELECT * FROM issues ORDER BY priority ASC, updated_at DESC LIMIT 50`);
        if (issuesResult.length) {
          const columns = issuesResult[0].columns;
          const rows = issuesResult[0].values.map((row: any) => {
            const obj: any = {};
            columns.forEach((col: string, i: number) => obj[col] = row[i]);
            return obj;
          });
          setIssues(rows);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchInitialData();
  }, [db]);

  const renderGraph = useCallback(() => {
    // @ts-ignore
    if (!db || !containerRef.current || activeTab !== "graph" || typeof window.ForceGraph !== "function") return;

    try {
      // Clear container first to avoid duplicate canvases
      containerRef.current.innerHTML = "";

      // Fetch graph data
      const nodesRes = db.exec(`SELECT id, title, status, priority FROM issues`);
      const linksRes = db.exec(`SELECT issue_id, depends_on_id FROM dependencies WHERE type = 'blocks'`);

      if (!nodesRes.length) return;

      const nodes = nodesRes[0].values.map((row: any) => ({
        id: row[0],
        title: row[1],
        status: row[2],
        priority: row[3],
        val: 5 - row[3] // Size based on priority
      }));

      const links = linksRes[0].values.map((row: any) => ({
        source: row[0],
        target: row[1]
      }));

      // @ts-ignore
      const Graph = window.ForceGraph()(containerRef.current)
        .graphData({ nodes, links })
        .nodeColor((node: any) => STATUS_COLORS[node.status] || THEME.green)
        .nodeLabel((node: any) => `${node.id}: ${node.title}`)
        .linkColor(() => "rgba(34, 197, 94, 0.2)")
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.005)
        .backgroundColor("rgba(0,0,0,0)")
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight)
        .onNodeClick((node: any) => {
          try {
            const result = db.exec(`SELECT * FROM issues WHERE id = ?`, [node.id]);
            if (result && result.length > 0 && result[0].values && result[0].values.length > 0) {
              const columns = result[0].columns;
              const row = result[0].values[0];
              const obj: any = {};
              columns.forEach((col: string, i: number) => obj[col] = row[i]);
              setSelectedIssue(obj);
            }
          } catch (err) {
            console.error("Failed to fetch issue details:", err);
          }
        });

      graphRef.current = Graph;
    } catch (err) {
      console.error("Graph render error:", err);
    }
  }, [db, activeTab, forceGraphLoaded]);

  useEffect(() => {
    // If script is already loaded (e.g. navigation back), onLoad might not fire
    // @ts-ignore
    if (window.initSqlJs && loading && !db) {
      loadDatabase();
    }
  }, [loading, db, loadDatabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full bg-black/40 rounded-3xl border border-green-500/10 backdrop-blur-xl overflow-hidden relative">
        <Script 
          src="/beads-viewer/vendor/sql-wasm.js" 
          onLoad={loadDatabase}
        />
        <Script 
          src="/beads-viewer/vendor/force-graph.min.js" 
          onLoad={() => setForceGraphLoaded(true)}
        />
        <NeuralPulse />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative h-24 w-24 mb-8"
        >
          <div className="absolute inset-0 border-4 border-green-500/20 rounded-full" />
          <div className="absolute inset-0 border-t-4 border-green-500 rounded-full animate-spin" />
          <Binary className="absolute inset-0 m-auto h-8 w-8 text-green-500" />
        </motion.div>
        <p className={cn("text-sm font-black uppercase tracking-[0.4em]", error ? "text-red-500" : "text-green-500 animate-pulse")}>
          {loadingMessage}
        </p>
        {error && (
          <p className="mt-4 text-xs text-red-400 font-mono max-w-md text-center">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full min-h-[800px]">
      {/* Scripts already handled in loading state, but included here for completeness if loading starts as false */}
      <Script 
        src="/beads-viewer/vendor/sql-wasm.js" 
        onLoad={loadDatabase}
      />
      <Script 
        src="/beads-viewer/vendor/force-graph.min.js" 
        onLoad={() => setForceGraphLoaded(true)}
      />

      {/* --- Header / Tabs --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "dashboard" ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "text-slate-400 hover:text-white"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            DASHBOARD
          </button>
          <button 
            onClick={() => setActiveTab("graph")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "graph" ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "text-slate-400 hover:text-white"
            )}
          >
            <Network className="h-4 w-4" />
            GRAPH_ENGINE
          </button>
          <button 
            onClick={() => setActiveTab("issues")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "issues" ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "text-slate-400 hover:text-white"
            )}
          >
            <ListIcon className="h-4 w-4" />
            ISSUE_LEDGER
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-green-500 transition-colors" />
          <input 
            type="text"
            placeholder="FILTER_ARCHIVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-green-500/50 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {/* --- Views --- */}
      <div className="flex-1 relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Stats Cards */}
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats || {}).map(([key, value]: [string, any]) => (
                  <FrankenContainer key={key} withPulse={true} className="p-6 bg-black/20 border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{key}</span>
                    <p className="text-3xl font-black text-white mt-2 tabular-nums">{value}</p>
                    <div 
                      className="mt-4 h-1 w-full rounded-full overflow-hidden bg-white/5"
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(value / (stats?.total || 1)) * 100}%` }}
                        className="h-full"
                        style={{ backgroundColor: STATUS_COLORS[key] || THEME.green }}
                      />
                    </div>
                  </FrankenContainer>
                ))}
              </div>

              {/* Quick Wins */}
              <div className="md:col-span-2 space-y-6">
                <FrankenGlitch trigger="hover" intensity="low">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Zap className="h-5 w-5 text-green-500" />
                    Priority_Unblocks
                  </h3>
                </FrankenGlitch>
                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue) => (
                    <motion.div 
                      key={issue.id}
                      whileHover={{ x: 10 }}
                      onClick={() => setSelectedIssue(issue)}
                      className="group cursor-pointer p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-green-500/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center justify-center font-mono text-xs text-green-500">
                          {issue.id.split('-')[1]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">{issue.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-600 uppercase">{issue.issue_type}</span>
                            <StatusPill status={issue.status} />
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-green-500 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Sidebar */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-500" />
                  Synaptic_Log
                </h3>
                <div className="p-6 rounded-2xl border border-white/5 bg-black/40 space-y-6">
                  {issues.slice(5, 10).map((issue) => (
                    <div key={issue.id} className="relative pl-6 border-l border-white/10">
                      <div className="absolute left-[-4.5px] top-0 h-2 w-2 rounded-full bg-green-500/40" />
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{formatDate(issue.updated_at)}</p>
                      <h5 className="text-xs font-bold text-slate-300 line-clamp-1">{issue.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "graph" && (
            <motion.div 
              key="graph"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 w-full h-full min-h-[700px] bg-black/40 rounded-3xl border border-white/5 overflow-hidden"
            >
              <NeuralPulse />
              <div ref={containerRef} className="w-full h-full" />
              
              {/* Graph Overlay HUD */}
              <div className="absolute top-6 left-6 pointer-events-none space-y-2">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/5 border-l-green-500 border-l-2">
                  <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE_RENDER_ACTIVE</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/5">
                  <Cpu className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FPS: 60</span>
                </div>
              </div>

              {/* Graph Controls */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-auto">
                <button 
                  onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 400)}
                  className="h-10 w-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-green-500 hover:text-black transition-all shadow-xl"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => graphRef.current?.zoomToFit(400, 50)}
                  className="h-10 w-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-green-500 hover:text-black transition-all shadow-xl"
                >
                  <Network className="h-4 w-4" />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/5 shadow-2xl">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color }} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "issues" && (
            <motion.div 
              key="issues"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid gap-3">
                {issues.map((issue) => (
                  <button 
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="text-left focus:outline-none"
                  >
                    <FrankenContainer withStitches={false} withPulse={true} className="p-5 bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-green-500/20 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-6 relative z-10">
                        <span className="font-mono text-xs text-slate-600 group-hover:text-green-500 transition-colors w-16">{issue.id}</span>
                        <div className="h-8 w-px bg-white/5 hidden md:block" />
                        <div>
                          <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">{issue.title}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <StatusPill status={issue.status} />
                            <span className="text-[10px] font-black text-slate-600 uppercase">{issue.issue_type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-slate-600 uppercase">ASSIGNEE</span>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <User className="h-3 w-3" />
                            {issue.assignee || "UNASSIGNED"}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-green-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    </FrankenContainer>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Issue Detail Modal --- */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full overflow-hidden"
            >
              <FrankenContainer withPulse={true} className="bg-[#020a02] border-green-500/20 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-8 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-green-500 text-black text-[10px] font-black uppercase tracking-widest">{selectedIssue.id}</span>
                      <StatusPill status={selectedIssue.status} />
                    </div>
                    <FrankenGlitch trigger="always" intensity="low">
                      <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{selectedIssue.title}</h2>
                    </FrankenGlitch>
                  </div>
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <LayoutGrid className="h-6 w-6 rotate-45" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h4 className="text-[10px] font-black text-green-500/60 uppercase tracking-[0.3em] mb-4">Description</h4>
                        <div className="text-slate-400 text-lg leading-relaxed font-medium">
                          {selectedIssue.description || "No description available for this synapse."}
                        </div>
                      </div>

                      {/* Technical Detail Table */}
                      <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-4 bg-black/40">
                          <span className="text-[9px] font-black text-slate-600 uppercase">PRIORITY</span>
                          <p className="text-sm font-bold text-white mt-1">P{selectedIssue.priority}</p>
                        </div>
                        <div className="p-4 bg-black/40">
                          <span className="text-[9px] font-black text-slate-600 uppercase">TYPE</span>
                          <p className="text-sm font-bold text-white mt-1 capitalize">{selectedIssue.issue_type}</p>
                        </div>
                        <div className="p-4 bg-black/40">
                          <span className="text-[9px] font-black text-slate-600 uppercase">SYNAPSE_BORN</span>
                          <p className="text-sm font-bold text-white mt-1">{formatDate(selectedIssue.created_at)}</p>
                        </div>
                        <div className="p-4 bg-black/40">
                          <span className="text-[9px] font-black text-slate-600 uppercase">LAST_ACTIVITY</span>
                          <p className="text-sm font-bold text-white mt-1">{formatDate(selectedIssue.updated_at)}</p>
                        </div>
                      </div>

                      {/* Labels / Tags */}
                      {selectedIssue.labels && (
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            try {
                              const labels = JSON.parse(selectedIssue.labels);
                              return Array.isArray(labels) ? labels.map((l: string) => (
                                <span key={l} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{l}</span>
                              )) : null;
                            } catch { return null; }
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      {/* Sidebar Detail */}
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-4">ASSIGNEE</span>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-black font-black uppercase shadow-lg shadow-green-500/20">
                              {selectedIssue.assignee ? selectedIssue.assignee[0] : "?"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{selectedIssue.assignee || "Unassigned"}</p>
                              <p className="text-[10px] font-black text-green-500/60 uppercase">CORE_ENGINEER</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-4">DEPENDENCIES</span>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400">Blocks</span>
                              <span className="text-xs font-mono text-green-500">{selectedIssue.blocks_count || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400">Blocked By</span>
                              <span className="text-xs font-mono text-red-500">{selectedIssue.blocked_by_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>Protocol_Secure</span>
                  </div>
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    CLOSE_PORTAL
                  </button>
                </div>
              </FrankenContainer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.4);
        }
      `}</style>
    </div>
  );
}
