"use client";

interface StarkLogoProps {
  size?: number;        // overall diameter in px
  showGlowRing?: boolean;
  showText?: boolean;
}

export default function StarkLogo({
  size = 140,
  showGlowRing = true,
  showText = true,
}: StarkLogoProps) {
  const strokeWidth = size <= 48 ? 0.75 : 1.5;
  const centerHole = size <= 48 ? 2 : 6;

  return (
  <div
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Stardos Stencil', sans-serif",
    }}
  >
    <div style={{ position: "relative", width: size, height: size }}>
      {showGlowRing && <div className="stark-glow-ring" />}
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        style={{ position: "relative", zIndex: 2 }}
      >
        <circle
          cx="70" cy="70" r="52"
          fill="none" stroke="#2dd4a7"
          strokeWidth={strokeWidth} opacity="0.5"
        />
        <g className="stark-spin-group" style={{ transformOrigin: "70px 70px" }}>
          <path d="M70 70 C70 40, 90 30, 105 35 C95 55, 85 65, 70 70 Z" fill="#2dd4a7" opacity="0.95" />
          <path d="M70 70 C40 70, 30 50, 35 35 C55 45, 65 55, 70 70 Z" fill="#2dd4a7" opacity="0.75" />
          <path d="M70 70 C70 100, 50 110, 35 105 C45 85, 55 75, 70 70 Z" fill="#2dd4a7" opacity="0.55" />
        </g>
        <circle cx="70" cy="70" r={centerHole} fill="#0a0e14" />
      </svg>
    </div>
      {showText && (
        <>
          <div className="stark-pulse-text" style={{ marginTop: "1.25rem", fontWeight: 700, fontSize: 28, letterSpacing: 2, color: "#2dd4a7" }}>
            STARK AI
          </div>
          <div style={{ marginTop: "0.4rem", fontSize: 11, letterSpacing: 4, color: "#8a93a3" }}>
            INTELLIGENT SYSTEMS
          </div>
        </>
      )}

      <style jsx>{`
        .stark-glow-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,212,167,0.35) 0%, rgba(45,212,167,0) 70%);
          animation: pulseGlow 2.4s ease-in-out infinite;
          z-index: 1;
        }
        .stark-spin-group {
          animation: spinSlow 8s linear infinite;
        }
        .stark-pulse-text {
          animation: textGlow 2.4s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(45,212,167,0.4); }
          50% { text-shadow: 0 0 20px rgba(45,212,167,0.9); }
        }
      `}</style>
    </div>
  );
}