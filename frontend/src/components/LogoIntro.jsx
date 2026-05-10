import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "atlasvex.intro.shown";
const FINAL_TEXT = "ATLAS.VEX";
const GLITCH_CHARS = "▓▒░█▌▐■◆◇∇∆⌬✕01<>/\\";

function scramble(target, progress) {
  // progress 0 → fully scrambled; 1 → fully revealed
  const len = target.length;
  let out = "";
  for (let i = 0; i < len; i++) {
    const ch = target[i];
    const reveal = (i + 1) / len;
    if (progress > reveal) {
      out += ch;
    } else if (ch === ".") {
      out += ".";
    } else {
      out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
  }
  return out;
}

export default function LogoIntro() {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });
  const [text, setText] = useState(FINAL_TEXT);
  const [phase, setPhase] = useState("scrambling"); // scrambling -> stable -> exit

  useEffect(() => {
    if (!visible) return;
    let raf;
    let start = performance.now();
    const SCRAMBLE_MS = 1100;
    const HOLD_MS = 700;

    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / SCRAMBLE_MS, 1);
      setText(scramble(FINAL_TEXT, p));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setText(FINAL_TEXT);
        setPhase("stable");
        setTimeout(() => setPhase("exit"), HOLD_MS);
        setTimeout(() => {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {}
          setVisible(false);
        }, HOLD_MS + 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [visible]);

  const skip = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center overflow-hidden"
          data-testid="logo-intro"
          onClick={skip}
        >
          {/* grid bg */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#00E5FF] opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#39FF14] opacity-15 blur-3xl pointer-events-none" />

          {/* Top status strip */}
          <div className="absolute top-8 left-0 right-0 px-6 sm:px-12 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" />
              <span>boot · sequence init</span>
            </div>
            <div>v0.4.0 // 2026</div>
          </div>

          {/* Lower scan ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "scrambling" ? 1 : 0 }}
            className="absolute bottom-12 left-0 right-0 text-center font-mono text-[10px] tracking-[0.4em] uppercase text-[#00E5FF]"
          >
            // initialising autonomous interface
          </motion.div>

          {/* Skip hint */}
          <motion.button
            onClick={skip}
            data-testid="logo-intro-skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-12 right-8 sm:right-12 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-400 hover:text-[#00E5FF] transition-colors"
          >
            skip ⌫
          </motion.button>

          {/* Brand */}
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#00E5FF] mb-6"
            >
              [ atlas vex // autonomous intelligence systems ]
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display font-black text-[#F8FAFC] text-5xl sm:text-7xl lg:text-9xl tracking-tighter leading-[0.9] select-none"
            >
              {text.split("").map((ch, i) => (
                <span
                  key={i}
                  className={ch === "." ? "text-[#00E5FF]" : ""}
                  style={
                    phase === "stable"
                      ? { textShadow: "0 0 18px rgba(0,229,255,0.55)" }
                      : undefined
                  }
                >
                  {ch}
                </span>
              ))}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: phase === "stable" || phase === "exit" ? "60%" : "0%" }}
              transition={{ duration: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto mt-8"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== "scrambling" ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#39FF14] mt-6"
            >
              › channel open
            </motion.div>
          </div>

          {/* scanline */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "120vh" }}
            transition={{ duration: 1.2, ease: "linear", repeat: 1 }}
            className="absolute inset-x-0 h-[2px] bg-[#00E5FF]/20 blur-[1px] pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
