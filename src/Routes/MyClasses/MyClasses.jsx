import axios from "axios";
import Helmets from "../../Resources/Helmets";
import React, { useEffect, useState } from "react";
import { RouteDiv, HOne, HTwo } from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  IFrameVideoClass,
  ResponsiveIframe,
  backDomain,
  formatDate,
  formatDateBr,
  getVideoEmbedUrl,
  onLoggOut,
} from "../../Resources/UniversalComponents";
import { ClassBox, TransectionMenu } from "./MyClasses.Styled";
import {
  alwaysBlack,
  partnerColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import { Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { getEmbedUrl } from "../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFuncions";

export function MyClasses({ headers }) {
  const [loading, setLoading] = useState(false);
  const [IsAllowed, setIsAllowed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentNXTId, setStudentNXTId] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [permissions, setPermissions] = useState("");
  const [MYID, setMYID] = useState("");
  const [newID, setNewID] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const { UniversalTexts } = useUserContext();

  async function fetchMonthYear() {
    setLoading(true);
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn"));

    // Check if user is logged in
    if (!getLoggedUser || !getLoggedUser.id) {
      console.error("No logged user found, redirecting to login");
      onLoggOut();
      return;
    }

    // Check if authorization token exists
    const authToken = localStorage.getItem("authorization");
    if (!authToken) {
      console.error("No authorization token found, redirecting to login");
      onLoggOut();
      return;
    }

    setPermissions(getLoggedUser.permissions);
    setStudentId(getLoggedUser.id);
    try {
      const requestConfig = { headers };
      const response = await axios.get(
        `${backDomain}/api/v1/tutoring/${getLoggedUser.id}`,
        requestConfig
      );
      console.log(response.data.formattedTutoringFromParticularStudent);
      setClasses(response.data.formattedTutoringFromParticularStudent);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      // If it's an auth error, log out
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error, logging out");
        onLoggOut();
      } else {
        setLoading(false);
      }
    }
  }

  async function fetchNextStudentClasses(id) {
    setLoading(true);
    setStudentNXTId(id);
    try {
      const response = await axios.get(`${backDomain}/api/v1/tutoring/${id}`, {
        headers,
      });
      console.log(response.data.formattedTutoringFromParticularStudent);
      setClasses(response.data.formattedTutoringFromParticularStudent);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar aulas do aluno:", error);
      notifyAlert("Erro ao buscar aulas do aluno");
      setLoading(false);
    }
  }
  useEffect(() => {
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn"));
    setPermissions(getLoggedUser.permissions);
    setMYID(getLoggedUser.id);
    setIsAllowed(
      getLoggedUser.permissions == "superadmin" ||
        getLoggedUser.permissions == "teacher"
    );
  }, []);

  const fetchStudents = async () => {
    if (IsAllowed) {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${MYID}`,
          {
            headers,
          }
        );
        setStudentsList(response.data.listOfStudents);
      } catch (error) {
        console.log(error, "Erro ao encontrar aaalunos");
        notifyAlert("Erro ao encontrar aaalunos");
      }
    } else {
      null;
    }
  };

  useEffect(() => {
    fetchMonthYear();
    fetchStudents();
  }, [IsAllowed]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);

  const totalItems = classes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    const selectedItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(1);
  };

  function ClassesSideBar() {
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "4px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              padding: "4px 12px",
              fontSize: "13px",
              borderRadius: "4px",
              backgroundColor: currentPage === 1 ? "#f5f5f5" : partnerColor(),
              color: currentPage === 1 ? "#999" : "white",
              border: "1px solid #ccc",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {UniversalTexts.previousButton}
          </button>

          <span
            style={{
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              color: "#333",
              minWidth: "60px",
              textAlign: "center",
            }}
          >
            {currentPage}/{totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: "4px 12px",
              fontSize: "13px",
              borderRadius: "4px",
              backgroundColor:
                currentPage === totalPages ? "#f5f5f5" : partnerColor(),
              color: currentPage === totalPages ? "#999" : "white",
              border: "1px solid #ccc",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {UniversalTexts.nextButton}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontSize: "13px",
              color: "#333",
              fontWeight: "500",
            }}
          >
            {UniversalTexts.itemsPerPage}
          </label>
          <select
            style={{
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
              minWidth: "60px",
            }}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {[10, 20, 30].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  async function handleDelete(tutoringID, studentNXTId) {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/tutoring/${tutoringID}`,
        { headers }
      );
      notifyAlert(`Aula com ID ${tutoringID} excluída`);
      fetchNextStudentClasses(studentNXTId);
    } catch (error) {
      console.log(`Erro ao excluir aula com ID ${tutoringID}: ${error}`);
      notifyAlert(`Erro ao excluir aula com ID ${tutoringID}: ${error}`);
    }
  }

  const handleStudentChange = (event) => {
    setNewID(event.target.value);
    fetchNextStudentClasses(event.target.value);
  };

  return (
    <>
      <HOne>{UniversalTexts.myClasses}</HOne>
      <section
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        {/* Student Selector for Superadmin */}
        {(permissions === "superadmin" || permissions === "teacher") && (
          <div style={{ marginBottom: "20px" }}>
            <select
              onChange={handleStudentChange}
              name="students"
              value={newID}
              style={{
                width: "100%",
                padding: "6px 10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                maxWidth: "400px",
              }}
            >
              <option value="" hidden>
                Selecione um aluno
              </option>
              {studentsList.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastname}
                </option>
              ))}
            </select>
          </div>
        )}

        {!loading ? (
          <div>
            <ClassesSideBar />

            {/* Classes List */}
            {currentClasses.map((classItem, index) => {
              console.log(
                classItem.date,

                new Date(classItem.date)
              );
              const isOpen = openIndex === index;
              const isRealizada = classItem.status === "realizada";

              const timeChipStyle = {
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: "6px",
                border: isRealizada ? "1px solid #065f46" : "1px solid #a31111",
                background: isRealizada
                  ? "rgba(5,150,105,0.07)"
                  : "rgba(163,17,17,0.08)",
                color: isRealizada ? "#065f46" : "#a31111",
                fontWeight: 600,
              };

              const cardStyle = {
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                transition: "box-shadow 0.2s ease, transform 0.06s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                overflow: "hidden",
                marginBottom: "12px",
              };

              return (
                <div
                  key={classItem.id}
                  style={cardStyle}
                  className="box-shadow-white"
                >
                  {/* Header */}
                  <div style={{ width: "100%" }}>
                    <div
                      onClick={() => toggleOpen(index)}
                      role="button"
                      aria-expanded={isOpen}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleOpen(index);
                        }
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        background: "#fff",
                        cursor: "pointer",
                        borderBottom: "1px solid #eef2f7",
                        outline: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fafafa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff")
                      }
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(2,132,199,0.2)")
                      }
                      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                      {/* Data + Hora */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#0c4a6e",
                          minWidth: 0,
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={timeChipStyle}>
                          {formatDateBr(
                            new Date(
                              new Date(classItem.date).getTime() +
                                3.5 * 60 * 60 * 1000
                            )
                          ) !== "Invalid Date"
                            ? formatDateBr(
                                new Date(
                                  new Date(classItem.date).getTime() +
                                    3.5 * 60 * 60 * 1000
                                )
                              )
                            : classItem.date}
                        </span>
                      </div>

                      {/* Chevron */}
                      <div
                        aria-hidden
                        style={{
                          transition: "transform 0.2s ease",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: 1,
                          marginLeft: "10px",
                        }}
                      >
                        ▾
                      </div>
                    </div>

                    {/* Conteúdo Expandido */}
                    {isOpen && (
                      <div
                        style={{
                          padding: "10px 12px",
                          display: "grid",
                          gap: "12px",
                        }}
                      >
                        {/* Status Badge (menor e mais quadrado) */}
                        {classItem.status && (
                          <div>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 700,
                                backgroundColor: isRealizada
                                  ? "#eaf7ef"
                                  : "#fff7e6",
                                color: isRealizada ? "#1f6b1f" : "#7a5a00",
                                border: isRealizada
                                  ? "1px solid #c7e8cf"
                                  : "1px solid #ffe3a3",
                                letterSpacing: "0.3px",
                                textTransform: "uppercase",
                              }}
                            >
                              {isRealizada ? "Realizada" : classItem.status}
                            </span>
                          </div>
                        )}
                        {classItem.time && (
                          <span style={timeChipStyle}>{classItem.time}</span>
                        )}

                        {/* Resumo da Aula */}
                        {classItem.title && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                              padding: "10px",
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                            }}
                          >
                            <>
                              <strong
                                style={{ color: "#374151", fontSize: "14px" }}
                              >
                                Resumo da Aula:
                              </strong>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "13px",
                                  color: "#6b7280",
                                  lineHeight: 1.5,
                                }}
                              >
                                {classItem.title}
                              </p>
                            </>
                          </div>
                        )}

                        {/* Homework */}
                        {classItem.homework && (
                          <div
                            style={{
                              padding: "12px",
                              backgroundColor: "#fffef7",
                              border: "1px solid #fde68a",
                              borderRadius: "6px",
                            }}
                          >
                            <strong
                              style={{
                                color: "#92400e",
                                fontSize: "14px",
                                display: "block",
                                marginBottom: "8px",
                              }}
                            >
                              📝 Homework:
                            </strong>

                            <div
                              style={{
                                marginTop: "4px",
                                marginBottom: "10px",
                                fontSize: "12px",
                                color: "#92400e",
                              }}
                            >
                              {UniversalTexts.seeOnHomeworkPage}
                            </div>

                            <div
                              style={{
                                fontSize: "13px",
                                color: "#78350f",
                                lineHeight: 1.6,
                                maxHeight: "300px",
                                overflowY: "auto",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: classItem.homework,
                              }}
                            />
                          </div>
                        )}

                        {/* Links */}
                        <div style={{ display: "grid", gap: "8px" }}>
                          {classItem.attachments && (
                            <div
                              style={{
                                padding: "8px",
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                              }}
                            >
                              <Link
                                to={classItem.attachments}
                                style={{
                                  color: partnerColor(),
                                  textDecoration: "none",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <i className="fa fa-file-o" />
                                {classItem.fileName || "Class File"}
                              </Link>
                            </div>
                          )}

                          {classItem.importantLink && (
                            <div
                              style={{
                                padding: "8px",
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                              }}
                            >
                              <Link
                                to={classItem.importantLink}
                                target="_blank"
                                style={{
                                  color: partnerColor(),
                                  textDecoration: "none",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <i className="fa fa-external-link" />
                                Material Importante
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Vídeo */}
                        {classItem.videoUrl && (
                          <div style={{ display: "grid", gap: "10px" }}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                paddingBottom: "56.25%",
                                height: 0,
                                overflow: "hidden",
                                borderRadius: "6px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                                backgroundColor: "#000",
                              }}
                            >
                              <iframe
                                src={getEmbedUrl(classItem.videoUrl)}
                                title={`Aula - ${formatDateBr(
                                  new Date(
                                    new Date(classItem.date).getTime() +
                                      3.5 * 60 * 60 * 1000
                                  )
                                )}`}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  borderRadius: "6px",
                                }}
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              />
                            </div>

                            <div
                              style={{
                                padding: "8px",
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                              }}
                            >
                              <Link
                                to={classItem.videoUrl}
                                target="_blank"
                                style={{
                                  color: partnerColor(),
                                  textDecoration: "none",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <i className="fa fa-play-circle" />
                                {classItem.videoUrlName ||
                                  "Abrir Vídeo no YouTube"}
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        )}
      </section>
    </>
  );
}

export default MyClasses;
