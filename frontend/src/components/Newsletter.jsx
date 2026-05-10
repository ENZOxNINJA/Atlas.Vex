import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ state: "loading", msg: "Securing channel..." });
    try {
      await axios.post(`${API}/newsletter`, { email });
      setStatus({
        state: "success",
        msg: "Subscribed. Expect signal — not noise.",
      });
      setEmail("");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let m = "Subscription failed. Try again.";
      if (Array.isArray(detail) && detail[0]?.msg) m = detail[0].msg;
      else if (typeof detail === "string") m = detail;
      setStatus({ state: "error", msg: m });
    }
  };

  return (
    <section
      data-testid="newsletter-section"
      className="relative py-20 border-t border-zinc-900"
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[500px] h-[280px] rounded-full bg-[#00E5FF] opacity-[0.05] blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                <Mail size={16} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00E5FF]">
                Field Dispatch · low-frequency
              </span>
            </div>
            <h3 className="font-display font-bold text-[#F8FAFC] text-2xl sm:text-3xl lg:text-4xl tracking-tighter leading-[1.05]">
              Notes from the autonomous-systems frontline.
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-md">
              ~1 transmission per month. Architecture deep-dives, security findings, and the rare
              pre-release. No spam. Unsubscribe in one click.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-5 w-full"
            data-testid="newsletter-form"
          >
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
              Comms Address
            </label>
            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.io"
                data-testid="newsletter-email-input"
                className="flex-1 bg-transparent border border-zinc-700 focus:border-[#00E5FF] outline-none rounded-xl px-4 py-3 text-[#F8FAFC] placeholder:text-slate-600 transition-colors font-mono text-sm"
              />
              <button
                type="submit"
                disabled={status.state === "loading"}
                data-testid="newsletter-submit-button"
                className="btn-cta justify-center"
              >
                {status.state === "loading" ? "..." : "Subscribe"}
              </button>
            </div>
            <div
              data-testid="newsletter-status"
              className={`mt-3 font-mono text-[10px] tracking-[0.22em] uppercase ${
                status.state === "success"
                  ? "text-[#39FF14]"
                  : status.state === "error"
                  ? "text-[#FF003C]"
                  : "text-slate-500"
              }`}
            >
              {status.msg || "// awaiting input"}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
