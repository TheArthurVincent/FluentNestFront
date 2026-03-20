import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";

type NewGroupModalProps = {
  headers?: any | null;
  teacherId?: string | number;
  onCreated?: () => void;
};

const modalRoot = typeof document !== "undefined" ? document.body : null;

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  headers,
  teacherId,
  onCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setName("");
    setDescription("");
  };

  const postGroup = async () => {
    try {
      setLoading(true);

      const logged = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const id = teacherId || logged.id || logged._id;

      if (!name.trim() || !description.trim()) {
        notifyAlert("Preencha o nome e a descrição da turma.");
        setLoading(false);
        return;
      }

      if (!id) {
        notifyAlert(
          "Não foi possível identificar o professor para criar a turma."
        );
        setLoading(false);
        return;
      }

      await axios.post(
        `${backDomain}/api/v1/group/${id}`,
        {
          arrayOfIds: [], // só nome e descrição, sem alunos por enquanto
          name: name.trim(),
          description: description.trim(),
        },
        {
          headers: headers || {},
        }
      );

      notifyAlert("Turma criada com sucesso!", partnerColor());
      setLoading(false);
      handleClose();
      onCreated && onCreated();
    } catch (error: any) {
      console.error(error?.response?.data || error?.message);
      notifyAlert("Erro ao criar turma");
      setLoading(false);
    }
  };

  const canCreate = name.trim() !== "" && description.trim() !== "" && !loading;

  if (!modalRoot) {
    // SSR / sem document
    return null;
  }

  return (
    <>
      {/* Botão que abre o modal */}
      <button
        onClick={handleOpen}
        style={{
          borderRadius: 6,
          border: "none",
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          background: partnerColor(),
          color: textpartnerColorContrast(),
          whiteSpace: "nowrap",
        }}
      >
        + Nova turma
      </button>

      {open &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(15, 23, 42, 0.45)",
            }}
            onClick={handleClose}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                margin: 16,
                background: "#ffffff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.35)",
                fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Criar nova turma
                </span>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 18,
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: 4,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 16,
                }}
              >
                Preencha o nome e a descrição da turma. Depois você pode
                adicionar alunos na página da turma.
              </p>

              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      marginBottom: 4,
                      color: "#64748b",
                    }}
                  >
                    Nome da turma
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Inglês Intermediário - Noite"
                    disabled={loading}
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                      padding: "8px 10px",
                      fontSize: 14,
                      outline: "none",
                      backgroundColor: "#f8fafc",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      marginBottom: 4,
                      color: "#64748b",
                    }}
                  >
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Turma de conversação focada em B1/B2."
                    disabled={loading}
                    rows={3}
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                      padding: "8px 10px",
                      fontSize: 14,
                      outline: "none",
                      resize: "vertical",
                      backgroundColor: "#f8fafc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <button
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: "#e5e7eb",
                    color: "#111827",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={postGroup}
                  disabled={!canCreate}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: canCreate ? partnerColor() : "#9ca3af",
                    color: textpartnerColorContrast(),
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: canCreate ? "pointer" : "not-allowed",
                  }}
                >
                  {loading ? "Criando..." : "Criar turma"}
                </button>
              </div>
            </div>
          </div>,
          modalRoot
        )}
    </>
  );
};

export default NewGroupModal;
