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

import { HOne } from "../../Resources/Components/RouteBox";
import { partnerColor, darkGreyColor, logoPartner } from "../../Styles/Styles";
import {
  backDomain,
  onLoggOut,
  truncateString,
} from "../../Resources/UniversalComponents";

import NewModuleButton from "./NewModule/NewModule";
import CreateClassButton from "./NewLesson/NewLesson";
import EnglishClassCourse2 from "./Class";
import ReorderModulesButton from "./EditLesson/EditOrderModule/EditOrderModule";
import ModuleActions from "./EditLesson/EditModule/EditModule";

/* =================== Base CSS (sem sombras, foco visível, reduce motion) =================== */
const injectBaseStyles = () => {
  if (document.getElementById("modules-base-styles")) return;
  const st = document.createElement("style");
  st.id = "modules-base-styles";
  st.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg) } }

    .focusable:focus-visible {
      outline: 2px solid ${partnerColor()};
      outline-offset: 2px;
      border-radius: 10px;
    }
    @media (prefers-reduced-motion: reduce) {
      .no-motion { transition: none !important; animation: none !important; }
    }

    .btn-ghost {
      border: 1px solid #e2e8f0;
      background: #fff;
      padding: 2px 6px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 11px;
    }
    .btn-ghost:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .input-slim {
      border-radius: 10px;
      border: 1px solid #E3E8F0;
      background: #f8fafc;
      font-size: 12px;
      color: #475569;
      padding: 8px 10px;
      height: 34px;
      outline: none;
    }
    .input-slim:focus {
      border-color: ${partnerColor()};
      background: #ffffff;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 400;
      color: #64748b;
      user-select: none;
    }

    .card-row {
      display: grid;
      grid-template-columns: 1fr;
      align-items: stretch;
      gap: 8px;
    }

    .list-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .no-overflow-x { overflow-x: hidden; }

    /* ====== NOVO ESTILO DOS CARDS DE AULA (vibe ESL Brains) ====== */
    .lesson-card {
      position: relative;
      display: block;
      border-radius: 16px;
      background: linear-gradient(135deg, #f8fafc, #ffffff);
      border: 1px solid #e2e8f0;
      padding: 10px;
      transition:
        transform .12s ease-out,
        box-shadow .12s ease-out,
        border-color .12s ease-out,
        background .12s ease-out;
    }

    .lesson-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(15,23,42,.08);
      border-color: ${partnerColor()};
      background: linear-gradient(135deg, #f1f5f9, #ffffff);
    }

    @media (max-width: 768px) {
      .card-row {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(st);
};

/* =================== Spinner consistente =================== */
const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = partnerColor(),
}) => (
  <div style={{ display: "grid", placeItems: "center", minHeight: "25vh" }}>
    <div
      className="no-motion"
      role="status"
      aria-label="Carregando"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "3px solid #e5e7eb",
        borderTopColor: color,
        animation: "spin .8s linear infinite",
      }}
    />
  </div>
);

/* =================== Tipos =================== */
interface ClassItem {
  _id: string;
  title?: string;
  order?: number;
  tags?: string[];
  description?: string;
  image?: string;
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
  isDesktop: any;
  courseId: string;
  title: string;
  change?: any;
  setChange?: any;
  canEditCourse?: boolean; // << veio do pai (Courses)
}

/* =================== Card “liso” da aula (sem sombra, mas com hover legal) =================== */
const LessonCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="focusable lesson-card">{children}</div>;
};

/* =================== Wrapper: lê :moduleKey e injeta na Aula =================== */
const ClassByParam: React.FC<{
  headers?: any;
  courseId: string;
  courseTitle: string;
  modulesRef: ModuleItem[];
  canEditCourse?: boolean;
  setChange?: any;
  change?: any;
}> = ({
  headers,
  courseId,
  courseTitle,
  modulesRef,
  canEditCourse,
  setChange,
  change,
}) => {
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
      setChange={setChange}
      change={change}
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
  isDesktop,
  setChange,
  change,
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

  useEffect(() => {
    injectBaseStyles();
  }, []);

  const isCompletedFor = (cls: ClassItem) =>
    Array.isArray(cls.studentsWhoCompletedIt) &&
    studentID &&
    cls.studentsWhoCompletedIt.includes(studentID);

  const toggleCompletion = async (cls: ClassItem) => {
    if (!studentID) {
      // pequena UX opcional
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
  }, [title, thePermissions]); // mantém comportamento original

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

  const headerRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  };

  const toolsRightStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginLeft: "auto",
  };

  const lessonsListWrap: React.CSSProperties = {
    display: "grid",
    gap: 10,
  };

  /* ===== render ===== */
  return (
    <div>
      {/* Rota da AULA por ID */}
      <Routes>
        <Route
          path=":moduleKey/*"
          element={
            <ClassByParam
              setChange={setChange}
              change={change}
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
          <div
            style={{
              margin: !isDesktop ? "4.5rem auto" : "12px auto",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e8eaed",
              padding: "1rem",
              width: isDesktop ? "95%" : "",
            }}
          >
            <HOne>{title}</HOne>
            {loading ? (
              <Spinner />
            ) : (
              <div className="list-grid" style={{ gap: 12 }}>
                <div style={headerRowStyle}>
                  {/* Breadcrumb leve */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        cursor: "pointer",
                        color: darkGreyColor(),
                      }}
                      onClick={() =>
                        window.location.assign("/teaching-materials")
                      }
                    >
                      Materiais de Ensino
                    </span>
                    <span style={{ color: darkGreyColor() }}>›</span>
                    <span
                      style={{
                        color: partnerColor(),
                        fontSize: 11,
                        fontStyle: "italic",
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {title}
                      {(thePermissions === "teacher" ||
                        thePermissions === "superadmin") && (
                        <span style={{ color: "#64748b", fontSize: 10 }}>
                          {canEditCourse
                            ? "(Editing Enabled)"
                            : "(Editing Disabled)"}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Ferramentas à direita */}
                  <div style={toolsRightStyle}>
                    <input
                      type="text"
                      placeholder="Search classes by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-slim"
                      style={{ width: 180 }}
                    />

                    {(thePermissions === "teacher" ||
                      thePermissions === "superadmin") && (
                      <>
                        <select
                          onChange={handleStudentChange}
                          value={studentID}
                          className="input-slim"
                          style={{ width: 200, fontWeight: 400 }}
                        >
                          <option value="">Selecione um aluno</option>
                          {studentsList.map((student: any, index: number) => (
                            <option key={index} value={student.id}>
                              {truncateString(
                                `${student.name} ${student.lastname}`,
                                28
                              )}
                            </option>
                          ))}
                        </select>

                        {canEditCourse && (
                          <>
                            <ReorderModulesButton
                              courseId={courseId}
                              headers={headers}
                              onSaved={() => window.location.reload()}
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
                  <div key={module.id || moduleIdx} style={{ marginTop: 8 }}>
                    <h3
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "space-between",
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: 4,
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                      onClick={() =>
                        setVisibleModules((prev) => {
                          const n = prev.slice();
                          n[moduleIdx] = !n[moduleIdx];
                          return n;
                        })
                      }
                    >
                      <>
                        {moduleIdx + 1} |{" "}
                        {module.moduleTitle ?? `Module #${moduleIdx}`} -{" "}
                        {sorted.length} Lessons
                      </>{" "}
                      {canEditCourse && (
                        <ModuleActions
                          moduleId={module.id}
                          initialTitle={module.moduleTitle || ""}
                          headers={headers}
                          canEdit={canEditCourse}
                          onChanged={getModules}
                        />
                      )}{" "}
                    </h3>

                    {visibleModules[moduleIdx] && (
                      <div style={lessonsListWrap}>
                        {sorted.map((cls, viewIdx) => {
                          const isCompleted = isCompletedFor(cls);
                          return (
                            <div className="card-row" key={cls._id}>
                              <Link
                                to={`${cls._id}`}
                                className="focusable"
                                style={{
                                  textDecoration: "none",
                                  width: "100%",
                                }}
                              >
                                <LessonCard>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "110px 1fr",
                                      gap: 12,
                                      alignItems: "stretch",
                                    }}
                                  >
                                    {/* THUMB */}
                                    <div>
                                      <img
                                        style={{
                                          width: "100%",
                                          height: 100,
                                          objectFit: "cover",
                                          borderRadius: 10,
                                          backgroundColor: "#e2e8f0",
                                        }}
                                        src={cls.image || logoPartner()}
                                        alt=""
                                      />
                                    </div>

                                    {/* CONTEÚDO */}
                                    <div
                                      style={{
                                        display: "grid",
                                        gap: 6,
                                        alignContent: "space-between",
                                      }}
                                    >
                                      {/* Meta / topo */}
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 11,
                                            textTransform: "uppercase",
                                            letterSpacing: ".08em",
                                            color: "#94a3b8",
                                            fontWeight: 600,
                                          }}
                                        >
                                          Lesson {viewIdx + 1}
                                        </span>

                                        {Array.isArray(cls.tags) &&
                                          cls.tags.length > 0 && (
                                            <span
                                              style={{
                                                fontSize: 11,
                                                color: "#64748b",
                                                maxWidth: 140,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {truncateString(
                                                cls.tags[0] || "",
                                                22
                                              )}
                                            </span>
                                          )}

                                        <div
                                          style={{
                                            marginLeft: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                          }}
                                        >
                                          {/* <span
                                            style={{
                                              fontSize: 11,
                                              color: isCompleted
                                                ? partnerColor()
                                                : "#64748b",
                                            }}
                                          >
                                            {isCompleted
                                              ? "Done"
                                              : "Mark as done"}
                                          </span> */}

                                          <label
                                            title={
                                              isCompleted
                                                ? "Marcar como não feito"
                                                : "Marcar como feito"
                                            }
                                            className="pill"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={!!isCompleted}
                                              disabled={
                                                !!toggling[cls._id] ||
                                                !studentID
                                              }
                                              onChange={() =>
                                                toggleCompletion(cls)
                                              }
                                              style={{
                                                cursor:
                                                  !!toggling[cls._id] ||
                                                  !studentID
                                                    ? "not-allowed"
                                                    : "pointer",
                                                width: 14,
                                                height: 14,
                                                accentColor: partnerColor(),
                                              }}
                                              aria-label="Marcar aula como feita"
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      {/* Título + descrição */}
                                      <div>
                                        <div
                                          style={{
                                            margin: 0,
                                            fontWeight: 600,
                                            fontSize: 14,
                                            color: "#0f172a",
                                            lineHeight: 1.3,
                                          }}
                                        >
                                          {cls.title || `Lesson ${viewIdx + 1}`}
                                        </div>
                                        {cls.description && (
                                          <p
                                            style={{
                                              margin: "4px 0 0 0",
                                              fontSize: 12,
                                              color: "#475569",
                                              lineHeight: 1.5,
                                            }}
                                          >
                                            {truncateString(
                                              cls.description,
                                              140
                                            )}
                                          </p>
                                        )}
                                      </div>

                                      {/* Tags em chips, tipo ESL Brains */}
                                      {Array.isArray(cls.tags) &&
                                        cls.tags.length > 0 && (
                                          <div
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: 6,
                                              marginTop: 4,
                                            }}
                                          >
                                            {cls.tags.slice(0, 4).map((tag) => (
                                              <span
                                                key={tag}
                                                style={{
                                                  fontSize: 10,
                                                  borderRadius: 999,
                                                  padding: "2px 8px",
                                                  background: "#e2e8f0",
                                                  color: "#334155",
                                                  textTransform: "uppercase",
                                                  letterSpacing: ".06em",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </LessonCard>
                              </Link>

                              {canEditCourse && (
                                <div
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    gap: 6,
                                    alignItems: "center",
                                    backgroundColor: "#ffffff",
                                    height: "fit-content",
                                    padding: "4px 8px",
                                    borderRadius: 8,
                                    border: "1px solid #e2e8ef",
                                    marginLeft: "auto",
                                    zIndex: 5, // garante que fique acima do Link / card
                                  }}
                                >
                                  <button
                                    title="Mover para cima"
                                    disabled={viewIdx === 0}
                                    onClick={async () =>
                                      await moveClass(moduleIdx, viewIdx, -1)
                                    }
                                    style={{
                                      all: "unset",
                                      cursor:
                                        viewIdx === 0
                                          ? "not-allowed"
                                          : "pointer",
                                      color:
                                        viewIdx === 0
                                          ? "#94a3b8"
                                          : partnerColor(),
                                    }}
                                    aria-label="Mover para cima"
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
                                      all: "unset",
                                      cursor:
                                        viewIdx === sorted.length - 1
                                          ? "not-allowed"
                                          : "pointer",
                                      color:
                                        viewIdx === sorted.length - 1
                                          ? "#94a3b8"
                                          : partnerColor(),
                                    }}
                                    aria-label="Mover para baixo"
                                  >
                                    ▼
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {canEditCourse && (
                          <CreateClassButton
                            courseId={courseId}
                            studentId={studentID}
                            moduleId={module.id}
                            headers={headers}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}
