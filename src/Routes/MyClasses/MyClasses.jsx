import axios from "axios";
import Helmets from "../../Resources/Helmets";
import React, { useEffect, useState } from "react";
import { RouteDiv, HOne, HTwo } from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  IFrameVideoClass,
  ResponsiveIframe,
  backDomain,
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
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { getEmbedUrl } from "../MyCalendar/CalendarComponents/MyCalendarFuncions";

export function MyClasses({ headers }) {
  const [loading, setLoading] = useState(false);
  const [IsAllowed, setIsAllowed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentNXTId, setStudentNXTId] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [permissions, setPermissions] = useState("");
  const [MYID, setMYID] = useState("");
  const [newID, setNewID] = useState("");

  const { UniversalTexts } = useUserContext();

  async function fetchMonthYear() {
    setLoading(true);
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn"));
    setPermissions(getLoggedUser.permissions);
    setStudentId(getLoggedUser.id);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/tutoring/${getLoggedUser.id}`,
        { headers }
      );
      setClasses(response.data.formattedTutoringFromParticularStudent);
      setLoading(false);
    } catch (error) {
      onLoggOut();
    }
  }

  async function fetchNextStudentClasses(id) {
    setLoading(true);

    setStudentNXTId(id);
    try {
      const response = await axios.get(`${backDomain}/api/v1/tutoring/${id}`, {
        headers,
      });
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
            {[1, 5, 10].map((option, index) => (
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
    <RouteDiv>
      <Helmets text="My Classes" />

      {/* Header centralizado como no SentenceMining */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <HOne
          style={{
            fontFamily: "inherit",
            color: partnerColor(),
            textAlign: "center",
            margin: "0.5rem",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {UniversalTexts.myClasses}
        </HOne>
      </div>

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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <ClassesSideBar />

            {/* Classes List */}
            {currentClasses.map((classItem) => (
              <ClassBox
                key={classItem.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "15px 20px",
                  transition: "all 0.2s ease",
                }}
                className="box-shadow-white"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Header with Date and Delete Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                    }}
                  >
                    <HTwo
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        margin: "0",
                        color: "#333",
                      }}
                    >
                      {classItem.date}
                    </HTwo>

                    {permissions === "superadmin" && (
                      <button
                        onClick={() =>
                          handleDelete(classItem.id, studentNXTId || studentId)
                        }
                        style={{
                          padding: "4px 12px",
                          fontSize: "13px",
                          borderRadius: "4px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "1px solid #dc3545",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#c82333";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#dc3545";
                        }}
                      >
                        Apagar aula
                      </button>
                    )}
                  </div>

                  {/* Links Section */}
                  {(classItem.attachments || classItem.importantLink) && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {classItem.attachments && (
                        <div
                          style={{
                            padding: "8px",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        >
                          <Link
                            to={classItem.attachments}
                            style={{
                              color: partnerColor(),
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: "500",
                              display: "flex",
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
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        >
                          <Link
                            to={classItem.importantLink}
                            target="_blank"
                            style={{
                              color: partnerColor(),
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <i className="fa fa-external-link" />
                            {classItem.importantLinkName || "Important Link"}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Section */}
                  {classItem.videoUrl && (
                    <>
                      <IFrameVideoClass
                        src={getEmbedUrl(classItem.videoUrl)}
                        title={`Aula - ${classItem.date}`}
                      />

                      <Link
                        to={classItem.videoUrl}
                        target="_blank"
                        style={{
                          color: partnerColor(),
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fa fa-external-link" />
                        {classItem.videoUrlName || "Video Link"}
                      </Link>
                    </>
                  )}
                </div>
              </ClassBox>
            ))}

            {itemsPerPage > 2 && classes.length > 2 && <ClassesSideBar />}
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
    </RouteDiv>
  );
}

export default MyClasses;
