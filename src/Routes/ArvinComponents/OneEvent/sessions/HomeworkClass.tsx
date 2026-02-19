import React, { FC, useEffect, useMemo, useState } from "react";
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
  fetchEventData: () => void;
  isDesktop?: boolean;
  event?: any;

  allowedToEdit?: boolean;
  allowedToAnswer?: boolean;

  homeworkID?: string;
  homeworkData: string;
  homeworkAnswer?: string;
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
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
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

type ModalMode = "description" | "answer";

const HomeworkClass: FC<HomeworkClassProps> = ({
  headers,
  evendId,
  fetchEventData,
  homeworkData,
  homeworkAnswer,
  allowedToEdit,
  allowedToAnswer,
  homeworkID,
  event,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("description");
  const [saving, setSaving] = useState(false);

  const [notifyTeacher, setNotifyTeacher] = useState<boolean>(true);

  const hasHomework = !!homeworkID;
  const hasAnswer = !!(homeworkAnswer || "").trim();

  const htmlToTextarea = (html: string) =>
    (html || "").replace(/<br\s*\/?>/gi, "\n");
  const textareaToHtml = (text: string) =>
    (text || "").replace(/\r?\n/g, "<br />");

  const [descriptionText, setDescriptionText] = useState<string>(
    htmlToTextarea(homeworkData || ""),
  );
  const [answerText, setAnswerText] = useState<string>(
    htmlToTextarea(homeworkAnswer || ""),
  );

  useEffect(() => {
    setDescriptionText(htmlToTextarea(homeworkData || ""));
    setAnswerText(htmlToTextarea(homeworkAnswer || ""));
  }, [homeworkData, homeworkAnswer]);

  const openModalDescription = () => {
    if (!allowedToEdit) return;
    setMode("description");
    setIsModalOpen(true);
  };

  const openModalAnswer = () => {
    if (!allowedToAnswer) return;
    if (!homeworkID) return;

    setAnswerText(htmlToTextarea(homeworkAnswer || ""));
    setNotifyTeacher(true);
    setMode("answer");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const canSave = useMemo(() => {
    if (saving) return false;

    if (mode === "description") {
      return !!allowedToEdit && !!descriptionText.trim();
    }

    return !!homeworkID;
  }, [saving, mode, allowedToEdit, homeworkID, descriptionText]);

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

        const answerToSave = textareaToHtml(answerText);

        const response = await axios.put(
          `${backDomain}/api/v1/homeworkanswer/${homeworkID}`,
          {
            answers: answerToSave,
            notifyTeacher,
          },
          { headers: headers as any },
        );

        console.log(response.data, "Resposta salva:");
      }

      fetchEventData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setSaving(false);
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    const title =
      mode === "description"
        ? hasHomework
          ? "Editar lição de casa"
          : "Criar lição de casa"
        : hasAnswer
          ? "Editar resposta"
          : "Responder lição de casa";

    return createPortal(
      <div style={overlayStyle} onClick={closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #e2e8f0",
              fontSize: 16,
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            {title}
          </div>

          {/* Body */}
          <div style={{ padding: 16 }}>
            {/* Sempre mostra o enunciado (descrição) no modo answer */}
            {mode === "answer" && (
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

            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
              {mode === "description" ? "Descrição" : "Sua resposta"}
            </div>

            <textarea
              style={textareaStyle}
              value={mode === "description" ? descriptionText : answerText}
              onChange={(e) => {
                if (mode === "description") setDescriptionText(e.target.value);
                else setAnswerText(e.target.value);
              }}
              placeholder={
                mode === "answer"
                  ? "Digite sua resposta..."
                  : "Digite a descrição..."
              }
            />
          </div>
          {/* Switch de notificação (só no modo answer) */}
          {mode === "answer" && (
            <div style={switchRowStyle}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
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
                  backgroundColor: notifyTeacher ? partnerColor() : "#e5e7eb",
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
          )}
          {/* Footer */}
          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              style={ghostBtnStyle}
              onClick={closeModal}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={save}
              style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
              disabled={!canSave}
            >
              {saving ? "Salvando..." : "Salvar Resposta"}
            </button>
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
        {/* Header do Card */}
        <div style={{ ...cardTitle, justifyContent: "space-between" }}>
          <span>Lição de Casa</span>

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
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {hasHomework ? "Editar" : "Criar"}
              </button>
            )}

            {allowedToAnswer && (
              <button
                onClick={openModalAnswer}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: hasHomework ? "pointer" : "not-allowed",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: hasHomework ? 1 : 0.6,
                }}
                disabled={!hasHomework}
              >
                {hasAnswer ? "Editar resposta" : "Responder"}
              </button>
            )}
          </div>
        </div>

        {/* Preview DESCRIÇÃO */}
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

        {/* Preview ANSWER (se existir) */}
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

            <div dangerouslySetInnerHTML={{ __html: homeworkAnswer || "" }} />
          </div>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default HomeworkClass;
