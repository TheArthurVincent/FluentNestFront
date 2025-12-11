import React, { useMemo, useState } from "react";
import axios from "axios";
import { HTwo } from "../../../../Resources/Components/RouteBox";
import { backDomain } from "../../../../Resources/UniversalComponents";

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
  studentId,
  courseId,
}: {
  exerciseScore: (points: number, label?: string) => void;
  images: ImageItem[];
  labels?: Partial<Labels>;
  onNext?: () => void;
  studentId?: string;
  courseId?: string; // id da aula para /exercise-done/:id
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

  // resumo final
  const [totalPoints, setTotalPoints] = useState(0);
  const [performanceDescription, setPerformanceDescription] = useState("");

  const pool = useMemo(() => shuffle(safeImgs.slice()), [safeImgs, seed]);

  const finished = index >= pool.length;
  const current = !finished ? pool[index] : null;

  function resetExercise() {
    setIndex(0);
    setAnsweredIndex(null);
    setSeed((v) => v + 1);
    setTotalPoints(0);
    setPerformanceDescription("");
  }

  const options = useMemo(() => {
    if (finished || !current) return [];

    const others = shuffle(pool.filter((_, idx) => idx !== index)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [index, pool, current, finished]);

  const correctIdx = useMemo(
    () => (finished ? -1 : options.findIndex((o) => o === current)),
    [options, current, finished]
  );

  const hasAnswered = answeredIndex !== null;
  const isCorrect = hasAnswered && answeredIndex === correctIdx;

  async function handleScoreStamp(
    pointsToSend: number,
    descriptionToSend: string
  ) {
    if (!courseId || !studentId) return;

    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      await axios.put(`${backDomain}/api/v1/exercise-done/${courseId}`, {
        type: "images", // mesmo tipo usado no outro exercício de imagens
        points: pointsToSend,
        student: studentId,
        description: descriptionToSend,
        studentName,
      });
    } catch (error) {
      console.log(error, "Erro ao atualizar dados (word-to-image)");
    }
  }

  function handleChoose(i: number) {
    if (hasAnswered || finished || !current) return;
    setAnsweredIndex(i);
    // score + descrição são calculados em goNext, como nos outros exercícios
  }

  async function goNext() {
    if (!hasAnswered || finished || !current) return;

    const label = optionLabel(current);
    const correct = answeredIndex === correctIdx;
    const increment = correct ? 3 : 0;

    const snippet = correct
      ? `Palavra "${label}": acertou e ganhou 3 pontos.`
      : `Palavra "${label}": errou e não ganhou pontos.`;

    const newDescription = performanceDescription
      ? `${performanceDescription} ${snippet}`
      : snippet;

    const newTotal = totalPoints + increment;

    setPerformanceDescription(newDescription);
    setTotalPoints(newTotal);

    // callback para ranking/score em tempo real
    exerciseScore(increment, `Word to Image - ${label}`);

    const isLast = index === pool.length - 1;

    if (isLast) {
      // terminou o exercício: registra no backend e mostra resumo
      await handleScoreStamp(newTotal, newDescription);
      setIndex(pool.length); // força finished === true
      setAnsweredIndex(null);
      return;
    }

    // ainda há imagens restantes
    setAnsweredIndex(null);
    setIndex((i) => i + 1);
  }

  const progressText = finished
    ? `${pool.length} ${merged.of} ${pool.length}`
    : `${index + 1} ${merged.of} ${pool.length}`;

  return (
    <Card>
      <HeaderBar
        title={merged.wordToImageTitle}
        right={<span>{progressText}</span>}
      />

      {/* ESTADO FINALIZADO: resumo + reiniciar */}
      {finished ? (
        <div
          style={{
            marginTop: 16,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            padding: 16,
            background: "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#065F46",
            }}
          >
            ✅ Você concluiu o exercício Palavra → Imagem!
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#374151",
              whiteSpace: "pre-wrap",
            }}
          >
            {performanceDescription ||
              "Seu desempenho foi registrado para este exercício de imagens."}
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Total de pontos: {totalPoints}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              onClick={resetExercise}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              🔁 Reiniciar exercício
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
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
            <span>{optionLabel(current!)}</span>
            {hasAnswered && (
              <button
                onClick={goNext}
                style={{
                  padding: "8px",
                  fontSize: 10,
                  borderRadius: 6,
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
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
                  onClick={() => handleChoose(i)}
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
        </>
      )}
    </Card>
  );
}
