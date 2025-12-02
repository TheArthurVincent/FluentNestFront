import React, { useMemo } from "react";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";
import { DictationExercise } from "./Exercises/DictationExercise";
import WordToImageExercise from "./Exercises/WordToImageExercise";
import ImageToWordExercise from "./Exercises/ImageToWordExercise";
import { ListenInEnglishExercise } from "./Exercises/ListenInEnglishExercise";
import { SelectExercise } from "./Exercises/SelectExercise";
import VocabularyMatchExercise from "./Exercises/VocabularyMatchExercise";
import { newArvinTitleStyle } from "../../ArvinComponents/SearchMaterials/SearchMaterials";

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

type ElementVocabulary = {
  type: "vocabulary";
  subtitle?: string;
  sentences: { english: string; portuguese: string }[];
  image?: string;
  grid?: number;
  order?: number;
};

// union principal
type ElementItem =
  | ElementVocabulary
  | ElementSentences
  | ElementImages
  | ElementDialogue
  | ElementExercise
  | ElementAudio
  | ElementListenInEnglish
  | ElementSelectExercise;

function safeElements(el?: ElementItem[]): ElementItem[] {
  return Array.isArray(el) ? el : [];
}

// AGORA: em vez de juntar tudo, pegamos os blocos vocabulary separadamente
function getVocabularyElements(elements?: ElementItem[]): ElementVocabulary[] {
  const list: ElementVocabulary[] = [];
  const els = safeElements(elements);
  for (const el of els) {
    if (
      (el as any)?.type === "vocabulary" &&
      Array.isArray((el as ElementVocabulary).sentences) &&
      (el as ElementVocabulary).sentences.length > 0
    ) {
      list.push(el as ElementVocabulary);
    }
  }
  return list;
}

function getAllSentences(elements?: ElementItem[]): SentenceItem[] {
  const list: SentenceItem[] = [];
  const els = safeElements(elements);
  for (const el of els) {
    if (
      (el as any)?.type === "sentences" &&
      Array.isArray((el as ElementSentences).sentences)
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

function getListenInEnglishElements(
  elements?: ElementItem[]
): ElementListenInEnglish[] {
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

function getSelectExerciseElements(
  elements?: ElementItem[]
): ElementSelectExercise[] {
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

type ExerciseRunnerProps = {
  elements?: ElementItem[];
  count?: number;
  exerciseScore?: any;
  flag?: boolean;
  dictationItems?: number;
  classId: string;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
  language?: string;
};

export const defaultLabels = {
  exercise: "#",
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
  loadingSentences: "Não há mais frases disponíveis.",
  noImages: "Não há mais imagens disponíveis.",
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

export default function ExerciseRunner({
  elements = [],
  dictationItems = 10000,
  labels: labelsProp,
  studentId,
  classId,
  exerciseScore = () => {},
  headers,
  selectedVoice,
  language,
}: ExerciseRunnerProps) {
  const labels = { ...defaultLabels, ...(labelsProp || {}) };
  const safeEls = safeElements(elements);

  // AGORA: um bloco vocabulary por exercício
  const vocabularyElements = useMemo(
    () => getVocabularyElements(safeEls),
    [safeEls]
  );

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
    // VOCABULARY: um exercício por bloco vocabulary
    ...vocabularyElements.map((vocabEl, index) => ({
      key: `vocabulary_match_${index}`,
      title:
        vocabEl.subtitle ||
        (vocabularyElements.length > 1
          ? `Match de Vocabulário ${index + 1}`
          : "Match de Vocabulário"),
      render: () => (
        <VocabularyMatchExercise
          sentences={vocabEl.sentences}
          selectedVoice={selectedVoice}
          language={language}
          exerciseScore={exerciseScore}
        />
      ),
    })),

    // DITADO
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

    // IMAGEM -> PALAVRA
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

    // PALAVRA -> IMAGENS
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

    // LISTEN IN ENGLISH – um exercício por bloco
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

    // SELECT EXERCISE – um exercício por bloco
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
    if (e.key === "questions_unified") return exerciseElements.length > 0; // legado
    // vocabulary_match_*, listen_*, select_* já foram filtrados pela própria montagem
    return true;
  });

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
          <li>
            Ou adicione um bloco <code>vocabulary</code> para habilitar os
            matches de vocabulário.
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
          gap: 24,
        }}
      >
        <HeaderBar title="Exercícios desta aula" />

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {available.map((entry, index) => (
            <div
              key={entry.key}
              style={{
                borderTop: index === 0 ? "none" : "1px solid #E5E7EB",
                paddingTop: index === 0 ? 0 : 16,
              }}
            >
              <h1
                style={{
                  ...newArvinTitleStyle,
                  fontSize: 20,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                #{index + 1}
              </h1>

              {entry.render({
                elements: safeEls,
                labels,
                dictationItems,
                studentId,
                headers,
                selectedVoice,
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
