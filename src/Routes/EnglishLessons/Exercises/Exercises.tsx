import React, { useMemo, useState } from "react";
import axios from "axios";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";
import { DictationExercise } from "./Exercises/DictationExercise";
import WordToImageExercise from "./Exercises/WordToImageExercise";
import ImageToWordExercise from "./Exercises/ImageToWordExercise";
import { SelectExercise } from "./Exercises/SelectExercise";
import VocabularyMatchExercise from "./Exercises/VocabularyMatchExercise";
import { newArvinTitleStyle } from "../../ArvinComponents/SearchMaterials/SearchMaterials";
import { partnerColor } from "../../../Styles/Styles";
import { backDomain } from "../../../Resources/UniversalComponents";
import { LessonListeningExercise } from "./Exercises/ListenInEnglishExercise";

// ===================== TIPOS =====================

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

// tipo para exercícios já feitos
type ExerciseDoneItem = {
  date: string;
  description: string;
  points: number;
  studentID: string;
  studentName: string;
  type: string;
};

function safeElements(el?: ElementItem[]): ElementItem[] {
  return Array.isArray(el) ? el : [];
}

// ===================== HELPERS DE ELEMENTS =====================

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

// ===================== UI BÁSICA =====================

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

// ===================== TIPOS EXERCISERUNNER =====================

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
  exercisesDone?: ExerciseDoneItem[];
  dictationItems?: number;
  classId: string;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
  language?: string;

  // slot para editor do Board
  renderBoardEditor?: (params: {
    initialContent: string;
    onChange: (html: string) => void;
  }) => React.ReactNode;
  boardInitialContent?: string;
  onBoardChange?: (html: string) => void;
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

// formata a data do histórico
function formatExerciseDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// capitaliza o tipo (vocabulary -> Vocabulary)
function prettifyTypeLabel(type: string): string {
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// ===================== COMPONENTE PRINCIPAL =====================

export default function ExerciseRunner({
  elements = [],
  dictationItems = 10000,
  labels: labelsProp,
  studentId,
  exercisesDone,
  classId,
  exerciseScore = () => {},
  headers,
  selectedVoice,
  language,
  renderBoardEditor,
  boardInitialContent,
  onBoardChange,
}: ExerciseRunnerProps) {
  const labels = { ...defaultLabels, ...(labelsProp || {}) };
  const safeEls = safeElements(elements);

  // estado da lousa (Board)
  const [boardVisible, setBoardVisible] = useState(true);
  const [boardSubmitted, setBoardSubmitted] = useState(false);
  const [boardContent, setBoardContent] = useState(boardInitialContent || "");
  const [, setBoardSaving] = useState(false); // reservado para futuro
  const [boardFinishing, setBoardFinishing] = useState(false);

  // histórico agrupado por tipo
  const historyByType = useMemo(() => {
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { permissions, id } = logged || {};

    const isStudent = permissions === "student";

    const map: Record<string, ExerciseDoneItem[]> = {};

    (exercisesDone || []).forEach((item) => {
      // Se for estudante, só adiciona exercícios próprios
      if (isStudent && item.studentID !== id) return;

      const t = item.type || "outros";
      if (!map[t]) map[t] = [];
      map[t].push(item);
    });

    return map;
  }, [exercisesDone]);

  // blocos vocabulary
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

  const hasExerciseBlocks = exerciseElements.length > 0;

  // ===================== DITADO: limite controlado pelo PAI (máx 5 aqui) =====================

  const dictationSentences = useMemo(() => {
    if (!sentences.length) return [];
    const requested =
      typeof dictationItems === "number" && dictationItems > 0
        ? dictationItems
        : sentences.length;
    const limit = Math.min(requested, 5, sentences.length);
    return shuffle(sentences).slice(0, limit);
  }, [sentences, dictationItems]);

  // ===================== LISTENING: 5 frases da própria lição =====================

  const listeningSentences = useMemo(() => {
    if (!sentences.length) return [];
    const limit = Math.min(5, sentences.length);
    return shuffle(sentences).slice(0, limit);
  }, [sentences]);

  // ===================== CATÁLOGO DE EXERCÍCIOS =====================

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
          courseId={classId}
          selectedVoice={selectedVoice}
          language={language}
          studentId={studentId || ""}
          exerciseScore={exerciseScore}
        />
      ),
    })),

    // DITADO
    {
      key: `dictation_from_sentences_${dictationSentences.length}`,
      title: "Ditado",
      render: ({ labels, selectedVoice }) => {
        if (!dictationSentences.length) return null;
        return (
          <DictationExercise
            exerciseScore={exerciseScore}
            studentId={studentId || ""}
            selectedVoice={selectedVoice}
            language={language}
            sentences={dictationSentences}
            labels={labels}
            courseId={classId}
          />
        );
      },
    },

    // LISTENING A PARTIR DAS FRASES DA LIÇÃO (5 por vez, só inglês)
    {
      key: `lesson_listening_${listeningSentences.length}`,
      title: "Listening com frases desta lição",
      render: ({ labels, selectedVoice }: CatalogCtx) => {
        if (!listeningSentences.length) return null;
        return (
          <LessonListeningExercise
            sentences={listeningSentences}
            studentId={studentId || ""}
            courseId={classId}
            selectedVoice={selectedVoice}
            language={language}
            labels={labels}
            exerciseScore={exerciseScore}
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
            courseId={classId}
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
            studentId={studentId || ""}
            courseId={classId}
          />
        );
      },
    },

    // LISTEN IN ENGLISH – um exercício por bloco, reaproveitando o LessonListeningExercise
    ...listenInEnglishElements.map((listenElement, index) => ({
      key: `listen_${index}`,
      title: listenElement.subtitle || `Listen in English ${index + 1}`,
      render: ({ labels, selectedVoice }: CatalogCtx) => {
        // mapeia audios.enusAudio como "english" (texto para o listening)
        const mappedSentences: SentenceItem[] = listenElement.audios.map(
          (a) => ({
            english: a.enusAudio,
            portuguese: "",
          })
        );
        if (!mappedSentences.length) return null;
        return (
          <LessonListeningExercise
            exerciseScore={exerciseScore}
            sentences={mappedSentences}
            studentId={studentId || ""}
            courseId={classId}
            selectedVoice={selectedVoice}
            language={language}
            labels={labels}
          />
        );
      },
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
          courseId={classId}
        />
      ),
    })),
  ];

  const available = exerciseCatalog.filter((e) => {
    if (e.key.startsWith("dictation_from_sentences"))
      return dictationSentences.length > 0;

    // Listening: só mostra se for lição em inglês
    if (e.key.startsWith("lesson_listening"))
      return language === "en" && listeningSentences.length > 0;

    if (e.key.startsWith("listen_"))
      return language === "en" && listenInEnglishElements.length > 0;

    if (e.key === "images_to_word" || e.key === "word_to_images")
      return imgs.length > 0;

    if (e.key === "questions_unified") return exerciseElements.length > 0; // legado

    return true;
  });

  // ===================== AÇÕES DA BOARD =====================

  const handleBoardChange = (html: string) => {
    setBoardContent(html);
    onBoardChange && onBoardChange(html);
  };

  const handleBoardFinish = async () => {
    if (!studentId) return;

    if (!boardContent?.trim()) {
      return;
    }

    setBoardFinishing(true);
    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      const description = boardContent;

      await axios.put(`${backDomain}/api/v1/exercise-done/${classId}`, {
        type: "board",
        points: 0,
        student: studentId,
        description,
        studentName,
      });

      setBoardSubmitted(true);
      setBoardVisible(false);
    } catch (error) {
      console.error("Erro ao finalizar exercício de escrita:", error);
    } finally {
      setBoardFinishing(false);
    }
  };

  // ===================== SEM EXERCÍCIOS =====================

  if (!available.length) {
    return (
      <Card>
        <p style={{ color: "#4B5563", marginTop: 0 }}>
          Esta aula não possui exercícios automáticos.
        </p>
      </Card>
    );
  }

  // ===================== RENDER =====================

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

        {/* LISTA DE EXERCÍCIOS */}
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

        {/* BOTÃO PARA REABRIR BOARD QUANDO ESCONDIDA */}
        {hasExerciseBlocks && renderBoardEditor && !boardVisible && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setBoardVisible(true)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {boardSubmitted
                ? "🔁 Reabrir exercícios de escrita"
                : "📝 Mostrar exercícios de escrita"}
            </button>
            <div
              dangerouslySetInnerHTML={{
                __html: boardContent,
              }}
            />
          </div>
        )}

        {/* BOARD – só renderiza se houver bloco exercise, slot vier e estiver visível */}
        {hasExerciseBlocks && renderBoardEditor && boardVisible && (
          <div
            style={{
              marginTop: 8,
              width: "80%",
              borderTop: "1px solid #E5E7EB",
              paddingTop: 16,
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
              #{available.length + 1} Exercícios de Escrita
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={handleBoardFinish}
                disabled={boardFinishing || !studentId}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: boardFinishing ? "#9CA3AF" : partnerColor(),
                  color: "#FFFFFF",
                  cursor:
                    boardFinishing || !studentId ? "not-allowed" : "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {boardFinishing
                  ? "Enviando..."
                  : "Enviar exercícios de escrita"}
              </button>
            </div>
            <div style={{ marginTop: 8 }}>
              {renderBoardEditor({
                initialContent: boardInitialContent || "",
                onChange: handleBoardChange,
              })}
            </div>
          </div>
        )}

        {/* HISTÓRICO AGRUPADO POR TIPO */}
        {Object.keys(historyByType).length > 0 && (
          <div
            style={{
              padding: 6,
              borderRadius: 8,
            }}
          >
            <h2
              style={{
                ...newArvinTitleStyle,
                fontSize: 14,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Histórico de exercícios feitos nesta aula
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                color: "#374151",
              }}
            >
              {Object.entries(historyByType).map(([type, items]) => (
                <div key={type}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                      textTransform: "capitalize",
                    }}
                  >
                    {prettifyTypeLabel(type)}
                  </div>
                  <ul
                    style={{
                      fontSize: 10,
                      margin: 0,
                      marginTop: 10,
                      paddingLeft: 18,
                      listStyleType: "disc",
                    }}
                  >
                    {items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        <span
                          style={{
                            fontWeight: 500,
                            fontStyle: "12",
                            color: partnerColor(),
                            marginTop: 12,
                          }}
                        >
                          {item.studentName || "Aluno"}:
                        </span>{" "}
                        <span
                          style={{
                            color: partnerColor(),
                          }}
                        >
                          ({formatExerciseDate(item.date)})
                        </span>
                        {" -  "}
                        <span
                          style={{
                            fontWeight: 400,
                            fontStyle: "italic",
                          }}
                        >
                          {
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                          }{" "}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
