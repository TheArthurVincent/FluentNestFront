// Modules.tsx
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

// ======================== ESTILOS GERAIS ========================

const PageWrap = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: grid;
  gap: 8px;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  width: 90vw;
  max-width: 1180px;
  gap: 1rem;
  font-size: 10px;

  span:first-child {
    cursor: pointer;
    color: ${() => darkGreyColor()};
  }
  span:nth-child(2) {
    color: ${() => darkGreyColor()};
  }
  span:last-child {
    color: ${() => partnerColor()};
    font-style: italic;
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 11px;
    color: #64748b;
    padding: 4px 6px;
    height: 28px;
    min-width: 220px;
  }
`;

const ViewToggle = styled.div`
  display: inline-flex;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;

  button {
    border: none;
    background: #fff;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
  }
  button.active {
    background: ${() => partnerColor()};
    color: #fff;
  }
`;

// ======================== ESTILOS CARDS ========================

const LessonGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const LessonCard = styled(Link)`
  text-decoration: none;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #e1e1e1;
  }
`;

const Thumb = styled.div<{src?: string}>`
  aspect-ratio: 16 / 9;
  background: ${({src}) => src ? `url(${src}) center/cover no-repeat` : "#f7f7f7"};
`;

const CardBody = styled.div`
  padding: 14px 14px 12px;
  display: grid;
  gap: 10px;
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Badge = styled.span`
  font-size: 11px;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 999px;
  background: #f2f5ff;
  color: #334155;
  border: 1px solid #e6ecff;
`;

const TitleCard = styled.h4`
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  color: #111827;
  font-weight: 700;
`;

const Meta = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
`;

const CardFooter = styled.div`
  padding: 0 14px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Plan = styled.span`
  font-size: 12px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 10px;
  border-radius: 8px;
`;

const ShowButton = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${() => partnerColor()};
  color: #fff;
`;

// ======================== ESTILOS LISTA ========================

const RowWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
`;

const CourseRowLink = styled(Link)`
  text-decoration: none;
`;

const CourseRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;
  padding: 0.2rem 0.4rem;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f3f3f3;
  }

  p {
    flex-grow: 1;
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
  }
`;

const StatusDot = styled.i`
  color: white;
  background-color: ${() => partnerColor()};
  border-radius: 50%;
  margin: 0 0.5rem;
`;

const ReorderBox = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;

  button {
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
  button:disabled { opacity: .4; cursor: not-allowed; }
`;

// ======================== TIPAGEM ========================

interface ModulesHomeProps {
  headers: any;
  courseId: string;
  title: string;
}

type ViewMode = "cards" | "list";

// ======================== COMPONENTE ========================

export default function Modules({
  headers,
  courseId,
  title,
}: ModulesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modules, setModules] = useState<any[]>([]);
  const [visibleModules, setVisibleModules] = useState<boolean[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");
  const [theStudentID, setStudentID] = useState<string>("");

  // ===== Toggle de visualização (cards/list), persistido =====
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("modules_view_mode");
    return (saved as ViewMode) || "cards";
  });
  const changeView = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("modules_view_mode", mode);
  };

  const actualHeaders = headers || {};
  const USE_BULK = true;

  const getModules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backDomain}/api/v1/module/${courseId}`, {
        headers: actualHeaders,
      });
      const mod = res.data.modules || [];
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

  // ===== reordenação =====
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

  const swapClassOrder =
    async (moduleIdx: number, viewIdx: number) => async (dir: 1 | -1) => {
      const snapshot = modules[moduleIdx];
      if (!snapshot) return;

      const sorted = (snapshot.classes || [])
        .slice()
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      const from = sorted[viewIdx];
      const to = sorted[viewIdx + dir];
      if (!from || !to) return;

      const aNewOrder = to.order ?? 0;
      const bNewOrder = from.order ?? 0;

      setModules((prev) => {
        const next = structuredClone(prev);
        const moduleCopy = next[moduleIdx];
        const sortedLocal = (moduleCopy.classes || [])
          .slice()
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
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
        await getModules();
      }
    };

  // ===== permissões/selected student =====
  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions } = JSON.parse(user);
      setPermissions(permissions);
      const selectedStudentID =
        localStorage.getItem("selectedStudentID") || "null";
      setStudentID(selectedStudentID);
    }
  }, []);

  // ===== busca/filtragem =====
  useEffect(() => {
    const filteredModules = modules.map((module: any) => ({
      ...module,
      classes: (module.classes || []).filter((cls: any) => {
        const q = (searchQuery || "").toLowerCase();
        const t = (cls.title || "").toLowerCase().includes(q);
        const g =
          Array.isArray(cls.tags) &&
          cls.tags.some((tag: string) => tag?.toLowerCase().includes(q));
        return t || g;
      }),
    }));
    setFiltered(filteredModules);
  }, [searchQuery, modules]);

  // ===== rotas internas =====
  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState(true);
  useEffect(() => {
    const isRootPath =
      loc.pathname === `/teaching-materials/${pathGenerator(title)}/` ||
      loc.pathname === `/teaching-materials/${pathGenerator(title)}`;
    setDisplayRouteDiv(isRootPath);
  }, [loc.pathname, title]);

  // ===== render helpers =====
  const renderCards = (module: any, moduleIdx: number) => {
    const sorted = (module.classes || [])
      .slice()
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return (
      <LessonGrid>
        {sorted.map((cls: any, viewIdx: number) => {
          const img = cls.image || cls.thumbnail || "";
          const tags = Array.isArray(cls.tags) ? cls.tags.slice(0, 3) : [];
          const duration = cls.duration || "60 min";
          const level = cls.level || cls.subtitle || "";
          const type = (cls.type || "Standard Lesson")
            .toString()
            .replace(/_/g, " ");

          return (
            <div key={cls._id}>
              {(thePermissions === "superadmin" || thePermissions === "teacher") && (
                <ReorderBox onClick={(e) => e.preventDefault()}>
                  <button
                    title="Mover para cima"
                    disabled={viewIdx === 0}
                    onClick={async () =>
                      (await swapClassOrder(moduleIdx, viewIdx))(-1)
                    }
                  >
                    ▲
                  </button>
                  <button
                    title="Mover para baixo"
                    disabled={viewIdx === sorted.length - 1}
                    onClick={async () =>
                      (await swapClassOrder(moduleIdx, viewIdx))(+1)
                    }
                  >
                    ▼
                  </button>
                </ReorderBox>
              )}

              <LessonCard to={cls._id}>
                <Thumb src={img} />
                <CardBody>
                  <Badges>
                    {level && <Badge>{level}</Badge>}
                    <Badge>{type}</Badge>
                    <Badge>{duration}</Badge>
                  </Badges>

                  <TitleCard>{viewIdx + 1}. {cls.title}</TitleCard>

                  {tags.length > 0 && (
                    <Meta>{truncateString(tags.join(" · ").toLowerCase(), 60)}</Meta>
                  )}
                </CardBody>

                <CardFooter>
                  <Plan>Unlimited Plan</Plan>
                  <ShowButton>Show</ShowButton>
                </CardFooter>
              </LessonCard>
            </div>
          );
        })}
      </LessonGrid>
    );
  };

  const renderList = (module: any, moduleIdx: number) => {
    const sorted = (module.classes || [])
      .slice()
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return (
      <div style={{ display: "grid", gap: 2, margin: "0 10px" }}>
        {sorted.map((cls: any, viewIdx: number) => (
          <RowWrap key={cls._id}>
            <CourseRowLink to={cls._id}>
              <CourseRow>
                <span style={{ padding: "10px 5px", display: "inline-flex" }}>
                  <StatusDot
                    className={
                      cls.studentsWhoCompletedIt?.includes?.(theStudentID)
                        ? `fa fa-check`
                        : `fa fa-circle`
                    }
                  />
                </span>

                <p style={{ margin: 0, flex: 1 }}>
                  {viewIdx + 1} - {cls.title}
                  {Array.isArray(cls.tags) && cls.tags.length > 0 && (
                    <span
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 10,
                        marginLeft: "1rem",
                      }}
                    >
                      {truncateString(cls.tags.join(", ").toLowerCase(), 20)}
                    </span>
                  )}
                </p>
              </CourseRow>
            </CourseRowLink>

            {(thePermissions === "superadmin" || thePermissions === "teacher") && (
              <ReorderBox onClick={(e) => e.preventDefault()}>
                <button
                  title="Mover para cima"
                  disabled={viewIdx === 0}
                  onClick={async () =>
                    (await swapClassOrder(moduleIdx, viewIdx))(-1)
                  }
                >
                  ▲
                </button>
                <button
                  title="Mover para baixo"
                  disabled={viewIdx === sorted.length - 1}
                  onClick={async () =>
                    (await swapClassOrder(moduleIdx, viewIdx))(+1)
                  }
                >
                  ▼
                </button>
              </ReorderBox>
            )}
          </RowWrap>
        ))}
      </div>
    );
  };

  return (
    <PageWrap>
      {/* Rotas internas para cada aula */}
      <Routes>
        {modules.map((module: any, ix: number) =>
          (module.classes || []).map((cl: any, jx: number) => (
            <Route
              key={`${ix}-${jx}`}
              path={`${cl._id}/`}
              element={
                <EnglishClassCourse2
                  headers={headers}
                  classId={cl._id}
                  course={courseId}
                  previousClass={module.classes[jx - 1]?._id ?? "123456"}
                  nextClass={module.classes[jx + 1]?._id ?? "123456"}
                  courseTitle={title}
                />
              }
            />
          ))
        )}
      </Routes>

      {/* Página raiz */}
      {(() => {
        const loc = useLocation();
        const [displayRouteDiv, setDisplayRouteDiv] = useState(true);
        useEffect(() => {
          const isRootPath =
            loc.pathname === `/teaching-materials/${pathGenerator(title)}/` ||
            loc.pathname === `/teaching-materials/${pathGenerator(title)}`;
          setDisplayRouteDiv(isRootPath);
        }, [loc.pathname, title]);

        if (!displayRouteDiv) return null;

        return (
          <>
            <HOne>{title}</HOne>

            {loading ? (
              <div style={{ display: "grid", placeItems: "center" }}>
                <CircularProgress style={{ color: partnerColor() }} />
              </div>
            ) : (
              <Container>
                <TopBar>
                  <Breadcrumbs>
                    <span
                      onClick={() =>
                        window.location.assign("/teaching-materials")
                      }
                    >
                      Materiais de Ensino
                    </span>
                    <span>-</span>
                    <span>{title}</span>
                  </Breadcrumbs>

                  <TopRow>
                    <SearchBox>
                      <input
                        type="text"
                        placeholder="Search classes by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </SearchBox>

                    <ViewToggle>
                      <button
                        className={viewMode === "cards" ? "active" : ""}
                        onClick={() => changeView("cards")}
                        title="Ver em cartões"
                      >
                        Cards
                      </button>
                      <button
                        className={viewMode === "list" ? "active" : ""}
                        onClick={() => changeView("list")}
                        title="Ver em lista"
                      >
                        Lista
                      </button>
                    </ViewToggle>
                  </TopRow>
                </TopBar>

                {/* MÓDULOS */}
                {filtered
                  .slice()
                  .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                  .map((module: any, moduleIdx: number) => (
                    <div
                      key={moduleIdx}
                      style={{
                        display: (module.classes || []).length ? "block" : "none",
                        marginTop: 16,
                      }}
                    >
                      <HThreeModule
                        onClick={() =>
                          setVisibleModules((prev) => {
                            const n = [...prev];
                            n[moduleIdx] = !n[moduleIdx];
                            return n;
                          })
                        }
                      >
                        {moduleIdx + 1} | {module.moduleTitle ?? `Module #${moduleIdx}`} -{" "}
                        {(module.classes || []).length} Lessons
                      </HThreeModule>

                      {visibleModules[moduleIdx] &&
                        (viewMode === "cards"
                          ? renderCards(module, moduleIdx)
                          : renderList(module, moduleIdx))}
                    </div>
                  ))}
                <Outlet />
              </Container>
            )}
          </>
        );
      })()}
    </PageWrap>
  );
}
