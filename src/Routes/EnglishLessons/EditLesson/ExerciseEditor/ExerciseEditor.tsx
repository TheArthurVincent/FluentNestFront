import React, { useMemo, useState } from "react";
import {
  backDomain,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";
import SimpleAIGenerator from "../AIGenerator/AIGenerator";

export type ExerciseBlock = {
  type: "exercise";
  subtitle: string;
  comments?: string; // ✅ não é description
  items: string[];
  order?: number;
  grid?: number;
};

type HeadersLike = Record<string, string>;

type Props = {
  value: ExerciseBlock;
  onChange: (next: ExerciseBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;

  // IA (opcional)
  studentId?: string;
  headers?: HeadersLike | null;
  setChange?: (v: any) => void;
  change?: any;
  type: string; // "exercises" etc (para o prompt da IA)
  language: string;
};

export default function ExerciseEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
  onMoveUp,
  onMoveDown,
  language,
  type,
  studentId,
  headers,
  setChange,
  change,
}: Props) {
  const [showConfig, setShowConfig] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  /* ===================== SAFETY GUARDS ===================== */
  const safeItems = useMemo<string[]>(
    () => (Array.isArray(value?.items) ? value.items : []),
    [value?.items],
  );

  const safeSubtitle =
    typeof value?.subtitle === "string" ? value.subtitle : "";
  const safeComments =
    typeof value?.comments === "string" ? value.comments : "";

  const updateBlock = (patch: Partial<ExerciseBlock>) =>
    onChange({
      ...value,
      ...patch,
      type: "exercise",
      subtitle:
        typeof patch.subtitle === "string" ? patch.subtitle : safeSubtitle,
      comments:
        typeof patch.comments === "string"
          ? patch.comments
          : patch.comments === undefined
            ? safeComments
            : String(patch.comments ?? ""),
      items: Array.isArray(patch.items) ? patch.items : safeItems,
    });

  /* ===================== UPDATERS ===================== */
  const setSubtitle = (subtitle: string) => updateBlock({ subtitle });
  const setComments = (comments: string) => updateBlock({ comments });

  const updateItem = (idx: number, nextText: string) => {
    if (idx < 0 || idx >= safeItems.length) return;
    const next = safeItems.slice();
    next[idx] = String(nextText ?? "");
    updateBlock({ items: next });
  };

  const addItem = (text = "") => {
    updateBlock({ items: safeItems.concat(String(text ?? "")) });
  };

  const removeItem = (idx: number) => {
    if (idx < 0 || idx >= safeItems.length) return;
    const next = safeItems.slice();
    next.splice(idx, 1);
    updateBlock({ items: next });
  };

  const moveUp = (idx: number) => {
    if (idx <= 0 || idx >= safeItems.length) return;
    const next = safeItems.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    updateBlock({ items: next });
  };

  const moveDown = (idx: number) => {
    if (idx < 0 || idx >= safeItems.length - 1) return;
    const next = safeItems.slice();
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    updateBlock({ items: next });
  };

  const pasteBulk = (bulkText: string) => {
    const lines = (bulkText || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\d+[\).\-\s]+/, "")); // remove "1. ", "2) ", etc

    if (!lines.length) return;
    updateBlock({ items: safeItems.concat(lines) });
  };

  /* ===================== IA HELPERS ===================== */
  function parseMaybeJson(input: any): any {
    if (Array.isArray(input) || (input && typeof input === "object"))
      return input;
    if (typeof input !== "string") return input;

    const cleaned = input
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return input;
    }
  }

  function splitTextIntoQuestions(text: string): string[] {
    if (!text || !text.trim()) return [];

    const byLines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\d+[\).\-\s]+/, ""));

    if (byLines.length > 1) return byLines;

    const chunks = text
      .split(/(?<=\?)/)
      .map((c) => c.trim())
      .filter(Boolean);

    return chunks.map((c) => c.replace(/^\d+[\).\-\s]+/, ""));
  }

  function normalizeExercisesPayload(raw: any): string[] {
    if (Array.isArray(raw)) {
      return raw
        .map((it) => {
          if (typeof it === "string") return it.trim();
          if (!it || typeof it !== "object") return "";
          return (
            (it as any).text ??
            (it as any).question ??
            (it as any).q ??
            (it as any).item ??
            (it as any).prompt ??
            (it as any).value ??
            ""
          );
        })
        .map((s) => String(s ?? "").trim())
        .filter(Boolean);
    }

    if (raw && typeof raw === "object") {
      const candidateArr =
        (raw as any).items ||
        (raw as any).questions ||
        (raw as any).list ||
        (raw as any).data ||
        (raw as any).exercises ||
        (raw as any).sentences ||
        null;

      if (Array.isArray(candidateArr))
        return normalizeExercisesPayload(candidateArr);

      const wrapped =
        (raw as any).result ??
        (raw as any).json ??
        (raw as any).response ??
        (raw as any).payload ??
        null;

      if (wrapped) return normalizeExercisesPayload(parseMaybeJson(wrapped));

      const text =
        (raw as any).text ??
        (raw as any).body ??
        (raw as any).content ??
        (raw as any).transcript ??
        (raw as any).dialog ??
        "";

      if (typeof text === "string" && text.trim()) {
        return splitTextIntoQuestions(text);
      }
    }

    if (typeof raw === "string" && raw.trim()) {
      return splitTextIntoQuestions(raw);
    }

    return [];
  }

  const handleReceiveJson = (raw: any) => {
    const json = parseMaybeJson(raw);
    const mapped = normalizeExercisesPayload(json);

    if (!mapped.length) {
      notifyAlert(
        "Esperado um ARRAY de questões ou um texto com uma pergunta por linha.",
        partnerColor(),
      );
      console.warn("Conteúdo (bruto) recebido para exercises:", raw);
      return;
    }

    updateBlock({
      subtitle: safeSubtitle, // preserva (garante string)
      items: mapped,
    });

    setShowConfig(true);
    setChange?.(!change);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "linear-gradient(to right, #cddb3655, #ffffff)",
        borderRadius: 6,
        padding: "5px 12px",
        display: "grid",
        gap: 12,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
          style={{
            cursor: "pointer",
            fontSize: 12,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <i
            className={showConfig ? "fa fa-arrow-down" : "fa fa-arrow-right"}
            style={{ color: "#0f172a" }}
          />
          {safeSubtitle
            ? truncateString(safeSubtitle, 25)
            : "Adicione um título"}
        </strong>

        <span
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            {onMoveUp && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                style={ghostBtnStyle}
                title="Mover bloco para cima"
              >
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                style={ghostBtnStyle}
                title="Mover bloco para baixo"
              >
                ↓
              </button>
            )}
          </div>

          <button
            style={primaryBtnStyle}
            onClick={() => {
              if (!studentId) {
                notifyAlert("ID do aluno não informado.", partnerColor());
                return;
              }
              setAiOpen(true);
            }}
            title="Gerar exercícios por IA"
          >
            ✨ IA
          </button>

          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={dangerBtnStyle}
              title="Remover bloco"
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <>
          {/* SUBTITLE + EXTRAS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
              <input
                value={safeSubtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder='Subtitle (ex.: Discussion Questions – "Cities")'
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              {titleRightExtra}
            </div>
          </div>

          {/* COMMENTS */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Comments</label>
            <textarea
              value={safeComments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Observações, instruções, contexto..."
              style={{ ...textareaStyle, minHeight: 90, resize: "vertical" }}
            />
          </div>

          {/* FERRAMENTAS DE LISTA */}
          <div
            style={{
              display: "grid",
              gap: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              padding: 10,
            }}
          >
            <details>
              <summary style={{ cursor: "pointer", color: "#0f172a" }}>
                Colar lista em massa
              </summary>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                <textarea
                  placeholder="Cole cada pergunta em uma linha..."
                  rows={5}
                  style={textareaStyle}
                  onBlur={(e) => {
                    const v = e.currentTarget.value || "";
                    if (v.trim()) pasteBulk(v);
                    e.currentTarget.value = "";
                  }}
                />
                <small style={{ color: "#64748b" }}>
                  Cole linhas, revise e depois saia do campo para adicionar à
                  lista.
                </small>
              </div>
            </details>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => addItem("")} style={primaryBtnStyle}>
                + Adicionar item
              </button>
            </div>
          </div>

          {/* LISTA DE ITENS */}
          <div style={{ display: "grid", gap: 8 }}>
            {safeItems.length === 0 && (
              <div style={emptyStyle}>
                Nenhum item. Use “Adicionar item” ou ✨ IA.
              </div>
            )}

            {safeItems.map((q, idx) => (
              <div
                key={`${idx}-${(q || "").slice(0, 12)}`}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: 10,
                  display: "flex",
                  gap: 8,
                  background: "#fff",
                }}
              >
                <input
                  value={q ?? ""}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  placeholder={`Questão ${idx + 1}`}
                  style={inputStyle}
                />

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => moveUp(idx)}
                    style={ghostBtnStyle}
                    disabled={idx === 0}
                    title="Subir"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    style={ghostBtnStyle}
                    disabled={idx === safeItems.length - 1}
                    title="Descer"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    style={dangerBtnStyle}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL IA */}
      <SimpleAIGenerator
        visible={aiOpen}
        language1={language}
        type={type || "exercises"}
        onClose={() => setAiOpen(false)}
        postUrl={`${backDomain}/api/v1/generateSection/${studentId ?? ""}`}
        headers={headers || undefined}
        onReceiveJson={handleReceiveJson}
        title="Gerar Exercises por IA"
      />
    </div>
  );
}

/* ===================== estilos ===================== */
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  lineHeight: 1.4,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #0891b2",
  backgroundColor: "#06b6d4",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const dangerBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #ef4444",
  backgroundColor: "#ef4444",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const emptyStyle: React.CSSProperties = {
  border: "1px dashed #94a3b8",
  borderRadius: 6,
  padding: 16,
  color: "#64748b",
  fontSize: 13,
  background: "white",
};
