import React from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type ExerciseBlock = {
  type: "exercise";
  subtitle: string;
  items: string[];
  order?: number;
  grid?: number;
};

type Props = {
  value: ExerciseBlock;
  onChange: (next: ExerciseBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: React.ReactNode;
  onMoveUp?: () => void; // NOVO
  onMoveDown?: () => void; // NOVO
};
export default function ExerciseEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
  onMoveUp,
  onMoveDown,
}: Props) {
  const setSubtitle = (subtitle: string) => onChange({ ...value, subtitle });
  const setOrder = (order?: number) => onChange({ ...value, order });
  const setGrid = (grid?: number) => onChange({ ...value, grid });

  const updateItem = (idx: number, nextText: string) => {
    const next = value.items.slice();
    next[idx] = nextText;
    onChange({ ...value, items: next });
  };

  const addItem = (text = "") =>
    onChange({ ...value, items: value.items.concat(text) });

  const removeItem = (idx: number) => {
    const next = value.items.slice();
    next.splice(idx, 1);
    onChange({ ...value, items: next });
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = value.items.slice();
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange({ ...value, items: next });
  };

  const moveDown = (idx: number) => {
    if (idx >= value.items.length - 1) return;
    const next = value.items.slice();
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    onChange({ ...value, items: next });
  };

  const trimAll = () => {
    onChange({
      ...value,
      subtitle: (value.subtitle || "").trim(),
      items: value.items.map((q) => (q || "").trim()),
    });
  };

  const pasteBulk = (bulkText: string) => {
    // aceita quebras de linha; ignora linhas vazias
    const lines = (bulkText || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    onChange({ ...value, items: value.items.concat(lines) });
  };

  const [showConfig, setShowConfig] = React.useState(false);
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "linear-gradient(to right, #cddb3655, #ffffff)",
        borderRadius: 6,
        padding: 12,
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          onClick={() => {
            setShowConfig(!showConfig);
          }}
          style={{ fontSize: 16, cursor: "pointer", color: "#0f172a" }}
        >
          Exercises - {value.subtitle && truncateString(value.subtitle, 15)}
        </strong>

        <span
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              style={ghostBtnStyle}
              title="Mover bloco para cima"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              style={ghostBtnStyle}
              title="Mover bloco para baixo"
            >
              ↓
            </button>
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              Remover bloco
            </button>
          )}
        </span>
      </div>
      {showConfig && (
        <>
          {/* Header */}
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
              {onRemove && (
                <button onClick={onRemove} style={dangerBtnStyle}>
                  Remover bloco
                </button>
              )}
            </div>
          </div>
          {/* Ferramentas de lista */}
          {/* <div
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
              onPaste={(e) => {
                // permite colar e processar após o event loop
                setTimeout(
                  () => pasteBulk((e.target as HTMLTextAreaElement).value),
                  0
                );
              }}
              onBlur={(e) => {
                const v = e.currentTarget.value;
                if (v.trim()) pasteBulk(v);
                e.currentTarget.value = "";
              }}
            />
            <small style={{ color: "#64748b" }}>
              Dica: cole linhas e feche/saia do campo para adicionar à lista.
            </small>
          </div>
        </details>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => addItem("")} style={primaryBtnStyle}>
            + Adicionar item
          </button>
        </div>
      </div> */}

          <div style={{ display: "grid", gap: 8 }}>
            {value.items.length === 0 && (
              <div style={emptyStyle}>Nenhum item. Use “Adicionar item”.</div>
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
