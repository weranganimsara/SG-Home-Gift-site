import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import LandingScreen from "./components/LandingScreen";
import GameScreen from "./components/GameScreen";
import ErrorScreen from "./components/ErrorScreen";
import SessionEndScreen from "./components/SessionEndScreen";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import { useGame } from "./game/useGame";
import { GAME_CONFIG } from "./game/config";
import { soundEngine } from "./game/sound";

type ModalKind = "how-to-play" | "reward-info" | "rules" | null;

export default function App() {
  const game = useGame();
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [soundOn, setSoundOn] = useState(GAME_CONFIG.soundEnabled);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    soundEngine.setEnabled(soundOn);
  }, [soundOn]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const handlePlay = useCallback(() => {
    soundEngine.unlock();
    soundEngine.play("click");
    game.startGame();
  }, [game]);

  const toggleSound = () => {
    soundEngine.unlock();
    setSoundOn((v) => !v);
  };

  const showChrome =
    game.phase !== "LOADING" && game.phase !== "ERROR";

  return (
    <div className="relative min-h-screen w-full bg-[#050505] font-body text-white">
      {/* Global top toolbar */}
      {showChrome && (
        <div className="fixed right-3 top-3 z-40 flex items-center gap-2 sm:right-5 sm:top-5">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            aria-pressed={soundOn}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm text-white/80 transition-colors hover:text-[#FFA54A]"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => setActiveModal("reward-info")}
            aria-label="Reward info"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm text-white/80 transition-colors hover:text-[#FFA54A]"
          >
            🎁
          </button>
          <button
            onClick={() => setActiveModal("how-to-play")}
            aria-label="How to play"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white/80 transition-colors hover:text-[#FFA54A]"
          >
            ?
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {game.phase === "LOADING" && (
          <motion.div key="loading" exit={{ opacity: 0 }}>
            <LoadingScreen onDone={game.finishLoading} />
          </motion.div>
        )}

        {game.phase === "LANDING" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen flex-col"
          >
            <div className="flex-1">
              <LandingScreen
                onPlay={handlePlay}
                onHowToPlay={() => setActiveModal("how-to-play")}
              />
            </div>
            <Footer onOpenRules={() => setActiveModal("rules")} />
          </motion.div>
        )}

        {(game.phase === "PICK_BOX" ||
          game.phase === "OPENING" ||
          game.phase === "REWARD_REVEAL") && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen flex-col"
          >
            <div className="flex-1">
              <GameScreen
                game={game}
                onHowToPlay={() => setActiveModal("how-to-play")}
              />
            </div>
            <Footer onOpenRules={() => setActiveModal("rules")} />
          </motion.div>
        )}

        {game.phase === "CLAIMED" && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen flex-col"
          >
            <div className="flex-1">
              <SessionEndScreen wins={game.winsCount} onRestart={game.restartSession} />
            </div>
            <Footer onOpenRules={() => setActiveModal("rules")} />
          </motion.div>
        )}

        {game.phase === "ERROR" && (
          <motion.div key="error" exit={{ opacity: 0 }}>
            <ErrorScreen onRetry={game.retryFromError} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global reward-reveal copy toast hook */}
      <RewardCopyToastBridge onToast={showToast} />

      <Toast message={toast} />

      <Modal
        open={activeModal === "how-to-play"}
        onClose={() => setActiveModal(null)}
        title="HOW TO PLAY"
        icon="🕹️"
      >
        <ol className="list-decimal space-y-2 pl-5">
          <li>Start the Mystery Hunt.</li>
          <li>Pick one of three boxes.</li>
          <li>Open your mystery reward.</li>
          <li>If you win, copy your promo code.</li>
          <li>Use the code on the paid website.</li>
        </ol>
        <button
          onClick={() => setActiveModal(null)}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FFA54A] px-5 py-3 font-display text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
        >
          GOT IT
        </button>
      </Modal>

      <Modal
        open={activeModal === "reward-info"}
        onClose={() => setActiveModal(null)}
        title="REWARD INFO"
        icon="🎁"
      >
        <p>
          Rewards are promotional discount codes tied to this campaign. There are{" "}
          {GAME_CONFIG.totalBoxes} total boxes and {GAME_CONFIG.winningBoxes} winning
          boxes, each linked to one of {GAME_CONFIG.promoCodes.length} unique codes.
        </p>
        <p className="mt-3">
          Reward assignment, redemption limits and availability are controlled by the
          campaign backend. Codes may expire or become unavailable once claimed.
        </p>
      </Modal>

      <Modal
        open={activeModal === "rules"}
        onClose={() => setActiveModal(null)}
        title="TERMS & PROMO RULES"
        icon="📜"
      >
        <p>
          This mystery box game is a promotional experience. Promo codes are limited,
          non-transferable, and subject to the campaign&apos;s terms. One reward may be
          claimed per eligible session. Attempting to manipulate or automate box
          selection may void rewards. All final decisions on redemption are made by the
          backend campaign system, not the client application.
        </p>
      </Modal>
    </div>
  );
}

/**
 * Small internal bridge so the RewardModal (owned by GameScreen) can trigger the
 * app-level toast without prop-drilling a global toast setter through every layer.
 * In this implementation the toast is simply shown from GameScreen via a custom
 * event, keeping the reward modal itself framework-agnostic.
 */
function RewardCopyToastBridge({ onToast }: { onToast: (msg: string) => void }) {
  useEffect(() => {
    const handler = () => onToast("Promo code copied successfully!");
    window.addEventListener("promo-copied", handler);
    return () => window.removeEventListener("promo-copied", handler);
  }, [onToast]);
  return null;
}
