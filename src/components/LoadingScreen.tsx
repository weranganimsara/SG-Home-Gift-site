import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const totalDuration = 1800;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        setReady(true);
        window.setTimeout(onDone, 500);
      }
    }, 40);
    return () => window.clearInterval(interval);
  }, [onDone]);

  return (
    <div className="ambient-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
      <ParticlesBackground density={16} />
      <div className="noise-overlay" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-[#252525]"
            aria-hidden="true"
          />
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#loadGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
            <defs>
              <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6A00" />
                <stop offset="100%" stopColor="#FFA54A" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-3xl">🎁</span>
        </div>

        <div className="text-center">
          <p className="font-display text-sm font-semibold tracking-[0.3em] text-[#FFA54A]">
            {ready ? "READY" : "INITIALIZING MYSTERY BOXES..."}
          </p>
          <p className="mt-2 font-display text-xs tracking-widest text-white/40">
            {progress}%
          </p>
        </div>
      </motion.div>
    </div>
  );
}
