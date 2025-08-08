import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  ImgLesson,
  LiGridImageLessons,
  UlGridImageLessons,
} from "../Functions/EnglishActivities.Styled";
import TextAreaLesson from "../Functions/TextAreaLessons";
import axios from "axios";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { CircularProgress, Tooltip } from "@mui/material";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";
interface ImageLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  id: string;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
}

export default function ImageLessonModel({
  headers,
  element,
  studentId,
  mainTag,
  selectedVoice,
}: ImageLessonModelProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());

  const addNewCardsInverted = async (
    frontText: string,
    backText: string,
    img: string
  ) => {
    const newCards = [
      {
        back: {
          text: frontText,
          language: "en",
        },
        front: {
          text: backText,
          language: "pt",
        },
        img,
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
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    }
  };
  const [loa, SetLoa] = useState(false);
  const handleAddImages = async () => {
    SetLoa(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/flashcard/add-images`,
        { refs: element.images },
        { headers: actualHeaders }
      );
      notifyAlert(
        `Atualizados: ${response.data.updatedCount} flashcards`,
        "green"
      );
      SetLoa(false);
    } catch (e) {
      notifyAlert("Erro ao atualizar imagens nos flashcards");
      console.log(e, "Erro ao atualizar imagens nos flashcards");
    }
  };
  return loa ? (
    <CircularProgress />
  ) : (
    <div
      style={{
        padding: "8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {element.images &&
          element.images.map((image: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            
            >
              {/* Botões de interação no topo */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginBottom: "12px",
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
                      backgroundColor: partnerColor(),
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
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
                        addNewCardsInverted(
                          image.english,
                          image.portuguese,
                          image.img
                        );
                        setClickedButtons((prev) => new Set(prev).add(i));
                      }}
                      style={{
                        backgroundColor: `rgba(${partnerColor()
                          .replace("rgb(", "")
                          .replace(")", "")}, 0.9)`,
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        boxShadow: `0 2px 8px ${partnerColor()}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = partnerColor();
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = `0 4px 12px ${partnerColor()}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `rgba(${partnerColor()
                          .replace("rgb(", "")
                          .replace(")", "")}, 0.9)`;
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = `0 2px 8px ${partnerColor()}40`;
                      }}
                    >
                      +
                    </button>
                  </Tooltip>
                )}

                {/* Indicador de adicionado */}
                {clickedButtons.has(i) && (
                  <div
                    style={{
                      backgroundColor: partnerColor(),
                      color: "white",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      boxShadow: `0 2px 8px ${partnerColor()}30`,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>

              {/* Imagem */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={image.img}
                  alt={image.text || "Lesson image"}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </div>

              {/* Texto da imagem */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1a1a1a",
                    fontFamily: textTitleFont(),
                    fontSize: "16px",
                  }}
                >
                  {image.text}
                </div>
                {/* {image.portuguese && (
                  <div
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      fontStyle: "italic",
                    }}
                  >
                    {image.portuguese}
                  </div>
                )} */}
              </div>

              {/* TextArea para notas */}
              <div
                style={{
                  marginTop: "16px",
                }}
              >
                <TextAreaLesson />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
