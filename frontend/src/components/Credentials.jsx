import React from "react";
import { motion } from "framer-motion";
import { Award, GraduationCap, Star } from "lucide-react";
import { CREDENTIALS } from "../data/portfolio";

export default function Credentials() {
  return (
    <section
      id="credentials"
      data-testid="credentials-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
              07 // Certifications & Education
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          Credentials, training, and{" "}
          <span className="text-[#00E5FF]">recognitions</span>.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-14">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7"
            data-testid="credentials-certifications"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                <Award size={16} />
              </span>
              <span className="font-display text-[#F8FAFC] text-lg tracking-tight">
                Certifications
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CREDENTIALS.certifications.map((c, i) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-zinc-800 p-4 hover:border-[#00E5FF]/40 transition-colors"
                  data-testid={`cert-${i}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="font-mono text-[9px] tracking-[0.3em] uppercase"
                      style={{ color: c.color }}
                    >
                      {c.year}
                    </div>
                    <span
                      className="w-2 h-2 rounded-full mt-1.5"
                      style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
                    />
                  </div>
                  <div className="font-display text-[#F8FAFC] text-base tracking-tight mt-2">
                    {c.name}
                  </div>
                  <div className="text-slate-500 text-xs font-mono mt-1">{c.issuer}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education + Recognitions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7"
              data-testid="credentials-education"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-xl border border-[#39FF14]/40 bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
                  <GraduationCap size={16} />
                </span>
                <span className="font-display text-[#F8FAFC] text-lg tracking-tight">
                  Education
                </span>
              </div>
              <ul className="space-y-5">
                {CREDENTIALS.education.map((e, i) => (
                  <li key={i} className="border-l border-zinc-800 pl-4">
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#39FF14]">
                      {e.period}
                    </div>
                    <div className="font-display text-[#F8FAFC] text-base tracking-tight mt-1">
                      {e.degree}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{e.institution}</div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7"
              data-testid="credentials-recognitions"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-xl border border-[#FFB000]/40 bg-[#FFB000]/10 flex items-center justify-center text-[#FFB000]">
                  <Star size={16} />
                </span>
                <span className="font-display text-[#F8FAFC] text-lg tracking-tight">
                  Recognitions
                </span>
              </div>
              <ul className="space-y-3">
                {CREDENTIALS.recognitions.map((r, i) => (
                  <li
                    key={i}
                    className="text-slate-300 text-sm leading-relaxed flex gap-3"
                  >
                    <span className="text-[#FFB000] mt-2 w-1 h-1 rounded-full bg-current shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
