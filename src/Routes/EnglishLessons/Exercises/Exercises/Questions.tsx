import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, shuffle } from "../Exercises";
import React, { useEffect, useMemo, useState } from "react";

type ElementExercise = {
  type: "exercise";
  items: string[];
  subtitle?: string;
  order?: number;
};

export function QuestionsExercise({
  exercise,
  exerciseElement,
  studentId,
  labels,
}: {
  exercise: any;
  exerciseElement: ElementExercise;
  studentId: string;
  labels: typeof defaultLabels;
}) {
  const [editorContent, setEditorContent] = useState<string>("");

  const generateInitialQuestionsContent = () => {
    let content = "";

    // Título do exercício
    content += `${exerciseElement.subtitle || "Exercício"}\n\n`;

    // Lista de perguntas
    exerciseElement.items.forEach((item, itemIndex) => {
      content += `${itemIndex + 1}. ${item}\n\n`;
    });

    return content;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Impedir Ctrl+V (colar)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();
    }
  };

  const handleRestoreQuestions = () => {
    const initialContent = generateInitialQuestionsContent();
    setEditorContent(initialContent);
  };

  useEffect(() => {
    if (!editorContent) {
      setEditorContent(generateInitialQuestionsContent());
    }
  }, [exerciseElement]);

  return (
    <Card>
      <div>
        {/* <div style={{ marginBottom: "16px" }}>
          <button
            onClick={handleRestoreQuestions}
            style={{
              backgroundColor: partnerColor(),
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Restaurar Exercício
          </button>
        </div> */}
        <div
          style={{
            minHeight: "300px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        >
          <textarea
            value={editorContent}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: "300px",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
              lineHeight: "1.5",
              resize: "vertical",
              outline: "none",
            }}
            placeholder="Digite suas perguntas aqui..."
          />
        </div>
      </div>
    </Card>
  );
}
