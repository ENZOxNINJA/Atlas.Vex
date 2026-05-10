import React from "react";
import { motion } from "framer-motion";
import { STACK } from "../data/portfolio";

export default function Stack() {
  return (
    <section
      id="stack"
      data-testid="stack-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            03 // Tech Stack
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] lg:w-2/5 shrink-0">
            The toolchain I ship with —
            <br />
            <span className="text-slate-500">battle-tested in production.</span>
          </h2>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STACK.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 hover:border-[#00E5FF]/40 transition-colors"
                data-testid={`stack-category-${i}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                    cat/{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[#F8FAFC] text-base tracking-tight">
                    {cat.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((it) => (
                    <span
                      key={it}
                      className="font-mono text-[11px] tracking-[0.15em] uppercase text-slate-300 border border-zinc-800 hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-colors rounded-full px-3 py-1.5"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
