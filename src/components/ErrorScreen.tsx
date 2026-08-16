import { motion } from "framer-motion";

interface ErrorScreenProps {
  onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="ambient-bg flex min-h-screen w-full items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <div className="text-4xl">⚠️</div>
        <h2 className="mt-4 font-display text-xl font-bold text-white">
          SOMETHING WENT WRONG
        </h2>
        <p className="mt-3 text-sm text-white/60">
          We couldn&apos;t load your reward right now. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-5 py-3 font-display text-sm font-bold text-black shadow-[0_8px_30px_rgba(255,106,0,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          TRY AGAIN
        </button>
      </motion.div>
    </div>
  );
}
