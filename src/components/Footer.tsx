import { GAME_CONFIG } from "../game/config";

interface FooterProps {
  onOpenRules: () => void;
}

export default function Footer({ onOpenRules }: FooterProps) {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-white/5 px-6 py-6 text-center">
      <p className="text-[11px] text-white/30">
        © {GAME_CONFIG.brand.year} {GAME_CONFIG.brand.name}. All rights reserved.
      </p>
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-white/35">
        <button className="transition-colors hover:text-[#FFA54A]" onClick={onOpenRules}>
          Terms
        </button>
        <span className="text-white/15">•</span>
        <button className="transition-colors hover:text-[#FFA54A]" onClick={onOpenRules}>
          Privacy
        </button>
        <span className="text-white/15">•</span>
        <button className="transition-colors hover:text-[#FFA54A]" onClick={onOpenRules}>
          Promo Rules
        </button>
      </div>
    </footer>
  );
}
