import React, { useMemo, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { readText } from "../Functions/FunctionLessons";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";

interface MultipleTextsLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  studentId?: string;
  courseId?: string;
  selectedVoice?: any;
  exerciseScore?: (points: number, description?: string, id?: string) => void;
}

export default function MultipleTextsLessonModel({
  headers,
  element,
  studentId,
  courseId,
  selectedVoice,
  exerciseScore,
}: MultipleTextsLessonModelProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [correctAnswered, setCorrectAnswered] = useState<Set<number>>(
    new Set(),
  );

  const isSelectExercise = element?.type === "selectexercise";
  const optionsList = useMemo(() => {
    return Array.isArray(element?.options) ? element.options : [];
  }, [element?.options]);

  const getCorrectAnswer = (question: any) => {
    if (question?.answer) return question.answer;

    const rightOption = Array.isArray(question?.options)
      ? question.options.find((op: any) => op?.status === "right")
      : null;

    return rightOption?.option || "";
  };

  const handleSelectOption = (questionIndex: number, optionValue: string) => {
    const question = optionsList[questionIndex];
    const correctAnswer = getCorrectAnswer(question);

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionValue,
    }));

    const alreadyScored = correctAnswered.has(questionIndex);
    const isCorrect = optionValue === correctAnswer;

    if (isCorrect && !alreadyScored) {
      const newSet = new Set(correctAnswered);
      newSet.add(questionIndex);
      setCorrectAnswered(newSet);

      exerciseScore?.(1, "Multiple Choice", element?._id);
    }
  };

  const getOptionState = (questionIndex: number, option: any) => {
    const selected = selectedAnswers[questionIndex];
    if (!selected) return "default";

    const correctAnswer = getCorrectAnswer(optionsList[questionIndex]);

    if (option.option === correctAnswer) return "correct";
    if (selected === option.option && option.option !== correctAnswer)
      return "wrong";

    return "default";
  };

  if (isSelectExercise) {
    return (
      <div
        style={{
          padding: "5px",
          margin: "10px 0",
        }}
      >
        {element?.subtitle && (
          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 16,
              color: "#222",
            }}
          >
            {element.subtitle}
          </div>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          {optionsList.map((question: any, questionIndex: number) => {
            const selected = selectedAnswers[questionIndex];
            const correctAnswer = getCorrectAnswer(question);
            const isCorrect = selected && selected === correctAnswer;
            const isWrong = selected && selected !== correctAnswer;

            return (
              <div
                key={questionIndex}
                style={{
                  background: "#fff",
                  borderLeft: `4px solid ${partnerColor()}`,
                  padding: "14px",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#222",
                    }}
                  >
                    {question?.question || "Choose the correct option"}
                  </div>

                  {question?.audio && (
                    <button
                      className="audio-button"
                      onClick={() =>
                        readText(question.audio, true, "en", selectedVoice)
                      }
                      style={{
                        border: `1px solid ${partnerColor()}`,
                        background: "#fff",
                        color: partnerColor(),
                        borderRadius: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* {question?.audio && (
                  <div
                    style={{
                      marginBottom: 12,
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    Audio/Text: {question.audio}
                  </div>
                )} */}

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  {Array.isArray(question?.options) &&
                    question.options.map((option: any, optionIndex: number) => {
                      const state = getOptionState(questionIndex, option);

                      let background = "#fff";
                      let border = "1px solid #ddd";
                      let color = "#222";

                      if (state === "correct") {
                        background = "#eaf8ee";
                        border = "1px solid #34a853";
                        color = "#1e7a35";
                      }

                      if (state === "wrong") {
                        background = "#fdecec";
                        border = "1px solid #e53935";
                        color = "#b3261e";
                      }

                      return (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            handleSelectOption(questionIndex, option.option)
                          }
                          disabled={!!selected}
                          style={{
                            textAlign: "left",
                            padding: "12px 14px",
                            borderRadius: 8,
                            border,
                            background,
                            color,
                            cursor: selected ? "default" : "pointer",
                            fontWeight: 600,
                            transition: "0.2s",
                          }}
                        >
                          {option.option}
                        </button>
                      );
                    })}
                </div>

                {selected && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      color: isCorrect ? "#1e7a35" : "#b3261e",
                    }}
                  >
                    {isCorrect
                      ? "Correct! +1 point"
                      : `Wrong. Correct answer: ${correctAnswer}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "5px",
        margin: "10px 0",
      }}
    >
      {element.subtitle && (
        <div>
          {element.subtexts &&
            element.subtexts.map((text: any, index: number) => {
              return (
                <div key={index}>
                  {text.subtexttitle && <HThree>{text.subtexttitle}</HThree>}
                  {text.text && (
                    <p style={{ marginBottom: "2rem" }}>
                      {text.text}
                      <button
                        className="audio-button"
                        onClick={() => {
                          readText(text.text, true, "en", selectedVoice);
                        }}
                      >
                        <i className={"fa fa-volume-up"} aria-hidden="true" />
                      </button>
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      )}
      {element.text && <div>{element.text}</div>}
    </div>
  );
}
