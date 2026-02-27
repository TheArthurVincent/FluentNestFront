import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";

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
          gridTemplateColumns: "1fr",
        }}
      >
        {item && item?.map((theitem: string, index: number) => {
          return (
            <div
              key={index}
              style={{
                padding: "8px",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                borderBottom: `1px solid ${partnerColor()}50`,
              }}
            >
              {/* Header com número e texto do exercício */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1a202c",
                    lineHeight: "1.5",
                    letterSpacing: "-0.01em",
                    flex: 1,
                  }}
                >
                  <b>{index + 1}-</b> {theitem}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
