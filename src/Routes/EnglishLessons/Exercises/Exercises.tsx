import React, { useMemo, useState } from "react";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";
import { DictationExercise } from "./Exercises/DictationExercise";
import WordToImageExercise from "./Exercises/WordToImageExercise";
import ImageToWordExercise from "./Exercises/ImageToWordExercise";
import { QuestionsExercise } from "./Exercises/Questions";
import { ListenInEnglishExercise } from "./Exercises/ListenInEnglishExercise";
import { SelectExercise } from "./Exercises/SelectExercise";

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

type ElementListenInEnglish = {
  type: "listinenglish";
  subtitle?: string;
  comments?: string;
  audios: { enusAudio: string }[];
  order?: number;
};

type ElementSelectExercise = {
  type: "selectexercise";
  subtitle?: string;
  options: {
    question: string;
    audio: string;
    options: {
      option: string;
      status: "right" | "wrong";
      reason?: string;
    }[];
    answer: string;
    studentsWhoDidIt: string[];
  }[];
  order?: number;
};

type ElementItem =
  | ElementSentences
  | ElementImages
  | ElementDialogue
  | ElementExercise
  | ElementAudio
  | ElementListenInEnglish
  | ElementSelectExercise;

type ExerciseRunnerProps = {
  elements?: ElementItem[];
  count?: number;
  exerciseScore?: any;
  flag?: boolean;
  dictationItems?: number;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
  language?: string;
};

export const defaultLabels = {
  exercise: "Exercício",
  of: "de",
  next: "Próximo",
  back: "Voltar",
  doneAll: "Você concluiu todos os exercícios! 🎉",
  play: "Ouvir",
  retry: "Ouvir de novo",
  yourAnswer:
    "Sua resposta (Para pontuar, você precisa acertar pelo menos 70% do texto.)",
  check: "Conferir",
  correctWords: "Palavras corretas",
  accuracy: "Precisão",
  showAnswer: "Mostrar gabarito",
  hideAnswer: "Ocultar gabarito",
  loadingSentences: "Não há frases disponíveis nesta aula.",
  noImages: "Não há imagens disponíveis nesta aula.",
  dictationTitle: "Ditado",
  imageToWordTitle: "Que imagem é essa?",
  wordToImageTitle: "Qual é a imagem correta?",
  continue: "Continuar",
};

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
  const list: ImageItem[] = [];
  const els = safeElements(elements);

  for (const el of els) {
    const t = (el as any)?.type;
    if (
      (t === "images" || t === "singleimages") &&
      Array.isArray((el as ElementImages).images)
    ) {
      for (const item of (el as ElementImages).images) {
        if (item?.img?.trim()) list.push(item);
      }
    }
  }
  return list;
}

function getExerciseElements(elements?: ElementItem[]): ElementExercise[] {
  const list: ElementExercise[] = [];
  const els = safeElements(elements);

  for (const el of els) {
    if (
      (el as any)?.type === "exercise" &&
      Array.isArray((el as ElementExercise).items) &&
      (el as ElementExercise).items.length > 0
    ) {
      list.push(el as ElementExercise);
    }
  }
  return list;
}

function getListenInEnglishElements(elements?: ElementItem[]): ElementListenInEnglish[] {
  const list: ElementListenInEnglish[] = [];
  const els = safeElements(elements);

  for (const el of els) {
    if (
      (el as any)?.type === "listinenglish" &&
      Array.isArray((el as ElementListenInEnglish).audios) &&
      (el as ElementListenInEnglish).audios.length > 0
    ) {
      list.push(el as ElementListenInEnglish);
    }
  }
  return list;
}

function getSelectExerciseElements(elements?: ElementItem[]): ElementSelectExercise[] {
  const list: ElementSelectExercise[] = [];
  const els = safeElements(elements);

  for (const el of els) {
    if (
      (el as any)?.type === "selectexercise" &&
      Array.isArray((el as ElementSelectExercise).options) &&
      (el as ElementSelectExercise).options.length > 0
    ) {
      list.push(el as ElementSelectExercise);
    }
  }
  return list;
}

export function Card({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        background: "#fff",
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

type CatalogCtx = {
  elements?: ElementItem[];
  labels: typeof defaultLabels;
  dictationItems: number;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
};
type ExerciseEntry = {
  key: string;

  title: string;
  render: (ctx: CatalogCtx) => React.ReactNode | null;
};

export default function ExerciseRunner({
  elements = [],
  dictationItems = 10000,
  labels: labelsProp,
  studentId,
  exerciseScore = () => {},
  headers,
  selectedVoice,
  language,
}: ExerciseRunnerProps) {
  const labels = { ...defaultLabels, ...(labelsProp || {}) };
  const safeEls = safeElements(elements);
  const sentences = useMemo(() => getAllSentences(safeEls), [safeEls]);
  const imgs = useMemo(() => getFirstImagesBlock(safeEls), [safeEls]);
  const exerciseElements = useMemo(
    () => getExerciseElements(safeEls),
    [safeEls]
  );
  const listenInEnglishElements = useMemo(
    () => getListenInEnglishElements(safeEls),
    [safeEls]
  );
  const selectExerciseElements = useMemo(
    () => getSelectExerciseElements(safeEls),
    [safeEls]
  );

  const exerciseCatalog: ExerciseEntry[] = [
    {
      key: "dictation_from_sentences",
      title: "Ditado",
      render: ({ labels, dictationItems, selectedVoice }) => {
        if (!sentences.length) return null;
        return (
          <DictationExercise
            exerciseScore={exerciseScore}
            studentId={studentId || ""}
            selectedVoice={selectedVoice}
            language={language}
            sentences={sentences}
            itemsCount={dictationItems}
            labels={labels}
          />
        );
      },
    },
    {
      key: "images_to_word",
      title: "Que imagem é essa?",
      render: ({ labels }) => {
        if (!imgs.length) return null;
        return (
          <ImageToWordExercise
            exerciseScore={exerciseScore}
            studentId={studentId || ""}
            images={imgs}
            labels={labels}
            selectedVoice={selectedVoice}
            language={language}
          />
        );
      },
    },
    {
      key: "word_to_images",
      title: "Qual é a imagem correta?",
      render: ({ labels }) => {
        if (!imgs.length) return null;
        return (
          <WordToImageExercise
            exerciseScore={exerciseScore}
            images={imgs}
            labels={labels}
          />
        );
      },
    },
    ...exerciseElements.map((exerciseElement, index) => ({
      key: `questions_${index}`,
      title: exerciseElement.subtitle || `Exercício ${index + 1}`,
      render: ({ labels }: CatalogCtx) => (
        <QuestionsExercise
          exercise={exerciseScore}
          exerciseElement={exerciseElement}
          studentId={studentId || ""}
          labels={labels}
        />
      ),
    })),
    ...listenInEnglishElements.map((listenElement, index) => ({
      key: `listen_${index}`,
      title: listenElement.subtitle || `Listen in English ${index + 1}`,
      render: ({ labels, selectedVoice }: CatalogCtx) => (
        <ListenInEnglishExercise
          exercise={exerciseScore}
          exerciseElement={listenElement}
          studentId={studentId || ""}
          labels={labels}
          selectedVoice={selectedVoice}
          language={language}
        />
      ),
    })),
    ...selectExerciseElements.map((selectElement, index) => ({
      key: `select_${index}`,
      title: selectElement.subtitle || `Select Exercise ${index + 1}`,
      render: ({ labels, selectedVoice }: CatalogCtx) => (
        <SelectExercise
          exercise={exerciseScore}
          exerciseElement={selectElement}
          studentId={studentId || ""}
          labels={labels}
          selectedVoice={selectedVoice}
          language={language}
        />
      ),
    })),
  ];

  const available = exerciseCatalog.filter((e) => {
    if (e.key === "dictation_from_sentences") return sentences.length > 0;
    if (e.key === "images_to_word" || e.key === "word_to_images")
      return imgs.length > 0;
    if (e.key.startsWith("questions_")) return true; // Exercícios individuais já foram filtrados na criação
    if (e.key.startsWith("listen_")) return true; // Exercícios de listening já foram filtrados na criação
    if (e.key.startsWith("select_")) return true; // Exercícios de seleção já foram filtrados na criação
    return true;
  });

  const [activeKey, setActiveKey] = useState<string>(available[0]?.key ?? "");
  const [restartTick, setRestartTick] = useState(0);

  const activeEntry = useMemo(
    () => available.find((e) => e.key === activeKey) || null,
    [available, activeKey]
  );

  if (!available.length) {
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
          <li>
            Ou adicione um bloco <code>exercise</code> para habilitar as
            perguntas.
          </li>
          <li>
            Ou adicione um bloco <code>listinenglish</code> para habilitar os
            exercícios de listening.
          </li>
          <li>
            Ou adicione um bloco <code>selectexercise</code> para habilitar os
            exercícios de seleção múltipla.
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        borderRadius: "4px",
        zIndex: 100,
        padding: "1rem",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {available.length > 1 && (
          <div style={{ width: "100%" }}>
            <HeaderBar title="Escolha o tipo de exercício" />
            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {available.map((entry) => {
                const isActive = entry.key === activeKey;
                return (
                  <button
                    key={entry.key}
                    onClick={() => {
                      setActiveKey(entry.key);
                      setRestartTick((t) => t + 1);
                    }}
                    style={{
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: 700,
                      border: isActive
                        ? "1px solid #111827"
                        : "1px solid #E5E7EB",
                      color: isActive ? "#FFFFFF" : "#111827",
                      background: isActive
                        ? "linear-gradient(180deg, #111827 0%, #0B1220 100%)"
                        : "#FFFFFF",
                      cursor: "pointer",
                    }}
                    title={entry.title}
                  >
                    {entry.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ width: "100%" }}>
          {activeEntry ? (
            <div key={activeKey + "_" + restartTick}>
              {activeEntry.render({
                elements: safeEls,
                labels,
                dictationItems,
                studentId,
                headers,
                selectedVoice,
              })}
            </div>
          ) : (
            <Card>
              <HeaderBar title="Sem modo válido selecionado" />
              <p style={{ color: "#4B5563", marginTop: 0 }}>
                Selecione um dos modos de exercício acima.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
