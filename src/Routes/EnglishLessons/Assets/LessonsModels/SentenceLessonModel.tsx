import React, { useState } from "react";
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
  textTitleFont,
} from "../../../../Styles/Styles";

interface SentenceLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
}

export default function SentenceLessonModel({
  headers,
  element,
  mainTag,
  studentId,
  selectedVoice,
}: SentenceLessonModelProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null
  ) => {
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
        width: "100%",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
                e.currentTarget.style.background = "#f3f3f3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
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
                <span
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
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
                        background: "none",
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
                          backgroundColor: textpartnerColorContrast(),
                          color: partnerColor(),
                          width: "10px",
                          height: "10px",
                          border: "none",
                          borderRadius: "50%",
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
                          addNewCards(
                            sentence.english,
                            sentence.portuguese,
                            i,
                            sentence.languages ? sentence.languages : null
                          );
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
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#222",
                    fontSize: "15px",
                    fontFamily: textTitleFont(),
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
          ))}
      </div>
    </div>
  );
}
