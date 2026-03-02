import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import {
  partnerColor,
  textpartnerColorContrast,
  alwaysWhite,
  transparentWhite,
} from "../../../../Styles/Styles";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import axios from "axios";

// Lista de categorias de eventos
const categoryList = [
  { text: "Aula Experimental", value: "Test" },
  { text: "Aula Única", value: "Standalone" },
  { text: "Aula Geral", value: "Group Class" },
  { text: "Aula de um Grupo", value: "Established Group Class" },
  { text: "Aula de Reposição", value: "Rep" },
  { text: "Aula de Prêmio", value: "Prize Class" },
  { text: "Aula Particular Individual", value: "Tutoring" },
  { text: "Horário Vazio para Reposição", value: "Marcar Reposição" },
];

interface NewEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  headers: any;
  myId: string | number;
  onEventCreated: () => void;
  initialDate?: string;
}

function NewEventModal({
  isVisible,
  onClose,
  headers,
  myId,
  onEventCreated,
  initialDate,
}: NewEventModalProps) {
  // Estados do formulário
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [groupsList, setGroupsList] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isTutoring, setIsTutoring] = useState(false);
  const [duration, setDuration] = useState(60); // Duração padrão de 60 minutos

  const { UniversalTexts } = useUserContext();

  // Buscar estudantes e Turmas
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        { headers }
      );
      const res = response.data.listOfStudents;
      setStudentsList(res || []);
    } catch (error: any) {
      console.log(error, "Erro ao buscar estudantes e Turmas");
    }
  };
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/groups/${myId}`, {
        headers,
      });
      const res = response.data.groups;
      setGroupsList(res || []);
    } catch (error: any) {
      console.log(error, "Erro ao buscar estudantes e Turmas");
    }
  };

  // Carregar dados quando modal abrir
  useEffect(() => {
    if (isVisible) {
      fetchStudents();
      fetchGroups();
      if (initialDate) {
        setDate(initialDate);
      }
    }
  }, [isVisible, initialDate]);

  // Limpar formulário quando fechar
  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const resetForm = () => {
    setCategory("");
    setDate(initialDate || new Date().toISOString().split("T")[0]);
    setTime("");
    setLink("");
    setDescription("");
    setSelectedStudentId("");
    setSelectedGroupId("");
    setIsTutoring(false);
    setDuration(60);
  };

  // Handler para mudança de categoria
  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);

    // Configurar campos automaticamente baseado na categoria
    switch (selectedCategory) {
      case "Rep":
        setDescription("Aula de Reposição referente ao dia");
        setIsTutoring(true);
        break;
      case "Standalone":
        setDescription(
          UniversalTexts.calendarModal?.singleClassOf || "Aula avulsa"
        );
        setIsTutoring(false);
        break;
      case "Group Class":
        setDescription(
          UniversalTexts.calendarModal?.classTheme || "Tema da aula"
        );
        setIsTutoring(false);
        break;
      case "Established Group Class":
        setDescription("Aula do grupo");
        setIsTutoring(false);
        break;
      case "Test":
        setDescription("");
        setIsTutoring(false);
        break;
      case "Prize Class":
        setDescription("");
        setIsTutoring(true);
        break;
      case "Tutoring":
        setDescription("");
        setIsTutoring(true);
        break;
      case "Marcar Reposição":
        setDescription("Horário reservado para reposição");
        setIsTutoring(false);
        break;
      default:
        setDescription("");
        setIsTutoring(false);
    }
  };

  // Criar evento
  const handleCreateEvent = async () => {
    if (!category || !date || !time) {
      notifyAlert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (isTutoring && !selectedStudentId) {
      notifyAlert("Por favor, selecione um estudante para aulas particulares.");
      return;
    }

    if (category === "Established Group Class" && !selectedGroupId) {
      notifyAlert("Por favor, selecione um grupo para aulas em grupo.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/event/${myId}`,
        {
          category,
          studentID: isTutoring ? selectedStudentId : null,
          group: selectedGroupId || null,
          date,
          time,
          link,
          description,
          duration,
        },
        { headers }
      );

      if (response.data) {
        notifyAlert("Evento criado com sucesso!", partnerColor());
        onEventCreated();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      notifyAlert(
        error?.response?.data?.message || "Erro ao criar evento",
        "red"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: transparentWhite(),
          zIndex: 98,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: alwaysWhite(),
            borderRadius: "8px",
            padding: "2rem",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            border: "1px solid #e9ecef",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              borderBottom: "2px solid #f8f9fa",
              paddingBottom: "1rem",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#333",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              🎯 Nova Aula
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#666",
                padding: "8px",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.color = partnerColor();
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }}
            >
              ×
            </button>
          </div>

          {/* Formulário */}
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {/* Categoria */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#495057",
                  fontSize: "0.9rem",
                }}
              >
                📋 Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              >
                <option value="">Selecione uma categoria</option>
                {categoryList.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  📅 Data *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  ⏰ Horário *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                />
              </div>
            </div>

            {/* Duração */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#495057",
                  fontSize: "0.9rem",
                }}
              >
                ⏱️ Duração (minutos) *
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
                <option value={90}>90 minutos</option>
                <option value={120}>120 minutos</option>
              </select>
            </div>

            {/* Seleção de Estudante (se for tutoring) */}
            {isTutoring && (
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  👤 Estudante *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                >
                  <option value="">Selecione um estudante</option>
                  {studentsList.map((student) => {
                    const studentId = student._id || student.id;
                    return (
                      <option key={studentId} value={studentId}>
                        {student.name} {student.lastname}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Seleção de Grupo (se for Group Class ou Established Group Class) */}
            {category === "Established Group Class" && (
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "0.9rem",
                  }}
                >
                  👥 Grupo *
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value);
                    console.log(e.target.value);
                  }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                >
                  <option
                    style={{
                      color: "#000",
                    }}
                    value=""
                  >
                    Selecione um grupo
                  </option>
                  {groupsList.map((group: any) => {
                    const groupId = group._id || group.id;
                    return (
                      <option
                        style={{ color: "#000" }}
                        key={groupId}
                        value={groupId}
                      >
                        {group.groupName || group.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Link da Aula */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#495057",
                  fontSize: "0.9rem",
                }}
              >
                🔗 Link da Aula
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                  cursor: loading ? "not-allowed" : "text",
                }}
                onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </div>

            {/* Descrição */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#495057",
                  fontSize: "0.9rem",
                }}
              >
                📝 Descrição
              </label>
              <textarea
                placeholder="Descreva o conteúdo da aula..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                  cursor: loading ? "not-allowed" : "text",
                  resize: "vertical",
                }}
                onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2rem",
              paddingTop: "1rem",
              borderTop: "2px solid #f8f9fa",
            }}
          >
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 24px",
                border: "2px solid #dee2e6",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateEvent}
              disabled={loading || !category || !date || !time}
              style={{
                flex: 2,
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor:
                  loading || !category || !date || !time
                    ? "not-allowed"
                    : "pointer",
                backgroundColor:
                  loading || !category || !date || !time
                    ? "#ccc"
                    : partnerColor(),
                color: textpartnerColorContrast(),
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} style={{ color: "white" }} />
                  Criando...
                </>
              ) : (
                <>🎯 Criar Aula</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewEventModal;
