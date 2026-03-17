import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type HelpInfoProps = {
  title: string;
  text: string | React.ReactNode;
  youtubeUrl?: string;
  thePermissions?: string;
  glow?: boolean;
  anchor?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "inline";
  initialPosition?: { x: number; y: number };
  zIndex?: number;
};

function extractYouTubeId(url?: string) {
  if (!url) return null;

  const embed = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embed?.[1]) return embed[1];

  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short?.[1]) return short[1];

  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
  } catch {}

  const fallback = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (fallback?.[1]) return fallback[1];

  return null;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function HelpInfo({
  title,
  text,
  youtubeUrl,
  thePermissions,
  glow = true,
  anchor = "inline",
  initialPosition = { x: 100, y: 120 },
  zIndex = 999999999,
}: HelpInfoProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(initialPosition);

  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const modalRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const ytId = useMemo(() => extractYouTubeId(youtubeUrl), [youtubeUrl]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drag global
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;

      const point = "touches" in e ? e.touches[0] : (e as MouseEvent);

      const rect = modalRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 400;
      const h = rect?.height ?? 240;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const nextX = point.clientX - offset.current.dx;
      const nextY = point.clientY - offset.current.dy;

      setPos({
        x: clamp(nextX, 8, vw - w - 8),
        y: clamp(nextY, 8, vh - h - 8),
      });
    };

    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    const rect = modalRef.current?.getBoundingClientRect();
    const left = rect?.left ?? pos.x;
    const top = rect?.top ?? pos.y;

    dragging.current = true;
    offset.current = {
      dx: clientX - left,
      dy: clientY - top,
    };
  };

  const anchorStyle: React.CSSProperties =
    anchor === "inline"
      ? { display: "inline-flex" }
      : {
          position: "fixed",
          ...(anchor === "bottom-right" && { right: 16, bottom: 16 }),
          ...(anchor === "bottom-left" && { left: 16, bottom: 16 }),
          ...(anchor === "top-right" && { right: 16, top: 16 }),
          ...(anchor === "top-left" && { left: 16, top: 16 }),
          zIndex,
        };

  const modal = open ? (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 420,
        maxWidth: "92vw",
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        zIndex,
        boxShadow: "0 25px 80px rgba(0,0,0,0.65)",
      }}
    >
      {/* Header Dragável */}
      <div
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          startDrag(t.clientX, t.clientY);
        }}
        style={{
          padding: "10px 12px",
          display: "flex",
          justifyContent: "space-between",
          cursor: "grab",
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {title}
        <button
          onClick={() => setOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          padding: 12,
          maxHeight: "300px",
          overflowY: "auto",
          fontSize: 13,
        }}
      >
        {typeof text === "string" ? (
          <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
        ) : (
          text
        )}

        {ytId && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  if (thePermissions == "teacher" && permissions == "student") return null;
  return (
    <>
      {/* Botão Info */}
      <span style={anchorStyle} className="helpinfo-wrap">
        <button
          onClick={() => setOpen(true)}
          className={`helpinfo-btn ${glow ? "helpinfo-btn--glow" : ""}`}
          aria-label="Ajuda"
          type="button"
        >
          ⓘ{/* Tooltip */}
          <span className="helpinfo-tooltip" role="tooltip">
            {title}
          </span>
        </button>
        <style>
          {`
      .helpinfo-wrap{
        display: inline-flex;
      }

      .helpinfo-btn{
        position: relative;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 14px;
        line-height: 1;
        color: #c9a227;
        font-weight: 800;

        /* hover effect */
        transition: transform 160ms ease, filter 160ms ease, text-shadow 160ms ease, opacity 160ms ease;
        transform: scale(1);
        filter: brightness(1);
        opacity: 1;
        user-select: none;
      }

      .helpinfo-btn:hover{
        transform: scale(1.18);
        filter: brightness(1.35);
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.75);
      }

      .helpinfo-btn--glow{
        text-shadow: 0 0 6px rgba(201,162,39,0.45);
        animation: helpinfo-gold-glow 2.2s ease-in-out infinite;
      }

      /* Tooltip */
      .helpinfo-tooltip{
        position: absolute;
        z-index: 10000;  
        max-width: 240px; 
        left: 10%;
        top: calc(100% + 10px);
        transform: translateX(50%) translateY(4px);
        white-space: nowrap;

        background: rgba(20,20,20,0.95);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        padding: 6px 10px;
        border-radius: 8px;

        opacity: 0;
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        z-index: 1;
      }

      /* setinha */
      .helpinfo-tooltip::after{
        content: "";
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(20,20,20,0.95);
      }

      .helpinfo-btn:hover .helpinfo-tooltip{
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      @keyframes helpinfo-gold-glow {
        0%   { text-shadow: 0 0 4px rgba(201,162,39,0.35); }
        50%  { text-shadow: 0 0 10px rgba(255,215,0,0.65); }
        100% { text-shadow: 0 0 4px rgba(201,162,39,0.35); }
      }
    `}
        </style>
      </span>
      {/* Portal no BODY */}
      {open && createPortal(modal, document.body)}
    </>
  );
}
