import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV, PROFILE } from "../data/portfolio";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-2xl bg-[#020617]/80 border-b border-zinc-800/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => handleClick("hero")}
          className="flex items-center gap-3 group"
          data-testid="nav-brand"
        >
          <span className="w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_12px_#39FF14]" />
          <span className="font-display font-bold text-[#F8FAFC] text-base sm:text-lg tracking-tighter">
            ATLAS<span className="text-[#00E5FF]">.</span>VEX
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n.id)}
              data-testid={`nav-link-${n.id}`}
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-slate-400 hover:text-[#00E5FF] transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <button
            onClick={() => handleClick("contact")}
            data-testid="nav-cta-initialize"
            className="btn-cta"
          >
            Initialize Contact
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] blink" />
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-[#F8FAFC]"
          onClick={() => setOpen((s) => !s)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden border-t border-zinc-800 bg-[#020617]/95 backdrop-blur-xl"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n.id)}
                data-testid={`nav-mobile-link-${n.id}`}
                className="text-left font-mono text-xs tracking-[0.22em] uppercase text-slate-300 hover:text-[#00E5FF]"
              >
                {n.label}
              </button>
            ))}
            <button onClick={() => handleClick("contact")} className="btn-cta justify-center mt-2">
              Initialize Contact
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
