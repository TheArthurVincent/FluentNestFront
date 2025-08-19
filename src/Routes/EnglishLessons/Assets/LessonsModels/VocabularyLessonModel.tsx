import React, { useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";

interface VocabularyLessonProps {
  headers: MyHeadersType | null;
  element: any;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
}

export default function VocabularyLesson({
  headers,
  element,
  mainTag,
  studentId,
  selectedVoice,
}: VocabularyLessonProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number
  ) => {
    const newCards = [
      {
        front: {
          text: frontText,
          language: "en",
        },
        back: {
          text: backText,
          language: "pt",
        },
        tags: [mainTag ? mainTag : ""],
      },
    ];

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${studentId}`,
        { newCards },
        { headers: actualHeaders }
      );
      const showThis =
        `${
          response.data.addedNewFlashcards
            ? response.data.addedNewFlashcards
            : ""
        }` +
        `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

      notifyAlert(showThis, "green");

      // Adicionar o índice do botão clicado ao conjunto
      setClickedButtons((prev) => new Set(prev).add(index));
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  return (
    <div
      style={{
        padding: "0px",
        background: "#f6f7f9",
        minHeight: "100px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px #eee",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "10px",
        }}
      >
        {element.sentences &&
          element.sentences.map((sentence: any, i: number) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e3e6ea",
                borderRadius: "7px",
                padding: "8px 12px 8px 12px",
                position: "relative",
                boxShadow: "0 1px 4px #e3e6ea",
                minHeight: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px #e3e6ea";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 4px #e3e6ea";
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
                {/* Botão + para adicionar aos flashcards */}
                <span
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  {/* Botão de áudio */}
                  <Tooltip title="Ouvir" placement="top" arrow>
                    <button
                      style={{
                        border: "none",
                        color: partnerColor(),
                        cursor: "pointer",
                        padding: "0",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        boxShadow: "0 1px 2px #e3e6ea",
                        transition: "all 0.2s",
                        opacity: 0.6,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        readText(sentence.english, true, "en", selectedVoice);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.6";
                      }}
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  </Tooltip>
                  <div style={{ marginLeft: 10 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#222",
                        fontFamily: textTitleFont(),
                        fontSize: "15px",
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
                        style={{
                          backgroundColor: partnerColor(),
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "15px",
                          cursor: "pointer",
                          boxShadow: "0 1px 2px #e3e6ea",
                          transition: "all 0.2s",
                          opacity: 0.7,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addNewCards(sentence.english, sentence.portuguese, i);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "0.7";
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
