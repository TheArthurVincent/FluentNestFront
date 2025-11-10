import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  backDomain,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";

/* ===================== TYPES ===================== */
export type Languages = {
  language1: string; 
  language2: string; 
};

export type SentenceItem = {
  english: string;
  portuguese: string;
  languages: Languages;
};

export type SentencesBlock = {
  subtitle: string;
  type: "sentences";
  sentences: SentenceItem[];
  order?: number;
  grid?: number;
};

type HeadersLike = Record<string, string>;

type Props = {
  value: SentencesBlock;
  onChange: (next: SentencesBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: React.ReactNode;
  defaultBlockLang1?: string; 
  defaultBlockLang2?: string; 
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  studentId: any;
  headers?: HeadersLike | null;
};

/* ===================== CONSTANTS ===================== */
const LANG_OPTIONS = ["en", "pt", "es", "fr"] as const;
type LangCode = (typeof LANG_OPTIONS)[number];

/* ===================== COMPONENT ===================== */
export default function SentencesEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  titleRightExtra,
  defaultBlockLang1 = "en",
  defaultBlockLang2 = "pt",
  studentId,
  headers,
}: Props) {
  
  const [defaultLang1, setDefaultLang1] = useState<LangCode>(
    (defaultBlockLang1 as LangCode) || "en"
  );
  const [defaultLang2, setDefaultLang2] = useState<LangCode>(
    (defaultBlockLang2 as LangCode) || "pt"
  );

  
  const [showConfig, setShowConfig] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null); 

  /* ====== sincroniza quando props de idioma padrão mudarem ====== */
  useEffect(() => {
    if (
      (LANG_OPTIONS as readonly string[]).includes(defaultBlockLang1) &&
      defaultLang1 !== (defaultBlockLang1 as LangCode)
    ) {
      setDefaultLang1(defaultBlockLang1 as LangCode);
    }
    if (
      (LANG_OPTIONS as readonly string[]).includes(defaultBlockLang2) &&
      defaultLang2 !== (defaultBlockLang2 as LangCode)
    ) {
      setDefaultLang2(defaultBlockLang2 as LangCode);
    }
  }, [defaultBlockLang1, defaultBlockLang2]);

  /* ====== backfill: garante languages em cada sentença ====== */
  useEffect(() => {
    const needsBackfill = value.sentences.some((s: any) => !s?.languages);
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
    
  }, [value.sentences, defaultLang1, defaultLang2]);

  /* ===================== UPDATERS ===================== */
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
    onChange({
      ...value,
      sentences: next,
      subtitle: (value.subtitle || "").trim(),
    });
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

  /* ===================== IA: enviar FRONT e preencher BACK ===================== */
  const handleAI = async (idx: number) => {
    const s = value.sentences[idx];
    const sentence = (s?.english || "").trim();
    const language1 = (s?.languages?.language1 || defaultLang1 || "en").trim();
    const language2 = (s?.languages?.language2 || defaultLang2 || "pt").trim();

    if (!studentId) {
      notifyAlert("ID do aluno não informado.", partnerColor());
      return;
    }
    if (!sentence) {
      notifyAlert(
        "Preencha o Front antes de gerar a tradução/definição.",
        partnerColor()
      );
      return;
    }

    try {
      setLoadingIdx(idx);
console.log("studentId", studentId)
      const url = `${backDomain}/api/v1/translateOrDefineSentence/${studentId}`;
      const payload = { sentence, language1, language2 };

      let response;
      if (headers && Object.keys(headers).length > 0) {
        response = await axios.post(url, payload, { headers });
      } else {
        response = await axios.post(url, payload);
      }

      const backText = (response?.data?.backText || "").trim();
      if (!backText) {
        notifyAlert("Resposta vazia recebida do servidor.", partnerColor());
        return;
      }

      updateSentence(idx, (prev) => ({
        ...prev,
        portuguese: backText,
      }));
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Erro ao gerar tradução/definição.";
      notifyAlert(msg, partnerColor());
    } finally {
      setLoadingIdx(null);
    }
  };

  /* ===================== RENDER HELPERS ===================== */
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

  /* ===================== RENDER ===================== */
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "linear-gradient(to right, #137f1a23, #ffffff)",
        borderRadius: 6,
        padding: "5px 12px",
        display: "grid",
        gap: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <strong
          onClick={() => setShowConfig((v) => !v)}
          style={{ fontSize: 14, cursor: "pointer", color: "#0f172a" }}
        >
          Sentences - {value.subtitle && truncateString(value.subtitle, 15)}
        </strong>

        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {titleRightExtra}
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
            <button
              onClick={onRemove}
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
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addSentence} style={primaryBtnStyle}>
                  + Adicionar sentença
                </button>
              </div>
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
                  gap: 10,
                  background: "#fff",
                }}
              >
                {/* Controles de ordem/remover por item */}
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
                    title="Remover sentença"
                  >
                    Remover
                  </button>
                </div>

                {/* FRONT / BACK */}
                <div style={{ display: "grid", gap: 8 }}>
                  {/* FRONT */}
                  <div style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "#334155" }}>
                      Front
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

                  {/* BACK + IA */}
                  <div style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "#334155" }}>
                      Back
                    </label>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
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
                      <button
                        style={{
                          ...ghostBtnStyle,
                          width: "fit-content",
                          whiteSpace: "nowrap",
                          opacity: loadingIdx === idx ? 0.6 : 1,
                        }}
                        onClick={() => handleAI(idx)}
                        disabled={loadingIdx === idx}
                        title="Gerar tradução/definição e preencher o Back (-1 token)"
                      >
                        {loadingIdx === idx ? "..." : "✨ (-1)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Idiomas por sentença */}
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
                    'language1 (para "english")'
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
                    'language2 (para "portuguese")'
                  )}
                </div>
              </div>
            ))}

            {defaultLang2 === defaultLang1 && (
              <span style={{ fontSize: 12, color: "#475569" }}>
                Se language1 e language2 forem iguais, a IA gera{" "}
                <strong>definição</strong> (não tradução).
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
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
