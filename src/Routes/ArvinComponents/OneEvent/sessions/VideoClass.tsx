import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { IFrameVideoBlog } from "../../../HomePage/Blog.Styled";
import { getEmbedUrl } from "../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type EventVideoProps = {
  headers: MyHeadersType;
  videoUrl?: string;
  evendId: string;
  fetchEventData: () => void;
  allowedToEdit: boolean;
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

const EventVideo: FC<EventVideoProps> = ({
  headers,
  videoUrl,
  evendId,
  allowedToEdit,
  fetchEventData,
}) => {
  const [video, setVideo] = useState<string>(videoUrl || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVideo(videoUrl || "");
  }, [videoUrl]);

  const updateVideo = async (id: string) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${backDomain}/api/v1/eventvideo/${id}`,
        { video },
        { headers: headers as any },
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    setVideo(videoUrl || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const handleSave = async () => {
    await updateVideo(evendId);
    setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header do modal */}
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong style={{ fontSize: 14, color: "#0f172a" }}>
              Editar vídeo da aula
            </strong>
          </div>

          {/* Corpo do modal */}
          <div style={{ padding: 12, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <input
                disabled={saving}
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={inputStyle}
              />
            </div>

            {video && (
              <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Pré-visualização
                </label>
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <IFrameVideoBlog src={getEmbedUrl(video)} />
                </div>
              </div>
            )}
          </div>

          {/* Footer do modal */}
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
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar vídeo"}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const hasVideo = !!videoUrl;

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
      }}
    >
      {allowedToEdit && hasVideo && (
        <button
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
          onClick={openModal}
        >
          Editar vídeo
        </button>
      )}

      {hasVideo ? (
        <>
          {/* Preview do vídeo existente */}
          <IFrameVideoBlog src={getEmbedUrl(videoUrl!)} />
          {renderModal()}
        </>
      ) : (
        <>
          {/* Sem vídeo → editor inline, sem modal */}
          <span style={{ fontSize: 13, color: "#64748b" }}>
            Nenhum vídeo cadastrado para esta aula. Adicione o link abaixo:
          </span>

          <input
            disabled={saving}
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={inputStyle}
          />

          {video && (
            <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Pré-visualização
              </label>
              <div
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                }}
              >
                <IFrameVideoBlog src={getEmbedUrl(video)} />
              </div>
            </div>
          )}

          {allowedToEdit && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                style={ghostBtnStyle}
                onClick={() => setVideo("")}
                disabled={saving}
              >
                Limpar
              </button>
              <button
                onClick={handleSave}
                style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
                disabled={saving || !video.trim()}
              >
                {saving ? "Salvando..." : "Salvar vídeo"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventVideo;
