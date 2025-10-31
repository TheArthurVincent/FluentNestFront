import React, { useEffect, useState } from "react";
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
import { darkGreyColor, partnerColor } from "../../Styles/Styles";
import { HThreeModule } from "../MyClasses/MyClasses.Styled";
import { CourseCard } from "./EnglishCourses.Styled";
import EnglishClassCourse2 from "./Class";
import { truncateTitle } from "./CoursesSideBar/CoursesSideBar";
import { notifyAlert } from "./Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";

interface ModulesHomeProps {
  headers: MyHeadersType | null;
  courseId: string;
  title: string;
}

export default function Modules({
  headers,
  courseId,
  title,
}: ModulesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modules, setModules] = useState<any>([]);
  const [visibleModules, setVisibleModules] = useState<boolean[]>([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");
  const [theStudentID, setStudentID] = useState<string>("");
  const [studentsList, setStudentsList] = useState<any[]>([]);

  const fetchStudents = async () => {
    const user = localStorage.getItem("loggedIn");
    const selectedStudentID =
      localStorage.getItem("selectedStudentID") || "null";
    const { id, permissions } = JSON.parse(user || "");

    if (user) {
      setStudentID(selectedStudentID || id);
    }
    setPermissions(permissions);
    if (permissions === "student") return;
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers: actualHeaders,
      });
      setStudentsList(response.data.listOfStudents);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    const { permissions } = JSON.parse(user || "");
    const selectedStudentID =
      localStorage.getItem("selectedStudentID") || "null";
    setStudentID(selectedStudentID);
    if (permissions !== "student") {
      setTimeout(() => {
        fetchStudents();
      }, 1000);
    }
  }, []);

  const handleStudentChange = (event: any) => {
    var theid = event.target.value;
    setStudentID(theid);
    localStorage.setItem("selectedStudentID", theid);
  };

  const actualHeaders = headers || {};

  const getModules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/module/${courseId}`,
        { headers: actualHeaders }
      );

      var mod = response.data.modules;
      setModules(mod);
      setVisibleModules(new Array(mod.length).fill(true));
      setLoading(false);
    } catch (error) {
      console.log(error, "Erro ao obter aulas");
      onLoggOut();
      setLoading(false);
    }
  };

  useEffect(() => {
    getModules();
  }, []);

  const toggleModuleVisibility = (index: number) => {
    setVisibleModules((prev) => {
      const newVisibleModules = [...prev];
      newVisibleModules[index] = !newVisibleModules[index];
      return newVisibleModules;
    });
  };

  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState<boolean>(true);

  useEffect(() => {
    const isRootPath =
      loc.pathname === `/teaching-materials/${pathGenerator(title)}/` ||
      loc.pathname === `/teaching-materials/${pathGenerator(title)}`;
    setDisplayRouteDiv(isRootPath);
  }, [loc.pathname]);

  useEffect(() => {
    // Filtra os módulos com base na pesquisa e atualiza o estado
    const filteredModules = modules.map((module: any) => {
      return {
        ...module,
        classes: module.classes.filter((cls: any) => {
          // Verifica o título e as tags
          const titleMatches = cls.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const tagsMatch = cls.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return titleMatches || tagsMatch;
        }),
      };
    });
    setFiltered(filteredModules);
  }, [searchQuery, modules]);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <Routes>
        {modules.map((module: any, index: number) =>
          module.classes.map((classItem: any, index2: number) => {
            const isLastModule = index === modules.length - 1;
            const isLastClass = index2 === module.classes.length - 1;
            return (
              <Route
                key={`${index}-${index2}`}
                path={`${classItem._id}/`}
                element={
                  <EnglishClassCourse2
                    headers={headers}
                    classId={classItem._id}
                    course={courseId}
                    previousClass={
                      index2 == 0 ? "123456" : module.classes[index2 - 1]._id
                    }
                    nextClass={
                      !isLastClass
                        ? module.classes[index2 + 1]._id
                        : !isLastModule && modules[index + 1]?.classes[0]?._id
                        ? modules[index + 1]?.classes[0]?._id
                        : "123456"
                    }
                    courseTitle={title}
                  />
                }
              />
            );
          })
        )}
      </Routes>
      {displayRouteDiv ? (
        <div>
          <HOne>{title}</HOne>
          {loading ? (
            <>
              <CircularProgress style={{ color: partnerColor() }} />
            </>
          ) : (
            <div className="flex-grid">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90vw",
                  justifyContent: "left",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    cursor: "pointer",

                    textDecoration: "none",
                    color: darkGreyColor(),
                  }}
                  onClick={() => window.location.assign("/teaching-materials")}
                >
                  Materiais de Ensino
                </span>
                <span
                  style={{
                    color: darkGreyColor(),
                  }}
                >
                  -
                </span>
                <span
                  style={{
                    color: partnerColor(),
                    fontSize: "10px",
                    fontStyle: "italic",
                    textDecoration: "none",
                  }}
                >
                  {title}
                </span>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span
                  style={{
                    display:
                      thePermissions === "superadmin" ||
                      thePermissions === "teacher"
                        ? "block"
                        : "none",
                  }}
                >
                  <select
                    onChange={(e) => handleStudentChange(e)}
                    value={theStudentID}
                    style={{
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "#64748b",
                      padding: "4px 6px",
                      height: "28px",
                      minWidth: "120px",
                      maxWidth: "150px",
                      outline: "none",
                      cursor: "pointer",
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
                        {student.name + " " + student.lastname}
                      </option>
                    ))}
                  </select>
                </span>
                <input
                  type="text"
                  placeholder="Search classes by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  style={{
                    borderRadius: "4px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    fontSize: "11px",
                    fontWeight: "400",
                    color: "#64748b",
                    padding: "4px 6px",
                    height: "28px",
                    minWidth: "120px",
                    outline: "none",
                  }}
                />
              </span>
            </div>
          )}

          {filtered
            .sort((a: any, b: any) => a.order - b.order)
            .map((module: any, index: number) => (
              <div
                key={index}
                style={{
                  display: module.classes.length > 0 ? "block" : "none",
                }}
              >
                <HThreeModule onClick={() => toggleModuleVisibility(index)}>
                  {index + 1} |{" "}
                  {module.moduleTitle ? module.moduleTitle : `Module #${index}`}{" "}
                  - {module.classes.length} Lessons
                </HThreeModule>
                {visibleModules[index] && (
                  <div
                    style={{
                      display: "grid",
                      gap: "2px",
                      margin: "0 10px",
                    }}
                  >
                    {module.classes.map((cls: any, idx: number) => (
                      <div key={idx}>
                        <Link
                          to={cls._id}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <CourseCard>
                            {
                              <span
                                style={{
                                  paddingRight: "5px",
                                  paddingLeft: "5px",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                }}
                              >
                                <i
                                  style={{
                                    color: "white",
                                    backgroundColor: partnerColor(),
                                    borderRadius: "50%",
                                    margin: "0 0.5rem",
                                  }}
                                  className={
                                    cls.studentsWhoCompletedIt.includes(
                                      theStudentID
                                    )
                                      ? `fa fa-check`
                                      : `fa fa-circle`
                                  }
                                />
                              </span>
                            }
                            {/* <img
                              src={
                                cls.image
                                  ? cls.image
                                  : "https://ik.imagekit.io/vjz75qw96/assets/assets_for_classes/bg2.png?updatedAt=1687554564387"
                              }
                              alt={cls.title}
                            /> */}
                            <p className="hoverable-paragraph">
                              {idx + 1}- {cls.title}
                              <span
                                className="hidden-span"
                                style={{
                                  fontStyle: "italic",
                                  fontWeight: "400",
                                  fontSize: "10px",
                                  marginLeft: "1rem",
                                }}
                              >
                                {cls.tags.length > 0 &&
                                  truncateTitle(
                                    cls.tags.join(", ").toLowerCase(),
                                    30
                                  )}
                              </span>
                            </p>
                          </CourseCard>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          <Helmets text={title} />
        </div>
      ) : null}
      <Outlet />
    </div>
  );
}
