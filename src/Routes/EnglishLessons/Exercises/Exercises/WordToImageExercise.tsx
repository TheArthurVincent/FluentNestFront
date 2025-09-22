import React, { useMemo, useState } from "react";

/* ================= Tipos ================= */
export type ImageItem = {
  img: string;
  text?: string;
  portuguese?: string;
  english?: string;
};

export type Labels = typeof defaultLabels;

/* ================ Labels ================ */
export const defaultLabels = {
  wordToImageTitle: "🔤 Palavra → Imagem",
  of: "de",
  next: "Próximo",
  noImages: "Não há imagens disponíveis nesta aula.",
  plusPoints: "+3 pontos",
};

/* ================ Utils ================= */
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
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        background: "#fff",
        boxShadow: "0 8px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        boxSizing: "border-box",
        padding: 16,
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
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h2>
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
        borderRadius: 999,
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

/* ===== Exercício – Palavra → Imagem ===== */
export default function WordToImageExercise({
  images,
  labels,
  onNext,
}: {
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

  const pool = useMemo(() => shuffle(safeImgs.slice()), [safeImgs]);

  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const current = pool[index];

  const options = useMemo(() => {
    const others = shuffle(pool.filter((_, idx) => idx !== index)).slice(0, 2);
    return shuffle([current, ...others]);
  }, [index, pool]);

  const correctIdx = useMemo(
    () => options.findIndex((o) => o === current),
    [options, current]
  );

  const hasAnswered = answeredIndex !== null;
  const isCorrect = hasAnswered && answeredIndex === correctIdx;

  function handleChoose(i: number) {
    if (hasAnswered) return; // não processa duplo clique
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
          <Pill>
            {index + 1} {merged.of} {pool.length}
          </Pill>
        }
      />

      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        {optionLabel(current)}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {options.map((opt, i) => {
          let borderColor = "#D1D5DB";
          let ring: React.CSSProperties = {};

          if (hasAnswered) {
            if (i === correctIdx) {
              borderColor = "#10B981"; // verde
              ring = { boxShadow: "0 0 0 2px rgba(16,185,129,0.35)" };
            }
            if (i === answeredIndex && i !== correctIdx) {
              borderColor = "#EF4444"; // vermelho
              ring = { boxShadow: "0 0 0 2px rgba(239,68,68,0.35)" };
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleChoose(i)}
              disabled={hasAnswered}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${borderColor}`,
                transition: "border-color 160ms ease, box-shadow 160ms ease",
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
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Indicador de pontos somente ao acertar */}
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
      {hasAnswered && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 12,
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            fontSize: 14,
            color: "#111827",
          }}
        >
          <strong>Resposta certa: </strong>
          {optionLabel(current)}
        </div>
      )}

      {hasAnswered && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "end" }}>
          <button
            onClick={goNext}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              color: "#FFFFFF",
              background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
              border: "1px solid #0B1220",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(17,24,39,0.25)",
              fontWeight: 700,
            }}
          >
            {merged.next} ▶︎
          </button>
        </div>
      )}
    </Card>
  );
}
