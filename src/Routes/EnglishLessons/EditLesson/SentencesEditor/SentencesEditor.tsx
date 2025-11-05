import React from "react";

export type SentenceItem = {
  english: string;
  portuguese: string;
};

export type SentencesBlock = {
  subtitle: string;
  type: "sentences";
  sentences: SentenceItem[];
  // opcionais que você pode querer manter:
  order?: number;
  grid?: number;
};

type Props = {
  value: SentencesBlock; // bloco atual
  onChange: (next: SentencesBlock) => void; // retorna bloco atualizado para o pai
  onRemove?: () => void; // opcional, para remover este bloco no pai
  titleRightExtra?: React.ReactNode; // opcional, algo extra no header (ex. "Duplicar")
};

export default function SentencesEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
}: Props) {
  const updateSubtitle = (subtitle: string) => onChange({ ...value, subtitle });

  const updateOrder = (order: number | undefined) =>
    onChange({ ...value, order });

  const updateGrid = (grid: number | undefined) => onChange({ ...value, grid });

  const updateSentence = (
    index: number,
    field: keyof SentenceItem,
    val: string
  ) => {
    const next = value.sentences.slice();
    next[index] = { ...next[index], [field]: val };
    onChange({ ...value, sentences: next });
  };

  const addSentence = () => {
    const next = value.sentences.concat({ english: "", portuguese: "" });
    onChange({ ...value, sentences: next });
  };

  const removeSentence = (index: number) => {
    const next = value.sentences.slice();
    next.splice(index, 1);
    onChange({ ...value, sentences: next });
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = value.sentences.slice();
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChange({ ...value, sentences: next });
  };

  const moveDown = (index: number) => {
    if (index >= value.sentences.length - 1) return;
    const next = value.sentences.slice();
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChange({ ...value, sentences: next });
  };

  const trimAll = () => {
    const next = value.sentences.map((s) => ({
      english: s.english.trim(),
      portuguese: s.portuguese.trim(),
    }));
    onChange({ ...value, sentences: next, subtitle: value.subtitle.trim() });
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: 12,
        display: "grid",
        gap: 12,
        background: "white",
      }}
    >
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
            value={value.subtitle}
            onChange={(e) => updateSubtitle(e.target.value)}
            placeholder="Ex.: Groceries"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
          <button onClick={trimAll} style={ghostBtnStyle} title="Trim texto">
            Trim
          </button>
          {titleRightExtra}
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              Remover bloco
            </button>
          )}
        </div>
      </div>

      {/* Extras opcionais: order e grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: 12, color: "#334155" }}>
            Order (opcional)
          </label>
          <input
            type="number"
            value={value.order ?? ""}
            onChange={(e) =>
              updateOrder(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Ex.: 2"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: 12, color: "#334155" }}>
            Grid (opcional)
          </label>
          <input
            type="number"
            value={value.grid ?? ""}
            onChange={(e) =>
              updateGrid(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Ex.: 2"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Lista de sentenças */}
      <div style={{ display: "grid", gap: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <strong style={{ fontSize: 14, color: "#0f172a" }}>
            Sentences ({value.sentences.length})
          </strong>
          <button onClick={addSentence} style={primaryBtnStyle}>
            + Adicionar sentença
          </button>
        </div>

        {value.sentences.length === 0 && (
          <div style={emptyStyle}>
            Nenhuma sentença. Use “Adicionar sentença”.
          </div>
        )}

        {value.sentences.map((s, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 10,
              display: "grid",
              gap: 8,
              background: "#f8fafc",
            }}
          >
            <div
              style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}
            >
              <button onClick={() => moveUp(idx)} style={ghostBtnStyle}>
                ↑
              </button>
              <button onClick={() => moveDown(idx)} style={ghostBtnStyle}>
                ↓
              </button>
              <button
                onClick={() => removeSentence(idx)}
                style={dangerBtnStyle}
              >
                Remover
              </button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  English
                </label>
                <input
                  value={s.english}
                  onChange={(e) =>
                    updateSentence(idx, "english", e.target.value)
                  }
                  placeholder="Ex.: She went to the supermarket to buy groceries."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Portuguese
                </label>
                <input
                  value={s.portuguese}
                  onChange={(e) =>
                    updateSentence(idx, "portuguese", e.target.value)
                  }
                  placeholder="Ex.: Ela foi ao supermercado para comprar mantimentos."
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
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
