import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";
import { backDomain, formatDate } from "../../../Resources/UniversalComponents";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { partnerColor, textPrimaryColorContrast } from "../../../Styles/Styles";
import { CircularProgress } from "@mui/material";

interface RankingTimeLineArvinProps {
  headers: MyHeadersType | null;
  id: string;
  name: string;
  permissions: string;
}

export default function RankingTimelineArvin({
  headers,
  id,
  name,
  permissions,
}: RankingTimeLineArvinProps) {
  const [localTimeline, setLocalTimeline] = useState<any>([]);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [actualName, setActualName] = useState<string>(name);
  const [newID, setNewID] = useState<string>(id);
  const [loading, setLoading] = useState<boolean>(true);
  const { UniversalTexts } = useUserContext();

  const actualHeaders = headers || {};

  const fetchStudents = async () => {
    if (permissions === "superadmin" || permissions === "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${id}`,
          { headers: actualHeaders }
        );
        setStudentsList(response.data.listOfStudents);
      } catch (error) {
        alert("Erro ao encontrar alunos");
      }
    }
  };

  const seeScore = async () => {
    setLoading(true);
    fetchStudents();
    const { id } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: actualHeaders,
      });
      setLocalTimeline(response.data.history);
      setLoading(false);
      setNewID(id);
      seeName(id);
    } catch (error) {
      alert(error as any);
      console.error(error);
    }
  };

  const seeName = async (id: string) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/studentname/${id}`,
        { headers: actualHeaders }
      );
      setActualName(response.data.name);
      setLoading(false);
    } catch (error) {
      alert(error as any);
      console.error(error);
    }
  };

  useEffect(() => {
    seeScore();

    fetchStudents();
  }, [newID, id]);

  const handleStudentChange = (event: any) => {
    setNewID(event.target.value);
    seeName(event.target.value);
  };

  /* ======== estilos base coerentes com seu padrão ======== */
  const fontBase = {
    margin: "0 auto",
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600 as const,
    fontStyle: "SemiBold",
    fontSize: "14px",
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    ...fontBase,
  };

  const tableCellStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #eef0f2",
    verticalAlign: "top",
    ...fontBase,
  };

  return (
    <div
      style={{
        color: "#000",
        border: "1px solid #e8eaed",
        maxWidth: "960px",
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "12px",
        ...fontBase,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            ...fontBase,
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {UniversalTexts.rankingHistory} - {actualName}
        </h1>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {permissions === "superadmin" ||
            (permissions === "teacher" && (
              <select
                onChange={handleStudentChange}
                value={newID}
                style={{
                  // visual do input/seleção padronizado
                  width: "312px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  background: "#fff",
                  color: "#111827",
                  ...fontBase,
                }}
              >
                {studentsList.map((student: any, index: number) => (
                  <option key={index} value={student.id}>
                    {student.name + " " + student.lastname}
                  </option>
                ))}
              </select>
            ))}
        </div>
      </div>

      {/* Card da tabela */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          maxHeight: "28rem",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        ) : (
          <div style={{ overflow: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 600,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: partnerColor(),
                    color: textPrimaryColorContrast(),
                  }}
                >
                  <th style={tableHeaderStyle}>Score</th>
                  <th style={tableHeaderStyle}>Data</th>
                  <th style={tableHeaderStyle}>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {localTimeline.map((item: any, index: number) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td
                      style={{
                        ...tableCellStyle,
                        backgroundColor: partnerColor(),
                        color: textPrimaryColorContrast(),
                        fontWeight: 700,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        borderLeft: "1px solid transparent",
                      }}
                    >
                      {item.score}
                    </td>
                    <td style={{ ...tableCellStyle, whiteSpace: "nowrap" }}>
                      {formatDate(item.date)}
                    </td>
                    <td style={tableCellStyle}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
