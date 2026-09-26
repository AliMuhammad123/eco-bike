"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Modal from "@/components/core/Modal";
import { useBuild } from "@/lib/build-context";
import { summarize } from "@/lib/bike";

const CITIES = ["London", "Manchester", "Berlin", "Amsterdam", "Paris", "New York", "Los Angeles", "Karachi", "Dubai"];

export default function TestRideModal() {
  const { testRideOpen, setTestRideOpen, config } = useBuild();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sum = summarize(config);
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

  const close = () => {
    setTestRideOpen(false);
    setTimeout(() => {
      setSent(false);
      setErrors({});
    }, 400);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!String(f.get("name") ?? "").trim()) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(f.get("email") ?? ""))) errs.email = "Please enter a valid email.";
    if (!f.get("date")) errs.date = "Pick a date.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // TODO: POST to your booking endpoint / CRM here (e.g. /api/test-ride).
    setSent(true);
  };

  return (
    <Modal open={testRideOpen} onClose={close} label="Book a test ride">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-volt text-ink-950">
              <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden>
                <path d="M2 9l6 6L20 2" stroke="currentColor" strokeWidth="2.4" fill="none" />
              </svg>
            </div>
            <h2 className="display mt-6 text-3xl">You&rsquo;re on the list.</h2>
            <p className="mt-3 text-mist">We&rsquo;ll confirm your slot by email within 24 hours.</p>
            <button onClick={close} className="btn btn-ghost mt-8">
              Close
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-mono text-[10px] tracking-[0.25em] text-volt">TEST RIDE · 45 MIN</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">Feel it for yourself.</h2>
            <p className="mt-2 text-sm text-mist">
              We&rsquo;ll bring {/^[AEIOU]/i.test(sum.color) ? "an" : "a"} {sum.color} bike{sum.accessories.length ? ` with ${sum.accessories.join(", ").toLowerCase()}` : ""} to match your build.
            </p>
            <div className="mt-6 space-y-4">
              <Field id="tr-name" name="name" label="Full name" error={errors.name} autoComplete="name" />
              <Field id="tr-email" name="email" type="email" label="Email" error={errors.email} autoComplete="email" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tr-city" className="font-mono text-[10px] tracking-widest text-white/50">
                    CITY
                  </label>
                  <select id="tr-city" name="city" className="mt-1.5 w-full rounded-lg border border-white/15 bg-ink-900 px-3 py-3 text-sm">
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Field id="tr-date" name="date" type="date" label="Date" min={tomorrow} error={errors.date} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-8 w-full justify-center">
              Request my ride
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[10px] tracking-widest text-white/50">
        {label.toUpperCase()}
      </label>
      <input
        id={id}
        {...rest}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`mt-1.5 w-full rounded-lg border bg-ink-900 px-3 py-3 text-sm [color-scheme:dark] focus:outline-none ${error ? "border-heat" : "border-white/15 focus:border-volt/70"}`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-heat">
          {error}
        </p>
      )}
    </div>
  );
}
