import React, { useMemo, useState } from "react";
import { readText, notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { newArvinTitleStyle } from "../../../ArvinComponents/SearchMaterials/SearchMaterials";

export type SentenceItem = {
  english: string;
  portuguese: string;
  languages?: {
    language1?: string; // frente
    language2?: string; // trás
  };
};

type Props = {
  sentences: SentenceItem[] | any;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  selectedVoice?: string;
  language?: string; // mantido por compatibilidade, mas agora priorizamos languages.language1/2
  exerciseScore: (points: number, label?: string) => void;
};

export const defaultLabels = {
  title: "Match de Vocabulário",
  of: "de",
  restart: "Reiniciar",
  selectLeftFirst: "Selecione primeiro um item da coluna da esquerda.",
  correct: "✔ Par correto!",
  wrong: "❌ Não é o par correspondente.",
  finished: "Você concluiu todos os pares! 🎉",
  plusPoints:
    "Pontuação: 3 / 2 / 1 pontos por acerto (diminuindo por tentativas)",
};

function shuffle<T>(arr: T[]): T[] {
  const a = (arr || []).slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// mesmas cores usadas no outro componente para vincular frente/back
const pairColors = [
  "#4dabf7",
  "#51cf66",
  "#ffa94d",
  "#000000",
  "#845ef7",
  "#008cffff",
  "#753951",
  "#ff00aaff",
  "#7c542cff",
  "#926060ff",
  "#71b0d8ff",
  "#228be6",
  "#495057",
  "#5c7cfa",
  "#37b24d",
];

// ==== ESTILOS NO MESMO CLIMA DO RANKING / ARVIN ====

const cardContainerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 900,
  margin: "0 auto",
  borderRadius: 12,
  background: "#FFFFFF",
  boxSizing: "border-box",
  padding: 16,
  boxShadow:
    "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
  border: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
  gap: 12,
};

const headerRightStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "Plus Jakarta Sans",
  fontSize: 13,
};

const restartButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 600,
  border: "1px solid #E5E7EB",
  fontFamily: "Plus Jakarta Sans",
  fontSize: 12,
};

const gridWrapperStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const columnStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const baseCardStyle: React.CSSProperties = {
  border: "1px solid #e3e6ea",
  borderRadius: 8,
  padding: "10px 12px",
  position: "relative",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
  minHeight: "40px",
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  justifyContent: "flex-start",
  cursor: "pointer",
  transition:
    "background 0.15s ease, transform 0.08s ease, box-shadow 0.1s ease",
};

const selectedStyle: React.CSSProperties = {
  outline: "2px solid #111827",
  outlineOffset: 1,
};

const audioButtonStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: 999,
  background: "#F3F4F6",
  border: "1px solid #D1D5DB",
  cursor: "pointer",
  fontSize: "12px",
  minWidth: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const checkTagStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#16a34a",
  fontWeight: 600,
};

const finishedRowStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: 600,
  color: "#065F46",
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "space-between",
  fontFamily: "Plus Jakarta Sans",
};

// ==== COMPONENTES E LÓGICA ====

function Card({ children }: { children: React.ReactNode }) {
  return <div style={cardContainerStyle}>{children}</div>;
}

function HeaderBar({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={headerBarStyle}>
      <h1
        style={{
          ...newArvinTitleStyle,
          fontSize: 20,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {title}
      </h1>
      <div style={headerRightStyle}>{right}</div>
    </div>
  );
}

export default function VocabularyMatchExercise({
  sentences,
  labels,
  selectedVoice,
  language, // mantido caso alguma chamada ainda use
  exerciseScore,
}: Props) {
  const L = { ...defaultLabels, ...(labels || {}) };

  const pool = useMemo(
    () =>
      Array.isArray(sentences)
        ? sentences.filter((s) => s?.english?.trim() && s?.portuguese?.trim())
        : [],
    [sentences]
  );

  const [seed, setSeed] = useState(0);
  const [selectedFront, setSelectedFront] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());

  // tentativas por card (index do pool)
  const [attempts, setAttempts] = useState<Record<number, number>>({});

  const shuffledIdx = useMemo(
    () => shuffle(pool.map((_, i) => i)),
    [pool, seed]
  );

  const total = pool.length;
  const done = matched.size === total;

  function getLanguages(sentence: SentenceItem) {
    const languages = sentence?.languages || {};
    return {
      frontLang: languages.language1 || language || "en",
      backLang: languages.language2 || "pt",
    };
  }

  function reset() {
    setSeed((v) => v + 1);
    setSelectedFront(null);
    setMatched(new Set());
    setAttempts({});
  }

  function handlePickFront(i: number) {
    if (matched.has(i)) return;
    setSelectedFront(i);
  }

  function incrementAttemptsFor(index: number) {
    setAttempts((prev) => {
      const prevCount = prev[index] ?? 0;
      return { ...prev, [index]: prevCount + 1 };
    });
  }

  function getPointsForCard(cardIndex: number): number {
    const tries = attempts[cardIndex] ?? 0;
    // tries = quantos erros já teve ANTES do acerto
    if (tries === 0) return 3; // acertou de primeira
    if (tries === 1) return 2; // acertou na 2ª tentativa
    if (tries === 2) return 1; // acertou na 3ª
    return 0; // depois disso não pontua
  }

  function handlePickBack(slot: number) {
    const realIndex = shuffledIdx[slot];

    if (matched.has(realIndex)) return;

    if (selectedFront === null) {
      notifyAlert(L.selectLeftFirst, "orange");
      return;
    }

    if (selectedFront === realIndex) {
      // ✅ ACERTOU
      const next = new Set(matched);
      next.add(realIndex);
      setMatched(next);
      setSelectedFront(null);

      // calcula pontuação com base nas tentativas para esse card
      const points = getPointsForCard(realIndex);

      try {
        const frontText = pool[realIndex]?.english || "";
        const backText = pool[realIndex]?.portuguese || "";
        const desc = `Match Vocabulary: ${frontText} ⇄ ${backText}`;

        if (points > 0) {
          exerciseScore?.(points, desc);
        }
      } catch (e) {
        console.error("Erro ao registrar pontuação do match:", e);
      }

      const pointsMsg =
        points > 0 ? ` (+${points} ponto${points > 1 ? "s" : ""})` : "";
      notifyAlert(`${L.correct}${pointsMsg}`, "green");
    } else {
      // ❌ ERROU – conta uma tentativa para o card selecionado
      if (selectedFront !== null && !matched.has(selectedFront)) {
        incrementAttemptsFor(selectedFront);
      }
      notifyAlert(L.wrong, "red");
      setSelectedFront(null);
    }
  }

  return (
    <div>
      <HeaderBar
        title={L.title}
        right={
          <>
            <span>
              {matched.size} {L.of} {total}
            </span>
            <button
              onClick={reset}
              style={restartButtonStyle}
              title={L.restart}
            >
              {L.restart}
            </button>
          </>
        }
      />

      {/* layout duas colunas */}
      <div style={gridWrapperStyle}>
        {/* LEFT: fronts (áudio, com highlight de par) */}
        <div style={columnStyle}>
          {pool.map((s, i) => {
            const isSelected = selectedFront === i;
            const isDone = matched.has(i);
            const color = pairColors[i % pairColors.length];
            const { frontLang } = getLanguages(s);

            return (
              <div
                key={`front-${i}`}
                style={{
                  ...baseCardStyle,
                  border: `2px solid ${isDone ? color : "#e5e7eb"}`,
                  ...(isSelected ? selectedStyle : {}),
                  ...(isDone ? { backgroundColor: `${color}14` } : {}),
                }}
                onClick={() => {
                  handlePickFront(i);
                  readText(s.english, true, frontLang, selectedVoice);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDone
                    ? `${color}1F`
                    : "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDone
                    ? `${color}14`
                    : "#fff";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        readText(s.english, true, frontLang, selectedVoice);
                      }}
                      style={audioButtonStyle}
                      title="Ouvir"
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  </span>
                  {isDone && <span style={checkTagStyle}>✔</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: backs embaralhados (texto + áudio se idioma != pt) */}
        <div style={columnStyle}>
          {shuffledIdx.map((realIndex, slot) => {
            const s = pool[realIndex];
            const isDone = matched.has(realIndex);
            const color = pairColors[realIndex % pairColors.length];
            const { backLang } = getLanguages(s);

            return (
              <div
                key={`back-${slot}`}
                style={{
                  ...baseCardStyle,
                  border: `2px solid ${isDone ? color : "#e5e7eb"}`,
                  ...(isDone ? { backgroundColor: `${color}14` } : {}),
                }}
                onClick={() => {
                  if (!isDone) handlePickBack(slot);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDone
                    ? `${color}1F`
                    : "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDone
                    ? `${color}14`
                    : "#fff";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    {backLang !== "pt" && s?.portuguese && (
                      <button
                        style={audioButtonStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          readText(s.portuguese, true, backLang, selectedVoice);
                        }}
                        title="Ouvir definição"
                      >
                        <i className="fa fa-volume-up" aria-hidden="true" />
                      </button>
                    )}
                    <div style={{ marginLeft: 4 }}>
                      <div
                        style={{
                          color: "#4b5563",
                          fontStyle: "italic",
                          fontSize: "13px",
                          wordBreak: "break-word",
                          fontFamily: "Plus Jakarta Sans",
                        }}
                      >
                        {s.portuguese}
                      </div>
                    </div>
                  </span>
                  {isDone && <span style={checkTagStyle}>✔</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {done && (
        <div style={finishedRowStyle}>
          <span>✅ {L.finished}</span>
          <span>{L.plusPoints}</span>
        </div>
      )}
    </div>
  );
}
