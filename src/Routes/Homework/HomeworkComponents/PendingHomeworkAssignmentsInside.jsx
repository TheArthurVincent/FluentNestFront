import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";
import { listOfCriteria } from "../../Ranking/RankingComponents/ListOfCriteria";
import axios from "axios";
import { backDomain, formatDate } from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../Styles/Styles";
import { CircularProgress } from "@mui/material";
import { HOne, HTwo } from "../../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";

export function PendingHomeworkAssignments({ headers }) {
  var [pendingHomeworkList, setPendingHomeworkList] = useState([]);
  var [loading, setLoading] = useState(true);
  var [disabled, setDisabled] = useState(false);

  var { UniversalTexts } = useUserContext();
  var actualHeaders = headers || {};

  // Pontuações do ranking
  var pointsMadeHW = listOfCriteria[0].score[0].score;
  var pointsLateHW = listOfCriteria[0].score[1].score;
  var fetchPendingHomework = async () => {
    var getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    var { id, permissions } = getLoggedUser;

    setLoading(true);
    try {
      var response = await axios.get(
        `${backDomain}/api/v1/pendinghomework/${id}`,
        {
          headers: actualHeaders,
        }
      );
      setPendingHomeworkList(response.data.tutoringHomeworkList || []);
    } catch (error) {
      console.error("Erro ao buscar Lições Pendentes:", error);
      notifyAlert("Erro ao carregar Lições Pendentes");
    } finally {
      setLoading(false);
    }
  };

  var updateRealizedClass = async (tutoringId, studentId, score) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework/${studentId}`,
        {
          tutoringId,
          score,
        },
        {
          headers: actualHeaders,
        }
      );
      fetchPendingHomework();
      notifyAlert("Homework atualizado com sucesso!", partnerColor());
    } catch (error) {
      notifyAlert("Erro ao atualizar homework");
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  var justStatus = async (tutoringId, studentId) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homeworkjuststatus/${studentId}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        }
      );
      fetchPendingHomework();

      notifyAlert("Status atualizado com sucesso!", partnerColor());
    } catch (error) {
      notifyAlert("Erro ao atualizar status");
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  var deleteHomework = async (homeworkId) => {
    setDisabled(true);
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${homeworkId}`, {
        headers: actualHeaders,
      });
      notifyAlert("Homework deletado com sucesso!", partnerColor());
      fetchPendingHomework();
    } catch (error) {
      notifyAlert("Erro ao deletar homework");
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchPendingHomework();
    }, 500);
  }, []);

  if (loading) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} style={{ color: partnerColor() }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <ul
          style={{
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          {pendingHomeworkList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontSize: "18px",
              }}
            >
              Nenhum Homework Pendente encontrado
            </div>
          ) : (
            pendingHomeworkList.map((homework, index) => (
              <li
                key={index}
                className="box-shadow-white"
                style={{
                  margin: "8px 0",
                  textDecoration: "none",
                  display: "grid",
                  maxWidth: "800px",
                  gap: "16px",
                  listStyle: "none",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "2px solid #ff980020",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "12px",
                  }}
                >
                  <HTwo
                    style={{ margin: 0, color: "#333", fontWeight: "bold" }}
                  >
                    {UniversalTexts.dueDate} {formatDate(homework.dueDate)}
                  </HTwo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    <i className="fa fa-clock-o" aria-hidden="true" />
                    pending
                  </div>
                </div>

                {/* Student Info */}
                {homework.studentName && (
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "6px",
                      border: "1px solid #2196f3",
                      color: "#1976d2",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fa fa-user" style={{ marginRight: "8px" }} />
                    <strong>Aluno:</strong> {homework.studentName}
                  </div>
                )}

                {/* Action Buttons Section */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    padding: "8px 0",
                  }}
                >
                  <button
                    disabled={disabled}
                    onClick={() =>
                      updateRealizedClass(
                        homework._id,
                        homework.studentID,
                        pointsMadeHW
                      )
                    }
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa fa-check" />
                    Up to date ({pointsMadeHW} pts)
                  </button>

                  <button
                    disabled={disabled}
                    onClick={() =>
                      updateRealizedClass(
                        homework._id,
                        homework.studentID,
                        pointsLateHW
                      )
                    }
                    style={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa fa-clock-o" />
                    Late ({pointsLateHW} pts)
                  </button>
                  <button
                    disabled={disabled}
                    onClick={() => justStatus(homework._id, homework.studentID)}
                    style={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa fa-edit" />
                    Just status
                  </button>

                  <button
                    disabled={disabled}
                    onDoubleClick={() => deleteHomework(homework._id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa fa-trash" />
                    Double Click to Delete
                  </button>
                </div>

                {/* Links Section */}
                {homework.googleDriveLink && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexDirection: "column",
                      padding: "8px 0",
                    }}
                  >
                    <Link
                      to={homework.googleDriveLink}
                      style={{
                        color: partnerColor(),
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        border: `1px solid ${partnerColor()}30`,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fa fa-external-link" />
                      Access the class here
                    </Link>
                  </div>
                )}
                {homework.answers && (
                  <div
                    style={{
                      backgroundColor: "#eff0daff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "1.2rem",
                      fontFamily: "cursive",
                      lineHeight: "1.6",
                      color: "#444",
                    }}
                  >
                    <HTwo>Resposta do aluno</HTwo>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: homework.answers,
                      }}
                    />
                  </div>
                )}
                {homework.attachments && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexDirection: "column",
                      padding: "8px 0",
                    }}
                  >
                    <Link
                      to={homework.attachments}
                      style={{
                        color: "#4caf50",
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        border: "1px solid #4caf5030",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fa fa-download" />
                      Download Homework
                    </Link>
                  </div>
                )}

                {homework.description && (
                  <>
                    <HTwo>Enunciado</HTwo>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: homework.description,
                      }}
                    />
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default PendingHomeworkAssignments;
