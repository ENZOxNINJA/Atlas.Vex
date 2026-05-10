import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, GitBranch, ExternalLink } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default function GithubFeed() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancel = false;
    axios
      .get(`${API}/github/repos`)
      .then((res) => {
        if (!cancel) setRepos(res.data);
      })
      .catch(() => !cancel && setError(true));
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <section
      id="github"
      data-testid="github-section"
      className="relative py-28 sm:py-32 border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-center justify-between gap-3 mb-12 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#00E5FF]">
              09 // Open Source Pulse
            </span>
            <div className="divider-x flex-1 max-w-[160px]" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" />
            live · github API
          </div>
        </div>

        <h2 className="font-display font-bold text-[#F8FAFC] text-3xl sm:text-4xl lg:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
          Latest activity from the <span className="text-[#00E5FF]">repositories</span>.
        </h2>
        <p className="text-slate-400 text-sm mt-4 max-w-xl">
          Auto-pulled from <span className="text-slate-300">@mrmarvel123</span>,{" "}
          <span className="text-slate-300">@ENZOxNINJA</span>, and{" "}
          <span className="text-slate-300">@AtlasTheDev123</span>. Sorted by most recent push.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {error && (
            <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 text-slate-400 text-sm">
              Channel temporarily unavailable. Retry shortly.
            </div>
          )}
          {!repos && !error &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 animate-pulse h-32"
              />
            ))}
          {repos &&
            repos.map((r, i) => (
              <motion.a
                key={`${r.full_name}-${i}`}
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 hover:border-[#00E5FF]/50 transition-colors block"
                data-testid={`github-repo-${i}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <GitBranch size={14} className="text-[#00E5FF] shrink-0" />
                    <span className="font-mono text-xs text-slate-500 shrink-0">{r.owner}/</span>
                    <span className="font-display text-[#F8FAFC] text-base tracking-tight truncate">
                      {r.name}
                    </span>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-slate-600 group-hover:text-[#00E5FF] shrink-0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {r.description || "No description provided."}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500">
                  <div className="flex items-center gap-3">
                    {r.language && (
                      <span className="text-[#39FF14]">{r.language}</span>
                    )}
                    {r.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={11} /> {r.stargazers_count}
                      </span>
                    )}
                  </div>
                  <span>{timeAgo(r.updated_at)}</span>
                </div>
              </motion.a>
            ))}
        </div>
      </div>
    </section>
  );
}
