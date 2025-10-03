import React from "react";
import { partnerColor } from "../../../Styles/Styles";

export const languages = ["en", "pt", "it", "fr", "de", "es"];

interface AddOneFlashCardProps {
  index: number;
  frontCard: string;
  backCard: string;
  languageFront: string;
  languageBack: string;
  backComments: string;
  handleCommentsBack: (index: number, value: string) => void;
  handleFrontCardChange: (index: number, value: string) => void;
  handleBackCardChange: (index: number, value: string) => void;
  handleLanguageFrontChange: (index: number, value: string) => void;
  handleLanguageBackChange: (index: number, value: string) => void;
  handleRemoveCard: (index: number) => void;
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
}) => {
  const inputStyle = {
    borderRadius: "4px",
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

  const selectStyle = {
    borderRadius: "4px",
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

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "4px",
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
          borderRadius: "4px",
          padding: "4px 8px",
          cursor: "pointer",
          fontSize: "12px",
        }}
        title="Excluir este card"
      >
        Excluir
      </button>

      {/* Front Card */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Front
            </label>
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
                {language.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Back Card */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Back
            </label>
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
                {language.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comments */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "0.25rem",
          }}
        >
          Comments (optional)
        </label>
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
