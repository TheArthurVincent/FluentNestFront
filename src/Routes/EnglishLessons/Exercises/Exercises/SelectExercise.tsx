import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar } from "../Exercises";
import React, { useState } from "react";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";

type OptionItem = {
  option: string;
  status: "right" | "wrong";
  reason?: string;
};

type QuestionItem = {
  question: string;
  audio: string;
  options: OptionItem[];
  answer: string;
  studentsWhoDidIt: string[];
};

type ElementSelectExercise = {
  type: "selectexercise";
  subtitle?: string;
  options: QuestionItem[];
  order?: number;
};

export function SelectExercise({
  exercise,
  exerciseElement,
  studentId,
  selectedVoice,
  language,
  courseId,
}: {
  exercise: (points: number, label?: string) => void;
  exerciseElement: ElementSelectExercise;
  studentId: string;
  selectedVoice?: string;
  language?: string;
  courseId?: string; // id da aula para /exercise-done/:id
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [score, setScore] = useState(0);
  const [showText, setShowText] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);

  // resumo geral para o exercise-done
  const [performanceDescription, setPerformanceDescription] = useState("");

  const currentQuestion = exerciseElement.options[currentQuestionIndex];
  const totalQuestions = exerciseElement.options.length;

  const playAudio = () => {
    if (!currentQuestion?.audio) return;

    setIsPlaying(true);
    readText(
      currentQuestion.audio,
      true,
      language || "en",
      selectedVoice
    ).finally(() => {
      setIsPlaying(false);
    });
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const handleShowText = () => {
    setShowText(true);
    setTextRevealed(true);
  };

  async function handleScoreStamp(
    pointsToSend: number,
    descriptionToSend: string
  ) {
    if (!courseId || !studentId) return;

    try {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const studentName =
        (loggedIn?.name && loggedIn?.lastname
          ? `${loggedIn.name} ${loggedIn.lastname}`
          : "Student") || "Student";

      await axios.put(`${backDomain}/api/v1/exercise-done/${courseId}`, {
        type: "selectexercise",
        points: pointsToSend,
        student: studentId,
        description: descriptionToSend,
        studentName,
      });
    } catch (error) {
      console.log(error, "Erro ao atualizar dados (select-exercise)");
    }
  }

  const checkAnswer = async () => {
    if (!selectedOption) {
      notifyAlert("Selecione uma opção primeiro!", "#ff6b6b");
      return;
    }

    const correct = selectedOption === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);

    // pontos: 6 se não viu texto, 3 se viu
    const points = correct ? (textRevealed ? 3 : 6) : 0;

    const snippet = correct
      ? `Pergunta ${currentQuestionIndex + 1}: acertou (${
          textRevealed ? "com texto" : "só áudio"
        }) e ganhou ${points} pontos.`
      : `Pergunta ${currentQuestionIndex + 1}: errou e não ganhou pontos.`;

    const newScore = score + points;
    const newDescription = performanceDescription
      ? `${performanceDescription} ${snippet}`
      : snippet;

    setScore(newScore);
    setPerformanceDescription(newDescription);

    if (correct && exercise && typeof exercise === "function") {
      exercise(
        points,
        `Exercício de seleção: ${
          exerciseElement.subtitle || "Select Exercise"
        } - Pergunta ${currentQuestionIndex + 1} (${
          textRevealed ? "com texto" : "só áudio"
        })`
      );
    }

    const newCompleted = completed + 1;
    setCompleted(newCompleted);

    // terminou TODAS as questões -> registra exercise-done
    if (newCompleted === totalQuestions) {
      await handleScoreStamp(newScore, newDescription);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setShowResult(false);
      setShowText(false);
      setTextRevealed(false);
    }
  };

  const resetExercise = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setShowResult(false);
    setCompleted(0);
    setScore(0);
    setShowText(false);
    setTextRevealed(false);
    setPerformanceDescription("");
  };

  if (!exerciseElement.options || exerciseElement.options.length === 0) {
    return (
      <Card>
        <div style={{ padding: "16px" }}>
          <HeaderBar title={exerciseElement.subtitle || "Select Exercise"} />
          <p style={{ color: "#6B7280", fontStyle: "italic" }}>
            Nenhuma pergunta disponível para este exercício.
          </p>
        </div>
      </Card>
    );
  }

  const isFinished = completed === totalQuestions;

  return (
    <Card>
      <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
        {isFinished ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎉</div>
            <h4
              style={{
                color: partnerColor(),
                marginBottom: "4px",
                fontSize: "16px",
              }}
            >
              Concluído!
            </h4>
            {/* descrição detalhada do desempenho */}
            <p
              style={{
                color: "#4B5563",
                marginBottom: "8px",
                fontSize: "12px",
                whiteSpace: "pre-wrap",
              }}
            >
              {performanceDescription ||
                "Seu desempenho foi registrado neste exercício de seleção."}
            </p>
            <p
              style={{
                color: "#6B7280",
                marginBottom: "12px",
                fontSize: "12px",
              }}
            >
              Total: {score} pontos
            </p>
            <button
              onClick={resetExercise}
              style={{
                backgroundColor: partnerColor(),
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Recomeçar
            </button>
          </div>
        ) : (
          <>
            {/* Header compacto */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                fontSize: "12px",
                color: "#6B7280",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "8px",
              }}
            >
              <span>
                Questão {currentQuestionIndex + 1}/{totalQuestions}
              </span>
              <span style={{ color: partnerColor(), fontWeight: "600" }}>
                {score} pts
              </span>
            </div>

            {/* Layout horizontal: áudio à esquerda, opções à direita */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                marginBottom: "16px",
              }}
            >
              {/* Seção do áudio */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "120px",
                }}
              >
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  style={{
                    backgroundColor: "transparent",
                    color: partnerColor(),
                    border: `1px solid ${partnerColor()}`,
                    borderRadius: "6px",
                    width: "36px",
                    height: "36px",
                    fontSize: "12px",
                    cursor: isPlaying ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    opacity: isPlaying ? 0.6 : 1,
                    marginBottom: "8px",
                  }}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Texto do áudio (se revelado) */}
                {showText && (
                  <div
                    style={{
                      backgroundColor: "#F0F9FF",
                      border: `1px solid ${partnerColor()}`,
                      borderRadius: "6px",
                      padding: "8px",
                      marginBottom: "8px",
                      fontSize: "12px",
                      textAlign: "center",
                      maxWidth: "150px",
                      wordWrap: "break-word",
                    }}
                  >
                    "{currentQuestion.audio}"
                  </div>
                )}

                {/* Botão para revelar texto */}
                {!showText && !showResult && (
                  <button
                    onClick={handleShowText}
                    style={{
                      backgroundColor: "transparent",
                      color: "#6B7280",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "10px",
                      cursor: "pointer",
                      marginBottom: "4px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    👁 Ver texto (-3 pts)
                  </button>
                )}

                <span
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    textAlign: "center",
                  }}
                >
                  {showText ? "Texto revelado" : "Ouça e escolha"}
                  <br />
                  <span
                    style={{
                      color: textRevealed ? "#DC2626" : "#16A34A",
                      fontWeight: "500",
                    }}
                  >
                    {textRevealed ? "3 pts" : "6 pts"}
                  </span>
                </span>
              </div>

              {/* Opções em lista compacta */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === option.option;
                    const isCorrectOption = option.status === "right";

                    let backgroundColor = "#FFFFFF";
                    let borderColor = "#E5E7EB";
                    let textColor = "#374151";

                    if (showResult) {
                      if (isSelected) {
                        if (isCorrect) {
                          backgroundColor = "#10B981";
                          borderColor = "#10B981";
                          textColor = "#FFFFFF";
                        } else {
                          backgroundColor = "#EF4444";
                          borderColor = "#EF4444";
                          textColor = "#FFFFFF";
                        }
                      } else if (isCorrectOption) {
                        backgroundColor = "#F0FDF4";
                        borderColor = "#22C55E";
                        textColor = "#16A34A";
                      }
                    } else if (isSelected) {
                      backgroundColor = "#F0F9FF";
                      borderColor = partnerColor();
                      textColor = partnerColor();
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option.option)}
                        disabled={showResult}
                        style={{
                          backgroundColor,
                          border: `1px solid ${borderColor}`,
                          color: textColor,
                          borderRadius: "6px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          fontWeight: "400",
                          cursor: showResult ? "default" : "pointer",
                          transition: "all 0.15s ease",
                          textAlign: "left",
                          width: "100%",
                        }}
                      >
                        {String.fromCharCode(65 + index)}. {option.option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer compacto com ações */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #E5E7EB",
                paddingTop: "12px",
              }}
            >
              {/* Feedback minimalista */}
              <div style={{ fontSize: "12px", minHeight: "18px" }}>
                {showResult && (
                  <span
                    style={{
                      color: isCorrect ? "#16A34A" : "#DC2626",
                      fontWeight: "500",
                    }}
                  >
                    {isCorrect
                      ? `✓ Correto (+${textRevealed ? 3 : 6})`
                      : "✗ Incorreto"}
                  </span>
                )}
              </div>

              {/* Botão de ação */}
              <div>
                {!showResult ? (
                  <button
                    onClick={checkAnswer}
                    disabled={!selectedOption}
                    style={{
                      backgroundColor: selectedOption
                        ? partnerColor()
                        : "#F3F4F6",
                      color: selectedOption ? "white" : "#9CA3AF",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 16px",
                      fontSize: "12px",
                      cursor: selectedOption ? "pointer" : "not-allowed",
                      fontWeight: "500",
                    }}
                  >
                    Verificar
                  </button>
                ) : (
                  currentQuestionIndex < totalQuestions - 1 && (
                    <button
                      onClick={nextQuestion}
                      style={{
                        backgroundColor: partnerColor(),
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 16px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Próxima →
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
