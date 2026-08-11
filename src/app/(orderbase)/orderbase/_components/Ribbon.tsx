export function Ribbon({ words }: { words: string[] }) {
  if (!words.length) return null;
  // duplicate the run so the -50% marquee loops seamlessly
  const run = [...words, ...words];
  return (
    <div className="relative z-[5] overflow-hidden whitespace-nowrap bg-ob-red py-[11px] font-ob-display text-[0.92rem] font-extrabold tracking-[0.06em] text-white shadow-[0_14px_30px_-20px_rgba(14,14,16,0.45)]">
      <div className="ob-marquee inline-block">
        {run.map((w, i) => (
          <span key={i}>
            <span className="px-[14px] opacity-95">{w}</span>
            <span className="text-white/60">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
