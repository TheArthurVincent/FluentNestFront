import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  backDomain,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";
import SimpleAIGenerator from "../AIGenerator/AIGenerator";

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
  comments?: string; // ✅ novo
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
  setChange?: any;
  change?: any;
  language: string;
};

/* ===================== CONSTANTS ===================== */
const LANG_OPTIONS = ["en", "pt", "es", "fr"] as const;
type LangCode = (typeof LANG_OPTIONS)[number];

type FieldSide = "english" | "portuguese";

const MAX_ITEMS = 30;

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
  language,
}) => {
  const [defaultLang1, setDefaultLang1] = useState<LangCode>(
    (defaultBlockLang1 as LangCode) || "en",
  );
  const [defaultLang2, setDefaultLang2] = useState<LangCode>(
    (defaultBlockLang2 as LangCode) || "pt",
  );
  const [showConfig, setShowConfig] = useState(true);

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  /* ===================== LIMIT HELPERS ===================== */
  const count = value.sentences?.length || 0;
  const isAtLimit = count >= MAX_ITEMS;

  const enforceMax = (sentences: SentenceItem[]) => {
    if (!Array.isArray(sentences)) return [];
    if (sentences.length <= MAX_ITEMS) return sentences;
    return sentences.slice(0, MAX_ITEMS);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBlockLang1, defaultBlockLang2]);

  /* ====== backfill languages + ENFORCE MAX ====== */
  useEffect(() => {
    const needsBackfill = (value.sentences || []).some(
      (s: any) => !s?.languages,
    );
    const exceedsMax = (value.sentences?.length || 0) > MAX_ITEMS;

    if (needsBackfill || exceedsMax) {
      const fixed = (value && value.sentences ? value.sentences : []).map(
        (s: any) => ({
          english: s?.english ?? "",
          portuguese: s?.portuguese ?? "",
          languages: s?.languages ?? {
            language1: defaultLang1 || "en",
            language2: defaultLang2 || "pt",
          },
        }),
      );

      onChange({
        ...value,
        type: "sentences",
        comments: value.comments ?? "", // ✅ garante string
        sentences: enforceMax(fixed),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.sentences, defaultLang1, defaultLang2]);

  /* ===================== UPDATERS ===================== */
  const updateSubtitle = (subtitle: string) =>
    onChange({
      ...value,
      type: "sentences",
      subtitle,
      sentences: enforceMax(value.sentences),
    });

  const updateComments = (comments: string) =>
    onChange({
      ...value,
      type: "sentences",
      comments,
      sentences: enforceMax(value.sentences),
    });

  const updateSentence = (
    index: number,
    updater: (prev: SentenceItem) => SentenceItem,
  ) => {
    const next = (value.sentences || []).slice();
    next[index] = updater(next[index]);
    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const addSentence = () => {
    if (isAtLimit) {
      notifyAlert(
        `Este bloco suporta no máximo ${MAX_ITEMS} sentenças.`,
        partnerColor(),
      );
      return;
    }

    const next = [
      {
        english: "",
        portuguese: "",
        languages: {
          language1: defaultLang1 || "en",
          language2: defaultLang2 || "pt",
        },
      },
      ...(value.sentences || []),
    ];

    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const removeSentence = (index: number) => {
    const next = (value.sentences || []).slice();
    next.splice(index, 1);
    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = (value.sentences || []).slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const moveDown = (index: number) => {
    if (index >= (value && value.sentences ? value.sentences.length : 0) - 1)
      return;
    const next = (value && value.sentences ? value.sentences : []).slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  /* ===================== PER-CARD SWAP ===================== */
  const swapCardSides = (idx: number) => {
    updateSentence(idx, (prev) => ({
      ...prev,
      english: prev.portuguese ?? "",
      portuguese: prev.english ?? "",
      languages: {
        language1: prev.languages?.language2 ?? (defaultLang2 || "pt"),
        language2: prev.languages?.language1 ?? (defaultLang1 || "en"),
      },
    }));
  };

  /* ===================== IA: PER-LINE ===================== */
  const isLoading = (idx: number, side: FieldSide) =>
    loadingKey === `${idx}:${side}`;

  const handleAI = async (idx: number, targetSide: FieldSide) => {
    const s = value.sentences[idx];

    if (!studentId) {
      notifyAlert("ID do aluno não informado.", partnerColor());
      return;
    }

    const frontText = String(s?.english ?? "").trim();
    const backText = String(s?.portuguese ?? "").trim();

    const lang1 = String(
      s?.languages?.language1 || defaultLang1 || "en",
    ).trim();

    const lang2 = String(
      s?.languages?.language2 || defaultLang2 || "pt",
    ).trim();

    const isTargetFront = targetSide === "english";

    // SEMPRE usa a OUTRA caixa como referência
    const referenceText = isTargetFront ? backText : frontText;
    const referenceLang = isTargetFront ? lang2 : lang1;
    const targetLang = isTargetFront ? lang1 : lang2;

    if (!referenceText) {
      notifyAlert(
        "Preencha a outra caixa da linha para a IA usar como referência.",
        partnerColor(),
      );
      return;
    }

    const key = `${idx}:${targetSide}`;

    try {
      setLoadingKey(key);

      const url = `${backDomain}/api/v1/translateOrDefineSentence/${studentId}`;
      const payload = {
        sentence: referenceText,
        language1: referenceLang,
        language2: targetLang,
      };

      const response =
        headers && Object.keys(headers).length > 0
          ? await axios.post(url, payload, { headers })
          : await axios.post(url, payload);

      const out = String(response?.data?.backText || "").trim();

      if (!out) {
        notifyAlert("Resposta vazia recebida do servidor.", partnerColor());
        return;
      }

      if (isTargetFront) {
        updateSentence(idx, (prev) => ({
          ...prev,
          english: out,
        }));
      } else {
        updateSentence(idx, (prev) => ({
          ...prev,
          portuguese: out,
        }));
      }
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Erro ao gerar conteúdo por IA.";
      notifyAlert(msg, partnerColor());
    } finally {
      setLoadingKey(null);
    }
  };

  /* ============ IA (lista inteira via gerador isolado) ============ */
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

  const handleReceiveJson = (raw: any) => {
    if (isAtLimit) {
      notifyAlert(
        `Este bloco já está no limite (${MAX_ITEMS} sentenças).`,
        partnerColor(),
      );
      return;
    }

    const json = parseMaybeJson(raw);

    let arr: any[] = [];
    if (Array.isArray(json)) {
      arr = json;
    } else if (json && typeof json === "object") {
      const candidate =
        (json as any).sentences ||
        (json as any).items ||
        (json as any).list ||
        (json as any).data ||
        (json as any).vocabulary ||
        null;

      if (Array.isArray(candidate)) {
        arr = candidate;
      } else if (
        typeof (json as any).result === "string" ||
        typeof (json as any).json === "string"
      ) {
        const inner = parseMaybeJson(
          (json as any).result ?? (json as any).json,
        );
        if (Array.isArray(inner)) arr = inner;
        else if (inner && typeof inner === "object") {
          const innerCandidate =
            (inner as any).sentences ||
            (inner as any).items ||
            (inner as any).list ||
            (inner as any).data ||
            (inner as any).vocabulary;
          if (Array.isArray(innerCandidate)) arr = innerCandidate;
        }
      }
    } else if (typeof json === "string") {
      const maybe = parseMaybeJson(json);
      if (Array.isArray(maybe)) arr = maybe;
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      notifyAlert(
        "Esperado um ARRAY de objetos {english, portuguese} (ou equivalente). Ajuste o prompt/retorno.",
        partnerColor(),
      );
      console.warn("Conteúdo recebido (bruto):", raw);
      return;
    }

    const mapped: SentenceItem[] = arr
      .map((it: any) => {
        const english =
          it?.english ??
          it?.front ??
          it?.sentence ??
          it?.text ??
          it?.en ??
          it?.source ??
          "";

        const portuguese =
          it?.portuguese ??
          it?.back ??
          it?.translation ??
          it?.pt ??
          it?.target ??
          "";

        const lang1 =
          it?.languages?.language1 ?? it?.language1 ?? defaultLang1 ?? "en";
        const lang2 =
          it?.languages?.language2 ?? it?.language2 ?? defaultLang2 ?? "pt";

        return {
          english: String(english ?? ""),
          portuguese: String(portuguese ?? ""),
          languages: {
            language1: String(lang1).trim(),
            language2: String(lang2).trim(),
          },
        };
      })
      .filter(
        (it: SentenceItem) => (it.english || it.portuguese).trim().length > 0,
      );

    const merged = [...mapped, ...(value.sentences || [])];
    const limited = enforceMax(merged);

    onChange({
      ...value,
      type: "sentences",
      comments: value.comments ?? "",
      sentences: limited,
    });

    setShowConfig(true);
  };

  /* ===================== RENDER HELPERS ===================== */
  const renderLangSelect = (
    current: string | undefined,
    onChangeLang: (code: LangCode) => void,
    label: string,
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

  /* ===================== UI: aviso de limite ===================== */
  const LimitNotice = useMemo(() => {
    if (!isAtLimit) return null;
    return (
      <div
        style={{
          border: "1px solid #f59e0b",
          background: "#fffbeb",
          color: "#92400e",
          borderRadius: 6,
          padding: "10px 12px",
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span>
          Este bloco comporta no máximo <strong>{MAX_ITEMS}</strong> sentenças.
        </span>
        <span style={{ fontWeight: 700 }}>
          {count}/{MAX_ITEMS}
        </span>
      </div>
    );
  }, [isAtLimit, count]);

  return (
    <div className="se-root">
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
        .se-row-inline {
          display: flex;
          gap: 6px;
          align-items: stretch;
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
        @media (max-width: 768px) {
          .se-header { flex-direction: column; align-items: flex-start; }
          .se-item-controls { justify-content: space-between; }
          .se-lang-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .se-root { padding: 8px; }
          .se-actions { width: 100%; justify-content: flex-start; }
          .se-btn { padding: 8px 10px; }
        }
      `}
      </style>

      {/* Header */}
      <div className="se-header">
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
            : "Adicione um título"}
        </strong>

        <span className="se-actions">
          {titleRightExtra}

          <div style={{ display: "flex", gap: 8 }}>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp?.();
                }}
                className="se-btn"
                title="Mover bloco para cima"
                aria-label="Mover bloco para cima"
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
                aria-label="Mover bloco para baixo"
              >
                ↓
              </button>
            </div>

            {!isAtLimit && (
              <button
                className="se-btn se-btn--primary"
                onClick={() => setAiOpen(true)}
              >
                ✨ IA
              </button>
            )}

            {onRemove && (
              <button
                onClick={onRemove}
                className="se-btn se-btn--danger"
                title="Remover bloco"
                aria-label="Remover bloco"
              >
                <i className="fa fa-trash" />
              </button>
            )}
          </div>
        </span>
      </div>

      {LimitNotice}

      {showConfig && (
        <div className="se-list">
          {/* Subtitle + Add */}
          <div className="se-topbar" style={{ alignItems: "end" }}>
            <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
              <label className="se-label">Subtitle</label>
              <input
                value={value.subtitle}
                onChange={(e) => updateSubtitle(e.target.value)}
                placeholder="Ex.: Daily Routine (A2)"
                className="se-input"
              />
            </div>

            <div className="se-actions">
              <strong style={{ fontSize: 14, color: "#0f172a" }}>
                List ({value && value.sentences ? value.sentences.length : 0})
              </strong>

              <button
                onClick={addSentence}
                className="se-btn se-btn--primary"
                disabled={isAtLimit}
                style={{
                  opacity: isAtLimit ? 0.6 : 1,
                  cursor: isAtLimit ? "not-allowed" : "pointer",
                }}
                title={
                  isAtLimit
                    ? `Limite atingido (${MAX_ITEMS}). Remova itens para adicionar mais.`
                    : "Adicionar sentença"
                }
              >
                + Adicionar sentença
              </button>
            </div>
          </div>

          {/* ✅ Comments */}
          <div className="se-field">
            <label className="se-label">Comments</label>
            <textarea
              value={value.comments ?? ""}
              onChange={(e) => updateComments(e.target.value)}
              placeholder="Observações, instruções, contexto..."
              className="se-input"
              style={{ minHeight: 90, resize: "vertical" }}
            />
          </div>

          {value && value.sentences && value.sentences.length === 0 && (
            <div className="se-empty">
              Nenhuma sentença. Use “Adicionar sentença” ou IA.
            </div>
          )}

          {value &&
            value.sentences &&
            value.sentences.map((s, idx) => (
              <div key={idx} className="se-item">
                {/* Controles do item */}
                <div className="se-item-controls">
                  {idx !== 0 && (
                    <button
                      onClick={() => moveUp(idx)}
                      className="se-btn"
                      aria-label="Mover item para cima"
                    >
                      ↑
                    </button>
                  )}
                  <span style={{ fontSize: 12, color: "#334155" }}>
                    Order: {idx + 1}
                  </span>
                  {idx !==
                    (value && value.sentences ? value.sentences.length : 0) -
                      1 && (
                    <button
                      onClick={() => moveDown(idx)}
                      className="se-btn"
                      aria-label="Mover item para baixo"
                    >
                      ↓
                    </button>
                  )}

                  <button
                    onClick={() => swapCardSides(idx)}
                    className="se-btn"
                    title="Trocar Front/Back deste card (swap dos textos e dos idiomas)"
                    aria-label="Trocar Front/Back"
                  >
                    Trocar
                  </button>

                  <button
                    onClick={() => removeSentence(idx)}
                    className="se-btn se-btn--danger"
                    title="Remover sentença"
                    aria-label="Remover sentença"
                  >
                    Remover
                  </button>
                </div>

                {/* FRONT / BACK */}
                <div className="se-row">
                  <div className="se-field">
                    <label className="se-label">Front</label>

                    <div className="se-row-inline">
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

                      <button
                        className="se-btn"
                        style={{ opacity: isLoading(idx, "english") ? 0.6 : 1 }}
                        onClick={() => handleAI(idx, "english")}
                        disabled={
                          isLoading(idx, "english") ||
                          isLoading(idx, "portuguese")
                        }
                        title="Gerar/revisar o Front usando IA"
                        aria-label="Gerar/revisar Front"
                      >
                        {isLoading(idx, "english") ? "..." : "IA"}
                      </button>
                    </div>
                  </div>

                  <div className="se-field">
                    <label className="se-label">Back</label>

                    <div className="se-row-inline">
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
                          opacity: isLoading(idx, "portuguese") ? 0.6 : 1,
                        }}
                        onClick={() => handleAI(idx, "portuguese")}
                        disabled={
                          isLoading(idx, "portuguese") ||
                          isLoading(idx, "english")
                        }
                        title="Gerar/revisar o Back usando IA"
                        aria-label="Gerar/revisar Back"
                      >
                        {isLoading(idx, "portuguese") ? "..." : "IA"}
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
                    'language1 (para "english")',
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
                    'language2 (para "portuguese")',
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
      )}

      {!isAtLimit && (
        <SimpleAIGenerator
          visible={aiOpen}
          language1={language}
          type="sentences"
          onClose={() => setAiOpen(false)}
          postUrl={`${backDomain}/api/v1/generateSection/${studentId}`}
          headers={headers}
          onReceiveJson={handleReceiveJson}
          title="Gerar Sentences por IA"
          numberOfSentences={MAX_ITEMS}
        />
      )}
    </div>
  );
};

export default SentencesEditor;
