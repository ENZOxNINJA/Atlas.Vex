import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Mail, Phone, Globe, Github } from "lucide-react";
import {
  PROFILE,
  EXPERIENCE,
  PROJECTS,
  STACK,
  CREDENTIALS,
  SERVICES,
} from "../data/portfolio";

export default function Resume() {
  useEffect(() => {
    document.title = `${PROFILE.name} — Dossier`;
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="resume-page min-h-screen bg-[#020617] text-slate-200">
      {/* Top bar — hidden in print */}
      <div className="resume-toolbar print:hidden border-b border-zinc-900 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-slate-400 hover:text-cyan transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Return to Portfolio
          </Link>
          <button
            onClick={handlePrint}
            className="btn-cta"
            aria-label="Download dossier as PDF"
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 print:py-0 print:px-0 print:max-w-none">
        {/* Header */}
        <header className="resume-header pb-8 border-b border-zinc-800 print:border-zinc-300">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-cyan mb-2 print:text-[#00838f]">
                ATLAS.VEX // AUTONOMOUS INTELLIGENCE SYSTEMS
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white print:text-black">
                {PROFILE.name}
              </h1>
              <div className="text-cyan mt-2 font-mono text-sm tracking-wider print:text-[#00838f]">
                {PROFILE.title} · @{PROFILE.alias.replace(".", "").toLowerCase()}
              </div>
              <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed text-sm print:text-slate-700">
                {PROFILE.tagline}
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 print:text-slate-700">
                <Mail className="w-3 h-3 text-cyan print:text-[#00838f]" />
                <a href={`mailto:${PROFILE.socials.email}`} className="hover:text-cyan">
                  {PROFILE.socials.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300 print:text-slate-700">
                <Phone className="w-3 h-3 text-cyan print:text-[#00838f]" />
                <span>{PROFILE.socials.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 print:text-slate-700">
                <Github className="w-3 h-3 text-cyan print:text-[#00838f]" />
                <a
                  href={PROFILE.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan break-all"
                >
                  github.com/mrmarvel123
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300 print:text-slate-700">
                <Globe className="w-3 h-3 text-cyan print:text-[#00838f]" />
                <span>{PROFILE.location}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mission */}
        <Section title="Mission">
          <p className="text-slate-300 leading-relaxed text-sm print:text-slate-700">
            {PROFILE.mission}
          </p>
        </Section>

        {/* Experience */}
        <Section title="Experience">
          <div className="space-y-6">
            {EXPERIENCE.map((e, i) => (
              <article key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-white print:text-black">
                      {e.role}
                    </h3>
                    {e.status === "active" && (
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-green border border-green/40 bg-green/10 px-2 py-0.5 rounded-sm print:border-[#0e7c0e] print:text-[#0e7c0e] print:bg-transparent">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500">
                    {e.period}
                  </div>
                </div>
                <div className="text-cyan font-mono text-xs mt-1 print:text-[#00838f]">
                  {e.company} · {e.location}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {e.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="text-slate-300 text-sm leading-relaxed flex gap-2 print:text-slate-700"
                    >
                      <span className="text-cyan print:text-[#00838f]">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        {/* Featured Systems */}
        <Section title="Featured Systems">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className="border border-zinc-800 print:border-zinc-300 rounded-md p-4 break-inside-avoid"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-mono text-[9px] tracking-[0.22em] uppercase"
                    style={{ color: p.accent }}
                  >
                    SYS/{p.code} · {p.status}
                  </span>
                </div>
                <h4 className="font-display text-base font-semibold text-white print:text-black">
                  {p.name}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mt-1 print:text-slate-600">
                  {p.summary}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-mono px-2 py-0.5 border border-zinc-700 text-slate-400 rounded-sm print:border-zinc-400 print:text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-2 print:text-slate-600">
                  ↳ {p.impact}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Stack */}
        <Section title="Technical Stack">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 print:grid-cols-2">
            {STACK.map((cat) => (
              <div key={cat.category} className="break-inside-avoid">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan mb-2 print:text-[#00838f]">
                  {cat.category}
                </div>
                <div className="text-slate-300 text-sm print:text-slate-700">
                  {cat.items.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Certifications + Education */}
        <Section title="Credentials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="break-inside-avoid">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan mb-3 print:text-[#00838f]">
                Certifications
              </div>
              <ul className="space-y-2">
                {CREDENTIALS.certifications.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <div>
                      <span className="text-white print:text-black font-medium">
                        {c.name}
                      </span>
                      <span className="text-slate-500 ml-2 text-xs print:text-slate-600">
                        · {c.issuer}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 whitespace-nowrap print:text-slate-600">
                      {c.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="break-inside-avoid">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan mb-3 print:text-[#00838f]">
                Education
              </div>
              <ul className="space-y-3">
                {CREDENTIALS.education.map((e, i) => (
                  <li key={i}>
                    <div className="text-white text-sm print:text-black font-medium">
                      {e.degree}
                    </div>
                    <div className="text-slate-400 text-xs print:text-slate-600">
                      {e.institution}
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 mt-0.5">
                      {e.period}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Engagement Modes */}
        <Section title="Engagement Modes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.code}
                className="border border-zinc-800 print:border-zinc-300 rounded-md p-3 break-inside-avoid"
              >
                <div
                  className="font-mono text-[9px] tracking-[0.22em] uppercase mb-1"
                  style={{ color: s.accent }}
                >
                  {s.code}
                </div>
                <div className="font-display text-sm font-semibold text-white print:text-black">
                  {s.title}
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed mt-2 print:text-slate-600">
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-zinc-800 print:border-zinc-300">
          <div className="flex items-center justify-between flex-wrap gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 print:text-slate-600">
            <span>// Dossier · ATLAS.VEX · v2026.05</span>
            <span>Response SLA ≤48h Mon–Fri UTC+8</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-8 print:mt-6 print:break-inside-auto">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase text-cyan print:text-[#00838f]">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan/40 to-transparent print:bg-zinc-300" />
      </div>
      {children}
    </section>
  );
}
