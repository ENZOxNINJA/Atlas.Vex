import React from "react";
import { motion } from "framer-motion";
import { Quote, Lock, Mail, ShieldCheck } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const PILLARS = [
  {
    accent: "#00E5FF",
    label: "Engineering rigor",
    body: "Architecture-level clarity, security-minded by default, and a track record of shipping in production — not demos.",
  },
  {
    accent: "#39FF14",
    label: "Operational impact",
    body: "Past engagements span multi-region distributed systems, autonomous agent fleets, and adaptive DevSecOps pipelines.",
  },
  {
    accent: "#FFB000",
    label: "Trusted under NDA",
    body: "Most collaborations are protected under engagement NDAs. Verifiable references are provided directly upon request.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[420px] h-[420px] rounded-full bg-[#39FF14] opacity-[0.05] blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-[360px] h-[360px] rounded-full bg-[#00E5FF] opacity-[0.05] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            09 // Voices in the Field
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          References, protected.{" "}
          <span className="text-[#00E5FF]">Available on request.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed">
          The strongest signal a portfolio can give is the work that ships. Direct quotes
          from past collaborators are protected under engagement NDAs and shared
          one-to-one with serious counterparts.
        </p>

        {/* Featured "vault" card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="mt-14 relative rounded-[32px] border border-[#00E5FF]/30 bg-zinc-950/60 backdrop-blur-xl p-8 sm:p-10 overflow-hidden"
          data-testid="testimonials-vault"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#00E5FF] opacity-[0.07] blur-3xl pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                  <Lock size={16} />
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00E5FF]">
                  REF.VAULT // ENCRYPTED CHANNEL
                </span>
              </div>

              <Quote size={32} className="text-[#00E5FF]/40 mb-3" />
              <blockquote className="font-display tracking-tight text-slate-200 text-xl sm:text-2xl leading-snug">
                Verifiable references are released directly to vetted counterparts —
                CTOs, hiring partners, founders, and procurement leads — after a brief
                introduction call.
              </blockquote>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${PROFILE.socials.email}?subject=Reference%20request%20%E2%80%94%20${encodeURIComponent(
                    PROFILE.name
                  )}&body=Hi%20Alan%2C%0A%0AI%27d%20like%20to%20speak%20with%20one%20or%20two%20past%20collaborators%20before%20we%20engage.%20Here%27s%20a%20bit%20about%20our%20context%3A%0A%0A-%20Company%2FRole%3A%0A-%20Engagement%20type%3A%0A-%20Timeline%3A%0A%0AThanks%2C%0A`}
                  className="btn-cta"
                  data-testid="testimonials-request-email"
                >
                  <Mail size={14} /> Request References
                </a>
                <a
                  href={PROFILE.socials.calendly}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  data-testid="testimonials-request-call"
                >
                  Book Intro Call
                </a>
              </div>

              <p className="mt-5 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                // Response within 48h · Mon–Fri UTC+8
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="space-y-4">
                {PILLARS.map((p) => (
                  <div
                    key={p.label}
                    className="rounded-2xl border border-zinc-800 bg-black/40 p-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: p.accent, boxShadow: `0 0 10px ${p.accent}` }}
                        aria-hidden="true"
                      />
                      <span
                        className="font-mono text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: p.accent }}
                      >
                        {p.label}
                      </span>
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed">{p.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
          <ShieldCheck size={12} className="text-[#39FF14]" aria-hidden="true" />
          <span>NDA-respecting · One-to-one introductions</span>
        </div>
      </div>
    </section>
  );
}
