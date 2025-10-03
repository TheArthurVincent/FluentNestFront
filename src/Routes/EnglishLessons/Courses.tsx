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
import { CircularProgress, Tooltip } from "@mui/material";
import Modules from "./Modules";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor, textTitleFont } from "../../Styles/Styles";

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

export default function EnglishCourses({ headers }: EnglishCoursesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [stId, setStId] = useState<string | boolean>(false);
  const [listOfCoursesFromDatabase, setListOfCoursesFromDatabase] = useState<
    Course[]
  >([]);
  const [
    listOfNonAllowedCoursesFromDatabase,
    setListOfNonAllowedCoursesFromDatabase,
  ] = useState<Course[]>([]);

  const actualHeaders = headers || {};

  const getCourses = async () => {
    setLoading(true);
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const studentId = getLoggedUser.id;
    const { permissions } = getLoggedUser;
    setStId(studentId);
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
      }
      setLoading(false);
    } catch (error) {
      onLoggOut();
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
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
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    background: "#fff",
    transition: "transform 160ms ease, box-shadow 160ms ease",
    willChange: "transform",
  };

  const cardHover: React.CSSProperties = {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  };

  const thumbWrap: React.CSSProperties = {
    position: "relative",
    height: 120,
    background: "#f3f4f6",
    overflow: "hidden",
  };

  const titleWrap: React.CSSProperties = {
    padding: "8px 10px 10px",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.25,
    display: "-webkit-box" as any,
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const langBadge: React.CSSProperties = {
    position: "absolute",
    top: 8,
    left: 8,
    padding: "2px 6px",
    fontSize: 12,
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  };

  const lockBadge: React.CSSProperties = {
    position: "absolute",
    top: 8,
    right: 8,
    padding: "2px 6px",
    fontSize: 12,
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 6,
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
            {/* cadeado simples em SVG para não depender de ícones */}
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

    const Body = (
      <div style={titleWrap}>
        <h3 style={titleStyle} title={course.title}>
          {course.title}
        </h3>
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

    if (locked) {
      return (
        <CardShell>
          <Tooltip title="Adquira este material" arrow placement="top">
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
          </Tooltip>
        </CardShell>
      );
    }

    return (
      <CardShell>
        <Link
          to={`${pathGenerator(course.title)}/`}
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
        >
          {Thumb}
          {Body}
        </Link>
      </CardShell>
    );
  };

  const LangSection: React.FC<{
    title: string;
    allowed: Course[];
    nonAllowed: Course[];
  }> = ({ title, allowed, nonAllowed }) => {
    if (allowed.length === 0 && nonAllowed.length === 0) return null;
    return (
      <section style={{ marginTop: "1.25rem" }}>
        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "1.1rem",
            fontFamily: textTitleFont(),
          }}
        >
          {title}
        </h2>
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Routes>
        {listOfCoursesFromDatabase.map((route: Course) => (
          <Route
            key={route._id}
            path={`${pathGenerator(route.title)}/*`}
            element={
              <Modules
                courseId={route._id}
                title={route.title}
                headers={headers}
                studentId={stId}
              />
            }
          />
        ))}
      </Routes>

      <Helmets text="Courses" />

      {displayRouteDiv ? (
        !loading ? (
          <div
            style={{
              backgroundColor: "white",
              width: "90vw",
              maxWidth: 1200,
              marginInline: "auto",
            }}
          >
            <HOne>{UniversalTexts.theCourses}</HOne>
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
        ) : (
          <CircularProgress style={{ color: partnerColor() }} />
        )
      ) : null}

      <Outlet />
    </div>
  );
}
