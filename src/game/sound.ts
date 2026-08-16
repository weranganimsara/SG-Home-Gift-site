/**
 * Lightweight synthesized sound-effect system using the Web Audio API.
 * No external audio assets are required, and nothing plays until the
 * user has interacted with the page (browser autoplay policies respected).
 */

type SoundName =
  | "hover"
  | "click"
  | "unlock"
  | "open"
  | "reveal"
  | "victory"
  | "copy";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private unlocked = false;

  setEnabled(value: boolean) {
    this.enabled = value;
  }

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  /** Call this on the first user gesture to unlock audio on mobile browsers. */
  unlock() {
    const ctx = this.getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gainValue = 0.05,
    delay = 0
  ) {
    if (!this.enabled || !this.unlocked) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  }

  play(name: SoundName) {
    switch (name) {
      case "hover":
        this.tone(720, 0.08, "sine", 0.03);
        break;
      case "click":
        this.tone(440, 0.1, "triangle", 0.05);
        break;
      case "unlock":
        this.tone(300, 0.12, "square", 0.04);
        this.tone(500, 0.12, "square", 0.04, 0.08);
        break;
      case "open":
        this.tone(220, 0.15, "sawtooth", 0.05);
        this.tone(660, 0.2, "sine", 0.05, 0.1);
        break;
      case "reveal":
        this.tone(523.25, 0.15, "sine", 0.06);
        this.tone(659.25, 0.15, "sine", 0.06, 0.12);
        this.tone(783.99, 0.25, "sine", 0.06, 0.24);
        break;
      case "victory":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.tone(f, 0.3, "sine", 0.06, i * 0.12)
        );
        break;
      case "copy":
        this.tone(880, 0.08, "sine", 0.05);
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
