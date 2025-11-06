import React, { useEffect, useState } from "react";

export type Languages = {
  language1: string; // idioma do campo "english"
  language2: string; // idioma do campo "portuguese"
};

export type SentenceItem = {
  english: string;
  portuguese: string;
  languages: Languages; // sempre presente
};

export type SentencesBlock = {
  subtitle: string;
  type: "sentences";
  sentences: SentenceItem[];
  order?: number;
  grid?: number;
};

type Props = {
  value: SentencesBlock;
  onChange: (next: SentencesBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: React.ReactNode;
  defaultBlockLang1?: string; // default: "en"
  defaultBlockLang2?: string; // default: "pt"
};

const LANG_OPTIONS = ["en", "pt", "es", "fr"] as const;
type LangCode = (typeof LANG_OPTIONS)[number];

export default function VocabularyEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
  defaultBlockLang1 = "en",
  defaultBlockLang2 = "pt",
}: Props) {
  // defaults do bloco (usados ao criar novas sentenças)
  const [defaultLang1, setDefaultLang1] = useState<LangCode>(
    (defaultBlockLang1 as LangCode) || "en"
  );
  const [defaultLang2, setDefaultLang2] = useState<LangCode>(
    (defaultBlockLang2 as LangCode) || "pt"
  );

  // Backfill AUTOMÁTICO na montagem: garante languages em todas as sentenças
  useEffect(() => {
    const needsBackfill = value.sentences.some((s: any) => !s.languages);
    if (needsBackfill) {
      const fixed = value.sentences.map((s: any) => ({
        english: s.english ?? "",
        portuguese: s.portuguese ?? "",
        languages: s.languages ?? {
          language1: defaultLang1 || "en",
          language2: defaultLang2 || "pt",
        },
      }));
      onChange({ ...value, sentences: fixed });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // apenas na montagem

  const updateSubtitle = (subtitle: string) => onChange({ ...value, subtitle });

  const updateOrder = (order: number | undefined) =>
    onChange({ ...value, order });

  const updateGrid = (grid: number | undefined) => onChange({ ...value, grid });

  const updateSentence = (
    index: number,
    updater: (prev: SentenceItem) => SentenceItem
  ) => {
    const next = value.sentences.slice();
    next[index] = updater(next[index]);
    onChange({ ...value, sentences: next });
  };

  const addSentence = () => {
    const next = value.sentences.concat({
      english: "",
      portuguese: "",
      languages: {
        language1: defaultLang1 || "en",
        language2: defaultLang2 || "pt",
      },
    });
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
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange({ ...value, sentences: next });
  };

  const moveDown = (index: number) => {
    if (index >= value.sentences.length - 1) return;
    const next = value.sentences.slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    onChange({ ...value, sentences: next });
  };

  const trimAll = () => {
    const next = value.sentences.map((s) => ({
      english: (s.english || "").trim(),
      portuguese: (s.portuguese || "").trim(),
      languages: {
        language1: (s.languages?.language1 || defaultLang1 || "en").trim(),
        language2: (s.languages?.language2 || defaultLang2 || "pt").trim(),
      },
    }));
    onChange({ ...value, sentences: next, subtitle: value.subtitle.trim() });
  };

  const backfillLanguagesAll = () => {
    const next = value.sentences.map((s) => ({
      ...s,
      languages: {
        language1: (LANG_OPTIONS as readonly string[]).includes(
          s.languages?.language1
        )
          ? (s.languages!.language1 as LangCode)
          : defaultLang1 || "en",
        language2: (LANG_OPTIONS as readonly string[]).includes(
          s.languages?.language2
        )
          ? (s.languages!.language2 as LangCode)
          : defaultLang2 || "pt",
      },
    }));
    onChange({ ...value, sentences: next });
  };

  const renderLangSelect = (
    current: string | undefined,
    onChangeLang: (code: LangCode) => void,
    label: string
  ) => (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, color: "#334155" }}>{label}</label>
      <select
        value={(current as LangCode) ?? ""}
        onChange={(e) => onChangeLang(e.target.value as LangCode)}
        style={selectStyle}
      >
        {LANG_OPTIONS.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: 12,
        display: "grid",
        background: "#e2e8f07a",
        gap: 12,
      }}
    >
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "baseline",
          textAlign: "center",
        }}
      >
        <strong style={{ fontSize: 18, color: "#0f172a" }}>
          Elemento tipo 'Vocabulary'
        </strong>
      </div>
      {/* header + ações */}
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

      {/* extras opcionais */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

      {/* Defaults de idiomas do bloco + ação de backfill */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: 12,
          background: "#f8fafc",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          alignItems: "end",
        }}
      >
        {renderLangSelect(
          defaultLang1,
          (code) => setDefaultLang1(code),
          "Default language1 (campo “english”)"
        )}
        {renderLangSelect(
          defaultLang2,
          (code) => setDefaultLang2(code),
          "Default language2 (campo “portuguese”)"
        )}
        <button
          onClick={backfillLanguagesAll}
          style={ghostBtnStyle}
          title="Aplicar defaults a todas"
        >
          Aplicar defaults em todas
        </button>
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
            List ({value.sentences.length})
          </strong>
          <button onClick={addSentence} style={primaryBtnStyle}>
            + Adicionar vocabulário
          </button>
        </div>

        {value.sentences.length === 0 && (
          <div style={emptyStyle}>
            Nenhuma sentença. Use “Adicionar sentença”.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          }}
        >
          {value.sentences.map((s, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 8,
                padding: 10,
                display: "grid",
                gap: 10,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {idx !== 0 && (
                  <button onClick={() => moveUp(idx)} style={ghostBtnStyle}>
                    ↑
                  </button>
                )}
                Order: {idx + 1}
                {idx !== value.sentences.length - 1 && (
                  <button onClick={() => moveDown(idx)} style={ghostBtnStyle}>
                    ↓
                  </button>
                )}
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
                    Language 2 ({s.languages?.language1 || defaultLang1 || "en"}
                    )
                  </label>
                  <input
                    value={s.english}
                    onChange={(e) =>
                      updateSentence(idx, (prev) => ({
                        ...prev,
                        english: e.target.value,
                      }))
                    }
                    placeholder="Ex.: She went to the supermarket to buy groceries."
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Language 1 ({s.languages?.language2 || defaultLang2 || "pt"}
                    )
                  </label>
                  <input
                    value={s.portuguese}
                    onChange={(e) =>
                      updateSentence(idx, (prev) => ({
                        ...prev,
                        portuguese: e.target.value,
                      }))
                    }
                    placeholder="Ex.: Ela foi ao supermercado para comprar mantimentos."
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Idiomas por sentença (sempre presente) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  background: "#f0f9ff",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                {renderLangSelect(
                  s.languages?.language1,
                  (code) =>
                    updateSentence(idx, (prev) => ({
                      ...prev,
                      languages: {
                        language1: code,
                        language2:
                          prev.languages?.language2 ?? (defaultLang2 || "pt"),
                      },
                    })),
                  "language1 (para “english”)"
                )}
                {renderLangSelect(
                  s.languages?.language2,
                  (code) =>
                    updateSentence(idx, (prev) => ({
                      ...prev,
                      languages: {
                        language1:
                          prev.languages?.language1 ?? (defaultLang1 || "en"),
                        language2: code,
                      },
                    })),
                  "language2 (para “portuguese”)"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* estilos reutilizáveis */
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "8px 8px",
} as React.CSSProperties;

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
