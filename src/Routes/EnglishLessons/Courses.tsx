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
import { partnerColor } from "../../Styles/Styles";
import Modules from "./Modules";
import NewCourseButton from "./NewCourse/NewCourse";
import EditCourseModal, { Course } from "./EditCourse/EditCourse";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";

/** ==================== TYPES ==================== */
interface EnglishCoursesHomeProps {
  headers: MyHeadersType | null;
  change: any;
  setChange: any;
  isDesktop: boolean;
}
type Permissions = "superadmin" | "teacher" | "student" | string;

// Estende o Course apenas para campos vindos do backend
type CourseWithCreator = Course & {
  creatorFullName?: string | null; // exibição do criador
  isOriginal?: boolean;
  createdBy?: string; // ID do criador no BD
};

/** ==================== UTILS / BASE STYLES ==================== */
const injectBaseStyles = () => {
  if (document.getElementById("courses-base-styles")) return;
  const style = document.createElement("style");
  style.id = "courses-base-styles";
  style.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg) } }

    .iconbtn {
      border: none; background: transparent; padding: 8px; border-radius: 10px;
      cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
    }
    .iconbtn:hover { background: #f3f4f6 }
    .iconbtn:focus-visible {
      outline: 2px solid ${partnerColor()}; outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .card { transition: none !important; }
    }

    .card a:focus-visible {
      outline: 2px solid ${partnerColor()};
      outline-offset: 2px;
      border-radius: 10px;
    }
  `;
  document.head.appendChild(style);
};

const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = partnerColor(),
}) => (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      minHeight: "40vh",
    }}
  >
    <div
      role="status"
      aria-label="Carregando"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "3px solid #e5e7eb",
        borderTopColor: color,
        animation: "spin 0.8s linear infinite",
      }}
    />
  </div>
);

/** ==================== HELPERS ==================== */
function findCourseByKey(
  courses: Array<{ _id: string; title: string }>,
  key: string
) {
  const byId = courses.find((c) => c._id === key);
  if (byId) return byId;
  const bySlug = courses.find((c) => pathGenerator(c.title) === key);
  return bySlug || null;
}

const normalizeLang = (lang?: string) => (lang || "en").toLowerCase();

const sortByOrder = (arr: CourseWithCreator[]) =>
  [...arr].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

const sortByTitle = (arr: CourseWithCreator[]) =>
  [...arr].sort((a, b) =>
    (a.title || "").localeCompare(b.title || "", undefined, {
      sensitivity: "base",
    })
  );

const sortByCreatorName = (arr: CourseWithCreator[]) =>
  [...arr].sort((a, b) => {
    const nameA = a.creatorFullName?.trim().toLowerCase() || "";
    const nameB = b.creatorFullName?.trim().toLowerCase() || "";
    return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
  });

// Usa creatorFullName quando houver; caso contrário, cai para order
const sortByCreatorThenOrder = (arr: CourseWithCreator[]) =>
  [...arr].sort((a, b) => {
    const aName = a.creatorFullName?.trim();
    const bName = b.creatorFullName?.trim();
    if (aName && bName) {
      return aName.localeCompare(bName, undefined, { sensitivity: "base" });
    }
    if (aName && !bName) return -1;
    if (!aName && bName) return 1;
    // ambos sem nome: usa order
    return (a.order ?? 9999) - (b.order ?? 9999);
  });

/** Pode editar este curso? (helper central) */
const canEditCourseFor = (
  course: CourseWithCreator,
  permissions: Permissions,
  studentID: string
) => {
  if (permissions === "superadmin") return true;
  if (permissions === "teacher") {
    return (
      course.isOriginal === false &&
      String(course.createdBy || "") === String(studentID || "")
    );
  }
  return false;
};

/** ==================== SUBCOMPONENTES (style-only) ==================== */
// Grid / Card styles — alinhados ao “estilinho” do MyHomePage
const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 12,
  padding: 0,
  listStyle: "none",
};

const cardBase: React.CSSProperties = {
  listStyle: "none",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #E3E8F0",
  background: "#fff",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  willChange: "transform",
};

const cardHover: React.CSSProperties = {
  transform: "translateY(-1px)",
};

const thumbWrap: React.CSSProperties = {
  position: "relative",
  // ALTURA responsiva (evita vazar em telas estreitas)
  height: "clamp(140px, 38vw, 180px)",
  background: "#f3f4f6",
  padding: 0,
  overflow: "hidden",
  borderRadius: "12px 12px 0 0",
};

const titleWrap: React.CSSProperties = { padding: "10px 12px 12px" };

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.98rem",
  lineHeight: 1.25,
  fontFamily: "Plus Jakarta Sans", // tipografia do estilinho
  fontWeight: 600,
  display: "-webkit-box" as any,
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const badgeBase: React.CSSProperties = {
  position: "absolute",
  top: 8,
  padding: "2px 8px",
  fontSize: 12,
  background: "rgba(17,24,39,0.8)", // melhor contraste que 0,72
  color: "#fff",
  letterSpacing: 0.2,
  textTransform: "uppercase" as const,
  borderRadius: 999,
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  backdropFilter: "blur(2px)", // texto mais legível sobre imagem
};

const langBadge: React.CSSProperties = { ...badgeBase, left: 8 };
const lockBadge: React.CSSProperties = {
  ...badgeBase,
  right: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const SectionTitleStyle: React.CSSProperties = {
  margin: "8px",
  fontSize: "1.1rem",
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  letterSpacing: 0,
};

/** Header da lista no “estilinho” do MyHomePage */
const headerAll: React.CSSProperties = {
  padding: 16,
  display: "grid",
  gap: 8,
  zIndex: 100,
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: 16,
  // position: "sticky",
  top: "max(0px, env(safe-area-inset-top))", // 👈 iOS notch friendly
  left: 0,
  backdropFilter: "saturate(1.2) blur(6px)", // 👈 agradável
  backgroundColor: "#ffffff",
  border: "1px solid #E3E8F0",
};

const headerLeftStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 8,
};

const headerRightStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

/** ==================== Course Card ==================== */
const CourseCard: React.FC<{
  course: CourseWithCreator;
  locked?: boolean;
  canEdit: boolean;
  onEdit: (c: CourseWithCreator) => void;
}> = ({ course, locked, canEdit, onEdit }) => {
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
        decoding="async"
        sizes="(max-width: 600px) 100vw, 210px"
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
          <i className="fa fa-lock" aria-hidden="true" />
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
            onEdit(course);
          }}
        >
          <i className="fa fa-pencil" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const Byline =
    !course.isOriginal && course.creatorFullName ? (
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "Plus Jakarta Sans",
        }}
        title={course.creatorFullName}
      >
        {course.creatorFullName}
      </div>
    ) : null;

  const Body = (
    <div style={titleWrap}>
      {TitleRow}
      {Byline}
    </div>
  );

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
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
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

const LangSection: React.FC<{
  title: string;
  allowed: CourseWithCreator[];
  nonAllowed: CourseWithCreator[];
  computeCanEdit: (c: CourseWithCreator) => boolean;
  onEdit: (c: CourseWithCreator) => void;
}> = ({ title, allowed, nonAllowed, computeCanEdit, onEdit }) => {
  if (allowed.length === 0 && nonAllowed.length === 0) return null;
  return (
    <section style={{ marginTop: "1rem" }}>
      <h2 style={SectionTitleStyle}>{title}</h2>
      <ul style={gridStyle}>
        {allowed.map((course) => (
          <CourseCard
            key={`a-${course._id}`}
            course={course}
            canEdit={computeCanEdit(course)}
            onEdit={onEdit}
          />
        ))}
        {nonAllowed.map((course) => (
          <CourseCard
            key={`n-${course._id}`}
            course={course}
            locked
            canEdit={false}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </section>
  );
};

/** ==================== ROTEADOR POR :courseKey ==================== */
const CourseRouter: React.FC<{
  headers: any;
  courses: CourseWithCreator[];
  permissions: Permissions;
  studentID: string;
}> = ({ headers, courses, permissions, studentID }) => {
  const { courseKey } = useParams();
  const course =
    courseKey && courses.length
      ? (findCourseByKey(courses, courseKey) as CourseWithCreator | null)
      : null;

  if (!courses.length)
    return <div style={{ padding: 16 }}>Carregando cursos…</div>;
  if (!course)
    return (
      <div style={{ padding: 16 }}>
        Curso não encontrado para: <code>{courseKey}</code>
      </div>
    );

  return (
    <Modules
      isDesktop={true}
      canEditCourse={canEditCourseFor(course, permissions, studentID)}
      headers={headers}
      courseId={course._id}
      title={course.title}
    />
  );
};

/** ==================== PÁGINA PRINCIPAL ==================== */
export default function EnglishCourses({
  headers,
  change,
  isDesktop,
  setChange,
}: EnglishCoursesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfCoursesFromDatabase, setListOfCoursesFromDatabase] = useState<
    CourseWithCreator[]
  >([]);
  const [
    listOfNonAllowedCoursesFromDatabase,
    setListOfNonAllowedCoursesFromDatabase,
  ] = useState<CourseWithCreator[]>([]);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseWithCreator | null>(
    null
  );

  const [permissions, setPermissions] = useState<Permissions>("student");
  const [studentID, setStudentID] = useState<string>("");

  // Para o título “Cursos de ...”
  const [teacherName, setTeacherName] = useState<string>("");

  const actualHeaders = headers || {};
  const location = useLocation();

  useEffect(() => {
    injectBaseStyles();
  }, []);

  const getCourses = async () => {
    setLoading(true);
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");

    const studentId = getLoggedUser.id;
    const userPermissions: Permissions =
      (getLoggedUser?.permissions as Permissions) || "student";
    const { id } = getLoggedUser || {};

    // capturar name/lastname para título
    const firstName = (getLoggedUser?.name || "").toString().trim();
    const lastName = (getLoggedUser?.lastname || "").toString().trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    setTeacherName(fullName || "Professor(a)");

    setStudentID((id as string) || "");
    setPermissions(userPermissions);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/courses/${studentId}`,
        { headers: actualHeaders }
      );

      const classesDB: CourseWithCreator[] = response.data.courses || [];
      const classesNADB: CourseWithCreator[] =
        response.data.coursesNonAuth || [];

      setListOfCoursesFromDatabase(classesDB);
      if (userPermissions === "superadmin" || userPermissions === "teacher") {
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

  /** ==================== DERIVADOS ==================== */
  const allowedNonOriginal = useMemo(
    () =>
      sortByCreatorThenOrder(
        (listOfCoursesFromDatabase || []).filter(
          (c: any) => c && c.isOriginal === false
        )
      ),
    [listOfCoursesFromDatabase]
  );

  const nonAllowedNonOriginal = useMemo(
    () =>
      sortByCreatorName(
        (listOfNonAllowedCoursesFromDatabase || []).filter(
          (c: any) => c && c.isOriginal === false
        )
      ),
    [listOfNonAllowedCoursesFromDatabase]
  );

  const allowedOriginalOnly = useMemo(
    () =>
      (listOfCoursesFromDatabase || []).filter(
        (c: any) => c && c.isOriginal !== false
      ),
    [listOfCoursesFromDatabase]
  );

  const nonAllowedOriginalOnly = useMemo(
    () =>
      (listOfNonAllowedCoursesFromDatabase || []).filter(
        (c: any) => c && c.isOriginal !== false
      ),
    [listOfNonAllowedCoursesFromDatabase]
  );

  const groupedAllowed = useMemo(
    () => ({
      en: sortByOrder(
        allowedOriginalOnly.filter((c) => normalizeLang(c.language) === "en")
      ),
      es: sortByOrder(
        allowedOriginalOnly.filter((c) => normalizeLang(c.language) === "es")
      ),
      fr: sortByOrder(
        allowedOriginalOnly.filter((c) => normalizeLang(c.language) === "fr")
      ),
      other: sortByOrder(
        allowedOriginalOnly.filter(
          (c) => !["en", "es", "fr"].includes(normalizeLang(c.language))
        )
      ),
    }),
    [allowedOriginalOnly]
  );

  const groupedNonAllowed = useMemo(
    () => ({
      en: sortByOrder(
        nonAllowedOriginalOnly.filter((c) => normalizeLang(c.language) === "en")
      ),
      es: sortByOrder(
        nonAllowedOriginalOnly.filter((c) => normalizeLang(c.language) === "es")
      ),
      fr: sortByOrder(
        nonAllowedOriginalOnly.filter((c) => normalizeLang(c.language) === "fr")
      ),
      other: sortByOrder(
        nonAllowedOriginalOnly.filter(
          (c) => !["en", "es", "fr"].includes(normalizeLang(c.language))
        )
      ),
    }),
    [nonAllowedOriginalOnly]
  );

  /** ==================== CALLBACKS ==================== */
  const openEdit = (course: CourseWithCreator) => {
    setCourseToEdit(course);
    setEditOpen(true);
  };

  const computeCanEdit = (course: CourseWithCreator) =>
    canEditCourseFor(course, permissions, studentID);

  /** ==================== ROTAS ==================== */
  const isRootPath =
    location.pathname === "/teaching-materials" ||
    location.pathname === "/teaching-materials/";

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
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
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>Materiais de Aula e Cursos</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: "0",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {/* Rotas específicas por curso (slug) e rota genérica por :courseKey */}
          <Routes>
            {listOfCoursesFromDatabase.map((route) => (
              <Route
                key={`old-${route._id}`}
                path={`${pathGenerator(route.title)}/*`}
                element={
                  <Modules
                    setChange={setChange}
                    change={change}
                    isDesktop={isDesktop}
                    canEditCourse={computeCanEdit(route)}
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
                  permissions={permissions}
                  studentID={studentID}
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
                    padding: "1rem",
                  }}
                >
                  {/* Header igual ao MyHomePage */}
                  <div>
                    {/* Mantive apenas visual – sem lógica de busca */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <div style={headerRightStyle}>
                        {(permissions === "superadmin" ||
                          permissions === "teacher") && (
                          <NewCourseButton
                            studentId={studentID}
                            headers={actualHeaders}
                          />
                        )}
                      </div>

                      <Link
                        style={{
                          marginLeft: 16,
                          marginBottom: -10,
                          fontSize: 14,
                          cursor: "pointer",
                          color: partnerColor(),
                          textDecoration: "none",
                          fontFamily: "Plus Jakarta Sans", // style-only
                        }}
                        to="/"
                      >
                        Voltar para Home Page
                      </Link>
                    </div>
                  </div>

                  {/* Primeira categoria — cursos NÃO originais (ignorando idioma) */}
                  {(allowedNonOriginal.length > 0 ||
                    nonAllowedNonOriginal.length > 0) && (
                    <LangSection
                      title={
                        permissions === "superadmin"
                          ? "Materiais de Outros Criadores"
                          : permissions === "teacher"
                          ? `Materiais de ${teacherName}`
                          : "Materiais disponíveis"
                      }
                      allowed={allowedNonOriginal}
                      nonAllowed={nonAllowedNonOriginal}
                      computeCanEdit={computeCanEdit}
                      onEdit={openEdit}
                    />
                  )}

                  {/* Originais por idioma */}
                  <LangSection
                    title="English"
                    allowed={groupedAllowed.en}
                    nonAllowed={groupedNonAllowed.en}
                    computeCanEdit={computeCanEdit}
                    onEdit={openEdit}
                  />
                  <LangSection
                    title="Español"
                    allowed={groupedAllowed.es}
                    nonAllowed={groupedNonAllowed.es}
                    computeCanEdit={computeCanEdit}
                    onEdit={openEdit}
                  />
                  <LangSection
                    title="Français"
                    allowed={groupedAllowed.fr}
                    nonAllowed={groupedNonAllowed.fr}
                    computeCanEdit={computeCanEdit}
                    onEdit={openEdit}
                  />
                  {(groupedAllowed.other.length > 0 ||
                    groupedNonAllowed.other.length > 0) && (
                    <LangSection
                      title="🌐 Outros idiomas"
                      allowed={groupedAllowed.other}
                      nonAllowed={groupedNonAllowed.other}
                      computeCanEdit={computeCanEdit}
                      onEdit={openEdit}
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
            course={courseToEdit as Course}
            headers={actualHeaders}
            onSaved={getCourses}
            studentId={studentID}
          />
        </div>
      </div>
    </div>
  );
}
