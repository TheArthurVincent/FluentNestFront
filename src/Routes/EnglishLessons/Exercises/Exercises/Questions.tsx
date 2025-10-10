import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, shuffle } from "../Exercises";
import React, { useEffect, useMemo, useState } from "react";
import { backDomain } from "../../../../Resources/UniversalComponents";

type ElementExercise = {
  type: "exercise";
  items: string[];
  subtitle?: string;
  order?: number;
};

export function QuestionsExercise({
  exerciseElement,
  exerciseElements,
  studentId,
  headers,
  classId,
}: {
  exerciseElement?: ElementExercise;
  exerciseElements?: ElementExercise[];
  headers?: any | null;
  studentId: string;
  classId: string;
}) {
  const [editorContent, setEditorContent] = useState<string>("");

  // Use either single element or array of elements
  const elementsToUse = exerciseElements || (exerciseElement ? [exerciseElement] : []);

  const generateInitialQuestionsContent = () => {
    let content = "";
    let questionNumber = 1; // Continuous numbering across all sections

    // If multiple elements, create sections for each
    elementsToUse.forEach((element, elementIndex) => {
      // Add section title if there are multiple elements or if element has subtitle
      if (elementsToUse.length > 1 || element.subtitle) {
        content += `${element.subtitle || `Exercício ${elementIndex + 1}`}\n\n`;
      }

      // Lista de perguntas with continuous numbering
      element.items.forEach((item) => {
        content += `${questionNumber}. ${item}\n\n`;
        questionNumber++;
      });

      // Add separator between sections if there are multiple elements
      if (elementsToUse.length > 1 && elementIndex < elementsToUse.length - 1) {
        content += `\n---\n\n`;
      }
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
  }, [elementsToUse]);
  const [newHWDescription, setNewHWDescription] = useState("");

  const actualHeaders = headers || {};

  const handleSaveExercise = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/board/${classId}?student=${studentId}`,
        { content: newHWDescription, date: new Date() },
        { headers: actualHeaders }
      );
    } catch (error) {
      console.error(error, "Erro ao buscar comentários");
    }
  };

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
              padding: "12px",
              lineHeight: "1.5",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
      </div>
    </Card>
  );
}
