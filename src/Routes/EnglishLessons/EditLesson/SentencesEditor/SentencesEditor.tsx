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
const SentencesEditor: React.FC<Props> = ({
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
}) => {
  const [defaultLang1, setDefaultLang1] = useState<LangCode>(
    (defaultBlockLang1 as LangCode) || "en"
  );
  const [defaultLang2, setDefaultLang2] = useState<LangCode>(
    (defaultBlockLang2 as LangCode) || "pt"
  );
  const [showConfig, setShowConfig] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

  /* ====== sincroniza idiomas padrão ====== */
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

  /* ====== backfill languages ====== */
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
      const url = `${backDomain}/api/v1/translateOrDefineSentence/${studentId}`;
      const payload = { sentence, language1, language2 };

      const response =
        headers && Object.keys(headers).length > 0
          ? await axios.post(url, payload, { headers })
          : await axios.post(url, payload);

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
    <div className="se-field">
      <label className="se-label">{label}</label>
      <select
        value={(current as LangCode) ?? ""}
        onChange={(e) => onChangeLang(e.target.value as LangCode)}
        className="se-input"
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
    <div className="se-root">
      {/* styles responsivos anti-vazamento */}
      <style>
        {`
        .se-root {
          box-sizing: border-box;
          max-width: 100%;
          width: 100%;
          overflow-x: hidden;
          border: 1px solid #e2e8f0;
          background: linear-gradient(to right, #137f1a23, #ffffff);
          border-radius: 6px;
          padding: 8px 12px;
          display: grid;
          gap: 12px;
        }
        .se-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .se-title {
          font-size: 14px;
          color: #0f172a;
          cursor: pointer;
          word-break: break-word;
        }
        .se-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .se-btn {
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #fff;
          color: #0f172a;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 13px;
          min-width: 0;
          white-space: nowrap;
        }
        .se-btn--danger {
          border-color: #ef4444;
          background-color: #ef4444;
          color: #fff;
          font-weight: 600;
        }
        .se-btn--primary {
          border: 1px solid #0891b2;
          background-color: #06b6d4;
          color: #fff;
          font-weight: 600;
        }

        .se-empty {
          border: 1px dashed #94a3b8;
          border-radius: 8px;
          padding: 16px;
          color: #64748b;
          font-size: 13px;
          background: #fff;
        }

        .se-list {
          display: grid;
          gap: 8px;
        }

        .se-item {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          display: grid;
          gap: 10px;
          background: #fff;
        }

        .se-item-controls {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
        }

        .se-row {
          display: grid;
          gap: 8px;
        }

        .se-back-row {
          display: grid;
          gap: 6px;
        }

        .se-label {
          font-size: 12px;
          color: #334155;
        }

        .se-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          box-sizing: border-box;
        }

        .se-lang-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f0f9ff;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .se-topbar {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }

        .se-field {
          display: grid;
          gap: 6px;
        }

        /* ================== RESPONSIVO ================== */
        @media (max-width: 768px) {
          .se-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .se-item-controls {
            justify-content: space-between;
          }
          .se-back-actions {
            width: 100%;
          }
          .se-language-note {
            display: block;
          }
          .se-lang-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .se-root {
            padding: 8px;
          }
          .se-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .se-back-row {
            /* input e botão de IA viram coluna */
          }
          .se-back-row-inline {
            display: flex;
            gap: 6px;
            align-items: stretch;
          }
          .se-back-row-inline > .se-input {
            flex: 1 1 auto;
            min-width: 0;
          }
          .se-btn {
            padding: 8px 10px;
          }
        }
      `}
      </style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong onClick={() => setShowConfig((v) => !v)} className="se-title">
          Sentences
          {value.subtitle ? ` - ${truncateString(value.subtitle, 15)}` : ""}
        </strong>

        <span style={{ display: "flex", alignItems: "center" }}>
          {titleRightExtra}
          <div
            style={{
              borderRadius: 8,
              display: "flex",
              gap: 1,
              color: "#0f172a",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              className="se-btn"
              title="Mover bloco para cima"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              className="se-btn"
              title="Mover bloco para baixo"
            >
              ↓
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="se-btn se-btn--danger"
                title="Remover bloco"
              >
                <i className="fa fa-trash" />
              </button>
            )}
          </div>
        </span>
      </div>

      {showConfig && (
        <div className="se-list">
          <div className="se-topbar">
            <strong style={{ fontSize: 14, color: "#0f172a" }}>
              List ({value.sentences.length})
            </strong>
            <div className="se-actions">
              <button onClick={addSentence} className="se-btn se-btn--primary">
                + Adicionar sentença
              </button>
            </div>
          </div>

          {value.sentences.length === 0 && (
            <div className="se-empty">
              Nenhuma sentença. Use “Adicionar sentença”.
            </div>
          )}

          {value.sentences.map((s, idx) => (
            <div key={idx} className="se-item">
              {/* Controles do item */}
              <div className="se-item-controls">
                {idx !== 0 && (
                  <button onClick={() => moveUp(idx)} className="se-btn">
                    ↑
                  </button>
                )}
                <span style={{ fontSize: 12, color: "#334155" }}>
                  Order: {idx + 1}
                </span>
                {idx !== value.sentences.length - 1 && (
                  <button onClick={() => moveDown(idx)} className="se-btn">
                    ↓
                  </button>
                )}
                <button
                  onClick={() => removeSentence(idx)}
                  className="se-btn se-btn--danger"
                  title="Remover sentença"
                >
                  Remover
                </button>
              </div>

              {/* FRONT / BACK */}
              <div className="se-row">
                {/* FRONT */}
                <div className="se-field">
                  <label className="se-label">Front</label>
                  <input
                    value={s.english}
                    onChange={(e) =>
                      updateSentence(idx, (prev) => ({
                        ...prev,
                        english: e.target.value,
                      }))
                    }
                    placeholder="Ex.: She went to the supermarket to buy groceries."
                    className="se-input"
                  />
                </div>

                {/* BACK + IA */}
                <div className="se-field">
                  <label className="se-label">Back</label>
                  {/* em telas grandes, mantém linha; em mobile, naturalmente quebra */}
                  <div className="se-back-row-inline">
                    <input
                      value={s.portuguese}
                      onChange={(e) =>
                        updateSentence(idx, (prev) => ({
                          ...prev,
                          portuguese: e.target.value,
                        }))
                      }
                      placeholder="Ex.: Ela foi ao supermercado para comprar mantimentos."
                      className="se-input"
                    />
                    <button
                      className="se-btn"
                      style={{
                        opacity: loadingIdx === idx ? 0.6 : 1,
                        whiteSpace: "nowrap",
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
              <div className="se-lang-grid">
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
            <span
              className="se-language-note"
              style={{ fontSize: 12, color: "#475569" }}
            >
              Se language1 e language2 forem iguais, a IA gera{" "}
              <strong>definição</strong> (não tradução).
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SentencesEditor;
