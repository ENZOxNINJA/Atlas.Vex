import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Terminal } from "lucide-react";
import NeuralNetwork from "./NeuralNetwork";
import { PROFILE } from "../data/portfolio";

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* 3D background */}
      <div className="absolute inset-0">
        <NeuralNetwork />
      </div>
      {/* Grid + glow overlays */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#00E5FF] opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#39FF14] opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/60 to-[#020617] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 w-full pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <span className="label-pill" data-testid="hero-status-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" />
            {PROFILE.status}
          </span>
          <span className="hidden sm:inline-flex font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500">
            // sys.id = atlas-vex-001
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black text-[#F8FAFC] mt-8 leading-[0.9] tracking-tighter text-5xl sm:text-7xl lg:text-[8.5rem]"
          data-testid="hero-title"
        >
          ATLAS<span className="text-[#00E5FF]">.</span>VEX
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 flex items-center gap-4"
        >
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-[#00E5FF] to-transparent" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#00E5FF]">
            {PROFILE.title}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 max-w-2xl text-slate-300 text-lg sm:text-xl leading-relaxed"
          data-testid="hero-tagline"
        >
          {PROFILE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => scrollTo("contact")}
            className="btn-cta"
            data-testid="hero-cta-initialize"
          >
            Initialize Contact <ArrowRight size={14} />
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="btn-ghost"
            data-testid="hero-cta-resume"
            title="Resume coming soon"
          >
            <Download size={14} /> Download Dossier
          </a>
          <button
            onClick={() => scrollTo("projects")}
            className="ml-auto hidden md:inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] uppercase text-slate-400 hover:text-[#39FF14]"
            data-testid="hero-cta-systems"
          >
            <Terminal size={14} /> View Systems
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl"
        >
          {[
            { k: "AGENT FLEETS", v: "12+" },
            { k: "UPTIME", v: "99.98%" },
            { k: "REGIONS", v: "GLOBAL" },
            { k: "MODE", v: "AUTONOMOUS" },
          ].map((s) => (
            <div key={s.k} className="border-l border-zinc-800 pl-4">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                {s.k}
              </div>
              <div className="font-display text-xl sm:text-2xl text-[#F8FAFC] mt-1">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
