import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { readText } from "../Functions/FunctionLessons";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";

interface VocabularyLessonProps {
  element: any;
  selectedVoice: any;
}

export default function VocabularyLesson({
  element,
  selectedVoice,
}: VocabularyLessonProps) {

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
        {element.sentences &&
          element.sentences.map((sentence: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                // border: "2px solid #e9ecef",
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
              {/* Botão de áudio */}
              <button
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  color: partnerColor(),
                  cursor: "pointer",
                  // fontSize: "14px",
                  padding: "6px",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  readText(sentence.english, true, "en", selectedVoice);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = partnerColor();
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = partnerColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.color = partnerColor();
                  e.currentTarget.style.borderColor = "#e9ecef";
                }}
              >
                <i className="fa fa-volume-up" aria-hidden="true" />
              </button>
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
                  }}
                >
                  {sentence.english}
                </div>
                <div
                  style={{
                    color: "#6c757d",
                    fontStyle: "italic",
                  }}
                >
                  {sentence.portuguese}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
