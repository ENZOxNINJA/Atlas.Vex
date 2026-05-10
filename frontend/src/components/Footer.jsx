import React from "react";
import { PROFILE } from "../data/portfolio";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-zinc-900 py-10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_12px_#39FF14]" />
          <span className="font-display font-bold text-[#F8FAFC] tracking-tighter">
            ATLAS<span className="text-[#00E5FF]">.</span>VEX
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            // {PROFILE.location}
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
          © {new Date().getFullYear()} {PROFILE.alias} — All systems operational
        </div>
      </div>
    </footer>
  );
}
