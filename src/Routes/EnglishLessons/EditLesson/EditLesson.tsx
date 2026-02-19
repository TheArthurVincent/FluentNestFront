import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const [open, setOpen] = useState(false);
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

  const [theLanguage, setTheLanguage] = useState<string>("en");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const initialSnapshotRef = useRef<string>("");

  // -----------------------------
  // Utils
  // -----------------------------
  const sanitizeElements = (arr: any[]): ElementItem[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map((el: any) => {
      const { order: _ignored, _id: _ignoredId, ...rest } = el || {};
      return rest as ElementItem;
    });
  };

  const buildSnapshot = (data?: {
    title?: string;
    description?: string;
    image?: string;
    order?: number;
    tags?: string[];
    language?: string;
    elements?: any[];
  }) => {
    const snap = {
      title: data?.title ?? "",
      description: data?.description ?? "",
      image: data?.image ?? "",
      order: Number(data?.order ?? 0),
      tags: Array.isArray(data?.tags) ? data?.tags : [],
      language: data?.language ?? "en",
      elements: sanitizeElements(
        Array.isArray(data?.elements) ? data?.elements : [],
      ),
    };
    return JSON.stringify(snap);
  };

  const isDirty = useMemo(() => {
    if (!initialSnapshotRef.current) return false;

    const current = buildSnapshot({
      title,
      description,
      image,
      order,
      tags,
      language: theLanguage,
      elements,
    });

    return current !== initialSnapshotRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, order, tags, theLanguage, elements]);

  const confirmCloseIfDirty = () => {
    if (!isDirty) return true;
    return window.confirm("Você tem alterações não salvas. Fechar sem salvar?");
  };

  const closeModal = () => {
    setOpen(false);
    setOpenAIGenerator(false);
    setSeeEdit?.(false);
  };

  const tryCloseModal = () => {
    if (openAIGenerator) {
      setOpenAIGenerator(false);
      return;
    }
    if (!confirmCloseIfDirty()) return;
    closeModal();
  };

  // -----------------------------
  // Responsive
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------
  // Modal behavior (scroll lock + ESC)
  // -----------------------------
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        tryCloseModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openAIGenerator, isDirty]);

  // beforeunload: alerta ao fechar aba/navegador
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   if (!open) return;

  //   const onBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (!isDirty) return;
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", onBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", onBeforeUnload);
  // }, [open, isDirty]);

  // -----------------------------
  // IA: título e descrição
  // -----------------------------
  const handleTitle = async () => {
    setLoadingTitle(true);

    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (thePermissions !== "superadmin" && thePermissions !== "teacher") {
      setLoadingTitle(false);
      return;
    }

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
      notifyAlert("Erro", partnerColor());
      // eslint-disable-next-line no-console
      console.log(err, "Erro");
    } finally {
      setLoadingTitle(false);
    }
  };

  const handleDescription = async () => {
    setLoadingTitle(true);

    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (thePermissions !== "superadmin" && thePermissions !== "teacher") {
      setLoadingTitle(false);
      return;
    }

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
  };

  // -----------------------------
  // Carregar aula
  // -----------------------------
  const getClass = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        {
          headers,
        },
      );

      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) throw new Error("Resposta sem dados de aula (classDetails).");

      const sanitized = sanitizeElements(data.elements);

      setLesson(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setOrder(Number(data.order ?? 0));
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setElements(sanitized);
      setTheLanguage(data.language || language || "en");

      initialSnapshotRef.current = buildSnapshot({
        title: data.title ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
        order: Number(data.order ?? 0),
        tags: Array.isArray(data.tags) ? data.tags : [],
        language: data.language || language || "en",
        elements: sanitized,
      });

      setOpen(true);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Erro ao obter aula. Verifique o ID e as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  // Recarrega quando change sinaliza atualização (mantém modal aberto)
  useEffect(() => {
    if (!open) return;
    if (!classId) return;
    if (change === undefined) return;
    getClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  // -----------------------------
  // Salvar aula
  // -----------------------------
  const handleSave = async () => {
    if (!lesson) return;

    if (!isValid) {
      alert("Por favor, corrija os erros nos elementos antes de salvar.");
      return;
    }

    setSaving(true);
    setError(null);

    const sanitized = sanitizeElements(elements as any);

    const payload: ClassDetails = {
      ...lesson,
      title,
      description,
      language: theLanguage,
      image,
      order: Number(order),
      tags,
      elements: sanitized,
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/class-edit/${classId}`,
        payload,
        { headers },
      );

      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;

      const updatedSanitized = sanitizeElements(updated.elements);

      setLesson(updated);
      setImage(updated?.image ?? image);
      setTitle(updated?.title ?? title);
      setDescription(updated?.description ?? description);
      setTags(Array.isArray(updated?.tags) ? updated.tags : tags);
      setElements(updatedSanitized);

      initialSnapshotRef.current = buildSnapshot({
        title: updated?.title ?? title,
        description: updated?.description ?? description,
        image: updated?.image ?? image,
        order: Number(updated?.order ?? order),
        tags: Array.isArray(updated?.tags) ? updated.tags : tags,
        language: updated?.language ?? theLanguage,
        elements: updatedSanitized,
      });

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

  // -----------------------------
  // Imagem principal
  // -----------------------------
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

  // -----------------------------
  // Elements helpers
  // -----------------------------
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

  // -----------------------------
  // Novo bloco
  // -----------------------------
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

  // -----------------------------
  // Import de elementos
  // -----------------------------
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

  // -----------------------------
  // Styles
  // -----------------------------
  const outerWrapStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      margin: "0 auto",
      boxSizing: "border-box",
    }),
    [],
  );

  const labelStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      color: "#334155",
      marginBottom: 6,
      fontWeight: 600,
    }),
    [],
  );

  const inputBase: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      boxSizing: "border-box",
      background: "#fff",
      color: "#0f172a",
      outline: "none",
      transition: "box-shadow 0.15s ease, border-color 0.15s ease",
    }),
    [],
  );

  const ghostButton: React.CSSProperties = useMemo(
    () => ({
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      color: "#0f172a",
      padding: "10px 12px",
      cursor: "pointer",
      fontSize: 13,
      boxSizing: "border-box",
      backgroundColor: "#ffffff",
      transition: "transform 0.05s ease, box-shadow 0.15s ease",
      boxShadow: "0 1px 0 rgba(15, 23, 42, 0.04)",
    }),
    [],
  );

  const primaryButton: React.CSSProperties = useMemo(
    () => ({
      ...ghostButton,
      backgroundColor: partnerColor(),
      color: "white",
      fontWeight: 700,
      border: "none",
      boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
    }),
    [ghostButton],
  );

  const subtleCard: React.CSSProperties = useMemo(
    () => ({
      boxSizing: "border-box",
      background: "#ffffff",
      border: "1px solid #eef2f7",
      borderRadius: 14,
      padding: isMobile ? 12 : 14,
      boxShadow: "0 10px 25px rgba(2,6,23,0.05)",
    }),
    [isMobile],
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
      background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
      borderRadius: 16,
      boxShadow: "0 30px 90px rgba(2, 6, 23, 0.35)",
      border: "1px solid rgba(226, 232, 240, 0.9)",
    }),
    [],
  );

  const modalHeaderStyle: React.CSSProperties = useMemo(
    () => ({
      position: "sticky",
      top: 0,
      zIndex: 2,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid #e2e8f0",
      padding: isMobile ? "12px 12px" : "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    }),
    [isMobile],
  );

  const closeBtnStyle: React.CSSProperties = useMemo(
    () => ({
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      background: "#fff",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: 12,
      boxShadow: "0 1px 0 rgba(15, 23, 42, 0.04)",
    }),
    [],
  );

  const topActionRowStyle: React.CSSProperties = useMemo(
    () => ({
      display: "flex",
      gap: 12,
      justifyContent: "center",
      flexWrap: "wrap",
    }),
    [],
  );

  const errorBoxStyle: React.CSSProperties = useMemo(
    () => ({
      background: "#fee2e2",
      color: "#991b1b",
      padding: 10,
      borderRadius: 12,
      marginBottom: 12,
      fontSize: 12,
      border: "1px solid rgba(153, 27, 27, 0.15)",
    }),
    [],
  );

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      {!open && (
        <button
          onClick={getClass}
          disabled={loading}
          style={{
            borderRadius: 10,
            width: "fit-content",
            backgroundColor: partnerColor(),
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            padding: "10px 12px",
            height: 36,
            border: "none",
            outline: "none",
            cursor: loading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
            opacity: loading ? 0.8 : 1,
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
            if (e.target === e.currentTarget) tryCloseModal();
          }}
        >
          <div style={modalPanelStyle} onMouseDown={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <strong style={{ fontSize: 14, color: "#0f172a" }}>
                    {buttonText || "Adaptar Conteúdo"}
                  </strong>

                  {isDirty ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#b45309",
                        background: "rgba(245, 158, 11, 0.10)",
                        border: "1px solid rgba(245, 158, 11, 0.20)",
                        padding: "4px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Alterações não salvas
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#16a34a",
                        background: "rgba(34, 197, 94, 0.10)",
                        border: "1px solid rgba(34, 197, 94, 0.20)",
                        padding: "4px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Salvo
                    </span>
                  )}
                </div>

                <span style={{ fontSize: 12, color: "#64748b" }}>
                  ESC fecha • Clique fora fecha
                </span>
              </div>

              <button
                onClick={tryCloseModal}
                style={closeBtnStyle}
                title="Fechar"
              >
                Fechar
              </button>
            </div>

            <div style={{ padding: isMobile ? 12 : 16 }}>
              <div aria-label="Editor de aula" style={outerWrapStyle}>
                {error && <div style={errorBoxStyle}>{error}</div>}

                {/* METADADOS */}
                <div style={{ ...subtleCard, marginBottom: 12 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "minmax(0, 2fr) minmax(0, 1fr)",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={labelStyle}>Título da aula</div>
                      <div style={{ display: "flex", gap: 10 }}>
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
                          disabled={loadingTitle}
                          style={{
                            ...ghostButton,
                            width: 120,
                            fontSize: 12,
                            fontWeight: 700,
                            opacity: loadingTitle ? 0.7 : 1,
                            cursor: loadingTitle ? "not-allowed" : "pointer",
                          }}
                          title="Gerar título por IA"
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
                          paddingRight: 26,
                          cursor: "pointer",
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
                    <div style={{ marginBottom: 12 }}>
                      <TagsEditor
                        value={tags}
                        onChange={setTags}
                        helperText="Pressione Enter ou vírgula para adicionar. Clique no × para remover."
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <div style={labelStyle}>Description</div>
                    <textarea
                      disabled={loadingTitle}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Descrição da aula"
                      style={{ ...inputBase, resize: "vertical" }}
                    />

                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <button
                        onClick={handleDescription}
                        disabled={loadingTitle}
                        style={{
                          ...ghostButton,
                          width: 120,
                          fontSize: 12,
                          fontWeight: 700,
                          marginTop: 10,
                          opacity: loadingTitle ? 0.7 : 1,
                          cursor: loadingTitle ? "not-allowed" : "pointer",
                        }}
                        title="Gerar descrição por IA"
                      >
                        AI -2
                      </button>
                    </div>
                  </div>

                  {!fetchEventData && (
                    <div>
                      <div style={labelStyle}>Imagem da aula</div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            onPickLessonImage(e.target.files?.[0] || null)
                          }
                          disabled={uploadingImage}
                        />

                        {uploadingImage && (
                          <small style={{ color: "#0ea5e9", fontWeight: 600 }}>
                            Enviando imagem...
                          </small>
                        )}

                        {uploadError && (
                          <small style={{ color: "#b91c1c", fontWeight: 600 }}>
                            {uploadError}
                          </small>
                        )}
                      </div>

                      {image && (
                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <img
                            src={image}
                            alt="Lesson thumbnail"
                            style={{
                              width: isMobile ? "100%" : 260,
                              maxWidth: 320,
                              height: isMobile ? "auto" : 260,
                              objectFit: "cover",
                              borderRadius: 14,
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 20px 40px rgba(2,6,23,0.10)",
                            }}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />

                          <button
                            onClick={() => setImage("")}
                            style={{
                              ...ghostButton,
                              width: "min(220px, 100%)",
                              fontSize: 12,
                              fontWeight: 700,
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
                <div style={{ ...subtleCard, marginBottom: 12 }}>
                  <div style={topActionRowStyle}>
                    <button
                      onClick={() => addBlock("start")}
                      style={{ ...ghostButton, width: 140, fontWeight: 700 }}
                      title="Adicionar no início"
                    >
                      Adicionar no início
                    </button>

                    <select
                      value={newType}
                      onChange={(e) =>
                        setNewType(e.target.value as NewBlockType)
                      }
                      style={{
                        ...inputBase,
                        background: "white",
                        maxWidth: 220,
                        paddingRight: 26,
                        cursor: "pointer",
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
                      style={{ ...primaryButton, width: 160 }}
                      title="Adicionar ao final"
                    >
                      Adicionar ao final
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 12,
                      marginTop: 14,
                      flexWrap: "wrap",
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
                      style={{ ...ghostButton, fontWeight: 800 }}
                      title="Abrir gerador"
                    >
                      Gerar aula por IA
                    </button>

                    <GenerateEVSModal
                      visible={openAIGenerator}
                      studentId={studentId}
                      classId={classId}
                      headers={headers}
                      theme={title || lesson?.title || ""}
                      language1={theLanguage || language || "en"}
                      onClose={() => setOpenAIGenerator(false)}
                      onAppendElements={(newEls: any[]) => {
                        const clean = sanitizeElements(newEls || []);
                        setElements((prev) => [...prev, ...clean]);
                        setOpenAIGenerator(false);
                      }}
                    />
                  </div>
                </div>

                {/* CONTEÚDO */}
                <div style={{ ...subtleCard, marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "clamp(16px, 3vw, 18px)",
                        margin: 0,
                        color: "#0f172a",
                      }}
                    >
                      Conteúdo da aula
                    </h3>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
                      {elements.length} bloco(s)
                    </span>
                  </div>

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
                          borderRadius: 14,
                          padding: 16,
                          color: "#64748b",
                          fontSize: 13,
                          textAlign: "center",
                          background: "rgba(148,163,184,0.06)",
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
                    ...subtleCard,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 10,
                    justifyContent: isMobile ? "stretch" : "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
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
                      gap: 10,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <button
                      onClick={tryCloseModal}
                      style={{
                        ...ghostButton,
                        width: isMobile ? "100%" : 160,
                        fontWeight: 800,
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        ...primaryButton,
                        width: isMobile ? "100%" : 160,
                        opacity: saving ? 0.85 : 1,
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
