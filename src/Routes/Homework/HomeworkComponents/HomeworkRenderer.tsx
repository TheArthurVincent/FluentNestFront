import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { listOfCriteria } from "../../Ranking/RankingComponents/ListOfCriteria";
import {
  backDomain,
  formatDateBr,
} from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../Styles/Styles";
import {
  cardBase,
  cardTitle,
  pillStatus,
} from "../../ArvinComponents/Students/TheStudent/types/studentPage.styles";
import HTMLEditor from "../../../Resources/Components/HTMLEditor";

type HomeworkItem = any;

interface HomeworkRendererProps {
  headers: MyHeadersType | null;
  homeworks: HomeworkItem[];
  isDesktop: boolean;
  isAllowed: boolean;
  studentId?: string;
  loggedId?: string;
  disabled?: boolean;
  hasNextPage?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  UniversalTexts?: any;
  onReload: () => Promise<void> | void;
  onLoadMore?: () => void;
  onChangeStatus?: () => void;
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  showStudentName?: boolean;
  mode?: "student" | "all";
}

export default function HomeworkRenderer({
  headers,
  homeworks,
  isDesktop,
  isAllowed,
  studentId,
  loggedId,
  disabled = false,
  hasNextPage = false,
  loading = false,
  loadingMore = false,
  UniversalTexts,
  onReload,
  onLoadMore,
  onChangeStatus,
  setDisabled,
  showStudentName = false,
  mode = "student",
}: HomeworkRendererProps) {
  const actualHeaders = headers || {};
  const effectiveId = studentId || loggedId || "";

  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
  const [homeworkToDelete, setHomeworkToDelete] = useState<string>("");

  const observerRef = useRef<IntersectionObserver | null>(null);

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

  const openSubmissionModal = (hw: HomeworkItem) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkContent(hw.answers || "");
    setHomeworkAnswer(hw.answers || "");
    setSubmissionMode(hw.answers ? "editor" : "file");
    setIsModalOpen(true);
  };

  const openEditHomeworkModal = (hw: HomeworkItem) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkContent(hw.description || "");
    setHomeworkAnswer(hw.description || "");
    setIsEditModalOpen(true);
  };

  const openCommentModal = (hw: HomeworkItem) => {
    setSelectedHomeworkId(hw._id);
    setSelectedHomeworkAnswer(hw.answers || "");
    setSelectedCommentAnswer(hw.commentAnswer || "");
    setCommentAnswerText(hw.commentAnswer || "");
    setIsCommentModalOpen(true);
  };

  const openDeleteModal = (homeworkId: string) => {
    setHomeworkToDelete(homeworkId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setHomeworkToDelete("");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteFile = async (targetId: string) => {
    try {
      setUploading(true);

      await axios.delete(
        `${backDomain}/api/v1/delete-homework-attachment/${targetId}`,
        { headers: actualHeaders },
      );

      notifyAlert("Arquivo excluído com sucesso!", "green");
      closeSubmissionModal();
      await onReload();
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveEditedDescription = async () => {
    if (!stripHtml(homeworkAnswer)) {
      notifyAlert("Digite a descrição antes de salvar.");
      return;
    }

    setUploading(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/edithomeworkdescription/${selectedHomeworkId}`,
        { description: homeworkAnswer },
        { headers: actualHeaders },
      );

      notifyAlert("Homework editado com sucesso!", "green");
      closeSubmissionModal();
      await onReload();
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const submitHomework = async () => {
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
        const base64File = await convertToBase64(selectedFile as File);
        requestData = {
          base64String: base64File,
          fileName: selectedFile?.name,
          fileType: selectedFile?.type,
          submissionMode,
        };
      } else {
        requestData = {
          htmlFromFront: homeworkAnswer,
          submissionMode,
        };
      }

      await axios.post(
        `${backDomain}/api/v1/submithomework/${selectedHomeworkId}`,
        requestData,
        { headers: actualHeaders },
      );

      notifyAlert(
        UniversalTexts?.homeworkSubmittedSuccess ||
          "Homework enviado com sucesso!",
        "green",
      );

      closeSubmissionModal();
      await onReload();
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework",
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveCommentAnswer = async () => {
    if (!stripHtml(commentAnswerText)) {
      notifyAlert("Digite um comentário antes de salvar.");
      return;
    }

    setUploading(true);

    try {
      await axios.put(
        `${backDomain}/api/v1/editcommentanswer/${selectedHomeworkId}`,
        { commentAnswer: commentAnswerText },
        { headers: actualHeaders },
      );

      notifyAlert("Comentário salvo com sucesso!", "green");
      closeSubmissionModal();
      await onReload();
    } catch (error) {
      notifyAlert("Erro ao salvar comentário");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleReturnToPending = async (tutoringId: string) => {
    if (!effectiveId) return;

    setDisabled?.(true);

    try {
      await axios.put(
        `${backDomain}/api/v1/homework-return-pending/${effectiveId}`,
        { tutoringId },
        { headers: actualHeaders },
      );

      onChangeStatus?.();
      await onReload();
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
    } finally {
      setDisabled?.(false);
    }
  };

  const updateRealizedClass = async (tutoringId: string, score: number) => {
    if (!effectiveId) return;

    setDisabled?.(true);

    try {
      await axios.put(
        `${backDomain}/api/v1/homework/${effectiveId}`,
        { tutoringId, score },
        { headers: actualHeaders },
      );

      onChangeStatus?.();
      await onReload();
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setDisabled?.(false);
    }
  };

  const justStatus = async (tutoringId: string) => {
    if (!effectiveId) return;

    setDisabled?.(true);

    try {
      await axios.put(
        `${backDomain}/api/v1/homeworkjuststatus/${effectiveId}`,
        { tutoringId },
        { headers: actualHeaders },
      );

      onChangeStatus?.();
      await onReload();
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
    } finally {
      setDisabled?.(false);
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      setIsDeleting(true);
      setDisabled?.(true);

      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });

      notifyAlert("Homework deletado com sucesso.", "green");
      onChangeStatus?.();
      await onReload();
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setIsDeleting(false);
      setDisabled?.(false);
      closeDeleteModal();
    }
  };

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore || !onLoadMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasNextPage, onLoadMore],
  );

  const baseModalStyle = {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: isDesktop ? "center" : "flex-start",
    zIndex: 10000,
    padding: isDesktop ? "0" : "20px 8px",
  };

  const modalBoxStyle = {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: isDesktop ? "24px" : "16px",
    maxWidth: isDesktop ? "500px" : "100%",
    width: isDesktop ? "90%" : "100%",
    maxHeight: isDesktop ? "90vh" : "calc(100vh - 40px)",
    overflowY: "auto" as const,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    marginTop: isDesktop ? "0" : "20px",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
        <CircularProgress style={{ color: partnerColor() }} />
      </div>
    );
  }

  if (homeworks.length === 0) {
    return (
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
    );
  }

  return (
    <>
      {homeworks.map((hw, index) => {
        const isDone = hw.status === "done";
        const eventId = hw?.eventDetails?.id || hw?.eventID;
        const hasAnswer = !!(hw.answers || "").trim() || !!hw.attachments;
        const hasCommentAnswer = !!(hw.commentAnswer || "").trim();
        const isLastItem = index === homeworks.length - 1;

        if (!hw.description) return null;

        return (
          <div
            key={hw._id}
            ref={isLastItem ? lastItemRef : null}
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    ...cardTitle,
                    marginBottom: 2,
                    fontSize: 13,
                  }}
                >
                  {showStudentName && hw.studentName ? (
                    <span style={cardTitle}>{hw.studentName}</span>
                  ) : null}

                  {hw.dueDate ? (
                    <span
                      style={
                        showStudentName && hw.studentName
                          ? { marginLeft: 8 }
                          : cardTitle
                      }
                    >
                      Entrega em: {formatDateBr(hw.dueDate)}
                    </span>
                  ) : null}
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
                    style={buttonStyle}
                  >
                    Marcar como pendente
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      updateRealizedClass(
                        hw._id,
                        hw.submittedAt ? pointsLateHW : pointsMadeHW,
                      )
                    }
                    style={buttonStyle}
                  >
                    Marcar como feito
                  </button>
                )}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => justStatus(hw._id)}
                  style={buttonStyle}
                >
                  Só mudar status
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => openDeleteModal(hw._id)}
                  style={{
                    ...buttonStyle,
                    border: "1px solid #FCA5A5",
                    backgroundColor: "#FEF2F2",
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
                style={{ color: "#333", lineHeight: "1.4" }}
                dangerouslySetInnerHTML={{ __html: hw.description }}
              />
            </div>

            {(mode === "all" || mode == "student") && hasAnswer && (
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
                          padding: 0,
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

            {(mode === "all" || mode == "student") && hasCommentAnswer && (
              <div
                style={{
                  padding: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  Comentário do professor
                </div>

                <div
                  style={{ fontStyle: "italic", fontSize: 12 }}
                  dangerouslySetInnerHTML={{
                    __html: hw.commentAnswer || "",
                  }}
                />
              </div>
            )}

            {(mode === "all" || mode == "student") &&
              !isAllowed &&
              !hasCommentAnswer &&
              !hw.attachments && (
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
                    style={{
                      ...buttonStyle,
                      cursor:
                        !hw.description || hasCommentAnswer
                          ? "not-allowed"
                          : "pointer",
                      opacity: !hw.description || hasCommentAnswer ? 0.6 : 1,
                    }}
                  >
                    {hasAnswer ? "Editar resposta" : "Responder"}
                  </button>
                </div>
              )}

            {(mode === "all" || mode == "student") && isAllowed && (
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
                  style={{
                    ...buttonStyle,
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
                    style={buttonStyle}
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
                }}
              >
                {mode === "all" || mode == "student"
                  ? "Acessar"
                  : "Acessar Aula"}
                <i style={{ marginLeft: 8 }} className="fa fa-chevron-right" />
              </a>
            )}
          </div>
        );
      })}

      {loadingMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <CircularProgress size={24} style={{ color: partnerColor() }} />
        </div>
      )}

      {!hasNextPage && homeworks.length > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#6B7280",
            marginTop: 12,
          }}
        >
          Todos os homeworks foram carregados.
        </p>
      )}

      {isDeleteModalOpen &&
        createPortal(
          <div style={baseModalStyle} onClick={closeDeleteModal}>
            <div
              style={{
                ...modalBoxStyle,
                maxWidth: 400,
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
                Tem certeza de que deseja excluir este homework? Esta ação não
                pode ser desfeita.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button onClick={closeDeleteModal} style={secondaryBtn}>
                  Cancelar
                </button>

                <button
                  onClick={() => deleteHomework(homeworkToDelete)}
                  disabled={isDeleting}
                  style={{
                    ...dangerBtn,
                    opacity: isDeleting ? 0.7 : 1,
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

      {(mode === "all" || mode == "student") &&
        isModalOpen &&
        createPortal(
          <div style={baseModalStyle} onClick={closeSubmissionModal}>
            <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
              <div style={modalHeaderStyle(isDesktop)}>
                <h2 style={modalTitleStyle(isDesktop)}>
                  {UniversalTexts?.submitHomework || "Enviar Homework"}
                </h2>

                <button onClick={closeSubmissionModal} style={closeBtnStyle}>
                  ×
                </button>
              </div>

              <div style={{ marginBottom: isDesktop ? 20 : 16 }}>
                <label style={sectionLabelStyle(isDesktop)}>
                  {UniversalTexts?.howDoYouWantToRespond ||
                    "Como você quer responder?"}
                </label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <button
                    onClick={() => setSubmissionMode("file")}
                    style={toggleButtonStyle(
                      submissionMode === "file",
                      isDesktop,
                    )}
                  >
                    {UniversalTexts?.submitFile || "Enviar Arquivo"}
                  </button>

                  <button
                    onClick={() => setSubmissionMode("editor")}
                    style={toggleButtonStyle(
                      submissionMode === "editor",
                      isDesktop,
                    )}
                  >
                    {UniversalTexts?.writeResponse || "Responder na Plataforma"}
                  </button>
                </div>
              </div>

              {submissionMode === "file" ? (
                <div style={{ marginBottom: isDesktop ? 20 : 16 }}>
                  <label style={inputLabelStyle(isDesktop)}>
                    {UniversalTexts?.chooseFile || "Escolha o arquivo:"}
                  </label>

                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    style={fileInputStyle(isDesktop)}
                  />

                  {selectedFile && (
                    <div style={selectedFileBoxStyle}>
                      <span style={{ fontSize: 14, color: "#075985" }}>
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
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 20 }}>
                  <label style={inputLabelStyle(isDesktop)}>
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
                  flexDirection: isDesktop ? "row" : "column-reverse",
                  gap: 12,
                  justifyContent: isDesktop ? "flex-end" : "stretch",
                }}
              >
                <button onClick={closeSubmissionModal} style={secondaryBtn}>
                  {UniversalTexts?.cancel || "Cancelar"}
                </button>

                <button
                  onClick={submitHomework}
                  disabled={
                    uploading ||
                    (submissionMode === "file"
                      ? !selectedFile
                      : !stripHtml(homeworkAnswer))
                  }
                  style={{
                    ...primaryBtn,
                    opacity:
                      uploading ||
                      (submissionMode === "file"
                        ? !selectedFile
                        : !stripHtml(homeworkAnswer))
                        ? 0.6
                        : 1,
                    cursor:
                      uploading ||
                      (submissionMode === "file"
                        ? !selectedFile
                        : !stripHtml(homeworkAnswer))
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {uploading
                    ? UniversalTexts?.sending || "Enviando..."
                    : submissionMode === "file"
                      ? "Enviar Arquivo"
                      : "Enviar Resposta"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {(mode === "all" || mode == "student") &&
        isEditModalOpen &&
        createPortal(
          <div style={baseModalStyle} onClick={closeSubmissionModal}>
            <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
              <div style={modalHeaderStyle(isDesktop)}>
                <h2 style={modalTitleStyle(isDesktop)}>Editar Homework</h2>
                <button onClick={closeSubmissionModal} style={closeBtnStyle}>
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
                <button onClick={closeSubmissionModal} style={secondaryBtn}>
                  Cancelar
                </button>

                <button
                  onClick={saveEditedDescription}
                  disabled={uploading || !stripHtml(homeworkAnswer)}
                  style={{
                    ...primaryBtn,
                    opacity: uploading || !stripHtml(homeworkAnswer) ? 0.6 : 1,
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
          </div>,
          document.body,
        )}

      {(mode === "all" || mode == "student") &&
        isCommentModalOpen &&
        createPortal(
          <div style={baseModalStyle} onClick={closeSubmissionModal}>
            <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
              <div style={modalHeaderStyle(isDesktop)}>
                <h2 style={modalTitleStyle(isDesktop)}>
                  {selectedCommentAnswer
                    ? "Editar comentário"
                    : "Comentar resposta"}
                </h2>

                <button onClick={closeSubmissionModal} style={closeBtnStyle}>
                  ×
                </button>
              </div>

              {selectedHomeworkAnswer && (
                <div style={{ marginBottom: 16 }}>
                  <label style={inputLabelStyle(isDesktop)}>
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
                  style={{
                    width: "100%",
                    minHeight: 250,
                    resize: "vertical",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    padding: 12,
                    fontSize: 14,
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button onClick={closeSubmissionModal} style={secondaryBtn}>
                  Cancelar
                </button>

                <button
                  onClick={saveCommentAnswer}
                  disabled={uploading || !stripHtml(commentAnswerText)}
                  style={{
                    ...primaryBtn,
                    opacity:
                      uploading || !stripHtml(commentAnswerText) ? 0.6 : 1,
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
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #E5E7EB",
  backgroundColor: "#F9FAFB",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "#666",
  border: "1px solid #ddd",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  backgroundColor: partnerColor(),
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 12,
};

const dangerBtn: React.CSSProperties = {
  backgroundColor: "#DC2626",
  color: "#FFF",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 13,
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "#6b7280",
};

const modalHeaderStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: isDesktop ? "row" : "column",
  justifyContent: "space-between",
  alignItems: isDesktop ? "center" : "flex-start",
  marginBottom: isDesktop ? 20 : 16,
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: 16,
  gap: isDesktop ? 0 : 12,
});

const modalTitleStyle = (isDesktop: boolean): React.CSSProperties => ({
  margin: 0,
  fontSize: isDesktop ? 16 : 18,
  fontWeight: 500,
  color: "#495057",
});

const sectionLabelStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "block",
  marginBottom: 12,
  fontSize: isDesktop ? 16 : 18,
  fontWeight: 600,
  color: "#374151",
});

const inputLabelStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "block",
  marginBottom: 8,
  fontSize: isDesktop ? 14 : 16,
  fontWeight: 500,
  color: "#374151",
});

const toggleButtonStyle = (
  active: boolean,
  isDesktop: boolean,
): React.CSSProperties => ({
  flex: 1,
  padding: isDesktop ? "8px 12px" : "12px 16px",
  border: `1px solid ${active ? "#adb5bd" : "#dee2e6"}`,
  borderRadius: 6,
  minHeight: isDesktop ? "auto" : "48px",
  backgroundColor: active ? "#e9ecef" : "#f8f9fa",
  color: active ? "#495057" : "#6c757d",
  fontSize: isDesktop ? 13 : 14,
  fontWeight: 400,
  cursor: "pointer",
});

const fileInputStyle = (isDesktop: boolean): React.CSSProperties => ({
  width: "100%",
  padding: isDesktop ? "12px" : "16px",
  border: "2px dashed #e2e8f0",
  borderRadius: 6,
  backgroundColor: "#f8fafc",
  cursor: "pointer",
  fontSize: isDesktop ? "14px" : "16px",
  color: "#64748b",
  minHeight: isDesktop ? "auto" : "60px",
});

const selectedFileBoxStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  gap: 8,
};
