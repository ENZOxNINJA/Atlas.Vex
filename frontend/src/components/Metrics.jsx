import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Activity, Zap, Database, ShieldCheck } from "lucide-react";

const ICONS = [Activity, Zap, Database, ShieldCheck];
const STATIC = [
  { label: "Agent Synchronization", display: "99.98%", note: "Realtime mesh sync" },
  { label: "Execution Pipelines", display: "REALTIME", note: "Event-driven streaming" },
  { label: "Memory Persistence", display: "DISTRIBUTED", note: "Vector + graph nodes" },
  { label: "Security Layer", display: "ADAPTIVE", note: "Zero-trust runtime" },
];

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Metrics() {
  const [tele, setTele] = useState(null);

  useEffect(() => {
    let cancel = false;
    const fetchTele = async () => {
      try {
        const res = await axios.get(`${API}/telemetry`);
        if (!cancel) setTele(res.data);
      } catch (e) {
        // silent — fallback to STATIC
      }
    };
    fetchTele();
    const t = setInterval(fetchTele, 4000);
    return () => {
      cancel = true;
      clearInterval(t);
    };
  }, []);

  return (
    <section
      id="metrics"
      data-testid="metrics-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center justify-between gap-3 mb-12 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
              05 // Live Telemetry
            </span>
            <div className="divider-x flex-1 max-w-[160px]" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" />
            stream/atlas-vex // ws-feed
          </div>
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          The control room.{" "}
          <span className="text-slate-500">Live operational signal across the stack.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-[32px] overflow-hidden">
          {STATIC.map((m, i) => {
            const Icon = ICONS[i];
            const live = tele && tele[i];
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative bg-[#020617] p-7 group hover:bg-[#0a0a14] transition-colors"
                data-testid={`metric-card-${i}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center text-[#00E5FF]">
                    <Icon size={16} />
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
                    M/{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 mt-6">
                  {m.label}
                </div>
                <div
                  className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#F8FAFC] mt-2 tracking-tighter"
                  data-testid={`metric-value-${i}`}
                >
                  {live ? `${live.value}${live.unit ? ` ${live.unit}` : ""}` : m.display}
                </div>
                <div className="text-slate-500 text-xs mt-3 font-mono">{m.note}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
