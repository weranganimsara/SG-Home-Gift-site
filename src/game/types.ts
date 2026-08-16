export type GamePhase =
  | "IDLE"
  | "LOADING"
  | "LANDING"
  | "START_GAME"
  | "PICK_BOX"
  | "OPENING"
  | "REWARD_REVEAL"
  | "CLAIMED"
  | "ERROR";

export type BoxStatus = "locked" | "pending" | "opened_win" | "opened_empty";

export interface VaultBox {
  /** Stable vault number 1 to 50 */
  id: number;
  /** Whether this vault contains a winning promo code */
  isWinning: boolean;
  /** Index in GAME_CONFIG.promoCodes */
  promoIndex?: number;
  /** Current state of the box */
  status: BoxStatus;
}

export interface RevealResult {
  win: boolean;
  boxId: number;
  promo?: {
    code: string;
    discount: string;
    link: string;
  };
}
