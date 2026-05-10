import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/portfolio";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[420px] h-[420px] rounded-full bg-[#39FF14] opacity-[0.05] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            09 // Voices in the Field
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          What collaborators say about working with{" "}
          <span className="text-[#00E5FF]">Mr.Marvel</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="relative rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7 sm:p-8 group hover:border-[#00E5FF]/40 transition-colors overflow-hidden"
              data-testid={`testimonial-${i}`}
            >
              <div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity"
                style={{ background: t.accent }}
              />
              <div className="relative">
                <Quote
                  size={28}
                  style={{ color: t.accent }}
                  className="opacity-90"
                />
                <blockquote className="text-slate-200 text-base sm:text-lg leading-relaxed mt-5 font-display tracking-tight">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-7 pt-6 border-t border-zinc-800/80">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                    Reference / {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[#F8FAFC] mt-2 font-display tracking-tight">
                    {t.name}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 font-mono">{t.role}</div>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
          // Identities anonymised under engagement NDAs · references available on request
        </p>
      </div>
    </section>
  );
}
