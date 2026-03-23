import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

type DescriptionProps = {
  headers: MyHeadersType;
  theDescription?: string;
  theTeacherDescription?: string;
  evendId: string;
  allowedToEdit?: boolean;
  lesson?: any;
  fetchEventData: () => void;
  status: string;
  title: string;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "auto", // garante que ele intercepta o clique
  zIndex: 99999,
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 520px)",
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #0891b2",
  backgroundColor: partnerColor(),
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const Description: FC<DescriptionProps> = ({
  headers,
  allowedToEdit,
  theDescription,
  evendId,
  fetchEventData,
  lesson,
  status,
  theTeacherDescription,
  title,
}) => {
  const [description, setDescription] = useState<string>(theDescription || "");
  const [teacherDescription, setTeacherDescription] = useState<string>(
    theTeacherDescription || "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  var [theLesson, setTheLesson] = useState<{
    id: string;
    title: string;
    module: string;
    course: string;
  } | null>(lesson || null);

  const [loadingDescription, setLoadingDescription] = useState(false);
  const [change, setChange] = useState(false);

  const handleClassSummary = async () => {
    setLoadingDescription(true);
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myId}`,
          {
            status,
            description: description
              ? description
              : `Aula particular de ${title}`,
            classTitle: theLesson?.title,
            evendId: evendId || "",
          },
          { headers: headers as any },
        );
        const adapted = response.data.adapted;
        setDescription(adapted);
        setTeacherDescription(response.data.teacherDescription);
        setLoadingDescription(false);
        setChange(!change);
      } catch (error) {
        setLoadingDescription(false);
        notifyAlert("Erro", partnerColor());
        console.log(error, "Erro");
      }
    }
  };

  useEffect(() => {
    setDescription(theDescription || "");
  }, [theDescription]);

  const hasDescription = !!theDescription && theDescription.trim().length > 0;

  const updateDescription = async (id: string) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${backDomain}/api/v1/eventdescription/${id}`,
        { description, theLesson, teacherDescription },
        { headers: headers as any },
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar descrição do evento");
      notifyAlert("Erro ao salvar descrição da aula.", partnerColor());
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await updateDescription(evendId);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setDescription(theDescription || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    if (typeof document === "undefined") return null;
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, [isModalOpen]);
    return createPortal(
      <div
        onClick={(e) => e.stopPropagation()} // 👈 trava qualquer clique
        style={overlayStyle}
      >
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            style={{
              padding: "20px 16px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 16,
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            Editar descrições
          </div>
          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              Descrição geral (visível para aluno):
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "flex-end",
                }}
              >
                <textarea
                  disabled={saving || loadingDescription}
                  value={loadingDescription ? "Carregando..." : description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva aqui a descrição da aula (o que foi feito, combinados, observações importantes...)"
                  style={{
                    ...inputStyle,
                    minHeight: 150,
                    resize: "vertical",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
                <button
                  onClick={handleClassSummary}
                  disabled={
                    saving ||
                    loadingDescription ||
                    description.trim().split(/\s+/).filter(Boolean).length < 5
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor:
                      saving ||
                      loadingDescription ||
                      description.trim().split(/\s+/).filter(Boolean).length < 5
                        ? "grey"
                        : "white",
                    cursor:
                      saving ||
                      loadingDescription ||
                      description.trim().split(/\s+/).filter(Boolean).length < 5
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  ✨ (-10)
                </button>
              </div>
              Descrição do professor (invisível para aluno):
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "flex-end",
                }}
              >
                <textarea
                  disabled={saving}
                  value={teacherDescription}
                  onChange={(e) => setTeacherDescription(e.target.value)}
                  placeholder="Tome notas particulares sobre a aula aqui (invisível para o aluno). Esta área é útil para te lembrar de pontos importantes, dificuldades do aluno, ou qualquer outro detalhe que queira guardar para as próximas aulas."
                  style={{
                    ...inputStyle,
                    minHeight: 150,
                    resize: "vertical",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
              </div>
            </div>
          </div>

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
              onClick={handleSave}
              style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
              disabled={saving || !description.trim()}
            >
              {saving ? "Salvando..." : "Salvar"}
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
          position: "relative",
        }}
      >
        <div
          style={{
            ...cardTitle,
            marginBottom: 12,
            justifyContent: "space-between",
          }}
        >
          <span>Dados da Aula</span>
        </div>

        {/* BLOCO PRINCIPAL COM LEFT BORDER (igual vibe do MainInfoClass) */}
        <div
          style={{
            marginTop: 4,
            borderLeft: `4px solid ${partnerColor()}`,
            paddingLeft: 12,
            display: "grid",
            gap: 8,
          }}
        >
          {hasDescription ? (
            <>
              <div
                style={{
                  fontSize: 16,
                  color: "#606060",
                }}
              >
                {theLesson && theLesson.course && theLesson.id && (
                  <a
                    href={`/teaching-materials/${theLesson.course
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w\-]+/g, "")}/${theLesson.id}`}
                    style={{
                      gap: "5px",
                      display: "flex",
                      color: partnerColor(),
                      textDecoration: "none",
                      padding: "8px 0px",
                      borderRadius: "6px",
                      backgroundColor: "white",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    <strong>Aula vinculada - {theLesson.title}</strong>
                  </a>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 4,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#4B5563",
                  whiteSpace: "pre-wrap",
                }}
              >
                <b>Comentários da aula:</b>
                {theDescription}
              </div>
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: 12,
                  color: "#606060",
                }}
              >
                Nenhuma descrição cadastrada para esta aula.
              </span>
            </>
          )}
        </div>
        <div
          style={{
            marginTop: 4,
            borderLeft: `4px solid ${partnerColor()}`,
            paddingLeft: 12,
            display: "grid",
            gap: 8,
          }}
        >
          {allowedToEdit && theTeacherDescription && (
            <>
              <div
                style={{
                  display: "grid",
                  gap: 4,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#4B5563",
                  whiteSpace: "pre-wrap",
                }}
              >
                <b>Seus comentários para esta aula (invisível para o aluno):</b>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 4,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: "#4B5563",
                  whiteSpace: "pre-wrap",
                }}
              >
                {theTeacherDescription}
              </div>
            </>
          )}
        </div>
        {allowedToEdit && (
          <>
            {/* BOTÕES / EDIT */}
            {hasDescription ? (
              <button
                onClick={openModal}
                style={{
                  padding: "8px 16px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  maxWidth: "fit-content",
                  border: "none",
                  marginLeft: "auto",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Editar descrições
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  maxWidth: "fit-content",
                  border: "none",
                  marginLeft: "auto",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Adicionar descrição
              </button>
            )}
          </>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default Description;
