import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import SentencesEditor, {
  SentencesBlock,
} from "./SentencesEditor/SentencesEditor";
import VocabularyEditor from "./VocabularyEditor/VocabularyEditor";
import VideoEditor, { VideoBlock } from "./VideoEditor/VideoEditor";
import ExerciseEditor, { ExerciseBlock } from "./ExerciseEditor/ExerciseEditor";
import TagsEditor from "./TagsEditor/TagsEditor";
import { uploadImageViaBackend } from "../../../Resources/ImgUpload";
import ImagesEditor, {
  ImagesBlock,
  ImageEntry,
} from "./ImagesEditor/ImagesEditor";
import AudioAndTextEditor, {
  AudioBlock,
} from "./AudioAndTextEditor/AudioAndTextEditor";
import DialogueEditor, { DialogueBlock } from "./DialogueEditor/DialogueEditor";
import SelectExerciseEditor, {
  SelectExerciseBlock,
} from "./SelectExercise/SelectExercise";
import ExplanationEditor, {
  ExplanationBlock,
} from "./ExplanationEditor/ExplanationEditor";
import SingleImagesEditor, {
  SingleImagesBlock,
} from "./SingleImagesEditor/SingleImagesEditor";
import { partnerColor } from "../../../Styles/Styles";
import DeleteClassButton from "./DeleteLesson/DeleteLesson";
import ImportElementsEditor from "./ImportNewElements/SelectExercise/ImportNewElements";

type ElementBase = {
  subtitle?: string;
  grid?: number;
};

type ElementItem =
  | (ElementBase & {
      type: "video";
      video?: string;
    })
  | (ElementBase & {
      type: "sentences" | "vocabulary";
      sentences: Array<any>;
    })
  | (ElementBase & {
      type: "exercise";
      items: string[];
    })
  | (ElementBase & {
      type: "images";
      images: ImageEntry[];
    })
  | (ElementBase & {
      type: "audio";
      text: string;
      link: string;
      image?: string;
    })
  | (ElementBase & {
      type: "dialogue";
      dialogue: string[];
    })
  | (ElementBase & {
      type: "selectexercise";
      options: SelectExerciseBlock["options"];
    })
  | (ElementBase & {
      type: "singleimages";
      images: string[];
    })
  | ExplanationBlock
  | Record<string, any>;

interface ClassDetails {
  courseId: string;
  description: string;
  elements: ElementItem[];
  image: string;
  language: string;
  module: string;
  moduleId?: string;
  order: number; // só aqui continua
  title?: string;
  tags?: string[];
  [k: string]: any;
}

interface EditLessonModelProps {
  classId: string;
  setSeeEdit?: (v: boolean) => void;
  headers?: any;
  fetchEventData?: any;
  buttonText?: any;
  onUpdated?: (updated: ClassDetails) => void;
  studentId?: string | any;
  setChange?: any;
  change?: any;
  language: string;
}

type NewBlockType =
  | "sentences"
  | "vocabulary"
  | "video"
  | "exercise"
  | "images"
  | "audio"
  | "dialogue"
  | "selectexercise"
  | "explanation"
  | "singleimages";

export default function EditLesson({
  classId,
  headers,
  onUpdated,
  setSeeEdit,
  buttonText,
  studentId,
  fetchEventData,
  setChange,
  change,
  language,
}: EditLessonModelProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [lesson, setLesson] = useState<ClassDetails | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newType, setNewType] = useState<NewBlockType>("sentences");
  const [isValid, setIsValid] = useState(true);

  // --- Responsividade simples (mobile)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===================== CARREGAR AULA =====================
  const getClass = async () => {
    setSeeEdit?.(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers }
      );
      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) {
        throw new Error("Resposta sem dados de aula (classDetails).");
      }

      // Sanitiza elements removendo qualquer `order` que venha do back
      const sanitizedElements: ElementItem[] = Array.isArray(data.elements)
        ? data.elements.map((el: any) => {
            const { order: _ignored, ...rest } = el;
            return rest;
          })
        : [];

      setLesson(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setOrder(Number(data.order ?? 0));
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setElements(sanitizedElements);
      setOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao obter aula. Verifique o ID e as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Continua útil: se IA salvar direto no back e der setChange, recarrega do backend
  useEffect(() => {
    if (!open) return;
    if (!classId) return;
    if (change === undefined) return;
    getClass();
  }, [change]);

  // ===================== SALVAR AULA (persiste tudo, inclusive os importados) =====================
  const handleSave = async () => {
    if (!lesson) return;
    if (!isValid) {
      alert("Por favor, corrija os erros nos elementos antes de salvar.");
      return;
    }

    setSaving(true);
    setError(null);

    // Remove o campo `order` de cada element antes de enviar
    const sanitizedElements: ElementItem[] = (elements || []).map((el: any) => {
      const { order: _ignored, _id: _ignoredId, ...rest } = el;
      return rest;
    });

    const payload: ClassDetails = {
      ...lesson,
      title,
      description,
      image,
      order: Number(order), // order só na aula
      tags,
      elements: sanitizedElements,
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/class-edit/${classId}`,
        payload,
        { headers }
      );

      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;

      // Sanitiza de novo caso o back devolva `order` nos elements
      const updatedSanitizedElements: ElementItem[] = Array.isArray(
        updated.elements
      )
        ? updated.elements.map((el: any) => {
            const { order: _ignored, _id: _ignoredId, ...rest } = el;
            return rest;
          })
        : [];

      setLesson(updated);
      if (updated?.image) setImage(updated.image);
      setTitle(updated?.title ?? title);
      setTags(Array.isArray(updated?.tags) ? updated.tags : tags);
      setElements(updatedSanitizedElements);
      onUpdated?.(updated);
      setSeeEdit?.(false);

      window.location.reload();
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

  // ===================== IMAGEM PRINCIPAL =====================
  const onPickLessonImage = async (f?: File | null) => {
    if (!f) return;
    try {
      setUploadError(null);
      setUploadingImage(true);
      const url = await uploadImageViaBackend(f, {
        folder: "/lessons",
        fileName: `lesson_${classId}_main_${Date.now()}.jpg`,
        headers,
      });
      setImage(url);
    } catch (e: any) {
      console.error("Erro ao subir imagem da aula:", e?.message || e);
      setUploadError("Falha ao fazer upload da imagem. Tente novamente.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ===================== HELPERS ELEMENTS =====================
  const updateElementAt = (index: number, next: ElementItem) => {
    setElements((prev) => {
      const clone = [...prev];
      clone[index] = next;
      return clone;
    });
  };

  const removeElementAt = (index: number) => {
    setElements((prev) => {
      const clone = [...prev];
      clone.splice(index, 1);
      return clone;
    });
  };

  const moveElement = (from: number, to: number) => {
    setElements((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const clone = [...prev];
      const [item] = clone.splice(from, 1);
      clone.splice(to, 0, item);
      return clone;
    });
  };

  const moveElementUp = (index: number) => moveElement(index, index - 1);
  const moveElementDown = (index: number) => moveElement(index, index + 1);

  // ---------- Adicionar novo bloco ----------
  const makeEmptyBlock = (type: NewBlockType): ElementItem => {
    const base: any = { subtitle: "" }; // sem order

    switch (type) {
      case "singleimages":
        return { ...base, type: "singleimages", images: [] };
      case "sentences":
        return { ...base, type: "sentences", sentences: [] };
      case "vocabulary":
        return { ...base, type: "vocabulary", sentences: [] };
      case "video":
        return { ...base, type: "video", video: "" };
      case "exercise":
        return { ...base, type: "exercise", items: [] };
      case "images":
        return { ...base, type: "images", images: [] as ImageEntry[] };
      case "audio":
        return { ...base, type: "audio", text: "", link: "", image: "" };
      case "dialogue":
        return { ...base, type: "dialogue", dialogue: [] };
      case "selectexercise":
        return { ...base, type: "selectexercise", options: [] };
      case "explanation":
        return {
          ...base,
          type: "explanation",
          subtitle: "",
          explanation: [{ image: null, title: "", list: [""] }],
        } as ExplanationBlock;
      default:
        return base as any;
    }
  };

  const addBlock = (pos: "start" | "end" = "end") => {
    const block = makeEmptyBlock(newType);
    setElements((prev) =>
      pos === "start" ? [block, ...prev] : [...prev, block]
    );
  };

  // ===================== Import de elementos (sem salvar no back) =====================
  const handleImportChange = (info: {
    mode: "one" | "all";
    fromClassId: string;
    fromTitle: string;
    elements: any[];
  }) => {
    const { elements: imported } = info;

    setElements((prev) => {
      const cleanImported: ElementItem[] = imported.map((plain: any) => {
        const { _id, order, ...rest } = plain;
        return rest as ElementItem;
      });

      // pode mudar estratégia se quiser (no início, só no final, etc.)
      return [...prev, ...cleanImported];
    });
  };

  // ===================== ESTILOS BASE =====================
  const outerWrapStyle: React.CSSProperties = {
    width: "98%",
    margin: "0 auto",
    padding: 12,
    boxSizing: "border-box",
    borderRadius: 12,
  };

  const sectionCard: React.CSSProperties = {
    padding: 10,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#334155",
    marginBottom: 4,
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    boxSizing: "border-box",
  };

  const fullWidthButton: React.CSSProperties = {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    color: "#0f172a",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 13,
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f9fafb",
  };

  const primaryButton: React.CSSProperties = {
    ...fullWidthButton,
    backgroundColor: partnerColor(),
    color: "white",
    fontWeight: 600,
    border: "none",
  };

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <>
      {!open && (
        <button
          onClick={getClass}
          disabled={loading}
          style={{
            borderRadius: 6,
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: 12,
            fontWeight: 400,
            color: "#64748b",
            padding: "6px 10px",
            height: 18,
            outline: "none",
            cursor: "pointer",
            display: "block",
            maxWidth: isMobile ? "100%" : 120,
          }}
        >
          {loading ? "Carregando..." : buttonText || "Editar aula"}
        </button>
      )}

      {open && (
        <div aria-label="Editor de aula" style={outerWrapStyle}>
          {/* TÍTULO / ERRO */}
          <div style={{ marginBottom: 12 }}>
            <h2
              style={{
                fontSize: "clamp(16px, 3.2vw, 20px)",
                textAlign: "center",
                margin: 0,
                color: "#0f172a",
              }}
            >
              {buttonText || "Editar aula"}
            </h2>

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: 8,
                  borderRadius: 8,
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <button
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
              style={{
                ...fullWidthButton,
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "100%" : 180,
              }}
            >
              Fechar sem salvar
            </button>
          </div>

          {/* CABEÇALHO E METADADOS */}
          {!fetchEventData && (
            <div style={{ ...sectionCard, marginBottom: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "minmax(0, 2fr) minmax(0, 1fr)",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={labelStyle}>Título da aula</div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: Business Essentials — Vocabulary & Usage"
                    style={inputBase}
                  />
                </div>

                <div>
                  <div style={labelStyle}>Language</div>
                  <select
                    value={lesson?.language ?? "en"}
                    onChange={(e) =>
                      setLesson((prev) =>
                        prev ? { ...prev, language: e.target.value } : prev
                      )
                    }
                    style={{
                      ...inputBase,
                      background: "white",
                      paddingRight: 24,
                    }}
                  >
                    <option value="en">English (en)</option>
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                  </select>
                </div>
              </div>

              <TagsEditor
                value={tags}
                onChange={setTags}
                helperText="Pressione Enter ou vírgula para adicionar. Clique no × para remover."
              />

              <div style={{ marginTop: 10 }}>
                <div style={labelStyle}>Description</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Descrição da aula"
                  style={{ ...inputBase, resize: "vertical" }}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={labelStyle}>Imagem da aula</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onPickLessonImage(e.target.files?.[0] || null)
                  }
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <small style={{ color: "#0ea5e9" }}>Enviando imagem...</small>
                )}
                {uploadError && (
                  <small style={{ color: "#b91c1c" }}>{uploadError}</small>
                )}

                {image && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <img
                      src={image}
                      alt="Lesson thumbnail"
                      style={{
                        width: isMobile ? "100%" : 240,
                        maxWidth: 300,
                        height: isMobile ? "auto" : 240,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      onClick={() => setImage("")}
                      style={{
                        ...fullWidthButton,
                        maxWidth: 180,
                        fontSize: 12,
                      }}
                    >
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOOLBAR: Import + tipo + add início/fim */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as NewBlockType)}
              style={{
                ...inputBase,
                background: "white",
                maxWidth: 140,
                paddingRight: 24,
              }}
              title="Tipo do novo bloco"
            >
              <option value="explanation">Explanation/Introduction</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="singleimages">Single Images</option>
              <option value="sentences">Sentences</option>
              <option value="audio">Text + Audio</option>
              <option value="images">Images (Grid + Audio)</option>
              <option value="video">Video</option>
              <option value="exercise">Exercise (List of questions)</option>
              <option value="dialogue">Dialogue</option>
              <option value="selectexercise">Select Exercise</option>
            </select>

            <button
              onClick={() => addBlock("start")}
              style={{
                ...fullWidthButton,
                maxWidth: 100,
              }}
              title="Adicionar no início"
            >
              + Início
            </button>

            <button
              onClick={() => addBlock("end")}
              style={{ ...primaryButton, maxWidth: 100 }}
              title="Adicionar ao final"
            >
              + Final
            </button>
            <ImportElementsEditor
              lessonId={classId}
              studentId={studentId}
              headers={headers}
              onChange={handleImportChange}
              fetchEventData={fetchEventData}
            />
          </div>

          {/* CONTEÚDO DA AULA */}
          <div style={{ ...sectionCard, marginBottom: 12 }}>
            <h3
              style={{
                fontSize: "clamp(16px, 3vw, 18px)",
                textAlign: "center",
                margin: "0 0 8px 0",
                color: "#0f172a",
              }}
            >
              Conteúdo da Aula
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {elements.length === 0 && (
                <div
                  style={{
                    border: "1px dashed #94a3b8",
                    borderRadius: 8,
                    padding: 14,
                    color: "#64748b",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Nenhum elemento cadastrado.
                </div>
              )}

              {elements.map((el, idx) => {
                if (el?.type === "sentences") {
                  return (
                    <SentencesEditor
                      key={idx}
                      setChange={setChange}
                      change={change}
                      language={language}
                      studentId={studentId}
                      value={el as SentencesBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                    />
                  );
                }

                if (el?.type === "vocabulary") {
                  return (
                    <VocabularyEditor
                      key={idx}
                      value={el as SentencesBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      change={change}
                      setChange={setChange}
                      language={language}
                      changeTokens={change}
                      setChangeTokens={setChange}
                      studentId={studentId}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                      headers={headers}
                    />
                  );
                }

                if (el?.type === "video") {
                  return (
                    <VideoEditor
                      key={idx}
                      value={el as VideoBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                    />
                  );
                }

                if (el?.type === "exercise") {
                  return (
                    <ExerciseEditor
                      key={idx}
                      language={language}
                      studentId={studentId}
                      type="exercises"
                      value={el as ExerciseBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                    />
                  );
                }

                if (el?.type === "images") {
                  return (
                    <ImagesEditor
                      key={idx}
                      value={el as ImagesBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                      headers={headers}
                    />
                  );
                }

                if (el?.type === "audio") {
                  return (
                    <AudioAndTextEditor
                      key={idx}
                      value={el as AudioBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      language={language}
                      studentId={studentId}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                      headers={headers}
                    />
                  );
                }

                if (el?.type === "dialogue") {
                  return (
                    <DialogueEditor
                      key={idx}
                      value={el as DialogueBlock}
                      language={language}
                      studentId={studentId}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                    />
                  );
                }

                if (el?.type === "selectexercise") {
                  return (
                    <SelectExerciseEditor
                      key={idx}
                      value={el as SelectExerciseBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                    />
                  );
                }

                if (el?.type === "explanation") {
                  return (
                    <ExplanationEditor
                      key={idx}
                      value={el as ExplanationBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                      headers={headers}
                    />
                  );
                }

                if (el?.type === "singleimages") {
                  return (
                    <SingleImagesEditor
                      key={idx}
                      value={el as SingleImagesBlock}
                      onChange={(next) => updateElementAt(idx, next)}
                      onRemove={() => removeElementAt(idx)}
                      onMoveUp={() => moveElementUp(idx)}
                      onMoveDown={() => moveElementDown(idx)}
                      headers={headers}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* AÇÕES FINAIS */}
          <div
            style={{
              ...sectionCard,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
              justifyContent: isMobile ? "stretch" : "flex-end",
            }}
          >
            <div style={{ flex: isMobile ? "unset" : 0 }}>
              <DeleteClassButton
                classId={classId}
                headers={headers}
                onDeleted={() => {
                  window.location.href = `/teaching-materials/${
                    lesson?.courseId || ""
                  }`;
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 8,
                width: isMobile ? "100%" : "auto",
                marginLeft: isMobile ? 0 : "auto",
              }}
            >
              <button
                onClick={() => {
                  setOpen(false);
                  setSeeEdit?.(false);
                }}
                style={{
                  ...fullWidthButton,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  ...primaryButton,
                  opacity: saving ? 0.8 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
