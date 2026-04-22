import React, { useState } from "react";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import { backDomain } from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
// ajuste este import conforme a sua estrutura:

export const languages = ["en", "pt", "it", "fr", "de", "es"] as const;
type LangCode = (typeof languages)[number];

interface AddOneFlashCardProps {
  index: number;
  frontCard: string;
  backCard: string;
  languageFront: string; // ex.: "en"
  languageBack: string; // ex.: "pt"
  backComments: string;
  handleCommentsBack: (index: number, value: string) => void;
  handleFrontCardChange: (index: number, value: string) => void;
  handleBackCardChange: (index: number, value: string) => void;
  handleLanguageFrontChange: (index: number, value: string) => void;
  handleLanguageBackChange: (index: number, value: string) => void;
  handleRemoveCard: (index: number) => void;
  studentId?: string;
  headers?: Record<string, string> | null;
  setChange?: (v: any) => void;
  change?: any;
}

const AddOneFlashCard: React.FC<AddOneFlashCardProps> = ({
  index,
  frontCard,
  backCard,
  languageFront,
  languageBack,
  backComments,
  handleCommentsBack,
  handleFrontCardChange,
  handleBackCardChange,
  handleLanguageFrontChange,
  handleLanguageBackChange,
  handleRemoveCard,
  studentId,
  headers,
  setChange,
  change,
}) => {
  const [loading, setLoading] = useState(false);

  /* ===================== STYLES ===================== */
  const inputStyle: React.CSSProperties = {
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "13px",
    fontWeight: "400",
    color: "#64748b",
    padding: "8px 10px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    marginBottom: "0.5rem",
  };

  const selectStyle: React.CSSProperties = {
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "11px",
    fontWeight: "400",
    color: "#64748b",
    padding: "4px 6px",
    height: "32px",
    minWidth: "60px",
    outline: "none",
    cursor: "pointer",
  };

  /* ===================== IA: preencher BACK a partir do FRONT ===================== */
  const handleAI = async () => {
    const sentence = (frontCard || "").trim();
    const language1 = (languageFront || "en").trim();
    const language2 = (languageBack || "pt").trim();

    if (!studentId) {
      notifyAlert("ID do aluno não informado.", partnerColor());
      return;
    }
    if (!sentence) {
      notifyAlert("Preencha o Front antes de gerar o Back.", partnerColor());
      return;
    }

    try {
      setLoading(true);
      const url = `${backDomain}/api/v1/translateOrDefineSentence/${studentId}`;
      const payload = { sentence, language1, language2 };

      const response =
        headers && Object.keys(headers).length > 0
          ? await axios.post(url, payload, { headers })
          : await axios.post(url, payload);

      const backText = (response?.data?.backText || "").trim();
      if (!backText) {
        notifyAlert("Resposta vazia recebida do servidor.", partnerColor());
        return;
      }

      handleBackCardChange(index, backText);
      setChange?.(!change);
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Erro ao gerar tradução/definição.";
      notifyAlert(msg, partnerColor());
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        margin: "1rem 0",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          margin: "0 0 1rem 0",
          fontSize: "14px",
          color: "#374151",
          fontWeight: "500",
        }}
      >
        Card #{index + 1}
      </h3>

      {/* Botão de excluir card */}
      <button
        type="button"
        onClick={() => handleRemoveCard(index)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "4px 8px",
          cursor: "pointer",
          fontSize: "12px",
        }}
        title="Excluir este card"
      >
        Excluir
      </button>

      {/* FRONT */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={frontCard}
              placeholder="Enter front text"
              onChange={(e) => handleFrontCardChange(index, e.target.value)}
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = partnerColor())
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />
          </div>

          <select
            value={languageFront}
            onChange={(e) => handleLanguageFrontChange(index, e.target.value)}
            style={selectStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = partnerColor())
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            {languages.map((language, langIndex) => (
              <option key={langIndex} value={language}>
                {String(language).toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BACK + IA */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={backCard}
              placeholder="Enter back text"
              onChange={(e) => handleBackCardChange(index, e.target.value)}
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = partnerColor())
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />
          </div>

          <select
            value={languageBack}
            onChange={(e) => handleLanguageBackChange(index, e.target.value)}
            style={selectStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = partnerColor())
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            {languages.map((language, langIndex) => (
              <option key={langIndex} value={language}>
                {String(language).toUpperCase()}
              </option>
            ))}
          </select>

          {/* IA */}
          {/* <button
            type="button"
            onClick={handleAI}
            disabled={loading}
            style={{
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              color: "#0f172a",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "13px",
              whiteSpace: "nowrap",
              opacity: loading ? 0.6 : 1,
            }}
            title="Gerar tradução/definição para o Back (-1 token)"
          >
            {loading ? "..." : "✨ (-1)"}
          </button> */}
        </div>
      </div>

      {/* COMMENTS */}
      <div>
        <input
          type="text"
          value={backComments}
          placeholder="Add comments or notes"
          onChange={(e) => handleCommentsBack(index, e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = partnerColor())}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        />
      </div>
    </div>
  );
};

export default AddOneFlashCard;
