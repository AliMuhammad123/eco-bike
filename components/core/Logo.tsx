/** Eco Bike wordmark — a stylised "E" formed by three charge bars. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden>
        <rect x="0" y="0" width="26" height="5" rx="1.5" fill="currentColor" />
        <rect x="0" y="8.5" width="18" height="5" rx="1.5" fill="#C8FF2E" />
        <rect x="0" y="17" width="26" height="5" rx="1.5" fill="currentColor" />
      </svg>
      <span className="display text-[15px] tracking-[-0.02em]">
        ECO<span className="font-light text-white/60">BIKE</span>
      </span>
    </span>
  );
}
