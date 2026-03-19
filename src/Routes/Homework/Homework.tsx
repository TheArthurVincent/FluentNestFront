import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import {
  backDomain,
  formatDateBr,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { listOfCriteria } from "../Ranking/RankingComponents/ListOfCriteria";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";
import HTMLEditor from "../../Resources/Components/HTMLEditor";

import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import {
  cardBase,
  cardTitle,
  pillStatus,
} from "../ArvinComponents/Students/TheStudent/types/studentPage.styles";
import NewHomeworkModal from "../ArvinComponents/Students/TheStudent/sections/StudentsRecurringTutorings/NewHomework/NewHomework";

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
  isDesktop: boolean;
}

export default function Homework({
  headers,
  setChange,
  change,
  isDesktop,
}: HWProps) {
  const { studentId } = useParams<{ studentId: string }>();

  const [tutoringList, setTutoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);

  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("");
  const [selectedHomeworkContent, setSelectedHomeworkContent] =
    useState<string>("");
  const [selectedHomeworkAnswer, setSelectedHomeworkAnswer] =
    useState<string>("");
  const [selectedCommentAnswer, setSelectedCommentAnswer] =
    useState<string>("");
  const [submissionMode, setSubmissionMode] = useState<"file" | "editor">(
    "file",
  );
  const [homeworkAnswer, setHomeworkAnswer] = useState<string>("");
  const [commentAnswerText, setCommentAnswerText] = useState<string>("");

  const [studentName, setStudentName] = useState<string>("");

  const { UniversalTexts } = useUserContext();

  const handleDeleteFile = async (targetId: string) => {
    try {
      await axios.delete(
        `${backDomain}/api/v1/delete-homework-attachment/${targetId}`,
        {
          headers: actualHeaders,
        },
      );

      notifyAlert("Arquivo excluído com sucesso!", "green");
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const actualHeaders = headers || {};
  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  const stripHtml = (html: string) =>
    (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleHomeworkAnswerChange = (content: string) => {
    setHomeworkAnswer(content);
  };

  const openSubmissionModal = (hw: any) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkContent(hw.answers || "");
    setHomeworkAnswer(hw.answers || "");
    setSubmissionMode(hw.answers ? "editor" : "file");
    setIsModalOpen(true);
  };

  const openEditHomeworkModal = (hw: any) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkContent(hw.description || "");
    setHomeworkAnswer(hw.description || "");
    setIsEditModalOpen(true);
  };

  const openCommentModal = (hw: any) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkAnswer(hw.answers || "");
    setSelectedCommentAnswer(hw.commentAnswer || "");
    setCommentAnswerText(hw.commentAnswer || "");
    setIsCommentModalOpen(true);
  };

  const saveEditedDescription = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;

    if (!stripHtml(homeworkAnswer)) {
      notifyAlert("Digite a descrição antes de salvar.");
      return;
    }

    setUploading(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/edithomeworkdescription/${targetId}`,
        {
          description: homeworkAnswer,
        },
        {
          headers: actualHeaders,
        },
      );

      notifyAlert("Homework editado com sucesso!", "green");
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const submitHomework = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;

    if (submissionMode === "file" && !selectedFile) {
      notifyAlert(
        UniversalTexts?.pleaseSelectFile || "Por favor, selecione um arquivo",
      );
      return;
    }

    if (submissionMode === "editor" && !stripHtml(homeworkAnswer)) {
      notifyAlert(
        UniversalTexts?.pleaseWriteAnswerBeforeSending ||
          "Por favor, escreva sua resposta antes de enviar",
      );
      return;
    }

    setUploading(true);
    try {
      let requestData: any = {};

      if (submissionMode === "file") {
        const base64File = await convertToBase64(selectedFile!);
        requestData = {
          base64String: base64File,
          fileName: selectedFile!.name,
          fileType: selectedFile!.type,
          submissionMode,
        };
      } else {
        requestData = {
          htmlFromFront: homeworkAnswer,
          submissionMode,
        };
      }

      await axios.post(
        `${backDomain}/api/v1/submithomework/${targetId}`,
        requestData,
        {
          headers: actualHeaders,
        },
      );

      notifyAlert(
        UniversalTexts?.homeworkSubmittedSuccess ||
          "Homework enviado com sucesso!",
        "green",
      );
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveCommentAnswer = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;

    if (!stripHtml(commentAnswerText)) {
      notifyAlert("Digite um comentário antes de salvar.");
      return;
    }

    setUploading(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/editcommentanswer/${targetId}`,
        {
          commentAnswer: commentAnswerText,
        },
        {
          headers: actualHeaders,
        },
      );

      notifyAlert("Comentário salvo com sucesso!", "green");
      setCommentAnswerText("");
      setSelectedCommentAnswer("");
      setSelectedHomeworkAnswer("");
      setSelectedHomeworkId("");
      setIsCommentModalOpen(false);
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert("Erro ao salvar comentário");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleReturnToPending = async (tutoringId: string) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework-return-pending/${studentId}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        },
      );
      setChange(!change);
      await fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
      setDisabled(false);
    }
  };

  const closeSubmissionModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsCommentModalOpen(false);
    setSelectedHomeworkId("");
    setSelectedHomeworkContent("");
    setSelectedHomeworkAnswer("");
    setSelectedCommentAnswer("");
    setCommentAnswerText("");
    setSelectedFile(null);
    setHomeworkAnswer("");
    setSubmissionMode("file");
  };

  const fetchHW = async (targetStudentId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework/${targetStudentId}`,
        {
          headers: actualHeaders,
        },
      );
      const tt = response.data.tutoringHomeworkList || [];
      setTutoringList(tt);
      setStudentName(response.data.studentName || "");
      setLoading(false);
    } catch (error) {
      console.log(error, "erro ao listar homework");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;
    setID(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, []);

  useEffect(() => {
    if (studentId || ID) {
      fetchHW(studentId || ID);
    }
  }, [ID, studentId]);

  const updateRealizedClass = async (tutoringId: string, score: number) => {
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
        },
      );
      setChange(!change);
      await fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
      setDisabled(false);
    }
  };

  const justStatus = async (tutoringId: string) => {
    try {
      await axios.put(
        `${backDomain}/api/v1/homeworkjuststatus/${studentId}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        },
      );
      setChange(!change);
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [homeworkToDelete, setHomeworkToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openDeleteModal = (homeworkId: string) => {
    setHomeworkToDelete(homeworkId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setHomeworkToDelete("");
    setIsDeleteModalOpen(false);
  };

  const deleteHomework = async (id: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      notifyAlert("Homework deletado com sucesso.", "green");
      await fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const isAllowed =
    myPermissions === "superadmin" || myPermissions === "teacher";

  const mainEventIdForNewHomework =
    tutoringList[0]?.eventDetails?.id || tutoringList[0]?.eventID || "";

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
            <span style={newArvinTitleStyle}>
              Lições de Casa de {studentName}
            </span>
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
          borderRadius: "8px",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        {isAllowed && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <a
              href={`/students/${studentId}`}
              style={{
                fontWeight: 700,
                textAlign: "right",
                color: partnerColor(),
                textDecoration: "none",
                fontSize: 12,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Ver aluno
              <i
                style={{
                  marginLeft: 4,
                }}
                className="fa fa-chevron-right"
              />
            </a>

            <NewHomeworkModal
              headers={actualHeaders}
              studentID={studentId || ID}
              eventID={""}
              buttonLabel="+ Novo Homework"
              onHomeworkCreated={(newHomeworks) => {
                setTutoringList((prev) => [...newHomeworks, ...prev]);
              }}
            />
          </div>
        )}

        <Helmets text={`Lições da Casa de ${studentName}`} />

        <>
          {loading ? (
            <CircularProgress
              style={{
                color: partnerColor(),
              }}
            />
          ) : (
            <div style={{ marginTop: 16 }}>
              {tutoringList.length === 0 ? (
                <p
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 400,
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  Nenhum homework encontrado.
                </p>
              ) : (
                tutoringList.map((hw: any) => {
                  console.log(hw, "hw 1");
                  const isDone = hw.status === "done";
                  const eventId = hw?.eventDetails?.id || hw?.eventID;
                  const hasAnswer =
                    !!(hw.answers || "").trim() || hw.attachments?.length > 0;
                  const hasCommentAnswer = !!(hw.commentAnswer || "").trim();

                  return hw.description ? (
                    <div
                      key={hw._id}
                      style={{
                        ...cardBase,
                        padding: 14,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              ...cardTitle,
                              marginBottom: 2,
                              fontSize: 13,
                            }}
                          >
                            {hw.dueDate && (
                              <span style={cardTitle}>
                                Entrega em: {formatDateBr(hw.dueDate)}
                              </span>
                            )}
                          </span>
                          {hw.assignmentDate && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#6B7280",
                                fontWeight: 500,
                              }}
                            >
                              Atribuído em: {formatDateBr(hw.assignmentDate)}
                            </span>
                          )}
                        </div>

                        <span
                          style={{
                            ...pillStatus,
                            backgroundColor: isDone ? "#e6f4ea" : "#fff7e6",
                            color: isDone ? "#137333" : "#92400e",
                          }}
                        >
                          {isDone ? "Concluído" : "Pendente"}
                        </span>
                      </div>

                      {isAllowed && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 4,
                            marginBottom: 10,
                          }}
                        >
                          {isDone ? (
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleReturnToPending(hw._id)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#F9FAFB",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: disabled ? "not-allowed" : "pointer",
                              }}
                            >
                              Marcar como pendente
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() =>
                                updateRealizedClass(hw._id, pointsMadeHW)
                              }
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#F9FAFB",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: disabled ? "not-allowed" : "pointer",
                              }}
                            >
                              Marcar como feito
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => justStatus(hw._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #E5E7EB",
                              backgroundColor: "#FFF",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Só mudar status
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(hw._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #FCA5A5",
                              backgroundColor: "#FEF2F2",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              color: "#B91C1C",
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}

                      <div
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#111827",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            color: "#333",
                            lineHeight: "1.4",
                          }}
                          dangerouslySetInnerHTML={{ __html: hw.description }}
                        />
                      </div>

                      {hasAnswer && (
                        <div
                          style={{
                            padding: 12,
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            background: "#fafafa",
                            color: "#334155",
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginBottom: 6,
                            }}
                          >
                            Resposta do aluno
                          </div>
                          {hw.attachments && (
                            <>
                              {!isAllowed && (
                                <button
                                  style={{
                                    marginRight: 8,
                                    color: "#ef4444",
                                    padding: "0",
                                    border: "none",
                                    fontWeight: "bold",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                  }}
                                  title="Excluir arquivo"
                                  onClick={() => handleDeleteFile(hw._id)}
                                >
                                  Excluir arquivo
                                </button>
                              )}
                              <a
                                href={hw.attachments}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Baixar Arquivo
                              </a>
                            </>
                          )}

                          {hw.answers && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: hw.answers || "",
                              }}
                            />
                          )}
                        </div>
                      )}

                      {hasCommentAnswer && (
                        <div
                          style={{
                            padding: 12,
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 12,
                              marginBottom: 6,
                            }}
                          >
                            Comentário do professor
                          </div>
                          <div
                            style={{
                              fontStyle: "italic",
                              fontSize: 12,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: hw.commentAnswer || "",
                            }}
                          />
                        </div>
                      )}

                      {!isAllowed && !hasCommentAnswer && !hw.attachments && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openSubmissionModal(hw)}
                            disabled={!hw.description || hasCommentAnswer}
                            title={
                              !hw.description
                                ? "Lição de casa ainda não disponível"
                                : hasCommentAnswer
                                  ? "Não é possível editar após o comentário do professor"
                                  : "Responder homework"
                            }
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #E5E7EB",
                              backgroundColor: "#FFF",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor:
                                !hw.description || hasCommentAnswer
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                !hw.description || hasCommentAnswer ? 0.6 : 1,
                            }}
                          >
                            {hasAnswer ? "Editar resposta" : "Responder"}
                          </button>
                        </div>
                      )}
                      {isAllowed && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 4,
                            marginBottom: 10,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openEditHomeworkModal(hw)}
                            disabled={hasAnswer}
                            title={
                              hasAnswer
                                ? "Não é possível editar após a resposta"
                                : "Editar descrição da lição de casa"
                            }
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #E5E7EB",
                              backgroundColor: "#F9FAFB",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: hasAnswer ? "not-allowed" : "pointer",
                              opacity: hasAnswer ? 0.6 : 1,
                            }}
                          >
                            Editar homework
                          </button>

                          {hasAnswer && (
                            <button
                              type="button"
                              onClick={() => openCommentModal(hw)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#FFF",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              {hasCommentAnswer
                                ? "Editar comentário"
                                : "Comentar resposta"}
                            </button>
                          )}
                        </div>
                      )}

                      {eventId && (
                        <a
                          href={`/my-calendar/event/${eventId}`}
                          style={{
                            marginTop: 14,
                            marginLeft: "auto",
                            display: "block",
                            maxWidth: "fit-content",
                            fontWeight: 700,
                            textAlign: "right",
                            color: partnerColor(),
                            textDecoration: "none",
                            fontSize: 12,
                            textTransform: "uppercase",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          Acessar Aula
                          <i
                            style={{
                              marginLeft: 8,
                            }}
                            className="fa fa-chevron-right"
                          />
                        </a>
                      )}
                    </div>
                  ) : null;
                })
              )}
            </div>
          )}

          {isDeleteModalOpen &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10000,
                  padding: "0 8px",
                }}
                onClick={closeDeleteModal}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    maxWidth: 400,
                    width: "100%",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Confirmar exclusão
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      marginBottom: 20,
                      fontSize: 14,
                      color: "#4B5563",
                    }}
                  >
                    Tem certeza de que deseja excluir este homework? Esta ação
                    não pode ser desfeita.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={closeDeleteModal}
                      style={{
                        backgroundColor: "transparent",
                        color: "#374151",
                        border: "1px solid #D1D5DB",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={() => deleteHomework(homeworkToDelete)}
                      disabled={isDeleting}
                      style={{
                        backgroundColor: isDeleting ? "#FCA5A5" : "#DC2626",
                        color: "#FFF",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 13,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                      }}
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )}

          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
                zIndex: 1000,
                padding: window.innerWidth <= 768 ? "20px 8px" : "0",
              }}
              onClick={closeSubmissionModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  padding: window.innerWidth <= 768 ? "16px" : "24px",
                  maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
                  width: window.innerWidth <= 768 ? "100%" : "90%",
                  maxHeight:
                    window.innerWidth <= 768 ? "calc(100vh - 40px)" : "90vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  marginTop: window.innerWidth <= 768 ? "20px" : "0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems:
                      window.innerWidth <= 768 ? "flex-start" : "center",
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "16px",
                    gap: window.innerWidth <= 768 ? "12px" : "0",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    {UniversalTexts?.submitHomework || "Enviar Homework"}
                  </h2>
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: window.innerWidth <= 768 ? "28px" : "24px",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "0",
                      width: window.innerWidth <= 768 ? "36px" : "30px",
                      height: window.innerWidth <= 768 ? "36px" : "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      transition: "background-color 0.2s",
                      alignSelf: window.innerWidth <= 768 ? "flex-end" : "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    🎯{" "}
                    {UniversalTexts?.howDoYouWantToRespond ||
                      "Como você quer responder?"}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        window.innerWidth <= 768 ? "column" : "row",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <button
                      onClick={() => setSubmissionMode("file")}
                      style={{
                        flex: 1,
                        padding:
                          window.innerWidth <= 768 ? "12px 16px" : "8px 12px",
                        border: `1px solid ${
                          submissionMode === "file" ? "#adb5bd" : "#dee2e6"
                        }`,
                        borderRadius: 6,
                        minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                        backgroundColor:
                          submissionMode === "file" ? "#e9ecef" : "#f8f9fa",
                        color:
                          submissionMode === "file" ? "#495057" : "#6c757d",
                        fontSize: "13px",
                        fontWeight: "400",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      {UniversalTexts?.submitFile || "Enviar Arquivo"}
                    </button>
                    <button
                      onClick={() => setSubmissionMode("editor")}
                      style={{
                        flex: 1,
                        padding:
                          window.innerWidth <= 768 ? "12px 16px" : "8px 12px",
                        border: `1px solid ${
                          submissionMode === "editor" ? "#adb5bd" : "#dee2e6"
                        }`,
                        borderRadius: 6,
                        minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                        backgroundColor:
                          submissionMode === "editor" ? "#e9ecef" : "#f8f9fa",
                        color:
                          submissionMode === "editor" ? "#495057" : "#6c757d",
                        fontSize: window.innerWidth <= 768 ? "14px" : "13px",
                        fontWeight: "400",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <i
                        className="fa fa-edit"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "14px" : "12px",
                        }}
                      />
                      {UniversalTexts?.writeResponse ||
                        "Responder na Plataforma"}
                    </button>
                  </div>
                </div>

                {submissionMode === "file" ? (
                  <div
                    style={{
                      marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: window.innerWidth <= 768 ? "16px" : "14px",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      {" "}
                      <i
                        className={`fa fa-${
                          submissionMode === "file" ? "upload" : "paper-plane"
                        }`}
                        style={{ fontSize: "11px", marginRight: "6px" }}
                      />
                      {UniversalTexts?.chooseFile || "Escolha o arquivo:"}
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      style={{
                        width: "100%",
                        padding: window.innerWidth <= 768 ? "16px" : "12px",
                        border: "2px dashed #e2e8f0",
                        borderRadius: 6,
                        backgroundColor: "#f8fafc",
                        cursor: "pointer",
                        fontSize: window.innerWidth <= 768 ? "16px" : "14px",
                        color: "#64748b",
                        transition: "border-color 0.2s",
                        minHeight: window.innerWidth <= 768 ? "60px" : "auto",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = partnerColor();
                        e.target.style.backgroundColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.backgroundColor = "#f8fafc";
                      }}
                    />
                    {selectedFile && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #0ea5e9",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i
                          className="fa fa-file"
                          style={{ color: "#0ea5e9", fontSize: "16px" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#075985",
                            fontWeight: "500",
                          }}
                        >
                          {selectedFile.name}
                        </span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "4px",
                          }}
                        >
                          <i className="fa fa-times" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      ✍️{" "}
                      {UniversalTexts?.respondDirectlyHere ||
                        "Responda diretamente aqui:"}
                    </label>
                    <div
                      style={{
                        border: "2px solid #e2e8f0",
                        borderRadius: 6,
                        backgroundColor: "#ffffff",
                        minHeight: "300px",
                      }}
                    >
                      <HTMLEditor
                        onChange={handleHomeworkAnswerChange}
                        initialContent={selectedHomeworkContent}
                      />
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      window.innerWidth <= 768 ? "column-reverse" : "row",
                    gap: "12px",
                    justifyContent:
                      window.innerWidth <= 768 ? "stretch" : "flex-end",
                  }}
                >
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      backgroundColor: "transparent",
                      color: "#666",
                      border: "1px solid #ddd",
                      padding:
                        window.innerWidth <= 768 ? "12px 16px" : "6px 12px",
                      borderRadius: 6,
                      fontSize: window.innerWidth <= 768 ? "16px" : "12px",
                      fontWeight: "normal",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      e.currentTarget.style.borderColor = "#bbb";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#ddd";
                    }}
                  >
                    {UniversalTexts?.cancel || "Cancelar"}
                  </button>
                  <button
                    onClick={() => submitHomework()}
                    disabled={
                      uploading ||
                      (submissionMode === "file"
                        ? !selectedFile
                        : !stripHtml(homeworkAnswer))
                    }
                    style={{
                      backgroundColor: "transparent",
                      color:
                        uploading ||
                        (submissionMode === "file"
                          ? !selectedFile
                          : !stripHtml(homeworkAnswer))
                          ? "#999"
                          : "#666",
                      border: "1px solid #ddd",
                      padding:
                        window.innerWidth <= 768 ? "12px 16px" : "6px 12px",
                      borderRadius: 6,
                      fontSize: window.innerWidth <= 768 ? "16px" : "12px",
                      fontWeight: "normal",
                      cursor:
                        uploading ||
                        (submissionMode === "file"
                          ? !selectedFile
                          : !stripHtml(homeworkAnswer))
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: window.innerWidth <= 768 ? "6px" : "4px",
                      transition: "all 0.2s ease",
                      minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      if (
                        !uploading &&
                        !(submissionMode === "file"
                          ? !selectedFile
                          : !stripHtml(homeworkAnswer))
                      ) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                        e.currentTarget.style.borderColor = "#bbb";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (
                        !uploading &&
                        !(submissionMode === "file"
                          ? !selectedFile
                          : !stripHtml(homeworkAnswer))
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "#ddd";
                      }
                    }}
                  >
                    {uploading ? (
                      <>
                        <CircularProgress size={12} style={{ color: "#999" }} />
                        {UniversalTexts?.sending || "Enviando..."}
                      </>
                    ) : (
                      <>
                        {submissionMode === "file"
                          ? "Enviar Arquivo"
                          : "Enviar Resposta"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEditModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
                zIndex: 1000,
                padding: window.innerWidth <= 768 ? "20px 8px" : "0",
              }}
              onClick={closeSubmissionModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  padding: window.innerWidth <= 768 ? "16px" : "24px",
                  maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
                  width: window.innerWidth <= 768 ? "100%" : "90%",
                  maxHeight:
                    window.innerWidth <= 768 ? "calc(100vh - 40px)" : "90vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  marginTop: window.innerWidth <= 768 ? "20px" : "0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems:
                      window.innerWidth <= 768 ? "flex-start" : "center",
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "16px",
                    gap: window.innerWidth <= 768 ? "12px" : "0",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    Editar Homework
                  </h2>
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: window.innerWidth <= 768 ? "28px" : "24px",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "0",
                      width: window.innerWidth <= 768 ? "36px" : "30px",
                      height: window.innerWidth <= 768 ? "36px" : "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      transition: "background-color 0.2s",
                      alignSelf: window.innerWidth <= 768 ? "flex-end" : "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: 6,
                    backgroundColor: "#ffffff",
                    minHeight: "300px",
                    marginBottom: 16,
                  }}
                >
                  <HTMLEditor
                    onChange={handleHomeworkAnswerChange}
                    initialContent={selectedHomeworkContent}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      backgroundColor: "transparent",
                      color: "#666",
                      border: "1px solid #ddd",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => saveEditedDescription()}
                    disabled={uploading || !stripHtml(homeworkAnswer)}
                    style={{
                      backgroundColor:
                        uploading || !stripHtml(homeworkAnswer)
                          ? "#ccc"
                          : partnerColor(),
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor:
                        uploading || !stripHtml(homeworkAnswer)
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {uploading ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCommentModalOpen &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems:
                    window.innerWidth <= 768 ? "flex-start" : "center",
                  zIndex: 1000,
                  padding: window.innerWidth <= 768 ? "20px 8px" : "0",
                }}
                onClick={closeSubmissionModal}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: 6,
                    padding: window.innerWidth <= 768 ? "16px" : "24px",
                    maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
                    width: window.innerWidth <= 768 ? "100%" : "90%",
                    maxHeight:
                      window.innerWidth <= 768 ? "calc(100vh - 40px)" : "90vh",
                    overflowY: "auto",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    marginTop: window.innerWidth <= 768 ? "20px" : "0",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "16px",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#495057",
                      }}
                    >
                      {selectedCommentAnswer
                        ? "Editar comentário"
                        : "Comentar resposta"}
                    </h2>

                    <button
                      onClick={closeSubmissionModal}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 24,
                        cursor: "pointer",
                        color: "#6b7280",
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {selectedHomeworkAnswer && (
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                        }}
                      >
                        Resposta do aluno
                      </label>

                      <div
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          backgroundColor: "#f8fafc",
                          padding: 12,
                          fontSize: 13,
                          color: "#334155",
                          marginBottom: 16,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedHomeworkAnswer || "",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      borderRadius: 6,
                      backgroundColor: "#ffffff",
                      minHeight: "300px",
                      marginBottom: 16,
                    }}
                  >
                    <textarea
                      value={commentAnswerText}
                      onChange={(e) => setCommentAnswerText(e.target.value)}
                      placeholder="Comente a resposta"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={closeSubmissionModal}
                      style={{
                        backgroundColor: "transparent",
                        color: "#666",
                        border: "1px solid #ddd",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={() => saveCommentAnswer()}
                      disabled={uploading || !stripHtml(commentAnswerText)}
                      style={{
                        backgroundColor:
                          uploading || !stripHtml(commentAnswerText)
                            ? "#ccc"
                            : partnerColor(),
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor:
                          uploading || !stripHtml(commentAnswerText)
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {uploading ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </>
      </div>
    </div>
  );
}
