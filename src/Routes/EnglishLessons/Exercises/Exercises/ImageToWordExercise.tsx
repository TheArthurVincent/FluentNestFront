import React, { useMemo, useState } from "react";
import axios from "axios";
import { readText } from "../../Assets/Functions/FunctionLessons";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { backDomain } from "../../../../Resources/UniversalComponents";

export type ImageItem = {
  img: string;
  text?: string;
  portuguese?: string;
  english?: string;
};

export type Labels = typeof defaultLabels;

export const defaultLabels = {
  imageToWordTitle: "Que imagem é essa?",
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
  const label = (img?.english || img?.portuguese || img?.text || "").trim();
  return label;
}

function hasValidLabel(img: ImageItem) {
  return optionLabel(img).length > 0;
}

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

export default function ImageToWordExercise({
  images,
  labels,
  onNext,
  studentId,
  selectedVoice,
  exerciseScore,
  language,
  courseId,
}: {
  images: ImageItem[];
  labels?: Partial<Labels>;
  onNext?: () => void;
  language?: string;
  studentId?: string;
  selectedVoice?: string;
  exerciseScore: (points: number, label?: string) => void;
  courseId?: string; // id da aula para /exercise-done/:id
}) {
  const merged = { ...defaultLabels, ...(labels || {}) };
  const safeImgs = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter((i) => i?.img && hasValidLabel(i))
        : [],
    [images]
  );

  if (!safeImgs.length) {
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{merged.noImages}</div>
      </Card>
    );
  }

  // Verificar se temos pelo menos 3 imagens para fazer um exercício válido
  if (safeImgs.length < 3) {
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Necessário pelo menos 3 imagens com texto válido para este exercício.
        </div>
      </Card>
    );
  }

  const [seed, setSeed] = useState(0);
  const pool = useMemo(() => shuffle(safeImgs.slice()), [safeImgs, seed]);

  // index == posição atual; quando index >= pool.length => exercício finalizado
  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);

  const [totalPoints, setTotalPoints] = useState(0);
  const [performanceDescription, setPerformanceDescription] = useState("");

  const finished = index >= pool.length;
  const current = !finished ? pool[index] : null;

  // Validação adicional: verificar se a imagem atual tem label válido
  if (!finished && (!current || !hasValidLabel(current))) {
    console.error(
      "ImageToWordExercise: Imagem atual sem texto válido",
      current
    );
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#EF4444" }}>
          Erro: Imagem sem texto válido detectada. Por favor, verifique os dados
          do exercício.
        </div>
      </Card>
    );
  }

  function resetExercise() {
    setIndex(0);
    setAnsweredIndex(null);
    setSeed((v) => v + 1); // força reembaralhar
    setTotalPoints(0);
    setPerformanceDescription("");
  }

  const options = useMemo(() => {
    if (finished || !current) return [];

    // Garantir que temos pelo menos 3 imagens válidas para fazer o exercício
    if (pool.length < 3) {
      console.warn(
        "ImageToWordExercise: Menos de 3 imagens válidas disponíveis"
      );
      return [current];
    }

    // Filtrar outras opções que tenham labels válidos e diferentes da atual
    const currentLabel = optionLabel(current);
    const others = shuffle(
      pool.filter((img, idx) => {
        const isNotCurrent = idx !== index;
        const hasDifferentLabel = optionLabel(img) !== currentLabel;
        const hasLabel = hasValidLabel(img);
        return isNotCurrent && hasDifferentLabel && hasLabel;
      })
    ).slice(0, 2);

    // Se não temos opções suficientes, adicionar mais da pool geral
    if (others.length < 2 && pool.length >= 3) {
      const remaining = pool.filter(
        (_, idx) => idx !== index && !others.includes(pool[idx])
      );
      others.push(...remaining.slice(0, 2 - others.length));
    }

    return shuffle([current, ...others]);
  }, [index, pool, current, finished]);

  const correctIdx = useMemo(
    () => (finished ? -1 : options.findIndex((o) => o === current)),
    [options, current, finished]
  );

  // Validação final: verificar se todas as opções têm labels válidos
  const hasInvalidOptions =
    !finished && options.some((opt) => !hasValidLabel(opt));

  if (!finished && hasInvalidOptions) {
    console.error(
      "ImageToWordExercise: Opções com labels inválidos detectadas",
      options
    );
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#EF4444" }}>
          Erro: Opções inválidas detectadas. Pulando para próximo exercício...
        </div>
        <button
          onClick={() => onNext?.()}
          style={{ marginTop: 10, padding: "8px 16px", borderRadius: 4 }}
        >
          Próximo
        </button>
      </Card>
    );
  }

  const hasAnswered = answeredIndex !== null;
  const isCorrect = hasAnswered && answeredIndex === correctIdx;

  async function handleScoreStamp(
    pointsToSend: number,
    descriptionToSend: string
  ) {
    if (!courseId || !studentId) return; // segurança básica

    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      await axios.put(`${backDomain}/api/v1/exercise-done/${courseId}`, {
        type: "images",
        points: pointsToSend,
        student: studentId,
        description: descriptionToSend,
        studentName,
      });
    } catch (error) {
      console.log(error, "Erro ao atualizar dados (image-to-word)");
    }
  }

  function handleChoose(i: number, lang?: string) {
    if (hasAnswered || finished || !current) return;

    setAnsweredIndex(i);
    readText(optionLabel(options[i]), true, lang, selectedVoice);
    // score/descrição agora são atualizados em goNext, não aqui
  }

  async function goNext() {
    if (!hasAnswered || finished || !current) return;

    const label = optionLabel(current);
    const correct = answeredIndex === correctIdx;
    const increment = correct ? 3 : 0;

    const snippet = correct
      ? `Imagem "${label}": acertou e ganhou 3 pontos.`
      : `Imagem "${label}": errou e não ganhou pontos.`;

    const newDescription = performanceDescription
      ? `${performanceDescription} ${snippet}`
      : snippet;

    const newTotal = totalPoints + increment;

    setPerformanceDescription(newDescription);
    setTotalPoints(newTotal);

    // callback para ranking/score em tempo real
    exerciseScore(increment, `Image to Word Exercise - ${label}`);

    const isLast = index === pool.length - 1;

    if (isLast) {
      // terminou o exercício: marca exercise-done e mostra tela de resumo
      await handleScoreStamp(newTotal, newDescription);
      setIndex(pool.length); // força finished === true
      setAnsweredIndex(null);
      return;
    }

    // ainda há próximas imagens
    setAnsweredIndex(null);
    setIndex((i) => i + 1);
  }

  const progressText = finished
    ? `${pool.length} ${merged.of} ${pool.length}`
    : `${index + 1} ${merged.of} ${pool.length}`;

  return (
    <Card>
      <HeaderBar
        title={merged.imageToWordTitle}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{progressText}</span>
          </div>
        }
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
            ✅ Você concluiu o exercício de imagens!
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
          {hasAnswered && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                onClick={goNext}
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
                  border: "1px solid #0B1220",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {merged.next} ▶︎
              </button>
            </div>
          )}

          {/* Layout principal: imagem à esquerda, botões à direita */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            {/* Imagem */}
            <div style={{ flex: "0 0 auto" }}>
              <img
                src={current!.img}
                alt="quiz"
                loading="lazy"
                style={{
                  width: "200px",
                  height: "200px",
                  border: "1px solid #eee",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingTop: 8,
              }}
            >
              {options.map((opt, i) => {
                const baseStyle: React.CSSProperties = {
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: 6,
                  cursor: hasAnswered ? "default" : "pointer",
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  transition: "background 160ms ease, border-color 160ms ease",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "44px",
                };

                let computedStyle = { ...baseStyle };

                if (hasAnswered) {
                  if (i === correctIdx) {
                    computedStyle = {
                      ...computedStyle,
                      background: "#D1FAE5",
                      border: "2px solid #2dffb2ff",
                    };
                  }
                  if (i === answeredIndex && i !== correctIdx) {
                    computedStyle = {
                      ...computedStyle,
                      background: "#FEE2E2",
                      border: "2px solid #ff6969ff",
                    };
                  }
                }

                return (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      onClick={() =>
                        readText(
                          optionLabel(opt),
                          true,
                          language,
                          selectedVoice
                        )
                      }
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
                    <button
                      onClick={() => {
                        handleChoose(i, language);
                      }}
                      disabled={hasAnswered}
                      style={{
                        ...computedStyle,
                        flex: 1,
                      }}
                    >
                      <span>{hasAnswered ? optionLabel(opt) : i + 1}</span>
                    </button>
                  </div>
                );
              })}
            </div>
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
