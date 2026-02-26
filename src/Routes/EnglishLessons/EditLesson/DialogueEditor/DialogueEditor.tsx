import React, { useEffect, useMemo, useState } from "react";
import {
  truncateString,
  backDomain,
} from "../../../../Resources/UniversalComponents";
import SimpleAIGenerator from "../AIGenerator/AIGenerator";

export type DialogueBlock = {
  type: "dialogue";
  subtitle?: string;
  order?: number;
  dialogue: string[]; // posições ímpares = voz masculina; pares = voz feminina
};

type HeadersLike = Record<string, string>;

type Props = {
  value: DialogueBlock;
  studentId: any;
  language: string;
  onChange: (next: DialogueBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: HeadersLike | null;
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
  studentId,
  language,
  headers,
}: Props) {
  const [showConfig, setShowConfig] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState((value.dialogue ?? []).join("\n"));
  const [aiOpen, setAiOpen] = useState(false);

  const update = (patch: Partial<DialogueBlock>) =>
    onChange({ ...value, ...patch, type: "dialogue" });

  const lines = useMemo(() => value.dialogue ?? [], [value.dialogue]);

  // mantém bulkText sincronizado quando o parent atualiza o diálogo (ex: import, reload)
  useEffect(() => {
    setBulkText((value.dialogue ?? []).join("\n"));
  }, [value.dialogue]);

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
      .split(/\r?\n/)
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

  // ===== Helpers IA
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

  function normalizeDialoguePayload(raw: any): string[] {
    // 1) já é lista de strings
    if (Array.isArray(raw)) {
      return raw
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean);
    }

    // 2) objeto com chaves conhecidas
    if (raw && typeof raw === "object") {
      const inner =
        raw.dialogue ?? raw.lines ?? raw.items ?? raw.list ?? raw.sentences;

      if (Array.isArray(inner)) {
        return inner
          .map((x: any) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean);
      }

      // envelopes { data | result | json | response }
      const wrapped =
        raw.data ?? raw.result ?? raw.json ?? raw.response ?? null;
      if (wrapped) return normalizeDialoguePayload(parseMaybeJson(wrapped));

      // fallback: se tiver "text" único, quebra em linhas
      const text =
        raw.text ??
        raw.body ??
        raw.content ??
        raw.transcript ??
        raw.dialog ??
        "";
      if (typeof text === "string" && text.trim()) {
        return text
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // 3) string simples: quebra em linhas
    if (typeof raw === "string" && raw.trim()) {
      return raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  }

  const handleReceiveJson = (raw: any) => {
    const json = parseMaybeJson(raw);
    const dialogue = normalizeDialoguePayload(json);

    if (!dialogue.length) {
      console.warn(
        "IA (dialogue) não reconheceu lista de falas. Retorne string[], { dialogue: string[] } ou um texto com quebras de linha.",
      );
      return;
    }

    update({ dialogue });
    setShowConfig(true);
    setBulkText(dialogue.join("\n"));
    // 🔥 Nada de setChange aqui → não recarrega a aula do backend
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #db9c3655, #ffffff)",
      }}
    >
      {/* Header */}
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
          {value.subtitle
            ? truncateString(value.subtitle, 25)
            : "Adicione  um título"}
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
          <button
            style={primaryBtnStyle}
            onClick={() => setAiOpen(true)}
            title="Gerar diálogo por IA"
          >
            ✨ IA
          </button>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Subtitle */}
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
            5, …) são
            <strong> masculinas</strong> e as falas <em>pares</em> (2, 4, 6, …)
            são
            <strong> femininas</strong>. Isso é definido pela <u>posição</u> das
            falas no diálogo.
          </div>

          {/* Ações principais */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              style={ghostBtnStyle}
              onClick={() => setBulkMode((v) => !v)}
            >
              {bulkMode ? "Esconder colagem em massa" : "Colar em massa"}
            </button>
            <button style={ghostBtnStyle} onClick={() => addLine("")}>
              + Adicionar fala
            </button>
          </div>

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
                    flexWrap: "wrap",
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

      {/* Modal IA: gera diálogo (string[] ou texto quebrável em linhas) */}
      <SimpleAIGenerator
        visible={aiOpen}
        language1={language || "en"}
        type="dialogue"
        onClose={() => setAiOpen(false)}
        postUrl={`${backDomain}/api/v1/generateSection/${studentId}`}
        headers={headers || undefined}
        onReceiveJson={handleReceiveJson}
        title="Gerar Dialogue por IA"
      />
    </div>
  );
}
