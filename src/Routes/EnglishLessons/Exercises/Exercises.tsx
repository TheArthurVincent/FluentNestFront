import React, { useMemo, useState } from "react";
import { DictationExercise } from "./Exercises/DictationExercise";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";
import WordToImageExercise from "./Exercises/WordToImageExercise";
import ImageToWordExercise from "./Exercises/ImageToWordExercise";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../Assets/Functions/FunctionLessons";

export const exerciseScore = async (
  score: number,
  studentId: string | undefined,
  headers: any,
  description: string
) => {
  try {
    await axios.put(
      `${backDomain}/api/v1/exercisereview/${studentId}`,
      {
        score,
        description,
        dayToday: new Date(),
      },
      { headers: headers || undefined }
    );
  } catch (error) {
    notifyAlert("Erro ao enviar cards");
  }
};

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
  /** não é mais usado para fluxo linear, mas mantido por compatibilidade */
  count?: number;
  display?: boolean;
  setDisplay?: (v: boolean) => void;
  dictationItems?: number;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
  language?: string;
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
  dictationTitle: "Ditado",
  imageToWordTitle: "Que imagem é essa?",
  wordToImageTitle: "Qual é a imagem correta?",
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

/* ================ UI base ================ */
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
        maxWidth: 672,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 6,
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

/* ================ Catálogo ================= */
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

/* =============== Runner =============== */
export default function ExerciseRunner({
  elements = [],
  dictationItems = 10000,
  labels: labelsProp,
  studentId,
  display = true,
  setDisplay = () => {},
  headers,
  selectedVoice,
  language,
}: ExerciseRunnerProps) {
  const labels = { ...defaultLabels, ...(labelsProp || {}) };
  const safeEls = safeElements(elements);

  const sentences = useMemo(() => getAllSentences(safeEls), [safeEls]);
  const imgs = useMemo(() => getFirstImagesBlock(safeEls), [safeEls]);

  const exerciseCatalog: ExerciseEntry[] = [
    {
      key: "dictation_from_sentences",
      title: "Ditado",
      render: ({ labels, dictationItems, selectedVoice }) => {
        if (!sentences.length) return null;
        return (
          <DictationExercise
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
        return <WordToImageExercise images={imgs} labels={labels} />;
      },
    },
  ];

  const available = useMemo(
    () =>
      exerciseCatalog.filter((e) => {
        if (e.key === "dictation_from_sentences") return sentences.length > 0;
        if (e.key === "images_to_word" || e.key === "word_to_images")
          return imgs.length > 0;
        return true;
      }),
    [sentences.length, imgs.length]
  );

  // modo selecionado (primeiro elegível por padrão)
  const [activeKey, setActiveKey] = useState<string>(available[0]?.key ?? "");
  // contador para "reiniciar" o exercício (remonta o componente)
  const [restartTick, setRestartTick] = useState(0);

  const activeEntry = useMemo(
    () => available.find((e) => e.key === activeKey) || null,
    [available, activeKey]
  );

  const theDisplay = display ? "flex" : "none";

  // Sem nada elegível
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
          aria-label="Fechar"
          role="button"
        >
          X
        </span>

        {/* Seletor de modo */}
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
                    setRestartTick((t) => t + 1); // reinicia ao trocar de modo
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

        {/* Render do exercício ativo */}
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

        {/* Rodapé – Reiniciar */}
        <div
          style={{
            width: "100%",
            maxWidth: 672,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {/* <button
            onClick={() => setRestartTick((t) => t + 1)}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              color: "#111827",
              background: "#E5E7EB",
              border: "1px solid #D1D5DB",
              cursor: "pointer",
              fontWeight: 700,
            }}
            title="Reiniciar o exercício atual"
          >
            Reiniciar
          </button> */}
        </div>
      </div>
    </div>
  );
}
