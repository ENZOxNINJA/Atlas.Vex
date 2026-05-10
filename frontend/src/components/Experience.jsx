import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { EXPERIENCE } from "../data/portfolio";

export default function Experience() {
  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            04 // Professional Trajectory
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05]">
              A timeline of <span className="text-[#00E5FF]">shipped</span> work.
            </h2>
            <p className="text-slate-400 mt-6 leading-relaxed text-sm max-w-sm">
              Selected roles across product engineering, security research, and autonomous systems.
              Some company names withheld under NDA.
            </p>
          </div>

          <div className="lg:col-span-8 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#00E5FF]/40 via-zinc-800 to-transparent" />
            <ol className="space-y-6">
              {EXPERIENCE.map((exp, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-12"
                  data-testid={`experience-item-${i}`}
                >
                  <span
                    className={`absolute left-0 top-3 w-8 h-8 rounded-full border flex items-center justify-center ${
                      exp.status === "active"
                        ? "border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14] glow-green"
                        : "border-zinc-700 bg-zinc-950 text-slate-500"
                    }`}
                  >
                    <Briefcase size={13} />
                  </span>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-6 hover:border-[#00E5FF]/40 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00E5FF]">
                        {exp.period}
                      </span>
                      {exp.status === "active" && (
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#39FF14] border border-[#39FF14]/40 rounded-full px-2 py-0.5">
                          • CURRENT
                        </span>
                      )}
                    </div>
                    <div className="font-display font-bold text-[#F8FAFC] text-xl tracking-tight">
                      {exp.role}
                    </div>
                    <div className="font-mono text-xs text-slate-400 mt-1">
                      {exp.company} · <span className="text-slate-500">{exp.location}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((h, idx) => (
                        <li
                          key={idx}
                          className="text-slate-300 text-sm leading-relaxed flex gap-3"
                        >
                          <span className="text-[#00E5FF] mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
