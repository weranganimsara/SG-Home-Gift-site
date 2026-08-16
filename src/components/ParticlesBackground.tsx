import { useMemo } from "react";

interface ParticlesBackgroundProps {
  density?: number;
  className?: string;
}

/**
 * Lightweight ambient particle field built from pure CSS animations
 * (no canvas, no per-frame JS) so it stays cheap on low-end devices.
 */
export default function ParticlesBackground({
  density = 22,
  className = "",
}: ParticlesBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 10 + Math.random() * 16,
        delay: Math.random() * -20,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [density]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-float absolute rounded-full"
          style={
            {
              left: `${p.left}%`,
              bottom: "-5%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                p.id % 3 === 0
                  ? "radial-gradient(circle, #FFA54A 0%, transparent 70%)"
                  : "radial-gradient(circle, #FF6A00 0%, transparent 70%)",
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
