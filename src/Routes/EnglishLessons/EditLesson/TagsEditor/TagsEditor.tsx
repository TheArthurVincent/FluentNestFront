import React, { useState } from "react";

type Props = {
  value?: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  maxTags?: number;
  normalize?: (t: string) => string; // opcional: ex.: (t) => t.toLowerCase()
};

export default function TagsEditor({
  value = [],
  onChange,
  label = "Tags da aula",
  placeholder = "Digite uma tag e pressione Enter",
  helperText = "Pressione Enter ou vírgula para adicionar. Clique no × para remover.",
  maxTags,
  normalize,
}: Props) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    let t = raw.trim();
    if (!t) return;
    if (normalize) t = normalize(t);
    if (maxTags && value.length >= maxTags) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  };

  const removeAt = (idx: number) => {
    const next = value.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  const clearAll = () => onChange([]);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, color: "#334155" }}>{label}</label>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 13,
          }}
        />
        <button
          type="button"
          onClick={() => addTag(input)}
          style={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            backgroundColor: "white",
            color: "#0f172a",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Adicionar
        </button>
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            style={{
              borderRadius: 8,
              border: "1px solid #ef4444",
              backgroundColor: "#ef4444",
              color: "white",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
            title="Remover todas as tags"
          >
            Limpar
          </button>
        )}
      </div>

      {helperText && <small style={{ color: "#64748b" }}>{helperText}</small>}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        {value.map((t, idx) => (
          <span
            key={t + idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              fontSize: 12,
              color: "#0f172a",
            }}
          >
            {t}
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label={`Remover ${t}`}
              title="Remover"
              style={{
                all: "unset",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 12,
                color: "#64748b",
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
