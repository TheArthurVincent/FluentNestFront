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

type DescriptionProps = {
  headers: MyHeadersType;
  theDescription?: string;
  evendId: string;
  fetchEventData: () => void;
};

// ---------- estilos reaproveitando a ideia do SimpleAIGenerator ----------
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
}) => {
  const [description, setDescription] = useState<string>(theDescription || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mantém o state sincronizado com a prop (caso o evento mude)
  useEffect(() => {
    setDescription(theDescription || "");
  }, [theDescription]);

  const updateDescription = async (id: string) => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${backDomain}/api/v1/eventdescription/${id}`,
        { description },
        { headers: headers as any }
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar descrição do evento");
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    setDescription(theDescription || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const handleSave = async () => {
    await updateDescription(evendId);
    setIsModalOpen(false);
  };

  // Render do modal via portal (usado APENAS quando já existe descrição)
  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null; // segurança SSR

    return createPortal(
      <div style={overlayStyle} onClick={saving ? undefined : closeModal}>
        <div
          style={modalStyle}
          onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
        >
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
              Editar descrição da aula
            </strong>
          </div>

          {/* Corpo do modal */}
          <div style={{ padding: 12, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <textarea
                disabled={saving}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escreva aqui a descrição da aula (o que foi feito, combinados, observações importantes...)"
                style={{
                  ...inputStyle,
                  minHeight: 120,
                  resize: "vertical",
                }}
              />
            </div>
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
              disabled={saving || !description.trim()}
            >
              {saving ? "Salvando..." : "Salvar descrição"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const hasDescription = !!theDescription && theDescription.trim().length > 0;

  return (
    <div
      style={{
        ...cardBase,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          ...cardTitle,
          marginBottom: 12,
          justifyContent: "space-between",
        }}
      >
        <span>Descrição</span>
      </div>
      {hasDescription ? (
        <>
          {/* Preview simples da descrição atual */}
          <div
            style={{
              fontSize: 13,
              color: "#0f172a",
              backgroundColor: "#f8fafc",
              borderRadius: 8,
              padding: 10,
              whiteSpace: "pre-wrap",
            }}
          >
            {theDescription}
          </div>

          {/* Botão que abre o modal */}
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
            Editar descrição
          </button>

          {renderModal()}
        </>
      ) : (
        <>
          {/* Sem descrição → editor inline, sem modal */}
          <span style={{ fontSize: 13, color: "#64748b" }}>
            Nenhuma descrição cadastrada para esta aula. Adicione a descrição
            abaixo:
          </span>

          <textarea
            disabled={saving}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escreva aqui a descrição da aula (conteúdo, combinados, observações...)"
            style={{
              ...inputStyle,
              minHeight: 120,
              resize: "vertical",
            }}
          />

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
              onClick={() => setDescription("")}
              disabled={saving}
            >
              Limpar
            </button>
            <button
              onClick={handleSave}
              style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
              disabled={saving || !description.trim()}
            >
              {saving ? "Salvando..." : "Salvar descrição"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Description;
