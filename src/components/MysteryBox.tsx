import { motion } from "framer-motion";
import { useState } from "react";
import type { BoxStatus } from "../game/types";

interface MysteryBoxProps {
  id: number;
  status: BoxStatus;
  disabled: boolean;
  isOpening: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export default function MysteryBox({
  id,
  status,
  disabled,
  isOpening,
  onSelect,
  onHover,
}: MysteryBoxProps) {
  const [hovered, setHovered] = useState(false);

  const formattedNum = id.toString().padStart(2, "0");
  const isOpened = status === "opened_win" || status === "opened_empty";
  const isPending = status === "pending";
  const isWin = status === "opened_win";

  let symbol = "🔒";
  let statusText = "LOCKED";

  if (isPending) {
    symbol = "⚡";
    statusText = "OPENING";
  } else if (isWin) {
    symbol = "💎";
    statusText = "WIN!";
  } else if (status === "opened_empty") {
    symbol = "✕";
    statusText = "EMPTY";
  }

  return (
    <motion.button
      type="button"
      disabled={disabled || isOpened}
      onClick={onSelect}
      onMouseEnter={() => {
        if (!isOpened) {
          setHovered(true);
          onHover();
        }
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        if (!isOpened) onHover();
      }}
      aria-label={`Mystery Vault #${formattedNum} - ${statusText}`}
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: isOpened && !isWin ? 0.35 : 1,
        scale: isPending || isOpening ? 1.06 : 1,
      }}
      whileHover={!disabled && !isOpened ? { y: -4, scale: 1.05 } : undefined}
      whileTap={!disabled && !isOpened ? { scale: 0.96 } : undefined}
      className={`group relative flex aspect-[1/1.15] w-full flex-col items-center justify-between rounded-xl p-2 sm:p-2.5 outline-none transition-all duration-300 ${
        isWin
          ? "border border-[#FFD166] bg-gradient-to-b from-[#2a1d0d] to-[#120e09] shadow-[0_0_15px_rgba(255,209,102,0.4)]"
          : isPending
          ? "border-2 border-[#FFA54A] bg-gradient-to-b from-[#2e1a0b] to-[#140b04] shadow-[0_0_20px_rgba(255,106,0,0.6)] animate-pulse"
          : isOpened
          ? "border border-white/5 bg-[#0d0d0d] cursor-default"
          : hovered
          ? "border border-[#FF6A00] bg-gradient-to-b from-[#222] to-[#101010] shadow-[0_0_18px_rgba(255,106,0,0.45)]"
          : "border border-white/10 bg-gradient-to-b from-[#1c1c1c] to-[#0d0d0d] shadow-md hover:border-[#FF6A00]/60"
      }`}
    >
      {/* Top Number */}
      <span
        className={`font-mono text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
          isWin
            ? "text-[#FFD166] bg-black/50"
            : isPending
            ? "text-white bg-[#FF6A00]/40"
            : "text-white/40 bg-black/40 group-hover:text-[#FFA54A]"
        }`}
      >
        #{formattedNum}
      </span>

      {/* Center Symbol */}
      <div className="relative my-0.5 flex items-center justify-center">
        <span
          className={`text-xl sm:text-2xl transition-transform duration-200 ${
            hovered && !isOpened ? "scale-115" : ""
          } ${isWin ? "filter drop-shadow-[0_0_8px_#FFD166]" : ""}`}
        >
          {symbol}
        </span>
      </div>

      {/* Bottom Status Tag */}
      <span
        className={`font-mono text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase ${
          isWin
            ? "text-[#FFD166]"
            : isPending
            ? "text-[#FFA54A]"
            : isOpened
            ? "text-white/20"
            : "text-[#FFA54A]/70 group-hover:text-[#FF6A00]"
        }`}
      >
        {statusText}
      </span>
    </motion.button>
  );
}
