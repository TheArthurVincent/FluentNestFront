// TermsAndConditions.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HOne, HTwo } from "../../../../../Resources/Components/RouteBox";
import termsData from "./terms.json"; // agora é um OBJETO JSON, não HTML string
import { partnerColor } from "../../../../../Styles/Styles";

// ===== Tipos =====
type TermsSection = {
  title: string;
  items: string[];
};

type TermsObject = {
  version?: string;
  lastUpdated?: string; // "YYYY-MM-DD" ou "DD/MM/YYYY", tanto faz para exibição
  sections: TermsSection[];
};

type ConsentData = {
  agreed: boolean;
  signedFullName: string;
  signedAtISO: string | null;
  userAgent: string;
  termsVersion: string;
  termsHash: string; // SHA-256 base64 do conteúdo canônico do JSON
  drawnSignatureDataURL?: string | null; // opcional (canvas)
};

type Props = {
  fullName: string; // Nome + Sobrenome do formulário
  termsVersion?: string; // Ex.: "2025-09-24" (sobrescreve a do JSON se vier)
  onValidityChange?: (valid: boolean, data: ConsentData) => void;
};

export default function TermsAndConditions({
  fullName,
  termsVersion: propTermsVersion,
  onValidityChange,
}: Props) {
  const terms: TermsObject = termsData as TermsObject;

  const effectiveVersion = propTermsVersion || terms.version || "N/D";
  const lastUpdated = terms.lastUpdated || "";

  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [signedAtISO, setSignedAtISO] = useState<string | null>(null);
  const [termsHash, setTermsHash] = useState<string>("");
  const [drawMode, setDrawMode] = useState(false);
  const [drawnSignatureDataURL, setDrawnSignatureDataURL] = useState<
    string | null
  >(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // ======== Constrói texto canônico a partir do JSON para hash ========
  const canonicalText = useMemo(() => {
    // Junta version, lastUpdated, títulos e itens em uma string estável
    const parts: string[] = [];
    if (terms.version) parts.push(`version:${terms.version}`);
    if (terms.lastUpdated) parts.push(`lastUpdated:${terms.lastUpdated}`);
    (terms.sections || []).forEach((sec, i) => {
      parts.push(`section${i + 1}_title:${sec.title}`);
      (sec.items || []).forEach((it, j) => {
        parts.push(`section${i + 1}_item${j + 1}:${it}`);
      });
    });
    return parts.join("\n");
  }, [terms]);

  // ======== Hash (SHA-256) do JSON canônico ========
  useEffect(() => {
    (async () => {
      const enc = new TextEncoder().encode(canonicalText || "");
      const digest = await crypto.subtle.digest("SHA-256", enc);
      const b64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
      setTermsHash(b64);
    })();
  }, [canonicalText]);

  // ======== Rolar até o fim para habilitar aceite ========
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onScroll = () => {
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      if (atEnd) setScrolledToEnd(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ======== Validação geral ========
  const nameMatches = useMemo(() => {
    const normalize = (s: string) =>
      (s || "").toLowerCase().replace(/\s+/g, " ").trim();
    return (
      normalize(typedName) !== "" &&
      normalize(typedName) === normalize(fullName)
    );
  }, [typedName, fullName]);

  const valid = agreed && scrolledToEnd && nameMatches && !!termsHash;

  const consentData: ConsentData = useMemo(
    () => ({
      agreed,
      signedFullName: typedName,
      signedAtISO: signedAtISO,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      termsVersion: effectiveVersion,
      termsHash,
      drawnSignatureDataURL,
    }),
    [
      agreed,
      typedName,
      signedAtISO,
      effectiveVersion,
      termsHash,
      drawnSignatureDataURL,
    ]
  );

  useEffect(() => {
    onValidityChange?.(valid, consentData);
  }, [valid, consentData, onValidityChange]);

  // ======== Canvas (assinatura desenhada – opcional) ========
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    last.current = getPos(e);
  };
  const endDraw = () => {
    drawing.current = false;
    last.current = null;
    if (canvasRef.current)
      setDrawnSignatureDataURL(canvasRef.current.toDataURL("image/png"));
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    if (!ctx || !last.current || !pos) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last.current = pos;
  };
  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setDrawnSignatureDataURL(null);
  };

  // ======== Estilos inline minimalistas ========
  const s = {
    wrap: {
      border: `1px solid ${partnerColor()}`,
      borderRadius: 4,
      marginTop: 10,
      padding: 16,
      background: "#ffffff",
    },
    title: {
      margin: "0 0 8px 0",
      fontSize: 16,
    },
    box: {
      border: "1px solid #e5e7eb",
      borderRadius: 4,
      padding: 12,
      height: 180,
      overflow: "auto" as const,
      background: "#f9fafb",
      fontSize: 10,
      lineHeight: 1.5,
      color: "#111827",
      marginBottom: 12,
    },
    hint: {
      fontSize: 10,
      color: scrolledToEnd ? "#10b981" : "#6b7280",
      marginBottom: 12,
    },
    row: { display: "flex", alignItems: "center", gap: 8 },
    nameInput: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 4,
      border: `1px solid ${nameMatches ? "#10b981" : "#e5e7eb"}`,
      outline: "none",
      fontSize: 10,
    },
    badge: {
      display: "inline-block",
      background: "#f3f4f6",
      border: "1px solid #e5e7eb",
      color: "#111827",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
    },
    canvasWrap: {
      border: "1px dashed #d1d5db",
      borderRadius: 4,
      padding: 8,
      background: "#fafafa",
      marginTop: 8,
    },
    tiny: { fontSize: 10, color: "#6b7280", marginTop: 8 },
  };

  return (
    <section aria-labelledby="terms-title" style={s.wrap}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <HOne id="terms-title" style={s.title}>
          Termos e Condições
        </HOne>
        <span style={s.badge}>Versão: {effectiveVersion}</span>
      </div>
      <div
        ref={boxRef}
        role="region"
        aria-label="Conteúdo dos Termos"
        style={s.box}
      >
        {(terms.sections || []).map((sec, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {idx + 1 + ". " + sec.title}
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {(sec.items || []).map((it, j) => (
                <li key={j} style={{ marginBottom: 1 }}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!!lastUpdated && (
          <div style={{ marginTop: 12, color: "#6b7280", fontSize: 10 }}>
            Última atualização: {lastUpdated}
          </div>
        )}
      </div>
      <div style={s.hint}>
        {scrolledToEnd
          ? "✅ Você rolou até o fim."
          : "⬇️ Role o texto até o final para habilitar o aceite."}
      </div>
      <label style={s.row}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setSignedAtISO(e.target.checked ? new Date().toISOString() : null);
          }}
          disabled={!scrolledToEnd}
          aria-disabled={!scrolledToEnd}
        />
        <span style={{ fontSize: 12 }}>
          Li e concordo com os Termos e Condições.
        </span>
      </label>
      <input type="hidden" name="termsVersion" value={effectiveVersion} />
      <input type="hidden" name="termsHash" value={termsHash} />
      <input type="hidden" name="signedAtISO" value={signedAtISO ?? ""} />
      <input type="hidden" name="signedFullName" value={typedName} />
      <input
        type="hidden"
        name="drawnSignatureDataURL"
        value={drawnSignatureDataURL ?? ""}
      />
    </section>
  );
}
