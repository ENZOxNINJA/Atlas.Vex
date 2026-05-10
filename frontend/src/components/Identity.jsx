import React from "react";
import { motion } from "framer-motion";
import { Cpu, Shield, Brain } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const PILLARS = [
  {
    icon: Brain,
    title: "Autonomous Cognition",
    body: "Designing multi-agent systems that plan, recall, and execute long-horizon objectives with verifiable provenance.",
  },
  {
    icon: Shield,
    title: "Adversarial Resilience",
    body: "Embedding offensive-security thinking into every layer — from supply-chain attestations to runtime workload identity.",
  },
  {
    icon: Cpu,
    title: "Infrastructure as Substrate",
    body: "Treating the cloud as a programmable substrate for autonomous research labs, not just a deployment target.",
  },
];

export default function Identity() {
  return (
    <section
      id="identity"
      data-testid="identity-section"
      className="relative py-28 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-[420px] h-[420px] rounded-full bg-[#00E5FF] opacity-[0.06] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            01 // Identity
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
            data-testid="identity-portrait-card"
          >
            <div className="relative rounded-[32px] overflow-hidden border border-zinc-800 bg-zinc-950/40 backdrop-blur-2xl">
              <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#00E5FF] opacity-20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[#39FF14] opacity-15 blur-3xl pointer-events-none" />
              <img
                src={PROFILE.portrait}
                alt={PROFILE.name}
                className="w-full aspect-[4/5] object-cover object-center grayscale-[15%] contrast-110"
                data-testid="identity-portrait-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="label-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" /> LIVE
                </span>
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-400">
                  REC // 04:21:09
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00E5FF] mb-1">
                  Operator
                </div>
                <div className="font-display text-2xl text-[#F8FAFC] tracking-tight">
                  {PROFILE.name}
                </div>
                <div className="font-mono text-xs text-slate-400 mt-1">
                  alias: <span className="text-[#39FF14]">@jakethevex</span>
                </div>
              </div>
              {/* corner brackets */}
              <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#00E5FF]" />
              <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#00E5FF]" />
              <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#00E5FF]" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#00E5FF]" />
            </div>
          </motion.div>

          {/* Specialization */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05]"
            >
              I architect autonomous systems that <span className="text-[#00E5FF]">think</span>,
              <br />
              defend themselves, and <span className="text-[#39FF14]">execute</span> at scale.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-slate-300 mt-6 max-w-2xl leading-relaxed"
            >
              Operating at the intersection of AI orchestration, distributed systems, and offensive
              security — I build the infrastructure layer that lets autonomous agents safely run in
              production without a human babysitter.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 hover:border-[#00E5FF]/50 transition-colors"
                  data-testid={`identity-pillar-${i}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-4">
                    <p.icon size={18} className="text-[#00E5FF]" />
                  </div>
                  <div className="font-display text-[#F8FAFC] text-base tracking-tight">{p.title}</div>
                  <div className="text-slate-400 text-sm mt-2 leading-relaxed">{p.body}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
