import React from "react";
import {
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";

interface SentenceLessonModelProps {
  element: any;
  headers: MyHeadersType | null;
  studentId: string;
  selectedVoice: string;
}

export default function SentenceLessonModelSlide({
  element,
  selectedVoice,
  studentId,
  headers,
}: SentenceLessonModelProps) {
  const actualHeaders = headers || {};

  const addNewCards = async (frontText: string, backText: string) => {
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
      },
    ];

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${studentId}`,
        { newCards },
        { headers: actualHeaders }
      );
      notifyAlert("Card adicionado", "green");
    } catch (error) {
      alert("Erro ao enviar cards");
    }
  };

  return (
    <ul
      style={{
        alignItems: "center",
        display: "grid",
        gap: "10rem",
        marginTop: "5rem",
        marginBottom: "5rem",
      }}
    >
      {element.sentences &&
        element.sentences.map((sentence: any, i: number) => (
          <li
            style={{
              margin: "1rem",
              listStyle: "none",
            }}
            key={i}
          >
            <span>
              <strong
                style={{
                  fontSize: "2rem",
                  color: !sentence.portuguese ? partnerColor() : "#000",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    cursor: "pointer",
                    marginRight: "1rem",
                    fontFamily: textTitleFont(),
                  }}
                  onClick={() => {
                    readText(sentence.english, true, "en", selectedVoice);
                  }}
                >
                  <i className="fa fa-volume-up" aria-hidden="true" />
                </span>{" "}
                {sentence.english}
              </strong>
            </span>
            <br />
            <span
              style={{
                fontSize: "1.8rem",
                fontStyle: "italic",
              }}
            >
              {sentence.portuguese}
            </span>
          </li>
        ))}
    </ul>
  );
}
