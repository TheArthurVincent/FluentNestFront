import React, { useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import axios from "axios";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { Tooltip } from "@mui/material";
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
    img: string,
    languages: any | null
  ) => {
    const newCards = [
      {
        back: {
          text: frontText,
          language: languages ? languages.language1 : "en",
        },
        front: {
          text: backText,
          language: languages ? languages.language2 : "pt",
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

  return (
    <div
      style={{
        padding: "8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "10px",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {element.images &&
          element.images.map((image: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundImage: `url(${image.img})`,
                width: "200px",
                height: "200px",
                backgroundSize: "cover",
                borderRadius: "3px",
                padding: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Ouvir texto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readText(image.text, true, "en", selectedVoice);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      border: "none",
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                      textShadow: "0 0 3px #555",
                    }}
                  >
                    <i className="fa fa-volume-up" />
                  </button>
                </Tooltip>
                {!clickedButtons.has(i) && (
                  <Tooltip title="Adicionar aos flashcards">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewCardsInverted(
                          image.english,
                          image.portuguese,
                          image.img,
                          image.languages ? image.languages : null
                        );
                        setClickedButtons((prev) => new Set(prev).add(i));
                      }}
                      style={{
                        color: "white",
                        border: "none",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "18px",
                        transition: "all 0.2s ease",
                        backgroundColor: "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textShadow: "0 0 3px #555",
                        }}
                      >
                        <i className="fa fa-plus" />
                      </span>
                    </button>
                  </Tooltip>
                )}
                {clickedButtons.has(i) && (
                  <div
                    style={{
                      color: "white",
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textShadow: "0 0 3px #555",
                    }}
                  >
                    <i className="fa fa-check" />
                  </div>
                )}
              </div>
              <div
                style={{
                  color: "#fff",
                  backgroundColor: "#00000095",
                  padding: "8px",
                  borderRadius: "3px",
                  textAlign: "center",
                  fontSize: "16px",
                  textShadow: "0 0 3px #555",
                }}
              >
                {image.text}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
