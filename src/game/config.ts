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
   * Ad / Sponsor direct links opened when clicking a locked box to trigger unlock.
   * Can provide multiple links (e.g. 10 links) — a random link opens on each box click.
   */
  sponsorUnlockUrl: "https://omg10.com/4/11920602",
  sponsorUnlockUrls: [
    "https://omg10.com/4/11920602",
    "https://omg10.com/4/11587014",
    "https://omg10.com/4/11597496",
    "https://omg10.com/4/11597495",
    "https://omg10.com/4/11597512",
    "https://omg10.com/4/11597515",
    "https://omg10.com/4/11232877",
    "https://omg10.com/4/11597505",
    "https://omg10.com/4/11597494",
    "https://omg10.com/4/11597514",
  ],

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
    { code: "SGFREE100",  discount: "100% Off", link: "https://paid.sghome.space/" },
    { code: "SGVIP80",    discount: "80% Off",  link: "https://paid.sghome.space/" },
    { code: "MYSTERY77",  discount: "75% Off",  link: "https://paid.sghome.space/" },
    { code: "TURBO50",    discount: "50% Off",  link: "https://paid.sghome.space/" },
    { code: "PLATINUM40", discount: "40% Off",  link: "https://paid.sghome.space/" },
    { code: "FASTPASS30", discount: "30% Off",  link: "https://paid.sghome.space/" },
    { code: "NINJA25",    discount: "25% Off",  link: "https://paid.sghome.space/" },
    { code: "CYBERSG20",  discount: "20% Off",  link: "https://paid.sghome.space/" },
    { code: "GIFTBOX15",  discount: "15% Off",  link: "https://paid.sghome.space/" },
    { code: "SUPERVPN10", discount: "10% Off",  link: "https://paid.sghome.space/" },
  ] satisfies PromoCodeEntry[],

  /** Optional external / sponsor links shown clearly as partner offers. */
  sponsorLinks: [
    { label: "Partner Offer — Deals Hub", url: "https://omg10.com/4/11597496" },
    { label: "Partner Offer — Reward Zone", url: "https://omg10.com/4/11597495" },
    { label: "Partner Offer — Bonus Vault", url: "https://omg10.com/4/11597512" },
  ],

  brand: {
    name: "SG HOME",
    year: 2026,
  },
};

export type GameConfig = typeof GAME_CONFIG;
