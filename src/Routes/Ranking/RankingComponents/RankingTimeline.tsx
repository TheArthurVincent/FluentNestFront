import React, { useEffect, useState } from "react";
import {
  alwaysWhite,
  lightGreyColor,
  partnerColor,
  textPrimaryColorContrast,
  textpartnerColorContrast,
} from "../../../Styles/Styles";
import axios from "axios";
import { backDomain, formatDate } from "../../../Resources/UniversalComponents";
import { Button, CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { HOne } from "../../../Resources/Components/RouteBox";

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

  const actualHeaders = headers || {};

  const fetchStudents = async () => {
    if (permissions === "superadmin") {
      try {
        const response = await axios.get(`${backDomain}/api/v1/students/`, {
          headers: actualHeaders,
        });
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

  return (
    <div
      style={{
        top: "10%",
        fontSize: "10px",
        borderRadius: "6px",
        left: "30%",
        color: "#000",
        backgroundColor: textPrimaryColorContrast(),
        padding: "1rem",
      }}
    >
      <span>
        {loading ? (
          <></>
        ) : (
          <Button
            onClick={() => seeScore(id)}
            style={{
              backgroundColor: textpartnerColorContrast(),
              color: partnerColor(),
            }}
          >
            <i className="fa fa-refresh" aria-hidden="true" />
          </Button>
        )}
        {permissions === "superadmin" && (
          <select onChange={handleStudentChange} name="students" value={newID}>
            {studentsList.map((student: any, index: number) => (
              <option key={index} value={student.id}>
                {student.name + " " + student.lastname}
              </option>
            ))}
          </select>
        )}
      </span>
      <span
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <HOne style={{ textAlign: "center", margin: "0.5rem" }}>
          {actualName}
        </HOne>
      </span>
      <div
        style={{
          maxHeight: "25rem",
          margin: "auto",
          overflow: "auto",
          padding: "1px",
          fontWeight: 600,
          backgroundColor: lightGreyColor(),
          border: `2px solid ${lightGreyColor()}`,
        }}
      >
        {loading ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {/* <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Tipo</th> */}
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Data
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Descrição
                </th>
              </tr>
            </thead>
            <tbody>
              {localTimeline.map((item: any, index: number) => {
                const variables = {
                  type:
                    item.type === "Anki"
                      ? "Flashcards"
                      : item.type === "Flashcards"
                      ? "Flashcards"
                      : item.type === "Homework"
                      ? "Homework"
                      : item.type === "Extra activity"
                      ? "Extra activity"
                      : item.type === "Live Class" || "Group Classes"
                      ? "Live Class"
                      : "Other",
                  color:
                    item.type === "Anki"
                      ? "#01BCFF"
                      : item.type === "Homework"
                      ? "#E6A020"
                      : item.type === "Extra activity"
                      ? "#123"
                      : item.type === "Live Class" || "Group Classes"
                      ? "#753"
                      : "#123",
                };

                return (
                  <tr key={index}>
                    {/* <td style={{ border: "1px solid black", padding: "8px" }}>
                      <i
                        style={{
                          backgroundColor: variables.color,
                          color: "white",
                          padding: "0.5rem",
                          borderRadius: "50%",
                          fontWeight: 700,
                          transform: "rotate(-25deg)",
                        }}
                        className={variables.type}
                        aria-hidden="true"
                      />
                      {variables.type}
                    </td> */}
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        backgroundColor: item.score < 0 ? "red" : "green",
                        color: alwaysWhite(),
                      }}
                    >
                      {item.score}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {formatDate(item.date)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {item.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
