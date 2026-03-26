import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { notifyAlert } from "../Functions/FunctionLessons";

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
  hideText?: boolean;
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
  hideText,
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
        { headers: actualHeaders },
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
      notifyAlert("Erro ao enviar cards", "red");
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
          fontSize: "1em",
          color: "#cccccc",
          lineBreak: "anywhere",
          wordBreak: "normal",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontWeight: 100,
        }}
      >
        <a
          href="https://soundcloud.com/arthur-r-cardoso"
          title="-"
          rel="noopener noreferrer"
          style={{ color: "#cccccc", textDecoration: "none" }}
        >
          -
        </a>
        <a
          href={link}
          title={subtitle}
          rel="noopener noreferrer"
          style={{ color: "#cccccc", textDecoration: "none" }}
        >
          -
        </a>
      </div>
      {text && !hideText && (
        <div
          style={{
            padding: "1rem",
            justifyContent: "center",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
    </>
  );
}
