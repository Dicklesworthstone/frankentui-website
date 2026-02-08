"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isOverFlashlightSection, setIsOverFlashlightSection] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        !!target.closest("button") ||
        !!target.closest("a");
        
      setIsPointer(isClickable);

      // Check for flashlight sections
      const isFlashlight = !!target.closest("[data-flashlight='true']");
      setIsOverFlashlightSection(isFlashlight);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
        <AnimatePresence>
          {isVisible && (
            <>
              {/* Flashlight Effect - Optimized using motion.div with static gradient */}
              {isOverFlashlightSection && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute h-[600px] w-[600px] rounded-full"
                  style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.85) 70%)",
                    boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.85)",
                  }}
                />
              )}

              {/* Outer Ring */}
              <motion.div
                className="absolute left-0 top-0 h-8 w-8 rounded-full border border-green-500/30 mix-blend-screen"
                style={{
                  x: cursorX,
                  y: cursorY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                animate={{
                  scale: isPointer ? 1.5 : isClicking ? 0.8 : 1,
                  borderColor: isPointer ? "rgba(74, 222, 128, 0.6)" : "rgba(74, 222, 128, 0.3)",
                }}
              />

              {/* Inner Dot */}
              <motion.div
                className="absolute left-0 top-0 h-1 w-1 rounded-full bg-green-400"
                style={{
                  x: mouseX,
                  y: mouseY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                animate={{
                  scale: isClicking ? 2.5 : 1,
                }}
              />

              {/* Crosshair lines */}
              {isPointer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute left-0 top-0 pointer-events-none"
                  style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                >
                  <div className="absolute top-[-10px] left-1/2 h-[5px] w-[1px] bg-green-500/50 -translate-x-1/2" />
                  <div className="absolute bottom-[-10px] left-1/2 h-[5px] w-[1px] bg-green-500/50 -translate-x-1/2" />
                  <div className="absolute left-[-10px] top-1/2 w-[5px] h-[1px] bg-green-500/50 -translate-y-1/2" />
                  <div className="absolute right-[-10px] top-1/2 w-[5px] h-[1px] bg-green-500/50 -translate-y-1/2" />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          body {
            cursor: none !important;
          }
          a, button, [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}