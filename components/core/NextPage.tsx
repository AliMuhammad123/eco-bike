import Link from "next/link";

/** End-of-page band pointing the reader to the next page. */
export default function NextPage({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <section aria-label="Next page" className="border-t border-white/[0.07] bg-ink-950 py-12 md:py-16">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <Link href={href} className="group flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <span>
            <span className="eyebrow">Next</span>
            <span className="display mt-3 block text-[clamp(2rem,5vw,4rem)] transition-colors group-hover:text-volt">
              {label} →
            </span>
          </span>
          <span className="max-w-sm text-sm text-mist md:text-right">{hint}</span>
        </Link>
      </div>
    </section>
  );
}
