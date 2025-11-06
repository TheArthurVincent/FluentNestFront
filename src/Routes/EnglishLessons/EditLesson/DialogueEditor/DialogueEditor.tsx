import React, { useMemo, useState } from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type DialogueBlock = {
  type: "dialogue";
  subtitle?: string;
  order?: number;
  dialogue: string[]; // posições ímpares = voz masculina; pares = voz feminina
};

type Props = {
  value: DialogueBlock;
  onChange: (next: DialogueBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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

const lineBtnStyle: React.CSSProperties = {
  ...ghostBtnStyle,
  padding: "3px 6px",
  fontSize: 11,
};

export default function DialogueEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [showConfig, setShowConfig] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState((value.dialogue ?? []).join("\n"));

  const update = (patch: Partial<DialogueBlock>) =>
    onChange({ ...value, ...patch });

  const lines = useMemo(() => value.dialogue ?? [], [value.dialogue]);

  const setLineAt = (idx: number, text: string) => {
    const next = [...lines];
    next[idx] = text;
    update({ dialogue: next });
  };

  const addLine = (text = "") => {
    update({ dialogue: [...lines, text] });
  };

  const removeLineAt = (idx: number) => {
    const next = [...lines];
    next.splice(idx, 1);
    update({ dialogue: next });
  };

  const moveLine = (from: number, to: number) => {
    if (to < 0 || to >= lines.length) return;
    const next = [...lines];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    update({ dialogue: next });
  };

  const moveLineUp = (i: number) => moveLine(i, i - 1);
  const moveLineDown = (i: number) => moveLine(i, i + 1);

  const applyBulk = () => {
    const parsed = bulkText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    update({ dialogue: parsed });
  };

  const speakerBadge = (index: number) => {
    const isMale = (index + 1) % 2 === 1;
    return (
      <span
        title={
          isMale
            ? "Ímpar (1,3,5...) = Voz masculina"
            : "Par (2,4,6...) = Voz feminina"
        }
        style={{
          fontSize: 11,
          padding: "2px 6px",
          borderRadius: 999,
          border: "1px solid #e2e8f0",
          background: isMale ? "#eff6ff" : "#fff1f2",
          color: isMale ? "#1d4ed8" : "#be123c",
          whiteSpace: "nowrap",
        }}
      >
        {isMale ? "👨 Male (odd)" : "👩 Female (even)"}
      </span>
    );
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: 10,
        background: "linear-gradient(to right, #db9c3655, #ffffff)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
          style={{
            cursor: "pointer",
            fontSize: 14,
            color: "#0f172a",
          }}
        >
          Dialogue- {value.subtitle && truncateString(value.subtitle, 15)}
        </strong>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div>
            {onMoveUp && (
              <button onClick={onMoveUp} style={ghostBtnStyle} title="Mover ↑">
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                style={ghostBtnStyle}
                title="Mover ↓"
              >
                ↓
              </button>
            )}
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Subtitle / Order */}

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Dialogue – Talking About Jobs"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 8,
                fontSize: 13,
              }}
            />
          </div>

          {/* Aviso sobre as vozes */}
          <div
            style={{
              border: "1px dashed #94a3b8",
              borderRadius: 8,
              padding: 10,
              color: "#475569",
              fontSize: 12.5,
              background: "#f8fafc",
            }}
          >
            <strong>Regras de vozes:</strong> as falas <em>ímpares</em> (1, 3,
            5, …) são <strong>masculinas</strong> e as falas <em>pares</em> (2,
            4, 6, …) são <strong>femininas</strong>. Isso é definido pela{" "}
            <u>posição</u> das falas no diálogo.
          </div>

          {/* Toggle bulk */}
          {/* <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={ghostBtnStyle}
                onClick={() => setBulkMode((v) => !v)}
              >
                {bulkMode ? "Esconder colagem em massa" : "Colar em massa"}
              </button>
              <button style={ghostBtnStyle} onClick={() => addLine("")}>
                + Adicionar fala
              </button>
            </div> */}

          {/* Bulk editor */}
          {bulkMode && (
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Cole uma fala por linha (a primeira será masculina, a segunda
                feminina, e assim por diante):
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
                placeholder={
                  "Hi, what do you do?\nI’m an engineer. What about you?\n..."
                }
                style={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 13,
                  lineHeight: 1.45,
                  whiteSpace: "pre",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={ghostBtnStyle} onClick={applyBulk}>
                  Aplicar colagem
                </button>
                <button
                  style={ghostBtnStyle}
                  onClick={() => setBulkText(lines.join("\n"))}
                >
                  Carregar falas atuais
                </button>
              </div>
            </div>
          )}

          {/* Lista de falas */}
          <div style={{ display: "grid", gap: 12 }}>
            {lines.length === 0 && (
              <div
                style={{
                  padding: 10,
                  border: "1px dashed #94a3b8",
                  borderRadius: 8,
                  color: "#64748b",
                }}
              >
                Nenhuma fala adicionada. Clique em <em>+ Adicionar fala</em> ou
                use <em>Colar em massa</em>.
              </div>
            )}

            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 10,
                  display: "grid",
                  gap: 8,
                  background: "#ffffff",
                }}
              >
                {/* Top row: speaker + controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    {speakerBadge(i)}
                    <small style={{ color: "#64748b" }}>#{i + 1}</small>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      style={lineBtnStyle}
                      onClick={() => moveLineUp(i)}
                      disabled={i === 0}
                      title="Mover fala ↑"
                    >
                      ↑
                    </button>
                    <button
                      style={lineBtnStyle}
                      onClick={() => moveLineDown(i)}
                      disabled={i === lines.length - 1}
                      title="Mover fala ↓"
                    >
                      ↓
                    </button>
                    <button
                      style={dangerBtnStyle}
                      onClick={() => removeLineAt(i)}
                      title="Remover fala"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {/* Input da fala */}
                <input
                  value={line}
                  onChange={(e) => setLineAt(i, e.target.value)}
                  placeholder={
                    ((i + 1) % 2 === 1 ? "👨 " : "👩 ") + "Digite a fala…"
                  }
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 13,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
