/**
 * =========================================================================
 *  GAME CONFIGURATION — MASTER CAMPAIGN SETTINGS
 * =========================================================================
 */

export interface PromoCodeEntry {
  code: string;
  discount: string;
  link: string;
}

export const GAME_CONFIG = {
  /** Total number of boxes that exist in the campaign pool. */
  totalBoxes: 50,

  /** How many of those boxes contain a winning promo code. */
  winningBoxes: 10,

  /** Max selections (set high for full 50-box hunt). */
  maxSelectionsPerSession: 50,

  /** 
   * Destination URL where "USE PROMO CODE" sends the player when they WIN!
   */
  paidSiteUrl: "https://paid.sghome.space/",

  /**
   * Ad / Sponsor direct link opened when clicking a locked box to trigger unlock
   */
  sponsorUnlockUrl: "https://omg10.com/4/11587014",

  /** Toggle the campaign countdown banner on/off. */
  countdownEnabled: false,

  /** ISO date string the countdown should count down to. */
  countdownEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),

  /** Toggle the sponsor / partner offers section. */
  sponsorLinksEnabled: true,

  /** Whether sound effects are enabled by default (user can still toggle). */
  soundEnabled: true,

  /**
   * Backend endpoints (placeholders).
   */
  api: {
    start: "/api/game/start",
    select: "/api/game/select",
    claim: "/api/reward/claim",
    redeem: "/api/promo/redeem",
  },

  /** The 10 official winning promo codes configured for https://paid.sghome.space/ */
  promoCodes: [
    { code: "SGHOME2007", discount: "10% Off", link: "https://paid.sghome.space/" },
    { code: "SGVIP25",    discount: "50% Off", link: "https://paid.sghome.space/" },
    { code: "SGHOME88",   discount: "88% Off", link: "https://paid.sghome.space/" },
    { code: "GOLD99X",    discount: "40% Off", link: "https://paid.sghome.space/" },
    { code: "VAULT10",    discount: "10% Off", link: "https://paid.sghome.space/" },
    { code: "ALPHA77",    discount: "5% Off",  link: "https://paid.sghome.space/" },
    { code: "PRIME50",    discount: "14% Off", link: "https://paid.sghome.space/" },
    { code: "NEXUS30",    discount: "30% Off", link: "https://paid.sghome.space/" },
    { code: "SECRET20",   discount: "15% Off", link: "https://paid.sghome.space/" },
    { code: "LUCKY100",   discount: "100% Off", link: "https://paid.sghome.space/" },
  ] satisfies PromoCodeEntry[],

  /** Optional external / sponsor links shown clearly as partner offers. */
  sponsorLinks: [
    { label: "Partner Offer — Deals Hub", url: "https://omg10.com/4/11587014" },
    { label: "Partner Offer — Reward Zone", url: "https://omg10.com/4/11587014" },
    { label: "Partner Offer — Bonus Vault", url: "https://omg10.com/4/11587014" },
  ],

  brand: {
    name: "SG HOME",
    year: 2026,
  },
};

export type GameConfig = typeof GAME_CONFIG;
