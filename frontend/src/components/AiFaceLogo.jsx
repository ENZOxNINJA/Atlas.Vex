import React from "react";

/**
 * Animated AI face logo for ATLAS VEX.
 * - Soft "breathing" head pulse
 * - Two scanning eyes (slow horizontal sweep + intermittent blink)
 * - Audio-wave mouth visor (animated bars)
 * - Outer ring scan
 * - Speak mode: faster mouth bars + brighter ring (used when chat is "thinking")
 */
export default function AiFaceLogo({ size = 44, speaking = false, listening = false }) {
  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ai-face-svg"
      >
        <defs>
          <radialGradient id="avxFaceBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#0E2436" />
            <stop offset="60%" stopColor="#020617" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <linearGradient id="avxRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#39FF14" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <filter id="avxGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer rotating arc ring */}
        <g className="avx-ring-spin">
          <circle
            cx="32"
            cy="32"
            r="29"
            stroke="url(#avxRing)"
            strokeWidth="1"
            strokeDasharray="6 4 18 4 8 4"
            opacity="0.55"
          />
        </g>

        {/* Outer static thin ring */}
        <circle cx="32" cy="32" r="26" stroke="#1f2937" strokeWidth="0.8" />

        {/* Head capsule with breathing scale */}
        <g className="avx-breath" style={{ transformOrigin: "32px 32px" }}>
          <rect
            x="12"
            y="14"
            width="40"
            height="36"
            rx="14"
            ry="14"
            fill="url(#avxFaceBg)"
            stroke="#00E5FF"
            strokeWidth="1.1"
            filter="url(#avxGlow)"
          />

          {/* Top antenna dot */}
          <circle cx="32" cy="11" r="1.6" fill="#39FF14" className="avx-antenna" />
          <line x1="32" y1="14" x2="32" y2="13" stroke="#39FF14" strokeWidth="1" />

          {/* Eye sockets */}
          <g className="avx-eye-sweep">
            <circle cx="24" cy="29" r="3.2" fill="#020617" stroke="#00E5FF" strokeWidth="0.8" />
            <circle cx="40" cy="29" r="3.2" fill="#020617" stroke="#00E5FF" strokeWidth="0.8" />
            {/* Pupils — animated horizontal sweep via CSS translateX */}
            <g className="avx-pupils">
              <circle cx="24" cy="29" r="1.2" fill="#00E5FF" />
              <circle cx="40" cy="29" r="1.2" fill="#00E5FF" />
            </g>
            {/* Eyelid (blink) */}
            <rect
              x="20.5"
              y="25.5"
              width="7"
              height="0"
              rx="1"
              fill="#020617"
              className="avx-lid avx-lid-l"
            />
            <rect
              x="36.5"
              y="25.5"
              width="7"
              height="0"
              rx="1"
              fill="#020617"
              className="avx-lid avx-lid-r"
            />
          </g>

          {/* Mouth visor with audio wave bars */}
          <g transform="translate(22 38)">
            <rect width="20" height="6" rx="2" fill="#020617" stroke="#00E5FF" strokeWidth="0.7" />
            <g className={`avx-wave ${speaking ? "is-speaking" : ""} ${listening ? "is-listening" : ""}`}>
              <rect x="3" y="2" width="1.4" height="2" rx="0.7" fill="#00E5FF" className="b1" />
              <rect x="6" y="1.5" width="1.4" height="3" rx="0.7" fill="#00E5FF" className="b2" />
              <rect x="9" y="1" width="1.4" height="4" rx="0.7" fill="#39FF14" className="b3" />
              <rect x="12" y="1.5" width="1.4" height="3" rx="0.7" fill="#00E5FF" className="b4" />
              <rect x="15" y="2" width="1.4" height="2" rx="0.7" fill="#00E5FF" className="b5" />
            </g>
          </g>

          {/* Cheek vents */}
          <line x1="14.5" y1="32" x2="14.5" y2="36" stroke="#00E5FF" strokeWidth="0.6" opacity="0.7" />
          <line x1="49.5" y1="32" x2="49.5" y2="36" stroke="#00E5FF" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Bottom data tick row */}
        <g opacity="0.5">
          <line x1="22" y1="55" x2="42" y2="55" stroke="#00E5FF" strokeWidth="0.6" strokeDasharray="1 2" />
        </g>
      </svg>

      <style>{`
        .ai-face-svg .avx-ring-spin {
          transform-origin: 32px 32px;
          animation: avxRingSpin 8s linear infinite;
        }
        .ai-face-svg .avx-breath {
          animation: avxBreath 3.6s ease-in-out infinite;
        }
        .ai-face-svg .avx-pupils {
          animation: avxScan 5.4s ease-in-out infinite;
        }
        .ai-face-svg .avx-lid {
          animation: avxBlink 5.8s ease-in-out infinite;
        }
        .ai-face-svg .avx-lid-r { animation-delay: 0.04s; }
        .ai-face-svg .avx-antenna {
          animation: avxAntennaPulse 1.6s ease-in-out infinite;
          transform-origin: 32px 11px;
        }
        .ai-face-svg .avx-wave rect {
          transform-origin: center bottom;
          animation: avxWaveIdle 1.6s ease-in-out infinite;
        }
        .ai-face-svg .avx-wave .b1 { animation-delay: 0s; }
        .ai-face-svg .avx-wave .b2 { animation-delay: 0.12s; }
        .ai-face-svg .avx-wave .b3 { animation-delay: 0.24s; }
        .ai-face-svg .avx-wave .b4 { animation-delay: 0.36s; }
        .ai-face-svg .avx-wave .b5 { animation-delay: 0.48s; }

        .ai-face-svg .avx-wave.is-speaking rect {
          animation: avxWaveSpeak 0.55s ease-in-out infinite;
        }
        .ai-face-svg .avx-wave.is-listening rect {
          animation: avxWaveListen 1.1s ease-in-out infinite;
        }

        @keyframes avxRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes avxBreath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.025); }
        }
        @keyframes avxScan {
          0%, 35%   { transform: translateX(0); }
          45%, 55%  { transform: translateX(1.4px); }
          65%, 85%  { transform: translateX(-1.4px); }
          100%      { transform: translateX(0); }
        }
        @keyframes avxBlink {
          0%, 92%, 100% { height: 0; transform: translateY(0); }
          94%, 96%      { height: 6.5px; transform: translateY(0); }
        }
        @keyframes avxAntennaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes avxWaveIdle {
          0%, 100% { transform: scaleY(0.6); }
          50%      { transform: scaleY(1); }
        }
        @keyframes avxWaveSpeak {
          0%, 100% { transform: scaleY(0.4); }
          25%      { transform: scaleY(1.4); }
          75%      { transform: scaleY(0.7); }
        }
        @keyframes avxWaveListen {
          0%, 100% { transform: scaleY(0.5); }
          50%      { transform: scaleY(0.9); }
        }
      `}</style>
    </span>
  );
}
