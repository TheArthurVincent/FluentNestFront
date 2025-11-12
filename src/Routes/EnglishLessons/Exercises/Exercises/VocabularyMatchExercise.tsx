import React, { useMemo, useState } from "react";
import { readText } from "../../Assets/Functions/FunctionLessons";
import { HOne } from "../../../../Resources/Components/RouteBox";

export type SentenceItem = {
  english: string;
  portuguese: string;
  languages?: any;
};

type Props = {
  sentences: SentenceItem[] | any;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  selectedVoice?: string;
  language?: string;
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
  plusPoints: "+2 pontos por acerto",
};

function shuffle<T>(arr: T[]): T[] {
  const a = (arr || []).slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        borderRadius: 6,
        background: "#fff",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function HeaderBar({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <HOne
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </HOne>
      <div>{right}</div>
    </div>
  );
}

export default function VocabularyMatchExercise({
  sentences,
  labels,
  selectedVoice,
  language,
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
  const [scored, setScored] = useState(false); // evita pontuar mais de uma vez

  const shuffledIdx = useMemo(
    () => shuffle(pool.map((_, i) => i)),
    [pool, seed]
  );

  const total = pool.length;
  const done = matched.size === total;

  // estilos gerais (compatíveis com sua UI)
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e3e6ea",
    borderRadius: "4px",
    padding: "8px 12px 8px 12px",
    position: "relative",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    minHeight: "40px",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    justifyContent: "flex-start",
    cursor: "pointer",
  };
  const selectedStyle: React.CSSProperties = {
    outline: "2px solid #111827",
    outlineOffset: 2,
  };
  const matchedStyle: React.CSSProperties = {
    background: "#f0fff4",
    borderColor: "#86efac",
  };

  function reset() {
    setSeed((v) => v + 1);
    setSelectedFront(null);
    setMatched(new Set());
    setScored(false);
  }

  function handlePickFront(i: number) {
    if (matched.has(i)) return;
    setSelectedFront(i);
  }

  function handlePickBack(slot: number) {
    if (selectedFront === null) return;
    const realIndex = shuffledIdx[slot];
    if (matched.has(realIndex)) return;

    if (selectedFront === realIndex) {
      const next = new Set(matched);
      next.add(realIndex);
      setMatched(next);
      setSelectedFront(null);
    } else {
      // apenas feedback visual/console; aqui você pode disparar seu notify se quiser
      setSelectedFront(null);
    }
  }

  // pontua ao concluir
  if (done && !scored) {
    const points = total * 2; // 2 por palavra
    setScored(true);
    exerciseScore(points, "Vocabulary Match");
  }

  return (
    <Card>
      <HeaderBar
        title={L.title}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>
              {matched.size} {L.of} {total}
            </span>
            <button
              onClick={reset}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: "#FFFFFF",
                cursor: "pointer",
                fontWeight: 600,
                border: "1px solid #E5E7EB",
              }}
              title={L.restart}
            >
              {L.restart}
            </button>
          </div>
        }
      />

      {/* layout duas colunas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* LEFT: fronts (somente áudio, sem texto) */}
        <div style={{ display: "grid", gap: 10 }}>
          {pool.map((s, i) => {
            const isSelected = selectedFront === i;
            const isDone = matched.has(i);
            return (
              <div
                key={`front-${i}`}
                style={{
                  ...cardStyle,
                  ...(isSelected ? selectedStyle : {}),
                  ...(isDone ? matchedStyle : {}),
                }}
                onClick={() => handlePickFront(i)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDone
                    ? "#f0fff4"
                    : "#f3f3f3ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDone
                    ? "#f0fff4"
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        readText(s.english, true, language, selectedVoice);
                      }}
                      style={{
                        padding: "8px",
                        borderRadius: 4,
                        background: "#F3F4F6",
                        border: "1px solid #D1D5DB",
                        cursor: "pointer",
                        fontSize: "12px",
                        minWidth: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Ouvir"
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  </span>
                  {isDone && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      ✔
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: backs embaralhados (com texto em pt) */}
        <div style={{ display: "grid", gap: 10 }}>
          {shuffledIdx.map((realIndex, slot) => {
            const isDone = matched.has(realIndex);
            const s = pool[realIndex];
            return (
              <div
                key={`back-${slot}`}
                style={{
                  ...cardStyle,
                  ...(isDone ? matchedStyle : {}),
                }}
                onClick={() => {
                  if (!isDone) handlePickBack(slot);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDone
                    ? "#f0fff4"
                    : "#f3f3f3ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDone
                    ? "#f0fff4"
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
                    <div style={{ marginLeft: 10 }}>
                      <div
                        style={{
                          color: "#6c757d",
                          fontStyle: "italic",
                          fontSize: "13px",
                          wordBreak: "break-word",
                        }}
                      >
                        {s.portuguese}
                      </div>
                    </div>
                  </span>
                  {isDone && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      ✔
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {done && (
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            fontWeight: 700,
            color: "#065F46",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <span>✅ {L.finished}</span>
          <span>{L.plusPoints}</span>
        </div>
      )}
    </Card>
  );
}
