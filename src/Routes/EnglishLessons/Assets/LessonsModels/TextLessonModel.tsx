import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import TextAreaLesson from "../Functions/TextAreaLessons";
import {
  partnerColor,
  textGeneralFont,
  textTitleFont,
} from "../../../../Styles/Styles";

interface TextLessonModelProps {
  headers: MyHeadersType | null;
  text: string;
  image: string;
}

export default function TextLessonModel({ text, image }: TextLessonModelProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        borderRadius: "16px",
        padding: "24px",
        margin: "20px 0",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        border: `2px solid ${partnerColor()}20`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative element */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          background: `linear-gradient(45deg, ${partnerColor()}20, ${partnerColor()}10)`,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Content container */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Image section */}
        {image && (
          <div
            style={{
              marginBottom: "20px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={image}
              alt="Lesson illustration"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "300px",
                objectFit: "cover",
                display: "block",
                border: `2px solid ${partnerColor()}20`,
                borderRadius: "12px",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Text content */}
        <div
          style={{
            fontFamily: textGeneralFont(),
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#2c3e50",
            marginBottom: "20px",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            textAlign: "justify",
          }}
        >
          {text}
        </div>

        {/* Text area section */}
        <div
          style={{
            marginTop: "16px",
          }}
        >
          <div
            style={{
              fontFamily: textTitleFont(),
              fontSize: "14px",
              fontWeight: "600",
              color: partnerColor(),
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            📝 Your Notes
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              padding: "4px",
              border: `1px solid ${partnerColor()}30`,
            }}
          >
            <TextAreaLesson />
          </div>
        </div>
      </div>
    </div>
  );
}
