import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { partnerColor } from "../../Styles/Styles";

type HelpInfoProps = {
  title: string;
  text: string | React.ReactNode;
  youtubeUrl?: string;
  thePermissions?: string;
  glow?: boolean;
  icon?: React.ReactNode;
  anchor?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "inline";
  initialPosition?: { x: number; y: number };
  zIndex?: number;
  buttonSize?: number;
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
  icon = "?",
  anchor = "inline",
  initialPosition = { x: 100, y: 120 },
  zIndex = 999999999,
  buttonSize = 22,
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

      <div style={{ padding: 12, fontSize: 13 }}>
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
      <span style={anchorStyle}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 13,
            height: 9,
            border: "none",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "10px",
            borderRadius: "50%",
            background: partnerColor(),
            color: "#fff",
            filter: "brightness(1.5) saturate(1.1)",
            animation: glow
              ? "helpinfo-glow 1.5s ease-in-out infinite"
              : "none",
            transition: "transform 0.15s ease, box-shadow 2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {icon}
        </button>

        <style>
          {`
    @keyframes helpinfo-glow {
      0%   { filter: brightness(1.25) saturate(1.05); }
      50%  { filter: brightness(1.55) saturate(1.15); }
      100% { filter: brightness(1.25) saturate(1.05); }
    }
  `}
        </style>
      </span>

      {/* Portal no BODY */}
      {open && createPortal(modal, document.body)}
    </>
  );
}
