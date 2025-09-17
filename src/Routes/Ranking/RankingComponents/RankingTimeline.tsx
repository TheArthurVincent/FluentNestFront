import React, { useEffect, useState } from "react";
import {
  lightGreyColor,
  partnerColor,
  textPrimaryColorContrast,
} from "../../../Styles/Styles";
import axios from "axios";
import { backDomain, formatDate } from "../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";

interface RankingTimeLineProps {
  headers: MyHeadersType | null;
  id: string;
  name: string;
  permissions: string;
}

export default function RankingTimeline({
  headers,
  id,
  name,
  permissions,
}: RankingTimeLineProps) {
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
          {
            headers: actualHeaders,
          }
        );
        setStudentsList(response.data.listOfStudents);
      } catch (error) {
        alert("Erro ao encontrar alunos");
      }
    }
  };

  const seeScore = async (id: string) => {
    setLoading(true);
    fetchStudents();
    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: actualHeaders,
      });
      setLocalTimeline(response.data.history);
      setLoading(false);
      setNewID(id);
      seeName(id);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  const seeName = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/studentname/${id}`,
        {
          headers: actualHeaders,
        }
      );
      setActualName(response.data.name);
      setLoading(false);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  useEffect(() => {
    seeScore(newID);
    fetchStudents();
  }, [newID, id]);

  const handleStudentChange = (event: any) => {
    setNewID(event.target.value);
    seeName(event.target.value);
  };
  const tableHeaderStyle = {
    padding: "10px",
    fontWeight: 700,
    textAlign: "left" as const,
    borderBottom: "2px solid #ddd",
  };

  const tableCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
  };

  return (
    <div
      style={{
        color: "#000",
        maxWidth: "960px",
        margin: "2rem auto",
      }}
    >
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
        <HOne>
          {UniversalTexts.rankingHistory} - {actualName}
        </HOne>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {permissions === "superadmin" ||
            (permissions === "teacher" && (
              <select
                onChange={handleStudentChange}
                value={newID}
                style={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontWeight: 500,
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

      <div
        style={{
          backgroundColor: lightGreyColor(),
          borderRadius: "6px",
          overflow: "auto",
          border: `2px solid ${lightGreyColor()}`,
          maxHeight: "28rem",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {item.score}
                  </td>
                  <td style={tableCellStyle}>{formatDate(item.date)}</td>
                  <td style={tableCellStyle}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
