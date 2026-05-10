import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Briefcase, CheckCircle2, Mic, MicOff, Camera, Video, Volume2, VolumeX } from "lucide-react";
import AiFaceLogo from "./AiFaceLogo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SESSION_KEY = "atlasvex.chat.session";
const POS_KEY = "atlasvex.chat.btn.pos";

const DEFAULT_POS = () => {
  if (typeof window === "undefined") return { x: 24, y: 0 };
  // bottom-left default: 24px from left, 24px from bottom
  return { x: 24, y: window.innerHeight - 80 };
};

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
  
  // Voice & Media controls
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [viewTab, setViewTab] = useState("chat"); // chat | voice | camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

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

  // ---- Draggable toggle position ----
  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem(POS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p?.x === "number" && typeof p?.y === "number") return p;
      }
    } catch {}
    return DEFAULT_POS();
  });
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  });

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i].transcript;
          if (event.results[i].isFinal) {
            if (transcript.trim()) {
              send(transcript.trim());
            }
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Voice control function
  const startVoiceChat = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setVoiceActive(true);
    }
  };

  const stopVoiceChat = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setVoiceActive(false);
      setIsListening(false);
    }
  };

  // Text-to-Speech function
  const speakMessage = (text) => {
    if ("speechSynthesis" in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Camera control
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Sandbox mode - AI can control screen
  const [sandboxMode, setSandboxMode] = useState(false);
  const [aiCommands, setAiCommands] = useState([]);

  const toggleSandboxMode = () => {
    setSandboxMode(!sandboxMode);
    if (!sandboxMode) {
      setAiCommands([]);
    }
  };

  // AI Screen Control (Sandbox Mode)
  const executeAiCommand = (command) => {
    if (!sandboxMode) return;
    
    const cmd = command.toLowerCase();
    setAiCommands(prev => [...prev, { command: cmd, timestamp: Date.now() }]);
    
    // Simulate AI screen control
    if (cmd.includes('scroll')) {
      window.scrollBy({ top: 100, behavior: 'smooth' });
    } else if (cmd.includes('zoom')) {
      // Note: Actual zoom control would require more complex implementation
      console.log('AI attempting zoom control');
    } else if (cmd.includes('navigate')) {
      // Note: Navigation would require routing integration
      console.log('AI attempting navigation');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopVoiceChat();
      stopCamera();
      window.speechSynthesis.cancel();
    };
  }, []);

  // Keep within viewport on resize
  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        const w = 180;
        const h = 56;
        return {
          x: Math.max(8, Math.min(p.x, window.innerWidth - w - 8)),
          y: Math.max(8, Math.min(p.y, window.innerHeight - h - 8)),
        };
      });
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const persistPos = (p) => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(p));
    } catch {}
  };

  const onPointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    e.target.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true;
    }
    if (!d.moved) return;
    const w = 180;
    const h = 56;
    const nx = Math.max(8, Math.min(d.origX + dx, window.innerWidth - w - 8));
    const ny = Math.max(8, Math.min(d.origY + dy, window.innerHeight - h - 8));
    setPos({ x: nx, y: ny });
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    if (d.moved) {
      persistPos(pos);
      // suppress click that follows a drag
      e.stopPropagation();
    } else {
      setOpen((v) => !v);
    }
    dragRef.current = { ...dragRef.current, pointerId: null, moved: false };
  };

  // Compute panel anchor based on toggle position
  const isLeft = pos.x < (typeof window !== "undefined" ? window.innerWidth / 2 : 720);
  const isTop = pos.y < (typeof window !== "undefined" ? window.innerHeight / 2 : 400);

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

    // Execute AI commands in sandbox mode
    if (sandboxMode) {
      executeAiCommand(msg);
    }

    try {
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId.current,
        message: msg,
      });
      const aiResponse = res.data.reply;
      setMessages((m) => [...m, { role: "assistant", content: aiResponse }]);
      
      // Speak AI response if voice is enabled
      if (voiceEnabled) {
        speakMessage(aiResponse);
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const errorMsg =
        "// transmission failed — " +
        (typeof detail === "string" ? detail : "channel disrupted, retry shortly.");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: errorMsg,
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
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        data-testid="chatbot-toggle"
        role="button"
        tabIndex={0}
        aria-label={open ? "Close Atlas Vex chat" : "Open Atlas Vex chat (drag to move)"}
        aria-expanded={open}
        style={{ left: pos.x, top: pos.y, touchAction: "none" }}
        className="fixed z-[60] group cursor-grab active:cursor-grabbing select-none"
      >
        <span className="absolute -inset-2 rounded-full bg-[#00E5FF] opacity-25 blur-2xl group-hover:opacity-50 transition-opacity pointer-events-none" />
        <span className="relative flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border border-[#00E5FF]/60 bg-[#020617]/90 backdrop-blur-xl text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors pointer-events-none">
          <span className="relative">
            <AiFaceLogo size={40} speaking={aiSpeaking} listening={isListening && !aiSpeaking} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#39FF14] blink shadow-[0_0_10px_#39FF14]" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase">
            {open ? "Close" : "Atlas Vex"}
          </span>
          {isListening && <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] blink" />}
          <span
            className="ml-1 font-mono text-[9px] tracking-[0.3em] text-slate-500 hidden sm:inline"
            title="Drag to move"
          >
            ⋮⋮
          </span>
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              left: isLeft ? Math.max(16, pos.x) : "auto",
              right: isLeft ? "auto" : Math.max(16, window.innerWidth - pos.x - 180),
              bottom: isTop ? "auto" : Math.max(16, window.innerHeight - pos.y + 12),
              top: isTop ? Math.max(16, pos.y + 64) : "auto",
            }}
            className="fixed z-[55] w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[600px] max-h-[80vh] rounded-[28px] border border-zinc-800 bg-[#020617]/95 backdrop-blur-2xl flex flex-col overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,229,255,0.35)]"
            data-testid="chatbot-panel"
          >
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="relative w-10 h-10 flex items-center justify-center">
                  <AiFaceLogo size={40} speaking={aiSpeaking} listening={isListening && !aiSpeaking} />
                </span>
                <div className="flex-1">
                  <div className="font-display text-[#F8FAFC] text-sm tracking-tight">
                    Atlas Vex
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#39FF14]">
                    {mode === "intake" ? "intake mode · live" : mode === "done" ? "brief logged" : "online · co-pilot"}
                  </div>
                </div>
              </div>

              {/* Voice & Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  title={voiceEnabled ? "Disable voice output" : "Enable voice output"}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceEnabled ? "text-[#39FF14] bg-[#39FF14]/10" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                {voiceEnabled && (
                  <button
                    onClick={voiceActive ? stopVoiceChat : startVoiceChat}
                    title={voiceActive ? "Stop listening" : "Start voice input"}
                    className={`p-2 rounded-lg transition-colors ${
                      voiceActive
                        ? "text-[#FF003C] bg-[#FF003C]/10 blink"
                        : "text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20"
                    }`}
                  >
                    {voiceActive ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}

                {/* Sandbox Mode Toggle */}
                <button
                  onClick={toggleSandboxMode}
                  title={sandboxMode ? "Disable AI screen control" : "Enable AI screen control (Sandbox)"}
                  className={`p-2 rounded-lg transition-colors font-mono text-xs tracking-wider ${
                    sandboxMode
                      ? "text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/50"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {sandboxMode ? "SANDBOX" : "SAFE"}
                </button>

                <button
                  onClick={() => setOpen(false)}
                  data-testid="chatbot-close"
                  className="text-slate-500 hover:text-[#F8FAFC] p-2"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* View Tabs */}
            <div className="px-5 py-3 border-b border-zinc-800 flex gap-2">
              {["chat", "voice", "camera"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setViewTab(tab)}
                  className={`capitalize font-mono text-xs tracking-[0.15em] px-3 py-1.5 rounded-full transition-colors ${
                    viewTab === tab
                      ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50"
                      : "bg-zinc-950/50 text-slate-400 border border-zinc-800 hover:border-[#00E5FF]/30"
                  }`}
                >
                  {tab === "chat" && "Chat"}
                  {tab === "voice" && "Voice"}
                  {tab === "camera" && "Camera"}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {viewTab === "chat" && (
              <>
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

                {/* Suggestions */}
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
              </>
            )}

            {/* Voice View */}
            {viewTab === "voice" && (
              <div className="flex-1 p-5 flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <div className="font-mono text-sm text-slate-300 mb-4">
                    Voice Chat Mode
                  </div>
                  <button
                    onClick={voiceActive ? stopVoiceChat : startVoiceChat}
                    className={`w-24 h-24 rounded-full transition-all flex items-center justify-center font-mono text-sm tracking-wider ${
                      voiceActive
                        ? "bg-[#FF003C]/20 border-2 border-[#FF003C] text-[#FF003C] blink"
                        : "bg-[#00E5FF]/10 border-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/20"
                    }`}
                  >
                    {voiceActive ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                  <div className="mt-4 font-mono text-xs text-slate-500">
                    {isListening ? (
                      <>
                        <span className="text-[#39FF14]">● </span>
                        Listening...
                      </>
                    ) : voiceActive ? (
                      <>
                        <span className="text-slate-400">● </span>
                        Ready
                      </>
                    ) : (
                      <>
                        <span className="text-slate-600">● </span>
                        Offline
                      </>
                    )}
                  </div>
                </div>

                {/* Sandbox Mode Controls */}
                {sandboxMode && (
                  <div className="w-full border-t border-zinc-800 pt-4 mt-4">
                    <div className="text-xs text-slate-500 mb-3 font-mono tracking-wider">
                      AI SCREEN CONTROL · SANDBOX MODE
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        onClick={() => executeAiCommand("scroll down")}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-mono text-xs rounded transition-colors"
                      >
                        Scroll Down
                      </button>
                      <button
                        onClick={() => executeAiCommand("scroll up")}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-mono text-xs rounded transition-colors"
                      >
                        Scroll Up
                      </button>
                      <button
                        onClick={() => executeAiCommand("zoom in")}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-mono text-xs rounded transition-colors"
                      >
                        Zoom In
                      </button>
                      <button
                        onClick={() => executeAiCommand("navigate home")}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-mono text-xs rounded transition-colors"
                      >
                        Navigate
                      </button>
                    </div>
                  </div>
                )}

                <div className="w-full border-t border-zinc-800 pt-4 mt-4">
                  <div className="text-xs text-slate-500 mb-3">Recent messages</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {messages.slice(-3).map((m, i) => (
                      <div
                        key={i}
                        className={`text-xs p-2 rounded border ${
                          m.role === "user"
                            ? "border-[#00E5FF]/30 bg-[#00E5FF]/5 text-slate-300"
                            : "border-zinc-800 bg-zinc-950 text-slate-400"
                        }`}
                      >
                        {m.content.slice(0, 100)}
                        {m.content.length > 100 ? "..." : ""}
                      </div>
                    ))}
                  </div>

                  {/* AI Commands History */}
                  {aiCommands.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs text-[#FF6B35] mb-2 font-mono tracking-wider">
                        AI COMMANDS EXECUTED
                      </div>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {aiCommands.slice(-5).map((cmd, i) => (
                          <div key={i} className="text-xs text-slate-500 font-mono">
                            {new Date(cmd.timestamp).toLocaleTimeString()}: {cmd.command}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Camera View */}
            {viewTab === "camera" && (
              <div className="flex-1 p-5 flex flex-col items-center justify-center gap-4 bg-zinc-950">
                {cameraActive ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 font-mono text-xs text-[#39FF14]">
                      ● Live
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={stopCamera}
                        className="p-3 rounded-full bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] hover:bg-[#FF003C]/30 transition-colors"
                        title="Stop Camera"
                      >
                        <Video size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4 text-slate-500" />
                    <div className="font-mono text-sm text-slate-300 mb-4">
                      Camera Access
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-colors font-mono text-sm tracking-wider"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Input - Chat View Only */}
            {viewTab === "chat" && (
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
