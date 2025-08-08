import React, { useState } from "react";
import { textTitleFont, partnerColor } from "../../../../Styles/Styles";
import { Tooltip } from "@mui/material";
import { readText, notifyAlert } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";

interface Props {
  element: any;
  userToken?: string;
  selectedVoice?: any;
}

export default function ImageLessonModelSlide({
  element,
  userToken,
  selectedVoice,
}: Props) {
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());

  const addToFlashCards = async (item: any, index: number) => {
    try {
      // Buscar token do localStorage se não for fornecido
      const token =
        userToken || localStorage.getItem("loggedIn")
          ? JSON.parse(localStorage.getItem("loggedIn") || "{}").token
          : "";

      const response = await axios.post(
        `${backDomain}/lessons/flashcards`,
        {
          portuguese: item.text,
          english: item.text, // Usando o mesmo texto para inglês
          image: item.img,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setClickedButtons((prev) => new Set(prev).add(index));
        notifyAlert("Flashcard criado com sucesso!", "success", 1200);
      }
    } catch (error: any) {
      console.error("Erro ao criar flashcard:", error);
      if (error.response?.status === 401) {
        onLoggOut();
      } else {
        notifyAlert("Erro ao criar flashcard", "error", 1200);
      }
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
        {element.images &&
          element.images.map((image: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
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
              {/* Botões de interação no topo à direita */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  display: "flex",
                  gap: "4px",
                  zIndex: 10,
                }}
              >
                {/* Botão de Audio */}
                <Tooltip title="Ouvir texto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readText(image.text, true, "en", selectedVoice);
                    }}
                    style={{
                      backgroundColor: "rgba(0, 123, 255, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(4px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 123, 255, 1)";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(0, 123, 255, 0.9)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    🔊
                  </button>
                </Tooltip>

                {/* Botão de Add Flashcard */}
                {!clickedButtons.has(i) && (
                  <Tooltip title="Adicionar aos flashcards">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToFlashCards(image, i);
                      }}
                      style={{
                        backgroundColor: `rgba(${partnerColor()
                          .replace("rgb(", "")
                          .replace(")", "")}, 0.9)`,
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        backdropFilter: "blur(4px)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = partnerColor();
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `rgba(${partnerColor()
                          .replace("rgb(", "")
                          .replace(")", "")}, 0.9)`;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      +
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Imagem */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={image.img}
                  alt={image.text || "Lesson image"}
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Texto da imagem */}
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "#111",
                    fontFamily: textTitleFont(),
                    textAlign: "center",
                  }}
                >
                  {image.text}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
