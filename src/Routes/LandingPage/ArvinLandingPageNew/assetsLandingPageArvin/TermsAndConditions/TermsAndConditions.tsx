// TermsAndConditions.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import termsData from "./terms.json";

type TermsSection = { title: string; items: string[] };
type TermsObject = {
  version?: string;
  lastUpdated?: string;
  sections: TermsSection[];
};

type TermsValidityData = {
  agreed: boolean;
  scrolledToEnd: boolean;
  signedAtISO: string | null;
  termsVersion: string;
  termsHash: string;
};

type Props = {
  termsVersion?: string;
  onValidityChange?: (valid: boolean, data: TermsValidityData) => void;
};

export default function TermsAndConditions({
  termsVersion: propTermsVersion,
  onValidityChange,
}: Props) {
  const terms: TermsObject = termsData as TermsObject;
  const effectiveVersion = propTermsVersion || terms.version || "N/D";
  const lastUpdated = terms.lastUpdated || "";

  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signedAtISO, setSignedAtISO] = useState<string | null>(null);
  const [termsHash, setTermsHash] = useState<string>("");

  const boxRef = useRef<HTMLDivElement>(null);

  const canonicalText = useMemo(() => {
    const parts: string[] = [];
    if (effectiveVersion) parts.push(`version:${effectiveVersion}`);
    if (lastUpdated) parts.push(`lastUpdated:${lastUpdated}`);
    (terms.sections || []).forEach((sec, i) => {
      parts.push(`section${i + 1}_title:${sec.title}`);
      (sec.items || []).forEach((it, j) =>
        parts.push(`section${i + 1}_item${j + 1}:${it}`)
      );
    });
    return parts.join("\n");
  }, [effectiveVersion, lastUpdated, terms.sections]);

  useEffect(() => {
    (async () => {
      const enc = new TextEncoder().encode(canonicalText || "");
      const digest = await crypto.subtle.digest("SHA-256", enc);
      const b64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
      setTermsHash(b64);
    })();
  }, [canonicalText]);

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

  // >>>>> Notifica o pai sempre que algo relevante mudar
  useEffect(() => {
    const valid = scrolledToEnd && agreed && !!termsHash;
    onValidityChange?.(valid, {
      agreed,
      scrolledToEnd,
      signedAtISO,
      termsVersion: effectiveVersion,
      termsHash,
    });
  }, [
    scrolledToEnd,
    agreed,
    termsHash,
    signedAtISO,
    effectiveVersion,
    onValidityChange,
  ]);

  const s = {
    wrap: {
      border: `1px solid #eee`,
      borderRadius: 4,
      marginTop: 10,
      padding: 16,
      background: "#fff",
    },
    title: { margin: "0 0 8px 0", fontSize: 16 },
    box: {
      border: "1px solid #e5e7eb",
      borderRadius: 4,
      padding: 10,
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
    badge: {
      display: "inline-block",
      background: "#f3f4f6",
      border: "1px solid #e5e7eb",
      color: "#111827",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
    },
  } as const;

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
        <h1 id="terms-title" style={s.title}>
          Termos e Condições
        </h1>
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
              {idx + 1}. {sec.title}
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

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            const checked = e.target.checked;
            setAgreed(checked);
            setSignedAtISO(checked ? new Date().toISOString() : null);
          }}
          disabled={!scrolledToEnd}
          aria-disabled={!scrolledToEnd}
        />
        <span style={{ fontSize: 12 }}>
          Li e concordo com os Termos e Condições.
        </span>
      </label>
      {/* Hidden (útil se o form do pai for tradicional) */}
      <input type="hidden" name="termsVersion" value={effectiveVersion} />
      <input type="hidden" name="termsHash" value={termsHash} />
      <input type="hidden" name="signedAtISO" value={signedAtISO ?? ""} />
    </section>
  );
}
