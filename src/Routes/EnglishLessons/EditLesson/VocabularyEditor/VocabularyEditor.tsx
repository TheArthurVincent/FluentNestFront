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
  comments?: string; // ✅ novo (era "description")
  type: "sentences" | "vocabulary";
  sentences: SentenceItem[];
  order?: number;
  grid?: number;
};

type HeadersLike = Record<string, string>;

type Props = {
  value: SentencesBlock;
  language: string;
  onChange: (next: SentencesBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: React.ReactNode;
  defaultBlockLang1?: string;
  defaultBlockLang2?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;

  studentId?: string;
  headers?: HeadersLike | null;

  setChange?: (v: any) => void;
  change?: any;

  changeTokens?: any;
  setChangeTokens?: (v: any) => void;
};

/* ===================== CONSTANTS ===================== */
const LANG_OPTIONS = ["en", "pt", "es", "fr"] as const;
type LangCode = (typeof LANG_OPTIONS)[number];

type FieldSide = "english" | "portuguese";

const MAX_ITEMS = 25;

/* ===================== COMPONENT ===================== */
export default function VocabularyEditor({
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
}: Props) {
  const [showConfig, setShowConfig] = useState(true);
  const [defaultLang1, setDefaultLang1] = useState<LangCode>(
    (defaultBlockLang1 as LangCode) || "en",
  );
  const [defaultLang2, setDefaultLang2] = useState<LangCode>(
    (defaultBlockLang2 as LangCode) || "pt",
  );

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

  /* ====== sincroniza idiomas padrão quando props mudam ====== */
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

  /* ====== backfill languages + garantir type vocabulary + ENFORCE MAX ====== */
  useEffect(() => {
    const needsBackfill = (value.sentences || []).some(
      (s: any) => !s?.languages,
    );
    const exceedsMax = (value.sentences?.length || 0) > MAX_ITEMS;

    if (needsBackfill || value.type !== "vocabulary" || exceedsMax) {
      const fixed = (value.sentences || []).map((s: any) => ({
        english: s?.english ?? "",
        portuguese: s?.portuguese ?? "",
        languages: s?.languages ?? {
          language1: defaultLang1 || "en",
          language2: defaultLang2 || "pt",
        },
      }));

      onChange({
        ...value,
        type: "vocabulary",
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
      subtitle,
      type: "vocabulary",
      sentences: enforceMax(value.sentences),
    });

  const updateComments = (comments: string) =>
    onChange({
      ...value,
      comments,
      type: "vocabulary",
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
      type: "vocabulary",
      comments: value.comments ?? "", // ✅ garante string (sem "fixed" aqui!)
      sentences: enforceMax(next), // ✅ usa next
    });
  };

  const addSentence = () => {
    if (isAtLimit) {
      notifyAlert(
        `Este bloco suporta no máximo ${MAX_ITEMS} itens.`,
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
      type: "vocabulary",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const removeSentence = (index: number) => {
    const next = (value.sentences || []).slice();
    next.splice(index, 1);
    onChange({
      ...value,
      type: "vocabulary",
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
      type: "vocabulary",
      comments: value.comments ?? "",
      sentences: enforceMax(next),
    });
  };

  const moveDown = (index: number) => {
    if (index >= (value.sentences?.length || 0) - 1) return;
    const next = (value.sentences || []).slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    onChange({
      ...value,
      type: "vocabulary",
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

    const baseText =
      targetSide === "english"
        ? String(s?.english ?? "").trim()
        : String(s?.portuguese ?? "").trim();

    const contextText =
      targetSide === "english"
        ? String(s?.portuguese ?? "").trim()
        : String(s?.english ?? "").trim();

    if (!baseText && !contextText) {
      notifyAlert(
        "Preencha ao menos um dos lados antes de usar IA.",
        partnerColor(),
      );
      return;
    }

    const lang1 = String(
      s?.languages?.language1 || defaultLang1 || "en",
    ).trim();
    const lang2 = String(
      s?.languages?.language2 || defaultLang2 || "pt",
    ).trim();

    const targetLang = targetSide === "english" ? lang1 : lang2;

    const seedText = baseText || contextText;

    const seedLang = baseText
      ? targetLang
      : targetSide === "english"
        ? lang2
        : lang1;

    const key = `${idx}:${targetSide}`;

    try {
      setLoadingKey(key);

      const url = `${backDomain}/api/v1/translateOrDefineSentence/${studentId}`;
      const payload = {
        sentence: seedText,
        language1: seedLang,
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

      if (targetSide === "english") {
        updateSentence(idx, (prev) => ({ ...prev, english: out }));
      } else {
        updateSentence(idx, (prev) => ({ ...prev, portuguese: out }));
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

  /* ===================== IA - RECEIVE JSON ===================== */
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
        `Este bloco já está no limite (${MAX_ITEMS} itens).`,
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
        (json as any).vocabulary ||
        (json as any).sentences ||
        (json as any).items ||
        (json as any).list ||
        (json as any).data ||
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
            (inner as any).vocabulary ||
            (inner as any).sentences ||
            (inner as any).items ||
            (inner as any).list ||
            (inner as any).data;
          if (Array.isArray(innerCandidate)) arr = innerCandidate;
        }
      }
    } else if (typeof json === "string") {
      const maybe = parseMaybeJson(json);
      if (Array.isArray(maybe)) arr = maybe;
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      notifyAlert(
        "A IA gerou conteúdo, mas não reconheci a lista. Ajuste o retorno para ser um ARRAY de {english, portuguese}.",
        partnerColor(),
      );
      console.warn("Conteúdo recebido da IA (bruto):", raw);
      return;
    }

    const mapped: SentenceItem[] = arr
      .map((it: any) => {
        const english =
          it?.english ??
          it?.front ??
          it?.term ??
          it?.word ??
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
      type: "vocabulary",
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

  /* ===================== UI: aviso de limite ===================== */
  const LimitNotice = useMemo(() => {
    if (!isAtLimit) return null;
    return (
      <div
        style={{
          border: "1px solid #f59e0b",
          background: "#fffbeb",
          color: "#92400e",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span>
          Este bloco comporta no máximo <strong>{MAX_ITEMS}</strong> itens.
        </span>
        <span style={{ fontWeight: 700 }}>
          {count}/{MAX_ITEMS}
        </span>
      </div>
    );
  }, [isAtLimit, count]);

  /* ===================== RENDER ===================== */
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "linear-gradient(to right, #0054c11f, #ffffff)",
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
          gap: 8,
          alignItems: "center",
          textAlign: "center",
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
            : "Adicione um título"}
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

          {!isAtLimit && (
            <button style={primaryBtnStyle} onClick={() => setAiOpen(true)}>
              ✨ IA
            </button>
          )}

          {titleRightExtra}

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

      {LimitNotice}

      {showConfig && (
        <>
          {/* Subtitle */}
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
              {titleRightExtra}
            </div>
          </div>

          {/* Comments */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Comments</label>
            <textarea
              value={value.comments ?? ""}
              onChange={(e) => updateComments(e.target.value)}
              placeholder="Observações, instruções, contexto..."
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            />
          </div>

          {/* Grid de cartões */}
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

              <button
                onClick={addSentence}
                style={{
                  ...primaryBtnStyle,
                  opacity: isAtLimit ? 0.6 : 1,
                  cursor: isAtLimit ? "not-allowed" : "pointer",
                }}
                disabled={isAtLimit}
                title={
                  isAtLimit
                    ? `Limite atingido (${MAX_ITEMS}). Remova itens para adicionar mais.`
                    : "Adicionar vocabulário"
                }
              >
                + Adicionar vocabulário
              </button>
            </div>

            {value.sentences.length === 0 && (
              <div style={emptyStyle}>
                Nenhum item. Use “Adicionar vocabulário”.
              </div>
            )}

            <div
              style={{
                display: "grid",
                gap: 12,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                overflow: "hidden",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(270px, 100%), 1fr))",
              }}
            >
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
                  {/* Controles do item */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    {idx !== 0 && (
                      <button onClick={() => moveUp(idx)} style={ghostBtnStyle}>
                        ↑
                      </button>
                    )}
                    Order: {idx + 1}
                    {idx !== value.sentences.length - 1 && (
                      <button
                        onClick={() => moveDown(idx)}
                        style={ghostBtnStyle}
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => swapCardSides(idx)}
                      style={ghostBtnStyle}
                      title="Trocar Front/Back deste card (swap dos textos e dos idiomas)"
                    >
                      Trocar
                    </button>
                    <button
                      onClick={() => removeSentence(idx)}
                      style={dangerBtnStyle}
                    >
                      Remover
                    </button>
                  </div>

                  {/* FRONT */}
                  <div style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "#334155" }}>
                      Front
                    </label>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <input
                        value={s.english}
                        onChange={(e) =>
                          updateSentence(idx, (prev) => ({
                            ...prev,
                            english: e.target.value,
                          }))
                        }
                        placeholder="Ex.: Hi"
                        style={inputStyle}
                      />

                      <button
                        style={{
                          ...ghostBtnStyle,
                          whiteSpace: "nowrap",
                          opacity: isLoading(idx, "english") ? 0.6 : 1,
                        }}
                        onClick={() => handleAI(idx, "english")}
                        disabled={
                          isLoading(idx, "english") ||
                          isLoading(idx, "portuguese")
                        }
                        title="Gerar/revisar o Front usando IA"
                      >
                        {isLoading(idx, "english") ? "..." : "IA"}
                      </button>
                    </div>
                  </div>

                  {/* BACK */}
                  <div style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "#334155" }}>
                      Back
                    </label>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <input
                        value={s.portuguese}
                        onChange={(e) =>
                          updateSentence(idx, (prev) => ({
                            ...prev,
                            portuguese: e.target.value,
                          }))
                        }
                        placeholder="Ex.: Oi"
                        style={inputStyle}
                      />

                      <button
                        style={{
                          ...ghostBtnStyle,
                          whiteSpace: "nowrap",
                          opacity: isLoading(idx, "portuguese") ? 0.6 : 1,
                        }}
                        onClick={() => handleAI(idx, "portuguese")}
                        disabled={
                          isLoading(idx, "portuguese") ||
                          isLoading(idx, "english")
                        }
                        title="Gerar/revisar o Back usando IA"
                      >
                        {isLoading(idx, "portuguese") ? "..." : "IA"}
                      </button>
                    </div>
                  </div>

                  {/* Idiomas por item */}
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
                              prev.languages?.language2 ??
                              (defaultLang2 || "pt"),
                          },
                        })),
                      'language1 (campo "english")',
                    )}

                    {renderLangSelect(
                      s.languages?.language2,
                      (code) =>
                        updateSentence(idx, (prev) => ({
                          ...prev,
                          languages: {
                            language1:
                              prev.languages?.language1 ??
                              (defaultLang1 || "en"),
                            language2: code,
                          },
                        })),
                      'language2 (campo "portuguese")',
                    )}
                  </div>

                  {(s.languages?.language1 || defaultLang1) ===
                    (s.languages?.language2 || defaultLang2) && (
                    <span style={{ fontSize: 12, color: "#475569" }}>
                      language1 e language2 iguais: a IA tende a gerar
                      definição.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!isAtLimit && (
        <SimpleAIGenerator
          visible={aiOpen}
          language1={language}
          type="vocabulary"
          onClose={() => setAiOpen(false)}
          postUrl={`${backDomain}/api/v1/generateSection/${studentId}`}
          headers={headers}
          onReceiveJson={handleReceiveJson}
          title="Gerar Vocabulary por IA"
          numberOfSentences={MAX_ITEMS}
        />
      )}
    </div>
  );
}

/* ===================== estilos reutilizáveis ===================== */
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
