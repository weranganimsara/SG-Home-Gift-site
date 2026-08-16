import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import { GAME_CONFIG } from "../game/config";

interface SessionEndScreenProps {
  wins: number;
  onRestart: () => void;
}

export default function SessionEndScreen({ wins, onRestart }: SessionEndScreenProps) {
  return (
    <div className="ambient-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <ParticlesBackground density={14} />
      <div className="noise-overlay" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8"
      >
        <div className="text-5xl">{wins > 0 ? "🏆" : "🎁"}</div>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">
          SESSION COMPLETE
        </h2>
        <p className="mt-3 text-sm text-white/60">
          {wins > 0
            ? `You unlocked ${wins} promo reward${wins > 1 ? "s" : ""} this session. Nice hunting!`
            : "No rewards this round — the campaign restocks boxes regularly. Come back soon!"}
        </p>
        <p className="mt-2 text-[11px] text-white/30">
          {GAME_CONFIG.totalBoxes} boxes • {GAME_CONFIG.winningBoxes} winners per campaign
        </p>
        <button
          onClick={onRestart}
          className="mt-7 w-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-5 py-3 font-display text-sm font-bold text-black shadow-[0_8px_30px_rgba(255,106,0,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          START NEW HUNT
        </button>
      </motion.div>
    </div>
  );
}
