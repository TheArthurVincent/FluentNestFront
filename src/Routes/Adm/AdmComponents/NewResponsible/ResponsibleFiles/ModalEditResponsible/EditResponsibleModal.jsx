import React, { useState, useEffect } from "react";
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
  const [theName, setTheName] = useState(name);
  const [theID, setTheID] = useState(id);
  const [theEmail, setTheEmail] = useState(email);
  const [theLastname, setTheLastname] = useState(lastname);
  const [seeModal, setSeeModal] = useState(false);
  const [seeDelete, setSeeDelete] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(
    students ? students.map((s) => s._id) : []
  );

  useEffect(() => {
    setSeeDelete(false);
    if (seeModal) {
      axios
        .get(`${backDomain}/api/v1/students/${myID}`, { headers })
        .then((res) => setAllStudents(res.data.listOfStudents || []))
        .catch(() => setAllStudents([]));
    }
  }, [seeModal, myID, headers]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/responsible/${id}`,
        {
          name: theName,
          lastname: theLastname,
          studentIds: selectedStudentIds,
          email: theEmail,
        },
        { headers }
      );
      console.log(response);
      setFlag((prev) => !prev);
      setSeeModal(false);
    } catch (err) {
      console.log(err);
      alert("Erro ao salvar");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/responsible/${theID}`,
        { headers }
      );
      console.log(response);
      setFlag((prev) => !prev);
      setSeeModal(false);
    } catch (err) {
      console.log(err);
      alert("Erro ao excluir");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setSeeModal(true)}
        style={{
          background: partnerColor(),
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Editar
      </button>
      {seeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0005",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
              padding: "32px",
              minWidth: "340px",
              maxWidth: "90vw",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSeeModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                color: partnerColor(),
                cursor: "pointer",
              }}
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 style={{ color: partnerColor(), marginBottom: 18 }}>
              Editar responsável
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, color: "#444" }}>
                Nome:
                <input
                  type="text"
                  value={theName}
                  onChange={(e) => setTheName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: 4,
                    border: `1px solid ${partnerColor()}60`,
                    borderRadius: "6px",
                    fontSize: 15,
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, color: "#444" }}>
                Sobrenome:
                <input
                  type="text"
                  value={theLastname}
                  onChange={(e) => setTheLastname(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: 4,
                    border: `1px solid ${partnerColor()}60`,
                    borderRadius: "6px",
                    fontSize: 15,
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, color: "#444" }}>
                Email:
                <input
                  type="text"
                  value={theEmail}
                  onChange={(e) => setTheEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: 4,
                    border: `1px solid ${partnerColor()}60`,
                    borderRadius: "6px",
                    fontSize: 15,
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: partnerColor(), fontWeight: 500 }}>
                Alunos:
              </span>
              <div
                style={{
                  maxHeight: 160,
                  overflowY: "auto",
                  border: "1px solid #eee",
                  borderRadius: 4,
                  background: "#fafbfc",
                  padding: "8px 6px",
                  marginTop: 8,
                }}
              >
                {allStudents.map((student) => (
                  <label
                    key={student._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 14,
                      color: "#444",
                      marginBottom: 6,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                      style={{ marginRight: 8 }}
                    />
                    {student.name} {student.lastname} - {student.email}
                  </label>
                ))}
                {allStudents.length === 0 && (
                  <div style={{ color: "#888", fontStyle: "italic" }}>
                    Nenhum aluno encontrado
                  </div>
                )}
              </div>
            </div>

            {seeDelete ? (
              <div>
                {" "}
                Excluir?
                <button
                  style={{
                    color: "white",
                    backgroundColor: partnerColor(),
                  }}
                  onClick={() => setSeeDelete(false)}
                >
                  Não
                </button>
                <button
                  style={{
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={handleDelete}
                >
                  Sim
                </button>{" "}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSeeDelete(true)}
                  disabled={loading}
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 24px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    marginTop: 12,
                  }}
                >
                  Excluir
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    background: partnerColor(),
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 24px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    marginTop: 12,
                  }}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EditResponsibleModal;
