import React, { useState } from "react";
import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type Props = {
  moduleId: string;
  initialTitle: string;
  headers?: any;
  canEdit?: boolean;
  onChanged?: () => void; // chame getModules() no pai
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 420px)",
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const headerStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 600,
  fontSize: 14,
};

const bodyStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 13,
  color: "#334155",
};

const footerStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  gap: 8,
  justifyContent: "flex-end",
};

const btn: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: partnerColor(),
  border: `1px solid ${partnerColor()}`,
  color: "#fff",
};

const iconBtn: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const danger: React.CSSProperties = {
  ...btn,
  border: "1px solid #ef4444",
  color: "#ef4444",
  background: "#fff",
};

const ModuleActions: React.FC<Props> = ({
  moduleId,
  initialTitle,
  headers,
  canEdit = false,
  onChanged,
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  const [loading, setLoading] = useState(false);

  const closeAll = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || loading) return;
    setLoading(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/module/${moduleId}`,
        { title: title.trim() },
        { headers: headers || {} }
      );
      closeAll();
      onChanged?.();
    } catch (e) {
      setLoading(false);
      alert("Não foi possível salvar o título do módulo.");
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.delete(`${backDomain}/api/v1/module/${moduleId}`, {
        headers: headers || {},
      });
      closeAll();
      onChanged?.();
    } catch (e) {
      setLoading(false);
      alert("Não foi possível excluir o módulo.");
    }
  };

  return (
    <span style={{ display: "inline-flex", gap: 6, marginLeft: 8 }}>
      {/* Botão editar */}
      <button
        style={{
          ...iconBtn,
          opacity: canEdit ? 1 : 0.4,
          pointerEvents: canEdit ? "auto" : "none",
        }}
        onClick={() => {
          setTitle(initialTitle || "");
          setOpenEdit(true);
        }}
        title="Editar nome do módulo"
      >
        <i className="fa fa-pencil" aria-hidden="true" />
      </button>

      {/* Botão excluir */}
      <button
        style={{
          ...iconBtn,
          ...danger,
          opacity: canEdit ? 1 : 0.4,
          pointerEvents: canEdit ? "auto" : "none",
        }}
        onClick={() => setOpenDelete(true)}
        title="Excluir módulo"
      >
        <i className="fa fa-trash" aria-hidden="true" />
      </button>

      {/* MODAL: Editar */}
      {openEdit && (
        <div style={overlayStyle} onClick={closeAll}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>Editar módulo</div>
            <div style={bodyStyle}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Nome do módulo
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o novo nome"
                  style={{
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    padding: "8px 10px",
                    fontSize: 13,
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = partnerColor())
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e2e8f0")
                  }
                />
              </label>
            </div>
            <div style={footerStyle}>
              <button style={btn} onClick={closeAll} disabled={loading}>
                Cancelar
              </button>
              <button
                style={btnPrimary}
                onClick={handleSave}
                disabled={loading || !title.trim()}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar exclusão */}
      {openDelete && (
        <div style={overlayStyle} onClick={closeAll}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>Excluir módulo</div>
            <div style={bodyStyle}>
              Tem certeza que deseja excluir este módulo?
              <div style={{ marginTop: 6, fontSize: 12, color: "#475569" }}>
                <b>Observação:</b> esta ação pode remover o módulo e suas
                referências. Verifique as aulas antes.
              </div>
            </div>
            <div style={footerStyle}>
              <button style={btn} onClick={closeAll} disabled={loading}>
                Cancelar
              </button>
              <button
                style={{ ...danger, fontWeight: 600 }}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Excluindo..." : "Excluir módulo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default ModuleActions;
