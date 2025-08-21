import React, { useEffect, useState } from "react";
import { backDomain } from "../../../Resources/UniversalComponents";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import HTMLEditor from "../../../Resources/Components/HTMLEditor";
import { partnerColor, textTitleFont } from "../../../Styles/Styles";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";

export function NewHomeworkAssignmentHere({
  headers,
  id,
  selectedStudentID,
  studentName,
  update,
  setUpdate,
}) {
  const [newDate, setNewDate] = useState("");
  const [newAttachments, setAttachments] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [seeHW, setSeeHW] = useState(false);
  const [loadingHW, setLoadingHW] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [newFlashcards, setNewFlashcardsList] = useState("");
  const [newHWDescription, setNewHWDescription] = useState("");
  const [student, setStudent] = useState([]);
  const [standardValue, setStandardValue] = useState("Aluno");
  const [button, setButton] = useState("Criar");
  const [tutorings, setTutorings] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loadingS, setLoadingS] = useState(true);
  const [editorKey, setEditorKey] = useState(0); // Force re-render key
  const [isModalOpen, setIsModalOpen] = useState(false);

  const postHW = async () => {
    setLoadingHW(true);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/homework/${selectedStudentID}`,
        { description: newHWDescription, dueDate },
        {
          headers,
        }
      );
      notifyAlert("HW criado com sucesso!", partnerColor());
      handleHWDescriptionChange(""); // Clear the HTML editor
      setEditorKey((prev) => prev + 1); // Force HTMLEditor re-render
      setIsModalOpen(false);
      setUpdate(!update);
    } catch (error) {
      setIsModalOpen(false);
      notifyAlert("Erro ao salvar aulas");
    }
  };

  const handleHWDescriptionChange = (htmlContent) => {
    setNewHWDescription(htmlContent);
  };
  const handleFC = (htmlContent) => {
    setNewFlashcardsList(htmlContent);
  };
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Adicionar Homework</button>
      <article
        onClick={() => setIsModalOpen(false)}
        style={{
          display: isModalOpen ? "flex" : "none",
          position: "fixed",
          zIndex: 100000000,
          fontFamily: textTitleFont(),
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          background: "rgba(30, 41, 59, 0.75)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            minWidth: "350px",
            maxWidth: "420px",
            width: "100%",
            background: "#fff",
            padding: "2.5rem 2rem 2rem 2rem",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(30,41,59,0.18)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              fontSize: "1.5rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #0001",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setIsModalOpen(false)}
            aria-label="Fechar"
          >
            ×
          </button>
          <div
            style={{
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                color: "#334155",
                margin: 0,
                letterSpacing: "0.5px",
              }}
            >
              Homework Avulso para <span>{studentName}</span>
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontStyle: "italic",
                marginTop: "0.5rem",
              }}
            >
              Preencha os campos abaixo para criar um novo homework.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postHW();
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <label
              style={{
                fontWeight: 600,
                color: "#334155",
                fontSize: "1rem",
                marginBottom: "0.3rem",
              }}
            >
              Data de entrega
            </label>
            <input
              style={{
                padding: "0.7rem 1rem",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: "1.08rem",
                fontWeight: 500,
                background: "#f8fafc",
                color: "#334155",
                marginBottom: "0.5rem",
                outline: "none",
                transition: "border 0.2s",
              }}
              type="date"
              placeholder="Data"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
              required
            />
            <label
              style={{
                fontWeight: 600,
                color: "#334155",
                fontSize: "1rem",
                marginBottom: "0.3rem",
              }}
            >
              Descrição do Homework
            </label>
            <div
              style={{
                borderRadius: 8,
                background: "#f8fafc",
                padding: "1rem",
                minHeight: "120px",
                marginBottom: "0.5rem",
              }}
            >
              <HTMLEditor
                key={editorKey} // Force re-render when key changes
                initialContent={"Type here"}
                onChange={handleHWDescriptionChange}
              />
            </div>
            <button type="submit" disabled={loadingHW}>
              {loadingHW ? (
                <CircularProgress size={24} style={{ color: partnerColor() }} />
              ) : (
                "Postar Homework"
              )}
            </button>
          </form>
        </div>
      </article>
    </>
  );
}

export default NewHomeworkAssignmentHere;
