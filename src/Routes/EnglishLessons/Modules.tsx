import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  Routes,
  Route,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { notifyAlert } from "./Assets/Functions/FunctionLessons";
import { partnerColor, darkGreyColor } from "../../Styles/Styles";
import {
  backDomain,
  onLoggOut,
  truncateString,
} from "../../Resources/UniversalComponents";
import EnglishClassCourse2 from "./Class";
import { HOne } from "../../Resources/Components/RouteBox";
import { HThreeModule } from "../MyClasses/MyClasses.Styled";
import styled from "styled-components";
import NewModuleButton from "./NewModule/NewModule";

/* ===== Spinner (no-MUI) ===== */
const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = partnerColor(),
}) => (
  <div
    role="status"
    aria-label="Carregando"
    style={{
      width: size,
      height: size,
      border: `${Math.max(2, Math.floor(size / 9))}px solid rgba(0,0,0,0.1)`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      margin: "12px 0",
    }}
  />
);
if (!document.getElementById("spin-kf")) {
  const st = document.createElement("style");
  st.id = "spin-kf";
  st.innerHTML = `@keyframes spin{to{transform:rotate(360deg)}}`;
  document.head.appendChild(st);
}

// ===== styled =====
const CourseCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;
  padding: 0.5rem;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f3;

    img {
      transform: scale(1.1);
      filter: grayscale(100%);
    }
  }

  img {
    border-radius: 4px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    margin-right: 1rem;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  p {
    flex-grow: 1;
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
  }
`;

// ===== tipos =====
interface ClassItem {
  _id: string;
  title?: string;
  order?: number;
  tags?: string[];
  studentsWhoCompletedIt?: string[];
  [k: string]: any;
}

interface ModuleItem {
  moduleTitle?: string;
  order?: number;
  classes?: ClassItem[];
  [k: string]: any;
}

interface ModulesHomeProps {
  headers?: any;
  courseId: string;
  title: string;
}

/* Wrapper que lê o :moduleKey e injeta no Class */
const ClassByParam: React.FC<{
  headers?: any;
  courseId: string;
  courseTitle: string;
  modulesRef: ModuleItem[];
}> = ({ headers, courseId, courseTitle, modulesRef }) => {
  const { moduleKey } = useParams();
  // tenta achar vizinhos pelo array local quando possível
  const flat = modulesRef.flatMap((m) =>
    (m.classes || []).map((c) => ({ ...c, __module: m }))
  );
  const idx = flat.findIndex((c) => c._id === moduleKey);
  const prev = idx > 0 ? flat[idx - 1]?._id : undefined;
  const next =
    idx >= 0 && idx < flat.length - 1 ? flat[idx + 1]?._id : undefined;

  return (
    <EnglishClassCourse2
      headers={headers}
      classId={moduleKey || ""} // <<< puxa pelo ID vindo da URL (ou slug se você tratar no back)
      course={courseId}
      previousClass={prev ?? "123456"}
      nextClass={next ?? "123456"}
      courseTitle={courseTitle}
    />
  );
};

export default function Modules({
  headers,
  courseId,
  title,
}: ModulesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");

  const [studentName, setStudentName] = useState<string>("");

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [visibleModules, setVisibleModules] = useState<boolean[]>([]);
  const [filtered, setFiltered] = useState<ModuleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");

  const [toggling, setToggling] = useState<Record<string, boolean>>({});

  const actualHeaders = headers || {};
  const safeClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  const isCompletedFor = (cls: ClassItem) =>
    Array.isArray(cls.studentsWhoCompletedIt) &&
    studentID &&
    cls.studentsWhoCompletedIt.includes(studentID);

  const toggleCompletion = async (cls: ClassItem) => {
    if (!studentID) {
      notifyAlert("Selecione um aluno antes de marcar a aula como feita.");
      return;
    }
    const id = cls._id;

    setToggling((p) => ({ ...p, [id]: true }));

    // (opcional) UI otimista:
    setModules((prev) => {
      const next = safeClone(prev);
      next.forEach((m) =>
        (m.classes || []).forEach((c) => {
          if (c._id === id) {
            const set = new Set(c.studentsWhoCompletedIt || []);
            if (set.has(studentID)) set.delete(studentID);
            else set.add(studentID);
            c.studentsWhoCompletedIt = Array.from(set);
          }
        })
      );
      return next;
    });

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/course/${id}`,
        { studentID },
        { headers: actualHeaders }
      );
      const updated = response.data.studentsWhoCompletedIt;

      // garante que fica igual ao back:
      setModules((prev) => {
        const next = safeClone(prev);
        next.forEach((m) =>
          (m.classes || []).forEach((c) => {
            if (c._id === id) c.studentsWhoCompletedIt = updated;
          })
        );
        return next;
      });
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      notifyAlert("Não foi possível atualizar. Tente novamente.");
      // rollback do otimista:
      await getModules();
    } finally {
      setToggling((p) => ({ ...p, [id]: false }));
    }
  };

  const USE_BULK = true;

  // ===== alunos =====
  const fetchStudents = async () => {
    const myId = JSON.parse(localStorage.getItem("loggedIn") || "null")?.id;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        {
          headers: actualHeaders,
        }
      );
      setStudentsList(response.data.listOfStudents);
    } catch {
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [title]); // mantém seu comportamento

  const handleStudentChange = (event: any) => {
    const theid = event.target.value;
    const selectedStudent = studentsList.find((s: any) => s.id === theid);
    setStudentID(theid);
    localStorage.setItem("selectedStudentID", theid);
    if (selectedStudent) {
      setStudentName(selectedStudent.name + " " + selectedStudent.lastname);
    }
  };

  // ===== módulos =====
  const getModules = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ modules: ModuleItem[] }>(
        `${backDomain}/api/v1/module/${courseId}`,
        { headers: actualHeaders }
      );
      const mod = res.data?.modules || [];
      setModules(mod);
      console.log(mod);
      setVisibleModules(new Array(mod.length).fill(true));
    } catch {
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== reorder =====
  const patchOrder = async (id: string, order: number) =>
    axios.patch(
      `${backDomain}/api/v1/class/${id}`,
      { order },
      { headers: actualHeaders }
    );

  const bulkReorder = async (pairs: Array<{ id: string; order: number }>) =>
    axios.post(
      `${backDomain}/api/v1/classes/reorder`,
      { pairs },
      { headers: actualHeaders }
    );

  const moveClass = async (moduleIdx: number, viewIdx: number, dir: 1 | -1) => {
    const snapshot = modules[moduleIdx];
    if (!snapshot) return;

    const sorted = (snapshot.classes || [])
      .slice()
      .sort((a: ClassItem, b: ClassItem) => (a.order ?? 0) - (b.order ?? 0));

    const from = sorted[viewIdx];
    const to = sorted[viewIdx + dir];
    if (!from || !to) return;

    const aNewOrder = to.order ?? 0;
    const bNewOrder = from.order ?? 0;

    // otimista
    setModules((prev) => {
      const next = safeClone(prev);
      const moduleCopy = next[moduleIdx];
      const sortedLocal = (moduleCopy.classes || [])
        .slice()
        .sort((a: ClassItem, b: ClassItem) => (a.order ?? 0) - (b.order ?? 0));
      const A = sortedLocal[viewIdx];
      const B = sortedLocal[viewIdx + dir];
      if (!A || !B) return prev;
      const tmp = A.order;
      A.order = B.order;
      B.order = tmp;
      moduleCopy.classes = sortedLocal;
      return next;
    });

    try {
      if (USE_BULK) {
        await bulkReorder([
          { id: from._id, order: aNewOrder },
          { id: to._id, order: bNewOrder },
        ]);
      } else {
        await Promise.all([
          patchOrder(from._id, aNewOrder),
          patchOrder(to._id, bNewOrder),
        ]);
      }
    } catch {
      notifyAlert("Falha ao atualizar ordem. Recarregando…");
      await getModules();
    }
  };

  // ===== busca / visibilidade =====
  useEffect(() => {
    try {
      const user = localStorage.getItem("loggedIn");
      if (user) {
        const parsed = JSON.parse(user);
        const permissions = parsed?.permissions ?? "";
        setPermissions(permissions);
      }
      const selectedStudentID =
        localStorage.getItem("selectedStudentID") || "null";
      setStudentID(selectedStudentID);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const q = (searchQuery || "").toLowerCase();
    const filteredModules = modules.map((module: ModuleItem) => ({
      ...module,
      classes: (module.classes || []).filter((cls: ClassItem) => {
        const t = (cls.title || "").toLowerCase().includes(q);
        const g =
          Array.isArray(cls.tags) &&
          cls.tags.some((tag: string) => (tag || "").toLowerCase().includes(q));
        return t || g;
      }),
    }));
    setFiltered(filteredModules);
  }, [searchQuery, modules]);

  // ===== visibilidade do cabeçalho desta página =====
  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState(true);
  useEffect(() => {
    // aceita /teaching-materials/<courseKey> e /teaching-materials/<courseKey>/
    const isRootOfCourse = /^\/teaching-materials\/[^/]+\/?$/.test(
      loc.pathname
    );
    setDisplayRouteDiv(isRootOfCourse);
  }, [loc.pathname]);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 10,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* ROTA ÚNICA: aceita id OU slug via :moduleKey.
          O componente interno puxa o classId direto do parâmetro. */}
      <Routes>
        <Route
          path=":moduleKey/*"
          element={
            <ClassByParam
              headers={headers}
              courseId={courseId}
              courseTitle={title}
              modulesRef={modules}
            />
          }
        />
      </Routes>

      {displayRouteDiv && (
        <>
          <HOne>{title}</HOne>

          {loading ? (
            <Spinner />
          ) : (
            <div className="flex-grid" style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  width: "90vw",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center ",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      cursor: "pointer",
                      color: darkGreyColor(),
                    }}
                    onClick={() =>
                      window.location.assign("/teaching-materials")
                    }
                  >
                    Materiais de Ensino
                  </span>
                  <span style={{ color: darkGreyColor() }}>-</span>
                  <span
                    style={{
                      color: partnerColor(),
                      fontSize: 10,
                      fontStyle: "italic",
                    }}
                  >
                    {title}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  {/* busca */}
                  <input
                    type="text"
                    placeholder="Search classes by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: 4,
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      fontSize: 11,
                      color: "#64748b",
                      padding: "4px 6px",
                      height: 28,
                      width: 100,
                    }}
                  />
                  {/* seletor de aluno */}
                  {(thePermissions == "teacher" ||
                    thePermissions == "superadmin") && (
                    <>
                      <select
                        onChange={(e) => handleStudentChange(e)}
                        value={studentID}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#f8fafc",
                          fontSize: "11px",
                          width: 100,
                          fontWeight: "400",
                          color: "#64748b",
                          padding: "4px 6px",
                          height: "28px",
                          outline: "none",
                          cursor: "pointer",
                          display: "block",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = partnerColor())
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#e2e8f0")
                        }
                      >
                        {studentsList.map((student: any, index: number) => (
                          <option key={index} value={student.id}>
                            {truncateString(
                              student.name + " " + student.lastname,
                              15
                            )}
                          </option>
                        ))}
                      </select>
                      <NewModuleButton
                        courseId={courseId}
                        studentId={studentID}
                        headers={actualHeaders}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LISTA DE MÓDULOS */}
          {filtered
            .slice()
            .sort(
              (a: ModuleItem, b: ModuleItem) => (a.order ?? 0) - (b.order ?? 0)
            )
            .map((module: ModuleItem, moduleIdx: number) => {
              const sorted = (module.classes || [])
                .slice()
                .sort(
                  (a: ClassItem, b: ClassItem) =>
                    (a.order ?? 0) - (b.order ?? 0)
                );

              if (searchQuery && !sorted.length) return null;

              return (
                <div key={moduleIdx}>
                  <HThreeModule
                    onClick={() =>
                      setVisibleModules((prev) => {
                        const n = prev.slice();
                        n[moduleIdx] = !n[moduleIdx];
                        return n;
                      })
                    }
                  >
                    {moduleIdx + 1} |{" "}
                    {module.moduleTitle ?? `Module #${moduleIdx}`} -{" "}
                    {sorted.length} Lessons
                  </HThreeModule>

                  {visibleModules[moduleIdx] && (
                    <div style={{ display: "grid", margin: "0 10px" }}>
                      {sorted.map((cls: ClassItem, viewIdx: number) => (
                        <div
                          key={cls._id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {/* Link SEMPRE por ID */}
                          <Link
                            to={`${cls._id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <CourseCard
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <label
                                title={
                                  isCompletedFor(cls)
                                    ? "Marcar como não feito"
                                    : "Marcar como feito"
                                }
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  cursor: toggling[cls._id]
                                    ? "not-allowed"
                                    : "pointer",
                                  fontSize: 11,
                                  fontWeight: 400,
                                  color: "#64748b",
                                  userSelect: "none",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!isCompletedFor(cls)}
                                  disabled={!!toggling[cls._id] || !studentID}
                                  onChange={() => toggleCompletion(cls)}
                                  style={{
                                    cursor:
                                      !!toggling[cls._id] || !studentID
                                        ? "not-allowed"
                                        : "pointer",
                                    width: 12,
                                    height: 12,
                                    accentColor: partnerColor(),
                                  }}
                                  aria-label="Marcar aula como feita"
                                />
                              </label>

                              <p
                                className="hoverable-paragraph"
                                style={{ margin: 0, flex: 1 }}
                              >
                                {viewIdx + 1} - {cls.title}
                                {Array.isArray(cls.tags) &&
                                  cls.tags.length > 0 && (
                                    <span
                                      className="hidden-span"
                                      style={{
                                        fontStyle: "italic",
                                        fontWeight: 400,
                                        fontSize: 10,
                                        marginLeft: "1rem",
                                      }}
                                    >
                                      {truncateString(
                                        cls.tags.join(", ").toLowerCase(),
                                        20
                                      )}
                                    </span>
                                  )}
                              </p>
                            </CourseCard>
                          </Link>

                          {thePermissions === "superadmin" && (
                            <div
                              onClick={(e) => e.preventDefault()}
                              style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                                marginLeft: "auto",
                              }}
                            >
                              <button
                                title="Mover para cima"
                                disabled={viewIdx === 0}
                                onClick={async () =>
                                  await moveClass(moduleIdx, viewIdx, -1)
                                }
                                style={{
                                  border: "1px solid #e2e8f0",
                                  background: "#fff",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  cursor:
                                    viewIdx === 0 ? "not-allowed" : "pointer",
                                }}
                              >
                                ▲
                              </button>

                              <button
                                title="Mover para baixo"
                                disabled={viewIdx === sorted.length - 1}
                                onClick={async () =>
                                  await moveClass(moduleIdx, viewIdx, +1)
                                }
                                style={{
                                  border: "1px solid #e2e8f0",
                                  background: "#fff",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  cursor:
                                    viewIdx === sorted.length - 1
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                ▼
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          <Outlet />
        </>
      )}
    </div>
  );
}
