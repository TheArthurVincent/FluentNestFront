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
    background: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: isDesktop ? "center" : "flex-start",
    zIndex: 10000,
    padding: isDesktop ? "24px" : "18px 10px",
  };

  const modalBoxStyle = {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: isDesktop ? "22px" : "16px",
    maxWidth: isDesktop ? "620px" : "100%",
    width: isDesktop ? "92%" : "100%",
    maxHeight: isDesktop ? "88vh" : "calc(100vh - 36px)",
    overflowY: "auto" as const,
    border: "1px solid #E2E8F0",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
    marginTop: isDesktop ? "0" : "10px",
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <CircularProgress style={{ color: partnerColor() }} />
      </div>
    );
  }

  if (homeworks.length === 0) {
    return <p style={emptyTextStyle}>Nenhum homework encontrado.</p>;
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
              ...homeworkCardStyle,
            }}
          >
            <div style={topRowStyle(isDesktop)}>
              <div style={headerInfoColumnStyle}>
                <div style={headlineRowStyle}>
                  {showStudentName && hw.studentName ? (
                    <span style={studentNameStyle}>{hw.studentName}</span>
                  ) : null}

                  {hw.dueDate ? (
                    <span style={dateHeadlineStyle}>
                      Entrega em: {formatDateBr(hw.dueDate)}
                    </span>
                  ) : null}
                </div>

                {hw.assignmentDate && (
                  <span style={assignmentDateStyle}>
                    Atribuído em: {formatDateBr(hw.assignmentDate)}
                  </span>
                )}
              </div>

              <span
                style={{
                  ...pillStatus,
                  ...statusPillStyle,
                  backgroundColor: isDone ? "#EAF8EF" : "#FFF6E8",
                  color: isDone ? "#137333" : "#9A6700",
                  border: `1px solid ${isDone ? "#B7E1C1" : "#F8D9A0"}`,
                }}
              >
                {isDone ? "Concluído" : "Pendente"}
              </span>
            </div>

            {isAllowed && (
              <div style={actionsWrapStyle}>
                {isDone ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleReturnToPending(hw._id)}
                    style={ghostActionButton}
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
                    style={ghostActionButton}
                  >
                    Marcar como feito
                  </button>
                )}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => justStatus(hw._id)}
                  style={ghostActionButton}
                >
                  Só mudar status
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => openDeleteModal(hw._id)}
                  style={dangerGhostButton}
                >
                  Excluir
                </button>
              </div>
            )}

            <div style={contentSectionStyle}>
              <div style={sectionCaptionStyle}>Enunciado</div>
              <div
                style={sectionHtmlStyle}
                dangerouslySetInnerHTML={{ __html: hw.description }}
              />
            </div>

            {(mode === "all" || mode == "student") && hasAnswer && (
              <div style={contentSectionStyle}>
                <div style={sectionCaptionStyle}>Resposta do aluno</div>

                {hw.attachments && (
                  <div style={attachmentRowStyle}>
                    {!isAllowed && (
                      <button
                        style={deleteFileButtonStyle}
                        title="Excluir arquivo"
                        onClick={() => handleDeleteFile(hw._id)}
                      >
                        Excluir arquivo
                      </button>
                    )}

                    <a
                      href={hw.attachments}
                      
                      rel="noopener noreferrer"
                      style={attachmentLinkStyle}
                    >
                      Baixar Arquivo
                    </a>
                  </div>
                )}

                {hw.answers && (
                  <div
                    style={answerHtmlStyle}
                    dangerouslySetInnerHTML={{
                      __html: hw.answers || "",
                    }}
                  />
                )}
              </div>
            )}

            {(mode === "all" || mode == "student") && hasCommentAnswer && (
              <div style={commentSectionStyle}>
                <div style={commentCaptionStyle}>Comentário do professor</div>

                <div
                  style={commentContentStyle}
                  dangerouslySetInnerHTML={{
                    __html: hw.commentAnswer || "",
                  }}
                />
              </div>
            )}

            {(mode === "all" || mode == "student") &&
              !isAllowed &&
              !hw.attachments && (
                <div style={studentActionRowStyle}>
                  <button
                    type="button"
                    onClick={() => openSubmissionModal(hw)}
                    disabled={hasCommentAnswer}
                    style={{
                      ...primaryActionButton,
                      cursor: hasCommentAnswer ? "not-allowed" : "pointer",
                      opacity: hasCommentAnswer ? 0.6 : 1,
                    }}
                    title={
                      hasCommentAnswer
                        ? "Não é possível alterar a resposta após o comentário do professor"
                        : "Responder homework"
                    }
                  >
                    {hasAnswer ? "Editar resposta" : "Responder"}
                  </button>
                </div>
              )}

            {(mode === "all" || mode == "student") && isAllowed && (
              <div style={actionsWrapStyle}>
                <button
                  type="button"
                  onClick={() => openEditHomeworkModal(hw)}
                  disabled={hasAnswer}
                  style={{
                    ...ghostActionButton,
                    cursor: hasAnswer ? "not-allowed" : "pointer",
                    opacity: hasAnswer ? 0.6 : 1,
                  }}
                  title={
                    hasAnswer
                      ? "Não é possível editar a descrição após o aluno responder"
                      : "Editar homework"
                  }
                >
                  Editar homework
                </button>

                {hasAnswer && (
                  <button
                    type="button"
                    onClick={() => openCommentModal(hw)}
                    style={primaryActionButton}
                  >
                    {hasCommentAnswer
                      ? "Editar comentário"
                      : "Comentar resposta"}
                  </button>
                )}
              </div>
            )}

            {eventId && (
              <div style={footerLinkRowStyle}>
                <a
                  href={`/my-calendar/event/${eventId}`}
                  style={eventLinkStyle}
                >
                  {mode === "all" || mode == "student"
                    ? "Acessar"
                    : "Acessar Aula"}
                  <i
                    style={{ marginLeft: 8 }}
                    className="fa fa-chevron-right"
                  />
                </a>
              </div>
            )}
          </div>
        );
      })}

      {loadingMore && (
        <div style={loadingMoreStyle}>
          <CircularProgress size={24} style={{ color: partnerColor() }} />
        </div>
      )}

      {!hasNextPage && homeworks.length > 0 && (
        <p style={loadedAllTextStyle}>Todos os homeworks foram carregados.</p>
      )}

      {isDeleteModalOpen &&
        createPortal(
          <div style={baseModalStyle} onClick={closeDeleteModal}>
            <div
              style={{
                ...modalBoxStyle,
                maxWidth: 430,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={deleteModalHeaderStyle}>
                <h2 style={deleteModalTitleStyle}>Confirmar exclusão</h2>
              </div>

              <p style={deleteModalTextStyle}>
                Tem certeza de que deseja excluir este homework? Esta ação não
                pode ser desfeita.
              </p>

              <div style={modalFooterStyle(isDesktop)}>
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

              <div style={modalSectionStyle}>
                <label style={sectionLabelStyle(isDesktop)}>
                  {UniversalTexts?.howDoYouWantToRespond ||
                    "Como você quer responder?"}
                </label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: 12,
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
                <div style={modalSectionStyle}>
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
                      <span
                        style={{
                          fontSize: 14,
                          color: "#0F172A",
                          fontWeight: 500,
                        }}
                      >
                        {selectedFile.name}
                      </span>

                      <button
                        onClick={() => setSelectedFile(null)}
                        style={removeSelectedFileButtonStyle}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={modalSectionStyle}>
                  <label style={inputLabelStyle(isDesktop)}>
                    {UniversalTexts?.respondDirectlyHere ||
                      "Responda diretamente aqui:"}
                  </label>

                  <div style={editorBoxStyle}>
                    <HTMLEditor
                      onChange={handleHomeworkAnswerChange}
                      initialContent={selectedHomeworkContent}
                    />
                  </div>
                </div>
              )}

              <div style={modalFooterStyle(isDesktop)}>
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

              <div style={{ ...editorBoxStyle, marginBottom: 18 }}>
                <HTMLEditor
                  onChange={handleHomeworkAnswerChange}
                  initialContent={selectedHomeworkContent}
                />
              </div>

              <div style={modalFooterStyle(isDesktop)}>
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
                <div style={modalSectionStyle}>
                  <label style={inputLabelStyle(isDesktop)}>
                    Resposta do aluno
                  </label>

                  <div
                    style={studentAnswerPreviewStyle}
                    dangerouslySetInnerHTML={{
                      __html: selectedHomeworkAnswer || "",
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 18 }}>
                <textarea
                  value={commentAnswerText}
                  onChange={(e) => setCommentAnswerText(e.target.value)}
                  placeholder="Comente a resposta"
                  style={commentTextareaStyle}
                />
              </div>

              <div style={modalFooterStyle(isDesktop)}>
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

const homeworkCardStyle: React.CSSProperties = {
  padding: 16,
  marginBottom: 14,
  borderRadius: 12,
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
};

const topRowStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: isDesktop ? "flex-start" : "flex-start",
  flexDirection: isDesktop ? "row" : "column",
  gap: 12,
  marginBottom: 12,
});

const headerInfoColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
};

const headlineRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
};

const studentNameStyle: React.CSSProperties = {
  ...cardTitle,
  fontSize: 13,
  color: "#0F172A",
};

const dateHeadlineStyle: React.CSSProperties = {
  ...cardTitle,
  fontSize: 13,
  color: "#0F172A",
};

const assignmentDateStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#65748C",
  fontWeight: 500,
  fontFamily: "Inter",
};

const statusPillStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: 0.2,
};

const actionsWrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 12,
};

const studentActionRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
  marginBottom: 4,
};

const contentSectionStyle: React.CSSProperties = {
  padding: 14,
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  background: "#F8FAFC",
  color: "#334155",
  marginBottom: 12,
};

const commentSectionStyle: React.CSSProperties = {
  padding: 14,
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  background: "#FFFFFF",
  marginBottom: 12,
};

const sectionCaptionStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#65748C",
  marginBottom: 8,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const commentCaptionStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#65748C",
  marginBottom: 8,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const sectionHtmlStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: "#1E293B",
  lineHeight: 1.55,
};

const answerHtmlStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#1E293B",
  lineHeight: 1.55,
};

const commentContentStyle: React.CSSProperties = {
  fontStyle: "italic",
  fontSize: 13,
  color: "#334155",
  lineHeight: 1.6,
};

const attachmentRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const deleteFileButtonStyle: React.CSSProperties = {
  color: "#DC2626",
  padding: "0",
  border: "none",
  fontWeight: 700,
  backgroundColor: "transparent",
  cursor: "pointer",
  fontSize: 12,
};

const attachmentLinkStyle: React.CSSProperties = {
  color: partnerColor(),
  fontWeight: 700,
  textDecoration: "none",
  fontSize: 12,
};

const footerLinkRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 2,
};

const eventLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 700,
  color: partnerColor(),
  textDecoration: "none",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.3,
};

const loadingContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: 24,
};

const loadingMoreStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: 12,
  marginBottom: 12,
};

const emptyTextStyle: React.CSSProperties = {
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: 13,
  color: "#65748C",
};

const loadedAllTextStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  color: "#65748C",
  marginTop: 14,
  fontWeight: 500,
};

const buttonBase: React.CSSProperties = {
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const ghostActionButton: React.CSSProperties = {
  ...buttonBase,
  border: "1px solid #D9E2EC",
  backgroundColor: "#FFFFFF",
  color: "#334155",
};

const primaryActionButton: React.CSSProperties = {
  ...buttonBase,
  border: `1px solid ${partnerColor()}`,
  backgroundColor: partnerColor(),
  color: "#FFFFFF",
};

const dangerGhostButton: React.CSSProperties = {
  ...buttonBase,
  border: "1px solid #F5C2C7",
  backgroundColor: "#FFF5F5",
  color: "#B42318",
};

const secondaryBtn: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  color: "#475467",
  border: "1px solid #D0D5DD",
  padding: "9px 14px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  backgroundColor: partnerColor(),
  color: "#fff",
  border: "1px solid transparent",
  padding: "9px 14px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 700,
};

const dangerBtn: React.CSSProperties = {
  backgroundColor: "#D92D20",
  color: "#FFF",
  border: "1px solid transparent",
  padding: "9px 14px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 700,
};

const closeBtnStyle: React.CSSProperties = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  width: 36,
  height: 36,
  borderRadius: 6,
  fontSize: 22,
  cursor: "pointer",
  color: "#64748B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const modalHeaderStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: isDesktop ? "row" : "row",
  justifyContent: "space-between",
  alignItems: isDesktop ? "center" : "center",
  marginBottom: 18,
  borderBottom: "1px solid #E2E8F0",
  paddingBottom: 14,
  gap: 12,
});

const modalTitleStyle = (isDesktop: boolean): React.CSSProperties => ({
  margin: 0,
  fontSize: isDesktop ? 18 : 18,
  fontWeight: 700,
  color: "#0F172A",
  lineHeight: 1.2,
});

const sectionLabelStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "block",
  marginBottom: 10,
  fontSize: isDesktop ? 14 : 15,
  fontWeight: 700,
  color: "#0F172A",
});

const inputLabelStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "block",
  marginBottom: 8,
  fontSize: isDesktop ? 13 : 14,
  fontWeight: 700,
  color: "#334155",
});

const modalSectionStyle: React.CSSProperties = {
  marginBottom: 18,
};

const toggleButtonStyle = (
  active: boolean,
  isDesktop: boolean,
): React.CSSProperties => ({
  flex: 1,
  padding: isDesktop ? "12px 14px" : "13px 14px",
  border: `1px solid ${active ? partnerColor() : "#D0D5DD"}`,
  borderRadius: 10,
  minHeight: isDesktop ? "auto" : "48px",
  backgroundColor: active ? `${partnerColor()}15` : "#FFFFFF",
  color: active ? "#0F172A" : "#475467",
  fontSize: isDesktop ? 13 : 14,
  fontWeight: active ? 700 : 600,
  cursor: "pointer",
});

const fileInputStyle = (isDesktop: boolean): React.CSSProperties => ({
  width: "100%",
  padding: isDesktop ? "14px" : "16px",
  border: "2px dashed #CBD5E1",
  borderRadius: 10,
  backgroundColor: "#F8FAFC",
  cursor: "pointer",
  fontSize: isDesktop ? "14px" : "15px",
  color: "#64748B",
  minHeight: isDesktop ? "auto" : "60px",
});

const selectedFileBoxStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  backgroundColor: "#F8FAFC",
  border: "1px solid #DCE7F3",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const removeSelectedFileButtonStyle: React.CSSProperties = {
  marginLeft: "auto",
  background: "none",
  border: "none",
  color: "#DC2626",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: 700,
};

const editorBoxStyle: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  backgroundColor: "#FFFFFF",
  minHeight: "300px",
  overflow: "hidden",
};

const studentAnswerPreviewStyle: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  backgroundColor: "#F8FAFC",
  padding: 14,
  fontSize: 13,
  color: "#334155",
  lineHeight: 1.55,
};

const commentTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 250,
  resize: "vertical",
  border: "1px solid #D0D5DD",
  borderRadius: 10,
  padding: 14,
  fontSize: 14,
  fontFamily: "Inter, sans-serif",
  color: "#0F172A",
  backgroundColor: "#FFFFFF",
  outline: "none",
};

const modalFooterStyle = (isDesktop: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: isDesktop ? "row" : "column-reverse",
  justifyContent: isDesktop ? "flex-end" : "stretch",
  gap: 10,
});

const deleteModalHeaderStyle: React.CSSProperties = {
  marginBottom: 10,
  borderBottom: "1px solid #E2E8F0",
  paddingBottom: 12,
};

const deleteModalTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#0F172A",
};

const deleteModalTextStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 22,
  fontSize: 14,
  color: "#475467",
  lineHeight: 1.6,
};
