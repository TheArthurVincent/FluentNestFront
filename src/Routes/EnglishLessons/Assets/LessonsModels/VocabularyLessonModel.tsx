import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import { LiSentence, UlSentences } from "../Functions/EnglishActivities.Styled";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
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
  
  useEffect(() => {
    console.log(element);
  }, []);
  
  const addNewCards = async (frontText: string, backText: string, index: number) => {
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
      setClickedButtons(prev => new Set(prev).add(index));
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  return (
    <div
      style={{
        padding: "8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {element.sentences &&
          element.sentences.map((sentence: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                // border: "2px solid #e9ecef",
                borderRadius: "8px",
                padding: "5px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#dee2e6";
                e.currentTarget.style.boxShadow = `0 2px 8px rgba(0,0,0,0.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e9ecef";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Botão + para adicionar aos flashcards */}
              {!clickedButtons.has(i) && (
                <Tooltip title="Add to flashcards" placement="top" arrow>
                  <button
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: partnerColor(),
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addNewCards(sentence.english, sentence.portuguese, i);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.28)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                  >
                    +
                  </button>
                </Tooltip>
              )}

              {/* Botão de áudio */}
              <button
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  color: partnerColor(),
                  cursor: "pointer",
                  // fontSize: "14px",
                  padding: "6px",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  readText(sentence.english, true, "en", selectedVoice);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = partnerColor();
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = partnerColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.color = partnerColor();
                  e.currentTarget.style.borderColor = "#e9ecef";
                }}
              >
                <i className="fa fa-volume-up" aria-hidden="true" />
              </button>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{
                    // fontSize: "14px",
                    fontWeight: "600",
                    color: "#111",
                    fontFamily: textTitleFont(),
                  }}
                >
                  {sentence.english}
                </div>
                <div
                  style={{
                    // fontSize: "12px",
                    color: "#6c757d",
                    fontStyle: "italic",
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
