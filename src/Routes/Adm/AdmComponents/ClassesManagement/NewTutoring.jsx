import React, { useEffect, useState } from "react";
import { HOne } from "../../../../Resources/Components/RouteBox";
import axios from "axios";
import { DivGrid, backDomain } from "../../../../Resources/UniversalComponents";
import { CircularProgress, TextField } from "@mui/material";
import { lightGreyColor, partnerColor } from "../../../../Styles/Styles";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyError } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function NewTutoring({ headers, id }) {
  const [newDate, setNewDate] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [importantLink, setImportantLink] = useState("");
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

  const [showHW, setShowHW] = useState(false);
  const [showFC, setShowFC] = useState(false);

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
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers,
      });
      setStudent(response.data.listOfStudents);
      setLoadingS(false);
    } catch (error) {
      notifyError("Erro ao encontrar alunos");
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  const handleAddTutoring = () => {
    if (
      !selectedStudentID ||
      selectedStudentID === "" ||
      selectedStudentID === "Aluno"
    ) {
      notifyError("Selecione um aluno antes de adicionar a aula!");
      return;
    }
    const newTutoring = {
      date: "",
      studentID: selectedStudentID,
      videoUrl: "",
      importantLink: "",
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
      notifyError("Aulas criadas com sucesso!");
      setTutorings([]);
      setNewHWDescription("");
      setButton("Criar");
    } catch (error) {
      setButton("Criar");
      notifyError("Erro ao salvar aulas");
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
      notifyError("HW criado com sucesso!");
      setTutorings([]);
      setNewHWDescription("");
      setLoadingHW(false);
    } catch (error) {
      setLoadingHW(false);
      notifyError("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

  const isFormValid =
    tutorings.length > 0 &&
    tutorings.every((t) => t.videoUrl && t.importantLink && t.date);

  useEffect(() => {
    console.log("New Flashcards:", newFlashcards);
  }, [newFlashcards]);

  return (
    <div style={{ background: "#fff", fontFamily: "inherit" }}>
      <HOne style={{ marginBottom: 24, textAlign: "center", fontWeight: 700 }}>
        Postar aula particular dada
      </HOne>
      {loadingS ? (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <CircularProgress style={{ color: partnerColor() }} />
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
              onChange={(e) => {
                setSelectedStudentID(e.target.value);
                setTutorings(
                  tutorings.map((t) => ({ ...t, studentID: e.target.value }))
                );
                console.log(
                  e.target.value,
                  "selectedStudentID",
                  selectedStudentID
                );
                console.log(tutorings, "tutorings after change");
              }}
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
                backgroundColor: partnerColor(),
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
                    newTutorings[index] = {
                      ...newTutorings[index],
                      videoUrl: e.target.value,
                      studentID: selectedStudentID,
                    };
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
                  value={tutoring.importantLink}
                  onChange={(e) => {
                    const newTutorings = [...tutorings];
                    newTutorings[index].importantLink = e.target.value;
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
                <input
                  style={{
                    padding: "0.5rem",
                    borderRadius: 6,
                    border: `1px solid ${lightGreyColor()}`,
                    fontSize: "1rem",
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const forbiddenTypes = [
                      "audio/mpeg",
                      "audio/mp3",
                      "audio/wav",
                      "audio/ogg",
                      "video/mp4",
                      "video/avi",
                      "video/mov",
                      "video/wmv",
                      "video/mkv",
                    ];

                    if (
                      forbiddenTypes.includes(file.type) ||
                      file.name.toLowerCase().endsWith(".mp3") ||
                      file.name.toLowerCase().endsWith(".mp4")
                    ) {
                      notifyError(
                        "Arquivos de áudio e vídeo não são permitidos!"
                      );
                      e.target.value = "";
                      return;
                    }

                    // // Verificar tamanho do arquivo (aproximadamente 7 páginas de PDF = ~3.5MB)
                    // const maxSizeInBytes = 3.5 * 1024 * 1024; // 3.5MB
                    // if (file.size > maxSizeInBytes) {
                    //   notifyError(
                    //     "Arquivo muito grande! O limite é de aproximadamente 7 páginas de PDF (3.5MB)."
                    //   );
                    //   e.target.value = "";
                    //   return;
                    // }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64String = event.target.result;
                      console.log(
                        "Arquivo convertido para base64:",
                        base64String
                      );
                      const newTutorings = [...tutorings];
                      newTutorings[index] = {
                        ...newTutorings[index],
                        importantLink,
                        base64String,
                        fileName: file.name,
                        fileType: file.type,
                      };
                      setTutorings(newTutorings);
                    };

                    reader.onerror = () => {
                      notifyError("Erro ao processar o arquivo!");
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {!showFC && (
                    <ArvinButton
                      style={{
                        background: partnerColor(),
                        color: "#fff",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "0.5rem 1.2rem",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowFC(true);
                      }}
                    >
                      + Flashcards
                    </ArvinButton>
                  )}
                  {!showHW && (
                    <ArvinButton
                      style={{
                        background: partnerColor(),
                        color: "#fff",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "0.5rem 1.2rem",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowHW(true);
                      }}
                    >
                      + Homework
                    </ArvinButton>
                  )}
                </div>
              </DivGrid>

              {/* Flashcards */}
              {showFC && (
                <div
                  style={{
                    marginTop: 16,
                    border: `1px solid ${lightGreyColor()}`,
                    borderRadius: 8,
                    background: "#fff",
                    padding: 12,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>Flashcards</strong>
                    <ArvinButton
                      style={{
                        background: "#eee",
                        color: "#888",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        padding: "0.2rem 0.8rem",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowFC(false);
                        setNewFlashcardsList("");
                      }}
                    >
                      Remover
                    </ArvinButton>
                  </div>
                  <TextField
                    multiline
                    minRows={2}
                    maxRows={6}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: partnerColor() },
                        "&:hover fieldset": { borderColor: partnerColor() },
                        "&.Mui-focused fieldset": {
                          borderColor: partnerColor(),
                        },
                      },
                      "& label": { color: partnerColor() },
                      "& label.Mui-focused": { color: partnerColor() },
                    }}
                    variant="outlined"
                    placeholder="Escreva os flashcards aqui"
                    value={newFlashcards}
                    onChange={(e) => setNewFlashcardsList(e.target.value)}
                  />
                </div>
              )}

              {/* Homework */}
              {showHW && (
                <div
                  style={{
                    marginTop: 16,
                    border: `solid 2px ${lightGreyColor()}`,
                    borderRadius: 8,
                    background: "#fff",
                    padding: 16,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <HThree>Homework</HThree>
                    <ArvinButton
                      style={{
                        background: "#eee",
                        color: "#888",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        padding: "0.2rem 0.8rem",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowHW(false);
                        setDueDate("");
                        setNewHWDescription("");
                      }}
                    >
                      Remover
                    </ArvinButton>
                  </div>
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
              )}
            </div>
          ))}
          <ArvinButton
            style={{
              marginLeft: "auto",
              cursor: disabled || !isFormValid ? "not-allowed" : "pointer",
              backgroundColor: partnerColor(),
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
    </div>
  );
}

export default NewTutoring;
