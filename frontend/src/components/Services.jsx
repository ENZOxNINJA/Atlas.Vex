import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICES } from "../data/portfolio";

export default function Services() {
  const scrollContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
              08 // Engagement Modes
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-2xl">
            How we can <span className="text-[#00E5FF]">work together</span>.
          </h2>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Three engagement modes — pick the one that matches your stage. Custom scopes welcome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.button
              key={s.code}
              onClick={scrollContact}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative text-left rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7 hover:border-[#00E5FF]/50 transition-all overflow-hidden"
              data-testid={`service-${i}`}
            >
              <div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-0 group-hover:opacity-15 blur-3xl transition-opacity"
                style={{ background: s.accent }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] tracking-[0.3em] uppercase border rounded-full px-2.5 py-1"
                    style={{ color: s.accent, borderColor: `${s.accent}55` }}
                  >
                    {s.code}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-slate-500 group-hover:text-[#00E5FF] transition-colors"
                  />
                </div>
                <h3 className="font-display font-bold text-[#F8FAFC] text-2xl tracking-tighter mt-6">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-3">{s.body}</p>
                <ul className="mt-6 pt-6 border-t border-zinc-800/80 space-y-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-slate-300 text-sm font-mono tracking-wide"
                    >
                      <Check size={14} style={{ color: s.accent }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 group-hover:text-[#00E5FF] transition-colors">
                  → Initiate Engagement
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
