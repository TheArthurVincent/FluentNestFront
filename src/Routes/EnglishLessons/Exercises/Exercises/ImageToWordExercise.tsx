import React, { useMemo, useState } from "react";
import { readText } from "../../Assets/Functions/FunctionLessons";
import { HOne } from "../../../../Resources/Components/RouteBox";
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
}: {
  images: ImageItem[];
  labels?: Partial<Labels>;
  onNext?: () => void;
  language?: string;
  studentId?: string;
  selectedVoice?: string;
  exerciseScore: any;
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

  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);

  const [earnedPoints, setEarnedPoints] = useState(0); // opcional (acumula)

  const current = pool[index];

  // Validação adicional: verificar se a imagem atual tem label válido
  if (!current || !hasValidLabel(current)) {
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
    setEarnedPoints(0);
    setSeed((v) => v + 1); // força reembaralhar
  }

  const options = useMemo(() => {
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
  }, [index, pool, current]);

  const correctIdx = useMemo(
    () => options.findIndex((o) => o === current),
    [options, current]
  );

  // Validação final: verificar se todas as opções têm labels válidos
  const hasInvalidOptions = options.some((opt) => !hasValidLabel(opt));

  if (hasInvalidOptions) {
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

  function handleChoose(i: number, language?: string) {
    if (hasAnswered) return;
    const correct = i === correctIdx;
    setAnsweredIndex(i);
    readText(optionLabel(options[i]), true, language, selectedVoice);
    if (correct) setEarnedPoints((p) => p + 3);
    exerciseScore(
      correct ? 3 : 0,
      `Image to Word Exercise - ${optionLabel(current)}`
    );
  }

  function goNext() {
    setAnsweredIndex(null);
    if (index + 1 < pool.length) setIndex((i) => i + 1);
    else onNext?.();
  }

  return (
    <Card>
      <HeaderBar
        title={merged.imageToWordTitle}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>
              {index + 1} {merged.of} {pool.length}
            </span>
          </div>
        }
      />
      {hasAnswered && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "end" }}>
          <button
            onClick={goNext}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              color: "#FFFFFF",
              background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
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

      {index + 1 == pool.length ? (
        <button
          onClick={resetExercise}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            background: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
          }}
          title="Reiniciar exercício"
        >
          Reiniciar
        </button>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            {/* Imagem */}
            <div style={{ flex: "0 0 auto" }}>
              <img
                src={current.img}
                alt="quiz"
                loading="lazy"
                style={{
                  width: "200px",
                  height: "200px",
                  border: "1px solid #eee",
                  objectFit: "cover",
                  borderRadius: 6,
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
                let style: React.CSSProperties = {
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

                if (hasAnswered) {
                  if (i === correctIdx) {
                    style = {
                      ...style,
                      background: "#D1FAE5",
                      border: "2px solid #2dffb2ff",
                    };
                  }
                  if (i === answeredIndex && i !== correctIdx) {
                    style = {
                      ...style,
                      background: "#FEE2E2",
                      border: "2px solid #ff6969ff",
                    };
                  }
                }

                return (
                  index + 1 !== pool.length && (
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
                          ...style,
                          flex: 1,
                        }}
                      >
                        <span>{hasAnswered ? optionLabel(opt) : i + 1}</span>
                      </button>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </>
      )}

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
