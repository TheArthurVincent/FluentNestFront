// ImportElementsEditor.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { backDomain } from "../../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../../Styles/Styles";
import { CircularProgress } from "@mui/material";
import { color } from "framer-motion";

interface ImportElementsEditorProps {
  lessonId: string; // aula que está sendo editada (destino)
  studentId: string; // aluno logado (pra limitar o que pode ver)
  headers?: any; // headers de auth
  onChange?: (info: {
    // callback opcional pra pai recarregar a aula
    importedCount: number;
    fromClassId: string;
    fromTitle: string;
    mode: "one" | "all";
  }) => void;
}

type ElementType = {
  _id?: string;
  subtitle?: string;
  comments?: string;
  type: string;
  sentences?: string[];
  text?: string;
  link?: string;
  items?: string[];
};

type LessonFromApi = {
  classId: string;
  title: string;
  tags: string[];
  elements?: ElementType[];
};

export default function ImportElementsEditor({
  lessonId,
  studentId,
  headers,
  onChange,
}: ImportElementsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [language, setLanguage] = useState<"en" | "pt" | "fr" | "es">("en");
  const [search, setSearch] = useState("");

  const [lessons, setLessons] = useState<LessonFromApi[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openClassId, setOpenClassId] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
    setLessons([]);
    setErrorMsg(null);
    setLoadingLessons(false);
    setOpenClassId(null);
    setImporting(false);
    setImportMsg(null);
    // ❌ antes recarregava a página
    // window.location.reload();
  };

  // ============================================
  // Preview de cada elemento (cartãozinho)
  // ============================================
  const renderElementPreview = (el: ElementType, index: number) => {
    const baseStyle: React.CSSProperties = {
      borderRadius: 6,
      border: "1px solid #e5e7eb",
      padding: 10,
      marginBottom: 8,
      background: "#ffffff",
    };

    const subtitle = el.subtitle || `(Elemento ${index + 1})`;

    if (el.type === "vocabulary") {
      return (
        <div key={index} style={baseStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#111827",
            }}
          >
            {subtitle}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Elemento de frases (sentences)
            {el.sentences && el.sentences.length > 0 && (
              <ul
                style={{
                  margin: "8px 0 0 16px",
                  padding: 0,
                  listStyleType: "disc",
                  maxHeight: 50,
                  overflowY: "auto",
                }}
              >
                {el.sentences.map((s: any, i: any) => (
                  <li key={i}>
                    {s.english}, {s.portuguese}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }

    if (el.type === "sentences") {
      return (
        <div key={index} style={baseStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#111827",
            }}
          >
            {subtitle}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Elemento de frases (sentences)
            {el.sentences && el.sentences.length > 0 && (
              <ul
                style={{
                  margin: "8px 0 0 16px",
                  padding: 0,
                  maxHeight: 50,
                  overflowY: "auto",
                  listStyleType: "disc",
                }}
              >
                {el.sentences.map((s: any, i: any) => (
                  <li key={i}>
                    {s.english}, {s.portuguese}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }
    if (el.type === "audio") {
      return (
        <div key={index} style={baseStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#111827",
            }}
          >
            {subtitle}
          </div>
          {el.text && (
            <div
              style={{
                fontSize: 12,
                color: "#4b5563",
                marginBottom: 4,
              }}
            >
              {el.text.slice(0, 160)}
              {el.text.length > 160 ? "..." : ""}
            </div>
          )}
          {el.link && (
            <a
              href={el.link}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "#2563eb" }}
            >
              Abrir áudio
            </a>
          )}
        </div>
      );
    }

    if (el.type === "exercise") {
      return (
        <div key={index} style={baseStyle}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              color: "#111827",
            }}
          >
            {subtitle}
          </div>
          {el.items && el.items.length > 0 && (
            <ul
              style={{
                margin: 0,
                marginTop: 4,
                paddingLeft: 18,
                fontSize: 12,
                color: "#374151",
              }}
            >
              {el.items.slice(0, 3).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // fallback genérico
    return (
      <div key={index} style={baseStyle}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4,
            color: "#111827",
          }}
        >
          {subtitle} <span style={{ fontWeight: 400 }}>({el.type})</span>
        </div>
      </div>
    );
  };

  // ============================================
  // Buscar aulas (título / tags / idioma)
  // ============================================
  useEffect(() => {
    const term = search.trim();
    if (!isOpen) return;

    if (!term) {
      setLessons([]);
      setErrorMsg(null);
      setLoadingLessons(false);
      setOpenClassId(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingLessons(true);
        setErrorMsg(null);
        setOpenClassId(null);

        const { data } = await axios.get(
          `${backDomain}/api/v1/courses-organized-query/${studentId}`,
          {
            headers: headers ? { ...headers } : {},
            params: {
              q: term,
              language,
            },
          }
        );

        const res: LessonFromApi[] = data?.lessons ?? [];
        setLessons(res);
      } catch (error: any) {
        console.error("Erro ao buscar aulas:", error);
        const msg =
          error?.response?.data?.error ||
          "Erro ao buscar aulas. Tente novamente.";
        setErrorMsg(msg);
        setLessons([]);
      } finally {
        setLoadingLessons(false);
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [search, language, isOpen, studentId, headers]);

  // ============================================
  // Chamar backend ImportNewElements
  // ============================================
  const importElementsToLesson = async (params: {
    mode: "one" | "all";
    fromClassId: string;
    fromTitle: string;
    elements: ElementType[];
  }) => {
    const { mode, fromClassId, fromTitle, elements } = params;

    if (!elements || elements.length === 0) return;

    try {
      setImporting(true);
      setImportMsg(null);

      const { data } = await axios.post(
        `${backDomain}/api/v1/course-classes/${lessonId}/import-new-elements`,
        {
          mode,
          fromClassId,
          fromTitle,
          elements,
        },
        {
          headers: headers ? { ...headers } : {},
        }
      );

      const importedCount = data?.importedCount ?? elements.length;

      setImporting(false);
      setImportMsg(
        data?.message ||
          `Importação concluída (${importedCount} elemento(s) copiado(s)).`
      );

      if (onChange) {
        onChange({
          importedCount,
          fromClassId,
          fromTitle,
          mode,
        });
      }

      // 👉 Agora, em vez de dar reload, apenas fecha o modal.
      closeModal();
    } catch (error: any) {
      console.error("Erro ao importar elementos:", error);
      setImporting(false);
      const msg =
        error?.response?.data?.error ||
        "Erro ao importar elementos. Tente novamente.";
      setImportMsg(msg);
    }
  };

  // ============================================
  // Modal
  // ============================================
  const modalContent = !isOpen ? null : (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={closeModal}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          width: "95%",
          maxWidth: 720,
          maxHeight: "90vh",
          overflow: "auto",
          padding: 20,
          fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Importar elementos de aulas prontas
          </h2>
          <button
            onClick={closeModal}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* MENSAGEM DE IMPORT (pode aparecer em erros) */}
        {importMsg && (
          <p
            style={{
              marginTop: 4,
              marginBottom: 12,
              fontSize: 12,
              color: importMsg.toLowerCase().includes("erro")
                ? "#b91c1c"
                : "#047857",
            }}
          >
            {importMsg}
          </p>
        )}

        {/* FILTROS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13 }}>Idioma:</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 13,
            }}
          >
            <option value="en">Inglês (EN)</option>
            <option value="pt">Português (PT)</option>
            <option value="fr">Francês (FR)</option>
            <option value="es">Espanhol (ES)</option>
          </select>
        </div>

        {/* CAMPO DE BUSCA */}
        <input
          type="text"
          placeholder="Pesquisar aulas (título ou tags)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 14,
            marginBottom: 14,
          }}
        />

        {/* RESULTADOS */}
        {search.trim().length > 0 && (
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #e5e7eb",
            }}
          >
            {loadingLessons && (
              <CircularProgress style={{ color: partnerColor() }} />
            )}

            {errorMsg && !loadingLessons && (
              <p
                style={{
                  fontSize: 13,
                  color: "#b91c1c",
                  margin: "0 0 8px 0",
                }}
              >
                {errorMsg}
              </p>
            )}

            {!loadingLessons && !errorMsg && (
              <>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Resultados ({lessons.length})
                </h4>

                {lessons.length === 0 ? (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    Nenhuma aula encontrada para esse termo.
                  </p>
                ) : (
                  lessons.map((lesson) => {
                    const isOpen = openClassId === lesson.classId;
                    const elements = lesson.elements || [];

                    return (
                      <div
                        key={lesson.classId}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 6,
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          marginBottom: 8,
                        }}
                      >
                        {/* HEADER DA AULA */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setOpenClassId(isOpen ? null : lesson.classId)
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 18,
                                transform: isOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.15s ease",
                              }}
                            >
                              ▾
                            </span>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#111827",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {lesson.title}
                            </div>
                          </div>

                          {lesson.tags && lesson.tags.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                                justifyContent: "flex-end",
                              }}
                            >
                              {lesson.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: 11,
                                    padding: "2px 6px",
                                    borderRadius: 999,
                                    background: "#e5e7eb",
                                    color: "#4b5563",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* CONTEÚDO EXPANDIDO */}
                        {isOpen && (
                          <div
                            style={{
                              marginTop: 10,
                              borderTop: "1px solid #e5e7eb",
                              paddingTop: 10,
                            }}
                          >
                            {/* BOTÃO COPIAR TODOS */}
                            {elements.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginBottom: 8,
                                }}
                              >
                                <button
                                  style={{
                                    padding: "6px 10px",
                                    background: importing
                                      ? "#6b7280"
                                      : partnerColor(),
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    fontSize: 12,
                                  }}
                                  disabled={importing}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    importElementsToLesson({
                                      mode: "all",
                                      fromClassId: lesson.classId,
                                      fromTitle: lesson.title,
                                      elements,
                                    });
                                  }}
                                >
                                  {importing
                                    ? "Importando..."
                                    : "Copiar aula completa"}
                                </button>
                              </div>
                            )}

                            {elements.length === 0 ? (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#6b7280",
                                  margin: 0,
                                }}
                              >
                                Esta aula não possui elementos disponíveis.
                              </p>
                            ) : (
                              elements.map((el, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    marginBottom: 8,
                                    gap: 16,
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: 4,
                                    }}
                                  >
                                    {renderElementPreview(el, idx)}
                                    {!importing && (
                                      <button
                                        style={{
                                          padding: "4px 8px",
                                          background: `${partnerColor()}30`,
                                          border: "none",
                                          borderRadius: 6,
                                          cursor: "pointer",
                                          fontSize: 12,
                                        }}
                                        disabled={importing}
                                        onClick={() =>
                                          importElementsToLesson({
                                            mode: "one",
                                            fromClassId: lesson.classId,
                                            fromTitle: lesson.title,
                                            elements: [el],
                                          })
                                        }
                                      >
                                        Importar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <button
        type="button"
        onClick={openModal}
        style={{
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          padding: "6px 10px",
          fontSize: 13,
          background: "#f9fafb",
          cursor: "pointer",
        }}
      >
        Importar elementos de aulas
      </button>

      {typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}
