import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";
import VocabularyMatchExercise from "../../Exercises/Exercises/VocabularyMatchExercise";

interface VocabularyLessonProps {
  headers: MyHeadersType | null;
  element: any;
  studentId?: string;
  mainTag: string;
  selectedVoice: any;
  exerciseScore: (points: number, description: string, id?: string) => void;
  studentsIds?: string[];
  courseId?: string; // <-- ADICIONE (pra alimentar o VocabularyMatchExercise)
  language?: string; // <-- opcional, se você usa em algum lugar
}

export default function VocabularyLessonModel({
  headers,
  element,
  mainTag,
  studentId,
  exerciseScore,
  selectedVoice,
  studentsIds,
  courseId,
  language,
}: VocabularyLessonProps) {
  const actualHeaders = headers || {};
  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // NOVO: controla o modal do match
  const [showMatchModal, setShowMatchModal] = useState(false);

  const sentences: any[] = useMemo(() => {
    return Array.isArray(element?.sentences) ? element.sentences : [];
  }, [element?.sentences]);

  useEffect(() => {
    setDone(false);
    setLoading(false);
    setClickedButtons(new Set());
  }, [element?.sentences]);

  const getLanguages = (sentence: any) => {
    const languages = sentence?.languages || {};
    return {
      frontLang: languages.language1 || "en",
      backLang: languages.language2 || "pt",
    };
  };

  const getTargetIds = (): string[] => {
    if (
      permissions !== "student" &&
      Array.isArray(studentsIds) &&
      studentsIds.length > 0
    ) {
      return studentsIds;
    }
    if (studentId) return [studentId];
    return [];
  };

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null,
  ) => {
    const targetIds = getTargetIds();
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    const newCards = [
      {
        front: {
          text: frontText,
          language: languages ? languages.language1 : "en",
        },
        back: {
          text: backText,
          language: languages ? languages.language2 : "pt",
        },
        tags: [mainTag ? mainTag : ""],
      },
    ];

    try {
      const messages: string[] = [];

      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response.data.addedNewFlashcards ? response.data.addedNewFlashcards : ""}` +
          `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(
        messages.join(" | ") || "Flashcards adicionados.",
        partnerColor(),
      );
      setClickedButtons((prev) => new Set(prev).add(index));
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const addAllCards = async () => {
    if (loading) return;

    const targetIds = getTargetIds();
    if (sentences.length === 0) {
      notifyAlert("Não há sentences para adicionar.", "orange");
      return;
    }
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    setLoading(true);
    try {
      const newCards = sentences
        .map((s: any) => ({
          front: {
            text: (s?.english || "").trim(),
            language: s?.languages?.language1 || "en",
          },
          back: {
            text: (s?.portuguese || "").trim(),
            language: s?.languages?.language2 || "pt",
          },
          tags: [mainTag ? mainTag : ""],
        }))
        .filter((c: any) => c.front.text && c.back.text);

      if (newCards.length === 0) {
        notifyAlert("Não há cards válidos para adicionar.", "orange");
        return;
      }

      const messages: string[] = [];
      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response.data.addedNewFlashcards ? response.data.addedNewFlashcards : ""}` +
          `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(
        messages.join(" | ") || "Flashcards adicionados.",
        partnerColor(),
      );
      setClickedButtons(new Set(sentences.map((_, idx) => idx)));
      setDone(true);
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0px", minHeight: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          gap: 8,
        }}
      >
        {!done && (
          <button
            onClick={addAllCards}
            disabled={loading}
            style={{
              border: `1px solid ${partnerColor()}`,
              background: "#fff",
              color: loading ? "#ccc" : partnerColor(),
              fontWeight: "700",
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {loading ? "Adding..." : "Add all"}
          </button>
        )}

        {/* Match Mode AGORA SÓ ABRE MODAL */}
        <button
          onClick={() => setShowMatchModal(true)}
          style={{
            border: `1px solid ${partnerColor()}`,
            background: partnerColor(),
            color: "#fff",
            fontWeight: "700",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          Match Mode
        </button>
      </div>

      {/* LISTA NORMAL (sem match interno) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "10px",
        }}
      >
        {sentences.map((sentence: any, i: number) => {
          const { frontLang } = getLanguages(sentence);

          return (
            <div
              key={i}
              style={{
                border: "1px solid #e3e6ea",
                borderRadius: "4px",
                padding: "8px 12px 8px 12px",
                position: "relative",
                minHeight: "40px",
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <Tooltip title="Ouvir frente" placement="top" arrow>
                    <button
                      style={{
                        color: partnerColor(),
                        padding: 0,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        background: "none",
                        transition: "all 0.2s",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        readText(
                          sentence.english,
                          true,
                          frontLang,
                          selectedVoice,
                        );
                      }}
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  </Tooltip>

                  <div style={{ marginLeft: 10 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        color: "#222",
                        fontSize: "14px",
                        marginBottom: 2,
                        wordBreak: "break-word",
                      }}
                    >
                      {sentence.english}
                    </div>
                    <div
                      style={{
                        color: "#6c757d",
                        fontStyle: "italic",
                        fontSize: "13px",
                        wordBreak: "break-word",
                      }}
                    >
                      {sentence.portuguese}
                    </div>
                  </div>
                </span>

                <span>
                  {!clickedButtons.has(i) && (
                    <Tooltip
                      title="Adicionar ao flashcard"
                      placement="top"
                      arrow
                    >
                      <button
                        disabled={loading}
                        style={{
                          background: "none",
                          color: loading ? "#ccc" : partnerColor(),
                          width: "18px",
                          height: "18px",
                          border: "none",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "15px",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          opacity: 0.7,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (loading) return;
                          addNewCards(
                            sentence.english,
                            sentence.portuguese,
                            i,
                            sentence.languages ? sentence.languages : null,
                          );
                        }}
                      >
                        +
                      </button>
                    </Tooltip>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DO MATCH (renderiza o 2º componente) */}
      {showMatchModal &&
        ReactDOM.createPortal(
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.70)",
                zIndex: 999,
              }}
              onClick={() => setShowMatchModal(false)}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.50)",
                width: "92vw",
                maxWidth: 900,
                maxHeight: "85vh",
                padding: 12,
                zIndex: 1000,
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <button
                  onClick={() => setShowMatchModal(false)}
                  style={{
                    border: "none",
                    marginLeft: "auto",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              <VocabularyMatchExercise
                sentences={sentences}
                studentId={studentId}
                selectedVoice={selectedVoice}
                courseId={courseId || element?.courseId}
                language={language}
                exerciseScore={(points: number, label?: string) => {
                  // adapta assinatura pro seu callback original
                  exerciseScore(
                    points,
                    label || "Match Vocabulary",
                    element?._id,
                  );
                }}
              />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
