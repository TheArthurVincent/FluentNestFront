import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";

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

  useEffect(() => {
    console.log(element);
  }, []);

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
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "10px",
        }}
      >
        {element.sentences &&
          element.sentences.map((sentence: any, i: number) => (
            <div
              key={i}
              style={{
                borderRadius: "16px",
                width: "90%",
                padding: "16px",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(170, 170, 170, 0.08), 0 1px 3px rgba(116, 116, 116, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f8f8ff";
                
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              {/* Botão + para adicionar aos flashcards */}
              {!clickedButtons.has(i) && (
                <Tooltip title="Add to flashcards" placement="top" arrow>
                  <button
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: `linear-gradient(135deg, ${partnerColor()} 0%, ${partnerColor()}dd 100%)`,
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      boxShadow: `0 4px 15px ${partnerColor()}40, 0 2px 4px rgba(0,0,0,0.1)`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addNewCards(sentence.english, sentence.portuguese, i);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.1) rotate(90deg)";
                      e.currentTarget.style.boxShadow = `0 8px 25px ${partnerColor()}50, 0 4px 8px rgba(0,0,0,0.15)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      e.currentTarget.style.boxShadow = `0 4px 15px ${partnerColor()}40, 0 2px 4px rgba(0,0,0,0.1)`;
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
                  top: "16px",
                  right: "16px",
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  border: "1px solid #dee2e6",
                  color: partnerColor(),
                  cursor: "pointer",
                  // fontSize: "14px",
                  padding: "8px",
                  borderRadius: "12px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  boxShadow:
                    "0 3px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  readText(sentence.english, true, "en", selectedVoice);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${partnerColor()} 0%, ${partnerColor()}dd 100%)`;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = partnerColor();
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 6px 20px ${partnerColor()}30, inset 0 1px 0 rgba(255,255,255,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
                  e.currentTarget.style.color = partnerColor();
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 3px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)";
                }}
              >
                <i className="fa fa-volume-up" aria-hidden="true" />
              </button>

              <div
                style={{
                  marginTop: "60px",
                  paddingTop: "20px",
                  borderTop: "1px solid #f0f3f6",
                  position: "relative",
                }}
              >
                {/* Decorative line */}
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "2px",
                    background: `linear-gradient(90deg, transparent 0%, ${partnerColor()} 50%, transparent 100%)`,
                  }}
                />

                <div
                  style={{
                    // fontSize: "18px",
                    fontWeight: "600",
                    color: "#1a202c",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    fontFamily:
                      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    letterSpacing: "-0.01em",
                    textShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {sentence.english}
                </div>

                <div
                  style={{
                    // fontSize: "15px",
                    color: "#6b7280",
                    lineHeight: "1.5",
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    padding: "12px 20px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${partnerColor()}30`,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
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
