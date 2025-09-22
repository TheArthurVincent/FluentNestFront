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
  imageToWordTitle: "🖼️ Imagem → Tradução",
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

/* ===== Exercício – Imagem → Tradução ===== */
export default function ImageToWordExercise({
  images,
  labels,
  onNext,
}: {
  images: ImageItem[];
  labels?: Partial<Labels>;
  onNext?: () => void;
}) {
  const merged = { ...defaultLabels, ...(labels || {}) };
  const safeImgs = Array.isArray(images) ? images.filter((i) => i?.img) : [];

  if (!safeImgs.length) {
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{merged.noImages}</div>
      </Card>
    );
  }

  // embaralha apenas uma vez por sessão do componente
  const pool = useMemo(() => shuffle(safeImgs), [safeImgs]);

  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0); // opcional (acumula)
  const current = pool[index];

  // opções fixas para a questão atual (não mudam após responder)
  const options = useMemo(() => {
    const others = shuffle(pool.filter((img) => img !== current)).slice(0, 2);
    return shuffle([current, ...others]);
  }, [current, pool]);

  const correctIdx = useMemo(
    () => options.findIndex((o) => o === current),
    [options, current]
  );

  const hasAnswered = answeredIndex !== null;
  const isCorrect = hasAnswered && answeredIndex === correctIdx;

  function handleChoose(i: number) {
    // Evita trocar de pergunta automaticamente: apenas marca a resposta e mostra feedback
    if (hasAnswered) return;
    setAnsweredIndex(i);

    // Marca pontos apenas se acertar
    if (i === correctIdx) {
      setEarnedPoints((p) => p + 3);
    }

    // Se você quiser avançar imediatamente ao clicar numa alternativa CORRETA,
    // descomente abaixo:
    // if (i === correctIdx) goNext();
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
          <Pill>
            {index + 1} {merged.of} {pool.length}
          </Pill>
        }
      />

      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
      >
        <img
          src={current.img}
          alt="quiz"
          loading="lazy"
          style={{
            width: "100%",
            maxWidth: 448,
            height: 224,
            objectFit: "cover",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {options.map((opt, i) => {
          // estilos de feedback:
          // - sempre destacar a CORRETA em verde quando já respondeu
          // - se clicada e errada, a clicada em vermelho
          let style: React.CSSProperties = {
            textAlign: "left",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            cursor: hasAnswered ? "default" : "pointer",
            background: "#FFFFFF",
            transition: "background 160ms ease, border-color 160ms ease",
          };

          if (hasAnswered) {
            if (i === correctIdx) {
              style = {
                ...style,
                background: "#D1FAE5",
                border: "1px solid #34D399",
              };
            }
            if (i === answeredIndex && i !== correctIdx) {
              style = {
                ...style,
                background: "#FEE2E2",
                border: "1px solid #FCA5A5",
              };
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleChoose(i)}
              disabled={hasAnswered}
              style={style}
            >
              {optionLabel(opt)}
            </button>
          );
        })}
      </div>

      {/* Indicador de pontos somente quando ACERTA */}
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
