import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import axios from "axios";

// ==== App resources (ajuste os paths conforme seu projeto) ====
import Helmets from "../../Resources/Helmets";
import { HOne } from "../../Resources/Components/RouteBox";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
  pathGenerator,
} from "../../Resources/UniversalComponents";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import Modules from "./Modules";
import NewCourseButton from "./NewCourse/NewCourse";
import EditCourseModal, { Course } from "./EditCourse/EditCourse";

// ==== Modal isolado ====

/** ==================== TYPES ==================== */
interface EnglishCoursesHomeProps {
  headers: MyHeadersType | null;
}

type Permissions = "superadmin" | "teacher" | "student" | string;

/** ==================== HELPERS & UI PRIMITIVES ==================== */
const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 36,
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
      margin: "12px auto",
    }}
  />
);

const injectBaseStyles = () => {
  if (document.getElementById("courses-base-styles")) return;
  const style = document.createElement("style");
  style.id = "courses-base-styles";
  style.innerHTML = `
  @keyframes spin{to{transform:rotate(360deg)}}
  .iconbtn{border:none;background:transparent;padding:6px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
  .iconbtn:hover{background:#f3f4f6}
  `;
  document.head.appendChild(style);
};

const SvgEdit = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

/** ==================== BUSCA CURSO POR KEY (id ou slug) ==================== */
function findCourseByKey(
  courses: Array<{ _id: string; title: string }>,
  key: string
) {
  const byId = courses.find((c) => c._id === key);
  if (byId) return byId;
  const bySlug = courses.find((c) => pathGenerator(c.title) === key);
  return bySlug || null;
}

const CourseRouter: React.FC<{
  headers: any;
  courses: Array<{ _id: string; title: string }>;
}> = ({ headers, courses }) => {
  const { courseKey } = useParams();
  const course =
    courseKey && courses.length ? findCourseByKey(courses, courseKey) : null;

  if (!courses.length)
    return <div style={{ padding: 16 }}>Carregando cursos…</div>;
  if (!course)
    return (
      <div style={{ padding: 16 }}>
        Curso não encontrado para: <code>{courseKey}</code>
      </div>
    );

  return (
    <Modules headers={headers} courseId={course._id} title={course.title} />
  );
};

/** ==================== PÁGINA PRINCIPAL ==================== */
export default function EnglishCourses({ headers }: EnglishCoursesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfCoursesFromDatabase, setListOfCoursesFromDatabase] = useState<
    Course[]
  >([]);
  const [
    listOfNonAllowedCoursesFromDatabase,
    setListOfNonAllowedCoursesFromDatabase,
  ] = useState<Course[]>([]);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [permissions, setPermissions] = useState<Permissions>("student");
  const [studentID, setStudentID] = useState<string>("");

  const actualHeaders = headers || {};
  const { UniversalTexts } = useUserContext(); // mantido, caso seja usado no layout
  const location = useLocation();

  useEffect(() => {
    injectBaseStyles();
  }, []);

  const getCourses = async () => {
    setLoading(true);
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const studentId = getLoggedUser.id;
    const { permissions } =
      (getLoggedUser as { permissions?: Permissions }) || {};
    const { id } = getLoggedUser || {};

    setStudentID((id as string) || "");
    setPermissions((permissions as Permissions) || "student");

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/courses/${studentId}`,
        { headers: actualHeaders }
      );
      const classesDB: Course[] = response.data.courses || [];
      const classesNADB: Course[] = response.data.coursesNonAuth || [];

      setListOfCoursesFromDatabase(classesDB);
      if (permissions === "superadmin" || permissions === "teacher") {
        setListOfNonAllowedCoursesFromDatabase(classesNADB);
      } else {
        setListOfNonAllowedCoursesFromDatabase([]);
      }
      setLoading(false);
    } catch {
      onLoggOut();
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== helpers de idioma & ordenação =====
  const normalizeLang = (lang?: string) => (lang || "en").toLowerCase();
  const sortByOrder = (arr: Course[]) =>
    [...arr].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const groupedAllowed = useMemo(
    () => ({
      en: sortByOrder(
        listOfCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "en"
        )
      ),
      es: sortByOrder(
        listOfCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "es"
        )
      ),
      fr: sortByOrder(
        listOfCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "fr"
        )
      ),
      other: sortByOrder(
        listOfCoursesFromDatabase.filter(
          (c) => !["en", "es", "fr"].includes(normalizeLang(c.language))
        )
      ),
    }),
    [listOfCoursesFromDatabase]
  );

  const groupedNonAllowed = useMemo(
    () => ({
      en: sortByOrder(
        listOfNonAllowedCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "en"
        )
      ),
      es: sortByOrder(
        listOfNonAllowedCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "es"
        )
      ),
      fr: sortByOrder(
        listOfNonAllowedCoursesFromDatabase.filter(
          (c) => normalizeLang(c.language) === "fr"
        )
      ),
      other: sortByOrder(
        listOfNonAllowedCoursesFromDatabase.filter(
          (c) => !["en", "es", "fr"].includes(normalizeLang(c.language))
        )
      ),
    }),
    [listOfNonAllowedCoursesFromDatabase]
  );

  const canEdit = permissions === "superadmin";

  /** ==================== GRID / CARD ==================== */
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    padding: 0,
    listStyle: "none",
  };

  const cardBase: React.CSSProperties = {
    listStyle: "none",
    borderRadius: 5,
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    background: "#fff",
    transition: "transform 160ms ease, box-shadow 160ms ease",
    willChange: "transform",
  };

  const cardHover: React.CSSProperties = {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
  };

  const thumbWrap: React.CSSProperties = {
    position: "relative",
    height: 120,
    background: "#f3f4f6",
    overflow: "hidden",
  };

  const titleWrap: React.CSSProperties = { padding: "8px 10px 10px" };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.25,
    display: "-webkit-box" as any,
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const badgeBase: React.CSSProperties = {
    position: "absolute",
    top: 8,
    padding: "2px 6px",
    fontSize: 12,
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    letterSpacing: 0.2,
    textTransform: "uppercase" as const,
    borderRadius: 4,
  };

  const langBadge: React.CSSProperties = { ...badgeBase, left: 8 };
  const lockBadge: React.CSSProperties = {
    ...badgeBase,
    right: 8,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(0,0,0,0.65)",
  };

  const openEdit = (course: Course) => {
    setCourseToEdit(course);
    setEditOpen(true);
  };

  const CourseCard: React.FC<{ course: Course; locked?: boolean }> = ({
    course,
    locked,
  }) => {
    const [hover, setHover] = useState(false);
    const lang = (normalizeLang(course.language) || "en") as
      | "en"
      | "es"
      | "fr"
      | string;
    const langLabel =
      lang === "en" ? "EN" : lang === "es" ? "ES" : lang === "fr" ? "FR" : "OT";

    const Thumb = (
      <div style={thumbWrap}>
        <img
          src={course.image}
          alt={`${course.title}img`}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: locked ? 0.75 : 1,
            transition: "opacity 160ms ease",
          }}
        />
        <span style={langBadge}>{langLabel}</span>
        {locked && (
          <span style={lockBadge} aria-label="locked">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8H9V7a3 3 0 016 0v3z" />
            </svg>
            Bloqueado
          </span>
        )}
      </div>
    );

    const TitleRow = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <h3 style={titleStyle} title={course.title}>
          {course.title}
        </h3>
        {canEdit && (
          <button
            className="iconbtn"
            title="Editar curso"
            aria-label="Editar curso"
            onClick={(e) => {
              e.preventDefault();
              openEdit(course);
            }}
          >
            <SvgEdit />
          </button>
        )}
      </div>
    );

    const Body = <div style={titleWrap}>{TitleRow}</div>;

    const CardShell = ({ children }: { children: React.ReactNode }) => (
      <li
        style={{ ...cardBase, ...(hover ? cardHover : {}) }}
        className="card"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </li>
    );

    if (!locked) {
      return (
        <CardShell>
          <Link
            to={`${course._id}/`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {Thumb}
            {Body}
          </Link>
        </CardShell>
      );
    }

    return (
      <CardShell>
        <div
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            cursor: "default",
          }}
        >
          {Thumb}
          {Body}
        </div>
      </CardShell>
    );
  };

  /** ==================== SEÇÃO POR IDIOMA ==================== */
  const LangSection: React.FC<{
    title: string;
    allowed: Course[];
    nonAllowed: Course[];
  }> = ({ title, allowed, nonAllowed }) => {
    if (allowed.length === 0 && nonAllowed.length === 0) return null;
    return (
      <section style={{ marginTop: "1.25rem" }}>
        <h2 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{title}</h2>
        <ul style={gridStyle}>
          {allowed.map((route) => (
            <CourseCard key={`a-${route._id}`} course={route} />
          ))}
          {nonAllowed.map((route) => (
            <CourseCard key={`n-${route._id}`} course={route} locked />
          ))}
        </ul>
      </section>
    );
  };

  /** ==================== ROTEAMENTO & LAYOUT ==================== */
  const isRootPath =
    location.pathname === "/teaching-materials" ||
    location.pathname === "/teaching-materials/";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Rotas específicas por curso (slug) e rota genérica por :courseKey */}
      <Routes>
        {listOfCoursesFromDatabase.map((route) => (
          <Route
            key={`old-${route._id}`}
            path={`${pathGenerator(route.title)}/*`}
            element={
              <Modules
                headers={actualHeaders}
                courseId={route._id}
                title={route.title}
              />
            }
          />
        ))}
        <Route
          path=":courseKey/*"
          element={
            <CourseRouter
              headers={actualHeaders}
              courses={listOfCoursesFromDatabase}
            />
          }
        />
      </Routes>

      <Helmets text="Courses" />

      {/* Listagem (só na raiz teaching-materials) */}
      {isRootPath && (
        <div>
          {loading ? (
            <Spinner />
          ) : (
            <div
              style={{
                padding: "10px",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                backgroundColor: "white",
                borderRadius: 4,
                width: "90vw",
                maxWidth: 1200,
                marginInline: "auto",
              }}
            >
              <HOne> Cursos </HOne>

              {/* Novo curso */}{permissions === "superadmin" &&
              <NewCourseButton studentId={studentID} headers={actualHeaders} />
}
              <LangSection
                title="English"
                allowed={groupedAllowed.en}
                nonAllowed={groupedNonAllowed.en}
              />
              <LangSection
                title="Español"
                allowed={groupedAllowed.es}
                nonAllowed={groupedNonAllowed.es}
              />
              <LangSection
                title="Français"
                allowed={groupedAllowed.fr}
                nonAllowed={groupedNonAllowed.fr}
              />
              {(groupedAllowed.other.length > 0 ||
                groupedNonAllowed.other.length > 0) && (
                <LangSection
                  title="🌐 Outros idiomas"
                  allowed={groupedAllowed.other}
                  nonAllowed={groupedNonAllowed.other}
                />
              )}
            </div>
          )}
        </div>
      )}

      <Outlet />

      {/* Modal de edição (isolado) */}
      <EditCourseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        course={courseToEdit}
        headers={actualHeaders}
        onSaved={getCourses}
        studentId={studentID}
      />
    </div>
  );
}
