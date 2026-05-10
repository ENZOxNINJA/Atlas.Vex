import React from "react";
import { PROFILE } from "../data/portfolio";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-zinc-900">
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
              Operator
            </div>
            <div className="text-[#F8FAFC] text-sm mt-2 font-display tracking-tight">
              {PROFILE.name}
            </div>
            <div className="text-slate-500 text-xs mt-1 font-mono">@mrmarvel123</div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
              Response SLA
            </div>
            <div className="text-[#F8FAFC] text-sm mt-2">≤ 48 hours</div>
            <div className="text-slate-500 text-xs mt-1 font-mono">Mon–Fri · UTC+8</div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
              Availability
            </div>
            <div className="text-[#39FF14] text-sm mt-2">Open · Q3-Q4 2026</div>
            <div className="text-slate-500 text-xs mt-1 font-mono">Selective engagements</div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
              Location
            </div>
            <div className="text-[#F8FAFC] text-sm mt-2">{PROFILE.location}</div>
            <div className="text-slate-500 text-xs mt-1 font-mono">Remote-first</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_12px_#39FF14]" />
            <span className="font-display font-bold text-[#F8FAFC] tracking-tighter">
              ATLAS<span className="text-[#00E5FF]">.</span>VEX
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
              // {PROFILE.brandSub}
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            © {new Date().getFullYear()} {PROFILE.alias} — All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
