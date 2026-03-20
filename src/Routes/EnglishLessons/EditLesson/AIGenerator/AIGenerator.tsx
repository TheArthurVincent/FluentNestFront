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
  numberOfSentences?: number;
  headers?: HeadersLike | null;
  visible: boolean;
  theme?: string;
  onClose: () => void;
  onReceiveJson: (json: any) => void;
  title?: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 6,
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
  zIndex: 99999999,
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 520px)",
  background: "#fff",
  borderRadius: 6,
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
  numberOfSentences,
  theme,
  title = "Gerar por IA",
}: Props) {
  const [instructions, setInstructions] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    const t =
      theme?.trim() ||
      `Aula de ${
        language1 == "en"
          ? "Inglês"
          : language1 == "pt"
            ? "Português"
            : language1 == "es"
              ? "Espanhol"
              : language1 == "fr"
                ? "Francês"
                : language1 == "de"
                  ? "Alemão"
                  : language1 == "it"
                    ? "Italiano"
                    : language1
      }.`;
    const i = instructions.trim();
    if (!t && !i) {
      notifyAlert("Preencha tema e/ou instruções.", partnerColor());
      return;
    }

    const prompt = t && i ? `Tema: ${t}; Instruções: ${i}` : t || i;

    try {
      setLoading(true);
      const payload = {
        prompt,
        type,
        language1: language1 || "en",
        numberOfSentences: numberOfSentences ? numberOfSentences : 10,
      };

      const res = await axios.post(postUrl, payload, {
        headers: headers ? { ...headers } : {},
      });

      const raw = res?.data?.json ?? res?.data;

      onReceiveJson(raw);
      onClose();
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={overlayStyle}>
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
    document.body,
  );
}
