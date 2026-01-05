import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { defaultLabels, HeaderBar, shuffle } from "../Exercises";
import { backDomain } from "../../../../Resources/UniversalComponents";

// ===================== HELPERS =====================

function normalizeText(text: string): string {
  let t = (text || "").toLowerCase().normalize("NFKC");
  // mantém números com vírgula como decimal
  t = t
    .replace(/(?<=\d),(?=\d)/g, ".")
    // remove separadores de milhar
    .replace(/(?<=\d)[.\u202F\u00A0 ](?=\d{3}\b)/g, "")
    // hífens entre números viram espaço
    .replace(/(?<=\d)[\-–—](?=\d)/g, " ");
  // mantém letras (com acento), dígitos e espaços
  t = t.replace(/[^0-9a-záàâãäéèêíïîóôõöúüûçñ\s]/gi, " ");
  return t.replace(/\s+/g, " ").trim();
}

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1 || "";
  const s2 = str2 || "";
  const len1 = s1.length;
  const len2 = s2.length;
  const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[len1][len2];
}

function similarityPercentage(str1: string, str2: string): number {
  const clean1 = normalizeText(str1 || "");
  const clean2 = normalizeText(str2 || "");
  const maxLen = Math.max(clean1.length, clean2.length);
  if (maxLen === 0) return 100;
  const distance = levenshteinDistance(clean1, clean2);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

function tokenize(t: string) {
  const norm = normalizeText(t);
  return norm ? norm.split(" ") : [];
}

function countPositionMatches(target: string, attempt: string) {
  const gt = tokenize(target);
  const at = tokenize(attempt);
  const len = Math.max(gt.length, at.length);
  let matches = 0;
  const perWordCorrect: boolean[] = [];

  for (let i = 0; i < len; i++) {
    const ok = !!gt[i] && !!at[i] && gt[i] === at[i];
    perWordCorrect.push(ok);
    if (ok) matches++;
  }

  return {
    matches,
    total: gt.length,
    perWordCorrect,
    atTokens: at,
  };
}

type SentenceItem = { portuguese: string; english?: string };

function hasTTS(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    !!window.speechSynthesis
  );
}

// ===================== ESTILOS =====================

const cardContainerStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  marginTop: 16,
};

const mainWrapperStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const progressBarBgStyle: React.CSSProperties = {
  width: "100%",
  height: 8,
  background: "#F2F4F7",
  borderRadius: 999,
  overflow: "hidden",
  marginBottom: 16,
};

const metricsChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  fontSize: 12,
  fontFamily: "Plus Jakarta Sans",
};

const metricsWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  marginBottom: 8,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#111827",
  marginBottom: 8,
  fontFamily: "Plus Jakarta Sans",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #D1D5DB",
  padding: 10,
  outline: "none",
  boxSizing: "border-box",
  fontSize: 14,
  lineHeight: 1.5,
  fontFamily: "Plus Jakarta Sans",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 999,
  background: partnerColor(),
  color: "#FFFFFF",
  border: "none",
  cursor: "pointer",
  fontFamily: "Plus Jakarta Sans",
  fontSize: 13,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const ghostButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "#F3F4F6",
  color: "#111827",
  border: "1px solid #E5E7EB",
  cursor: "pointer",
  fontFamily: "Plus Jakarta Sans",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const finishedContinueTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#065F46",
  fontWeight: 600,
  fontFamily: "Plus Jakarta Sans",
};

// ===================== PROPS =====================

type DictationExerciseProps = {
  sentences: SentenceItem[];
  studentId?: string;
  labels: typeof defaultLabels;
  exerciseScore?: (points: number, desc?: string) => void;
  selectedVoice?: string;
  language?: string;
  courseId?: string;
};

// ===================== COMPONENTE =====================

export function DictationExercise({
  sentences,
  exerciseScore,
  labels,
  studentId,
  selectedVoice,
  language,
  courseId,
}: DictationExerciseProps) {
  // pool embaralhado
  const [seed, setSeed] = useState(0);
  const pool = useMemo(
    () => shuffle(sentences),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sentences, seed]
  );

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // performance geral
  const [totalPoints, setTotalPoints] = useState(0);
  const [performanceDescription, setPerformanceDescription] = useState("");

  // modal de performance
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const finished = index >= pool.length;

  const current = !finished ? pool[index] : null;
  const target = current?.english || "";
  const targetTr = current?.portuguese || "";

  // reset quando muda conjunto de frases
  useEffect(() => {
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setShowKey(false);
    setTotalPoints(0);
    setPerformanceDescription("");
    setShowPerformanceModal(false);
    setSeed((s) => s + 1);
    if (hasTTS()) window.speechSynthesis.cancel();
  }, [sentences.length]);

  // cleanup TTS
  useEffect(() => {
    return () => {
      if (hasTTS()) window.speechSynthesis.cancel();
    };
  }, []);

  if (!pool.length) {
    return (
      <div style={cardContainerStyle}>
        <HeaderBar title={labels.dictationTitle} />
        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: 12,
            color: "#6B7280",
          }}
        >
          {labels.loadingSentences}
        </div>
      </div>
    );
  }

  // ===================== exercise-done =====================

  const handleScoreStamp = async (
    pointsToSend: number,
    descriptionToSend: string
  ) => {
    if (!courseId || !studentId) return;

    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      await axios.put(`${backDomain}/api/v1/exercise-done/${courseId}`, {
        type: "sentences",
        points: pointsToSend,
        student: studentId,
        description: descriptionToSend,
        studentName,
      });
    } catch (error) {
      console.log(error, "Erro ao atualizar dados (dictation)");
    }
  };

  // ===================== MÉTRICAS (apenas em andamento) =====================

  const wordsExpected = finished ? 0 : wordCount(target);
  const wordsTyped = finished ? 0 : wordCount(answer);
  const similarity = finished ? 0 : similarityPercentage(target, answer);

  const { matches, total, perWordCorrect, atTokens } = finished
    ? {
        matches: 0,
        total: 0,
        perWordCorrect: [] as boolean[],
        atTokens: [] as string[],
      }
    : countPositionMatches(target, answer);

  // nota: se similaridade >= 70%, converte aproximando blocos de 20% em "pontos"
  const roundedSimilarity =
    !finished && similarity >= 70
      ? Math.floor(similarity / 20) * wordsExpected
      : 0;

  const progressPct = finished ? 100 : Math.round((index / pool.length) * 100);
  const displayIndex = finished ? pool.length : index + 1;
  const isLastItem = index === pool.length - 1;

  function handleRestart() {
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setShowKey(false);
    setTotalPoints(0);
    setPerformanceDescription("");
    setShowPerformanceModal(false);
    setSeed((s) => s + 1);
    if (hasTTS()) window.speechSynthesis.cancel();
  }

  // ===================== RENDER PRINCIPAL =====================

  return (
    <>
      <div style={cardContainerStyle}>
        <div style={mainWrapperStyle}>
          <HeaderBar
            title={labels.dictationTitle}
            right={
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6B7280",
                }}
              >
                {displayIndex} {labels.of} {pool.length}
              </span>
            }
          />

          {/* Barra de progresso */}
          <div style={progressBarBgStyle}>
            <div
              style={{
                height: 8,
                width: `${progressPct}%`,
                background: partnerColor(),
                transition: "width 240ms ease",
                borderRadius: 999,
              }}
            />
          </div>

          {/* FINALIZADO */}
          {finished && (
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
              }}
            >
              <div style={finishedContinueTextStyle}>
                ✅ Você concluiu o ditado!
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#374151",
                  fontFamily: "Plus Jakarta Sans",
                }}
              >
                Seu desempenho foi registrado para esta atividade.
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={ghostButtonStyle}
                  onClick={() => setShowPerformanceModal(true)}
                >
                  Ver performance
                </button>

                <button onClick={handleRestart} style={ghostButtonStyle}>
                  🔁 Reiniciar
                </button>
              </div>
            </div>
          )}

          {/* EM ANDAMENTO */}
          {!finished && (
            <>
              {/* Entrada de resposta */}
              {!checked && (
                <>
                  <label style={labelStyle}>{labels.yourAnswer}</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <button
                      style={ghostButtonStyle}
                      onClick={() => {
                        readText(target, true, language, selectedVoice);
                      }}
                      disabled={!target || !hasTTS()}
                      aria-label={labels.play}
                      title={
                        target ? "Ouvir" : "Sem texto em inglês para ouvir"
                      }
                    >
                      🔊 {labels.play || "Ouvir"}
                    </button>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      setChecked(false);
                      setShowKey(false);
                    }}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        setChecked(true);
                        return;
                      }
                      const isPasteCombo =
                        ((e.ctrlKey || e.metaKey) &&
                          (e.key === "v" || e.key === "V")) ||
                        (e.shiftKey && e.key === "Insert");
                      if (isPasteCombo) {
                        e.preventDefault();
                        notifyAlert(
                          "Colar texto não é permitido aqui.",
                          partnerColor()
                        );
                      }
                    }}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    rows={4}
                    placeholder="Digite exatamente o que ouviu…"
                    style={textareaStyle}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <button
                      onClick={() => setChecked(true)}
                      style={primaryButtonStyle}
                    >
                      ✅ {labels.check || "Conferir"}
                    </button>
                  </div>
                </>
              )}

              {/* Resultado depois de conferir */}
              {checked && (
                <div
                  style={{
                    marginTop: 16,
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    padding: 14,
                    background: "#F9FAFB",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Métricas */}
                  <div style={metricsWrapperStyle}>
                    <span style={metricsChipStyle}>
                      🧮 Palavras:{" "}
                      <strong>
                        {wordsTyped}/{wordsExpected}
                      </strong>
                    </span>

                    <span style={metricsChipStyle}>
                      🎯 Corretas por posição:{" "}
                      <strong>
                        {matches}/{total}
                      </strong>
                    </span>

                    <span style={metricsChipStyle}>
                      📊 Similaridade: <strong>{similarity}%</strong>
                    </span>

                    <span style={metricsChipStyle}>
                      🏆 Sua nota: <strong>{roundedSimilarity}</strong>
                    </span>
                  </div>

                  {/* Tokens digitados */}
                  <div style={{ display: "grid", gap: 8 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        fontFamily: "Plus Jakarta Sans",
                      }}
                    >
                      Sua resposta
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {atTokens.map((w, i) => (
                        <span
                          key={`at-${i}-${w}-${index}`}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: `1px solid ${
                              perWordCorrect[i] ? "#A7F3D0" : "#FCA5A5"
                            }`,
                            background: perWordCorrect[i]
                              ? "#D1FAE5"
                              : "#FEE2E2",
                            fontFamily: "Plus Jakarta Sans",
                            fontSize: 12,
                          }}
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gabarito + áudio */}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      marginTop: 4,
                      fontFamily: "Plus Jakarta Sans",
                    }}
                  >
                    Gabarito:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      style={ghostButtonStyle}
                      onClick={() => {
                        readText(target, true, language, selectedVoice);
                      }}
                      disabled={!target || !hasTTS()}
                      aria-label={labels.play}
                      title={
                        target ? "Ouvir" : "Sem texto em inglês para ouvir"
                      }
                    >
                      🔊 {labels.play || "Ouvir"}
                    </button>
                    <div style={{ display: "grid", gap: 4 }}>
                      <b
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: 13,
                          color: "#111827",
                        }}
                      >
                        {target}
                      </b>
                      <i
                        style={{
                          color: "#6B7280",
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: 12,
                        }}
                      >
                        ({targetTr})
                      </i>
                    </div>
                  </div>

                  {/* Botão próximo */}
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        // monta snippet dessa frase
                        const snippet = `◾Ditado "${target}" | Resposta: "${answer}" | nota: ${roundedSimilarity}.◾`;
                        const newDescription = performanceDescription
                          ? `${performanceDescription} ${snippet}`
                          : snippet;

                        const newTotalPoints =
                          roundedSimilarity > 0
                            ? totalPoints + roundedSimilarity
                            : totalPoints;

                        setPerformanceDescription(newDescription);
                        if (roundedSimilarity > 0) {
                          setTotalPoints(newTotalPoints);
                        }

                        exerciseScore?.(
                          roundedSimilarity,
                          `Ditado: ${target} / Resposta: ${answer}`
                        );

                        if (isLastItem) {
                          handleScoreStamp(newTotalPoints, newDescription);
                        }

                        setIndex((i) => i + 1);
                        setAnswer("");
                        setChecked(false);
                        setShowKey(false);
                        if (hasTTS()) window.speechSynthesis.cancel();
                      }}
                      style={primaryButtonStyle}
                    >
                      {defaultLabels.next} ▶︎
                    </button>
                  </div>
                </div>
              )}

              {/* Gabarito literal extra se quiser (showKey) */}
              {checked && showKey && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 10,
                    borderRadius: 8,
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    fontSize: 13,
                    color: "#1F2937",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                >
                  <strong>Gabarito:</strong> {target}
                  {current?.portuguese && (
                    <div style={{ color: "#6B7280", marginTop: 6 }}>
                      {current.portuguese}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL DE PERFORMANCE — GRUDADO NO BODY */}
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
                <h2
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Detalhes da performance
                </h2>

                <button
                  onClick={() => setShowPerformanceModal(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                  aria-label="Fechar"
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
                {performanceDescription ||
                  "Seu desempenho foi registrado para esta atividade."}
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
    </>
  );
}
