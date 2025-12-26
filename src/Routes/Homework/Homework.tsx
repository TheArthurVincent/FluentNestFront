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

  const [isGroupClass, setIsGroupClass] = useState<boolean>(false);
  const [both, setBoth] = useState<boolean>(true);
  const [tutoringList, setTutoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // paginação (se for usar no futuro)
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [type, setType] = useState<number>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("");
  const [selectedHomeworkContent, setSelectedHomeworkContent] =
    useState<string>("");
  const [submissionMode, setSubmissionMode] = useState<"file" | "editor">(
    "file"
  );
  const [homeworkAnswer, setHomeworkAnswer] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [studentName, setStudentName] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);

  const { UniversalTexts } = useUserContext();

  const actualHeaders = headers || {};
  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  function normalizeCategory(v?: string) {
    return (v || "").toLowerCase().trim();
  }
  function isGroupCat(cat?: string) {
    const c = normalizeCategory(cat);
    return [
      "group class",
      "groupclass",
      "group-class",
      "turma",
      "grupo",
    ].includes(c);
  }

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

  const saveEditedDescription = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;
    setUploading(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/edithomeworkdescription/${targetId}`,
        {
          description: homeworkAnswer,
        },
        {
          headers: actualHeaders,
        }
      );

      notifyAlert("Homework editado com sucesso!", "green");
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      setTimeout(() => {
        fetchHW(studentId || ID);
      }, 500);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework"
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
        UniversalTexts?.pleaseSelectFile || "Por favor, selecione um arquivo"
      );
      return;
    }

    if (submissionMode === "editor" && !homeworkAnswer.trim()) {
      notifyAlert(
        UniversalTexts?.pleaseWriteAnswerBeforeSending ||
          "Por favor, escreva sua resposta antes de enviar"
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
        }
      );

      notifyAlert(
        UniversalTexts?.homeworkSubmittedSuccess ||
          "Homework enviado com sucesso!",
        "green"
      );
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      setTimeout(() => {
        fetchHW(studentId || ID);
      }, 500);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework"
      );
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
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
      setDisabled(false);
    }
  };

  const openSubmissionModal = (
    homeworkId: string,
    homeworkDescription?: string,
    preferredMode?: "file" | "editor"
  ) => {
    setSelectedHomeworkId(homeworkId);
    setSelectedHomeworkContent(homeworkDescription || "");
    setHomeworkAnswer(homeworkDescription || "");

    if (preferredMode) {
      setSubmissionMode(preferredMode);
    }

    setIsModalOpen(true);
  };

  const openEditModal = (homeworkId: string, homeworkDescription?: string) => {
    setSelectedHomeworkId(homeworkId);
    setSelectedHomeworkContent(homeworkDescription || "");
    setHomeworkAnswer(homeworkDescription || "");
    setIsEditModalOpen(true);
  };

  const closeSubmissionModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedHomeworkId("");
    setSelectedHomeworkContent("");
    setSelectedFile(null);
    setHomeworkAnswer("");
    setSubmissionMode("file");
  };

  const fetchHW = async (targetStudentId: string) => {
    setLoading(true);
    setType(1);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework/${targetStudentId}`,
        {
          headers: actualHeaders,
        }
      );
      const tt = response.data.tutoringHomeworkList || [];
      setTutoringList(tt);
      setStudentName(response.data.studentName || "");
      setBoth(true);
      setIsGroupClass(false);
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
    setBoth(true);
    setIsGroupClass(false);

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
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
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
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
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
      fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const isAllowed =
    myPermissions === "superadmin" || myPermissions === "teacher";

  // EVENTO PADRÃO PARA CRIAR NOVO HOMEWORK
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
          borderRadius: "12px",
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

            {mainEventIdForNewHomework && (
              <NewHomeworkModal
                headers={actualHeaders}
                studentID={studentId || ID}
                eventID={mainEventIdForNewHomework}
                buttonLabel="+ Novo Homework"
                onHomeworkCreated={(newHomeworks) => {
                  setTutoringList((prev) => [...newHomeworks, ...prev]);
                }}
              />
            )}
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
                  const isDone = hw.status === "done";
                  const eventId = hw?.eventDetails?.id || hw?.eventID;

                  return hw.description ? (
                    <div
                      key={hw._id}
                      style={{
                        ...cardBase,
                        padding: 14,
                        marginBottom: 10,
                      }}
                    >
                      {/* Cabeçalho do card */}
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

                          {/* NOVO BOTÃO DELETAR */}
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

                      {/* Descrição do homework */}
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

                      {/* Link para o evento */}
                      {eventId && (
                        <a
                          href={`/my-calendar/event/${eventId}?tab=homework`}
                          style={{
                            marginTop: 14,
                            display: "block",
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
                          {isDone ? "Ver Lição de Casa" : "Fazer Lição de Casa"}
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

          {/* Modais existentes (envio / edição) – mantidos exatamente como estavam */}
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
              document.body
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
                {/* Header */}
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

                {/* Modo de envio */}
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
                      <i className="fa fa-file" style={{ fontSize: "12px" }} />
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

                {/* Conteúdo do modal de envio */}
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
                      📎 {UniversalTexts?.chooseFile || "Escolha o arquivo:"}
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

                {/* Actions */}
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
                        : !homeworkAnswer.trim())
                    }
                    style={{
                      backgroundColor: "transparent",
                      color:
                        uploading ||
                        (submissionMode === "file"
                          ? !selectedFile
                          : !homeworkAnswer.trim())
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
                          : !homeworkAnswer.trim())
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
                          : !homeworkAnswer.trim())
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
                          : !homeworkAnswer.trim())
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
                        <i
                          className={`fa fa-${
                            submissionMode === "file" ? "upload" : "paper-plane"
                          }`}
                          style={{ fontSize: "11px" }}
                        />
                        {submissionMode === "file"
                          ? UniversalTexts?.send || "Enviar Arquivo"
                          : UniversalTexts?.submitResponse || "Enviar Resposta"}
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
                    disabled={uploading || !homeworkAnswer.trim()}
                    style={{
                      backgroundColor:
                        uploading || !homeworkAnswer.trim()
                          ? "#ccc"
                          : partnerColor(),
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor:
                        uploading || !homeworkAnswer.trim()
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
        </>
      </div>
    </div>
  );
}
