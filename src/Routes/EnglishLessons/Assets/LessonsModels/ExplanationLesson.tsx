import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  partnerColor,
  textGeneralFont,
  textTitleFont,
} from "../../../../Styles/Styles";

interface ExplanationItem {
  title: string;
  image: string;
  list: string[];
}

interface ExplanationLessonProps {
  headers: MyHeadersType | null;
  element: {
    explanation: ExplanationItem[];
  };
}



export default function ExplanationLesson({
  headers,
  element,
}: ExplanationLessonProps) {
  return (
    <div
      style={{
        padding: "2px",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "1fr",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {element.explanation &&
          element.explanation.map(
            (explanationItem: ExplanationItem, index: number) => (
              <div
                key={index}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "10px",
                  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decoração de fundo */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    background: `linear-gradient(135deg, ${partnerColor()}15 0%, ${partnerColor()}08 100%)`,
                    borderRadius: "50%",
                    zIndex: 0,
                  }}
                />

                {/* Título da explicação */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontWeight: "600",
                    marginBottom: "12px",
                    fontFamily: textTitleFont(),
                    fontSize: 24,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.2",
                  }}
                >
                  {explanationItem.title}

                  {/* Linha decorativa moderna */}
                  <div
                    style={{
                      marginTop: "5px",
                      width: "80px",
                      height: "1px",
                      background: `linear-gradient(90deg, ${partnerColor()} 0%, ${partnerColor()}60 100%)`,
                      borderRadius: "6px",
                    }}
                  />
                </div>

                {/* Imagem se existir */}
                {explanationItem.image && (
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={explanationItem.image}
                      alt={explanationItem.title}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "6px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                      }}
                    />
                  </div>
                )}

                {/* Lista de explicações */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {explanationItem.list.map(
                    (listItem: string, listIndex: number) => (
                      <div
                        key={listIndex}
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          border: "1px solid #f1f5f9",
                          borderLeft: `5px solid ${partnerColor()}`,
                          transition:
                            "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
                          padding: "5px 10px",
                        }}
                      >
                        {/* Conteúdo da explicação */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "20px",
                          }}
                        >
                          {/* Texto da explicação */}
                          <div
                            style={{
                              // fontSize: "17px",
                              fontWeight: "400",
                              lineHeight: "1.7",
                              fontFamily: textGeneralFont(),
                              flex: 1,
                            }}
                          >
                            {listItem}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
