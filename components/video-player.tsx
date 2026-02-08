"use client";

import { useRef, useState, useCallback } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/content";
import { FrankenContainer } from "./franken-elements";

export default function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startPlayback = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setHasStarted(true);
    } catch (err) {
      console.error("Playback failed", err);
    }
  }, []);

  return (
    <FrankenContainer
      withBolts={false}
      className="group relative overflow-hidden glass-modern border-white/5 hover:border-green-500/20 transition-all duration-500 w-full"
    >
      <div className="relative bg-black overflow-hidden">
        <video
          ref={videoRef}
          preload="metadata"
          poster={video.poster}
          playsInline
          controls={hasStarted}
          className="w-full block"
          onEnded={() => setHasStarted(false)}
        >
          {video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>

        {/* Play button overlay — only visible before first play */}
        {!hasStarted && (
          <button
            type="button"
            onClick={startPlayback}
            aria-label={`Play video: ${video.title}`}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 cursor-pointer transition-colors hover:bg-black/20"
          >
            <div className="h-20 w-20 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] transition-transform hover:scale-110 active:scale-95">
              <Play className="h-8 w-8 fill-current translate-x-1" />
            </div>
          </button>
        )}
      </div>

      <div className="px-6 py-5 text-left">
        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors tracking-tight">
          {video.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {video.description}
        </p>
      </div>
    </FrankenContainer>
  );
}
