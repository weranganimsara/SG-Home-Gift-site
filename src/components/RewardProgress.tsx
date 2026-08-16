import { GAME_CONFIG } from "../game/config";

interface RewardProgressProps {
  openedCount: number;
}

export default function RewardProgress({ openedCount }: RewardProgressProps) {
  const pct = Math.min(
    100,
    Math.round((openedCount / GAME_CONFIG.totalBoxes) * 100)
  );

  return (
    <div className="w-full max-w-xl">
      <div className="mb-1.5 flex items-center justify-between font-display text-[10px] font-semibold tracking-[0.25em] text-white/45">
        <span>REWARD HUNT</span>
        <span className="text-[#FFA54A]">
          {GAME_CONFIG.winningBoxes} SPECIAL REWARDS
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#181818] ring-1 ring-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-white/30">
        {openedCount} of {GAME_CONFIG.totalBoxes} boxes opened this campaign session.
        Odds are not affected by box position.
      </p>
    </div>
  );
}
