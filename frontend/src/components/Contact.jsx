import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Send, Mail, Github, Phone } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "Transmitting..." });
    try {
      await axios.post(`${API}/contact`, form);
      setStatus({
        state: "success",
        msg: "Signal received. The operator will respond within 48h.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setStatus({
        state: "error",
        msg: typeof detail === "string" ? detail : "Transmission failed. Try again.",
      });
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900 overflow-hidden"
    >
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00E5FF] opacity-[0.06] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
            06 // Initialize Contact
          </span>
          <div className="divider-x flex-1 max-w-[260px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05]">
              Open a secure channel to{" "}
              <span className="text-[#00E5FF]">ATLAS.VEX</span>.
            </h2>
            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">
              Engagements, autonomous-systems consulting, research collaborations, or red-team
              advisory. All transmissions are reviewed personally.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${PROFILE.socials.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 hover:border-[#00E5FF]/60 transition-colors group"
                data-testid="contact-email-link"
              >
                <span className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center text-[#00E5FF]">
                  <Mail size={16} />
                </span>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                    Direct Channel
                  </div>
                  <div className="font-display text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors">
                    {PROFILE.socials.email}
                  </div>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={PROFILE.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="contact-social-github"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 hover:border-[#39FF14]/60 hover:text-[#39FF14] transition-colors text-slate-300"
                >
                  <Github size={16} />
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-slate-500">
                      Repo
                    </span>
                    <span className="font-mono text-xs text-slate-200">@mrmarvel123</span>
                  </div>
                </a>
                <a
                  href={`tel:${PROFILE.socials.phoneRaw}`}
                  data-testid="contact-phone-link"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 hover:border-[#FFB000]/60 hover:text-[#FFB000] transition-colors text-slate-300"
                >
                  <Phone size={16} />
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-slate-500">
                      Voice
                    </span>
                    <span className="font-mono text-xs text-slate-200">
                      {PROFILE.socials.phone}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[32px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-2xl p-7 sm:p-10"
              data-testid="contact-form"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                  transmit/v1
                </div>
                <span className="label-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" /> Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Operator Name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  testid="contact-input-name"
                />
                <Field
                  label="Comms Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  testid="contact-input-email"
                />
              </div>
              <div className="mt-5">
                <Field
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  testid="contact-input-subject"
                />
              </div>
              <div className="mt-5">
                <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                  Payload
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={6}
                  data-testid="contact-input-message"
                  className="w-full mt-2 bg-transparent border-b border-zinc-700 focus:border-[#00E5FF] outline-none py-3 text-[#F8FAFC] placeholder:text-slate-600 transition-colors resize-none"
                  placeholder="Describe the mission..."
                />
              </div>

              <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
                <div
                  data-testid="contact-status"
                  className={`font-mono text-xs tracking-[0.2em] uppercase ${
                    status.state === "success"
                      ? "text-[#39FF14]"
                      : status.state === "error"
                      ? "text-[#FF003C]"
                      : "text-slate-500"
                  }`}
                >
                  {status.msg || "// awaiting input"}
                </div>
                <button
                  type="submit"
                  className="btn-cta"
                  disabled={status.state === "loading"}
                  data-testid="contact-submit-button"
                >
                  {status.state === "loading" ? "Transmitting..." : "Transmit Signal"}
                  <Send size={14} />
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, type = "text", required, testid }) {
  return (
    <div>
      <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        data-testid={testid}
        className="w-full mt-2 bg-transparent border-b border-zinc-700 focus:border-[#00E5FF] outline-none py-3 text-[#F8FAFC] placeholder:text-slate-600 transition-colors"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
}
