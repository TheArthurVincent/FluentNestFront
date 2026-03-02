import React, { useEffect, useMemo, useState } from "react";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { Link } from "react-router-dom";
import NewGroupModal from "./NewGroupModal";

type ListOfGroupsToClickProps = HeadersProps & {
  change?: boolean;
  setChange?: (value: boolean) => void;
  isDesktop: boolean;
  actualHeaders?: Record<string, string> | null;
  id?: string | number;
};

type GroupItem = {
  _id: string;
  name?: string;
  description?: string;
  studentIds?: any[];
};

export const newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
} as const;

export function ListOfGroupsToClick({
  actualHeaders,
  headers,
  isDesktop,
  id,
}: ListOfGroupsToClickProps) {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const loggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const teacherId = id || loggedUser.id || loggedUser._id;

      if (!teacherId) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${backDomain}/api/v1/groups/${teacherId}`,
        {
          headers: actualHeaders || undefined,
        }
      );

      setGroups(response.data.groups || response.data || []);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao buscar turmas (turmas).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;

    return groups.filter((g) => {
      const name = (g.name || "").toLowerCase();
      const desc = (g.description || "").toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [groups, search]);

  const listToRender = filteredGroups;

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && groups.length === 0 && <p>No groups found.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {/* Barra de busca + NOVA TURMA */}
        <div
          style={{
            display: "flex",
            alignItems: !isDesktop ? "flex-end" : "center",
            padding: "8px 0",
            flexDirection: isDesktop ? "row" : "column",
            fontSize: 12,
            color: "#555",
            gap: 8,
            marginBottom: isDesktop ? 4 : 12,
          }}
        >
          <input
            type="text"
            placeholder="🔍 Buscar turma por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: isDesktop ? 260 : "100%",
              borderRadius: 999,
              border: "1px solid #E2E8F0",
              padding: "8px 14px",
              fontSize: 13,
              outline: "none",
            }}
          />

          <NewGroupModal
            headers={actualHeaders}
            teacherId={id}
            onCreated={fetchGroups}
          />
        </div>

        {/* Lista de turmas */}
        {listToRender.map((g, index) => {
          const studentsCount = g.studentIds?.length || 0;

          return (
            <Link
              key={g._id}
              to={`/groups/${g._id}`}
              style={{
                textDecoration: "none",
                color: "#222",
                background: "white",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #e4e6ea",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "0.2s",
                fontFamily: "Plus Jakarta Sans",
              }}
            >
              {/* “Avatar” simples da turma */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 50%, #c7d2fe 100%)",
                  color: "#1e293b",
                }}
              >
                {index + 1}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  {g.name || "Turma sem nome"}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    marginTop: 2,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {g.description || "Sem descrição"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    marginTop: 4,
                    color: "#64748b",
                  }}
                >
                  👥 {studentsCount} aluno
                  {studentsCount === 1 ? "" : "s"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default ListOfGroupsToClick;
