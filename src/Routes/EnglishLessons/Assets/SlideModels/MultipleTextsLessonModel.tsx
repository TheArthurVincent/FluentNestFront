import React, { useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { readText } from "../Functions/FunctionLessons";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
interface MultipleTextsLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
}

export default function MultipleTextsLessonModel({
  element,
}: MultipleTextsLessonModelProps) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  return (
    <div
      style={{
        padding: "5px",
        margin: "10px 0",
      }}
    >
      {element.subtitle && (
        <div>
          {element.subtexts &&
            element.subtexts.map((text: any, index: number) => {
              return (
                <div key={index}>
                  {text.subtexttitle && <HThree>{text.subtexttitle}</HThree>}
                  {text.text && (
                    <>
                      <p
                        style={{
                          marginBottom: "2rem",
                        }}
                      >
                        {text.text}
                        <button
                          className="audio-button"
                          onClick={() => {
                            readText(text, false);
                            setIsPaused(!isPaused);
                          }}
                        >
                          <i
                            className={
                              !isPaused ? "fa fa-volume-up" : "fa fa-pause"
                            }
                            aria-hidden="true"
                          />
                        </button>
                      </p>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
      {element.text && <div>{element.text}</div>}
    </div>
  );
}
