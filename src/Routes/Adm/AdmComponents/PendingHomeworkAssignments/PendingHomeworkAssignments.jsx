import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { listOfCriteria } from "../../../Ranking/RankingComponents/ListOfCriteria";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";

export function PendingHomeworkAssignments({ id, headers }) {
  const [pendingHomeworkList, setPendingHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const { UniversalTexts } = useUserContext();
  const actualHeaders = headers || {};

  // Pontuações do ranking
  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  const fetchPendingHomework = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
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

  const updateRealizedClass = async (tutoringId, studentId, score) => {
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
      notifyAlert("Homework atualizado com sucesso!", "green");
    } catch (error) {
      notifyAlert("Erro ao atualizar homework");
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const justStatus = async (tutoringId, studentId) => {
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
      notifyAlert("Status atualizado com sucesso!", "green");
    } catch (error) {
      notifyAlert("Erro ao atualizar status");
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const deleteHomework = async (homeworkId) => {
    setDisabled(true);
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${homeworkId}`, {
        headers: actualHeaders,
      });
      notifyAlert("Homework deletado com sucesso!", "green");
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
      <Helmets text="Pending Homework" />
      <HOne>Lições Pendentes</HOne>
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
                  borderRadius: "6px",
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
                    {UniversalTexts.dueDate} {formatDateBr(homework.dueDate)}
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
                      borderRadius: "6px",
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
