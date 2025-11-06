import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import SentencesEditor, {
  SentencesBlock,
} from "./SentencesEditor/SentencesEditor";
import VocabularyEditor from "./VocabularyEditor/VocabularyEditor";
import VideoEditor, { VideoBlock } from "./VideoEditor/VideoEditor";
import TagsEditor from "./TagsEditor/TagsEditor";
import ExerciseEditor, { ExerciseBlock } from "./ExerciseEditor/ExerciseEditor";

type ElementItem =
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: string; // "video" | "sentences" | "vocabulary" ...
      video?: string;
      sentences?: Array<any>;
    }
  | Record<string, any>;

interface ClassDetails {
  courseId: string;
  description: string;
  elements: ElementItem[];
  image: string;
  language: string;
  module: string;
  moduleId?: string;
  order: number;
  title?: string;
  tags?: string[];
  [k: string]: any;
}

interface EditLessonModelProps {
  classId: string;
  setSeeEdit?: (v: boolean) => void;
  headers?: any;
  onUpdated?: (updated: ClassDetails) => void;
}

export default function EditLesson({
  classId,
  headers,
  onUpdated,
  setSeeEdit,
}: EditLessonModelProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [lesson, setLesson] = useState<ClassDetails | null>(null);

  // cabeçalho
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // URL atual (mostrada quando não há upload novo)
  const [order, setOrder] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);

  // elements por inputs
  const [elements, setElements] = useState<ElementItem[]>([]);

  // upload de imagem (base64) — substitui principal ao salvar
  const [uploadImageBase64, setUploadImageBase64] = useState<string | null>(
    null
  );
  const [uploadImageName, setUploadImageName] = useState<string | null>(null);
  const [uploadImageType, setUploadImageType] = useState<string | null>(null);

  // helper: arquivo -> base64 (sem prefixo)
  const fileToBase64NoPrefix = (
    file: File
  ): Promise<{ base64NoPrefix: string; mime: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const [meta, raw] = dataUrl.split(",");
        const mime = meta.match(/^data:(.*?);base64$/)?.[1] || "image/jpeg";
        resolve({ base64NoPrefix: raw, mime });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const onPickLessonImage = async (f?: File | null) => {
    if (!f) return;
    try {
      const { base64NoPrefix, mime } = await fileToBase64NoPrefix(f);
      setUploadImageBase64(base64NoPrefix);
      setUploadImageName(f.name || null);
      setUploadImageType(mime || null);
    } catch (e) {
      console.error("Erro ao ler arquivo:", e);
    }
  };

  const getClass = async () => {
    setSeeEdit?.(true);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        {
          headers,
        }
      );
      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) throw new Error("Resposta sem dados de aula (classDetails).");

      setLesson(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setOrder(Number(data.order ?? 0));
      setTags(Array.isArray(data.tags) ? data.tags : []);

      const raw = Array.isArray(data.elements) ? data.elements : [];
      setElements(raw);

      setOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao obter aula. Verifique o ID e as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lesson) return;
    setSaving(true);
    setError(null);

    // payload com upload opcional (base64)
    const payload: ClassDetails & {
      uploadImageBase64?: string;
      uploadImageName?: string | null;
      uploadImageType?: string | null;
    } = {
      ...lesson,
      title,
      description,
      image, // backend deve sobrepor se receber uploadImageBase64
      order: Number(order),
      tags,
      elements,
      ...(uploadImageBase64
        ? {
            uploadImageBase64,
            uploadImageName,
            uploadImageType,
          }
        : {}),
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/course/${classId}`,
        payload,
        {
          headers,
        }
      );

      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;

      // atualiza tudo localmente (incluindo nova URL da imagem, se houver)
      setLesson(updated);
      if (updated?.image) setImage(updated.image);
      setTitle(updated?.title ?? title);
      setTags(Array.isArray(updated?.tags) ? updated.tags : tags);

      // limpa upload
      setUploadImageBase64(null);
      setUploadImageName(null);
      setUploadImageType(null);

      onUpdated?.(updated);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar a aula.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateElementAt = (index: number, next: any) => {
    setElements((prev) => {
      const clone = prev.slice();
      clone[index] = next;
      return clone;
    });
  };

  const removeElementAt = (index: number) => {
    setElements((prev) => {
      const clone = prev.slice();
      clone.splice(index, 1);
      return clone;
    });
  };

  const moveElement = (from: number, to: number) => {
    setElements((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const clone = prev.slice();
      const [item] = clone.splice(from, 1);
      clone.splice(to, 0, item);
      return clone;
    });
  };

  const moveElementUp = (index: number) => moveElement(index, index - 1);
  const moveElementDown = (index: number) => moveElement(index, index + 1);

  return (
    <>
      {!open && (
        <button
          onClick={open ? () => setOpen(false) : getClass}
          disabled={loading}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "11px",
            fontWeight: 400,
            color: "#64748b",
            padding: "4px 6px",
            height: 28,
            outline: "none",
            cursor: "pointer",
            display: "block",
          }}
        >
          {loading ? "Carregando..." : open ? "Fechar editor" : "Editar Aula"}
        </button>
      )}

      {open && (
        <div
          aria-label="Editor de aula"
          style={{
            marginTop: 12,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 18,
                margin: 0,
              }}
            >
              Editar Aula
            </h2>

            <button
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748b",
              }}
              aria-label="Fechar"
              title="Fechar"
            >
              Fechar
            </button>
          </div>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: 8,
                borderRadius: 8,
                marginBottom: 12,
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {/* Cabeçalho */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr",
              marginBottom: 12,
            }}
          >
            {/* Título */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Título da aula
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Business Essentials — Vocabulary & Usage"
                style={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
            </div>

            {/* Tags */}
            <TagsEditor
              value={tags}
              onChange={setTags}
              helperText="Pressione Enter ou vírgula para adicionar. Clique no × para remover."
            />

            {/* Descrição */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descrição da aula"
                style={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
            </div>

            {/* Grid: Upload/Preview + Idioma/Order */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(390px, 1fr))",
                alignItems: "start",
                gap: 20,
              }}
            >
              {/* Upload + Preview */}
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Imagem da aula (enviada como base64 ao salvar)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onPickLessonImage(e.target.files?.[0] || null)
                  }
                />
                {uploadImageBase64 && (
                  <small style={{ color: "#16a34a" }}>
                    Imagem pronta para envio ({uploadImageName})
                  </small>
                )}
                {(uploadImageBase64 || image) && (
                  <img
                    src={
                      uploadImageBase64
                        ? `data:${
                            uploadImageType || "image/jpeg"
                          };base64,${uploadImageBase64}`
                        : image
                    }
                    alt="Lesson thumbnail"
                    style={{
                      width: "200px",
                      height: "200px",
                      display: "block",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              {/* Language + Order */}
              <div
                style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Language
                  </label>
                  <select
                    value={lesson?.language ?? "en"}
                    onChange={(e) =>
                      setLesson((prev) =>
                        prev ? { ...prev, language: e.target.value } : prev
                      )
                    }
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                      background: "white",
                      color: "#0f172a",
                    }}
                  >
                    <option value="en">English (en)</option>
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                  </select>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo da Aula */}
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            <h1 style={{ fontSize: 22, textAlign: "center", color: "#0f172a" }}>
              Conteúdo da Aula
            </h1>

            <div style={{ display: "grid", gap: 20 }}>
              {elements.length === 0 && (
                <div
                  style={{
                    border: "1px dashed #94a3b8",
                    borderRadius: 8,
                    padding: 16,
                    color: "#64748b",
                  }}
                >
                  Nenhum elemento cadastrado.
                </div>
              )}

              {elements.map((el, idx) => {
                if (el?.type === "sentences") {
                  return (
                    <div key={idx}>
                      <SentencesEditor
                        value={el as SentencesBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                } else if (el?.type === "vocabulary") {
                  return (
                    <div key={idx}>
                      <VocabularyEditor
                        value={el as SentencesBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                } else if (el?.type === "video") {
                  return (
                    <div key={idx}>
                      <VideoEditor
                        value={el as VideoBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                } else if (el?.type === "exercise") {
                  return (
                    <div key={idx}>
                      <ExerciseEditor
                        value={el as ExerciseBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: 12,
                      background: "#fff7ed",
                      color: "#9a3412",
                    }}
                  >
                    <strong>Tipo não suportado ainda:</strong>{" "}
                    {String(el?.type)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ações */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <button
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
              disabled={saving}
              style={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                color: "#0f172a",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Fechar editor
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                borderRadius: 8,
                border: "1px solid #0891b2",
                backgroundColor: "#06b6d4",
                color: "white",
                padding: "8px 12px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
