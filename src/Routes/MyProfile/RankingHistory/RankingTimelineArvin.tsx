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
  const [localTimeline, setLocalTimeline] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [actualName, setActualName] = useState<string>(name);
  const [newID, setNewID] = useState<string>(id);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const { UniversalTexts } = useUserContext();
  const actualHeaders = headers || {};

  /* ========================= Helpers ========================= */
  const canLoadMore = localTimeline.length < total;

  /* ========================= API Calls ========================= */
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
      } catch {
        alert("Erro ao encontrar alunos");
      }
    }
  };

  const seeName = async (studentId: string) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/studentname/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      setActualName(response.data.name);
    } catch (error) {
      alert(error as any);
      console.error(error);
    }
  };

  const seeScore = async (pageToLoad = 1, selectedId?: string) => {
    // id alvo: prioridade para selectedId; se não, tenta localStorage; por fim, newID atual
    const fallbackId =
      JSON.parse(localStorage.getItem("loggedIn") || "{}")?.id || newID;
    const targetId = selectedId || fallbackId;

    // loading principal na primeira página; "leve" quando for load more
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/score/${targetId}`,
        {
          headers: actualHeaders,
          params: { page: pageToLoad, limit: pageSize },
        }
      );

      const { history = [], total: serverTotal = 0 } = response.data || {};

      if (pageToLoad === 1) setLocalTimeline(history);
      else setLocalTimeline((prev) => [...prev, ...history]);

      setTotal(serverTotal);
      setPage(pageToLoad);
      setNewID(targetId); // mantém controle de qual aluno estamos vendo

      // atualiza nome mostrado
      seeName(targetId);
    } catch (error) {
      alert(error as any);
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* ========================= Effects ========================= */
  useEffect(() => {
    // sempre que trocar "id" vindo de props/rota, reseta paginação e refaz busca
    setLocalTimeline([]);
    setTotal(0);
    setPage(1);
    setNewID(id);
    setActualName(name);
    seeScore(1, id);
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setNewID(selected);
    setLocalTimeline([]);
    setTotal(0);
    setPage(1);
    seeName(selected);
    seeScore(1, selected);
  };

  /* ========================= Estilos base ========================= */
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

  /* ========================= Render ========================= */
  return (
    <div
      style={{
        color: "#000",
        border: "1px solid #e8eaed",
        maxWidth: "960px",
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
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
          {(permissions === "superadmin" || permissions === "teacher") && (
            <select
              onChange={handleStudentChange}
              value={newID}
              style={{
                width: "312px",
                padding: "10px 12px",
                borderRadius: "8px",
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
          )}
        </div>
      </div>

      {/* Card da tabela */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          maxHeight: "28rem",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Loading principal */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        ) : (
          <>
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
                      key={`${item?._id || index}-${index}`}
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

            {/* Paginação */}
            <div
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.75rem",
                borderTop: "1px solid #eef0f2",
              }}
            >
              {canLoadMore && (
                <button
                  onClick={() => seeScore(page + 1, newID)}
                  disabled={loadingMore}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 600,
                  }}
                  aria-label="Carregar mais itens do histórico"
                >
                  {loadingMore ? "Carregando..." : "Carregar mais"}
                </button>
              )}

              {!canLoadMore && (
                <span
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 600,
                    opacity: 0.8,
                  }}
                >
                  Fim do histórico
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
