import React, { useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { darkGreyColor, lightGreyColor } from "../../../../Styles/Styles";
import { readText } from "../Functions/FunctionLessons";

interface Option {
  option: string;
  status: string;
  reason: string;
}

interface Exercise {
  question: string;
  audio: string;
  options: Option[];
  answer: string;
}

interface SelectExerciseProps {
  headers: MyHeadersType | null;
  element: {
    subtitle: string;
    options: Exercise[];
  };
  selectedVoice: any;
}

const SelectExercise: React.FC<SelectExerciseProps> = ({
  headers,
  element,
  selectedVoice,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleSelectChange = (
    index: number,
    value: string,
    correctAnswer: string
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: value,
    }));
    setFeedback((prev) => ({
      ...prev,
      [index]: value === correctAnswer ? "right" : "wrong",
    }));
  };

  const getFeedbackColor = (status: string | undefined) => {
    if (!showAllAnswers) return "transparent";
    if (status === "wrong") {
      return "lightcoral";
    } else if (status === "right") {
      return "lightgreen";
    } else {
      return "transparent";
    }
  };

  const allOptionsSelected = () => {
    return element.options.every(
      (exercise, index) => selectedOptions[index] !== undefined
    );
  };

  const toggleShowAllAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
    setShowStatus(true);
  };

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div style={{ padding: "5px", margin: "10px 0" }}>
      {/* {element.subtitle && <HThree>{element.subtitle}</HThree>} */}
      {element.options && (
        <ol style={{ padding: "5px", margin: "10px 0" }}>
          {element.options.map((exercise: Exercise, index: number) => (
            <li
              key={index}
              className="exercise"
              style={{
                border: `solid 1px${darkGreyColor()}`,
                listStyle: "none",
                marginBottom: "15px",
                backgroundColor: getFeedbackColor(feedback[index]),
                padding: "10px",
                borderRadius: "4px",
                position: "relative",
              }}
            >
              <span style={{ fontWeight: 800 }}>{index + 1} </span>
              {exercise.question && <span>{exercise.question}</span>}
              {exercise.audio && (
                <button
                  className="audio-button"
                  onClick={() =>
                    readText(exercise.audio, true, "en", selectedVoice)
                  }
                >
                  <i className="fa fa-volume-up" aria-hidden="true" />
                </button>
              )}
              <select
                value={selectedOptions[index] || ""}
                onChange={(e) =>
                  handleSelectChange(
                    index,
                    e.target.value,
                    exercise.options.find((opt) => opt.status === "right")
                      ?.option || ""
                  )
                }
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                <option value="">Select</option>
                {exercise.options.map((opt: Option, i: number) => (
                  <option key={i} value={opt.option}>
                    {opt.option && opt.option}
                  </option>
                ))}
              </select>
              <br />
              {exercise.answer && (
                <i
                  style={{
                    marginTop: "1rem",
                    color: "#ccc",
                  }}
                  className="fa fa-eye"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                />
              )}
              {"  "}
              {hoverIndex === index && (
                <span style={{ fontStyle: "italic" }}>
                  {exercise.answer && exercise.answer}
                </span>
              )}
              {showStatus && (
                <span
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {selectedOptions[index] ===
                    exercise.options.find((opt) => opt.status === "right")
                      ?.option && (
                    <span style={{ color: "green" }}> - Correct!</span>
                  )}
                  {selectedOptions[index] !==
                    exercise.options.find((opt) => opt.status === "right")
                      ?.option && (
                    <span style={{ color: "red" }}> - Incorrect!</span>
                  )}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
      <button
        onClick={toggleShowAllAnswers}
        color={allOptionsSelected() ? "green" : "grey"}
        style={{
          marginTop: "10px",
          cursor: allOptionsSelected() ? "pointer" : "not-allowed",
        }}
        disabled={!allOptionsSelected()}
      >
        Explanation
      </button>
      {showAllAnswers && (
        <div>
          {element.options.map((exercise: Exercise, index: number) => (
            <div key={index} style={{ margin: "10px" }}>
              <div style={{ margin: "5px", fontWeight: "bold" }}>
                {index + 1}. {exercise.question && exercise.question}{" "}
                <span
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {" - "}
                  {exercise.answer && exercise.answer}
                </span>
              </div>
              {exercise.options.map((opt: Option, i: number) => (
                <div
                  key={i}
                  style={{
                    margin: "20px 0",
                    color: opt.status === "right" ? "green" : "red",
                    fontStyle: opt.status === "right" ? "none" : "italic",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: lightGreyColor(),
                      padding: "5px",
                      marginRight: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    {opt.option && opt.option}
                  </span>{" "}
                  {opt.reason && opt.reason}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectExercise;
