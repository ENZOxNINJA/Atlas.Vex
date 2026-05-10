import React from "react";
import { motion } from "framer-motion";
import { SKILLS } from "../data/portfolio";

export default function Skills() {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
              02 // Capabilities Matrix
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          A capability stack tuned for{" "}
          <span className="text-[#00E5FF]">autonomous</span>, adversarial environments.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
          {SKILLS.map((s, i) => {
            const isPrimary = s.weight === "primary";
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={`${s.span || ""} col-span-2 md:col-span-2 group relative rounded-3xl border border-zinc-800 p-6 overflow-hidden transition-all hover:border-[#00E5FF]/60 ${
                  isPrimary
                    ? "bg-gradient-to-br from-[#00E5FF]/[0.06] to-transparent"
                    : "bg-zinc-950/50"
                }`}
                data-testid={`skill-card-${i}`}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#00E5FF] opacity-0 group-hover:opacity-10 blur-3xl transition-opacity" />
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPrimary ? "bg-[#00E5FF]" : "bg-zinc-700 group-hover:bg-[#39FF14]"
                    }`}
                  />
                </div>
                <div className="font-display text-[#F8FAFC] text-lg sm:text-xl tracking-tight leading-tight">
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
