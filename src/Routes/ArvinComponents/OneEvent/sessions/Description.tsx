import React, { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

type DescriptionProps = {
  headers: MyHeadersType;
  theDescription?: string;
  evendId: string;
  fetchEventData: () => void;
  status: string;
};

// ---------- estilos base (mesmos do MainInfoClass) ----------
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
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

const Description: FC<DescriptionProps> = ({
  headers,
  theDescription,
  evendId,
  fetchEventData,
  status,
}) => {
  const [description, setDescription] = useState<string>(theDescription || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  var [theLesson, setTheLesson] = useState<{
    id: string;
    title: string;
    module: string;
    course: string;
  } | null>(null);

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
          { status, description, classTitle: theLesson?.title || "" },
          { headers: headers as any }
        );
        const adapted = response.data.adapted;
        setDescription(adapted);
        setLoadingDescription(false);
        setChange(!change);
      } catch (error) {
        setLoadingDescription(false);
        notifyAlert("Erro", partnerColor());
        console.log(error, "Erro");
      }
    }
  };

  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setDescription(theDescription || "");
  }, [theDescription]);

  const hasDescription = !!theDescription && theDescription.trim().length > 0;

  // ================== API ==================

  const updateDescription = async (id: string) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${backDomain}/api/v1/eventdescription/${id}`,
        { description, theLesson },
        { headers: headers as any }
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

  const getClasses = async () => {
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (!myId) return;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/courses-organized/${myId}`,
          { headers: headers as any }
        );
        const res = response.data?.lessons ?? [];
        setLessonsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar cursos");
      }
    }
  };

  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================== filtros / grouping ==================

  const filteredLessonsList = useMemo(() => {
    if (!searchTerm.trim()) return lessonsList;
    const q = searchTerm.toLowerCase();
    return lessonsList.filter((l) => (l.title || "").toLowerCase().includes(q));
  }, [lessonsList, searchTerm]);

  const grouped = useMemo(() => {
    const byCourse: Record<string, Record<string, any[]>> = {};

    for (const l of filteredLessonsList) {
      const courseName = l.course ?? "Sem curso";
      const moduleName = l.module ?? "Sem módulo";

      if (!byCourse[courseName]) byCourse[courseName] = {};
      if (!byCourse[courseName][moduleName])
        byCourse[courseName][moduleName] = [];

      byCourse[courseName][moduleName].push(l);
    }

    return byCourse;
  }, [filteredLessonsList]);

  // ================== seleção de aula ==================

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id || id.startsWith("sep:")) return;

    const found = lessonsList.find((l) => String(l.id) === id);
    if (!found) {
      setTheLesson(null);
      return;
    }

    const normalized = {
      id: String(found.id),
      title: found.title,
      module: found.moduleId || found.module,
      course: found.courseId || found.course,
    };

    setTheLesson(normalized);
  };

  // ================== blocos de UI reutilizáveis ==================

  const renderLessonSelectorBlock = () => (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          fontSize: 12,
          color: "#334155",
          fontWeight: 500,
        }}
      >
        Aula usada
      </label>

      <input
        type="text"
        placeholder="Pesquisar aula pelo título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={inputStyle}
      />

      <select
        onChange={handleLessonChange}
        value={theLesson?.id ? String(theLesson.id) : ""}
        style={{
          ...inputStyle,
          paddingRight: 24,
        }}
      >
        <option value="" hidden>
          Selecione a aula...
        </option>

        {Object.keys(grouped).length === 0 && (
          <option value="" disabled>
            Nenhuma aula encontrada para essa busca.
          </option>
        )}

        {Object.entries(grouped).map(([courseName, modules]) => (
          <optgroup key={courseName} label={courseName}>
            {Object.entries(modules).map(([moduleName, ls]) => (
              <React.Fragment key={`${courseName}-${moduleName}`}>
                <option value={`sep:${courseName}:${moduleName}`} disabled>
                  — {moduleName} —
                </option>
                {ls.map((l: any) => (
                  <option key={l.id} value={String(l.id)}>
                    {l.title}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );

  // ================== MODAL ==================

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div style={overlayStyle} onClick={saving ? undefined : closeModal}>
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
            Editar descrição da aula
          </div>

          {/* Corpo */}
          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            {renderLessonSelectorBlock()}

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Dados da aula
              </label>
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
                    minHeight: 140,
                    resize: "vertical",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />
                <button
                  onClick={handleClassSummary}
                  disabled={saving || loadingDescription}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  ✨ (-5)
                </button>
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
      document.body
    );
  };

  // ================== RENDER PRINCIPAL ==================

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
                    target="_blank"
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
                      borderRadius: "4px",
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
              <span
                style={{
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                Use este espaço para registrar rapidamente o que foi visto,
                combinados, tarefas e observações importantes.
              </span>
            </>
          )}
        </div>

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
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Editar descrição e aula
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
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Adicionar descrição
          </button>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default Description;
