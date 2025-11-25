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
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";

type HomeworkClassProps = {
  headers: MyHeadersType;
  evendId: string;
  fetchEventData: () => void;
  isDesktop?: boolean;
  event?: any;
  allowedToEdit?: boolean;
  homeworkID?: string;
  homeworkData: string;
};

// ---------- estilos ----------
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

const HomeworkClass: FC<HomeworkClassProps> = ({
  headers,
  evendId,
  fetchEventData,
  homeworkData,
  allowedToEdit,
  homeworkID,
  event,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [descriptionHtml, setDescriptionHtml] = useState<string>(
    homeworkData || ""
  );

  // sincroniza com o backend
  useEffect(() => {
    setDescriptionHtml(homeworkData || "");
  }, [homeworkData]);

  const hasHomework = !!homeworkID;

  // ========= API =========

  const saveHomework = async () => {
    if (!allowedToEdit) return;
    console.log("saving homework", { homeworkID, descriptionHtml });
    try {
      setSaving(true);

      // 1. EDITAR HOMEWORK EXISTENTE
      if (homeworkID) {
        await axios.put(
          `${backDomain}/api/v1/edithomeworkdescription/${homeworkID}`,
          {
            description: descriptionHtml || "",
          },
          { headers: headers as any }
        );
      }

      // 2. CRIAR NOVO HOMEWORK
      else if (!homeworkID) {
        await axios.post(
          `${backDomain}/api/v1/homework/${event.studentID}`,
          {
            description: descriptionHtml,
            dueDate: null, // você pode ajustar depois
            eventID: evendId,
          },
          { headers: headers as any }
        );
      }

      await fetchEventData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar lição de casa", error);
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    if (!allowedToEdit) return;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

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
            {hasHomework ? "Editar lição de casa" : "Criar lição de casa"}
          </div>

          <div style={{ padding: 16 }}>
            <textarea
              onChange={(e) => setDescriptionHtml(e.target.value)}
              value={descriptionHtml}
            />
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
              onClick={saveHomework}
              style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
              disabled={saving || !descriptionHtml.trim()}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>,
      document.body
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
        <div
          style={{
            ...cardTitle,
            justifyContent: "space-between",
          }}
        >
          <span>Lição de Casa</span>

          {allowedToEdit && (
            <button
              onClick={openModal}
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
        </div>

        {/* preview */}
        {hasHomework ? (
          <div
            style={{
              borderLeft: `4px solid ${partnerColor()}`,
              paddingLeft: 10,
              color: "#4B5563",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: homeworkData,
              }}
            />
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Nenhuma lição de casa definida.
          </span>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default HomeworkClass;
