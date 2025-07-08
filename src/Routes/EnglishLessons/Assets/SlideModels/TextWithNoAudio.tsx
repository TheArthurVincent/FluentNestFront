import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
interface TextsWithTranslateSlideLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
}

export default function TextsWithTranslateSlideLessonModel({
  element,
}: TextsWithTranslateSlideLessonModelProps) {
  return (
    <ul
      style={{
        padding: "5px",
        margin: "10px 0",
        fontWeight: 600,
        fontSize: "3rem",
        display: "grid",
        gap: "5rem",
      }}
    >
      {element.audios &&
        element.audios.map((audio: any, index: number) => {
          return (
            <div
              style={{
                marginTop: "10rem",
                padding: "2rem",
              }}
              key={index}
            >
              {audio.enusAudio}
            </div>
          );
        })}
    </ul>
  );
}
