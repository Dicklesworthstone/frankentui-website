"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { FrankenBolt } from "./franken-elements";

type TokenKind =
  | "plain"
  | "keyword"
  | "type"
  | "macro"
  | "number"
  | "func"
  | "path"
  | "string"
  | "comment"
  | "special";

type Token = { kind: TokenKind; text: string };

const KEYWORDS = new Set([
  "use",
  "fn",
  "let",
  "mut",
  "match",
  "impl",
  "struct",
  "enum",
  "pub",
  "self",
  "type",
  "mod",
  "where",
  "for",
  "in",
  "if",
  "else",
  "return",
  "const",
  "static",
  "trait",
  "derive",
  "cfg",
  "async",
  "await",
  "move",
  "crate",
  "super",
]);

const TYPES = new Set([
  "Self",
  "Cmd",
  "Event",
  "Msg",
  "Rect",
  "Frame",
  "Paragraph",
  "App",
  "ScreenMode",
  "Model",
  "u64",
  "u32",
  "u16",
  "u8",
  "usize",
  "i64",
  "i32",
  "isize",
  "bool",
  "str",
  "String",
  "Vec",
  "Box",
  "Option",
  "Result",
]);

const SPECIALS = new Set(["true", "false", "None", "Some", "Ok", "Err"]);

const MACROS = new Set([
  "format",
  "println",
  "eprintln",
  "dbg",
  "vec",
  "panic",
  "todo",
  "unreachable",
  "cfg",
  "derive",
]);

const CODE_TOKEN_RE =
  /::|\b(?:format|println|eprintln|dbg|vec|panic|todo|unreachable|cfg|derive)!|\b(?:use|fn|let|mut|match|impl|struct|enum|pub|self|type|mod|where|for|in|if|else|return|const|static|trait|derive|cfg|async|await|move|crate|super)\b|\b(?:Self|Cmd|Event|Msg|Rect|Frame|Paragraph|App|ScreenMode|Model|u64|u32|u16|u8|usize|i64|i32|isize|bool|str|String|Vec|Box|Option|Result|true|false|None|Some|Ok|Err)\b|\b\d+\b|\b[a-z_][a-z0-9_]*\b(?=\s*\()/g;

function tokenizeCodeSegment(segment: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  CODE_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CODE_TOKEN_RE.exec(segment)) !== null) {
    const start = m.index;
    const text = m[0];

    if (start > lastIndex) {
      tokens.push({ kind: "plain", text: segment.slice(lastIndex, start) });
    }

    if (text === "::") {
      tokens.push({ kind: "path", text });
    } else if (text.endsWith("!")) {
      const name = text.slice(0, -1);
      tokens.push({ kind: MACROS.has(name) ? "macro" : "plain", text });
    } else if (/^\d+$/.test(text)) {
      tokens.push({ kind: "number", text });
    } else if (SPECIALS.has(text)) {
      tokens.push({ kind: "special", text });
    } else if (KEYWORDS.has(text)) {
      tokens.push({ kind: "keyword", text });
    } else if (TYPES.has(text)) {
      tokens.push({ kind: "type", text });
    } else {
      tokens.push({ kind: "func", text });
    }

    lastIndex = start + text.length;
  }

  if (lastIndex < segment.length) {
    tokens.push({ kind: "plain", text: segment.slice(lastIndex) });
  }

  return tokens;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];

  let i = 0;
  let start = 0;
  let inString = false;
  let stringStart = 0;

  while (i < line.length) {
    const ch = line[i];
    const next = i + 1 < line.length ? line[i + 1] : "";

    if (!inString) {
      if (ch === "/" && next === "/") {
        if (i > start) {
          tokens.push(...tokenizeCodeSegment(line.slice(start, i)));
        }
        tokens.push({ kind: "comment", text: line.slice(i) });
        return tokens;
      }

      if (ch === "\"") {
        if (i > start) {
          tokens.push(...tokenizeCodeSegment(line.slice(start, i)));
        }
        inString = true;
        stringStart = i;
        i += 1;
        continue;
      }

      i += 1;
      continue;
    }

    // in string
    if (ch === "\\") {
      i += 2;
      continue;
    }

    if (ch === "\"") {
      tokens.push({ kind: "string", text: line.slice(stringStart, i + 1) });
      inString = false;
      start = i + 1;
      i += 1;
      continue;
    }

    i += 1;
  }

  if (inString) {
    tokens.push({ kind: "string", text: line.slice(stringStart) });
    return tokens;
  }

  if (start < line.length) {
    tokens.push(...tokenizeCodeSegment(line.slice(start)));
  }

  return tokens;
}

function tokenClass(kind: TokenKind): string {
  switch (kind) {
    case "string":
      return "text-lime-300";
    case "comment":
      return "text-slate-600";
    case "keyword":
      return "text-green-400 font-semibold";
    case "type":
      return "text-emerald-300";
    case "macro":
      return "text-yellow-300";
    case "number":
      return "text-amber-300";
    case "func":
      return "text-blue-300";
    case "path":
      return "text-slate-500";
    case "special":
      return "text-orange-300";
    default:
      return "";
  }
}

export default function RustCodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const tokenLines = useMemo(() => code.split("\n").map(tokenizeLine), [code]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 group">
      {/* Corner bolts */}
      <FrankenBolt className="absolute -left-1 -top-1 z-20 scale-75 opacity-20 transition-opacity group-hover:opacity-100" />
      <FrankenBolt className="absolute -right-1 -top-1 z-20 scale-75 opacity-20 transition-opacity group-hover:opacity-100" />
      <FrankenBolt className="absolute -left-1 -bottom-1 z-20 scale-75 opacity-20 transition-opacity group-hover:opacity-100" />
      <FrankenBolt className="absolute -right-1 -bottom-1 z-20 scale-75 opacity-20 transition-opacity group-hover:opacity-100" />

      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          {title && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Terminal className="h-3.5 w-3.5" />
              {title}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 font-mono text-sm leading-relaxed text-slate-300">
          <code>
            {tokenLines.map((lineTokens, i) => (
              <span key={i} className="flex">
                <span className="mr-4 inline-block w-8 select-none text-right text-xs text-slate-700">
                  {i + 1}
                </span>
                <span>
                  {lineTokens.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    lineTokens.map((t, j) => (
                      <span key={j} className={tokenClass(t.kind)}>
                        {t.text}
                      </span>
                    ))
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
