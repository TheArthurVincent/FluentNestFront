import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type HeadersLike = Record<string, string>;

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
  theme,
  language1,
  onClose,
  onAppendElements,
  postUrl,
  title = "Gerar blocos (Explanation / Vocabulary / Sentences)",
}: Props) {
  const BRAND = partnerColor();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [textInput, setTextInput] = useState("");

  const [wantExplanation, setWantExplanation] = useState(true);
  const [wantVocabulary, setWantVocabulary] = useState(true);
  const [wantSentences, setWantSentences] = useState(true);
  const [wantExercise, setWantExercise] = useState(true);
  const [exerciseCount, setExerciseCount] = useState(5);
  const [explanationCount, setExplanationCount] = useState(3);
  const [vocabularyCount, setVocabularyCount] = useState(12);
  const [sentencesCount, setSentencesCount] = useState(12);

  useEffect(() => {
    if (!visible) {
      setLoading(false);
      setErrorMsg(null);
      setTextInput("");
    }
  }, [visible]);

  const styles = useMemo(() => {
    const borderBrand = `${BRAND}40`;
    const softBrand = `${BRAND}12`;

    const btnBase: React.CSSProperties = {
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "10px 12px",
      fontSize: 13,
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
        width: "min(96vw, 860px)",
        maxHeight: "92vh",
        overflow: "auto",
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
        padding: 16,
        fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
      },
      headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12,
      },
      title: { margin: 0, fontSize: 18, fontWeight: 950, color: "#111827" },
      subtitle: {
        margin: "6px 0 0 0",
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 1.35,
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
      input: {
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 12px",
        fontSize: 13,
        outline: "none",
      },
      textarea: {
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 12px",
        fontSize: 13,
        outline: "none",
        resize: "vertical" as const,
      },
      row: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: 10,
        alignItems: "center",
      },
      box: {
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 12,
        background: "#f9fafb",
      },
      errorBox: {
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 12,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        fontSize: 13,
      },
      miniLabel: {
        fontSize: 12,
        color: "#334155",
        fontWeight: 900,
      },
      checkboxWrap: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#fff",
      },
      smallNumber: {
        width: 90,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "8px 10px",
        fontSize: 13,
        outline: "none",
      },
      divider: {
        height: 1,
        background: "#e5e7eb",
        margin: "14px 0",
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
      !wantExercise
    ) {
      setErrorMsg("Selecione ao menos um bloco para gerar.");
      return;
    }
    const payload = {
      theme: "",
      classId: classId,
      input: input,
      language1: language1 || "en",
      requested: {
        explanation: wantExplanation ? clampInt(explanationCount, 1, 20) : 0,
        vocabulary: wantVocabulary ? clampInt(vocabularyCount, 1, 20) : 0,
        sentences: wantSentences ? clampInt(sentencesCount, 1, 20) : 0,
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
            <p style={styles.subtitle}>
              Selecione quais blocos gerar e quantos itens (1–20) dentro de
              cada. O resultado será retornado pelo backend e você pode anexar
              no seu elements.
            </p>
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
          <div style={{ display: "grid", gap: 10 }}>
            <div style={styles.row}>
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
                  max={20}
                  value={explanationCount}
                  disabled={loading || !wantExplanation}
                  onChange={(e) =>
                    setExplanationCount(clampInt(e.target.value, 1, 20))
                  }
                  style={styles.smallNumber}
                  title="Quantidade de sessões dentro de explanation (1–20)"
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

            <div style={styles.divider} />
            <div style={{ display: "grid", gap: 6 }}>
              <div style={styles.miniLabel}>Prompt / Conteúdo</div>
              <textarea
                disabled={loading}
                rows={10}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Cole aqui o prompt ou o conteúdo bruto que você quer transformar em blocos."
                style={styles.textarea}
              />
            </div>

            {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}
          </div>
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
            disabled={loading}
            style={{
              ...styles.primaryBtn,
              opacity: loading ? 0.75 : 1,
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
