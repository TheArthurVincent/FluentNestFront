import React, { useMemo, useState } from "react";
import { HTwo } from "../../../../Resources/Components/RouteBox";

export type ImageItem = {
  img: string;
  text?: string;
  portuguese?: string;
  english?: string;
};

export type Labels = typeof defaultLabels;
export const defaultLabels = {
  wordToImageTitle: "🔤 Palavra → Imagem",
  of: "de",
  next: "Próximo",
  noImages: "Não há imagens disponíveis nesta aula.",
  plusPoints: "+3 pontos",
};

function shuffle<T>(arr: T[]): T[] {
  const a = (arr || []).slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function optionLabel(img: ImageItem) {
  return (img?.english || img?.portuguese || img?.text || "").trim();
}

/* ================ UI base mínima ================ */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 672,
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
      <HTwo
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </HTwo>
      <div>{right}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        background: "#F3F4F6",
        color: "#374151",
        border: "1px solid #E5E7EB",
      }}
    >
      {children}
    </span>
  );
}
export default function WordToImageExercise({
  images,
  exerciseScore,
  labels,
  onNext,
}: {
  exerciseScore: any;
  images: ImageItem[];
  labels?: Partial<Labels>;
  onNext?: () => void;
}) {
  const merged = { ...defaultLabels, ...(labels || {}) };
  const safeImgs = useMemo(
    () => (Array.isArray(images) ? images.filter((i) => i?.img) : []),
    [images]
  );
  if (!safeImgs.length) {
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{merged.noImages}</div>
      </Card>
    );
  }

  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const pool = useMemo(() => shuffle(safeImgs.slice()), [safeImgs, seed]);
  const current = pool[index];
  function resetExercise() {
    setIndex(0);
    setAnsweredIndex(null);
    setEarnedPoints(0);
    setSeed((v) => v + 1);
  }

  const options = useMemo(() => {
    const others = shuffle(pool.filter((_, idx) => idx !== index)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [index, pool]);

  const correctIdx = useMemo(
    () => options.findIndex((o) => o === current),
    [options, current]
  );

  const hasAnswered = answeredIndex !== null;
  const isCorrect = hasAnswered && answeredIndex === correctIdx;

  function handleChoose(i: number) {
    if (hasAnswered) return;
    setAnsweredIndex(i);

    if (i === correctIdx) {
      setEarnedPoints((p) => p + 3);
    }
  }

  function goNext() {
    setAnsweredIndex(null);
    if (index + 1 < pool.length) setIndex((i) => i + 1);
    else onNext?.();
  }

  return (
    <Card>
      <HeaderBar
        title={merged.wordToImageTitle}
        right={
          <span>
            {index + 1} {merged.of} {pool.length}
          </span>
        }
      />

      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 600,
          height: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          padding: "0 10px",
          backgroundColor: "#F9FAFB",
        }}
      >
        <span>{optionLabel(current)}</span>
        {hasAnswered && (
          <button
            onClick={goNext}
            style={{
              padding: "8px",
              fontSize: 10,
              borderRadius: 6,
              color: "#FFFFFF",
              background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
              border: "1px solid #0B1220",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(17,24,39,0.25)",
              maxHeight: 20,
            }}
          >
            {merged.next} ▶︎
          </button>
        )}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${4}, minmax(0, 1fr))`,
          gap: 10,
        }}
      >
        {index + 1 == pool.length ? (
          <button
            onClick={resetExercise}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              background: "#FFFFFF",
              border: "1px solid #D1D5DB",
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Reiniciar exercício"
          >
            Reiniciar
          </button>
        ) : (
          <>
            {" "}
            {options.map((opt, i) => {
              let borderColor = "#eee";
              let ring: React.CSSProperties = {};

              if (hasAnswered) {
                if (i === correctIdx) {
                  borderColor = "#10B981";
                  ring = { boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.78)" };
                }
                if (i === answeredIndex && i !== correctIdx) {
                  borderColor = "#EF4444";
                  ring = { boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.77)" };
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    handleChoose(i);
                    exerciseScore(
                      i === correctIdx ? 3 : 0,
                      `Word to image - ${optionLabel(current)}`
                    );
                  }}
                  disabled={hasAnswered}
                  style={{
                    overflow: "hidden",
                    border: `3px solid ${borderColor}`,
                    cursor: hasAnswered ? "default" : "pointer",
                    background: "#FFFFFF",
                    ...ring,
                  }}
                >
                  <img
                    src={opt.img}
                    alt="quiz"
                    loading="lazy"
                    style={{
                      width: "15vw",
                      height: "15vw",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </>
        )}
      </div>

      {hasAnswered && isCorrect && (
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            fontWeight: 700,
            color: "#065F46",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ✅ {merged.plusPoints}
        </div>
      )}
    </Card>
  );
}
