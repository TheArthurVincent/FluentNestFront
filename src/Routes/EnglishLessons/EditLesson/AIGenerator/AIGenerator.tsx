import React from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";

type HeadersLike = Record<string, string>;

type Props = {
  postUrl: string;
  language1: string;
  type: string;
  headers?: HeadersLike | null;
  visible: boolean;
  onClose: () => void;
  onReceiveJson: (json: any) => void;
  title?: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #0891b2",
  backgroundColor: "#06b6d4",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999, // maior que sidebars/topbars
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 520px)",
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

export default function SimpleAIGenerator({
  postUrl,
  visible,
  language1,
  type,
  onClose,
  onReceiveJson,
  headers,
  title = "Gerar por IA",
}: Props) {
  const [theme, setTheme] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [numberOfSentences, setNumberOfSentences] = React.useState(20);

  const handleGenerate = async () => {
    const t = theme.trim();
    const i = instructions.trim();
    if (!t && !i) {
      notifyAlert("Preencha tema e/ou instruções.", partnerColor());
      return;
    }

    const prompt = t && i ? `Tema: ${t}; Instruções: ${i}` : t || i;

    try {
      setLoading(true);
      const payload = { prompt, type, language1, numberOfSentences };

      const res = await axios.post(postUrl, payload, {
        headers: headers ? { ...headers } : {},
      });

      const raw = res?.data?.json ?? res?.data;

      onReceiveJson(raw);
      onClose();
      console.log("IA gerou o seguinte JSON:", raw);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao gerar conteúdo.";
      notifyAlert(msg, partnerColor());
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  // SSR safety (se estiver em Next.js e esse componente for renderizado no server)
  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={overlayStyle} onClick={loading ? undefined : onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: 12,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong style={{ fontSize: 14, color: "#0f172a" }}>{title}</strong>
          {!loading && (
            <button style={ghostBtnStyle} onClick={onClose}>
              Fechar
            </button>
          )}
        </div>

        <div style={{ padding: 12, display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Tema</label>
            <input
              disabled={loading}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex.: Supermercado, Viagem, Escritório…"
              style={inputStyle}
            />
            <label style={{ fontSize: 12, color: "#334155" }}>
              Quantidade de
              {type === "vocabulary"
                ? " palavras/termos"
                : type == "sentences"
                ? " sentenças"
                : type == "dialogue"
                ? " falas"
                : type == "text"
                ? " linhas de texto"
                : ""}
            </label>
            <input
              type="number"
              disabled={loading}
              value={numberOfSentences}
              onChange={(e) => setNumberOfSentences(Number(e.target.value))}
              style={inputStyle}
              min={1}
              max={20}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Instruções da IA
            </label>
            <textarea
              disabled={loading}
              rows={8}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={`Descreva o que a IA deve gerar. Ex.: ${
                type === "vocabulary"
                  ? "Gere uma lista de palavras e expressões comuns usadas em situações cotidianas, com tradução para o português."
                  : type == "sentences"
                  ? "Gere frases simples e comuns usadas em situações cotidianas, com tradução para o português."
                  : type == "dialogue"
                  ? "Gere um diálogo curto entre duas pessoas em uma situação cotidiana, com tradução para o português."
                  : type == "text"
                  ? "Gere uma história curta e simples adequada para estudantes de inglês, com tradução para o português."
                  : ""
              }`}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleGenerate}
            style={{ ...primaryBtnStyle, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
