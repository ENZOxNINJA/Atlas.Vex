import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Download,
  Mail,
  Inbox,
  Send,
  Briefcase,
  MessageSquare,
  Lock,
  Copy,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "atlasvex_admin_token";

// --------------- Helpers ---------------
const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
};

const toCSV = (rows, headers) => {
  if (!rows.length) return headers.join(",") + "\n";
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
};

const downloadCSV = (filename, csv) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// --------------- Login Gate ---------------
function LoginGate({ onSuccess }) {
  const [token, setToken] = useState("");
  const [state, setState] = useState({ status: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setState({ status: "loading", msg: "Authenticating..." });
    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { "X-Admin-Token": token.trim() },
      });
      localStorage.setItem(TOKEN_KEY, token.trim());
      onSuccess(token.trim());
    } catch (err) {
      const code = err?.response?.status;
      setState({
        status: "error",
        msg:
          code === 401
            ? "Token rejected. Channel remains closed."
            : code === 503
            ? "Admin channel not configured on server."
            : "Transmission failed. Retry.",
      });
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-md glow-cyan"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-slate-400 hover:text-cyan mb-6"
        >
          <ArrowLeft className="w-3 h-3" /> Return to Surface
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-5 h-5 text-cyan" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            ATLAS.VEX // SECURE CHANNEL
          </span>
        </div>
        <h1 className="font-display text-3xl text-white mb-2">Admin Inbox</h1>
        <p className="text-sm text-slate-400 mb-6">
          Operator authentication required to access transmission archives.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 mb-2">
              Admin Token
            </label>
            <input
              type="password"
              autoFocus
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-black/40 border border-zinc-800 focus:border-cyan focus:outline-none text-white font-mono text-sm px-4 py-3 rounded-sm transition-colors"
            />
          </div>

          {state.status === "error" && (
            <div className="text-xs font-mono text-[color:var(--danger)] border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/5 px-3 py-2 rounded-sm">
              {state.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={state.status === "loading"}
            className="btn-cta w-full justify-center disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {state.status === "loading" ? "Verifying..." : "Authenticate"}
          </button>
        </form>

        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-600">
          Token configured server-side via <span className="text-slate-400">ADMIN_TOKEN</span>
        </p>
      </motion.div>
    </div>
  );
}

// --------------- Stat Card ---------------
function StatCard({ icon: Icon, label, value, color = "cyan" }) {
  return (
    <div className="glass p-5 rounded-md">
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-4 h-4 text-${color}`} />
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">
          {label}
        </span>
      </div>
      <div className="font-display text-3xl text-white">{value ?? "—"}</div>
    </div>
  );
}

// --------------- Tabs ---------------
const TABS = [
  { id: "contacts", label: "Contacts", icon: Inbox, endpoint: "/contact" },
  { id: "intake", label: "Intake", icon: Briefcase, endpoint: "/intake" },
  { id: "newsletter", label: "Newsletter", icon: Send, endpoint: "/newsletter" },
];

// --------------- Main Inbox ---------------
function Inbox404() {
  return (
    <div className="text-center py-20 text-slate-500 font-mono text-sm">
      <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
      No transmissions in this channel yet.
    </div>
  );
}

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-cyan transition-colors"
      title="Copy"
      aria-label={`Copy ${text}`}
    >
      {done ? (
        <>
          <CheckCircle2 className="w-3 h-3 text-green" aria-hidden="true" /> copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" aria-hidden="true" /> copy
        </>
      )}
    </button>
  );
}

function ContactRow({ row }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      className="border border-zinc-800 hover:border-cyan/40 bg-black/30 rounded-sm px-4 py-3 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium">{row.name}</span>
            <a
              href={`mailto:${row.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-cyan text-xs font-mono hover:underline"
            >
              {row.email}
            </a>
            <CopyBtn text={row.email} />
          </div>
          {row.subject && (
            <div className="text-xs text-slate-400 mt-1 font-mono">↳ {row.subject}</div>
          )}
          <div
            className={`text-sm text-slate-300 mt-2 whitespace-pre-wrap ${
              open ? "" : "line-clamp-2"
            }`}
          >
            {row.message}
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
          {fmtDate(row.timestamp)}
        </div>
      </div>
    </div>
  );
}

function IntakeRow({ row }) {
  return (
    <div className="border border-zinc-800 hover:border-cyan/40 bg-black/30 rounded-sm px-4 py-3 transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium">
              {row.name || <span className="italic text-slate-500">Anonymous lead</span>}
            </span>
            {row.email && (
              <>
                <a
                  href={`mailto:${row.email}`}
                  className="text-cyan text-xs font-mono hover:underline"
                >
                  {row.email}
                </a>
                <CopyBtn text={row.email} />
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] font-mono px-2 py-0.5 border border-cyan/40 text-cyan rounded-sm uppercase tracking-wider">
              {row.project_type}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-amber/40 text-amber rounded-sm uppercase tracking-wider">
              {row.timeline}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-green/40 text-green rounded-sm uppercase tracking-wider">
              {row.budget}
            </span>
          </div>
          {row.notes && (
            <div className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{row.notes}</div>
          )}
          <div className="text-[10px] font-mono text-slate-600 mt-2">
            session: {row.session_id}
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
          {fmtDate(row.timestamp)}
        </div>
      </div>
    </div>
  );
}

function NewsletterRow({ row }) {
  return (
    <div className="border border-zinc-800 hover:border-cyan/40 bg-black/30 rounded-sm px-4 py-3 transition-colors flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Mail className="w-4 h-4 text-cyan flex-shrink-0" />
        <a
          href={`mailto:${row.email}`}
          className="text-white font-mono text-sm hover:text-cyan truncate"
        >
          {row.email}
        </a>
        <CopyBtn text={row.email} />
        <span className="text-[10px] font-mono px-2 py-0.5 border border-zinc-700 text-slate-400 rounded-sm uppercase tracking-wider">
          {row.source || "—"}
        </span>
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
        {fmtDate(row.timestamp)}
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState("contacts");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const headers = useMemo(() => ({ "X-Admin-Token": token }), [token]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/admin/stats`, { headers });
      setStats(data);
    } catch {
      // ignore — handled in tab fetch
    }
  }, [headers]);

  const fetchTab = useCallback(
    async (tabId) => {
      const t = TABS.find((x) => x.id === tabId);
      if (!t) return;
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${API}${t.endpoint}`, { headers });
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.response?.status === 401) {
          onLogout();
          return;
        }
        setError("Channel error. Retry.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [headers, onLogout]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTab(tab);
  }, [tab, fetchTab]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const cols = {
      contacts: ["timestamp", "name", "email", "subject", "message"],
      intake: ["timestamp", "name", "email", "project_type", "timeline", "budget", "notes", "session_id"],
      newsletter: ["timestamp", "email", "source"],
    }[tab];
    downloadCSV(`atlasvex_${tab}_${Date.now()}.csv`, toCSV(filtered, cols));
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan" />
            <div>
              <div className="font-display text-lg text-white leading-none">
                Admin Inbox
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan">
                ATLAS.VEX // OPERATOR CHANNEL
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-xs">
              <ArrowLeft className="w-3 h-3" /> Surface
            </Link>
            <button onClick={onLogout} className="btn-ghost text-xs">
              <LogOut className="w-3 h-3" /> Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8" aria-label="Inbox statistics">
          <StatCard icon={Inbox} label="Contacts" value={stats?.contacts} color="cyan" />
          <StatCard icon={Briefcase} label="Intake" value={stats?.intakes} color="amber" />
          <StatCard icon={Send} label="Newsletter" value={stats?.newsletter} color="green" />
          <StatCard
            icon={MessageSquare}
            label="Chat Sessions"
            value={stats?.chat_sessions}
            color="cyan"
          />
          <StatCard
            icon={MessageSquare}
            label="Chat Msgs"
            value={stats?.chat_messages}
            color="cyan"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap" role="tablist" aria-label="Inbox channels">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-cyan text-cyan bg-cyan/5"
                    : "border-zinc-800 text-slate-400 hover:border-zinc-700 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3 h-3" aria-hidden="true" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <label htmlFor="inbox-search" className="sr-only">Filter transmissions</label>
            <input
              id="inbox-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter transmissions..."
              className="w-full bg-black/40 border border-zinc-800 focus:border-cyan focus:outline-none text-white text-sm pl-10 pr-4 py-2 rounded-sm font-mono"
            />
          </div>
          <button
            onClick={() => {
              fetchTab(tab);
              fetchStats();
            }}
            className="btn-ghost text-xs"
            disabled={loading}
            aria-label="Refresh transmissions"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={!filtered.length}
            className="btn-ghost text-xs disabled:opacity-40"
            aria-label={`Export ${filtered.length} ${tab} as CSV`}
          >
            <Download className="w-3 h-3" aria-hidden="true" /> CSV ({filtered.length})
          </button>
        </div>

        {/* Body */}
        {error && (
          <div className="text-xs font-mono text-[color:var(--danger)] border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/5 px-3 py-2 rounded-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-mono text-xs uppercase tracking-[0.22em]" role="status" aria-live="polite">
            Decrypting transmissions...
          </div>
        ) : filtered.length === 0 ? (
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            <Inbox404 />
          </div>
        ) : (
          <div className="space-y-2" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === "contacts" &&
              filtered.map((r) => <ContactRow key={r.id || r.timestamp} row={r} />)}
            {tab === "intake" &&
              filtered.map((r) => <IntakeRow key={r.id || r.timestamp} row={r} />)}
            {tab === "newsletter" &&
              filtered.map((r) => <NewsletterRow key={r.id || r.email} row={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------- Root ---------------
export default function AdminInbox() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(!!token);

  useEffect(() => {
    let alive = true;
    if (!token) {
      setChecking(false);
      setVerified(false);
      return;
    }
    setChecking(true);
    axios
      .get(`${API}/admin/verify`, { headers: { "X-Admin-Token": token } })
      .then(() => alive && setVerified(true))
      .catch(() => {
        if (!alive) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setVerified(false);
      })
      .finally(() => alive && setChecking(false));
    return () => {
      alive = false;
    };
  }, [token]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setVerified(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">
          Verifying operator clearance...
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <LoginGate
        onSuccess={(t) => {
          setToken(t);
          setVerified(true);
        }}
      />
    );
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
