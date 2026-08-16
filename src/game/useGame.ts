import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAME_CONFIG } from "./config";
import type { GamePhase, RevealResult, VaultBox } from "./types";
import { soundEngine } from "./sound";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Builds the full 50-vault pool with 10 winning slots placed at random positions. */
function build50Vaults(): VaultBox[] {
  const { totalBoxes, winningBoxes, promoCodes } = GAME_CONFIG;

  const rawSlots: { isWinning: boolean; promoIndex?: number }[] = [];

  // 10 Winning rewards
  const promoOrder = shuffle(promoCodes.map((_, i) => i));
  for (let i = 0; i < winningBoxes; i++) {
    rawSlots.push({
      isWinning: true,
      promoIndex: promoOrder[i % promoOrder.length],
    });
  }

  // 40 Empty slots
  for (let i = 0; i < totalBoxes - winningBoxes; i++) {
    rawSlots.push({
      isWinning: false,
    });
  }

  // Randomize placement across all 50 slots
  const shuffled = shuffle(rawSlots);

  // Assign sequential display IDs 1..50
  return shuffled.map((slot, index) => ({
    id: index + 1,
    isWinning: slot.isWinning,
    promoIndex: slot.promoIndex,
    status: "locked",
  }));
}

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>("LOADING");
  const [boxes, setBoxes] = useState<VaultBox[]>([]);
  const [pendingBoxId, setPendingBoxId] = useState<number | null>(null);
  const [result, setResult] = useState<RevealResult | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winsCount, setWinsCount] = useState(0);

  const sessionId = useRef<string>(
    `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  );
  const openingLockRef = useRef(false);

  // Metrics
  const openedBoxesCount = boxes.filter(
    (b) => b.status === "opened_win" || b.status === "opened_empty"
  ).length;
  const boxesAvailable = GAME_CONFIG.totalBoxes - openedBoxesCount;
  const remainingWinningCount = boxes.filter(
    (b) => b.isWinning && b.status !== "opened_win"
  ).length;

  /** IDLE -> LOADING -> LANDING */
  const finishLoading = useCallback(() => {
    setPhase("LANDING");
  }, []);

  /** START_GAME: generates the 50 live boxes */
  const startGame = useCallback(() => {
    try {
      const initialBoxes = build50Vaults();
      setBoxes(initialBoxes);
      setPendingBoxId(null);
      setClaimed(false);
      setResult(null);
      setWinsCount(0);
      setPhase("PICK_BOX");
    } catch {
      setError("Unable to initialize the 50-vault hunt.");
      setPhase("ERROR");
    }
  }, []);

  /**
   * CLICK BOX:
   * 1. Sets the clicked box to 'pending'
   * 2. Opens the sponsor direct link in a new tab
   * 3. Waits for the user to return to this tab to reveal!
   */
  const selectBox = useCallback(
    (boxId: number) => {
      if (openingLockRef.current) return;
      if (phase !== "PICK_BOX") return;

      const target = boxes.find((b) => b.id === boxId);
      if (!target || target.status === "opened_win" || target.status === "opened_empty") {
        return;
      }

      // Mark this box as pending
      setPendingBoxId(boxId);
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === boxId
            ? { ...b, status: "pending" }
            : b.status === "pending"
            ? { ...b, status: "locked" }
            : b
        )
      );

      // Play click sound
      soundEngine.unlock();
      soundEngine.play("click");

      // Open sponsor unlock link in new tab
      window.open(GAME_CONFIG.sponsorUnlockUrl, "_blank", "noopener,noreferrer");
    },
    [boxes, phase]
  );

  /**
   * REVEAL ON TAB RETURN:
   * When user returns to the tab while a box is pending, triggers cinematic opening!
   */
  const triggerReveal = useCallback(
    (boxId: number) => {
      if (openingLockRef.current) return;
      openingLockRef.current = true;

      setPhase("OPENING");
      soundEngine.unlock();
      soundEngine.play("unlock");

      window.setTimeout(() => {
        try {
          soundEngine.play("reveal");

          const currentBox = boxes.find((b) => b.id === boxId);
          if (!currentBox) return;

          const isWin = currentBox.isWinning;
          const promo =
            isWin && currentBox.promoIndex !== undefined
              ? GAME_CONFIG.promoCodes[currentBox.promoIndex]
              : undefined;

          // Update box status in state
          setBoxes((prev) =>
            prev.map((b) =>
              b.id === boxId
                ? { ...b, status: isWin ? "opened_win" : "opened_empty" }
                : b
            )
          );

          if (isWin) {
            setWinsCount((n) => n + 1);
            setResult({ win: true, boxId, promo });
          } else {
            setResult({ win: false, boxId });
          }

          setPendingBoxId(null);
          setPhase("REWARD_REVEAL");
        } catch {
          setError("We couldn't load your reward right now.");
          setPhase("ERROR");
        } finally {
          openingLockRef.current = false;
        }
      }, 1400);
    },
    [boxes]
  );

  // Return-to-reveal event listeners (focus & visibilitychange)
  useEffect(() => {
    const handleReturn = () => {
      if (pendingBoxId !== null && phase === "PICK_BOX" && !openingLockRef.current) {
        triggerReveal(pendingBoxId);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        handleReturn();
      }
    };

    window.addEventListener("focus", handleReturn);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleReturn);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pendingBoxId, phase, triggerReveal]);

  /** Continue hunting: close modal and return to PICK_BOX */
  const tryAnotherBox = useCallback(() => {
    setResult(null);
    setClaimed(false);
    if (boxesAvailable <= 1) {
      setPhase("CLAIMED");
      return;
    }
    setPhase("PICK_BOX");
  }, [boxesAvailable]);

  const claimReward = useCallback(() => {
    setClaimed(true);
  }, []);

  const restartSession = useCallback(() => {
    startGame();
  }, [startGame]);

  const retryFromError = useCallback(() => {
    setError(null);
    setPhase("LANDING");
  }, []);

  return useMemo(
    () => ({
      phase,
      setPhase,
      boxes,
      pendingBoxId,
      result,
      claimed,
      error,
      boxesAvailable,
      openedBoxesCount,
      remainingWinningCount,
      winsCount,
      sessionId: sessionId.current,
      finishLoading,
      startGame,
      selectBox,
      tryAnotherBox,
      claimReward,
      restartSession,
      retryFromError,
    }),
    [
      phase,
      boxes,
      pendingBoxId,
      result,
      claimed,
      error,
      boxesAvailable,
      openedBoxesCount,
      remainingWinningCount,
      winsCount,
      finishLoading,
      startGame,
      selectBox,
      tryAnotherBox,
      claimReward,
      restartSession,
      retryFromError,
    ]
  );
}

export type UseGameReturn = ReturnType<typeof useGame>;
