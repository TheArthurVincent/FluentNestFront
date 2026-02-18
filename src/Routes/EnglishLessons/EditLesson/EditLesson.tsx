import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
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
import { notifyAlert } from "../Assets/Functions/FunctionLessons";

// NOVO: Modal de geração (IA)
import GenerateEVSModal from "./AIGenerator/AIGeneratorAll";

type ElementBase = {
  subtitle?: string;
  grid?: number;
};

type ElementItem =
  | (ElementBase & { type: "video"; video?: string })
  | (ElementBase & { type: "sentences" | "vocabulary"; sentences: Array<any> })
  | (ElementBase & { type: "exercise"; items: string[] })
  | (ElementBase & { type: "images"; images: ImageEntry[] })
  | (ElementBase & {
      type: "audio";
      text: string;
      link: string;
      image?: string;
    })
  | (ElementBase & { type: "dialogue"; dialogue: string[] })
  | (ElementBase & {
      type: "selectexercise";
      options: SelectExerciseBlock["options"];
    })
  | (ElementBase & { type: "singleimages"; images: string[] })
  | ExplanationBlock
  | Record<string, any>;

interface ClassDetails {
  courseId: string;
  description: string;
  elements: ElementItem[];
  image: string;
  module: string;
  moduleId?: string;
  order: number;
  title?: string;
  tags?: string[];
  language?: string;
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

function ModalPortal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(children, document.body);
}

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

  // Modal principal
  const [open, setOpen] = useState(false);

  // NOVO: modal de IA separado (não abre automaticamente)
  const [openAIGenerator, setOpenAIGenerator] = useState(false);

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
  const [isValid] = useState(true);

  const [loadingTitle, setLoadingTitle] = useState(false);

  // idioma da aula (usado no payload)
  const [theLanguage, setTheLanguage] = useState<string>("en");

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========= MODAL: trava scroll + fecha ESC =========
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // se o modal da IA estiver aberto, fecha ele primeiro
        if (openAIGenerator) {
          setOpenAIGenerator(false);
          return;
        }
        closeModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openAIGenerator]);

  const closeModal = () => {
    setOpen(false);
    setOpenAIGenerator(false);
    setSeeEdit?.(false);
  };

  const sanitizeElements = (arr: any[]): ElementItem[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map((el: any) => {
      const { order: _ignored, _id: _ignoredId, ...rest } = el || {};
      return rest as ElementItem;
    });
  };

  // ===================== IA: TÍTULO =====================
  const handleTitle = async () => {
    setLoadingTitle(true);
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-title-class/${myId}`,
          {
            elements: elements || {},
            language: language || "en",
            studentId: studentId || "",
          },
          { headers: headers as any },
        );
        setTitle(response.data.titleAdapted);
      } catch (err) {
        setLoadingTitle(false);
        notifyAlert("Erro", partnerColor());
        // eslint-disable-next-line no-console
        console.log(err, "Erro");
      } finally {
        setLoadingTitle(false);
      }
    } else {
      setLoadingTitle(false);
    }
  };

  // ===================== IA: DESCRIÇÃO =====================
  const handleDescription = async () => {
    setLoadingTitle(true);
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description-class/${myId}`,
          {
            elements: elements || {},
            language: language || "en",
            studentId: studentId || "",
          },
          { headers: headers as any },
        );
        setDescription(response.data.descriptionAdapted);
      } catch (err) {
        notifyAlert("Erro", partnerColor());
        // eslint-disable-next-line no-console
        console.log(err, "Erro");
      } finally {
        setLoadingTitle(false);
      }
    } else {
      setLoadingTitle(false);
    }
  };

  // ===================== CARREGAR AULA =====================
  const getClass = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers },
      );

      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) throw new Error("Resposta sem dados de aula (classDetails).");

      const sanitizedElements = sanitizeElements(data.elements);

      setLesson(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setOrder(Number(data.order ?? 0));
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setElements(sanitizedElements);
      setTheLanguage(data.language || language || "en");

      setOpen(true);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Erro ao obter aula. Verifique o ID e as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  // Recarrega se change sinaliza atualização (mantém modal aberto)
  useEffect(() => {
    if (!open) return;
    if (!classId) return;
    if (change === undefined) return;
    getClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  // ===================== SALVAR AULA =====================
  const handleSave = async () => {
    if (!lesson) return;
    if (!isValid) {
      alert("Por favor, corrija os erros nos elementos antes de salvar.");
      return;
    }

    setSaving(true);
    setError(null);

    const sanitizedElements = sanitizeElements(elements as any);

    const payload: ClassDetails = {
      ...lesson,
      title,
      description,
      language: theLanguage,
      image,
      order: Number(order),
      tags,
      elements: sanitizedElements,
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/class-edit/${classId}`,
        payload,
        { headers },
      );

      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;

      const updatedSanitizedElements = sanitizeElements(updated.elements);

      setLesson(updated);
      if (updated?.image) setImage(updated.image);
      setTitle(updated?.title ?? title);
      setDescription(updated?.description ?? description);
      setTags(Array.isArray(updated?.tags) ? updated.tags : tags);
      setElements(updatedSanitizedElements);

      onUpdated?.(updated);

      window.location.reload();
    } catch (err: any) {
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
  const getSubtitle = (type: string, lang: string) => {
    const subtitles: Record<string, any> = {
      singleimages: {
        pt: "Imagens",
        es: "Imágenes",
        fr: "Images",
        en: "Images",
      },
      sentences: { pt: "Frases", es: "Frases", fr: "Phrases", en: "Sentences" },
      vocabulary: {
        pt: "Vocabulário",
        es: "Vocabulario",
        fr: "Vocabulaire",
        en: "Vocabulary",
      },
      video: { pt: "Vídeo", es: "Video", fr: "Vidéo", en: "Video" },
      exercise: {
        pt: "Exercícios",
        es: "Ejercicios",
        fr: "Exercices",
        en: "Exercises",
      },
      images: { pt: "Imagens", es: "Imágenes", fr: "Images", en: "Images" },
      audio: { pt: "Texto", es: "Texto", fr: "Texte", en: "Text" },
      dialogue: {
        pt: "Diálogo",
        es: "Diálogo",
        fr: "Dialogue",
        en: "Dialogue",
      },
      selectexercise: {
        pt: "Exercício de Seleção",
        es: "Ejercicio de Selección",
        fr: "Exercice de Sélection",
        en: "Select Exercise",
      },
      explanation: {
        pt: "Explicação",
        es: "Explicación",
        fr: "Explication",
        en: "Explanation",
      },
    };

    return subtitles[type]?.[lang] || subtitles[type]?.en || "";
  };

  const makeEmptyBlock = (type: NewBlockType): ElementItem => {
    const base: any = { subtitle: "" };

    switch (type) {
      case "singleimages":
        return {
          ...base,
          type: "singleimages",
          images: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "sentences":
        return {
          ...base,
          type: "sentences",
          sentences: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "vocabulary":
        return {
          ...base,
          type: "vocabulary",
          sentences: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "video":
        return {
          ...base,
          type: "video",
          video: "",
          subtitle: getSubtitle(type, theLanguage),
        };

      case "exercise":
        return {
          ...base,
          type: "exercise",
          items: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "images":
        return {
          ...base,
          type: "images",
          images: [] as ImageEntry[],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "audio":
        return {
          ...base,
          type: "audio",
          text: "",
          link: "",
          image: "",
          subtitle: getSubtitle(type, theLanguage),
        };

      case "dialogue":
        return {
          ...base,
          type: "dialogue",
          dialogue: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "selectexercise":
        return {
          ...base,
          type: "selectexercise",
          options: [],
          subtitle: getSubtitle(type, theLanguage),
        };

      case "explanation":
        return {
          ...base,
          type: "explanation",
          subtitle: getSubtitle(type, theLanguage),
          explanation: [{ image: null, title: "", list: [""] }],
        } as ExplanationBlock;

      default:
        return base as any;
    }
  };

  const addBlock = (pos: "start" | "end" = "end") => {
    const block = makeEmptyBlock(newType);
    setElements((prev) =>
      pos === "start" ? [block, ...prev] : [...prev, block],
    );
  };

  // ===================== Import de elementos =====================
  const handleImportChange = (info: {
    mode: "one" | "all";
    fromClassId: string;
    fromTitle: string;
    elements: any[];
  }) => {
    const { elements: imported } = info;

    setElements((prev) => {
      const cleanImported: ElementItem[] = (imported || []).map(
        (plain: any) => {
          const { _id, order, ...rest } = plain;
          return rest as ElementItem;
        },
      );

      return [...prev, ...cleanImported];
    });
  };

  // ===================== ESTILOS BASE =====================
  const outerWrapStyle: React.CSSProperties = useMemo(
    () => ({
      width: "98%",
      margin: "0 auto",
      boxSizing: "border-box",
      borderRadius: 12,
    }),
    [],
  );

  const sectionCard: React.CSSProperties = useMemo(
    () => ({
      boxSizing: "border-box",
    }),
    [],
  );

  const labelStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      color: "#334155",
      marginBottom: 4,
    }),
    [],
  );

  const inputBase: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: 8,
      fontSize: 13,
      boxSizing: "border-box",
    }),
    [],
  );

  const fullWidthButton: React.CSSProperties = useMemo(
    () => ({
      borderRadius: 8,
      border: "1px solid #e2e8f0",
      color: "#0f172a",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: 13,
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#f9fafb",
    }),
    [],
  );

  const primaryButton: React.CSSProperties = useMemo(
    () => ({
      ...fullWidthButton,
      backgroundColor: partnerColor(),
      color: "white",
      fontWeight: 600,
      border: "none",
    }),
    [fullWidthButton],
  );

  const modalBackdropStyle: React.CSSProperties = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      background: "rgba(2, 6, 23, 0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? 10 : 20,
      zIndex: 999999,
    }),
    [isMobile],
  );

  const modalPanelStyle: React.CSSProperties = useMemo(
    () => ({
      width: "min(1100px, 100%)",
      maxHeight: "92vh",
      overflow: "auto",
      background: "white",
      borderRadius: 14,
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      border: "1px solid rgba(226, 232, 240, 0.9)",
    }),
    [],
  );

  const modalHeaderStyle: React.CSSProperties = useMemo(
    () => ({
      position: "sticky",
      top: 0,
      zIndex: 2,
      background: "white",
      borderBottom: "1px solid #e2e8f0",
      padding: isMobile ? "10px 12px" : "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    }),
    [isMobile],
  );

  const modalCloseButtonStyle: React.CSSProperties = useMemo(
    () => ({
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      background: "#fff",
      padding: "8px 10px",
      cursor: "pointer",
      fontSize: 12,
    }),
    [],
  );

  return (
    <>
      {!open && (
        <button
          onClick={getClass}
          disabled={loading}
          style={{
            borderRadius: 6,
            width: "150px",
            backgroundColor: partnerColor(),
            color: "#fff",
            fontSize: 12,
            fontWeight: 400,
            padding: "6px 10px",
            height: 18,
            outline: "none",
            cursor: "pointer",
            display: "block",
          }}
        >
          {loading ? "Carregando..." : buttonText || "Adaptar Conteúdo"}
        </button>
      )}

      <ModalPortal open={open}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={buttonText || "Adaptar Conteúdo"}
          style={modalBackdropStyle}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div style={modalPanelStyle} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <strong style={{ fontSize: 14, color: "#0f172a" }}>
                  {buttonText || "Adaptar Conteúdo"}
                </strong>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  ESC fecha • Clique fora fecha
                </span>
              </div>

              <button
                onClick={closeModal}
                style={modalCloseButtonStyle}
                title="Fechar"
              >
                X
              </button>
            </div>

            <div style={{ padding: isMobile ? 10 : 14 }}>
              <div aria-label="Editor de aula" style={outerWrapStyle}>
                {error && (
                  <div
                    style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      padding: 8,
                      borderRadius: 8,
                      marginBottom: 10,
                      fontSize: 12,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* CABEÇALHO E METADADOS */}
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
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          disabled={loadingTitle}
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Ex.: Business Essentials — Vocabulary & Usage"
                          style={inputBase}
                        />
                        <button
                          onClick={handleTitle}
                          style={{
                            width: 100,
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          AI -2
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={labelStyle}>Language</div>
                      <select
                        value={theLanguage}
                        onChange={(e) => {
                          const lang = e.target.value;
                          setTheLanguage(lang);
                          setLesson((prev) =>
                            prev ? { ...prev, language: lang } : prev,
                          );
                        }}
                        style={{
                          ...inputBase,
                          background: "white",
                          paddingRight: 24,
                        }}
                      >
                        <option value="en">English (en)</option>
                        <option value="es">Spanish (es)</option>
                        <option value="fr">French (fr)</option>
                        <option value="pt">Portuguese (pt)</option>
                      </select>
                    </div>
                  </div>

                  {!fetchEventData && (
                    <TagsEditor
                      value={tags}
                      onChange={setTags}
                      helperText="Pressione Enter ou vírgula para adicionar. Clique no × para remover."
                    />
                  )}

                  <div style={{ marginTop: 10 }}>
                    <div style={labelStyle}>Description</div>
                    <textarea
                      disabled={loadingTitle}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Descrição da aula"
                      style={{ ...inputBase, resize: "vertical" }}
                    />
                    <button
                      onClick={handleDescription}
                      style={{
                        marginTop: 8,
                        width: 100,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      AI -2
                    </button>
                  </div>

                  {!fetchEventData && (
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
                        <small style={{ color: "#0ea5e9" }}>
                          Enviando imagem...
                        </small>
                      )}
                      {uploadError && (
                        <small style={{ color: "#b91c1c" }}>
                          {uploadError}
                        </small>
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
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
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
                  )}
                </div>

                {/* TOOLBAR */}
                <div style={{ margin: "auto", display: "inline" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => addBlock("start")}
                      style={{ ...fullWidthButton, maxWidth: 100 }}
                      title="Adicionar no início"
                    >
                      + Início
                    </button>

                    <select
                      value={newType}
                      onChange={(e) =>
                        setNewType(e.target.value as NewBlockType)
                      }
                      style={{
                        ...inputBase,
                        background: "white",
                        maxWidth: 160,
                        paddingRight: 24,
                      }}
                      title="Tipo do novo bloco"
                    >
                      <option value="explanation">
                        Explanation/Introduction
                      </option>
                      <option value="vocabulary">Vocabulary</option>
                      <option value="singleimages">Single Images</option>
                      <option value="sentences">Sentences</option>
                      <option value="audio">Text</option>
                      <option value="images">Images (Grid + Audio)</option>
                      <option value="video">Video</option>
                      <option value="exercise">
                        Exercise (List of questions)
                      </option>
                      <option value="dialogue">Dialogue</option>
                      <option value="selectexercise">Select Exercise</option>
                    </select>

                    <button
                      onClick={() => addBlock("end")}
                      style={{ ...primaryButton, maxWidth: 100 }}
                      title="Adicionar ao final"
                    >
                      + Final
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 20,
                    marginBottom: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <ImportElementsEditor
                    lessonId={classId}
                    studentId={studentId}
                    setTheLanguage={setTheLanguage}
                    theLanguage={theLanguage}
                    headers={headers}
                    onChange={handleImportChange}
                    fetchEventData={fetchEventData}
                  />
                  <button
                    onClick={() => setOpenAIGenerator(true)}
                    style={{ ...fullWidthButton, maxWidth: "fit-content" }}
                    title="Abrir gerador"
                  >
                    Gerar Aula Por IA
                  </button>
                  <GenerateEVSModal
                    visible={openAIGenerator}
                    studentId={studentId}
                    classId={classId}
                    headers={headers}
                    // sem currentTheme: usa o próprio título (ou fallback)
                    theme={title || lesson?.title || ""}
                    // mantém a língua selecionada no modal
                    language1={theLanguage || language || "en"}
                    onClose={() => setOpenAIGenerator(false)}
                    onAppendElements={(newEls: any[]) => {
                      const clean = sanitizeElements(newEls || []);
                      setElements((prev) => [...prev, ...clean]);
                      setOpenAIGenerator(false);
                    }}
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
                            headers={headers}
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
                            language={language}
                            onRemove={() => removeElementAt(idx)}
                            studentId={studentId}
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
                        window.location.href = `/teaching-materials/${lesson?.courseId || ""}`;
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
                    <button onClick={closeModal} style={{ ...fullWidthButton }}>
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
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
}
