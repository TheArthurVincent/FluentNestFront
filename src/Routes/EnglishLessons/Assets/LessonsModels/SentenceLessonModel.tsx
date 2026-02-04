import React, { useEffect, useMemo, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";

interface SentenceLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
  studentsIds?: string[];
}

export default function SentenceLessonModel({
  headers,
  element,
  mainTag,
  studentId,
  selectedVoice,
  studentsIds,
}: SentenceLessonModelProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const sentences: any[] = useMemo(() => {
    return Array.isArray(element?.sentences) ? element.sentences : [];
  }, [element?.sentences]);

  useEffect(() => {
    setClickedButtons(new Set());
    setLoading(false);
    setDone(false);
  }, [element?.sentences]);

  const getTargetIds = (): string[] => {
    if (
      permissions !== "student" &&
      Array.isArray(studentsIds) &&
      studentsIds.length > 0
    ) {
      return studentsIds;
    }
    return studentId ? [studentId] : [];
  };

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null,
  ) => {
    if (loading) return;

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

      notifyAlert(messages.join(" | ") || "Flashcards adicionados.", "green");
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

    setLoading(true);
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

      notifyAlert(messages.join(" | ") || "Flashcards adicionados.", "green");
      setClickedButtons(new Set(sentences.map((_: any, idx: number) => idx)));
      setDone(true);
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "0px",
        minHeight: "100px",
        borderRadius: "4px",
        width: "100%",
        margin: "auto",
      }}
    >
      {/* Top bar */}
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
      </div>

      <div style={{ display: "grid", gap: "10px", opacity: loading ? 0.9 : 1 }}>
        {sentences.map((sentence: any, i: number) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderLeft: `3px solid ${partnerColor()}`,
              paddingLeft: "12px",
              position: "relative",
              minHeight: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f3f3f38a")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <Tooltip title="Ouvir" placement="top" arrow>
                  <button
                    style={{
                      all: "unset",
                      color: partnerColor(),
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      background: "none",
                      transition: "all 0.2s",
                      opacity: 0.6,
                    }}
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (loading) return;
                      readText(sentence.english, true, "en", selectedVoice);
                    }}
                  >
                    <i className="fa fa-volume-up" aria-hidden="true" />
                  </button>
                </Tooltip>

                <div>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#222",
                      fontSize: "18px",
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
                      fontSize: "14px",
                      wordBreak: "break-word",
                    }}
                  >
                    {sentence.portuguese}
                  </div>
                </div>
              </div>

              <span>
                {!clickedButtons.has(i) && (
                  <Tooltip title="Adicionar ao flashcard" placement="top" arrow>
                    <button
                      disabled={loading}
                      style={{
                        all: "unset",
                        cursor: loading ? "not-allowed" : "pointer",
                        padding: "6px 10px",
                        backgroundColor: textpartnerColorContrast(),
                        color: loading ? "#ccc" : partnerColor(),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
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
        ))}
      </div>
    </div>
  );
}
