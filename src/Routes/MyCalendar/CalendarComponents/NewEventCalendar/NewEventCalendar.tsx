import React, { useState } from "react";
import axios from "axios";
import { categoryList } from "../MyCalendarFunctions/MyCalendarFunctions";
import { partnerColor, transparentWhite } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";
import { HTwo } from "../../../../Resources/Components/RouteBox";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
interface NewEventCalendarProps {
  headers: any; // ajuste para o tipo correto (ex.: Record<string,string>)
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  alternateBoolean: boolean;
  setAlternateBoolean: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  studentsList?: Array<{ id: string | number; name: string }>;
  groupsList?: Array<{ id: string | number; name: string }>;
}

function NewEventCalendar({
  headers,
  thePermissions,
  myId,
  setChange,
  alternateBoolean,
  setAlternateBoolean,
  change,
  studentsList = [],
  groupsList = [],
}: NewEventCalendarProps) {
  const { UniversalTexts } = useUserContext();

  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [loadingNewClass, setLoadingNewClass] = useState(false);
  const [newClass, setNewClass] = useState({
    date: "",
    time: "",
    group: "",
    link: "",
    description: "",
    category: "",
    duration: 45,
    studentId: "",
  });

  // Opcional: usar permissões para exibir/ocultar ou bloquear abertura
  const authorizeOrNot =
    thePermissions === "superadmin" || thePermissions === "teacher";

  const handleNewClassChange = (field: any, value: any) => {
    setNewClass((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewClassCategoryChange = (e: any) => {
    const category = e.target.value;
    let description = "";

    switch (category) {
      case "Rep":
        description = "Aula de Reposição referente ao dia";
        break;
      case "Standalone":
        description = UniversalTexts?.calendarModal?.singleClassOf ?? "";
        break;
      case "Group Class":
        description = UniversalTexts?.calendarModal?.classTheme ?? "";
        break;
      case "Prize Class":
      case "Tutoring":
      default:
        break;
    }

    setNewClass((prev) => ({ ...prev, category, description }));
  };

  const handleCloseNewClassForm = () => {
    setShowNewClassForm(false);
    setNewClass({
      date: "",
      time: "",
      group: "",
      link: "",
      description: "",
      category: "",
      duration: 45,
      studentId: "",
    });
  };

  const handleCreateNewClass = async () => {
    setLoadingNewClass(true);
    try {
      const payload = {
        date: newClass.date,
        time: newClass.time,
        link: newClass.link,
        group: newClass.group || "",
        description: newClass.description,
        category: newClass.category,
        duration: newClass.duration, // sem fallback incoerente
        // Se a API exige "studentID" (D maiúsculo), mapeamos aqui:
        studentID: newClass.studentId || null,
        teacherId: myId,
        status: "marcado",
      };

      const response = await axios.post(
        `${backDomain}/api/v1/event/${myId}`,
        payload,
        { headers }
      );

      if (response.status >= 200 && response.status < 300) {
        notifyAlert("Aula criada com sucesso!", partnerColor());
        handleCloseNewClassForm();
        setChange?.(!change); // opcional: força refresh externo
      } else {
        throw new Error(`Falha na criação: status ${response.status}`);
      }
    } catch (error) {
      console.log("❌ Erro ao criar nova aula:", error);
      notifyAlert("Erro ao criar aula. Tente novamente.", partnerColor());
    } finally {
      setAlternateBoolean(!alternateBoolean);
      setLoadingNewClass(false);
    }
  };

  // Regras condicionais: aluno obrigatório para Tutoring/Prize/Rep; turma para Established Group Class
  const needsStudent = ["Tutoring", "Prize Class", "Rep"].includes(
    newClass.category
  );
  const needsGroup = newClass.category === "Established Group Class";

  const a = "dd";

  const isDisabled =
    !newClass.category ||
    !newClass.date ||
    !newClass.time ||
    !newClass.link ||
    !newClass.description ||
    (needsStudent && !newClass.studentId) ||
    (needsGroup && !newClass.group);

  return (
    <>
      {/* Exemplo de trigger para abrir o modal (opcional, remova se já controla de fora) */}
      {authorizeOrNot && (
        <button
          onClick={() => {
            setChange(!change);
            setShowNewClassForm(true);
          }}
        >
          + Aula Única
        </button>
      )}
      {/* Overlay */}
      <div
        style={{
          backgroundColor: transparentWhite(),
          position: "fixed",
          inset: 0,
          zIndex: 99,
          display: showNewClassForm ? "block" : "none",
        }}
        onClick={handleCloseNewClassForm}
      />

      {/* Modal */}
      <div
        className="modal box-shadow-white"
        style={{
          position: "fixed",
          display: showNewClassForm ? "block" : "none",
          zIndex: 100,
          backgroundColor: "#fff",
          width: "90vw",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "6px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {loadingNewClass ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
            <p style={{ marginTop: "1rem", color: "#666" }}>
              Criando nova aula...
            </p>
          </div>
        ) : (
          <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid #e9ecef",
              }}
            >
              <HTwo
                style={{
                  margin: 0,
                  color: partnerColor(),
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <i className="fa fa-plus-circle" />
                Criar Nova Aula
              </HTwo>
              <button
                onClick={handleCloseNewClassForm}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#998",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.color = partnerColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#998";
                }}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {/* Categoria */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  📋 Categoria da Aula
                </label>
                <select
                  value={newClass.category}
                  onChange={handleNewClassCategoryChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="" hidden>
                    Selecione a categoria...
                  </option>
                  {categoryList.map((cat, index) => (
                    <option key={index} value={cat.value}>
                      {cat.text}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Selection (if tutoring-like) */}
              {(newClass.category === "Tutoring" ||
                newClass.category === "Prize Class" ||
                newClass.category === "Rep") && (
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "0.9rem",
                    }}
                  >
                    👤 Selecionar Aluno
                  </label>
                  <select
                    value={newClass.studentId}
                    onChange={(e) =>
                      handleNewClassChange("studentId", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #ced4da",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="" hidden>
                      Selecione o aluno...
                    </option>
                    {studentsList.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.name} {student.lastname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Group Selection */}
              {newClass.category === "Established Group Class" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "0.9rem",
                    }}
                  >
                    👥 Selecionar Turma
                  </label>
                  <select
                    value={newClass.group}
                    onChange={(e) =>
                      handleNewClassChange("group", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #ced4da",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="" hidden>
                      Selecione o turma...
                    </option>
                    {groupsList.map((group: any) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Data */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  📅 Data
                </label>
                <input
                  type="date"
                  value={newClass.date}
                  onChange={(e) => handleNewClassChange("date", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Horário */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  ⏰ Horário
                </label>
                <input
                  type="time"
                  value={newClass.time}
                  onChange={(e) => handleNewClassChange("time", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Duração */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.3rem",
                    fontWeight: 500,
                    color: "#6c757d",
                    fontSize: "0.8rem",
                  }}
                >
                  Duração
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[30, 45, 60, 90, 120].map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => handleNewClassChange("duration", minutes)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: `1px solid ${
                          newClass.duration === minutes ? "#adb5bd" : "#e9ecef"
                        }`,
                        backgroundColor:
                          newClass.duration === minutes ? "#f8f9fa" : "white",
                        color:
                          newClass.duration === minutes ? "#495057" : "#6c757d",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        transition: "all 0.15s ease",
                        minWidth: "auto",
                      }}
                    >
                      {minutes < 60
                        ? `${minutes}min`
                        : `${Math.floor(minutes / 60)}h${
                            minutes % 60 ? ` ${minutes % 60}min` : ""
                          }`}
                    </button>
                  ))}
                  <input
                    type="number"
                    value={newClass.duration}
                    onChange={(e) =>
                      handleNewClassChange(
                        "duration",
                        parseInt(e.target.value, 10) || 60
                      )
                    }
                    min={15}
                    max={240}
                    style={{
                      width: 50,
                      padding: "0.25rem",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                      fontSize: "0.75rem",
                      textAlign: "center",
                      marginLeft: "0.25rem",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#adb5bd",
                      alignSelf: "center",
                    }}
                  >
                    min
                  </span>
                </div>
              </div>

              {/* Link */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  🔗 Link da Reunião
                </label>
                <input
                  type="url"
                  value={newClass.link}
                  onChange={(e) => handleNewClassChange("link", e.target.value)}
                  placeholder="https://meet.google.com/..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  📝 Descrição da Aula
                </label>
                <input
                  type="text"
                  value={newClass.description}
                  onChange={(e) =>
                    handleNewClassChange("description", e.target.value)
                  }
                  placeholder="Descreva o conteúdo da aula..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Ações */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <button
                  onClick={handleCloseNewClassForm}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                  }}
                >
                  <i
                    className="fa fa-times"
                    style={{ marginRight: "0.5rem" }}
                  />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewClass}
                  disabled={isDisabled}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: partnerColor(),
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    opacity: isDisabled ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  <i className="fa fa-plus" style={{ marginRight: "0.5rem" }} />
                  Criar Aula
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NewEventCalendar;
