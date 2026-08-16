import { GAME_CONFIG } from "../game/config";

export default function SponsorLinks() {
  if (!GAME_CONFIG.sponsorLinksEnabled || GAME_CONFIG.sponsorLinks.length === 0) {
    return null;
  }

  return (
    <div className="glass w-full max-w-xl rounded-2xl p-4 sm:p-5">
      <p className="mb-3 font-display text-xs font-semibold tracking-[0.25em] text-white/50">
        🔗 PARTNER OFFERS
      </p>
      <div className="flex flex-col gap-2">
        {GAME_CONFIG.sponsorLinks.map((link) => (
          <a
            key={link.url + link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#FF6A00]/40 hover:text-white"
          >
            <span>{link.label}</span>
            <span className="text-xs text-white/30 transition-colors group-hover:text-[#FFA54A]">
              Opens in new tab ↗
            </span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-white/25">
        These are optional external partner links. You will leave the game to visit them.
      </p>
    </div>
  );
}
