import React, { FC, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { newArvinTitleStyle } from "../Groups";

type GroupPageProps = {
  headers: MyHeadersType | any;
  isDesktop?: boolean;
  id?: string | number; // id do teacher (opcional, cai no loggedIn se não vier)
};

type GroupItem = {
  _id: string;
  name?: string;
  description?: string;
  studentIds?: Array<{ _id?: string } | string>;
};

type StudentItem = {
  id: string;
  _id?: string;
  name: string;
  lastname: string;
};

type GroupClassEvent = {
  _id?: string;
  status?: string;
  category?: string;
  date?: string;
  time?: string;
  duration?: number;
  description?: string;
  video?: string;
  importantLink?: string;
};

const GroupPage: FC<GroupPageProps> = ({ headers, isDesktop, id }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupItem | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [arrayOfIds, setArrayOfIds] = useState<string[]>([]);
  const [classesGroup, setClassesGroup] = useState<GroupClassEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");

  useEffect(() => {
    if (!groupId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const logged = JSON.parse(localStorage.getItem("loggedIn") || "{}");
        const teacherId = id || logged.id || logged._id;

        // Carrega alunos do teacher
        if (teacherId) {
          setLoadingStudents(true);
          const resStudents = await axios.get(
            `${backDomain}/api/v1/students/${teacherId}`,
            { headers: headers as any }
          );
          setStudents(resStudents.data.listOfStudents || []);
          setLoadingStudents(false);
        }

        // Carrega o grupo
        const resGroup = await axios.get(
          `${backDomain}/api/v1/group/${groupId}`,
          { headers: headers as any }
        );
        const g: GroupItem = resGroup.data.group || resGroup.data;
        setGroup(g);

        const ids =
          Array.isArray(g.studentIds) && g.studentIds.length
            ? g.studentIds.map((x: any) => String(x?._id ?? x))
            : [];
        setArrayOfIds(ids);

        // Histórico da turma (só pra resumo)
        setLoadingHistory(true);
        const resHistory = await axios.get(
          `${backDomain}/api/v1/grouphistory/${groupId}`,
          { headers: headers as any }
        );
        setClassesGroup(resHistory.data.classesGroup || []);
        setLoadingHistory(false);
      } catch (err) {
        console.error("Erro ao carregar grupo", err);
        notifyAlert("Erro ao carregar turma (grupo).");
        setLoadingStudents(false);
        setLoadingHistory(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [groupId, headers, id]);

  const handleCheckboxChange = async (studentId: string) => {
    if (!group || !group._id) return;

    try {
      await axios.put(
        `${backDomain}/api/v1/group/${group._id}`,
        { idToAddOrRemove: studentId },
        { headers: headers as any }
      );

      setArrayOfIds((prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId)
          : [...prev, studentId]
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao atualizar alunos da turma.");
    }
  };

  const handleChangeName = async (name: string) => {
    if (!group || !group._id) return;
    setGroup((prev) => (prev ? { ...prev, name } : prev));
    try {
      await axios.put(
        `${backDomain}/api/v1/group-name/${group._id}`,
        { name },
        { headers: headers as any }
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao alterar nome da turma.");
    }
  };

  const handleChangeDescription = async (description: string) => {
    if (!group || !group._id) return;
    setGroup((prev) => (prev ? { ...prev, description } : prev));
    try {
      await axios.put(
        `${backDomain}/api/v1/group-description/${group._id}`,
        { description },
        { headers: headers as any }
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao alterar descrição da turma.");
    }
  };

  const deleteGroup = async () => {
    if (!group || !group._id) return;
    try {
      await axios.delete(`${backDomain}/api/v1/group/${group._id}`, {
        headers: headers as any,
      });
      notifyAlert("Turma excluída com sucesso.");
      navigate("/groups");
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao excluir turma.");
    }
  };

  const filteredStudents = useMemo(() => {
    const q = searchStudent.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const fullName = `${s.name || ""} ${s.lastname || ""}`.toLowerCase();
      return fullName.includes(q);
    });
  }, [students, searchStudent]);

  if (loading) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Carregando turma...
      </div>
    );
  }

  if (!group) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Turma não encontrada.
      </div>
    );
  }

  const totalStudents = arrayOfIds.length;
  const totalClasses = classesGroup.length;

  // última aula só pra mostrar um resuminho
  const lastClass =
    classesGroup && classesGroup.length > 0
      ? [...classesGroup].sort(
          (a, b) =>
            new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
        )[0]
      : undefined;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        margin: isDesktop ? "0px 16px 0px 0px" : "0px",
        padding: isDesktop ? 0 : 8,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* HEADER (desktop) */}
      {isDesktop && (
        <header
          style={{
            paddingTop: 24,
            paddingBottom: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
            }}
          >
            <div>
              <div style={newArvinTitleStyle}>
                {group.name || "Turma sem nome"}
              </div>
              <div
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: 13,
                  color: "#64748b",
                  marginTop: 4,
                }}
              >
                {group.description || "Adicione uma descrição para esta turma"}
              </div>
            </div>
          </section>
        </header>
      )}

      {/* GRID PRINCIPAL */}
      <div
        style={{
          fontFamily:
            "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "minmax(0, 1.2fr) minmax(0, 1.4fr) minmax(0, 1fr)"
            : "minmax(0, 1fr)",
          gap: isDesktop ? 24 : 16,
          alignItems: "flex-start",
          margin: !isDesktop ? "12px" : "0px",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* COLUNA ESQUERDA – INFO PRINCIPAL + ALUNOS */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          {/* Card principal: Nome e descrição editáveis */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              Dados da turma
            </div>
            <input
              className="no-focus"
              style={{
                width: "100%",
                backgroundColor: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontWeight: 600,
                fontSize: 15,
                padding: "8px 10px",
                marginBottom: 8,
                outline: "none",
              }}
              type="text"
              placeholder="Nome do grupo"
              value={group.name || ""}
              onChange={(e) => handleChangeName(e.target.value)}
            />
            <input
              className="no-focus"
              style={{
                width: "100%",
                backgroundColor: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontWeight: 400,
                fontSize: 14,
                padding: "8px 10px",
                outline: "none",
              }}
              type="text"
              placeholder="Descrição do grupo"
              value={group.description || ""}
              onChange={(e) => handleChangeDescription(e.target.value)}
            />
          </div>

          {/* Card: Lista de alunos com checkbox */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Alunos da turma
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                {totalStudents} aluno{totalStudents === 1 ? "" : "s"}
              </span>
            </div>

            <input
              type="text"
              placeholder="🔍 Buscar aluno..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #E2E8F0",
                padding: "6px 12px",
                fontSize: 12,
                outline: "none",
                marginBottom: 8,
              }}
            />

            {loadingStudents ? (
              <div style={{ color: "#888", fontSize: 14 }}>Carregando...</div>
            ) : (
              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  background: "#f8fafc",
                  padding: "8px 6px",
                }}
              >
                {filteredStudents.map((student, indexST) => {
                  const sid = String(student._id ?? student.id);
                  const checked = arrayOfIds.includes(sid);
                  return (
                    <label
                      key={sid + indexST}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 13,
                        color: "#334155",
                        marginBottom: 6,
                        cursor: "pointer",
                        padding: "2px 4px",
                        borderRadius: 6,
                        backgroundColor: checked ? "#e0f2fe" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxChange(sid)}
                        style={{ marginRight: 8 }}
                      />
                      {student.name} {student.lastname}
                    </label>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    Nenhum aluno encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA CENTRAL – RESUMO DO HISTÓRICO + LINK */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              margin: "auto",
              marginTop: "0px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e8eaed",
              padding: "16px 18px",
            }}
          >
            <h3
              style={{
                color: "#2c3e50",
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "12px",
                borderBottom: "2px solid #e8eaed",
                paddingBottom: "6px",
              }}
            >
              📚 Histórico de aulas em grupo
            </h3>

            {loadingHistory ? (
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Carregando histórico...
              </div>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 13,
                    color: "#4b5563",
                    marginBottom: 8,
                  }}
                >
                  Esta turma possui{" "}
                  <strong>
                    {totalClasses} aula
                    {totalClasses === 1 ? "" : "s"} em grupo
                  </strong>{" "}
                  registradas.
                </p>

                {lastClass && (
                  <div
                    style={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      padding: 10,
                      marginBottom: 10,
                      fontSize: 12,
                      color: "#111827",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#6b7280",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      Última aula registrada
                    </div>
                    <div>
                      <strong>
                        {formatDate(lastClass.date)}{" "}
                        {lastClass.time && `• ${lastClass.time}`}
                      </strong>
                    </div>
                    {lastClass.status && (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 11,
                          color: "#4b5563",
                        }}
                      >
                        Status: <strong>{lastClass.status}</strong>
                      </div>
                    )}
                    {lastClass.description && (
                      <div
                        style={{
                          marginTop: 4,
                          color: "#4b5563",
                        }}
                      >
                        {lastClass.description}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/groups/${group._id}/history`)}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "10px 0",
                    borderRadius: 999,
                    border: "1px solid #0ea5e9",
                    backgroundColor: "#0ea5e9",
                    color: "#ffffff",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  Ver histórico completo
                  <i className="fa fa-chevron-right" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA – RESUMO + DANGER ZONE */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          {/* Card resumo */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              Resumo da turma
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: 8,
                fontSize: 13,
                color: "#0f172a",
              }}
            >
              <div>
                👥{" "}
                <strong>
                  {totalStudents} aluno
                  {totalStudents === 1 ? "" : "s"}
                </strong>
              </div>
              <div>
                📚{" "}
                <strong>
                  {totalClasses} aula
                  {totalClasses === 1 ? "" : "s"} em grupo
                </strong>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div
            style={{
              background: "#fef2f2",
              borderRadius: 12,
              border: "1px solid #fecaca",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#b91c1c",
                marginBottom: 8,
              }}
            >
              Zona de perigo
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#7f1d1d",
                marginBottom: 10,
              }}
            >
              Excluir esta turma irá remover o vínculo dos alunos com este
              grupo. Esta ação não pode ser desfeita.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Excluir turma
              </button>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <button
                  onClick={deleteGroup}
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    background: "#b91c1c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Confirmar exclusão
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    background: "#e5e7eb",
                    color: "#111827",
                    border: "none",
                    borderRadius: 999,
                    fontWeight: 500,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
