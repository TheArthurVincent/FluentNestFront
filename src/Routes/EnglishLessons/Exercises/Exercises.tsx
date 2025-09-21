import React, { useEffect, useMemo, useState } from "react";
import { DictationExercise } from "./Exercises/DictationExercise";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";

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
  elements?: ElementItem[]; // <-- agora opcional
  count?: number;
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
      className={`w-full max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm p-5 ${className}`}
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
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg md:text-xl font-semibold tracking-tight">
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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        active ? "bg-black text-white" : "bg-gray-100 text-gray-700"
      }`}
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
        <div className="text-sm text-gray-500">{labels.noImages}</div>
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
      <div className="flex justify-center mb-4">
        <img
          src={current.img}
          alt="quiz"
          className="w-full max-w-md h-56 object-cover rounded-2xl border border-gray-200 shadow-sm"
          loading="lazy"
        />
      </div>

      <div className="grid gap-3">
        {options.map((opt, i) => {
          const isChosen = answered === i;
          const isCorrect = opt === current;
          const state =
            answered === null
              ? "bg-white hover:bg-gray-50"
              : isChosen
              ? isCorrect
                ? "bg-emerald-100 border-emerald-400"
                : "bg-rose-100 border-rose-400"
              : "bg-white";
          return (
            <button
              key={i}
              onClick={() => setAnswered(i)}
              disabled={answered !== null}
              className={`text-left px-4 py-3 rounded-xl border ${state}`}
            >
              {optionLabel(opt)}
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => {
              setAnswered(null);
              setIndex((i) => (i + 1) % pool.length);
            }}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            {labels.next} ▶︎
          </button>
        </div>
      )}
    </Card>
  );
}

/* ===== Exercício 3 – Palavra → Imagem ===== */
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
        <div className="text-sm text-gray-500">{labels.noImages}</div>
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
      <p className="text-center text-xl font-medium mb-4">
        {optionLabel(current)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt, i) => {
          const isChosen = answered === i;
          const isCorrect = opt === current;
          const border =
            answered === null
              ? "border-gray-300 hover:border-black"
              : isChosen
              ? isCorrect
                ? "border-emerald-500"
                : "border-rose-500"
              : "border-gray-300";

          return (
            <button
              key={i}
              onClick={() => setAnswered(i)}
              disabled={answered !== null}
              className={`rounded-2xl overflow-hidden border ${border} transition-colors`}
            >
              <img
                src={opt.img}
                alt="quiz"
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => {
              setAnswered(null);
              setIndex((i) => (i + 1) % pool.length);
            }}
            className="px-4 py-2 rounded-xl bg-black text-white"
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
  elements = [], // <-- fallback seguro
  count = 3,
  dictationItems = 5,
  labels: labelsProp,
  studentId,
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
    {
      key: "images_to_word",
      render: ({ elements, labels }) => {
        const imgs = getFirstImagesBlock(elements);
        if (!imgs.length) return null;
        return <ImageToWordExercise images={imgs} labels={labels} />;
      },
    },
    {
      key: "word_to_images",
      render: ({ elements, labels }) => {
        const imgs = getFirstImagesBlock(elements);
        if (!imgs.length) return null;
        return <WordToImageExercise images={imgs} labels={labels} />;
      },
    },
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
  }, [count, eligible.length, sentencesCount, imagesCount]); // deps seguras

  const rendered = useMemo(
    () =>
      chosenKeys
        .map((k) => exerciseCatalog.find((e) => e.key === k))
        .filter(Boolean) as ExerciseEntry[],
    [chosenKeys]
  );

  const [index, setIndex] = useState(0);

  if (!rendered.length) {
    return (
      <Card>
        <HeaderBar title="Sem exercícios disponíveis" />
        <p className="text-gray-600">
          Esta aula não possui conteúdo suficiente para gerar exercícios
          automáticos.
        </p>
        <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
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
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            {labels.exercise} {index + 1} {labels.of} {rendered.length}
          </span>
          <span className="hidden sm:inline">
            {(rendered[index]?.key || "").replace(/_/g, " ")}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-black transition-all"
            style={{ width: `${((index + 1) / rendered.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full">
        {rendered[index]?.render({ elements: safeEls, labels, dictationItems })}
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between">
        {/* <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={`px-4 py-2 rounded-xl ${index === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          ◀︎ {defaultLabels.back}
        </button> */}

        {index < rendered.length - 1 ? (
          <button
            onClick={() =>
              setIndex((i) => Math.min(rendered.length - 1, i + 1))
            }
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            {labels.next} ▶︎
          </button>
        ) : (
          <span className="text-sm text-emerald-700">{labels.doneAll}</span>
        )}
      </div>
    </div>
  );
}
