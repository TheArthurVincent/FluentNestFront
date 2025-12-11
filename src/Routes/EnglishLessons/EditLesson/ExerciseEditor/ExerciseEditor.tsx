import React from "react";
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
  setChange?: any;
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
  // IA
  studentId,
  headers,
  setChange,
  change,
}: Props) {
  const [showConfig, setShowConfig] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);

  const setSubtitle = (subtitle: string) =>
    onChange({ ...value, subtitle, type: "exercise" });

  const updateItem = (idx: number, nextText: string) => {
    const next = value.items.slice();
    next[idx] = nextText;
    onChange({ ...value, items: next, type: "exercise" });
  };

  const addItem = (text = "") =>
    onChange({ ...value, items: value.items.concat(text), type: "exercise" });

  const removeItem = (idx: number) => {
    const next = value.items.slice();
    next.splice(idx, 1);
    onChange({ ...value, items: next, type: "exercise" });
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = value.items.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange({ ...value, items: next, type: "exercise" });
  };

  const moveDown = (idx: number) => {
    if (idx >= value.items.length - 1) return;
    const next = value.items.slice();
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    onChange({ ...value, items: next, type: "exercise" });
  };

  const pasteBulk = (bulkText: string) => {
    const lines = (bulkText || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\d+[\).\-\s]+/, "")); // remove "1. ", "2) " etc

    if (!lines.length) return;
    onChange({
      ...value,
      items: value.items.concat(lines),
      type: "exercise",
    });
  };

  // ===== IA helpers =====

  function parseMaybeJson(input: any): any {
    if (Array.isArray(input) || (input && typeof input === "object"))
      return input;
    if (typeof input !== "string") return input;

    const cleaned = input
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return input;
    }
  }

  function splitTextIntoQuestions(text: string): string[] {
    if (!text || !text.trim()) return [];

    // 1) tenta por quebras de linha
    const byLines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^\d+[\).\-\s]+/, ""));

    if (byLines.length > 1) return byLines;

    // 2) fallback: separa por "?" (mantendo o caractere)
    const chunks = text
      .split(/(?<=\?)/)
      .map((c) => c.trim())
      .filter(Boolean);

    return chunks.map((c) => c.replace(/^\d+[\).\-\s]+/, ""));
  }

  function normalizeExercisesPayload(raw: any): string[] {
    // 1) já é array
    if (Array.isArray(raw)) {
      return raw
        .map((it) => {
          if (typeof it === "string") return it.trim();
          if (!it || typeof it !== "object") return "";
          return (
            it.text ??
            it.question ??
            it.q ??
            it.item ??
            it.prompt ??
            it.value ??
            ""
          );
        })
        .map((s) => String(s ?? "").trim())
        .filter(Boolean);
    }

    // 2) objeto
    if (raw && typeof raw === "object") {
      const candidateArr =
        raw.items ||
        raw.questions ||
        raw.list ||
        raw.data ||
        raw.exercises ||
        raw.sentences ||
        null;

      if (Array.isArray(candidateArr)) {
        return normalizeExercisesPayload(candidateArr);
      }

      // envelopes: result/json/response
      const wrapped =
        raw.result ?? raw.json ?? raw.response ?? raw.payload ?? null;
      if (wrapped) return normalizeExercisesPayload(parseMaybeJson(wrapped));

      // texto único
      const text =
        raw.text ??
        raw.body ??
        raw.content ??
        raw.transcript ??
        raw.dialog ??
        "";
      if (typeof text === "string" && text.trim()) {
        return splitTextIntoQuestions(text);
      }
    }

    // 3) string solta
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
        partnerColor()
      );
      console.warn("Conteúdo (bruto) recebido para exercises:", raw);
      return;
    }

    onChange({
      ...value,
      type: "exercise",
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
            fontSize: 14,
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
          {value.subtitle
            ? truncateString(value.subtitle, 15)
            : "Adicione  um título"}{" "}
          | EXERCÍCIOS
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

          {/* IA */}
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
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <>
          {/* SUBTITLE / AÇÕES EXTRAS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <input
                value={value.subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtitle (ex.: Discussion Questions – Andrew & Daisy Talk About Cities)"
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              {titleRightExtra}
            </div>
          </div>

          {/* FERRAMENTAS DE LISTA */}
          <div
            style={{
              display: "grid",
              gap: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <details>
              <summary style={{ cursor: "pointer", color: "#0f172a" }}>
                Colar lista em massa
              </summary>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                <textarea
                  placeholder={"Cole cada pergunta em uma linha..."}
                  rows={5}
                  style={textareaStyle}
                  onBlur={(e) => {
                    const v = e.currentTarget.value;
                    if (v.trim()) pasteBulk(v);
                    e.currentTarget.value = "";
                  }}
                />
                <small style={{ color: "#64748b" }}>
                  Dica: cole linhas, revise, e depois saia do campo para
                  adicionar à lista.
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
            {value.items.length === 0 && (
              <div style={emptyStyle}>
                Nenhum item. Use “Adicionar item” ou ✨ IA.
              </div>
            )}

            {value.items.map((q, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 10,
                  display: "flex",
                  gap: 8,
                  background: "#fff",
                }}
              >
                <input
                  value={q}
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
                  <button onClick={() => moveUp(idx)} style={ghostBtnStyle}>
                    ↑
                  </button>
                  <button onClick={() => moveDown(idx)} style={ghostBtnStyle}>
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
        postUrl={`${backDomain}/api/v1/generateSection/${studentId}`}
        headers={headers || undefined}
        onReceiveJson={handleReceiveJson}
        title="Gerar Exercises por IA"
      />
    </div>
  );
}

/* estilos */
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  lineHeight: 1.4,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #0891b2",
  backgroundColor: "#06b6d4",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const dangerBtnStyle: React.CSSProperties = {
  borderRadius: 8,
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
  borderRadius: 8,
  padding: 16,
  color: "#64748b",
  fontSize: 13,
  background: "white",
};
