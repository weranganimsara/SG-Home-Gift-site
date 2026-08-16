import { AnimatePresence, motion } from "framer-motion";
import { GAME_CONFIG } from "../game/config";
import type { UseGameReturn } from "../game/useGame";
import MysteryBox from "./MysteryBox";
import HUD from "./HUD";
import RewardProgress from "./RewardProgress";
import Countdown from "./Countdown";
import SponsorLinks from "./SponsorLinks";
import RewardModal from "./RewardModal";
import { soundEngine } from "../game/sound";

interface GameScreenProps {
  game: UseGameReturn;
  onHowToPlay: () => void;
}

export default function GameScreen({ game, onHowToPlay }: GameScreenProps) {
  const {
    phase,
    boxes,
    pendingBoxId,
    result,
    claimed,
    boxesAvailable,
    openedBoxesCount,
    remainingWinningCount,
    selectBox,
    tryAnotherBox,
    claimReward,
  } = game;

  const isOpening = phase === "OPENING";
  const isRevealing = phase === "REWARD_REVEAL";
  
  const statusLabel = isOpening
    ? "OPENING"
    : pendingBoxId !== null
    ? `PENDING #${pendingBoxId.toString().padStart(2, "0")}`
    : isRevealing
    ? result?.win
      ? "WON"
      : "EMPTY"
    : "READY";

  const pendingFormatted = pendingBoxId ? pendingBoxId.toString().padStart(2, "0") : "--";

  return (
    <div className="ambient-bg relative flex min-h-screen w-full flex-col items-center px-3 pb-12 pt-6 sm:px-6">
      <div className="noise-overlay" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-5">
        {/* Game Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FFA54A] font-mono text-[10px] font-bold tracking-widest uppercase mb-2">
            ✨ 50 LIVE VAULTS • 10 WINNING PROMO CODES
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
            🎁 50 MYSTERY BOXES
          </h1>
          <p className="mt-1 font-mono text-xs font-semibold tracking-wider text-[#FFA54A]/80">
            CLICK ANY BOX TO UNLOCK • RETURN TO THIS TAB TO REVEAL
          </p>
        </div>

        {/* Global HUD Stats */}
        <HUD
          totalBoxes={GAME_CONFIG.totalBoxes}
          openedCount={openedBoxesCount}
          rewardsRemaining={remainingWinningCount}
          status={statusLabel}
        />

        {/* Unlock Pending Banner */}
        {pendingBoxId !== null && phase === "PICK_BOX" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FF6A00]/25 via-[#FFA54A]/10 to-[#FF6A00]/25 border-2 border-[#FFA54A] shadow-[0_0_25px_rgba(255,106,0,0.5)] animate-pulse"
          >
            <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-[#FFA54A] animate-spin flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                VAULT #{pendingFormatted} UNLOCKING IN PROGRESS...
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-[#FFA54A]">
                Visiting sponsor partner. Switch back to this tab to reveal your reward!
              </span>
            </div>
          </motion.div>
        )}

        {/* Optional Countdown */}
        {GAME_CONFIG.countdownEnabled && (
          <Countdown endsAt={GAME_CONFIG.countdownEndsAt} />
        )}

        {/* Progress bar */}
        <RewardProgress openedCount={openedBoxesCount} />

        {/* 50 Mystery Boxes Live Grid */}
        <div className="w-full mt-2">
          <div
            className={`grid w-full grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 transition-all duration-300 ${
              isOpening ? "brightness-50 pointer-events-none" : ""
            }`}
          >
            {boxes.map((box) => {
              const isSelected = pendingBoxId === box.id;
              return (
                <MysteryBox
                  key={box.id}
                  id={box.id}
                  status={box.status}
                  disabled={phase !== "PICK_BOX"}
                  isOpening={isOpening && isSelected}
                  onSelect={() => selectBox(box.id)}
                  onHover={() => soundEngine.play("hover")}
                />
              );
            })}
          </div>
        </div>

        {/* How to Play CTA */}
        <button
          onClick={onHowToPlay}
          className="mt-2 text-xs font-medium text-white/45 underline decoration-white/15 underline-offset-4 transition-colors hover:text-[#FFA54A]"
        >
          How does the 50-vault hunt work?
        </button>

        {/* Sponsor & Partner Offers */}
        <SponsorLinks />
      </div>

      {/* Cinematic Opening Overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="box-shake relative flex flex-col items-center gap-4 text-center">
              <div className="pulse-glow flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-[#FF6A00] bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] sm:h-40 sm:w-40 shadow-[0_0_50px_rgba(255,106,0,0.8)]">
                <span className="text-5xl animate-bounce">🎁</span>
              </div>
              <p className="font-display text-sm font-bold tracking-[0.25em] text-[#FFA54A] animate-pulse">
                DECRYPTING VAULT #{pendingFormatted}...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Reveal Modal */}
      <AnimatePresence>
        {isRevealing && result && (
          <RewardModal
            result={result}
            attemptsLeft={boxesAvailable}
            claimed={claimed}
            onTryAnother={tryAnotherBox}
            onClaim={claimReward}
            onCopied={() => window.dispatchEvent(new Event("promo-copied"))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
