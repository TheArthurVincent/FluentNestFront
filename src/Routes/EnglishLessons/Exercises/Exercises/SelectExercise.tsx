import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, shuffle } from "../Exercises";
import React, { useState } from "react";

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
  labels,
  selectedVoice,
  language,
}: {
  exercise: any;
  exerciseElement: ElementSelectExercise;
  studentId: string;
  labels: typeof defaultLabels;
  selectedVoice?: string;
  language?: string;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [score, setScore] = useState(0);

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

  const checkAnswer = () => {
    if (!selectedOption) {
      notifyAlert("Selecione uma opção primeiro!", "#ff6b6b");
      return;
    }

    const correct = selectedOption === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 3); // 3 pontos por resposta correta
      if (exercise && typeof exercise === "function") {
        exercise(
          3,
          `Exercício de seleção: ${
            exerciseElement.subtitle || "Select Exercise"
          } - Pergunta ${currentQuestionIndex + 1}`
        );
      }
    }

    setCompleted(completed + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setShowResult(false);
    }
  };

  const resetExercise = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setShowResult(false);
    setCompleted(0);
    setScore(0);
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
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        {isFinished ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎉</div>
            <h3
              style={{
                color: partnerColor(),
                marginBottom: "8px",
                fontSize: "18px",
              }}
            >
              Concluído!
            </h3>
            <p
              style={{
                color: "#6B7280",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {score} pontos
            </p>
            <button
              onClick={resetExercise}
              style={{
                backgroundColor: partnerColor(),
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Recomeçar
            </button>
          </div>
        ) : (
          <>
            {/* Header simples */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              <span>
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
              <span style={{ color: partnerColor(), fontWeight: "600" }}>
                {score} pts
              </span>
            </div>

            {/* Botão de áudio minimalista */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <button
                onClick={playAudio}
                disabled={isPlaying}
                style={{
                  backgroundColor: "transparent",
                  color: partnerColor(),
                  border: `2px solid ${partnerColor()}`,
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  fontSize: "16px",
                  cursor: isPlaying ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  opacity: isPlaying ? 0.6 : 1,
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
            </div>

            {/* Opções simplificadas */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "20px",
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
                      padding: "12px 16px",
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: showResult ? "default" : "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {option.option}
                  </button>
                );
              })}
            </div>

            {/* Botões de ação simplificados */}
            <div style={{ textAlign: "center" }}>
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
                    padding: "10px 20px",
                    fontSize: "14px",
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
                      padding: "10px 20px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Continuar
                  </button>
                )
              )}
            </div>
            {/* Feedback minimalista */}
            {showResult && (
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: isCorrect ? "#16A34A" : "#DC2626",
                  fontWeight: "500",
                }}
              >
                {isCorrect ? "✓ Correto" : "✗ Incorreto"}
                {isCorrect && " (+3)"}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
