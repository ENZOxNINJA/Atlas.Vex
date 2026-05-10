import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../data/portfolio";

export default function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
                03 // Featured Systems
              </span>
              <div className="divider-x flex-1 max-w-[180px]" />
            </div>
            <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-2xl">
              Operational systems running in production.
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Three flagship platforms forming the ATLAS VEX stack — from agent orchestration to
            persistent memory and adaptive defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl overflow-hidden hover:border-[#00E5FF]/50 transition-all block"
              data-testid={`project-${p.id}-card`}
            >
              <div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-0 group-hover:opacity-25 blur-3xl transition-opacity"
                style={{ background: p.accent }}
              />
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-300 bg-black/50 border border-zinc-700 rounded-full px-3 py-1">
                  Sys/{p.code}
                </span>
                <span
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }}
                />
              </div>

              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display font-bold text-[#F8FAFC] text-2xl tracking-tighter">
                    {p.name}
                  </h3>
                  <span className="text-slate-500 group-hover:text-[#00E5FF] transition-colors">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <div
                  className="font-mono text-xs tracking-[0.2em] uppercase mt-1"
                  style={{ color: p.accent }}
                >
                  {p.summary}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mt-4">{p.description}</p>

                <div className="flex items-center gap-2 mt-5 font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 group-hover:text-[#00E5FF] transition-colors">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  github.com/{p.repo.replace("https://github.com/", "")}
                </div>

                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-zinc-800/80">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-300 border border-zinc-700 rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
