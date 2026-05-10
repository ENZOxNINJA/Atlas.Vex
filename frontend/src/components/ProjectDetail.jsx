import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Activity, Layers, Cpu } from "lucide-react";
import { PROJECTS, PROFILE } from "../data/portfolio";

const DEEP = {
  "legion-core": {
    headline: "The autonomous execution mesh.",
    subline:
      "LEGION CORE coordinates fleets of specialised agents — planning, recall, and execution — at production scale.",
    architecture: [
      "Control-plane in Rust (deterministic scheduler, signed inter-agent messaging)",
      "Data-plane workers in Python with hot-swappable agent kernels",
      "Kubernetes-native orchestration with custom CRDs for agent fleets",
      "Event-driven state machines persisted to Postgres + Redis streams",
    ],
    decisions: [
      {
        q: "Why Rust for the control plane?",
        a: "Determinism, memory safety, and predictable latency. Rejected Go for stricter type-level guarantees on agent contracts.",
      },
      {
        q: "How are agent failures handled?",
        a: "Circuit-breakers per kernel + fleet-wide quorum protocol. Failed agents are quarantined and rotated without downtime.",
      },
      {
        q: "Inter-agent trust model?",
        a: "Every message is Ed25519-signed. Identity is workload-bound (no shared secrets), enabling zero-trust mesh communication.",
      },
    ],
    outcomes: [
      "99.98% sync across 12+ heterogeneous agent fleets",
      "Zero-downtime kernel upgrades at fleet scale",
      "Audit-grade traceability across every autonomous decision",
    ],
  },
  "atlas-memory": {
    headline: "Memory for autonomous minds.",
    subline:
      "ATLAS MEMORY gives agents long-horizon recall with audit-grade provenance — the missing layer between LLMs and reality.",
    architecture: [
      "Hybrid storage: pgvector for embeddings + Postgres graph for entity relations",
      "Lineage layer: every retrieval is signed and traceable to source",
      "Streaming ingestion via Redis · backpressure-aware writers",
      "Queryable via gRPC + REST · pluggable embedding models",
    ],
    decisions: [
      {
        q: "Why a hybrid vector + graph design?",
        a: "Pure vector search collapses semantic neighbourhoods. The graph layer preserves causality — critical for agent reasoning.",
      },
      {
        q: "How is memory pruned?",
        a: "Decay-weighted relevance scoring, with provenance-aware eviction. Compliance-tagged data is never auto-deleted.",
      },
      {
        q: "Recall latency target?",
        a: "<100ms p99 for top-k retrieval. Achieved through tiered caching and quantised embeddings on hot paths.",
      },
    ],
    outcomes: [
      "Sub-100ms recall at production scale",
      "Audit-grade lineage from query to source artifact",
      "Drop-in for autonomous-agent stacks (LangGraph, custom)",
    ],
  },
  "omega-security": {
    headline: "Adversarial defense, automated.",
    subline:
      "OMEGA SECURITY embeds offensive-security thinking into the delivery pipeline — continuous threat modeling, autonomous remediation, zero-trust at runtime.",
    architecture: [
      "Continuous threat modeling on every commit (STRIDE-pipeline)",
      "SLSA L3 supply-chain attestations · signed builds · provenance graphs",
      "Workload identity via SPIFFE/SPIRE — no shared secrets",
      "Autonomous remediation playbooks (rollback, isolate, patch) gated by policy",
    ],
    decisions: [
      {
        q: "Why automate remediation?",
        a: "Mean-time-to-respond > mean-time-to-detect kills you. Auto-remediation collapses both into one loop.",
      },
      {
        q: "How is autonomy bounded?",
        a: "Every playbook has a blast-radius envelope. Beyond it, the system pages a human and waits.",
      },
      {
        q: "Why zero-trust at runtime?",
        a: "Network perimeters fail. Workload-bound identity assumes compromise and contains it.",
      },
    ],
    outcomes: [
      "Zero-trust runtime · workload-scoped credentials",
      "Automated SLSA-L3 attestations on every build",
      "Auto-remediation playbooks with policy guardrails",
    ],
  },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);
  const deep = DEEP[id];

  if (!project || !deep) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-mono text-xs tracking-[0.3em] uppercase text-[#FF003C] mb-4">
            // 404 · system not found
          </div>
          <h1 className="font-display text-3xl text-[#F8FAFC] tracking-tighter mb-6">
            Unknown system identifier.
          </h1>
          <Link to="/" className="btn-cta">
            <ArrowLeft size={14} /> Return to ATLAS.VEX
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200" data-testid={`project-detail-${id}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-20 sm:py-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-slate-400 hover:text-[#00E5FF] transition-colors"
          data-testid="project-detail-back"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>

        <div className="mt-10 flex items-center gap-3 flex-wrap">
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase border rounded-full px-2.5 py-1"
            style={{ color: project.accent, borderColor: `${project.accent}55` }}
          >
            Sys/{project.code}
          </span>
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase border rounded-full px-2.5 py-1"
            style={{
              color: project.accent,
              borderColor: `${project.accent}55`,
              background: `${project.accent}10`,
            }}
          >
            • {project.status}
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            {project.year}
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display font-black text-[#F8FAFC] text-5xl sm:text-7xl tracking-tighter leading-[0.95] mt-6"
        >
          {project.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-[#F8FAFC] text-2xl sm:text-3xl tracking-tighter mt-6 max-w-3xl leading-tight"
          style={{ color: project.accent }}
        >
          {deep.headline}
        </motion.p>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mt-4 max-w-3xl">
          {deep.subline}
        </p>

        <div className="mt-10 rounded-[28px] border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-7 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                Repository
              </div>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="text-[#00E5FF] text-sm font-mono mt-2 inline-flex items-center gap-2 hover:underline"
              >
                <Github size={14} />
                {project.repo.replace("https://", "")}
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                Stack
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-300 border border-zinc-700 rounded-full px-2 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                Impact
              </div>
              <div className="text-[#F8FAFC] text-sm mt-2">{project.impact}</div>
            </div>
          </div>
        </div>

        <Section title="Architecture" code="A/01" icon={Layers} accent={project.accent}>
          <ul className="space-y-3">
            {deep.architecture.map((line, i) => (
              <li key={i} className="text-slate-300 text-base leading-relaxed flex gap-3">
                <span className="text-[#00E5FF] mt-2 w-1 h-1 rounded-full bg-current shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Engineering Decisions" code="D/02" icon={Cpu} accent={project.accent}>
          <div className="space-y-6">
            {deep.decisions.map((d, i) => (
              <div key={i} className="border-l border-zinc-800 pl-5">
                <div className="font-display text-[#F8FAFC] text-lg tracking-tight">{d.q}</div>
                <p className="text-slate-400 text-sm leading-relaxed mt-2">{d.a}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Outcomes" code="O/03" icon={Activity} accent={project.accent}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {deep.outcomes.map((o, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"
              >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
                  outcome/{String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[#F8FAFC] text-sm mt-3 leading-relaxed">{o}</div>
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-16 rounded-[28px] border border-zinc-800 bg-zinc-950/60 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#39FF14]">
              ↳ Want this in production?
            </div>
            <div className="font-display text-[#F8FAFC] text-2xl tracking-tighter mt-2">
              Initiate engagement with Mr.Marvel.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/#contact" className="btn-cta">
              Initialize Contact
            </Link>
            <a href={`mailto:${PROFILE.socials.email}`} className="btn-ghost">
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, code, icon: Icon, accent, children }) {
  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ borderColor: `${accent}55`, color: accent, background: `${accent}10` }}
        >
          <Icon size={15} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
          {code}
        </span>
        <span className="font-display text-[#F8FAFC] text-2xl tracking-tighter">{title}</span>
      </div>
      {children}
    </section>
  );
}
