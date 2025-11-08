// components/EditCourseModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import { backDomain } from "../../../Resources/UniversalComponents";
import { uploadImageViaBackend } from "../../../Resources/ImgUpload";

/** ==================== TYPES ==================== */
export type Course = {
  _id: string;
  title: string;
  isOriginal?: boolean;
  createdBy?: string;
  image: string;
  order?: number;
  language?: "en" | "es" | "fr" | string;
};

export type EditCourseModalProps = {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  headers: any;
  onSaved: () => void;
  studentId: string; // necessário para validar permissão no DELETE
};

/** ==================== STYLE INJECTION ==================== */
const injectKeyframes = () => {
  if (document.getElementById("no-mui-keyframes")) return;
  const style = document.createElement("style");
  style.id = "no-mui-keyframes";
  style.innerHTML = `
  @keyframes spin{to{transform:rotate(360deg)}}
  .btn{appearance:none;border:1px solid #d1d5db;background:#fff;color:#111827;border-radius:6px;padding:8px 12px;cursor:pointer;font-weight:600}
  .btn:disabled{opacity:.6;cursor:not-allowed}
  .btn.primary{background:${partnerColor()};border-color:${partnerColor()};color:#fff}
  .iconbtn{border:none;background:transparent;padding:6px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
  .iconbtn:hover{background:#f3f4f6}
  .input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px}
  .label{font-size:12px;color:#6b7280;margin-bottom:4px;display:block}
  .stack{display:flex;gap:12px}
  .stack.col{flex-direction:column}
  .stack.row{flex-direction:row}
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
  .modal{width:100%;max-width:640px;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.25);overflow:hidden}
  .modal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;font-weight:700}
  .modal-content{padding:16px;max-height:70vh;overflow:auto}
  .modal-actions{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid #eee}
  `;
  document.head.appendChild(style);
};

/** ==================== ICONS (SVGs simples) ==================== */
const SvgUpload = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5 20h14v-2H5v2zM12 2 6.5 7.5l1.4 1.4L11 5.8V16h2V5.8l3.1 3.1 1.4-1.4L12 2z" />
  </svg>
);
const SvgCheck = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const SvgClose = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.18 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
  </svg>
);

/** ==================== COMPONENTE ==================== */
const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  course,
  headers,
  onSaved,
  studentId,
}) => {
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => injectKeyframes(), []);
  
  useEffect(() => {
  
  console.log("Course changed:", course);
    if (course) {
      setTitle(course.title || "");
      setImageUrl(course.image || "");
      setFile(null);
      setError("");
      setShowConfirmDelete(false);
    }
  }, [course]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(String(reader.result));
      reader.readAsDataURL(f);
    }
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    setError("");
    try {
      let finalImage = course.image;
      if (file) {
        finalImage = await uploadImageViaBackend(file, {
          folder: "/courses",
          fileName: `course_${course._id}_${Date.now()}.jpg`,
          headers,
        });
      }
      const payload = { title: title.trim(), image: finalImage, studentId };
      await axios.put(
        `${backDomain}/api/v1/course-edit/${course._id}`,
        payload,
        { headers }
      );
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    setDeleting(true);
    setError("");
    try {
      // Body no DELETE vai via config.data
      await axios.delete(`${backDomain}/api/v1/course/${course._id}`, {
        headers,
        data: { studentId },
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => (!saving && !deleting ? onClose() : null)}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span>Editar curso</span>
          <button
            className="iconbtn"
            aria-label="Fechar"
            onClick={onClose}
            disabled={saving || deleting}
            title="Fechar"
          >
            <SvgClose />
          </button>
        </div>

        <div className="modal-content">
          <div className="stack col">
            <label className="label" htmlFor="course-title">
              Título
            </label>
            <input
              id="course-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
              disabled={saving || deleting}
            />

            <div className="stack row" style={{ alignItems: "center" }}>
              <label
                className="btn"
                style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
              >
                <SvgUpload />
                <span>Trocar imagem</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={saving || deleting}
                />
              </label>
              {file && (
                <div
                  style={{ fontSize: 12, color: "#374151" }}
                  title={file.name}
                >
                  {file.name}
                </div>
              )}
            </div>

            {imageUrl && (
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
              </div>
            )}

            {error && (
              <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
            )}

            {/* Confirmação de exclusão */}
            {showConfirmDelete && (
              <div
                style={{
                  marginTop: 8,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#7f1d1d",
                  borderRadius: 8,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 14 }}>
                  Tem certeza que deseja excluir este curso? Esta ação não pode
                  ser desfeita.
                </span>
                <div className="stack row" style={{ gap: 8 }}>
                  <button
                    className="btn"
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn"
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      background: "#ef4444",
                      borderColor: "#ef4444",
                      color: "#fff",
                    }}
                    title="Excluir definitivamente"
                  >
                    {deleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          {/* Botão para abrir confirmação */}
          <button
            className="btn"
            onClick={() => setShowConfirmDelete((v) => !v)}
            disabled={saving || deleting}
            style={{
              borderColor: "#ef4444",
              color: "#ef4444",
              marginRight: "auto",
            }}
            title="Excluir este curso"
          >
            {showConfirmDelete ? "Cancelar exclusão" : "Excluir"}
          </button>

          <button
            className="btn"
            onClick={onClose}
            disabled={saving || deleting}
          >
            <div
              style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
            >
              <SvgClose />
              <span>Fechar</span>
            </div>
          </button>

          <button
            className="btn primary"
            onClick={handleSave}
            disabled={saving || deleting || !title.trim()}
          >
            {saving ? (
              <span>Salvando...</span>
            ) : (
              <div
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <SvgCheck />
                <span>Salvar</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;
