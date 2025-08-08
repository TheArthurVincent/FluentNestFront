import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import TextAreaLesson from "../Functions/TextAreaLessons";

interface ExerciseLessonModelProps {
  headers: MyHeadersType | null;
  item: any;
}

export default function ExerciseLessonModel({
  headers,
  item,
}: ExerciseLessonModelProps) {
  return (
    <div
      style={{
        padding: "10px",
        margin: "16px 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "8px",
          gridTemplateColumns: "1fr",
        }}
      >
        {item.map((theitem: string, index: number) => {
          return (
            <div
              key={index}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                border: "1px solid #e1e8ed",
                borderRadius: "12px",
                padding: "8px",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Header com número e texto do exercício */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                {/* Número do exercício */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${partnerColor()} 0%, ${partnerColor()}dd 100%)`,
                    color: "white",
                    borderRadius: "8px",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    boxShadow: `0 3px 10px ${partnerColor()}30, 0 1px 3px rgba(0,0,0,0.1)`,
                  }}
                >
                  {index + 1}
                </div>

                {/* Conteúdo do exercício */}
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1a202c",
                    lineHeight: "1.5",
                    fontFamily:
                      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    letterSpacing: "-0.01em",
                    flex: 1,
                  }}
                >
                  {theitem}
                </div>
              </div>

              {/* Textarea para resposta */}
              <textarea
                placeholder="Write your answer here..."
                style={{
                  width: "97%",
                  minHeight: "80px",
                  padding: "8px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  lineHeight: "1.5",
                  color: "#1a202c",
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease",
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = partnerColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e9ecef";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
