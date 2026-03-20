import React, { useMemo, useState } from "react";
import { Lesson, mockCourse, Module } from "./mockCourse";

const newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: 24,
} as const;

/* ================= HELPERS ================= */

function toYouTubeEmbedUrl(url?: string) {
  if (!url) return "";

  // Already embed
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch?.[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  // youtu.be/<id>
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // youtube.com/watch?v=<id>
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // Fallback: return as-is (supports Vimeo/embed links etc.)
  return url;
}

/* ================= COMPONENT ================= */

type CourseStructureProps = {
  isDesktop: boolean;
};

export default function CourseStructure({ isDesktop }: CourseStructureProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(
    mockCourse.modules[0],
  );

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    mockCourse.modules[0].lessons[0],
  );

  const embedSrc = useMemo(
    () => toYouTubeEmbedUrl(selectedLesson?.video),
    [selectedLesson?.video],
  );

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>Arvin Course</span>
          </section>
        </div>
      )}

      {/* Layout wrapper (responsivo) */}
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        {/* Sidebar / Lista de módulos e aulas */}
        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            margin: !isDesktop ? "12px" : "16px auto",
            fontStyle: "SemiBold",
            fontSize: "14px",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            border: "1px solid #e8eaed",
            padding: "12px",
            width: isDesktop ? 320 : "auto",
            flexShrink: 0,
            maxHeight: isDesktop ? "calc(100vh - 160px)" : "none",
            overflow: isDesktop ? "auto" : "visible",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 2px 10px 2px",
              borderBottom: "1px solid #eef0f2",
              marginBottom: 10,
            }}
          >
            <span style={{ ...newArvinTitleStyle, fontSize: 16 }}>
              Estrutura
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#5f6368",
              }}
            >
              {mockCourse.modules.length} módulos
            </span>
          </div>

          {mockCourse.modules.map((module) => {
            const isSelectedModule = selectedModule?.id === module.id;

            return (
              <div key={module.id} style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: isSelectedModule ? "#f6f8fa" : "transparent",
                    border: isSelectedModule
                      ? "1px solid #eef0f2"
                      : "1px solid transparent",
                    transition: "background 120ms ease",
                  }}
                  onClick={() => {
                    setSelectedModule(module);
                    setSelectedLesson(module.lessons[0]);
                  }}
                >
                  <span style={{ lineHeight: 1.2 }}>{module.title}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#5f6368",
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: "#ffffff",
                      border: "1px solid #eef0f2",
                    }}
                  >
                    {module.lessons.length}
                  </span>
                </div>

                {isSelectedModule &&
                  module.lessons.map((lesson) => {
                    const isSelectedLesson = selectedLesson?.id === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: isSelectedLesson
                            ? "#f1f3f4"
                            : "transparent",
                          border: isSelectedLesson
                            ? "1px solid #e8eaed"
                            : "1px solid transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          transition: "background 120ms ease",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: isSelectedLesson ? 800 : 600,
                            color: "#202124",
                            lineHeight: 1.2,
                          }}
                        >
                          {lesson.title}
                        </span>

                        <div style={{ display: "flex", gap: 6 }}>
                          {lesson.video && (
                            <span
                              title="Aula com vídeo"
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 99,
                                background: "#1a73e8",
                                opacity: 0.9,
                              }}
                            />
                          )}
                          {lesson.html && (
                            <span
                              title="Aula com explicação"
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 99,
                                background: "#34a853",
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* Conteúdo da Aula */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            border: "1px solid #e8eaed",
            borderRadius: 6,
            padding: 16,
            margin: !isDesktop ? "0px 12px 12px 12px" : "16px auto",
            minHeight: isDesktop ? "calc(100vh - 160px)" : "auto",
          }}
        >
          {selectedLesson ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: isDesktop ? "center" : "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid #eef0f2",
                  marginBottom: 12,
                  flexDirection: isDesktop ? "row" : "column",
                }}
              >
                <h2 style={{ ...newArvinTitleStyle, fontSize: 20, margin: 0 }}>
                  {selectedLesson.title}
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {selectedLesson.video && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1a73e8",
                        background: "#eef3fd",
                        border: "1px solid #dfe7fb",
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      Vídeo
                    </span>
                  )}
                  {selectedLesson.html && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#188038",
                        background: "#eef7f0",
                        border: "1px solid #dcefe0",
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      Explicação
                    </span>
                  )}
                </div>
              </div>

              {/* Video (com conversão para embed) */}
              {embedSrc && (
                <div
                  style={{
                    marginTop: 12,
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    borderRadius: 10,
                    border: "1px solid #eef0f2",
                    background: "#fafafa",
                  }}
                >
                  <iframe
                    src={embedSrc}
                    title={selectedLesson.title}
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: 10,
                    }}
                  />
                </div>
              )}

              {/* HTML Inline */}
              {selectedLesson.html && (
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#202124",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedLesson.html,
                  }}
                />
              )}

              {/* Estado vazio */}
              {!selectedLesson.video && !selectedLesson.html && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 10,
                    border: "1px dashed #e0e3e7",
                    color: "#5f6368",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  Esta aula ainda não possui vídeo ou explicação.
                </div>
              )}
            </>
          ) : (
            <div style={{ color: "#5f6368", fontSize: 14 }}>
              Selecione uma aula
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
