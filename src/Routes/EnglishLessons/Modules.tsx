import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { notifyAlert } from "./Assets/Functions/FunctionLessons";
import { partnerColor, darkGreyColor } from "../../Styles/Styles";
import {
  backDomain,
  pathGenerator,
  onLoggOut,
  truncateString,
} from "../../Resources/UniversalComponents";
import EnglishClassCourse2 from "./Class";
import { CircularProgress } from "@mui/material";
import { HOne } from "../../Resources/Components/RouteBox";
import { HThreeModule } from "../MyClasses/MyClasses.Styled";
import styled from "styled-components";

// ===== styled =====
const CourseCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;
  padding: 0.2rem;
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

// ===== tipos básicos para evitar any em excesso =====
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
  headers?: Record<string, any>;
  courseId: string;
  title: string;
}

export default function Modules({
  headers,
  courseId,
  title,
}: ModulesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [visibleModules, setVisibleModules] = useState<boolean[]>([]);
  const [filtered, setFiltered] = useState<ModuleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");
  const [theStudentID, setStudentID] = useState<string>("");

  const actualHeaders = headers || {};
  const USE_BULK = true;

  // clone seguro para estados (evita depender do structuredClone)
  const safeClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

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
    } catch (e) {
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== chamadas de reorder =====
  const patchOrder = async (id: string, order: number) => {
    return axios.patch(
      `${backDomain}/api/v1/class/${id}`,
      { order },
      { headers: actualHeaders }
    );
  };

  const bulkReorder = async (pairs: Array<{ id: string; order: number }>) => {
    return axios.post(
      `${backDomain}/api/v1/classes/reorder`,
      { pairs },
      { headers: actualHeaders }
    );
  };

  // troca 'order' entre vizinhos dentro do mesmo módulo (otimista + persistência)
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

    // Update otimista
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
    } catch (err) {
      notifyAlert("Falha ao atualizar ordem. Recarregando…");
      await getModules(); // rollback simples
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
      // ignora falha de parse
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

  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState(true);

  useEffect(() => {
    const base = `/teaching-materials/${pathGenerator(title)}`;
    const isRootPath = loc.pathname === `${base}/` || loc.pathname === base;
    setDisplayRouteDiv(isRootPath);
  }, [loc.pathname, title]);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 10,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Routes>
        {modules.flatMap((module: ModuleItem, ix: number) =>
          (module.classes || []).map((cl: ClassItem, jx: number) => (
            <Route
              key={`${ix}-${jx}`}
              path={`${cl._id}/`}
              element={
                <EnglishClassCourse2
                  headers={headers}
                  classId={cl._id}
                  course={courseId}
                  previousClass={module.classes?.[jx - 1]?._id ?? "123456"}
                  nextClass={module.classes?.[jx + 1]?._id ?? "123456"}
                  courseTitle={title}
                />
              }
            />
          ))
        )}
      </Routes>

      {displayRouteDiv && (
        <>
          <HOne>{title}</HOne>

          {loading ? (
            <CircularProgress style={{ color: partnerColor() }} />
          ) : (
            <div className="flex-grid" style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90vw",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    cursor: "pointer",
                    color: darkGreyColor(),
                  }}
                  onClick={() => window.location.assign("/teaching-materials")}
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

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                    minWidth: 200,
                  }}
                />
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

              if (!sorted.length) return null;

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
                    <div style={{ display: "grid", gap: 2, margin: "0 10px" }}>
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
                              <span
                                style={{
                                  padding: "10px 5px",
                                  display: "inline-flex",
                                }}
                              >
                                {/* Usa classes FA se estiverem carregadas no app */}
                                <i
                                  className={
                                    cls.studentsWhoCompletedIt?.includes?.(
                                      theStudentID
                                    )
                                      ? "fa fa-check"
                                      : "fa fa-circle"
                                  }
                                  style={{
                                    color: "white",
                                    backgroundColor: partnerColor(),
                                    borderRadius: "50%",
                                    margin: "0 0.5rem",
                                    width: 18,
                                    height: 18,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                  }}
                                />
                              </span>

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

                          {(thePermissions === "superadmin" ||
                            thePermissions === "teacher") && (
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
