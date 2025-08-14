import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { LiSentence, UlSentences } from "../Functions/EnglishActivities.Styled";
import { Tooltip } from "@mui/material";
import { notifyAlert, readText } from "../Functions/FunctionLessons";

interface AudioSoundTrackProps {
  headers: MyHeadersType | null;
  subtitle: string;
  link: string;
  studentId: string;
  mainTag: string;
  src: string;
  text: string;
  element: any;
  selectedVoice: any;
}

export default function AudioSoundTrack({
  headers,
  subtitle,
  studentId,
  src,
  link,
  element,
  mainTag,
  text,
  selectedVoice,
}: AudioSoundTrackProps) {
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
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  return (
    <>
      <iframe
        width="100%"
        height="80"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={src ? src : ""}
      />
      <div
        style={{
          fontSize: "10px",
          color: "#cccccc",
          lineBreak: "anywhere",
          wordBreak: "normal",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontFamily:
            "Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif",
          fontWeight: 100,
        }}
      >
        <a
          href="https://soundcloud.com/arthur-r-cardoso"
          title="-"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#cccccc", textDecoration: "none" }}
        >
          -
        </a>
        <a
          href={link}
          title={subtitle}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#cccccc", textDecoration: "none" }}
        >
          -
        </a>
      </div>
      {text && (
        <div
          style={{
            padding: "1rem",
            justifyContent: "center",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
      {element.sentences && (
        <UlSentences grid={element.grid}>
          {element.sentences &&
            element.sentences.map((sentence: any, i: number) => (
              <LiSentence key={i}>
                <Tooltip title="Add to flashcards">
                  <button
                    color="white"
                    onClick={() =>
                      addNewCards(sentence.english, sentence.portuguese)
                    }
                  >
                    <i className="fa fa-files-o" aria-hidden="true" />
                  </button>
                </Tooltip>
                <br />
                <br />
                <strong>{sentence.english}</strong>
                <span
                  className="audio-button"
                  onClick={() => {
                    readText(sentence.english, true, "en", selectedVoice);
                  }}
                >
                  <i className="fa fa-volume-up" aria-hidden="true" />
                </span>
                <br />
                <span style={{ fontStyle: "italic" }}>
                  {sentence.portuguese}
                </span>
              </LiSentence>
            ))}
        </UlSentences>
      )}
    </>
  );
}
