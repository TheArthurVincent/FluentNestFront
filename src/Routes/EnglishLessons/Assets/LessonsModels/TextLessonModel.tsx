import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor, textGeneralFont } from "../../../../Styles/Styles";

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
        border: `2px solid ${partnerColor()}20`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Content container */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Image section */}
        {image && (
          <div
            style={{
              marginBottom: "20px",
              borderRadius: "6px",
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
                borderRadius: "6px",
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
            borderRadius: "6px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            textAlign: "justify",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
