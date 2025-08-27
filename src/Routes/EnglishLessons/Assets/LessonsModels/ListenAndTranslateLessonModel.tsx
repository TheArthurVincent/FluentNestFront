import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { readText } from "../Functions/FunctionLessons";
interface ListenAndTranslateLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
}

export default function ListenAndTranslateLessonModel({
  headers,
  element,
}: ListenAndTranslateLessonModelProps) {
  return (
    <div
      style={{
        listStyle: "none",
        padding: "5px",
        fontWeight: 600,
        margin: "10px 0",
      }}
    >
      {element.audios &&
        element.audios.map((audio: any, index: number) => {
          return (
            <div key={index}>
              <span>
                <span>{index + 1}</span> | {audio.ptbrText}
              </span>
              <button
                className="audio-button"
                onClick={() => readText(audio.enusAudio, true)}
              >
                <i className="fa fa-volume-up" aria-hidden="true" />
              </button>
            </div>
          );
        })}
    </div>
  );
}
