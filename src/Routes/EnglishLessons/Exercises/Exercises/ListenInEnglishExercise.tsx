import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar } from "../Exercises";
import React, { useEffect, useState } from "react";

type AudioItem = {
  enusAudio: string;
};

type ElementListenInEnglish = {
  type: "listinenglish";
  subtitle?: string;
  comments?: string;
  audios: AudioItem[];
  order?: number;
};

export function ListenInEnglishExercise({
  exercise,
  exerciseElement,
  studentId,
  labels,
  selectedVoice,
  language,
}: {
  exercise: any;
  exerciseElement: ElementListenInEnglish;
  studentId: string;
  labels: typeof defaultLabels;
  selectedVoice?: string;
  language?: string;
}) {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const currentAudio = exerciseElement.audios[currentAudioIndex];

  const playAudio = () => {
    if (!currentAudio?.enusAudio) return;

    setIsPlaying(true);
    readText(
      currentAudio.enusAudio,
      true,
      language || "en",
      selectedVoice
    ).finally(() => {
      setIsPlaying(false);
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Impedir Ctrl+V (colar)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();
    }
  };

  const nextAudio = () => {
    if (currentAudioIndex < exerciseElement.audios.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
      setUserAnswer(""); // Limpar a resposta ao mudar para próximo áudio
    }
  };

  const previousAudio = () => {
    if (currentAudioIndex > 0) {
      setCurrentAudioIndex(currentAudioIndex - 1);
      setUserAnswer(""); // Limpar a resposta ao voltar
    }
  };

  if (!exerciseElement.audios || exerciseElement.audios.length === 0) {
    return (
      <Card>
        <div style={{ padding: "16px" }}>
          <HeaderBar title={exerciseElement.subtitle || "Listen in English"} />
          <p style={{ color: "#6B7280", fontStyle: "italic" }}>
            Nenhum áudio disponível para este exercício.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        {/* Header simples */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          <span>
            {currentAudioIndex + 1}/{exerciseElement.audios.length}
          </span>
          {exerciseElement.audios.length > 1 && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={previousAudio}
                disabled={currentAudioIndex === 0}
                style={{
                  backgroundColor: "transparent",
                  color: currentAudioIndex === 0 ? "#D1D5DB" : partnerColor(),
                  border: "none",
                  fontSize: "16px",
                  cursor: currentAudioIndex === 0 ? "not-allowed" : "pointer",
                  padding: "4px",
                }}
              >
                ←
              </button>
              <button
                onClick={nextAudio}
                disabled={
                  currentAudioIndex === exerciseElement.audios.length - 1
                }
                style={{
                  backgroundColor: "transparent",
                  color:
                    currentAudioIndex === exerciseElement.audios.length - 1
                      ? "#D1D5DB"
                      : partnerColor(),
                  border: "none",
                  fontSize: "16px",
                  cursor:
                    currentAudioIndex === exerciseElement.audios.length - 1
                      ? "not-allowed"
                      : "pointer",
                  padding: "4px",
                }}
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Comentários simplificados */}
        {exerciseElement.comments && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#F9FAFB",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#6B7280",
              borderLeft: `3px solid ${partnerColor()}`,
            }}
          >
            {exerciseElement.comments}
          </div>
        )}

        {/* Botão de áudio minimalista */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={playAudio}
            disabled={isPlaying}
            style={{
              backgroundColor: "transparent",
              color: partnerColor(),
              border: `2px solid ${partnerColor()}`,
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              fontSize: "16px",
              cursor: isPlaying ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              opacity: isPlaying ? 0.6 : 1,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        {/* Textarea simplificado */}
        <textarea
          value={userAnswer}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            height: "100px",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            padding: "12px",
            fontSize: "14px",
            lineHeight: "1.4",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease",
          }}
          placeholder="Digite sua resposta..."
          onFocus={(e) => (e.target.style.borderColor = partnerColor())}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
        />

        {/* Texto de referência minimalista */}
        {currentAudio?.enusAudio && (
          <details style={{ marginTop: "16px" }}>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "12px",
                color: "#9CA3AF",
                fontWeight: "500",
                outline: "none",
              }}
            >
              Referência
            </summary>
            <div
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                backgroundColor: "#F9FAFB",
                borderRadius: "4px",
                fontSize: "13px",
                color: "#6B7280",
                fontStyle: "italic",
              }}
            >
              {currentAudio.enusAudio}
            </div>
          </details>
        )}
      </div>
    </Card>
  );
}
