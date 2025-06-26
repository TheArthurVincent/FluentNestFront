import React, { useEffect, useState } from "react";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import axios from "axios";
import { DivGrid, backDomain } from "../../../../Resources/UniversalComponents";
import { CircularProgress, TextField } from "@mui/material";
import { lightGreyColor, secondaryColor } from "../../../../Styles/Styles";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";

export function NewTutoring({ headers }) {
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
    console.log(htmlContent);
  };

  const [selectedStudentID, setSelectedStudentID] = useState("");
  const [student, setStudent] = useState([]);
  const [standardValue, setStandardValue] = useState("Aluno");
  const [button, setButton] = useState("Criar");
  const [tutorings, setTutorings] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loadingS, setLoadingS] = useState(true);

  const fetchStudents = async () => {
    setLoadingS(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
        headers,
      });
      setStudent(response.data.listOfStudents);
      setLoadingS(false);
    } catch (error) {
      alert("Erro ao encontrar alunos");
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
    setButton(<CircularProgress style={{ color: secondaryColor() }} />);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/tutoring/`,
        { tutorings, description: newHWDescription, dueDate, newFlashcards },
        {
          headers,
        }
      );
      alert("Aulas criadas com sucesso!");
      setTutorings([]);
      setNewHWDescription("");
      setButton("Criar");
    } catch (error) {
      setButton("Criar");
      alert("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

  const postHW = async () => {
    setLoadingHW(true);
    setLoadingHW(true);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/homework/${selectedStudentID}`,
        { description: newHWDescription, dueDate },
        {
          headers,
        }
      );
      alert("HW criado com sucesso!");
      setTutorings([]);
      setNewHWDescription("");
      setLoadingHW(false);
    } catch (error) {
      setLoadingHW(false);
      alert("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

  const setStudentList = (e) => {
    setSelectedStudentID(e);
    setDisabled(false);
  };

  useEffect(() => {
    console.log("New Flashcards:", newFlashcards);
  }, [newFlashcards]);

  const postFC = async () => {
    setLoadingFlashcards(true);
  };
  return (
    <div
      style={{
        margin: "2rem auto",
        background: "#fff",
        padding: "2rem",
        fontFamily: "inherit",
      }}
    >
      <HTwo style={{ marginBottom: 24, textAlign: "center", fontWeight: 700 }}>
        Postar aula particular dada
      </HTwo>
      {loadingS ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <CircularProgress style={{ color: secondaryColor() }} />
        </div>
      ) : (
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          onSubmit={handleSubmit}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
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
            <div
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: secondaryColor(),
                color: "#fff",
                padding: "0.6rem 1.2rem",
                fontWeight: 600,
                fontSize: "1rem",
                textAlign: "center",
                transition: "background 0.2s",
                userSelect: "none",
              }}
              onClick={handleAddTutoring}
            >
              + Aula
            </div>
          </div>
          {tutorings.map((tutoring, index) => (
            <div
              key={index}
              style={{
                marginBottom: 16,
                border: `1px solid ${lightGreyColor()}`,
                borderRadius: 8,
                padding: 16,
                background: "#fafbfc",
              }}
            >
              <DivGrid>
                <input
                  style={{
                    padding: "0.5rem",
                    borderRadius: 6,
                    border: `1px solid ${lightGreyColor()}`,
                    fontSize: "1rem",
                  }}
                  required
                  type="text"
                  placeholder="Vídeo da Aula (YouTube ou Vimeo)"
                  value={tutoring.videoUrl}
                  onChange={(e) => {
                    const newTutorings = [...tutorings];
                    newTutorings[index].videoUrl = e.target.value;
                    setTutorings(newTutorings);
                  }}
                />
                <input
                  style={{
                    padding: "0.5rem",
                    borderRadius: 6,
                    border: `1px solid ${lightGreyColor()}`,
                    fontSize: "1rem",
                  }}
                  required
                  type="text"
                  placeholder="Pasta da Aula"
                  value={tutoring.attachments}
                  onChange={(e) => {
                    const newTutorings = [...tutorings];
                    newTutorings[index].attachments = e.target.value;
                    setTutorings(newTutorings);
                  }}
                />
                <input
                  type="date"
                  placeholder="Data"
                  value={tutoring.date}
                  onChange={(e) => {
                    const newTutorings = [...tutorings];
                    newTutorings[index].date = e.target.value;
                    setTutorings(newTutorings);
                  }}
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: 6,
                    border: `1px solid ${lightGreyColor()}`,
                    fontSize: "1rem",
                  }}
                />
                <div style={{ minWidth: 180 }}>
                  <strong style={{ fontSize: 15 }}>Flashcards</strong>
                  <div
                    style={{
                      border: `1px solid ${lightGreyColor()}`,
                      borderRadius: 6,
                      background: "#fff",
                      padding: 6,
                    }}
                  >
                    <TextField
                      multiline
                      minRows={2}
                      maxRows={6}
                      fullWidth
                      variant="outlined"
                      placeholder="Escreva os flashcards aqui"
                      value={newFlashcards}
                      onChange={(e) => setNewFlashcardsList(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    padding: "0.7rem 1.2rem",
                    borderRadius: 8,
                    backgroundColor: "#eaeaea",
                    fontWeight: 600,
                    textAlign: "center",
                    userSelect: "none",
                  }}
                  onClick={() => {
                    setDueDate("");
                    setNewHWDescription("");
                    setSeeHW(!seeHW);
                  }}
                >
                  HW
                </div>
              </DivGrid>
              <div
                style={{
                  display: seeHW ? "block" : "none",
                  marginTop: 12,
                }}
              >
                <HThree>Homework</HThree>
                <div
                  style={{
                    display: "grid",
                    padding: "1rem",
                    border: `solid 2px ${lightGreyColor()}`,
                    borderRadius: 8,
                    background: "#fff",
                  }}
                >
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
                  <div style={{ marginBottom: "1rem" }}>
                    <HTMLEditor onChange={handleHWDescriptionChange} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <ArvinButton
            disabled={disabled}
            style={{
              marginLeft: "auto",
              cursor: disabled ? "not-allowed" : "pointer",
              minWidth: 120,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: "0.7rem 2rem",
            }}
            type="submit"
          >
            {button}
          </ArvinButton>
        </form>
      )}
      <div
        style={{
          marginTop: 32,
          padding: "1.5rem",
          background: "#fafbfc",
          borderRadius: 10,
          boxShadow: "0 1px 8px #0001",
        }}
      >
        {loadingHW ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress style={{ color: secondaryColor() }} />
          </div>
        ) : (
          <div>
            <HTwo style={{ marginBottom: 12 }}>Homework</HTwo>
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
                <HTMLEditor onChange={handleHWDescriptionChange} />
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
      <div
        style={{
          marginTop: 32,
          padding: "1.5rem",
          background: "#fafbfc",
          borderRadius: 10,
          boxShadow: "0 1px 8px #0001",
        }}
      >
        {loadingFlashcards ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress style={{ color: secondaryColor() }} />
          </div>
        ) : (
          <div>
            <HTwo style={{ marginBottom: 12 }}>Flashcards</HTwo>
            <div
              style={{
                border: `1px solid ${lightGreyColor()}`,
                borderRadius: 6,
                background: "#fff",
                padding: 8,
                marginBottom: 12,
              }}
            >
              <HTMLEditor onChange={handleHWDescriptionChange} />
            </div>
            <ArvinButton
              style={{ borderRadius: 8, fontWeight: 600 }}
              onClick={postFC}
            >
              Postar só Flashcards -
            </ArvinButton>
          </div>
        )}
      </div>
    </div>
  );
  // ...existing code...
}

export default NewTutoring;
