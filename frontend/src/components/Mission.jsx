import React from "react";
import { motion } from "framer-motion";
import { PROFILE } from "../data/portfolio";

const TENETS = [
  "Autonomy over automation",
  "Provenance over performance",
  "Resilience over reliance",
  "Execution over exposition",
];

export default function Mission() {
  return (
    <section
      id="mission"
      data-testid="mission-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00E5FF] opacity-[0.05] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            10 // Mission Statement
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-medium text-[#F8FAFC] text-3xl sm:text-4xl lg:text-6xl tracking-tighter leading-[1.05] max-w-5xl"
        >
          <span className="text-[#00E5FF]">"</span>
          {PROFILE.mission}
          <span className="text-[#00E5FF]">"</span>
        </motion.blockquote>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-[32px] overflow-hidden">
          {TENETS.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#020617] p-6 sm:p-8"
              data-testid={`mission-tenet-${i}`}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                tenet/{String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display text-lg sm:text-xl text-[#F8FAFC] mt-3 tracking-tight leading-tight">
                {t}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
