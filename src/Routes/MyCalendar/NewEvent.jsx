import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewClassModal({
  // state
  showNewClassForm,
  loadingNewClass,
  newClass,

  // lists
  categoryList,
  studentsList,
  groupsList,

  // handlers
  handleCloseNewClassForm,
  handleCreateNewClass,
  handleNewClassChange,
  handleNewClassCategoryChange,

  // design tokens / helpers
  partnerColor,
  alwaysWhite,
  transparentWhite,

  // components (pra não depender de import aqui)
  HTwo,
}) {
  const isDisabled =
    !newClass.category || !newClass.date || !newClass.time || !newClass.link;

  // trava scroll do body quando abrir
  useEffect(() => {
    if (!showNewClassForm) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showNewClassForm]);

  // fecha no ESC
  useEffect(() => {
    if (!showNewClassForm) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseNewClassForm();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showNewClassForm, handleCloseNewClassForm]);

  if (!showNewClassForm) return null;

  const modalUI = (
    <>
      {/* Overlay */}
      <div
        style={{
          backgroundColor: transparentWhite(),
          position: "fixed",
          inset: 0,
          zIndex: 999998,
        }}
        onClick={handleCloseNewClassForm}
      />

      {/* Modal */}
      <div
        className="modal box-shadow-white"
        style={{
          position: "fixed",
          zIndex: 999999,
          backgroundColor: alwaysWhite(),
          width: "90vw",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "4px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
        role="dialog"
        aria-modal="true"
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
                  fontSize: "1rem",
                  color: "#998",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.color = partnerColor();
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#998";
                }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div style={{ display: "grid", gap: "1rem" }}>
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
                  📋 Categoria da Aula
                </label>

                <select
                  value={newClass.category}
                  onChange={handleNewClassCategoryChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
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

              {/* Student Selection (if tutoring) */}
              {(newClass.category === "Tutoring" ||
                newClass.category === "Prize Class" ||
                newClass.category === "Rep") && (
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
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="" hidden>
                      Selecione o aluno...
                    </option>

                    {studentsList.map((student, index) => (
                      <option key={index} value={student.id}>
                        {student.name} {student.lastname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Group Selection (if group) */}
              {newClass.category === "Established Group Class" && (
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
                    👤 Selecionar Grupo
                  </label>

                  <select
                    value={newClass.group}
                    onChange={(e) =>
                      handleNewClassChange("group", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="" hidden>
                      Selecione o grupo...
                    </option>

                    {groupsList.map((group, index) => (
                      <option key={index} value={group._id}>
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
                    fontWeight: "600",
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
                    borderRadius: "4px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Hora */}
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
                  ⏰ Horário
                </label>

                <input
                  type="time"
                  value={newClass.time}
                  onChange={(e) => handleNewClassChange("time", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
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
                    fontWeight: "500",
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
                          newClass.duration == minutes ? "#adb5bd" : "#e9ecef"
                        }`,
                        backgroundColor:
                          newClass.duration == minutes ? "#f8f9fa" : "white",
                        color:
                          newClass.duration == minutes ? "#495057" : "#6c757d",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "400",
                        transition: "all 0.15s ease",
                        minWidth: "auto",
                      }}
                    >
                      {minutes < 60
                        ? `${minutes}min`
                        : `${minutes / 60}h${
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
                        parseInt(e.target.value) || 60
                      )
                    }
                    min="15"
                    max="240"
                    style={{
                      width: "50px",
                      padding: "0.25rem",
                      borderRadius: "4px",
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
                    fontWeight: "600",
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
                    borderRadius: "4px",
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
                    fontWeight: "600",
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
                    borderRadius: "4px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              {/* Botões */}
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
                    padding: "0.75rem 1rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
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
                  onClick={() => handleCreateNewClass()}
                  disabled={isDisabled}
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: partnerColor(),
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
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

  return ReactDOM.createPortal(modalUI, document.body);
}
