import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Briefcase, CheckCircle2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SESSION_KEY = "atlasvex.chat.session";

const SUGGESTIONS = [
  "Who is Alan Marvel?",
  "Tell me about LEGION CORE",
  "How do I hire him?",
  "What's his tech stack?",
];

const INTAKE_STEPS = [
  {
    key: "project_type",
    prompt: "What kind of system are we building?",
    options: [
      "Autonomous Agent Platform",
      "DevSecOps / Security",
      "AI Infrastructure",
      "Architecture Advisory",
      "Other",
    ],
  },
  {
    key: "timeline",
    prompt: "What's the expected timeline?",
    options: ["< 4 weeks", "4–8 weeks", "2–6 months", "Open / unsure"],
  },
  {
    key: "budget",
    prompt: "Rough budget envelope?",
    options: ["< $5k", "$5k–$10k", "$10k–$25k", "$25k+", "Let's discuss"],
  },
  {
    key: "contact",
    prompt: "Best email or channel to reach you?",
    free: true,
    placeholder: "you@domain.io",
  },
];

function getSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const sid = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sid);
    return sid;
  } catch {
    return `sess-eph-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("chat"); // chat | intake | done
  const [intakeStep, setIntakeStep] = useState(0);
  const [intake, setIntake] = useState({});
  const [intakeFreeText, setIntakeFreeText] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "// Channel open. I'm Atlas Vex — autonomous co-pilot for Mr.Marvel's portfolio. Ask anything, or hit 'Start Engagement Intake' for a structured 60-second brief.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(getSessionId());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, intakeStep, mode]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId.current,
        message: msg,
      });
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "// transmission failed — " +
            (typeof detail === "string" ? detail : "channel disrupted, retry shortly."),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startIntake = () => {
    setMode("intake");
    setIntakeStep(0);
    setIntake({});
    setIntakeFreeText("");
    setMessages((m) => [
      ...m,
      { role: "user", content: "› Start Engagement Intake" },
      {
        role: "assistant",
        content:
          "Engagement intake initialised. Three quick questions, then a comms address. Mr.Marvel will receive your brief instantly.",
      },
    ]);
  };

  const cancelIntake = () => {
    setMode("chat");
    setMessages((m) => [
      ...m,
      { role: "assistant", content: "// intake aborted — back to free chat." },
    ]);
  };

  const submitIntake = async (final) => {
    setLoading(true);
    try {
      const payload = {
        session_id: sessionId.current,
        project_type: final.project_type,
        timeline: final.timeline,
        budget: final.budget,
        email: final.email || null,
        notes: final.notes || null,
      };
      const res = await axios.post(`${API}/intake`, payload);
      setMode("done");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `Brief transmitted. Reference id: ${res.data.id.slice(0, 8)}. ` +
            `Mr.Marvel will respond within 48h via ${final.email}. ` +
            "You can also reach him directly on WhatsApp from the contact section.",
          success: true,
        },
      ]);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let m = "Intake failed — try again or use the contact form.";
      if (Array.isArray(detail) && detail[0]?.msg) m = detail[0].msg;
      else if (typeof detail === "string") m = detail;
      setMessages((mm) => [...mm, { role: "assistant", content: `// ${m}`, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleIntakeChoice = (value) => {
    const step = INTAKE_STEPS[intakeStep];
    const next = { ...intake };
    if (step.key === "contact") {
      next.email = value;
    } else {
      next[step.key] = value;
    }
    setIntake(next);
    setMessages((m) => [...m, { role: "user", content: value }]);

    if (intakeStep + 1 < INTAKE_STEPS.length) {
      setIntakeStep(intakeStep + 1);
      const nextStep = INTAKE_STEPS[intakeStep + 1];
      setMessages((m) => [...m, { role: "assistant", content: nextStep.prompt }]);
    } else {
      // submit
      submitIntake(next);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (mode === "intake" && INTAKE_STEPS[intakeStep]?.free) {
        if (intakeFreeText.trim()) {
          handleIntakeChoice(intakeFreeText.trim());
          setIntakeFreeText("");
        }
      } else {
        send();
      }
    }
  };

  // Show first intake prompt right after starting
  useEffect(() => {
    if (mode === "intake" && intakeStep === 0 && !intake.project_type) {
      setMessages((m) => {
        // avoid duplicate prompt insertion
        if (m[m.length - 1]?.content === INTAKE_STEPS[0].prompt) return m;
        return [...m, { role: "assistant", content: INTAKE_STEPS[0].prompt }];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="chatbot-toggle"
        className="fixed bottom-6 left-6 z-[60] group"
        aria-label="Open Atlas Vex chat"
      >
        <span className="absolute inset-0 rounded-full bg-[#00E5FF] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
        <span className="relative flex items-center gap-2 pl-4 pr-5 py-3 rounded-full border border-[#00E5FF]/60 bg-[#020617]/90 backdrop-blur-xl text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors">
          <span className="relative flex">
            <Bot size={18} />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_10px_#39FF14]" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase">
            {open ? "Close" : "Atlas Vex"}
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 left-4 sm:left-6 z-[55] w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[600px] max-h-[80vh] rounded-[28px] border border-zinc-800 bg-[#020617]/95 backdrop-blur-2xl flex flex-col overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,229,255,0.35)]"
            data-testid="chatbot-panel"
          >
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative w-9 h-9 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                  <Sparkles size={15} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_8px_#39FF14]" />
                </span>
                <div>
                  <div className="font-display text-[#F8FAFC] text-sm tracking-tight">
                    Atlas Vex
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#39FF14]">
                    {mode === "intake" ? "intake mode · live" : mode === "done" ? "brief logged" : "online · co-pilot"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                data-testid="chatbot-close"
                className="text-slate-500 hover:text-[#F8FAFC] p-1"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar"
              data-testid="chatbot-messages"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#F8FAFC]"
                        : m.error
                        ? "bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF6B86]"
                        : m.success
                        ? "bg-[#39FF14]/10 border border-[#39FF14]/30 text-slate-100"
                        : "bg-zinc-950/60 border border-zinc-800 text-slate-200"
                    }`}
                  >
                    {m.success && (
                      <CheckCircle2
                        size={14}
                        className="text-[#39FF14] inline mr-2 -mt-0.5"
                      />
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-zinc-950/60 border border-zinc-800 text-slate-400 text-sm font-mono tracking-wider">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] blink" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] blink"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] blink"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </span>
                  </div>
                </div>
              )}

              {/* Intake choice chips */}
              {mode === "intake" && !loading && INTAKE_STEPS[intakeStep] && !INTAKE_STEPS[intakeStep].free && (
                <div className="flex flex-wrap gap-2 pt-1" data-testid="intake-options">
                  {INTAKE_STEPS[intakeStep].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleIntakeChoice(opt)}
                      data-testid={`intake-option-${INTAKE_STEPS[intakeStep].key}-${opt.slice(0, 6)}`}
                      className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-200 border border-zinc-700 hover:border-[#00E5FF] hover:text-[#00E5FF] rounded-full px-3 py-1.5 transition-colors bg-zinc-950/50"
                    >
                      {opt}
                    </button>
                  ))}
                  <button
                    onClick={cancelIntake}
                    className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-500 hover:text-[#FF003C] px-3 py-1.5"
                  >
                    abort
                  </button>
                </div>
              )}
            </div>

            {/* Suggestions (only in chat mode + first turn) */}
            {mode === "chat" && messages.length <= 1 && !loading && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                <button
                  onClick={startIntake}
                  data-testid="chatbot-start-intake"
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#39FF14] border border-[#39FF14]/40 bg-[#39FF14]/10 rounded-full px-3 py-1.5 hover:bg-[#39FF14]/20 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Briefcase size={11} /> Start Engagement Intake
                </button>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    data-testid={`chatbot-suggestion-${s.slice(0, 8)}`}
                    className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-300 border border-zinc-800 rounded-full px-3 py-1.5 hover:border-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              {mode === "intake" && INTAKE_STEPS[intakeStep]?.free ? (
                <div className="flex items-end gap-2">
                  <input
                    type="email"
                    value={intakeFreeText}
                    onChange={(e) => setIntakeFreeText(e.target.value)}
                    onKeyDown={onKey}
                    placeholder={INTAKE_STEPS[intakeStep].placeholder}
                    data-testid="intake-free-input"
                    className="flex-1 bg-zinc-950/60 border border-zinc-800 focus:border-[#00E5FF] outline-none rounded-2xl px-4 py-3 text-[#F8FAFC] placeholder:text-slate-600 font-mono text-xs leading-relaxed transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (intakeFreeText.trim()) {
                        handleIntakeChoice(intakeFreeText.trim());
                        setIntakeFreeText("");
                      }
                    }}
                    disabled={loading || !intakeFreeText.trim()}
                    data-testid="intake-free-submit"
                    className="w-11 h-11 rounded-2xl border border-[#39FF14]/50 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    aria-label="Submit"
                  >
                    <Send size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    placeholder={
                      mode === "intake"
                        ? "Pick an option above ↑"
                        : "Transmit query to Atlas Vex..."
                    }
                    rows={1}
                    disabled={mode === "intake"}
                    data-testid="chatbot-input"
                    className="flex-1 bg-zinc-950/60 border border-zinc-800 focus:border-[#00E5FF] outline-none rounded-2xl px-4 py-3 text-[#F8FAFC] placeholder:text-slate-600 font-mono text-xs leading-relaxed resize-none transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={() => send()}
                    disabled={loading || !input.trim() || mode === "intake"}
                    data-testid="chatbot-send"
                    className="w-11 h-11 rounded-2xl border border-[#00E5FF]/50 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between font-mono text-[9px] tracking-[0.25em] uppercase text-slate-600">
                <span>encrypted · session {sessionId.current.slice(-6)}</span>
                {mode === "done" && (
                  <button
                    onClick={() => {
                      setMode("chat");
                      setMessages((m) => [
                        ...m,
                        { role: "assistant", content: "// channel reset — ask anything else." },
                      ]);
                    }}
                    className="text-[#00E5FF] hover:underline"
                  >
                    new query
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
