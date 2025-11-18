import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { uploadImageViaBackend } from "../../../Resources/ImgUpload";
import { backDomain } from "../../../Resources/UniversalComponents";

type NewCourseButtonProps = {
  studentId: string;
  headers?: Record<string, string>;
};

const NewCourseButton: React.FC<NewCourseButtonProps> = ({
  studentId,
  headers,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState<string>("en");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const firstFocusableRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading && !uploading) setOpen(false);
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "enter" &&
        open &&
        !loading &&
        !uploading
      ) {
        handleSubmit();
      }
    };
    document.addEventListener("keydown", onKey);
    if (open) {
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, uploading]);

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setLanguage("en");
    setErrorMsg(null);
  };

  const handlePickFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      setUploading(true);
      const url = await uploadImageViaBackend(file, {
        folder: "/courses",
        fileName: `course_${Date.now()}_${file.name}`,
        headers,
      });
      setImageUrl(url);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Falha no upload da imagem.";
      setErrorMsg(msg);
    } finally {
      setUploading(false);
      e.currentTarget.value = "";
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg("Título é obrigatório.");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        image: imageUrl || undefined,
        studentId,
        language: language || "en",
      };

      await axios.post(`${backDomain}/api/v1/course`, payload, { headers });

      setOpen(false);
      resetForm();
      window.location.reload();
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao criar curso.";
      setErrorMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Criar novo curso"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          color: "#334155",
          cursor: "pointer",
          fontSize: "14px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <i className="fa fa-plus" aria-hidden="true" />
        Novo curso
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-course-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading && !uploading)
              setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            top: 0,
            left: 0,
            margin: "0 auto",
            width: "90vw",
            height: "100vh",
            background: "rgba(17,24,39,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid #eef2f7",
                background: "#f8fafc",
              }}
            >
              <h3
                id="new-course-title"
                style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}
              >
                Criar novo curso
              </h3>
              <button
                onClick={() => !loading && !uploading && setOpen(false)}
                aria-label="Fechar"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: loading || uploading ? "not-allowed" : "pointer",
                  padding: "6px",
                  color: "#64748b",
                }}
              >
                <i className="fa fa-times" />
              </button>
            </div>

            <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
              {errorMsg && (
                <div
                  role="alert"
                  style={{
                    background: "#fef2f2",
                    color: "#991b1b",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "13px",
                  }}
                >
                  {errorMsg}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "grid",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Título *
                  <input
                    ref={firstFocusableRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: English Basics"
                    disabled={loading || uploading}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      outline: "none",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "grid",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Idioma
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={loading || uploading}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      outline: "none",
                    }}
                  >
                    <option value="en">English (en)</option>
                    <option value="es">Español (es)</option>
                    <option value="fr">Français (fr)</option>
                  </select>
                </label>
              </div>

              <label
                style={{
                  display: "grid",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#334155",
                }}
              >
                URL da imagem (opcional)
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/capa.png"
                  disabled={loading || uploading}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                  alignItems: "end",
                }}
              >
                <label
                  style={{
                    display: "grid",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Selecionar arquivo (gera URL)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePickFile}
                    disabled={loading || uploading}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      outline: "none",
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={true}
                  title="O upload ocorre automaticamente ao escolher o arquivo"
                  style={{
                    height: "38px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: "1px dashed #cbd5e1",
                    background: "#f8fafc",
                    color: "#64748b",
                    cursor: "not-allowed",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className="fa fa-cloud-upload" /> Upload automático
                </button>
              </div>

              {imageUrl.trim() && (
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    border: "1px dashed #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Pré-visualização:
                  </span>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "12px 16px",
                borderTop: "1px solid #eef2f7",
                background: "#fafafa",
              }}
            >
              <button
                onClick={() => {
                  if (!loading && !uploading) {
                    resetForm();
                    setOpen(false);
                  }
                }}
                disabled={loading || uploading}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#334155",
                  cursor: loading || uploading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || uploading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #0ea5e9",
                  background: loading || uploading ? "#7dd3fc" : "#38bdf8",
                  color: "white",
                  cursor: loading || uploading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                    Criando...
                  </>
                ) : uploading ? (
                  <>
                    <i className="fa fa-cloud-upload" aria-hidden="true" />
                    Enviando imagem...
                  </>
                ) : (
                  <>
                    <i className="fa fa-check" aria-hidden="true" />
                    Criar curso
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewCourseButton;
