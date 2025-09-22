import React, { useEffect, useMemo, useState } from "react";
import { DictationExercise } from "./Exercises/DictationExercise";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { transparentBlack } from "../../../Styles/Styles";

/* ================= Tipos ================= */
type SentenceItem = { portuguese: string; english?: string };
type ImageItem = {
  img: string;
  text?: string;
  portuguese?: string;
  english?: string;
};

type ElementSentences = {
  type: "sentences";
  subtitle?: string;
  sentences: SentenceItem[];
  image?: string;
  grid?: number;
  order?: number;
};

type ElementImages = {
  type: "images";
  images: ImageItem[];
  subtitle?: string;
  order?: number;
};

type ElementDialogue = {
  type: "dialogue";
  dialogue: string[];
  subtitle?: string;
  order?: number;
};

type ElementExercise = {
  type: "exercise";
  items: string[];
  subtitle?: string;
  order?: number;
};

type ElementAudio = {
  type: "audiosoundtrack";
  src: string;
  link?: string;
  text?: string;
  subtitle?: string;
  order?: number;
};

type ElementItem =
  | ElementSentences
  | ElementImages
  | ElementDialogue
  | ElementExercise
  | ElementAudio;

type ExerciseRunnerProps = {
  elements?: ElementItem[];
  count?: number;
  display?: boolean;
  setDisplay?: any;
  dictationItems?: number;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
};

/* ================ Labels ================ */
export const defaultLabels = {
  exercise: "Exercício",
  of: "de",
  next: "Próximo",
  back: "Voltar",
  doneAll: "Você concluiu todos os exercícios! 🎉",
  play: "Ouvir",
  retry: "Ouvir de novo",
  yourAnswer: "Sua resposta",
  check: "Conferir",
  correctWords: "Palavras corretas",
  accuracy: "Precisão",
  showAnswer: "Mostrar gabarito",
  hideAnswer: "Ocultar gabarito",
  loadingSentences: "Não há frases disponíveis nesta aula.",
  noImages: "Não há imagens disponíveis nesta aula.",
  dictationTitle: "✍️ Ditado – escreva exatamente o que ouvir",
  imageToWordTitle: "🖼️ Imagem → Tradução",
  wordToImageTitle: "🔤 Palavra → Imagem",
  continue: "Continuar",
};

/* ================ Utils ================= */
export function shuffle<T>(arr: T[]): T[] {
  const a = (arr || []).slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeElements(el?: ElementItem[]): ElementItem[] {
  return Array.isArray(el) ? el : [];
}
function getAllSentences(elements?: ElementItem[]): SentenceItem[] {
  const list: SentenceItem[] = [];
  const els = safeElements(elements);
  for (const el of els) {
    if (
      (el as any)?.type === "sentences" &&
      Array.isArray((el as any).sentences)
    ) {
      for (const s of (el as ElementSentences).sentences) {
        if (s?.english?.trim()) list.push(s);
      }
    }
  }
  return list;
}
function getFirstImagesBlock(elements?: ElementItem[]): ImageItem[] {
  const els = safeElements(elements);
  const block = els.find((e) => (e as any)?.type === "images") as
    | ElementImages
    | undefined;
  return block?.images?.length ? block.images : [];
}
function optionLabel(img: ImageItem) {
  return img?.english || img?.english || img?.text || "";
}

/* ================ UI base ================ */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 672,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        background: "#fff",
        boxShadow: "0 8px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
export function HeaderBar({
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
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <div>{right}</div>
    </div>
  );
}
export function Pill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: active ? "#111827" : "#F3F4F6",
        color: active ? "#FFFFFF" : "#374151",
        border: active ? "1px solid #111827" : "1px solid #E5E7EB",
      }}
    >
      {children}
    </span>
  );
}

/* ===== Exercício 2 – Imagem → Tradução ===== */
function ImageToWordExercise({
  images,
  labels,
}: {
  images: ImageItem[];
  labels: typeof defaultLabels;
}) {
  const safeImgs = Array.isArray(images) ? images.filter((i) => i?.img) : [];
  if (!safeImgs.length)
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{labels.noImages}</div>
      </Card>
    );

  const pool = useMemo(() => shuffle(safeImgs), [safeImgs]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const current = pool[index];

  const options = useMemo(() => {
    const others = shuffle(pool.filter((img) => img !== current)).slice(0, 2);
    return shuffle([current, ...others]);
  }, [current, pool]);

  return (
    <Card>
      <HeaderBar
        title={labels.imageToWordTitle}
        right={
          <Pill>
            {index + 1} {labels.of} {pool.length}
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
          const isChosen = answered === i;
          const isCorrect = opt === current;
          const baseStyle: React.CSSProperties = {
            textAlign: "left",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            cursor: answered === null ? "pointer" : "default",
            background: "#FFFFFF",
            transition: "background 160ms ease, border-color 160ms ease",
          };
          if (answered === null) {
            baseStyle.background = "#FFFFFF";
          } else if (isChosen && isCorrect) {
            baseStyle.background = "#D1FAE5";
            baseStyle.border = "1px solid #34D399";
          } else if (isChosen && !isCorrect) {
            baseStyle.background = "#FEE2E2";
            baseStyle.border = "1px solid #FCA5A5";
          }
          return (
            <button
              key={i}
              onClick={() => setAnswered(i)}
              disabled={answered !== null}
              style={baseStyle}
            >
              {optionLabel(opt)}
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "end" }}>
          <button
            onClick={() => {
              setAnswered(null);
              setIndex((i) => (i + 1) % pool.length);
            }}
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
            {labels.next} ▶︎
          </button>
        </div>
      )}
    </Card>
  );
}

function WordToImageExercise({
  images,
  labels,
}: {
  images: ImageItem[];
  labels: typeof defaultLabels;
}) {
  const safeImgs = Array.isArray(images) ? images.filter((i) => i?.img) : [];
  if (!safeImgs.length)
    return (
      <Card>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{labels.noImages}</div>
      </Card>
    );

  const pool = useMemo(() => shuffle(safeImgs), [safeImgs]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const current = pool[index];

  const options = useMemo(() => {
    const others = shuffle(pool.filter((img) => img !== current)).slice(0, 2);
    return shuffle([current, ...others]);
  }, [current, pool]);

  return (
    <Card>
      <HeaderBar
        title={labels.wordToImageTitle}
        right={
          <Pill>
            {index + 1} {labels.of} {pool.length}
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
          const isChosen = answered === i;
          const isCorrect = opt === current;
          let borderColor = "#D1D5DB";
          if (answered !== null && isChosen) {
            borderColor = isCorrect ? "#10B981" : "#EF4444";
          }
          return (
            <button
              key={i}
              onClick={() => setAnswered(i)}
              disabled={answered !== null}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${borderColor}`,
                transition: "border-color 160ms ease",
                cursor: answered === null ? "pointer" : "default",
                background: "#FFFFFF",
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

      {answered !== null && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "end" }}>
          <button
            onClick={() => {
              setAnswered(null);
              setIndex((i) => (i + 1) % pool.length);
            }}
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
            {labels.next} ▶︎
          </button>
        </div>
      )}
    </Card>
  );
}

/* ================ Catálogo ================= */
type CatalogCtx = {
  elements?: ElementItem[];
  labels: typeof defaultLabels;
  dictationItems: number;
};
type ExerciseEntry = {
  key: string;
  render: (ctx: CatalogCtx) => React.ReactNode | null;
};

/* =============== Runner =============== */
export default function ExerciseRunner({
  elements = [],
  count = 3,
  dictationItems = 5,
  labels: labelsProp,
  studentId,
  display,
  setDisplay,
  headers,
  selectedVoice,
}: ExerciseRunnerProps) {
  const exerciseCatalog: ExerciseEntry[] = [
    {
      key: "dictation_from_sentences",
      render: ({ elements, labels, dictationItems }) => {
        const sentences = getAllSentences(elements);
        if (!sentences.length) return null;
        return (
          <DictationExercise
            studentId={studentId}
            headers={headers}
            selectedVoice={selectedVoice}
            sentences={sentences}
            itemsCount={dictationItems}
            labels={labels}
          />
        );
      },
    },
    // {
    //   key: "images_to_word",
    //   render: ({ elements, labels }) => {
    //     const imgs = getFirstImagesBlock(elements);
    //     if (!imgs.length) return null;
    //     return <ImageToWordExercise images={imgs} labels={labels} />;
    //   },
    // },
    // {
    //   key: "word_to_images",
    //   render: ({ elements, labels }) => {
    //     const imgs = getFirstImagesBlock(elements);
    //     if (!imgs.length) return null;
    //     return <WordToImageExercise images={imgs} labels={labels} />;
    //   },
    // },
  ];
  const labels = { ...defaultLabels, ...(labelsProp || {}) };
  const safeEls = safeElements(elements);

  const sentencesCount = getAllSentences(safeEls).length;
  const imagesCount = getFirstImagesBlock(safeEls).length;

  const eligible = exerciseCatalog.filter((e) => {
    if (e.key === "dictation_from_sentences") return sentencesCount > 0;
    if (e.key === "images_to_word" || e.key === "word_to_images")
      return imagesCount > 0;
    return true;
  });

  const forcedKey = sentencesCount > 0 ? "dictation_from_sentences" : null;
  const others = eligible.filter((e) => e.key !== forcedKey);

  const chosenKeys = useMemo(() => {
    if (!eligible.length) return [] as string[];
    const base: string[] = [];
    if (forcedKey) base.push(forcedKey);
    const needed = Math.max(0, count - base.length);
    const shuffledOthers = shuffle(others).map((e) => e.key);
    return [...base, ...shuffledOthers.slice(0, needed)];
  }, [count, eligible.length, sentencesCount, imagesCount]);

  const rendered = useMemo(
    () =>
      chosenKeys
        .map((k) => exerciseCatalog.find((e) => e.key === k))
        .filter(Boolean) as ExerciseEntry[],
    [chosenKeys]
  );

  const [index, setIndex] = useState(0);
  var theDisplay = display ? "flex" : "none";

  if (!rendered.length) {
    return (
      <Card>
        <HeaderBar title="Sem exercícios disponíveis" />
        <p style={{ color: "#4B5563", marginTop: 0 }}>
          Esta aula não possui conteúdo suficiente para gerar exercícios
          automáticos.
        </p>
        <ul
          style={{
            marginTop: 12,
            paddingLeft: 18,
            color: "#4B5563",
            fontSize: 14,
            listStyleType: "disc",
          }}
        >
          <li>
            Adicione pelo menos um bloco <code>sentences</code> para habilitar o
            ditado.
          </li>
          <li>
            Ou adicione um bloco <code>images</code> para habilitar os quizzes
            de imagem.
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <div
      style={{
        top: 10,
        left: "50%",
        width: "99vw",
        height: "97vh",
        transform: "translateX(-50%)",
        position: "fixed",
        display: theDisplay,
        backgroundColor: "white",
        borderRadius: "6px",
        zIndex: 100,
        padding: "1rem",
        boxShadow: "2px 2px 10px 5px #ddd",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          display: theDisplay,
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            cursor: "pointer",
          }}
          onClick={() => setDisplay(false)}
        >
          X
        </span>
        <div style={{ width: "100%", maxWidth: 672 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#4B5563",
              marginBottom: 8,
            }}
          >
            <span>
              {labels.exercise} {index + 1} {labels.of} {rendered.length}
            </span>
            <span style={{ display: "inline" }}>
              {(rendered[index]?.key || "").replace(/_/g, " ")}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "#F3F4F6",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 8,
                width: `${((index + 1) / rendered.length) * 100}%`,
                background: "#111827",
                transition: "width 240ms ease",
              }}
            />
          </div>
        </div>

        <div style={{ width: "100%" }}>
          {rendered[index]?.render({
            elements: safeEls,
            labels,
            dictationItems,
          })}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 672,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Botão Voltar (opcional) */}
          {/* <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            color: index === 0 ? "#9CA3AF" : "#111827",
            background: index === 0 ? "#F3F4F6" : "#E5E7EB",
            cursor: index === 0 ? "not-allowed" : "pointer",
            border: "1px solid #E5E7EB",
            fontWeight: 600,
          }}
        >
          ◀︎ {defaultLabels.back}
        </button> */}
          {index < rendered.length - 1 ? (
            <button
              onClick={() =>
                setIndex((i) => Math.min(rendered.length - 1, i + 1))
              }
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                color: "#FFFFFF",
                background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
                border: "1px solid #0B1220",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(17,24,39,0.25)",
                fontWeight: 700,
                marginLeft: "auto",
              }}
            >
              {labels.next} ▶︎
            </button>
          ) : (
            <span
              style={{
                fontSize: 14,
                color: "#065F46",
                fontWeight: 600,
                marginLeft: "auto",
              }}
            >
              {labels.doneAll}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
