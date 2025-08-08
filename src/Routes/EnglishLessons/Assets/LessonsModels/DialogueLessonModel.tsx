import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert } from "../Functions/FunctionLessons";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { Tooltip } from "@mui/material";
import { textTitleFont, partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import axios from "axios";

interface DialogueLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  selectedVoice?: any;
}

const readDialogueText = async (
  text: string,
  isPersonA: boolean
) => {
  if (window?.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  try {
    // Pessoa A = voz masculina, Pessoa B = voz feminina
    const gender = isPersonA ? "MALE" : "FEMALE";
    
    const response = await axios.post(`${backDomain}/api/v1/text-to-speech`, {
      text,
      languageCode: "en-US",
      gender: gender,
      pitch: 0.6,
      speakingRate: 0.9,
    });

    const audioBase64 = response.data.audio;
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.play();
  } catch (error) {
    notifyAlert("Erro ao gerar áudio");
    console.error("Erro TTS:", error);
  }
};

export default function DialogueLessonModel({
  element,
  headers,
  selectedVoice,
}: DialogueLessonModelProps) {
  function isEven(val: number) {
    return val % 2 === 0;
  }

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8fafc",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
      }}
    >
      {element.subtitle && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Ícone de conversa */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: partnerColor(),
                color: "white",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              💬
            </div>
          </div>

          {/* Linha central do diálogo */}
          <div
            style={{
              position: "relative",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                bottom: "0",
                width: "3px",
                backgroundColor: "#e2e8f0",
                transform: "translateX(-50%)",
                borderRadius: "2px",
              }}
            />

            {element.dialogue &&
              element.dialogue.map((text: any, index: number) => {
                const isLeft = isEven(index);
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isLeft ? "flex-start" : "flex-end",
                      marginBottom: "20px",
                      position: "relative",
                    }}
                  >
                    {/* Avatar para pessoa A (esquerda) */}
                    {isLeft && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        👨🏻
                      </div>
                    )}

                    {/* Balão de conversa */}
                    <Tooltip title="Clique para ouvir">
                      <div
                        style={{
                          maxWidth: "70%",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          readDialogueText(text, isLeft)
                        }
                      >
                        <div
                          style={{
                            backgroundColor: isLeft
                              ? "#ffffff"
                              : partnerColor(),
                            color: isLeft ? "#1f2937" : "white",
                            padding: "16px 20px",
                            borderRadius: isLeft
                              ? "20px 20px 20px 0px"
                              : "20px 20px 0px 20px",
                            boxShadow: isLeft
                              ? "0 0px 12px rgba(0,0,0,0.1)"
                              : `0 0px 12px ${partnerColor()}40`,
                            border: isLeft ? "1px solid #e5e7eb" : "none",
                            fontFamily: textTitleFont(),
                            fontSize: "15px",
                            lineHeight: "1.5",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow = isLeft
                              ? "0 6px 20px rgba(0,0,0,0.15)"
                              : `0 6px 20px ${partnerColor()}60`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = isLeft
                              ? "0 4px 12px rgba(0,0,0,0.1)"
                              : `0 4px 12px ${partnerColor()}40`;
                          }}
                        >
                          {text}
                        </div>
                      </div>
                    </Tooltip>

                    {/* Avatar para pessoa B (direita) */}
                    {!isLeft && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginLeft: "12px",
                          flexShrink: 0,
                        }}
                      >
                        👩🏽
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {element.text && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f1f5f9",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontFamily: textTitleFont(),
            fontSize: "14px",
            color: "#64748b",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {element.text}
        </div>
      )}
    </div>
  );
}
