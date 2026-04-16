import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { backDomain } from "../../../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../../../Styles/Styles";

export function EditResponsibleModal({
  headers,
  id,
  myID,
  flag,
  setFlag,
  email,
  name,
  lastname,
  students,
}) {
  const [loading, setLoading] = useState(false);
  const [seeModal, setSeeModal] = useState(false);
  const [seeDelete, setSeeDelete] = useState(false);

  const [theName, setTheName] = useState(name || "");
  const [theLastname, setTheLastname] = useState(lastname || "");
  const [theEmail, setTheEmail] = useState(email || "");
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(
    students ? students.map((s) => s._id) : [],
  );

  const modalRoot = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  useEffect(() => {
    setTheName(name || "");
    setTheLastname(lastname || "");
    setTheEmail(email || "");
    setSelectedStudentIds(students ? students.map((s) => s._id) : []);
  }, [name, lastname, email, students]);

  useEffect(() => {
    if (!seeModal) return;

    setSeeDelete(false);

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${backDomain}/api/v1/students/${myID}`, {
          headers,
        });
        setAllStudents(res.data.listOfStudents || []);
      } catch (error) {
        console.log(error);
        setAllStudents([]);
      }
    };

    fetchStudents();
  }, [seeModal, myID, headers]);

  useEffect(() => {
    if (!seeModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [seeModal]);

  const closeModal = () => {
    if (loading) return;
    setSeeDelete(false);
    setSeeModal(false);
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((currentId) => currentId !== studentId)
        : [...prev, studentId],
    );
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await axios.put(
        `${backDomain}/api/v1/responsible/${id}`,
        {
          name: theName,
          lastname: theLastname,
          email: theEmail,
          studentIds: selectedStudentIds,
        },
        { headers },
      );

      setFlag((prev) => !prev);
      setSeeModal(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(`${backDomain}/api/v1/responsible/${id}`, {
        headers,
      });

      setFlag((prev) => !prev);
      setSeeModal(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = seeModal ? (
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 999999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          padding: "28px",
          position: "relative",
        }}
      >
        <button
          onClick={closeModal}
          disabled={loading}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "26px",
            lineHeight: 1,
            cursor: "pointer",
            color: "#666",
          }}
        >
          ×
        </button>

        <h2
          style={{
            margin: "0 0 24px 0",
            color: partnerColor(),
            fontSize: "24px",
          }}
        >
          Editar responsável
        </h2>

        <div style={{ display: "grid", gap: "16px" }}>
          <label style={{ display: "grid", gap: "6px", color: "#333" }}>
            <span style={{ fontWeight: 600 }}>Nome</span>
            <input
              type="text"
              value={theName}
              onChange={(e) => setTheName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #d9d9d9",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "#333" }}>
            <span style={{ fontWeight: 600 }}>Sobrenome</span>
            <input
              type="text"
              value={theLastname}
              onChange={(e) => setTheLastname(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #d9d9d9",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "#333" }}>
            <span style={{ fontWeight: 600 }}>Email</span>
            <input
              type="text"
              value={theEmail}
              onChange={(e) => setTheEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #d9d9d9",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </label>

          <div style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 600, color: "#333" }}>Alunos</span>

            <div
              style={{
                border: "1px solid #e7e7e7",
                borderRadius: "12px",
                background: "#fafafa",
                padding: "12px",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {allStudents.length > 0 ? (
                allStudents.map((student) => {
                  const checked = selectedStudentIds.includes(student._id);

                  return (
                    <label
                      key={student._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 4px",
                        cursor: "pointer",
                        color: "#333",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxChange(student._id)}
                      />
                      <span>
                        {student.name} {student.lastname} - {student.email}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div style={{ color: "#888", fontStyle: "italic" }}>
                  Nenhum aluno encontrado
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            {seeDelete ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontWeight: 600, color: "#b00020" }}>
                  Excluir este responsável?
                </span>

                <button
                  onClick={() => setSeeDelete(false)}
                  disabled={loading}
                  style={{
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Não
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Excluindo..." : "Sim"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSeeDelete(true)}
                disabled={loading}
                style={{
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Excluir
              </button>
            )}
          </div>

          {!seeDelete && (
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                background: partnerColor(),
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setSeeModal(true)}
        style={{
          background: partnerColor(),
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        Editar
      </button>

      {modalRoot && ReactDOM.createPortal(modalContent, modalRoot)}
    </>
  );
}

export default EditResponsibleModal;
