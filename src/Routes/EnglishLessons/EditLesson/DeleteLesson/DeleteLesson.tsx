import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";

type DeleteClassButtonProps = {
  classId: string;
  headers?: Record<string, string>;
  onDeleted?: (classId: string) => void;
  label?: string;
};

const DeleteClassButton: React.FC<DeleteClassButtonProps> = ({
  classId,
  headers,
  onDeleted,
  label = "Excluir",
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) setOpen(false);
  }

  async function handleConfirmDelete() {
    setErr(null);
    setLoading(true);
    try {
      await axios.delete(`${backDomain}/api/v1/class/${classId}`, {
        headers,
      });
      setLoading(false);
      setOpen(false);
      if (onDeleted) onDeleted(classId);
    } catch (error: any) {
      setLoading(false);
      setErr(error?.response?.data?.error || "Erro ao excluir a aula.");
      console.error("Erro ao excluir a aula:", error);
    }
  }

  return (
    <>
      {/* Botão de excluir */}
      <button
        onClick={() => setOpen(true)}
        title="Excluir aula"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          border: "1px solid #ef4444",
          background: "#fff",
          color: "#ef4444",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        <i className="fa fa-trash" aria-hidden="true" />
        {label}
      </button>

      {/* Modal simples */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-class-title"
        >
          <div
            style={{
              width: "min(92vw, 420px)",
              background: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h3
                id="delete-class-title"
                style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}
              >
                Confirmar exclusão
              </h3>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#64748b",
                }}
                aria-label="Fechar"
                title="Fechar"
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>

            <p
              style={{
                margin: "8px 0 14px",
                fontSize: "14px",
                color: "#334155",
              }}
            >
              Tem certeza de que deseja excluir esta aula? Esta ação não pode
              ser desfeita.
            </p>

            {err && (
              <div
                style={{
                  margin: "0 0 12px",
                  fontSize: "12px",
                  color: "#b91c1c",
                  background: "#fee2e2",
                  padding: "8px",
                  borderRadius: "6px",
                }}
              >
                {err}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  background: loading ? "#fca5a5" : "#ef4444",
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i className="fa fa-trash" aria-hidden="true" />
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteClassButton;
