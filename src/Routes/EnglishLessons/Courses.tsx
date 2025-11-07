import React, { useEffect, useMemo, useState } from "react";
import { HOne } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  backDomain,
  onLoggOut,
  pathGenerator,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { uploadImageViaBackend } from "../../Resources/ImgUpload";
import { useParams } from "react-router-dom";
import Modules from "./Modules"; // garanta o import correto

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

  if (!courses.length) {
    // ainda carregando os cursos
    return <div style={{ padding: 16 }}>Carregando cursos…</div>;
  }

  if (!course) {
    return (
      <div style={{ padding: 16 }}>
        Curso não encontrado para: <code>{courseKey}</code>
      </div>
    );
  }

  return (
    <Modules
      headers={headers}
      courseId={course._id} // <<< passa o ID real
      title={course.title} // <<< para breadcrumb e título
    />
  );
};

/** ==================== TYPES ==================== */
interface EnglishCoursesHomeProps {
  headers: MyHeadersType | null;
}

type Course = {
  _id: string;
  title: string;
  image: string;
  order?: number;
  language?: "en" | "es" | "fr" | string;
};

type Permissions = "superadmin" | "teacher" | "student" | string;

type EditCourseModalProps = {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  headers: any;
  onSaved: () => void;
};

/** ---------- Helpers ---------- */
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

const injectKeyframes = () => {
  if (document.getElementById("no-mui-keyframes")) return;
  const style = document.createElement("style");
  style.id = "no-mui-keyframes";
  style.innerHTML = `
  @keyframes spin{to{transform:rotate(360deg)}}
  .btn{appearance:none;border:1px solid #d1d5db;background:#fff;color:#111827;border-radius:6px;padding:8px 12px;cursor:pointer;font-weight:600}
  .btn:disabled{opacity:.6;cursor:not-allowed}
  .btn.primary{background:${partnerColor()};border-color:${partnerColor()};color:#fff}
  .iconbtn{border:none;background:transparent;padding:6px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
  .iconbtn:hover{background:#f3f4f6}
  .input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px}
  .label{font-size:12px;color:#6b7280;margin-bottom:4px;display:block}
  .stack{display:flex;gap:12px}
  .stack.col{flex-direction:column}
  .stack.row{flex-direction:row}
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
  .modal{width:100%;max-width:640px;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.25);overflow:hidden}
  .modal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;font-weight:700}
  .modal-content{padding:16px;max-height:70vh;overflow:auto}
  .modal-actions{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid #eee}
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
const SvgUpload = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5 20h14v-2H5v2zM12 2 6.5 7.5l1.4 1.4L11 5.8V16h2V5.8l3.1 3.1 1.4-1.4L12 2z" />
  </svg>
);
const SvgCheck = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const SvgClose = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.18 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
  </svg>
);

/** ---------- Modal (edição de curso) ---------- */
const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  course,
  headers,
  onSaved,
}) => {
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => injectKeyframes(), []);
  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setImageUrl(course.image || "");
      setFile(null);
      setError("");
    }
  }, [course]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(String(reader.result));
      reader.readAsDataURL(f);
    }
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    setError("");
    try {
      let finalImage = course.image;
      if (file) {
        finalImage = await uploadImageViaBackend(file, {
          folder: "/courses",
          fileName: `course_${course._id}_${Date.now()}.jpg`,
          headers,
        });
      }
      const payload = { title: title.trim(), image: finalImage };
      await axios.put(
        `${backDomain}/api/v1/course-edit/${course._id}`,
        payload,
        { headers }
      );
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => (!saving ? onClose() : null)}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span>Editar curso</span>
          <button
            className="iconbtn"
            aria-label="Fechar"
            onClick={onClose}
            disabled={saving}
            title="Fechar"
          >
            <SvgClose />
          </button>
        </div>

        <div className="modal-content">
          <div className="stack col">
            <label className="label" htmlFor="course-title">
              Título
            </label>
            <input
              id="course-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
            />

            <div className="stack row" style={{ alignItems: "center" }}>
              <label
                className="btn"
                style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
              >
                <SvgUpload />
                <span>Trocar imagem</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <div
                  style={{ fontSize: 12, color: "#374151" }}
                  title={file.name}
                >
                  {file.name}
                </div>
              )}
            </div>

            {imageUrl && (
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
              </div>
            )}

            {error && (
              <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose} disabled={saving}>
            <div
              style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
            >
              <SvgClose />
              <span>Cancelar</span>
            </div>
          </button>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? (
              <span>Salvando...</span>
            ) : (
              <div
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <SvgCheck />
                <span>Salvar</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/** ---------- Página principal ---------- */
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
  const actualHeaders = headers || {};

  const getCourses = async () => {
    setLoading(true);
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const studentId = getLoggedUser.id;
    const { permissions } = getLoggedUser as { permissions?: Permissions };
    setPermissions((permissions as Permissions) || "student");

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/courses/${studentId}`,
        {
          headers: actualHeaders,
        }
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
    injectKeyframes();
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState<boolean>(true);
  useEffect(() => {
    const isRootPath =
      loc.pathname === "/teaching-materials" ||
      loc.pathname === "/teaching-materials/";
    setDisplayRouteDiv(isRootPath);
  }, [loc.pathname]);

  const { UniversalTexts } = useUserContext();

  const normalizeLang = (lang?: string) => (lang || "en").toLowerCase();
  const sortByOrder = (arr: Course[]) =>
    [...arr].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const groupedAllowed = useMemo(() => {
    return {
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
    };
  }, [listOfCoursesFromDatabase]);

  const groupedNonAllowed = useMemo(() => {
    return {
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
    };
  }, [listOfNonAllowedCoursesFromDatabase]);

  const canEdit = permissions === "superadmin"
  
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

  /** ==================== CARD ==================== */
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

    // === Link padrão vai para /<courseId> (por padrão, usar ID)
    if (!locked) {
      return (
        <CardShell>
          <Link
            to={`${course._id}/`} // <<<<<< ID por padrão
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

    // Bloqueado (sem link)
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

  /** ==================== ROTEAMENTO ====================
   * Aceita:
   *   /teaching-materials/<courseId>/
   *   /teaching-materials/<courseSlug>/
   *   /teaching-materials/<courseId>/<moduleId>
   *   /teaching-materials/<courseSlug>/<moduleSlug>
   *
   * Mantém também as rotas antigas por título do curso (compatibilidade).
   */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Routes>
        {/* mantém compat de rotas antigas por título se quiser */}
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

        {/* NOVO: aceita id ou slug e renderiza Modules corretamente */}
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

      {displayRouteDiv ? (
        !loading ? (
          <div>
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
          </div>
        ) : (
          <Spinner />
        )
      ) : null}

      <Outlet />

      <EditCourseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        course={courseToEdit}
        headers={actualHeaders}
        onSaved={getCourses}
      />
    </div>
  );
}
