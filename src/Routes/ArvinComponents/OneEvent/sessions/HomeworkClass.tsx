import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type HomeworkClassProps = {
  headers: MyHeadersType;
  evendId: string;
  fetchEventData: () => Promise<void>;
  isDesktop?: boolean;
  event?: any;
  homeworkStudentName?: string;
  allowedToEdit?: boolean;
  allowedToAnswer?: boolean;
  homeworkID?: string;
  homeworkData: string;
  homeworkAnswer?: string;
  commentAnswer?: string;
  homeworkAttachment?: string;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999,
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 520px)",
  background: "#fff",
  borderRadius: 8,
  height: "85vh",
  overflowY: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  border: "1px solid #e2e8f0",
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #0891b2",
  backgroundColor: partnerColor(),
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 170,
  resize: "vertical",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  padding: 10,
  fontSize: 14,
  lineHeight: 1.4,
  outline: "none",
  boxSizing: "border-box",
};

const switchRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  background: "#fff",
  marginBottom: 12,
};

const switchTrackBase: React.CSSProperties = {
  width: 44,
  height: 24,
  borderRadius: 999,
  position: "relative",
  border: "1px solid #e2e8f0",
  transition: "background-color 180ms ease",
  cursor: "pointer",
  flexShrink: 0,
};

const switchThumbBase: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 999,
  background: "#fff",
  position: "absolute",
  top: 1.5,
  transition: "transform 180ms ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
};

const modeButtonBase: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};

type ModalMode = "description" | "answer" | "comment";
type SubmissionMode = "file" | "editor";

const HomeworkClass: FC<HomeworkClassProps> = ({
  headers,
  evendId,
  fetchEventData,
  homeworkData,
  homeworkAnswer,
  commentAnswer,
  homeworkAttachment,
  allowedToEdit,
  homeworkStudentName,
  allowedToAnswer,
  homeworkID,
  event,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("description");
  const [saving, setSaving] = useState(false);
  const [notifyTeacher, setNotifyTeacher] = useState<boolean>(false);
  const [submissionMode, setSubmissionMode] =
    useState<SubmissionMode>("editor");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasHomework = !!homeworkID;
  const hasTextAnswer = !!(homeworkAnswer || "").trim();
  const hasAttachment = !!(homeworkAttachment || "").trim();
  const hasAnswer = hasTextAnswer || hasAttachment;
  const hasCommentAnswer = !!(commentAnswer || "").trim();

  const htmlToTextarea = (html: string) =>
    (html || "").replace(/<br\s*\/?>/gi, "\n");

  const textareaToHtml = (text: string) =>
    (text || "").replace(/\r?\n/g, "<br />");

  const stripHtml = (html: string) =>
    (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  const [descriptionText, setDescriptionText] = useState<string>(
    htmlToTextarea(homeworkData || ""),
  );
  const [answerText, setAnswerText] = useState<string>(
    htmlToTextarea(homeworkAnswer || ""),
  );
  const [commentText, setCommentText] = useState<string>(
    htmlToTextarea(commentAnswer || ""),
  );

  useEffect(() => {
    setDescriptionText(htmlToTextarea(homeworkData || ""));
    setAnswerText(htmlToTextarea(homeworkAnswer || ""));
    setCommentText(htmlToTextarea(commentAnswer || ""));
  }, [homeworkData, homeworkAnswer, commentAnswer]);

  const resetAnswerUi = () => {
    setSelectedFile(null);
    setNotifyTeacher(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModalDescription = () => {
    if (!allowedToEdit) return;
    setMode("description");
    setIsModalOpen(true);
  };

  const openModalAnswer = () => {
    if (!allowedToAnswer) return;
    if (!homeworkID) return;

    setAnswerText(htmlToTextarea(homeworkAnswer || ""));
    setNotifyTeacher(false);
    setSelectedFile(null);
    setSubmissionMode(hasTextAnswer ? "editor" : "file");
    setMode("answer");
    setIsModalOpen(true);
  };

  const openModalComment = () => {
    if (!allowedToEdit) return;
    if (!homeworkID) return;
    if (!hasAnswer) return;

    setCommentText(htmlToTextarea(commentAnswer || ""));
    setMode("comment");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      resetAnswerUi();
    }
  };

  const canSave = useMemo(() => {
    if (saving) return false;

    if (mode === "description") {
      return !!allowedToEdit;
    }

    if (mode === "answer") {
      if (!homeworkID || !allowedToAnswer) return false;
      if (submissionMode === "file") return !!selectedFile || hasAttachment;
      return !!stripHtml(answerText);
    }

    if (mode === "comment") {
      return !!allowedToEdit && !!homeworkID;
    }

    return false;
  }, [
    saving,
    mode,
    allowedToEdit,
    allowedToAnswer,
    homeworkID,
    descriptionText,
    answerText,
    commentText,
    submissionMode,
    selectedFile,
    hasAttachment,
  ]);

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

  const deleteAttachment = async () => {
    if (!homeworkID) return;

    try {
      setSaving(true);
      await axios.delete(
        `${backDomain}/api/v1/delete-homework-attachment/${homeworkID}`,
        {
          headers: headers as any,
        },
      );

      await fetchEventData();
      if (mode === "answer") {
        setSelectedFile(null);
        setSubmissionMode(hasTextAnswer ? "editor" : "file");
      }
    } catch (error) {
      console.error("Erro ao excluir arquivo", error);
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);

      if (mode === "description") {
        if (!allowedToEdit) return;

        const descriptionToSave = textareaToHtml(descriptionText);

        if (homeworkID) {
          await axios.put(
            `${backDomain}/api/v1/edithomeworkdescription/${homeworkID}`,
            { description: descriptionToSave },
            { headers: headers as any },
          );
        } else {
          await axios.post(
            `${backDomain}/api/v1/homework/${event.studentID}`,
            {
              description: descriptionToSave,
              dueDate: null,
              eventID: evendId,
            },
            { headers: headers as any },
          );
        }
      }

      if (mode === "answer") {
        if (!allowedToAnswer) return;
        if (!homeworkID) return;

        if (submissionMode === "file") {
          if (!selectedFile) return;

          const base64File = await convertToBase64(selectedFile);

          await axios.post(
            `${backDomain}/api/v1/submithomework/${homeworkID}`,
            {
              base64String: base64File,
              fileName: selectedFile.name,
              fileType: selectedFile.type,
              submissionMode: "file",
            },
            { headers: headers as any },
          );
        } else {
          const answerToSave = textareaToHtml(answerText);

          await axios.put(
            `${backDomain}/api/v1/homeworkanswer/${homeworkID}`,
            {
              answers: answerToSave,
              notifyTeacher,
            },
            { headers: headers as any },
          );
        }
      }

      if (mode === "comment") {
        if (!allowedToEdit) return;
        if (!homeworkID) return;

        const commentToSave = textareaToHtml(commentText);

        await axios.put(
          `${backDomain}/api/v1/editcommentanswer/${homeworkID}`,
          {
            commentAnswer: commentToSave,
          },
          { headers: headers as any },
        );
      }

      await fetchEventData();
      setIsModalOpen(false);
      resetAnswerUi();
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setSaving(false);
    }
  };

  const renderAnswerInput = () => {
    if (submissionMode === "file") {
      return (
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Arquivo da resposta
          </div>

          <div
            style={{
              border: "2px dashed #e2e8f0",
              borderRadius: 8,
              padding: 12,
              background: "#f8fafc",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              style={{ width: "100%" }}
            />

            {selectedFile && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  fontSize: 13,
                  color: "#1e3a8a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile.name}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={{
                    ...ghostBtnStyle,
                    padding: "4px 8px",
                    fontSize: 12,
                  }}
                >
                  Remover
                </button>
              </div>
            )}

            {!selectedFile && hasAttachment && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: "#fafafa",
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  color: "#334155",
                }}
              >
                <div style={{ marginBottom: 8 }}>Arquivo atual enviado</div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={homeworkAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: partnerColor(),
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Baixar arquivo
                  </a>

                  <button
                    type="button"
                    onClick={deleteAttachment}
                    disabled={saving}
                    style={{
                      ...ghostBtnStyle,
                      color: "#dc2626",
                      borderColor: "#fecaca",
                      backgroundColor: "#fef2f2",
                    }}
                  >
                    Excluir arquivo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Sua resposta
        </div>

        <textarea
          style={textareaStyle}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Digite sua resposta..."
        />
      </>
    );
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    const title =
      mode === "description"
        ? hasHomework
          ? "Editar lição de casa"
          : "Criar lição de casa"
        : mode === "answer"
          ? hasAnswer
            ? "Editar resposta"
            : "Responder lição de casa"
          : hasCommentAnswer
            ? "Editar resposta do professor"
            : "Comentar resposta do aluno";

    return createPortal(
      <div style={overlayStyle} onClick={closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #e2e8f0",
              fontSize: 16,
              fontWeight: 600,
              maxHeight: "60vh",
              overflowY: "auto",
              color: "#0f172a",
            }}
          >
            {title}
          </div>

          <div
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: 16 }}>
              {(mode === "answer" || mode === "comment") && (
                <>
                  <div
                    style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}
                  >
                    Enunciado
                  </div>

                  <div
                    style={{
                      borderLeft: `4px solid ${partnerColor()}`,
                      paddingLeft: 10,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#334155",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: homeworkData || "" }}
                    />
                  </div>
                </>
              )}

              {mode === "comment" && hasAnswer && (
                <>
                  <div
                    style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}
                  >
                    Resposta do aluno
                  </div>

                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      background: "#fafafa",
                      padding: 10,
                      fontSize: 13,
                      color: "#334155",
                      marginBottom: 14,
                    }}
                  >
                    {hasAttachment && (
                      <div style={{ marginBottom: hasTextAnswer ? 10 : 0 }}>
                        <a
                          href={homeworkAttachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: partnerColor(),
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          Baixar arquivo enviado
                        </a>
                      </div>
                    )}

                    {hasTextAnswer && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: homeworkAnswer || "",
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              {mode === "description" && (
                <>
                  <div
                    style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}
                  >
                    Descrição
                  </div>

                  <textarea
                    style={textareaStyle}
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="Digite a descrição..."
                  />
                </>
              )}

              {mode === "answer" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSubmissionMode("file")}
                      style={{
                        ...modeButtonBase,
                        border:
                          submissionMode === "file"
                            ? "1px solid #cbd5e1"
                            : "1px solid #e2e8f0",
                        backgroundColor:
                          submissionMode === "file" ? "#e9ecef" : "#f8fafc",
                        color:
                          submissionMode === "file" ? "#334155" : "#64748b",
                      }}
                    >
                      Enviar arquivo
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmissionMode("editor")}
                      style={{
                        ...modeButtonBase,
                        border:
                          submissionMode === "editor"
                            ? "1px solid #cbd5e1"
                            : "1px solid #e2e8f0",
                        backgroundColor:
                          submissionMode === "editor" ? "#e9ecef" : "#f8fafc",
                        color:
                          submissionMode === "editor" ? "#334155" : "#64748b",
                      }}
                    >
                      Responder no campo
                    </button>
                  </div>

                  {renderAnswerInput()}
                </>
              )}

              {mode === "comment" && (
                <>
                  <div
                    style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}
                  >
                    Comentário do professor
                  </div>

                  <textarea
                    style={textareaStyle}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Digite seu comentário..."
                  />
                </>
              )}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
            >
              {mode === "answer" ? (
                <div style={switchRowStyle}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      Notificar professor
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-pressed={notifyTeacher}
                    onClick={() => setNotifyTeacher((v) => !v)}
                    style={{
                      ...switchTrackBase,
                      backgroundColor: notifyTeacher
                        ? partnerColor()
                        : "#e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        ...switchThumbBase,
                        left: 2,
                        transform: notifyTeacher
                          ? "translateX(20px)"
                          : "translateX(0px)",
                      }}
                    />
                  </button>
                </div>
              ) : (
                <div />
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{
                    cursor: saving ? "not-allowed" : "pointer",
                    ...ghostBtnStyle,
                  }}
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  onClick={save}
                  style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      <div
        style={{
          ...cardBase,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ ...cardTitle, justifyContent: "space-between" }}>
          <span>
            Lição de Casa {homeworkStudentName && `- ${homeworkStudentName}`}
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            {allowedToEdit && (
              <button
                onClick={openModalDescription}
                style={{
                  padding: "6px 12px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: hasAnswer ? "not-allowed" : "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                title={
                  hasAnswer
                    ? "Não é possível editar após a resposta"
                    : "Editar descrição da lição de casa"
                }
                disabled={hasAnswer}
              >
                {hasHomework ? "Editar" : "Criar"}
              </button>
            )}

            {allowedToAnswer && (
              <button
                onClick={openModalAnswer}
                style={{
                  padding: "6px 12px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor:
                    !hasHomework || hasCommentAnswer
                      ? "not-allowed"
                      : "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: hasHomework ? 1 : 0.6,
                }}
                disabled={!hasHomework || hasCommentAnswer}
                title={
                  !hasHomework
                    ? "Lição de casa ainda não disponível"
                    : hasCommentAnswer
                      ? "Não é possível editar após o comentário do professor"
                      : "Responder lição de casa"
                }
              >
                {hasAnswer ? "Editar resposta" : "Responder"}
              </button>
            )}
          </div>
        </div>

        {hasHomework ? (
          <div
            style={{
              borderLeft: `4px solid ${partnerColor()}`,
              paddingLeft: 10,
              color: "#4B5563",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: homeworkData || "" }} />
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Nenhuma lição de casa definida.
          </span>
        )}

        {hasHomework && hasAnswer && (
          <div
            style={{
              padding: 12,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fafafa",
              color: "#334155",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
              Resposta do aluno
            </div>

            {hasAttachment && (
              <div style={{ marginBottom: hasTextAnswer ? 10 : 0 }}>
                {!allowedToEdit && (
                  <button
                    onClick={deleteAttachment}
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
                    disabled={saving}
                  >
                    Excluir arquivo
                  </button>
                )}

                <a
                  href={homeworkAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: partnerColor(),
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Baixar arquivo
                </a>
              </div>
            )}

            {hasTextAnswer && (
              <div dangerouslySetInnerHTML={{ __html: homeworkAnswer || "" }} />
            )}
          </div>
        )}

        {hasHomework && hasAnswer && hasCommentAnswer && (
          <div
            style={{
              padding: 12,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "#fdfdfd",
              color: "#334155",
            }}
          >
            <div style={{ fontSize: 12, color: "#878f9a", marginBottom: 6 }}>
              Comentário do professor
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: 12,
              }}
              dangerouslySetInnerHTML={{ __html: commentAnswer || "" }}
            />
            {allowedToEdit && (
              <button
                onClick={openModalComment}
                style={{
                  marginTop: 10,
                  padding: "6px 12px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  marginLeft: "auto",
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Editar Comentário
              </button>
            )}
          </div>
        )}

        {allowedToEdit && !hasCommentAnswer && hasAnswer && (
          <button
            onClick={openModalComment}
            style={{
              marginTop: 10,
              padding: "6px 12px",
              backgroundColor: partnerColor(),
              color: "#fff",
              border: "none",
              borderRadius: 6,
              marginLeft: "auto",
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Comentar resposta de {homeworkStudentName || "aluno"}
          </button>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default HomeworkClass;
