import React, { useMemo, useState } from "react";
import { readText, notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { newArvinTitleStyle } from "../../../ArvinComponents/SearchMaterials/SearchMaterials";
import { backDomain } from "../../../../Resources/UniversalComponents";
import axios from "axios";
import ReactDOM from "react-dom";

export type SentenceItem = {
  english: string;
  portuguese: string;
  languages?: {
    language1?: string; // frente
    language2?: string; // trás
  };
};

type Props = {
  sentences: SentenceItem[] | any;
  labels?: Partial<typeof defaultLabels>;
  studentId?: string;
  selectedVoice?: string;
  courseId?: string;
  language?: string; // mantido por compatibilidade, mas agora priorizamos languages.language1/2
  exerciseScore: (points: number, label?: string) => void;
};

export const defaultLabels = {
  title: "Match de Vocabulário",
  of: "de",
  restart: "Reiniciar",
  selectLeftFirst: "Selecione primeiro um item da coluna da esquerda.",
  correct: "✔ Par correto!",
  wrong: "❌ Não é o par correspondente.",
  finished: "Você concluiu todos os pares! 🎉",
  plusPoints:
    "Pontuação: 3 / 2 / 1 pontos por acerto (diminuindo por tentativas)",
};

function shuffle<T>(arr: T[]): T[] {
  const a = (arr || []).slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// mesmas cores usadas no outro componente para vincular frente/back
const pairColors = [
  "#4dabf7",
  "#51cf66",
  "#ffa94d",
  "#000000",
  "#845ef7",
  "#008cffff",
  "#753951",
  "#ff00aaff",
  "#7c542cff",
  "#926060ff",
  "#71b0d8ff",
  "#228be6",
  "#495057",
  "#5c7cfa",
  "#37b24d",
];

// ==== ESTILOS NO CLIMA DO CALENDÁRIO / ARVIN ====

const cardContainerStyle: React.CSSProperties = {
  width: "90%",
  margin: "0 auto",
  paddingTop: 16,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
  gap: 12,
};

const headerRightStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "Plus Jakarta Sans",
  fontSize: 12,
  color: "#4B5563",
};

const restartButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 600,
  border: "1px solid #E5E7EB",
  fontFamily: "Plus Jakarta Sans",
  fontSize: 11,
};

const gridWrapperStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const columnStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const baseCardStyle: React.CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  padding: "10px 12px",
  position: "relative",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  minHeight: "40px",
  display: "flex",
  flexDirection: "column",
  background: "#FFFFFF",
  justifyContent: "flex-start",
  cursor: "pointer",
  transition:
    "background 0.15s ease, transform 0.08s ease, box-shadow 0.1s ease, border-color 0.12s ease",
};

const selectedStyle: React.CSSProperties = {
  outline: "2px solid #111827",
  outlineOffset: 1,
};

const audioButtonStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: 999,
  background: "#F3F4F6",
  border: "1px solid #D1D5DB",
  cursor: "pointer",
  fontSize: 12,
  minWidth: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const checkTagStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#16A34A",
  fontWeight: 600,
  fontFamily: "Plus Jakarta Sans",
};

const finishedRowStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 13,
  fontWeight: 600,
  color: "#065F46",
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "space-between",
  fontFamily: "Plus Jakarta Sans",
};

// ==== COMPONENTES DE APOIO ====

function HeaderBar({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={headerBarStyle}>
      <h1
        style={{
          ...newArvinTitleStyle,
          fontSize: 18,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {title}
      </h1>
      <div style={headerRightStyle}>{right}</div>
    </div>
  );
}

// ==== COMPONENTE PRINCIPAL ====

const BATCH_SIZE = 5;

export default function VocabularyMatchExercise({
  sentences,
  labels,
  studentId,
  selectedVoice,
  courseId,
  language, // mantido caso alguma chamada ainda use
  exerciseScore,
}: Props) {
  const L = { ...defaultLabels, ...(labels || {}) };

  const pool = useMemo(
    () =>
      Array.isArray(sentences)
        ? sentences.filter((s) => s?.english?.trim() && s?.portuguese?.trim())
        : [],
    [sentences]
  );

  // "seed" para reembaralhar (dentro do lote)
  const [seed, setSeed] = useState(0);
  // início do lote atual de até 5 itens
  const [batchStart, setBatchStart] = useState(0);

  // índice REAL no pool atualmente selecionado na coluna da esquerda
  const [selectedFront, setSelectedFront] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());

  // tentativas por card (index do pool)
  const [attempts, setAttempts] = useState<Record<number, number>>({});

  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // NOVO
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const handleScoreStamp = async (
    pointsToSend: number,
    descriptionToSend: string
  ) => {
    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      await axios.put(`${backDomain}/api/v1/exercise-done/${courseId}`, {
        type: "vocabulary",
        points: pointsToSend,
        student: studentId,
        description: descriptionToSend,
        studentName,
      });
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  // Índices do pool visíveis no exercício atual (no máx. BATCH_SIZE)
  const visibleIndices = useMemo(() => {
    const len = pool.length;
    if (len === 0) return [];

    // todos os índices possíveis no pool
    const allIndices = pool.map((_, i) => i);

    // se tiver menos de 5 no total, não tem como inventar mais:
    // usa todos (comportamento antigo)
    if (len <= BATCH_SIZE) {
      return allIndices;
    }

    // fatia principal (como antes)
    const end = Math.min(batchStart + BATCH_SIZE, len);
    const base: number[] = [];
    for (let i = batchStart; i < end; i++) {
      base.push(i);
    }

    // se já temos 5, beleza
    if (base.length >= BATCH_SIZE) {
      return base;
    }

    // 👇 AQUI entra a correção:
    // faltam alguns para fechar 5 → completa com índices aleatórios
    // que NÃO estão em `base`.
    const need = BATCH_SIZE - base.length;
    const candidates = allIndices.filter((i) => !base.includes(i));

    // embaralha os candidatos e pega só o que falta
    const fillers = shuffle(candidates).slice(0, need);

    return [...base, ...fillers];
  }, [pool, batchStart]);

  // agora as DUAS colunas são embaralhadas, ambas baseadas nos índices visíveis do pool
  const frontOrder = useMemo(
    () => shuffle(visibleIndices),
    [visibleIndices, seed]
  );

  const backOrder = useMemo(
    () => shuffle(visibleIndices),
    [visibleIndices, seed]
  );

  const total = visibleIndices.length;
  const done = total > 0 && matched.size === total;

  function getLanguages(sentence: SentenceItem) {
    const languages = sentence?.languages || {};
    return {
      frontLang: languages.language1 || language || "en",
      backLang: languages.language2 || "pt",
    };
  }

  function reset() {
    // Próximo lote de até BATCH_SIZE itens
    setBatchStart((prev) => {
      const len = pool.length;
      if (len <= BATCH_SIZE) return 0;
      const next = prev + BATCH_SIZE;
      return next >= len ? 0 : next;
    });

    setSeed((v) => v + 1);
    setSelectedFront(null);
    setMatched(new Set());
    setAttempts({});
    setTotalPoints(0);
    setDescription("");
  }

  function handlePickFront(realIndex: number) {
    if (matched.has(realIndex)) return;
    setSelectedFront(realIndex);
  }

  function incrementAttemptsFor(index: number) {
    setAttempts((prev) => {
      const prevCount = prev[index] ?? 0;
      return { ...prev, [index]: prevCount + 1 };
    });
  }

  function getPointsForCard(cardIndex: number): number {
    const tries = attempts[cardIndex] ?? 0;
    // tries = quantos erros já teve ANTES do acerto
    if (tries === 0) return 3; // acertou de primeira
    if (tries === 1) return 2; // acertou na 2ª tentativa
    if (tries === 2) return 1; // acertou na 3ª
    return 0; // depois disso não pontua
  }

  function buildPerformanceDescriptionOnHit(
    sentence: SentenceItem,
    cardIndex: number,
    points: number
  ) {
    const tries = attempts[cardIndex] ?? 0;

    let attemptText = "";
    if (tries === 0) attemptText = "acertou de primeira";
    else if (tries === 1) attemptText = "acertou na segunda tentativa";
    else if (tries === 2) attemptText = "acertou na terceira tentativa";
    else attemptText = "acertou após várias tentativas";

    let pointsText =
      points === 0
        ? "e não ganhou pontos"
        : points === 1
        ? "e ganhou 1 ponto"
        : `e ganhou ${points} pontos`;

    const base = `◾Par "${sentence.english} ⇄ ${sentence.portuguese}": ${attemptText} ${pointsText}.◾`;

    setDescription((prev) => (prev ? `${prev} ${base}` : base));
  }

  function buildPerformanceDescriptionOnError(
    frontIndex: number,
    backIndex: number
  ) {
    const front = pool[frontIndex];
    const back = pool[backIndex];
    const base = `Errou o par entre "${front?.english}" e "${back?.portuguese}".`;
    setDescription((prev) => (prev ? `${prev} ${base}` : base));
  }

  function handlePickBack(slot: number) {
    const realIndex = backOrder[slot];

    if (matched.has(realIndex)) return;

    if (selectedFront === null) {
      notifyAlert(L.selectLeftFirst, "orange");
      return;
    }

    if (selectedFront === realIndex) {
      // ✅ ACERTOU
      const sentence = pool[realIndex];
      const points = getPointsForCard(realIndex);

      // calcula nova descrição e novos pontos (sincronizados)
      let newDescription = "";
      let newTotalPoints = totalPoints;

      buildPerformanceDescriptionOnHit(sentence, realIndex, points);

      // como setDescription é assíncrono, montamos também localmente:
      const tries = attempts[realIndex] ?? 0;
      let attemptText = "";
      if (tries === 0) attemptText = "acertou de primeira";
      else if (tries === 1) attemptText = "acertou na segunda tentativa";
      else if (tries === 2) attemptText = "acertou na terceira tentativa";
      else attemptText = "acertou após várias tentativas";

      let pointsText =
        points === 0
          ? "e não ganhou pontos"
          : points === 1
          ? "e ganhou 1 ponto"
          : `e ganhou ${points} pontos`;

      const baseSnippet = `Par "${sentence.english} ⇄ ${sentence.portuguese}": ${attemptText} ${pointsText}.`;

      newDescription = description
        ? `${description} ${baseSnippet}`
        : baseSnippet;

      if (points > 0) {
        newTotalPoints = totalPoints + points;
        setTotalPoints(newTotalPoints);
      }

      // atualiza matched
      const nextMatched = new Set(matched);
      nextMatched.add(realIndex);
      setMatched(nextMatched);
      setSelectedFront(null);

      try {
        const frontText = sentence?.english || "";
        const backText = sentence?.portuguese || "";
        const desc = `Match Vocabulary: ${frontText} ⇄ ${backText} (+${points} pts)`;

        if (points > 0) {
          exerciseScore?.(points, desc);
        }
      } catch (e) {
        console.error("Erro ao registrar pontuação do match:", e);
      }

      // ✅ se terminou TODOS os pares visíveis, chama handleScoreStamp
      const totalVisible = visibleIndices.length;
      if (totalVisible > 0 && nextMatched.size === totalVisible) {
        handleScoreStamp(newTotalPoints, newDescription);
      }
    } else {
      // ❌ ERROU – conta uma tentativa para o card selecionado
      if (selectedFront !== null && !matched.has(selectedFront)) {
        buildPerformanceDescriptionOnError(selectedFront, realIndex);
        incrementAttemptsFor(selectedFront);
      }
      notifyAlert(L.wrong, "red");
      setSelectedFront(null);
    }
  }

  return (
    <div style={cardContainerStyle}>
      <HeaderBar title={L.title} right={<></>} />

      {/* layout duas colunas */}
      {!done && (
        <div style={gridWrapperStyle}>
          {/* LEFT: fronts (áudio, com highlight de par) */}
          <div style={columnStyle}>
            {frontOrder.map((realIndex, frontSlot) => {
              const s = pool[realIndex];
              const isSelected = selectedFront === realIndex;
              const isDone = matched.has(realIndex);
              const color = pairColors[realIndex % pairColors.length];
              const { frontLang } = getLanguages(s);

              return (
                <div
                  key={`front-${frontSlot}`}
                  style={{
                    ...baseCardStyle,
                    border: `2px solid ${isDone ? color : "#E5E7EB"}`,
                    ...(isSelected ? selectedStyle : {}),
                    ...(isDone ? { backgroundColor: `${color}14` } : {}),
                  }}
                  onClick={() => {
                    handlePickFront(realIndex);
                    readText(s.english, true, frontLang, selectedVoice);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDone
                      ? `${color}1F`
                      : "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDone
                      ? `${color}14`
                      : "#FFFFFF";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </span>
                    {isDone && <span style={checkTagStyle}>✔</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: backs embaralhados (texto + áudio se idioma != pt) */}
          <div style={columnStyle}>
            {backOrder.map((realIndex, slot) => {
              const s = pool[realIndex];
              const isDone = matched.has(realIndex);
              const color = pairColors[realIndex % pairColors.length];
              const { backLang } = getLanguages(s);

              return (
                <div
                  key={`back-${slot}`}
                  style={{
                    ...baseCardStyle,
                    border: `2px solid ${isDone ? color : "#E5E7EB"}`,
                    ...(isDone ? { backgroundColor: `${color}14` } : {}),
                  }}
                  onClick={() => {
                    if (!isDone) handlePickBack(slot);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDone
                      ? `${color}1F`
                      : "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDone
                      ? `${color}14`
                      : "#FFFFFF";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {backLang !== "pt" && s?.portuguese && (
                        <button
                          style={audioButtonStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            readText(
                              s.portuguese,
                              true,
                              backLang,
                              selectedVoice
                            );
                          }}
                          title="Ouvir definição"
                        >
                          <i className="fa fa-volume-up" aria-hidden="true" />
                        </button>
                      )}
                      <div style={{ marginLeft: 4 }}>
                        <div
                          style={{
                            color: "#4B5563",
                            fontStyle: "italic",
                            fontSize: 13,
                            wordBreak: "break-word",
                            fontFamily: "Plus Jakarta Sans",
                          }}
                        >
                          {s.portuguese}
                        </div>
                      </div>
                    </span>
                    {isDone && <span style={checkTagStyle}>✔</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {done && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              style={restartButtonStyle}
              onClick={() => setShowPerformanceModal(true)}
              title="Ver detalhes da performance"
            >
              Ver performance
            </button>

            <button
              onClick={reset}
              style={restartButtonStyle}
              title={L.restart}
            >
              🔁 {L.restart}
            </button>
          </div>
          {/* Modal de performance */}
          {showPerformanceModal &&
            ReactDOM.createPortal(
              <>
                {/* Overlay */}
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.35)",
                    zIndex: 999,
                  }}
                  onClick={() => setShowPerformanceModal(false)}
                />

                {/* Caixa */}
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
                    maxWidth: "600px",
                    width: "90vw",
                    maxHeight: "70vh",
                    padding: 16,
                    zIndex: 1000,
                    fontFamily: "Plus Jakarta Sans",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: 16 }}>
                      Detalhes da performance
                    </h2>

                    <button
                      onClick={() => setShowPerformanceModal(false)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#374151",
                      whiteSpace: "pre-wrap",
                      overflowY: "auto",
                    }}
                  >
                    {description ||
                      "Seu desempenho foi registrado para este exercício de vocabulário."}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "#065F46",
                      fontWeight: 600,
                    }}
                  >
                    Total de pontos: {totalPoints}
                  </div>
                </div>
              </>,
              document.body
            )}
        </div>
      )}
    </div>
  );
}
