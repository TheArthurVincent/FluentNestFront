import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Routes,
  Route,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import { HOne } from "../../Resources/Components/RouteBox";
import { HThreeModule } from "../MyClasses/MyClasses.Styled";
import { partnerColor, darkGreyColor } from "../../Styles/Styles";
import {
  backDomain,
  onLoggOut,
  truncateString,
} from "../../Resources/UniversalComponents";

import NewModuleButton from "./NewModule/NewModule";
import CreateClassButton from "./NewLesson/NewLesson";
import EnglishClassCourse2 from "./Class";
import ReorderModulesButton from "./EditLesson/EditOrderModule/EditOrderModule";

/* =================== Spinner =================== */
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

/* =================== styled =================== */
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

/* =================== Tipos =================== */
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
  id: string; // id do MÓDULO
  classes?: ClassItem[];
  [k: string]: any;
}
interface ModulesHomeProps {
  headers?: any;
  courseId: string;
  title: string;
  canEditCourse?: boolean; // << veio do pai (Courses)
}

/* =================== Wrapper: lê :moduleKey e injeta na Aula =================== */
const ClassByParam: React.FC<{
  headers?: any;
  courseId: string;
  courseTitle: string;
  modulesRef: ModuleItem[];
  canEditCourse?: boolean;
}> = ({ headers, courseId, courseTitle, modulesRef, canEditCourse }) => {
  const { moduleKey } = useParams();

  // Flat para descobrir vizinhos (prev/next) num único array linear
  const flat = useMemo(
    () =>
      modulesRef.flatMap((m) =>
        (m.classes || []).map((c) => ({ ...c, __module: m }))
      ),
    [modulesRef]
  );

  const idx = flat.findIndex((c) => c._id === moduleKey);
  const prev = idx > 0 ? flat[idx - 1]?._id : undefined;
  const next =
    idx >= 0 && idx < flat.length - 1 ? flat[idx + 1]?._id : undefined;

  return (
    <EnglishClassCourse2
      headers={headers}
      canEditCourse={canEditCourse} // << NÃO recalcular
      classId={moduleKey || ""} // << ID da aula via URL
      course={courseId}
      previousClass={prev}
      nextClass={next}
      courseTitle={courseTitle}
    />
  );
};

/* =================== Componente Principal =================== */
export default function Modules({
  headers,
  courseId,
  title,
  canEditCourse,
}: ModulesHomeProps) {
  const [loading, setLoading] = useState(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);
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
      // pequena UX
    }
    const id = cls._id;
    setToggling((p) => ({ ...p, [id]: true }));

    // UI otimista
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
      setModules((prev) => {
        const next = safeClone(prev);
        next.forEach((m) =>
          (m.classes || []).forEach((c) => {
            if (c._id === id) c.studentsWhoCompletedIt = updated;
          })
        );
        return next;
      });
    } catch {
      await getModules(); // rollback total
    } finally {
      setToggling((p) => ({ ...p, [id]: false }));
    }
  };

  /* ===== alunos ===== */
  const fetchStudents = async () => {
    const myId = JSON.parse(localStorage.getItem("loggedIn") || "null")?.id;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        {
          headers: actualHeaders,
        }
      );
      setStudentsList(response.data.listOfStudents || []);
    } catch {
      // ignore
    }
  };
  useEffect(() => {
    try {
      const user = localStorage.getItem("loggedIn");
      if (user) {
        const parsed = JSON.parse(user);
        const permissions = parsed?.permissions ?? "";
        setPermissions(permissions);
      }
      const selectedStudentID = localStorage.getItem("selectedStudentID") || "";
      setStudentID(selectedStudentID);
    } catch {}
  }, []);
  useEffect(() => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      fetchStudents();
    }
  }, [title]); // mantém seu comportamento original

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theid = event.target.value;
    const selectedStudent = studentsList.find((s: any) => s.id === theid);
    setStudentID(theid);
    localStorage.setItem("selectedStudentID", theid);
    if (selectedStudent) {
      setStudentName(`${selectedStudent.name} ${selectedStudent.lastname}`);
    }
  };

  /* ===== módulos ===== */
  const getModules = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ modules: ModuleItem[] }>(
        `${backDomain}/api/v1/module/${courseId}`,
        { headers: actualHeaders }
      );
      const mod = res.data?.modules || [];
      setModules(mod);
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
  }, [courseId]);

  /* ===== reorder ===== */
  const USE_BULK = true;
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
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const from = sorted[viewIdx];
    const to = sorted[viewIdx + dir];
    if (!from || !to) return;

    const aNewOrder = to.order ?? 0;
    const bNewOrder = from.order ?? 0;

    // otimista
    setModules((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as ModuleItem[];
      const m = next[moduleIdx];
      const localSorted = (m.classes || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const A = localSorted[viewIdx];
      const B = localSorted[viewIdx + dir];
      if (!A || !B) return prev;
      const tmp = A.order;
      A.order = B.order;
      B.order = tmp;
      m.classes = localSorted;
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
      await getModules();
    }
  };

  /* ===== busca ===== */
  useEffect(() => {
    const q = (searchQuery || "").toLowerCase();
    const filteredModules = modules.map((module) => ({
      ...module,
      classes: (module.classes || []).filter((cls) => {
        const t = (cls.title || "").toLowerCase().includes(q);
        const g =
          Array.isArray(cls.tags) &&
          cls.tags.some((tag) => (tag || "").toLowerCase().includes(q));
        return t || g;
      }),
    }));
    setFiltered(filteredModules);
  }, [searchQuery, modules]);

  /* ===== visibilidade do cabeçalho ===== */
  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState(true);
  useEffect(() => {
    const isRootOfCourse = /^\/teaching-materials\/[^/]+\/?$/.test(
      loc.pathname
    );
    setDisplayRouteDiv(isRootOfCourse);
  }, [loc.pathname]);

  /* ===== render ===== */
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 10,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Rota da AULA por ID (ou slug se o backend aceitar) */}
      <Routes>
        <Route
          path=":moduleKey/*"
          element={
            <ClassByParam
              headers={headers}
              courseId={courseId}
              courseTitle={title}
              modulesRef={modules}
              canEditCourse={canEditCourse}
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
                <div style={{ display: "flex", alignItems: "center ", gap: 8 }}>
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
                    {title}{" "}
                    {(thePermissions === "teacher" ||
                      thePermissions === "superadmin") && (
                      <span>
                        {canEditCourse
                          ? "(Editing Enabled)"
                          : "(Editing Disabled)"}
                      </span>
                    )}
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
                      width: 140,
                    }}
                  />

                  {(thePermissions === "teacher" ||
                    thePermissions === "superadmin") && (
                    <>
                      <select
                        onChange={handleStudentChange}
                        value={studentID}
                        style={{
                          borderRadius: 4,
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#f8fafc",
                          fontSize: 11,
                          width: 140,
                          fontWeight: 400,
                          color: "#64748b",
                          padding: "4px 6px",
                          height: 28,
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
                        <option value="">Selecione um aluno</option>
                        {studentsList.map((student: any, index: number) => (
                          <option key={index} value={student.id}>
                            {truncateString(
                              `${student.name} ${student.lastname}`,
                              22
                            )}
                          </option>
                        ))}
                      </select>

                      {canEditCourse && (
                        <>
                          {" "}
                          <ReorderModulesButton
                            courseId={courseId}
                            headers={headers}
                            onSaved={() => window.location.reload()} // atualiza lista após salvar
                          />
                          <NewModuleButton
                            courseId={courseId}
                            studentId={studentID}
                            headers={headers}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LISTA DE MÓDULOS */}
          {filtered
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((module, moduleIdx) => {
              const sorted = (module.classes || [])
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

              if (searchQuery && !sorted.length) return null;

              return (
                <div key={module.id || moduleIdx}>
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

                  {canEditCourse && (
                    <CreateClassButton
                      courseId={courseId}
                      studentId={studentID}
                      moduleId={module.id}
                      headers={headers}
                    />
                  )}

                  {visibleModules[moduleIdx] && (
                    <div style={{ display: "grid", margin: "0 10px" }}>
                      {sorted.map((cls, viewIdx) => (
                        <div
                          key={cls._id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Link
                            to={`${cls._id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <CourseCard style={{ gap: 8 }}>
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

                              <p style={{ margin: 0, flex: 1 }}>
                                {viewIdx + 1} - {cls.title}
                                {Array.isArray(cls.tags) &&
                                  cls.tags.length > 0 && (
                                    <span
                                      style={{
                                        fontStyle: "italic",
                                        fontWeight: 400,
                                        fontSize: 10,
                                        marginLeft: "1rem",
                                      }}
                                    >
                                      {truncateString(
                                        (cls.tags || [])
                                          .join(", ")
                                          .toLowerCase(),
                                        28
                                      )}
                                    </span>
                                  )}
                              </p>
                            </CourseCard>
                          </Link>

                          {canEditCourse && (
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
