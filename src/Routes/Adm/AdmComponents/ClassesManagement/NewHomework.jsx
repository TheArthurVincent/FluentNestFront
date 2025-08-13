import React, { useEffect, useState } from "react";
import { HOne } from "../../../../Resources/Components/RouteBox";
import axios from "axios";
import { DivGrid, backDomain } from "../../../../Resources/UniversalComponents";
import { CircularProgress, TextField } from "@mui/material";
import { lightGreyColor, partnerColor } from "../../../../Styles/Styles";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function NewHomeworkAssignment({ headers, id }) {
  const [newDate, setNewDate] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newAttachments, setAttachments] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [seeHW, setSeeHW] = useState(false);
  const [loadingHW, setLoadingHW] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [newFlashcards, setNewFlashcardsList] = useState("");

  const [newHWDescription, setNewHWDescription] = useState("");
  const handleHWDescriptionChange = (htmlContent) => {
    setNewHWDescription(htmlContent);
  };
  const handleFC = (htmlContent) => {
    setNewFlashcardsList(htmlContent);
  };

  const [selectedStudentID, setSelectedStudentID] = useState("");
  const [student, setStudent] = useState([]);
  const [standardValue, setStandardValue] = useState("Aluno");
  const [button, setButton] = useState("Criar");
  const [tutorings, setTutorings] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loadingS, setLoadingS] = useState(true);
  const [editorKey, setEditorKey] = useState(0); // Force re-render key

  const fetchStudents = async () => {
    setLoadingS(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers,
      });
      setStudent(response.data.listOfStudents);
      setLoadingS(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddTutoring = () => {
    const newTutoring = {
      date: newDate,
      studentID: selectedStudentID,
      videoUrl: newVideoUrl,
      attachments: newAttachments,
    };
    setTutorings([...tutorings, newTutoring]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButton(<CircularProgress style={{ color: partnerColor() }} />);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/tutoring/`,
        { tutorings, description: newHWDescription, dueDate, newFlashcards },
        {
          headers,
        }
      );
      notifyAlert("Aulas criadas com sucesso!", partnerColor());
      setTutorings([]);
      setNewHWDescription("");
      handleHWDescriptionChange("");
      setEditorKey(prev => prev + 1); // Force HTMLEditor re-render
      setButton("Criar");
    } catch (error) {
      setButton("Criar");
      notifyAlert("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

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
      setNewHWDescription("");
      handleHWDescriptionChange(""); // Clear the HTML editor
      setAttachments("");
      setNewFlashcardsList("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setSelectedStudentID("");
      setEditorKey(prev => prev + 1); // Force HTMLEditor re-render
      setLoadingHW(false);
      console.log({
        description: newHWDescription,
        dueDate,
        selectedStudentID,
      });
    } catch (error) {
      setLoadingHW(false);
      notifyAlert("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

  const setStudentList = (e) => {
    setSelectedStudentID(e);
    setDisabled(false);
  };

  return (
    <div style={{ background: "#fff"}}>
      <HOne>Postar Homework</HOne>
      {loadingS ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <CircularProgress style={{ color: partnerColor() }} />
        </div>
      ) : (
        <div>
          <select
            required
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: 8,
              border: `1px solid ${lightGreyColor()}`,
              fontSize: "1rem",
              background: "#f5f6fa",
            }}
            onChange={(e) => setStudentList(e.target.value)}
            value={selectedStudentID}
          >
            <option value={standardValue} hidden>
              Escolha o aluno
            </option>
            {student.map((option, index) => (
              <option key={index} value={option.id}>
                {option.fullname}
              </option>
            ))}
          </select>
          <div>
            <input
              style={{
                padding: "0.5rem",
                borderRadius: 6,
                border: `1px solid ${lightGreyColor()}`,
                fontSize: "1rem",
                marginBottom: 12,
              }}
              type="date"
              placeholder="Data"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
            />
            <div
              style={{
                marginBottom: "1.5rem",
                border: `1px solid ${lightGreyColor()}`,
                borderRadius: 6,
                background: "#fff",
                padding: 8,
              }}
            >
              <HTMLEditor
                key={editorKey} // Force re-render when key changes
                initialContent={newHWDescription}
                onChange={handleHWDescriptionChange}
              />
            </div>
          </div>
          <ArvinButton
            style={{ borderRadius: 8, fontWeight: 600 }}
            onClick={postHW}
          >
            Postar só HW -
          </ArvinButton>
        </div>
      )}
    </div>
  );
}

export default NewHomeworkAssignment;
