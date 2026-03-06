import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type HeadersLike = Record<string, string>;

type ContentType = "prompt" | "content" | "disorganized content";

type ElementType = {
  type: "explanation" | "vocabulary" | "sentences" | "exercise";
  subtitle?: string;

  explanation?: { title: string; image: string | null; list: string[] }[];

  sentences?: {
    english: string;
    portuguese: string;
    languages: { language1: string; language2: string };
  }[];

  items?: string[];
};

type Props = {
  studentId: string;
  visible: boolean;
  classId: string;
  headers?: HeadersLike | null;
  isDesktop?: boolean;
  theme?: string;
  language1: "en" | "pt" | "es" | "fr" | string;
  postUrl?: string;
  onClose: () => void;
  onAppendElements: (newElements: ElementType[]) => void;
  title?: string;
};

const clampInt = (v: any, min: number, max: number) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

export default function GenerateEVSModal({
  studentId,
  visible,
  classId,
  headers,
  isDesktop,
  theme,
  language1,
  onClose,
  onAppendElements,
  postUrl,
  title = "Gerar Blocos",
}: Props) {
  const BRAND = partnerColor();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [contentType, setContentType] = useState<ContentType>("prompt");
  const [wantExplanation, setWantExplanation] = useState(true);
  const [wantVocabulary, setWantVocabulary] = useState(true);
  const [wantSentences, setWantSentences] = useState(true);
  const [wantExercise, setWantExercise] = useState(true);
  const [wantDialogue, setWantDialogue] = useState(true);
  const [exerciseCount, setExerciseCount] = useState(5);
  const [explanationCount, setExplanationCount] = useState(3);
  const [vocabularyCount, setVocabularyCount] = useState(12);
  const [sentencesCount, setSentencesCount] = useState(12);
  const [dialogueCount, setDialogueCount] = useState(12);

  useEffect(() => {
    if (!visible) {
      setLoading(false);
      setErrorMsg(null);
      setTextInput("");
      setContentType("prompt");
    }
  }, [visible]);

  const styles = useMemo(() => {
    const borderBrand = `${BRAND}40`;
    const softBrand = `${BRAND}12`;

    const btnBase: React.CSSProperties = {
      border: "1px solid #e5e7eb",
      fontSize: 8,
      fontWeight: 900,
      cursor: "pointer",
      userSelect: "none",
      transition: "transform 0.08s ease, box-shadow 0.12s ease",
    };

    return {
      overlay: {
        position: "fixed" as const,
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999999,
        padding: 14,
      },
      modal: {
        width: "min(96vw, 980px)",
        maxHeight: "92vh",
        overflow: "auto",
        background: "#fff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
        padding: 16,
        fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
      },
      headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
      },
      title: {
        margin: 0,
        fontSize: 18,
        fontWeight: 950,
        color: "#111827",
      },
      ghostBtn: {
        ...btnBase,
        width: 38,
        height: 38,
        padding: 0,
        display: "grid",
        placeItems: "center",
        background: "#fff",
        color: "#111827",
        flexShrink: 0,
      },
      primaryBtn: {
        ...btnBase,
        border: `1px solid ${borderBrand}`,
        background: BRAND,
        color: "#fff",
        boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
      },
      secondaryBtn: {
        ...btnBase,
        border: `1px solid ${borderBrand}`,
        background: softBrand,
        color: "#111827",
      },
      textarea: {
        width: "100%",
        minHeight: 380,
        border: "1px solid #e2e8f0",

        fontSize: 10,
        outline: "none",
        resize: "vertical" as const,
        background: "#fff",
      },
      box: {
        border: "1px solid #e5e7eb",
        padding: 12,
        background: "#f9fafb",
        overflow: "auto",
      },
      errorBox: {
        marginTop: 10,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        fontSize: 10,
      },
      miniLabel: {
        fontSize: 10,
        color: "#334155",
        fontWeight: 900,
        whiteSpace: "nowrap" as const,
      },
      checkboxWrap: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px",
        border: "1px solid #e5e7eb",
        background: "#fff",
        minHeight: 38,
      },
      smallNumber: {
        width: 52,
        border: "1px solid #e2e8f0",
        padding: "4px",
        fontSize: 10,
        outline: "none",
      },
      compactGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      },
      topGrid: {
        display: "grid",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
        gap: 12,
        alignItems: "stretch",
      },
      rightCol: {
        display: "grid",
        gap: 8,
        alignContent: "start",
      },
      rightCard: {
        border: "1px solid #e5e7eb",
        background: "#fff",
        padding: 10,
      },
      typeButtons: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 6,
      },
      costBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "4px",
        border: "1px solid #e5e7eb",
        background: "#fff",
        fontSize: 10,
        color: "#334155",
        fontWeight: 800,
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

  const handleGenerate = async () => {
    setErrorMsg(null);

    const base = (theme || "").trim();
    const input = (textInput || "").trim();

    if (!base && !input) {
      setErrorMsg("Preencha o tema e/ou o conteúdo/prompt.");
      return;
    }
    if (
      !wantExplanation &&
      !wantVocabulary &&
      !wantSentences &&
      !wantDialogue &&
      !wantExercise
    ) {
      setErrorMsg("Selecione ao menos um bloco para gerar.");
      return;
    }
    const payload = {
      theme: "",
      classId,
      input,
      contentType,
      language1: language1 || "en",
      requested: {
        explanation: wantExplanation ? clampInt(explanationCount, 1, 20) : 0,
        vocabulary: wantVocabulary ? clampInt(vocabularyCount, 1, 20) : 0,
        sentences: wantSentences ? clampInt(sentencesCount, 1, 20) : 0,
        dialogue: wantDialogue ? clampInt(dialogueCount, 1, 12) : 0,
        exercise: wantExercise ? clampInt(exerciseCount, 1, 20) : 0,
      },
    };

    try {
      setLoading(true);

      const url = postUrl || `${backDomain}/api/v1/generate-evs/${studentId}`;
      const res = await axios.post(url, payload, {
        headers: headers ? { ...headers } : {},
      });

      const raw =
        res?.data?.elements ??
        res?.data?.sections ??
        res?.data?.json ??
        res?.data?.insertedElements ??
        res?.data?.updatedElements;

      let elements: any = raw;
      if (typeof raw === "string") {
        try {
          elements = JSON.parse(raw);
        } catch {
          const match = raw.match(/\[[\s\S]*\]/);
          if (match) {
            elements = JSON.parse(match[0]);
          } else {
            elements = null;
          }
        }
      }

      const newElements: ElementType[] = Array.isArray(elements)
        ? elements
        : Array.isArray(elements?.elements)
          ? elements.elements
          : Array.isArray(elements?.result)
            ? elements.result
            : [];

      if (!newElements.length) {
        setErrorMsg("O backend não retornou elementos válidos.");
        return;
      }

      onAppendElements(newElements);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao gerar blocos.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={styles.overlay} onMouseDown={loading ? undefined : onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.headerRow}>
          <div style={{ minWidth: 0 }}>
            <h2 style={styles.title}>{title}</h2>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            style={{ ...styles.ghostBtn, opacity: loading ? 0.5 : 1 }}
            onMouseDown={applyPressEffect}
            onMouseUp={clearPressEffect}
            onMouseLeave={clearPressEffect}
            title="Fechar"
          >
            ×
          </button>
        </div>

        <div style={styles.box}>
          <div style={styles.topGrid}>
            <div style={styles.rightCol}>
              <div style={styles.costBox}>
                <span>Cost: AI</span>
                <span>
                  -
                  {Math.ceil(
                    (explanationCount +
                      vocabularyCount +
                      sentencesCount +
                      dialogueCount +
                      exerciseCount) /
                      2,
                  )}
                </span>
              </div>

              <div style={styles.rightCard}>
                <div
                  style={{
                    ...styles.miniLabel,
                    marginBottom: 8,
                  }}
                >
                  Tipo de entrada
                </div>

                <div style={styles.typeButtons}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setContentType("prompt")}
                    style={{
                      ...styles.secondaryBtn,

                      width: "100%",
                      background: contentType === "prompt" ? BRAND : "#fff",
                      color: contentType === "prompt" ? "#fff" : "#111827",
                      border: `1px solid ${
                        contentType === "prompt" ? BRAND : "#e5e7eb"
                      }`,
                    }}
                  >
                    Prompt
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setContentType("content")}
                    style={{
                      ...styles.secondaryBtn,

                      width: "100%",
                      background: contentType === "content" ? BRAND : "#fff",
                      color: contentType === "content" ? "#fff" : "#111827",
                      border: `1px solid ${
                        contentType === "content" ? BRAND : "#e5e7eb"
                      }`,
                    }}
                  >
                    Conteúdo (Organizado)
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setContentType("disorganized content")}
                    style={{
                      ...styles.secondaryBtn,

                      width: "100%",
                      background:
                        contentType === "disorganized content" ? BRAND : "#fff",
                      color:
                        contentType === "disorganized content"
                          ? "#fff"
                          : "#111827",
                      border: `1px solid ${
                        contentType === "disorganized content"
                          ? BRAND
                          : "#e5e7eb"
                      }`,
                    }}
                  >
                    Conteúdo (Desorganizado)
                  </button>
                </div>
              </div>

              <div style={styles.rightCard}>
                <div
                  style={{
                    ...styles.miniLabel,
                    marginBottom: 8,
                  }}
                >
                  Blocos
                </div>

                <div style={styles.compactGrid}>
                  <div style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={wantExplanation}
                      disabled={loading}
                      onChange={(e) => setWantExplanation(e.target.checked)}
                    />
                    <span style={styles.miniLabel}>explanation</span>
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={explanationCount}
                      disabled={loading || !wantExplanation}
                      onChange={(e) =>
                        setExplanationCount(clampInt(e.target.value, 1, 3))
                      }
                      style={styles.smallNumber}
                      title="Quantidade de sessões dentro de explanation (1–3)"
                    />
                  </div>

                  <div style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={wantVocabulary}
                      disabled={loading}
                      onChange={(e) => setWantVocabulary(e.target.checked)}
                    />
                    <span style={styles.miniLabel}>vocabulary</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={vocabularyCount}
                      disabled={loading || !wantVocabulary}
                      onChange={(e) =>
                        setVocabularyCount(clampInt(e.target.value, 1, 20))
                      }
                      style={styles.smallNumber}
                      title="Quantidade de itens dentro de vocabulary.sentences (1–20)"
                    />
                  </div>

                  <div style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={wantSentences}
                      disabled={loading}
                      onChange={(e) => setWantSentences(e.target.checked)}
                    />
                    <span style={styles.miniLabel}>sentences</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={sentencesCount}
                      disabled={loading || !wantSentences}
                      onChange={(e) =>
                        setSentencesCount(clampInt(e.target.value, 1, 20))
                      }
                      style={styles.smallNumber}
                      title="Quantidade de itens dentro de sentences.sentences (1–20)"
                    />
                  </div>

                  <div style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={wantDialogue}
                      disabled={loading}
                      onChange={(e) => setWantDialogue(e.target.checked)}
                    />
                    <span style={styles.miniLabel}>dialogue</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={dialogueCount}
                      disabled={loading || !wantDialogue}
                      onChange={(e) =>
                        setDialogueCount(clampInt(e.target.value, 1, 12))
                      }
                      style={styles.smallNumber}
                      title="Quantidade de itens dentro de dialogue.dialogues (1–12)"
                    />
                  </div>

                  <div style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={wantExercise}
                      disabled={loading}
                      onChange={(e) => setWantExercise(e.target.checked)}
                    />
                    <span style={styles.miniLabel}>exercise</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={exerciseCount}
                      disabled={loading || !wantExercise}
                      onChange={(e) =>
                        setExerciseCount(clampInt(e.target.value, 1, 20))
                      }
                      style={styles.smallNumber}
                      title="Quantidade de itens dentro de exercise.exercises (1–20)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <textarea
                disabled={loading}
                rows={10}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  contentType === "prompt"
                    ? `Exemplo de prompt para gerar os blocos: 
                    Crie uma aula sobre [TEMA].
                                                Nível: [NÍVEL]
                                                Objetivo da aula: [OBJETIVO]

                                                Gere o conteúdo com foco em:
                                                - [TÓPICO 1]
                                                - [TÓPICO 2]
                                                - [TÓPICO 3]

                                                Instruções adicionais:
                                                - Use linguagem clara e natural
                                                - Foque em conteúdo útil para o aluno
                                                - Crie exemplos práticos e coerentes com o tema
                                                - Evite conteúdo genérico demais`
                    : contentType === "content"
                      ? `Exemplo de conteúdo organizado para gerar os blocos: 
                                                Tema: [TEMA]
                                                Nível: [NÍVEL]
                                                Objetivo da aula: [OBJETIVO]`
                      : contentType === "disorganized content"
                        ? `Exemplo de conteúdo desorganizado para gerar os blocos: 
                                                  [TEMA]
                                                  [NÍVEL]
                                                  [OBJETIVO]`
                        : ""
                }
                style={styles.textarea}
              />
            </div>
          </div>

          {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{ ...styles.secondaryBtn, opacity: loading ? 0.6 : 1 }}
            onMouseDown={applyPressEffect}
            onMouseUp={clearPressEffect}
            onMouseLeave={clearPressEffect}
            title="Cancelar"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading || (!textInput.trim() && !theme?.trim())}
            style={{
              ...styles.primaryBtn,
              opacity: loading || !textInput ? 0.6 : 1,
              cursor: loading || !textInput ? "not-allowed" : "pointer",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
            onMouseDown={applyPressEffect}
            onMouseUp={clearPressEffect}
            onMouseLeave={clearPressEffect}
            title="Gerar no backend e anexar no elements"
          >
            {loading && (
              <CircularProgress style={{ color: "#fff" }} size={16} />
            )}
            {loading ? "Gerando..." : "Gerar e anexar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
