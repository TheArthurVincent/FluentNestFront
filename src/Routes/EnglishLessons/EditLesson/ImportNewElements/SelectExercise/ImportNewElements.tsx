// ✅ 2) ImportElementsEditor.tsx (com limite de importação)

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { backDomain } from "../../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../../Styles/Styles";

type ElementType = {
  _id?: string;
  subtitle?: string;
  comments?: string;
  type: string;
  sentences?: any[];
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

interface ImportElementsEditorProps {
  lessonId: string;
  studentId: string;
  headers?: any;
  fetchEventData?: any;
  setTheLanguage?: (lang: string) => void;
  theLanguage?: string;
  onChange?: (info: {
    mode: "one" | "all";
    fromClassId: string;
    fromTitle: string;
    elements: ElementType[];
  }) => void;

  // ✅ NOVO: quantos elementos podem ser puxados
  // - se 0: trava importação (botões desabilitados + aviso)
  // - se > 0: limita o "Importar tudo" e o "Importar este elemento"
  maxElementsToImport: number;
}

export default function ImportElementsEditor({
  lessonId,
  studentId,
  setTheLanguage,
  theLanguage,
  headers,
  onChange,
  fetchEventData,
  maxElementsToImport,
}: ImportElementsEditorProps) {
  const BRAND = partnerColor();

  const [isOpen, setIsOpen] = useState(false);

  const [language, setLanguage] = useState<"en" | "pt" | "fr" | "es">(
    (theLanguage as any) || "en",
  );
  const [search, setSearch] = useState("");

  const [lessons, setLessons] = useState<LessonFromApi[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [openClassId, setOpenClassId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const canImport = Number(maxElementsToImport || 0) > 0;

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
    setLessons([]);
    setErrorMsg(null);
    setLoadingLessons(false);
    setOpenClassId(null);
    setFeedbackMsg(null);
    fetchEventData?.();
  };

  useEffect(() => {
    if (theLanguage) setLanguage(theLanguage as any);
  }, [theLanguage]);

  const styles = useMemo(() => {
    const softBrand = `${BRAND}14`;
    const borderBrand = `${BRAND}40`;

    const buttonBase: React.CSSProperties = {
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "10px 12px",
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      transition:
        "transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease",
      userSelect: "none",
    };

    return {
      backdrop: {
        position: "fixed" as const,
        inset: 0,
        zIndex: 99999999,
        background: "rgba(0,0,0,0.55)",
      },
      modal: {
        position: "fixed" as const,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000000,
        width: "95%",
        maxWidth: 820,
        maxHeight: "90vh",
        overflow: "auto",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
        padding: 18,
        fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
      },
      headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12,
      },
      title: {
        margin: 0,
        fontSize: 18,
        fontWeight: 900,
        color: "#111827",
      },
      subtitle: {
        margin: "6px 0 0 0",
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 1.35,
      },
      chip: {
        fontSize: 11,
        padding: "3px 9px",
        borderRadius: 999,
        background: softBrand,
        border: `1px solid ${borderBrand}`,
        color: "#111827",
        fontWeight: 700,
        whiteSpace: "nowrap" as const,
      },
      sectionBox: {
        background: "#f9fafb",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: 12,
      },
      lessonCard: {
        padding: 12,
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #e5e7eb",
        marginBottom: 10,
      },
      lessonHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      },
      lessonTitle: {
        fontSize: 14,
        fontWeight: 900,
        color: "#111827",
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      lessonMeta: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
      },
      primaryBtn: {
        ...buttonBase,
        border: `1px solid ${borderBrand}`,
        background: BRAND,
        color: "#fff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
      },
      secondaryBtn: {
        ...buttonBase,
        border: `1px solid ${borderBrand}`,
        background: `${BRAND}12`,
        color: "#111827",
      },
      ghostBtn: {
        ...buttonBase,
        border: "1px solid #e5e7eb",
        background: "#fff",
        color: "#111827",
        fontWeight: 900,
        width: 36,
        height: 36,
        padding: 0,
        display: "grid",
        placeItems: "center",
      },
      input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #d1d5db",
        fontSize: 14,
        outline: "none",
      },
      select: {
        padding: "9px 10px",
        borderRadius: 12,
        border: "1px solid #d1d5db",
        fontSize: 13,
        background: "#fff",
        outline: "none",
      },
      infoBox: {
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: `${BRAND}10`,
        border: `1px solid ${borderBrand}`,
        color: "#111827",
        fontSize: 13,
      },
      warnBox: {
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: "#fffbeb",
        border: "1px solid #f59e0b",
        color: "#92400e",
        fontSize: 13,
        fontWeight: 800,
      },
      successBox: {
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        color: "#065f46",
        fontSize: 13,
      },
      errorBox: {
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        fontSize: 13,
      },
      row: {
        display: "flex",
        flexWrap: "wrap" as const,
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
      },
      elementRow: {
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      },
    };
  }, [BRAND]);

  const applyPressEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as any).style.transform = "translateY(1px)";
    (e.currentTarget as any).style.boxShadow = "none";
  };

  const clearPressEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as any).style.transform = "translateY(0px)";
    (e.currentTarget as any).style.boxShadow = "";
  };

  // ============================================
// Preview de cada elemento
// ============================================
const renderElementPreview = (el: ElementType, index: number) => {
  const box: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    padding: 12,
    background: "#ffffff",
    width: "100%",
    boxShadow: "0 6px 18px rgba(17,24,39,0.06)",
  };

  const title = el.subtitle || `Elemento ${index + 1}`;
  const typeLabel = String(el.type || "unknown");

  const header = (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>
        {title}
      </div>
      <span style={{ fontSize: 11, color: "#6b7280" }}>{typeLabel}</span>
    </div>
  );

  if (el.type === "vocabulary" || el.type === "sentences") {
    return (
      <div key={index} style={box}>
        {header}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
          Prévia:
        </div>

        {el.sentences && el.sentences.length > 0 ? (
          <ul
            style={{
              margin: "8px 0 0 16px",
              padding: 0,
              listStyleType: "disc",
              maxHeight: 70,
              overflowY: "auto",
              fontSize: 12,
              color: "#374151",
            }}
          >
            {el.sentences.slice(0, 6).map((s: any, i: number) => (
              <li key={i}>
                {s.english}
                {s.portuguese ? ` — ${s.portuguese}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            Sem prévia disponível.
          </div>
        )}
      </div>
    );
  }

  if (el.type === "exercise") {
    return (
      <div key={index} style={box}>
        {header}
        {el.items && el.items.length > 0 ? (
          <ul
            style={{
              margin: "8px 0 0 16px",
              padding: 0,
              listStyleType: "disc",
              fontSize: 12,
              color: "#374151",
            }}
          >
            {el.items.slice(0, 3).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            Sem itens.
          </div>
        )}
      </div>
    );
  }

  if (el.type === "audio") {
    return (
      <div key={index} style={box}>
        {header}
        <div style={{ fontSize: 12, marginTop: 6 }}>
          {el.text
            ? el.text.slice(0, 150) + (el.text.length > 150 ? "..." : "")
            : "Sem texto."}
        </div>
      </div>
    );
  }

  if (el.type === "video") {
    return (
      <div key={index} style={box}>
        {header}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
          Elemento de vídeo.
        </div>
      </div>
    );
  }

  return (
    <div key={index} style={box}>
      {header}
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
        Tipo sem prévia específica.
      </div>
    </div>
  );
};
  // =========================
  // Busca (debounce)
  // =========================
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
            params: { q: term, language },
          },
        );

        setLessons(data?.lessons ?? []);
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
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, language, isOpen, studentId, headers]);

  // =========================
  // Envia pro parent (com limite)
  // =========================
  const sendElementsToParent = (params: {
    mode: "one" | "all";
    fromClassId: string;
    fromTitle: string;
    elements: ElementType[];
  }) => {
    const { mode, fromClassId, fromTitle } = params;
    let elements = params.elements || [];

    if (!elements || elements.length === 0) return;

    // ✅ não deixa passar do limite
    if (!canImport) {
      setFeedbackMsg(
        `Limite atingido. Não é possível importar mais elementos nesta aula.`,
      );
      return;
    }

    if (elements.length > maxElementsToImport) {
      elements = elements.slice(0, maxElementsToImport);
      setFeedbackMsg(
        `Importação limitada: somente ${maxElementsToImport} elemento(s) puderam ser puxados de "${fromTitle}".`,
      );
    } else {
      const how = mode === "all" ? "AULA INTEIRA" : "1 ELEMENTO";
      setFeedbackMsg(
        `Importação pronta: ${how} de "${fromTitle}". Os elementos foram puxados para o editor.`,
      );
    }

    onChange?.({ mode, fromClassId, fromTitle, elements });
  };

  // =========================
  // Modal
  // =========================
  const modalContent = !isOpen ? null : (
    <div
      style={styles.backdrop}
      onMouseDown={closeModal}
      title="Clique fora para fechar"
    >
      <div
        style={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Importar elementos de outra aula"
      >
        {/* HEADER */}
        <div style={styles.headerRow}>
          <div style={{ minWidth: 0 }}>
            <h2 style={styles.title}>Importar elementos de outra aula</h2>
            <p style={styles.subtitle}>
              Procure uma aula, abra ela e clique em <b>Importar</b> para{" "}
              <b>puxar os elementos</b> (frases, exercícios, áudio, etc.) para o
              seu editor.
            </p>
          </div>

          <button
            onClick={closeModal}
            style={styles.ghostBtn}
            title="Fechar o modal"
            onMouseDown={applyPressEffect}
            onMouseUp={clearPressEffect}
            onMouseLeave={clearPressEffect}
          >
            ×
          </button>
        </div>

        {/* INFO */}
        <div style={styles.infoBox}>
          Dica: use <b>Importar tudo</b> para trazer a aula completa, ou{" "}
          <b>Importar este elemento</b> para puxar só um bloco específico.
        </div>

        {/* ✅ aviso de limite */}
        <div style={styles.warnBox}>
          Esta aula suporta no máximo importar{" "}
          <b>{Math.max(0, maxElementsToImport)}</b> elemento(s) agora.
        </div>

        {feedbackMsg && <div style={styles.successBox}>{feedbackMsg}</div>}

        <div style={styles.row}>
          <div style={{ fontSize: 13, color: "#111827", fontWeight: 900 }}>
            Idioma
          </div>

          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value as any;
              setLanguage(lang);
              setTheLanguage?.(lang);
            }}
            style={styles.select}
            title="Filtra as aulas por idioma"
          >
            <option value="en">Inglês (EN)</option>
            <option value="pt">Português (PT)</option>
            <option value="fr">Francês (FR)</option>
            <option value="es">Espanhol (ES)</option>
          </select>

          <div style={{ flex: 1, minWidth: 240 }}>
            <input
              type="text"
              placeholder="Buscar por título ou tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
              title="Digite para buscar aulas (título ou tags)"
            />
          </div>
        </div>

        {search.trim().length > 0 && (
          <div style={styles.sectionBox}>
            {loadingLessons && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CircularProgress style={{ color: BRAND }} size={18} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  Buscando aulas…
                </span>
              </div>
            )}

            {errorMsg && !loadingLessons && (
              <div style={styles.errorBox}>{errorMsg}</div>
            )}

            {!loadingLessons && !errorMsg && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{ fontSize: 14, fontWeight: 900, color: "#374151" }}
                  >
                    Resultados
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {lessons.length} aula(s)
                  </div>
                </div>

                {lessons.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                    Nenhuma aula encontrada para esse termo.
                  </p>
                ) : (
                  lessons.map((lesson) => {
                    const isOpenLesson = openClassId === lesson.classId;
                    const elements = lesson.elements || [];

                    const disableImportAll =
                      !canImport || elements.length === 0;

                    return (
                      <div key={lesson.classId} style={styles.lessonCard}>
                        <div
                          style={styles.lessonHeader}
                          onClick={() =>
                            setOpenClassId(isOpenLesson ? null : lesson.classId)
                          }
                          title={
                            isOpenLesson
                              ? "Recolher esta aula"
                              : "Abrir esta aula"
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 18,
                                transform: isOpenLesson
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.15s ease",
                                color: "#111827",
                              }}
                            >
                              ▾
                            </span>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={styles.lessonTitle}>
                                {lesson.title}
                              </div>
                              <div style={styles.lessonMeta}>
                                {elements.length} elemento(s)
                              </div>
                            </div>
                          </div>

                          {lesson.tags && lesson.tags.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                                justifyContent: "flex-end",
                                maxWidth: "52%",
                              }}
                            >
                              {lesson.tags.slice(0, 8).map((tag) => (
                                <span
                                  key={tag}
                                  style={styles.chip}
                                  title={`Tag: ${tag}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {isOpenLesson && (
                          <div
                            style={{
                              marginTop: 12,
                              borderTop: "1px solid #e5e7eb",
                              paddingTop: 12,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* IMPORTAR AULA INTEIRA */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                                marginBottom: 12,
                                padding: "12px 12px",
                                borderRadius: 14,
                                background: `${BRAND}0D`,
                                border: `1px solid ${BRAND}2A`,
                              }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 900,
                                    color: "#111827",
                                  }}
                                >
                                  Importar aula inteira
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#6b7280",
                                    marginTop: 3,
                                  }}
                                >
                                  Puxa todos os elementos dessa aula para o
                                  editor (limitado ao que cabe).
                                </div>
                              </div>

                              <button
                                style={{
                                  ...(styles.primaryBtn as any),
                                  opacity: disableImportAll ? 0.5 : 1,
                                  cursor: disableImportAll
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                disabled={disableImportAll}
                                onClick={() =>
                                  sendElementsToParent({
                                    mode: "all",
                                    fromClassId: lesson.classId,
                                    fromTitle: lesson.title,
                                    elements,
                                  })
                                }
                                title={
                                  !canImport
                                    ? "Limite atingido. Não é possível importar mais."
                                    : "Importa todos os elementos (até o limite permitido)"
                                }
                                onMouseDown={applyPressEffect}
                                onMouseUp={clearPressEffect}
                                onMouseLeave={clearPressEffect}
                              >
                                Importar tudo
                              </button>
                            </div>

                            {/* LISTA DE ELEMENTOS */}
                            {elements.length === 0 ? (
                              <p
                                style={{
                                  fontSize: 13,
                                  color: "#6b7280",
                                  margin: 0,
                                }}
                              >
                                Esta aula não possui elementos disponíveis.
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 12,
                                }}
                              >
                                {elements.map((el, idx) => {
                                  const disableOne = !canImport; // se 0, trava tudo
                                  return (
                                    <div key={idx} style={styles.elementRow}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* (seu renderElementPreview permanece igual) */}
                                        {/* vou manter como estava no seu arquivo */}
                                        {/* @ts-ignore */}
                                        {renderElementPreview(el, idx)}
                                      </div>

                                      <div style={{ width: 230 }}>
                                        <button
                                          style={{
                                            ...(styles.secondaryBtn as any),
                                            opacity: disableOne ? 0.5 : 1,
                                            cursor: disableOne
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          disabled={disableOne}
                                          onClick={() =>
                                            sendElementsToParent({
                                              mode: "one",
                                              fromClassId: lesson.classId,
                                              fromTitle: lesson.title,
                                              elements: [el],
                                            })
                                          }
                                          title={
                                            !canImport
                                              ? "Limite atingido. Não é possível importar mais."
                                              : "Puxa somente este elemento"
                                          }
                                          onMouseDown={applyPressEffect}
                                          onMouseUp={clearPressEffect}
                                          onMouseLeave={clearPressEffect}
                                        >
                                          Importar este elemento
                                          <div
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 700,
                                              color: "#6b7280",
                                              marginTop: 4,
                                              lineHeight: 1.25,
                                            }}
                                          >
                                            Puxa só este bloco
                                          </div>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
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

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={!canImport}
        style={{
          borderRadius: 14,
          border: `1px solid ${BRAND}4A`,
          padding: "10px 12px",
          fontSize: 13,
          fontWeight: 900,
          background: `linear-gradient(180deg, ${BRAND}18, ${BRAND}10)`,
          cursor: canImport ? "pointer" : "not-allowed",
          whiteSpace: "nowrap",
          color: "#111827",
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          opacity: canImport ? 1 : 0.6,
        }}
        title={
          canImport
            ? "Abrir o modal para buscar aulas e puxar elementos para o editor"
            : "Limite atingido. Não é possível importar mais elementos."
        }
        onMouseDown={applyPressEffect}
        onMouseUp={clearPressEffect}
        onMouseLeave={clearPressEffect}
      >
        Importar de outra aula
      </button>

      {typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}
