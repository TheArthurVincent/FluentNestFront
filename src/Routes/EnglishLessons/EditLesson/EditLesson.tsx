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

type ElementItem =
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "video";
      video?: string;
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "sentences" | "vocabulary";
      sentences: Array<any>;
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "exercise";
      items: string[];
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "images";
      images: ImageEntry[];
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "audio";
      text: string;
      link: string;
      image?: string;
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "dialogue";
      dialogue: string[];
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "selectexercise";
      options: SelectExerciseBlock["options"];
    }
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: "singleimages";
      images: string[];
    }
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
  order: number;
  title?: string;
  tags?: string[];
  [k: string]: any;
}

interface EditLessonModelProps {
  classId: string;
  setSeeEdit?: (v: boolean) => void;
  headers?: any;
  buttonText?: any;
  onUpdated?: (updated: ClassDetails) => void;
  studentId?: string;
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

  // --- mobile awaren[[[ess (sem libs)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    console.log("Setting up mobile listener...", studentId); 
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    };
    onChange(mq);
    mq.addEventListener?.("change", onChange as any);
    return () => mq.removeEventListener?.("change", onChange as any);
  }, []);

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
      if (!data) throw new Error("Resposta sem dados de aula (classDetails).");

      setLesson(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setOrder(Number(data.order ?? 0));
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setElements(Array.isArray(data.elements) ? data.elements : []);
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
    if (!isValid) {
      alert("Por favor, corrija os erros nos elementos antes de salvar.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: ClassDetails = {
      ...lesson,
      title,
      description,
      image,
      order: Number(order),
      tags,
      elements,
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/class-edit/${classId}`,
        payload,
        { headers }
      );
      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;
      setLesson(updated);
      if (updated?.image) setImage(updated.image);
      setTitle(updated?.title ?? title);
      setTags(Array.isArray(updated?.tags) ? updated.tags : tags);
      onUpdated?.(updated);
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

  // helpers elements
  const updateElementAt = (index: number, next: ElementItem) => {
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

  // ---------- Adicionar novo bloco ----------
  const getNextOrder = () => (elements?.length ?? 0) + 1;
  const makeEmptyBlock = (type: NewBlockType): ElementItem => {
    const base = { subtitle: "", order: getNextOrder() } as any;
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

  // ------- estilos utilitários responsivos -------
  const outerWrapStyle: React.CSSProperties = {
    borderRadius: 12,
    padding: isMobile ? 10 : 12,
    maxWidth: 1100,
    margin: "0 auto",
    boxSizing: "border-box",
    overflowX: "hidden", // rede de segurança
  };

  const oneColGrid: React.CSSProperties = {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "1fr",
  };

  const headerSplitGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
    alignItems: "start",
    gap: 16,
  };

  const toolbarGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "minmax(220px, 1fr) auto auto",
    gap: 8,
    alignItems: "center",
    marginBottom: 6,
  };

  const fullWidthBtn: React.CSSProperties = {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    color: "#0f172a",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: 13,
    width: isMobile ? "100%" : undefined,
  };

  return (
    <>
      {!open && (
        <button
          onClick={open ? () => setOpen(false) : getClass}
          disabled={loading}
          style={{
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: 11,
            fontWeight: 400,
            color: "#64748b",
            padding: "4px",
            height: 28,
            outline: "none",
            cursor: "pointer",
            display: "block",
            maxWidth: 100,
          }}
        >
          {loading ? "Carregando..." : open ? "Fechar editor" : buttonText}
        </button>
      )}

      {open && (
        <div aria-label="Editor de aula" style={outerWrapStyle}>
          <h2
            style={{ fontSize: "clamp(14px, 2vw, 16px)", textAlign: "center" }}
          >
            {buttonText}
          </h2>

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
          <div style={{ ...oneColGrid, marginBottom: 12 }}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                alignItems: "center",
              }}
            >
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
                    boxSizing: "border-box",
                  }}
                />
              </div>

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
                    boxSizing: "border-box",
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
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Imagem da aula
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickLessonImage(e.target.files?.[0] || null)}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <small style={{ color: "#0ea5e9" }}>Enviando imagem...</small>
              )}
              {uploadError && (
                <small style={{ color: "#b91c1c" }}>{uploadError}</small>
              )}
              {image && (
                <img
                  src={image}
                  alt="Lesson thumbnail"
                  style={{
                    maxWidth: 240,
                    width: "250px",
                    height: "250px",
                    margin: "auto",
                    display: "block",
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              {image && (
                <button
                  onClick={() => {
                    setImage("");
                  }}
                >
                  Remover imagem
                </button>
              )}
            </div>
          </div>

          {/* Conteúdo da Aula */}
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            <h1
              style={{
                fontSize: "clamp(18px, 3.2vw, 22px)",
                textAlign: "center",
                color: "#0f172a",
                margin: "8px 0",
              }}
            >
              Conteúdo da Aula
            </h1>

            {/* Toolbar de adicionar bloco */}
            <div style={toolbarGrid}>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as NewBlockType)}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                  background: "white",
                  color: "#0f172a",
                  width: "100%",
                  boxSizing: "border-box",
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
                style={fullWidthBtn}
                title="Adicionar no início"
              >
                + Adicionar no início
              </button>

              <button
                onClick={() => addBlock("end")}
                style={{
                  ...fullWidthBtn,
                  backgroundColor: partnerColor(),
                  color: "white",
                  fontWeight: 600,
                }}
                title="Adicionar ao final"
              >
                + Adicionar ao final
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
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
                        studentId={studentId}
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
                } else if (el?.type === "images") {
                  return (
                    <div key={idx}>
                      <ImagesEditor
                        value={el as ImagesBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                        headers={headers}
                      />
                    </div>
                  );
                } else if (el?.type === "audio") {
                  return (
                    <div key={idx}>
                      <AudioAndTextEditor
                        value={el as AudioBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                        headers={headers}
                      />
                    </div>
                  );
                } else if (el?.type === "dialogue") {
                  return (
                    <div key={idx}>
                      <DialogueEditor
                        value={el as DialogueBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                } else if (el?.type === "selectexercise") {
                  return (
                    <div key={idx}>
                      <SelectExerciseEditor
                        value={el as SelectExerciseBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                      />
                    </div>
                  );
                } else if (el?.type === "explanation") {
                  return (
                    <div key={idx}>
                      <ExplanationEditor
                        value={el as ExplanationBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                        headers={headers}
                      />
                    </div>
                  );
                } else if (el?.type === "singleimages") {
                  return (
                    <div key={idx}>
                      <SingleImagesEditor
                        value={el as SingleImagesBlock}
                        onChange={(next) => updateElementAt(idx, next)}
                        onRemove={() => removeElementAt(idx)}
                        onMoveUp={() => moveElementUp(idx)}
                        onMoveDown={() => moveElementDown(idx)}
                        headers={headers}
                      />
                    </div>
                  );
                }
                return <></>;
              })}
            </div>
          </div>

          {/* Ações */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              justifyContent: isMobile ? "stretch" : "flex-end",
              marginTop: 16,
            }}
          >
            <DeleteClassButton
              classId={classId}
              headers={headers} // se precisar de Authorization
              onDeleted={() => {
                window.location.href = `/teaching-materials/${
                  lesson?.courseId || ""
                }`;
              }}
            />
            <button
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
              style={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                color: "#0f172a",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 13,
                width: isMobile ? "100%" : undefined,
              }}
              aria-label="Fechar"
              title="Fechar"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                borderRadius: 8,
                backgroundColor: partnerColor(),
                color: "white",
                padding: "8px 12px",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                width: isMobile ? "100%" : undefined,
              }}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
