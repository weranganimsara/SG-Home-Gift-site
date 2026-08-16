import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { GAME_CONFIG } from "../game/config";
import type { RevealResult } from "../game/types";
import { soundEngine } from "../game/sound";

interface RewardModalProps {
  result: RevealResult;
  onTryAnother: () => void;
  onClaim: () => void;
  attemptsLeft: number;
  claimed: boolean;
  onCopied?: () => void;
}

export default function RewardModal({
  result,
  onTryAnother,
  onClaim,
  attemptsLeft,
  claimed,
  onCopied,
}: RewardModalProps) {
  const [copied, setCopied] = useState(false);
  const firedConfetti = useRef(false);

  useEffect(() => {
    if (result.win && !firedConfetti.current) {
      firedConfetti.current = true;
      soundEngine.play("victory");

      const colors = ["#FF6A00", "#FFA54A", "#FFFFFF", "#FFD580"];
      const duration = 2200;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.6 },
          colors,
          scalar: 0.9,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.6 },
          colors,
          scalar: 0.9,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.4 },
        colors,
        startVelocity: 45,
        scalar: 1.1,
      });
    } else if (!result.win) {
      soundEngine.play("reveal");
    }
  }, [result.win]);

  const handleCopy = async () => {
    if (!result.promo) return;
    try {
      await navigator.clipboard.writeText(result.promo.code);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement("textarea");
      el.value = result.promo.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    soundEngine.play("copy");
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleUseCode = () => {
    onClaim();
    window.open(result.promo?.link ?? GAME_CONFIG.paidSiteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial burst backdrop */}
      {result.win && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[60vmin] w-[60vmin] animate-pulse rounded-full bg-[#FF6A00]/20 blur-[120px]" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-6 text-center sm:p-9"
        role="dialog"
        aria-modal="true"
        aria-label={result.win ? "You won a promo code" : "Empty mystery box"}
      >
        {result.win ? (
          <>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
              className="text-5xl sm:text-6xl"
            >
              🎉
            </motion.div>
            <h2 className="text-glow mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              YOU WON!
            </h2>
            <p className="mt-3 font-display text-xs font-semibold tracking-[0.25em] text-[#FFA54A]">
              YOUR EXCLUSIVE PROMO CODE
            </p>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "backOut" }}
              className="pulse-glow animated-border relative mx-auto mt-4 flex max-w-xs items-center justify-center rounded-2xl bg-gradient-to-br from-[#181818] to-[#0e0e0e] px-6 py-5"
            >
              <span className="font-display text-2xl font-extrabold tracking-[0.15em] text-[#FFA54A] sm:text-3xl">
                {result.promo?.code}
              </span>
            </motion.div>
            <p className="mt-3 text-sm text-white/60">
              Save <span className="font-semibold text-white">{result.promo?.discount}</span> on
              your purchase.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCopy}
                className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-display text-sm font-semibold text-white transition-all hover:border-[#FFA54A]/50 hover:bg-white/10 active:scale-95"
              >
                {copied ? "✓ COPIED!" : "📋 COPY CODE"}
              </button>
              <button
                onClick={handleUseCode}
                className="flex-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-5 py-3 font-display text-sm font-bold text-black shadow-[0_8px_30px_rgba(255,106,0,0.4)] transition-transform hover:scale-[1.03] active:scale-95"
              >
                🚀 USE PROMO CODE
              </button>
            </div>
            {claimed && (
              <p className="mt-4 text-[11px] text-white/40">
                Reward marked as claimed for this session.
              </p>
            )}
            <button
              onClick={onTryAnother}
              className="mt-5 text-xs font-medium text-white/45 underline decoration-white/15 underline-offset-4 transition-colors hover:text-[#FFA54A]"
            >
              {attemptsLeft > 0 ? "Continue hunting →" : "Finish session →"}
            </button>
          </>
        ) : (
          <>
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="text-5xl sm:text-6xl"
            >
              😮
            </motion.div>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              OH! MYSTERY BOX
            </h2>
            <p className="mt-3 text-sm text-white/60">
              This box was empty... but don&apos;t give up!
            </p>
            <p className="mt-1 text-xs text-white/35">
              {attemptsLeft > 0
                ? `${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining this session.`
                : "You've used all attempts for this session."}
            </p>

            <button
              onClick={onTryAnother}
              className="mt-7 w-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-5 py-3 font-display text-sm font-bold text-black shadow-[0_8px_30px_rgba(255,106,0,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              {attemptsLeft > 0 ? "TRY ANOTHER BOX" : "BACK TO BOXES"}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
