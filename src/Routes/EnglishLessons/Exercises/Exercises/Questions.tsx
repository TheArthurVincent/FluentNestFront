import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { Card } from "../Exercises";
import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Use either single element or array of elements
  const elementsToUse =
    exerciseElements || (exerciseElement ? [exerciseElement] : []);

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
    setHasChanges(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Impedir Ctrl+V (colar)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();
    }

    // Save on Ctrl+S
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handleSaveExercise();
    }
  };

  const handleRestoreQuestions = () => {
    const initialContent = generateInitialQuestionsContent();
    setEditorContent(initialContent);
    setHasChanges(true);
  };

  // Load saved exercise board from backend
  const loadExerciseBoard = async () => {
    if (!studentId || !classId) return;

    setLoading(true);
    try {
      const actualHeaders = headers || {};
      const response = await axios.get(
        `${backDomain}/api/v1/exercise-board/${classId}?student=${studentId}`,
        { headers: actualHeaders }
      );

      if (response.data.studentSavedBoard) {
        setEditorContent(response.data.studentSavedBoard);
        setLastSaved(response.data.date ? new Date(response.data.date) : null);
        setHasChanges(false);
      } else {
        // No saved content, use initial generated content
        const initialContent = generateInitialQuestionsContent();
        setEditorContent(initialContent);
        setHasChanges(true); // Mark as having changes so user can save initial content
      }
    } catch (error) {
      console.error("Erro ao carregar exercícios salvos:", error);
      // Fallback to initial content
      const initialContent = generateInitialQuestionsContent();
      setEditorContent(initialContent);
      setHasChanges(true); // Mark as having changes so user can save initial content
      notifyAlert(
        "Não foi possível carregar exercícios salvos. Usando template padrão.",
        "#f59e0b"
      );
    } finally {
      setLoading(false);
    }
  };

  // Save exercise board to backend
  const handleSaveExercise = async () => {
    if (!studentId || !classId || !editorContent.trim()) return;

    setLoading(true);
    try {
      const actualHeaders = headers || {};
      const response = await axios.put(
        `${backDomain}/api/v1/exercise-board/${classId}?student=${studentId}`,
        { content: editorContent, date: new Date() },
        { headers: actualHeaders }
      );

      setLastSaved(new Date());
      setHasChanges(false);
      notifyAlert("Exercícios salvos com sucesso!", partnerColor());
    } catch (error) {
      console.error("Erro ao salvar exercícios:", error);
      notifyAlert("Erro ao salvar exercícios. Tente novamente.", "red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId && classId) {
      loadExerciseBoard();
    }
  }, [studentId, classId]);

  // Reset state when student changes
  useEffect(() => {
    setEditorContent("");
    setLastSaved(null);
    setHasChanges(false);
    setLoading(false);
  }, [studentId]);

  return (
    <Card>
      <div>
        {/* Header with save and restore buttons */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handleSaveExercise}
              disabled={loading || !hasChanges}
              style={{
                backgroundColor: loading
                  ? "#6b7280"
                  : hasChanges
                  ? partnerColor()
                  : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: loading
                  ? "not-allowed"
                  : hasChanges
                  ? "pointer"
                  : "default",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {loading ? "Salvando..." : hasChanges ? "💾 Salvar" : "✅ Salvo"}
            </button>
            <button
              onClick={handleRestoreQuestions}
              disabled={loading}
              style={{
                backgroundColor: "white",
                color: partnerColor(),
                border: `1px solid ${partnerColor()}`,
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "500",
              }}
            >
              🔄 Restaurar Original
            </button>
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {lastSaved && (
              <span>
                Última modificação: {lastSaved.toLocaleString("pt-BR")}
              </span>
            )}
            {hasChanges && (
              <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
                • Não salvo
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            minHeight: "400px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div style={{ color: partnerColor() }}>Carregando...</div>
            </div>
          )}
          <textarea
            value={editorContent}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={
              loading
                ? "Carregando exercícios..."
                : "Digite suas respostas aqui..."
            }
            style={{
              width: "100%",
              height: "400px",
              border: "none",
              padding: "12px",
              lineHeight: "1.5",
              resize: "vertical",
              outline: "none",
              backgroundColor: loading ? "#f9fafb" : "white",
              fontFamily: "monospace",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>💡 Ctrl+S para salvar</span>
          <span>{editorContent.length} caracteres</span>
        </div>
      </div>
    </Card>
  );
}
