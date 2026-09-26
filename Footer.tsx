import Logo from "@/components/core/Logo";

const COLS = [
  { h: "Brand", links: [["The bike", "#explorer"], ["How it works", "#how-it-works"], ["vs Petrol", "#compare"], ["Charging", "#charging"]] },
  { h: "Company", links: [["Support", "#contact"], ["Why electric", "#benefits"], ["Contact", "mailto:hello@ecobike.example"]] },
  { h: "Follow", links: [["Instagram", "https://instagram.com"], ["YouTube", "https://youtube.com"]] },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/[0.07] bg-ink-950 px-5 pb-10 pt-20 md:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-mist">Silent power. Intelligent control. Unforgettable rides.</p>
          <a href="mailto:hello@ecobike.example" className="mt-6 inline-block text-sm text-white underline-offset-4 hover:underline">
            hello@ecobike.example
          </a>
        </div>
        {COLS.map((c) => (
          <nav key={c.h} aria-label={c.h}>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40">{c.h.toUpperCase()}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([l, href]) => (
                <li key={l}>
                  <a
                    href={href}
                    className="text-sm text-white/75 transition-colors hover:text-volt"
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-20 flex max-w-[1320px] flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 font-mono text-[10px] tracking-widest text-white/35 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} ECO BIKE. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-3" aria-label="System charged">
          {/* Pulsing battery */}
          <span className="relative flex h-3.5 w-7 items-center rounded-[3px] border border-white/40 p-[2px]" aria-hidden>
            <span className="h-full w-full origin-left rounded-[1px] bg-volt" style={{ animation: "battery-pulse 2.4s ease-in-out infinite" }} />
            <span className="absolute -right-[4px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r bg-white/40" />
          </span>
          RIDE THE FUTURE
        </span>
      </div>
    </footer>
  );
}
