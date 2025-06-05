import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyError, readText } from "../Functions/FunctionLessons";
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
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
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

  const addNewCardsInverted = async (frontText: string, backText: string) => {
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

      notifyError(showThis, "green");
    } catch (error) {
      notifyError("Erro ao enviar cards");
      onLoggOut();
    }
  };

  return (
    <div
      className="sentences"
      style={{
        display: "flex",
        padding: "5px",
        margin: "10px 0",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <UlGridImageLessons>
        {element.images &&
          element.images.map((image: any, i: number) => (
            <LiGridImageLessons key={i}>
              <div>
                <ArvinButton
                  color="white"
                  onClick={() =>
                    addNewCardsInverted(image.english, image.portuguese)
                  }
                >
                  <i className="fa fa-folder" aria-hidden="true" />
                </ArvinButton>
              </div>
              <ImgLesson src={image.img} />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontStyle: "italic",
                  marginTop: "1.3rem",
                }}
              >
                <button
                  className="audio-button"
                  onClick={() =>
                    readText(image.text, true, "en", selectedVoice)
                  }
                >
                  <i className="fa fa-volume-up" aria-hidden="true" />
                </button>
                <span>{image.text}</span>
              </span>
              <TextAreaLesson />
            </LiGridImageLessons>
          ))}
      </UlGridImageLessons>
    </div>
  );
}
