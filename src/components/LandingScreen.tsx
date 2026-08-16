import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import { GAME_CONFIG } from "../game/config";

interface LandingScreenProps {
  onPlay: () => void;
  onHowToPlay: () => void;
}

export default function LandingScreen({ onPlay, onHowToPlay }: LandingScreenProps) {
  return (
    <div className="ambient-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
      <ParticlesBackground density={26} />
      <div className="noise-overlay" />

      {/* Floating glow orbs */}
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#FFA54A]/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="gentle-float text-6xl sm:text-7xl"
          aria-hidden="true"
        >
          🎁
        </motion.div>

        <h1 className="text-glow mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
          50 MYSTERY BOXES
        </h1>

        <p className="mt-5 max-w-lg text-balance text-base text-white/70 sm:text-lg">
          Pick 1 of 3 mystery boxes and discover your exclusive reward.
        </p>

        <p className="mt-3 font-display text-xs font-medium tracking-[0.2em] text-[#FFA54A]/80 sm:text-sm">
          10 SPECIAL PROMO REWARDS ARE HIDDEN INSIDE 50 MYSTERY BOXES.
        </p>

        <motion.button
          onClick={onPlay}
          whileHover={{ scale: 1.045 }}
          whileTap={{ scale: 0.97 }}
          className="animated-border pulse-glow group relative mt-10 overflow-hidden rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-12 py-4 font-display text-lg font-bold tracking-wide text-black shadow-[0_10px_40px_rgba(255,106,0,0.35)] transition-transform focus-visible:outline-white"
        >
          <span className="relative z-10">PLAY NOW</span>
          <span className="shimmer-sweep absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-sm" />
        </motion.button>

        <p className="mt-6 font-display text-xs font-semibold tracking-[0.35em] text-white/40">
          50 BOXES • 10 REWARDS • 1 LUCKY PICK
        </p>

        <button
          onClick={onHowToPlay}
          className="mt-8 text-xs font-medium text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#FFA54A]"
        >
          How does it work?
        </button>
      </motion.div>

      <p className="relative z-10 mt-14 max-w-md text-center text-[11px] leading-relaxed text-white/30">
        Rewards are promotional codes. Availability is limited and controlled by the
        campaign — {GAME_CONFIG.totalBoxes} boxes, {GAME_CONFIG.winningBoxes} winners.
      </p>
    </div>
  );
}
