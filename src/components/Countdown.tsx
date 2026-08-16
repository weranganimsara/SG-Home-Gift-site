import { useEffect, useState } from "react";

interface CountdownProps {
  endsAt: string;
}

function getRemaining(endsAt: string) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ endsAt }: CountdownProps) {
  const [time, setTime] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    const id = window.setInterval(() => setTime(getRemaining(endsAt)), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (time.done) return null;

  return (
    <div className="glass mx-auto flex w-full max-w-md flex-col items-center gap-2 rounded-2xl px-5 py-3 text-center">
      <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-white/50">
        PROMO EVENT ENDS IN
      </p>
      <div className="flex items-center gap-2 font-display text-xl font-bold text-[#FFA54A] sm:text-2xl">
        <span>{pad(time.days)}</span>
        <span className="text-white/30">:</span>
        <span>{pad(time.hours)}</span>
        <span className="text-white/30">:</span>
        <span>{pad(time.minutes)}</span>
        <span className="text-white/30">:</span>
        <span>{pad(time.seconds)}</span>
      </div>
    </div>
  );
}
