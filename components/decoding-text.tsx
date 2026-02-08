"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function DecodingText({ 
  text, 
  className,
  delay = 0,
  duration = 0.8
}: { 
  text: string; 
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const characters = "01$!@#%^&*()_+{}:<>?[]|";

  const decode = useCallback((isScramble = false) => {
    let iteration = 0;
    const maxIterations = text.length;
    const interval = (duration * 1000) / (maxIterations * 3);

    const timer = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration && !isScramble) return char;
            if (char === " ") return " ";
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(timer);
        if (isScramble) setDisplayText(text);
      }
      iteration += 1 / 3;
    }, interval);

    return timer;
  }, [text, duration]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      timer = decode();
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [decode, delay]);

  return (
    <motion.span 
      className={className}
      onMouseEnter={() => decode(true)}
    >
      {displayText || text.split("").map(() => " ").join("")}
    </motion.span>
  );
}