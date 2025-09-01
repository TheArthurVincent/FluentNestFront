import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  backDomain,
  isValidCPF,
} from "../../../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../../Styles/Styles";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne, HTwo } from "../../../../../Resources/Components/RouteBox";
import EditResponsibleModal from "./ModalEditResponsible/EditResponsibleModal";

export function AllResponsibles({ headers, id, flag, setFlag, myId }) {
  const [responsibles, setResponsibles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResponsibles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/responsibles/${id}`,
        { headers }
      );
      setResponsibles(response.data.responsibles || []);
    } catch (error) {
      notifyAlert(`Erro`);
    }
    setLoading(false);
  };
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResponsibles();
  }, [flag]);

  const filteredResponsibles = responsibles.filter((resp) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const responsibleMatch =
      resp.name?.toLowerCase().includes(term) ||
      resp.lastname?.toLowerCase().includes(term);

    const studentsMatch =
      resp.students &&
      resp.students.some(
        (student) =>
          student.name?.toLowerCase().includes(term) ||
          student.lastname?.toLowerCase().includes(term)
      );

    return responsibleMatch || studentsMatch;
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        padding: "24px",
        margin: "16px 0",
      }}
    >
      <HOne style={{ color: partnerColor(), marginBottom: 16 }}>
        Lista de Responsáveis
      </HOne>
      <input
        style={{
          width: "100%",
          padding: "12px 18px",
          marginBottom: "18px",
          border: `2px solid ${partnerColor()}`,
          borderRadius: "10px",
          fontSize: "15px",
          outline: "none",
          transition: "all 0.2s ease",
          backgroundColor: "#f8f9fa",
          boxShadow: `0 1px 4px ${partnerColor()}15`,
        }}
        type="text"
        placeholder="Pesquisar responsável ou aluno..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={(e) => {
          e.target.style.borderColor = partnerColor();
          e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}30`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = partnerColor();
          e.target.style.boxShadow = `0 1px 4px ${partnerColor()}15`;
        }}
      />
      <div
        style={{
          maxHeight: "340px",
          overflowY: "auto",
          border: `1px solid ${partnerColor()}40`,
          borderRadius: "8px",
          background: "#fafbfc",
          padding: "12px",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        )}
        {filteredResponsibles.map((resp) => (
          <div
            key={resp._id}
            style={{
              marginBottom: "18px",
              paddingBottom: "12px",
              borderBottom: `1px solid ${partnerColor()}20`,
            }}
          >
            <HTwo
              style={{ color: partnerColor(), fontWeight: 600, fontSize: 18 }}
            >
              {resp.name} {resp.lastname}
            </HTwo>

            <span
              style={{
                color: "#555",
                fontSize: 14,
                marginLeft: 4,
                background: `${partnerColor()}10`,
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {resp.email}
            </span>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: partnerColor(), fontWeight: 500 }}>
                Alunos:
              </span>
              <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                {resp.students && resp.students.length > 0 ? (
                  resp.students.map((student) => (
                    <li
                      key={student._id}
                      style={{
                        marginBottom: 4,
                        fontSize: 15,
                        color: "#222",
                      }}
                    >
                      <span style={{ color: partnerColor(), fontWeight: 500 }}>
                        {student.name} {student.lastname}
                      </span>
                      <span style={{ color: "#666", marginLeft: 6 }}>
                        - {student.email}
                      </span>
                    </li>
                  ))
                ) : (
                  <li style={{ color: "#888", fontStyle: "italic" }}>
                    Nenhum aluno
                  </li>
                )}
              </ul>
            </div>
            <span
              style={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              <EditResponsibleModal
                headers={headers}
                id={resp._id}
                myID={id}
                flag={flag}
                setFlag={setFlag}
                email={resp.email}
                name={resp.name}
                lastname={resp.lastname}
                students={resp.students}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllResponsibles;
