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
      notifyAlert("Erro ao encontrar alunos");
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
      notifyAlert("Selecione um aluno antes de adicionar a aula!");
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
      // Configurar timeout maior para uploads de arquivos
      const config = {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60 segundos
      };

      const response = await axios.post(
        `${backDomain}/api/v1/tutoring/`,
        { tutorings, description: newHWDescription, dueDate, newFlashcards },
        config
      );
      notifyAlert("Aulas criadas com sucesso!", partnerColor());
      setTutorings([]);
      setNewHWDescription("");
      setNewFlashcardsList("");
      setDueDate("");
      setShowHW(false);
      setShowFC(false);
      setButton("Criar");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setButton("Criar");
      if (error.code === "ECONNABORTED") {
        notifyAlert("Timeout: Arquivo muito grande ou conexão lenta");
      } else {
        notifyAlert("Erro ao salvar aulas");
      }
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
      setTutorings([]);
      setNewHWDescription("");
      setLoadingHW(false);
    } catch (error) {
      setLoadingHW(false);
      notifyAlert("Erro ao salvar aulas");
      setStandardValue("Aluno");
    }
  };

  const isFormValid =
    tutorings.length > 0 &&
    tutorings.every((t) => t.videoUrl && t.importantLink && t.date);

  return (
    <div style={{ background: "#fff" }}>
      <HOne>Postar aula particular dada</HOne>
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
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Validação de tipo mais rigorosa
                    const allowedTypes = [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "text/plain",
                      "application/vnd.ms-excel",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      "application/vnd.ms-powerpoint",
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    ];

                    const allowedExtensions = [
                      ".pdf",
                      ".doc",
                      ".docx",
                      ".txt",
                      ".xlsx",
                      ".xls",
                      ".ppt",
                      ".pptx",
                      ".jpg",
                      ".jpeg",
                      ".png",
                    ];
                    const fileExtension = file.name
                      .toLowerCase()
                      .substring(file.name.lastIndexOf("."));

                    if (
                      !allowedTypes.includes(file.type) &&
                      !allowedExtensions.includes(fileExtension)
                    ) {
                      notifyAlert("Tipo de arquivo não permitido!");
                      e.target.value = "";
                      return;
                    }
                    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxSizeInBytes) {
                      notifyAlert(
                        "Arquivo muito grande! O limite é de 10MB.",
                        "red"
                      );
                      e.target.value = "";
                      return;
                    }
                    if (file.size === 0) {
                      notifyAlert("Arquivo está vazio!");
                      e.target.value = "";
                      return;
                    }

                    const reader = new FileReader();

                    reader.onload = (event) => {
                      try {
                        const base64String = event.target.result;

                        // Validar se o base64 foi gerado corretamente
                        if (!base64String || base64String.length < 100) {
                          notifyAlert(
                            "Erro ao processar o arquivo. Tente novamente."
                          );
                          e.target.value = "";
                          return;
                        }

                        // Remover o prefixo data:mime/type;base64, se necessário
                        const base64Data = base64String.includes(",")
                          ? base64String.split(",")[1]
                          : base64String;

                        const newTutorings = [...tutorings];
                        newTutorings[index] = {
                          ...newTutorings[index],
                          base64String: base64Data,
                          fileName: file.name,
                          fileType: file.type,
                          fileSize: file.size,
                        };
                        setTutorings(newTutorings);
                      } catch (error) {
                        console.error("Erro ao processar arquivo:", error);
                        notifyAlert("Erro ao processar o arquivo!");
                        e.target.value = "";
                      }
                    };

                    reader.onerror = (error) => {
                      console.error("Erro ao ler arquivo:", error);
                      notifyAlert("Erro ao ler o arquivo!");
                      e.target.value = "";
                    };

                    reader.onabort = () => {
                      notifyAlert(
                        "Leitura do arquivo foi cancelada!",
                        partnerColor()
                      );
                      e.target.value = "";
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
                    <HTMLEditor
                      onChange={handleHWDescriptionChange}
                      initialContent={"Type here"}
                    />
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
