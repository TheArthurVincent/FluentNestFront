// Routes/ArvinComponents/Groups/GroupSummaryCard.tsx
import React, { FC, useEffect } from "react";
import { ClipboardTextIcon } from "@phosphor-icons/react";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";
import axios from "axios";
import { backDomain } from "../../../../../Resources/UniversalComponents";

type StudentItem = {
  _id: string;
  name?: string;
  lastname?: string;
  fullname?: string;
  picture?: any; // pode ser string ou objeto
};

export const GroupSummaryCard: FC<{
  totalStudents: number;
  group: string; // groupId
  totalClasses: number;
  actualHeaders?: any;
}> = ({ totalStudents, group, totalClasses, actualHeaders }) => {
  const [loadingStudents, setLoadingStudents] = React.useState(false);
  const [students, setStudents] = React.useState<StudentItem[]>([]);

  const getPictureUrl = (pic: any) => {
    if (!pic) return "";
    if (typeof pic === "string") return pic;
    // tenta padrões comuns
    return pic.url || pic.secure_url || pic.link || pic.path || "";
  };

  const fetchGroupStudents = async () => {
    if (!group) return;
    setLoadingStudents(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/group-students/${group}`,
        { headers: actualHeaders }
      );

      const list: StudentItem[] = response?.data?.students || [];
      setStudents(Array.isArray(list) ? list : []);
    } catch (error) {
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchGroupStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, actualHeaders]);

  return (
    <div style={cardBase}>
      {/* Header padrão Arvin */}
      <div style={cardTitle}>
        <ClipboardTextIcon size={18} weight="bold" color="#111827" />
        <span>Resumo da turma</span>
      </div>

      {/* Conteúdo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          rowGap: 8,
          marginTop: 12,
          fontSize: 13,
          color: "#0f172a",
        }}
      >
        <div>
          👥{" "}
          <strong>
            {totalStudents} aluno{totalStudents === 1 ? "" : "s"}
          </strong>
        </div>

        <div>
          📚{" "}
          <strong>
            {totalClasses} aula{totalClasses === 1 ? "" : "s"} em grupo
          </strong>
        </div>

        {/* Lista de alunos (sem mudar o design do card) */}
        <div style={{ marginTop: 6 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Alunos</div>

          {loadingStudents ? (
            <div style={{ fontSize: 12, color: "#6b7280" }}>Carregando...</div>
          ) : students.length === 0 ? (
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Nenhum aluno encontrado.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              {students.map((st) => {
                const name =
                  st.fullname?.trim() ||
                  `${st.name || ""} ${st.lastname || ""}`.trim() ||
                  "Aluno";

                const picUrl = getPictureUrl(st.picture);

                return (
                  <div
                    key={st._id}
                    onClick={() => {
                      if (!st._id) return;
                      window.location.href = `/students/${st._id}`;
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 8px",
                      borderRadius: 10,
                      border: "1px solid #E5E7EB",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    title="Ver perfil do aluno"
                  >
                    {/* avatar */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {picUrl ? (
                        <img
                          src={picUrl}
                          alt={name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                          {name?.[0]?.toUpperCase?.() || "A"}
                        </span>
                      )}
                    </div>

                    {/* nome */}
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
