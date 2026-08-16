interface HUDProps {
  totalBoxes: number;
  openedCount: number;
  rewardsRemaining: number;
  status: string;
}

export default function HUD({
  totalBoxes,
  openedCount,
  rewardsRemaining,
  status,
}: HUDProps) {
  const items = [
    { label: "TOTAL VAULTS", value: `${totalBoxes} BOXES` },
    { label: "OPENED", value: `${openedCount} / ${totalBoxes}` },
    { label: "PROMO REWARDS", value: `${rewardsRemaining} HIDDEN`, highlight: true },
    { label: "SYSTEM STATUS", value: status, isStatus: true },
  ];

  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass flex flex-col items-center justify-center rounded-xl p-2.5 sm:p-3 text-center"
        >
          <span
            className={`font-display text-sm sm:text-base font-bold ${
              item.highlight
                ? "text-[#FFA54A] filter drop-shadow-[0_0_8px_rgba(255,165,74,0.5)]"
                : item.isStatus
                ? "text-[#00E676] text-xs sm:text-sm"
                : "text-white"
            }`}
          >
            {item.value}
          </span>
          <span className="mt-1 font-mono text-[8px] sm:text-[9px] font-semibold tracking-wider text-white/40 uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
