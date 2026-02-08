import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "FrankenTUI War Stories — Battle Reports from the Front";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const headBuffer = readFileSync(join(process.cwd(), "franken_favicon.png"));
  const headUri = `data:image/png;base64,${headBuffer.toString("base64")}`;

  const bgBuffer = readFileSync(join(process.cwd(), "public", "screenshots", "visual_effects_clifford_attractor_og.png"));
  const bgUri = `data:image/png;base64,${bgBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#050202",
          position: "relative",
          overflow: "hidden",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Red Grid Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.5,
          }}
        />
        
        {/* Background Screenshot */}
        <img
          src={bgUri}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.2,
            filter: "sepia(1) hue-rotate(-50deg) contrast(1.5)",
          }}
        />

        {/* Framing */}
        <div style={{ position: "absolute", inset: "20px", border: "1px solid rgba(239, 68, 68, 0.1)", display: "flex" }} />

        {/* Content */}
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", padding: "80px", zIndex: 10 }}>
          <div style={{ display: "flex", position: "relative", marginRight: "60px" }}>
            <img src={headUri} alt="" width={280} height={280} style={{ borderRadius: "48px", border: "2px solid rgba(239, 68, 68, 0.3)", boxShadow: "0 0 60px rgba(239, 68, 68, 0.3)", filter: "grayscale(0.5) contrast(1.2)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <span style={{ fontSize: "14px", fontWeight: 900, color: "#ef4444", letterSpacing: "4px" }}>BATTLE_LOG_EXTRACT</span>
            </div>
            <div style={{ fontSize: "80px", fontWeight: 900, color: "white", lineHeight: 0.9, letterSpacing: "-4px", display: "flex", flexDirection: "column" }}>
              <span style={{ display: "flex" }}>War</span>
              <span style={{ display: "flex" }}>Stories.</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#f87171", marginTop: "24px", letterSpacing: "1px", textTransform: "uppercase" }}>
              Forensic analysis of critical system failures.
            </div>
          </div>
        </div>

        {/* Footer HUD */}
        <div style={{ position: "absolute", bottom: "40px", right: "40px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(239, 68, 68, 0.05)", padding: "8px 20px", borderRadius: "9999px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
          <span style={{ fontSize: "18px", fontWeight: 900, color: "#ef4444" }}>FRANKENTUI / WARS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
