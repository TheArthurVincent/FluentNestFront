import React, { useState, useEffect } from "react";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import { backDomain } from "../../../Resources/UniversalComponents";

interface NewModuleButtonProps {
  courseId: string;
  studentId: string;
  headers: any;
}

const injectKeyframes = () => {
  if (document.getElementById("modal-styles")) return;
  const style = document.createElement("style");
  style.id = "modal-styles";
  style.innerHTML = `
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1000}
  .modal{width:100%;max-width:480px;background:#fff;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.2);overflow:hidden}
  .modal-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;font-weight:600}
  .modal-content{padding:16px;display:flex;flex-direction:column;gap:12px}
  .modal-actions{display:flex;justify-content:flex-end;gap:10px;padding:12px 16px;border-top:1px solid #eee}
  .btn{border:1px solid #d1d5db;background:#fff;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:600}
  .btn.primary{background:${partnerColor()};border-color:${partnerColor()};color:#fff}
  .btn:disabled{opacity:.6;cursor:not-allowed}
  .input{border:1px solid #d1d5db;padding:8px 10px;border-radius:6px;font-size:14px;width:100%}
  `;
  document.head.appendChild(style);
};

const NewModuleButton: React.FC<NewModuleButtonProps> = ({
  courseId,
  studentId,
  headers,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => injectKeyframes(), []);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${backDomain}/api/v1/module`,
        { title, courseId, studentId },
        { headers }
      );
      setTitle("");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Erro ao criar módulo. Verifique suas permissões."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn primary"
        onClick={() => setOpen(true)}
        style={{ width: 100 }}
      >
        + Módulo
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={() => !loading && setOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>Novo Módulo</span>
              <button
                className="btn"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Fechar
              </button>
            </div>

            <div className="modal-content">
              <label htmlFor="title">Título do módulo</label>
              <input
                id="title"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introdução ao curso"
                disabled={loading}
              />
              {error && (
                <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn primary"
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
              >
                {loading ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewModuleButton;
