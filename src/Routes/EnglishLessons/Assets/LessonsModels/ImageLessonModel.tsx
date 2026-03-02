import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import axios from "axios";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { Tooltip } from "@mui/material";
import ImageToWordExercise, {
  defaultLabels as imageToWordDefaultLabels,
} from "../../Exercises/Exercises/ImageToWordExercise";
import WordToImageExercise, {
  defaultLabels as wordToImageDefaultLabels,
} from "../../Exercises/Exercises/WordToImageExercise";

type Langs = { language1: string; language2: string };

type ImageItem = {
  img?: string;
  image?: string;
  url?: string;
  text?: string;
  english?: string;
  portuguese?: string;
  languages?: Langs;
};

interface ImageLessonModelProps {
  headers: MyHeadersType | null;
  element: { images?: ImageItem[]; courseId?: string; language?: string } | any;
  id?: string;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
  studentsIds?: string[];

  // para registrar /exercise-done/:courseId
  courseId?: string;
  language?: string;
  exerciseScore?: (points: number, description?: string, id?: string) => void;
}

const sanitizeUrlForImg = (u: string): string =>
  u.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20");

const fallbackSvgDataUri = (txt = "Imagem indisponível") => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <rect width='100%' height='100%' fill='#eaeaea'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#777' font-size='12' font-family='Arial'>${txt}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function ImageLessonModel({
  headers,
  element,
  studentId,
  mainTag,
  selectedVoice,
  studentsIds,
  courseId,
  language,
  exerciseScore,
}: ImageLessonModelProps) {
  const actualHeaders = (headers as any) || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Modal + Tabs (exercícios)
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"imageToWord" | "wordToImage">(
    "imageToWord",
  );

  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const images: ImageItem[] = useMemo(() => {
    return Array.isArray(element?.images) ? element.images : [];
  }, [element?.images]);

  useEffect(() => {
    setClickedButtons(new Set());
    setLoading(false);
    setDone(false);
  }, [element?.images]);

  const getTargetIds = (): string[] => {
    if (
      permissions !== "student" &&
      Array.isArray(studentsIds) &&
      studentsIds.length > 0
    ) {
      return studentsIds;
    }
    return studentId ? [studentId] : [];
  };

  const resolveImgUrl = (item: ImageItem): string => {
    const raw = item.img || item.image || item.url || "";
    return raw ? sanitizeUrlForImg(raw) : "";
  };

  const handleSpeak = (item: ImageItem) => {
    const toSpeak = item.english ?? item.text ?? "";
    if (!toSpeak) {
      notifyAlert("Sem texto para ler.");
      return;
    }
    const lang = item.languages?.language1 ?? "en";
    readText(toSpeak, true, lang, selectedVoice);
  };

  const addNewCardsInverted = async (
    frontText: string,
    backText: string,
    img: string,
    languages: Langs | null,
  ) => {
    const targetIds = getTargetIds();
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    const newCards = [
      {
        back: {
          text: frontText,
          language: languages ? languages.language1 : "en",
        },
        front: {
          text: backText,
          language: languages ? languages.language2 : "pt",
        },
        img,
        tags: [mainTag || ""],
      },
    ];

    try {
      const messages: string[] = [];

      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response?.data?.addedNewFlashcards ?? ""}` +
          `${response?.data?.invalidNewCards ?? ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(messages.join(" | ") || "Enviado.", "green");
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const addAllCards = async () => {
    if (loading) return;

    const targetIds = getTargetIds();
    if (!images.length) {
      notifyAlert("Nenhuma imagem para adicionar.", "orange");
      return;
    }
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    const newCards = images
      .map((it) => {
        const english = (it.english ?? it.text ?? "").trim();
        const portuguese = (it.portuguese ?? "").trim();
        const imgUrl = resolveImgUrl(it);

        return {
          back: {
            text: english,
            language: it.languages ? it.languages.language1 : "en",
          },
          front: {
            text: portuguese,
            language: it.languages ? it.languages.language2 : "pt",
          },
          img: imgUrl || "",
          tags: [mainTag || ""],
          __valid: Boolean(english && portuguese),
        };
      })
      .filter((c: any) => c.__valid)
      .map(({ __valid, ...rest }: any) => rest);

    if (!newCards.length) {
      notifyAlert(
        "Para criar os flashcards invertidos, preciso de 'english' e 'portuguese' nos itens.",
        "orange",
      );
      return;
    }

    setLoading(true);
    try {
      const messages: string[] = [];

      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response?.data?.addedNewFlashcards ?? ""}` +
          `${response?.data?.invalidNewCards ?? ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(messages.join(" | ") || "Enviado.", "green");
      setClickedButtons(new Set(images.map((_, idx) => idx)));
      setDone(true);
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

  // Pool para os exercícios (shape: { img, english/portuguese/text })
  const exerciseImages = useMemo(() => {
    return (Array.isArray(images) ? images : [])
      .map((it) => {
        const img = resolveImgUrl(it);
        return {
          img,
          english: (it.english ?? it.text ?? "").trim(),
          portuguese: (it.portuguese ?? "").trim(),
          text: (it.text ?? "").trim(),
        };
      })
      .filter((it) => it.img && (it.english || it.portuguese || it.text));
  }, [images]);

  const effectiveCourseId = courseId || element?.courseId;
  const effectiveLanguage = (language || element?.language || "en") as string;

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? "#111" : "#E5E7EB"}`,
    background: active ? "#111" : "#FFFFFF",
    color: active ? "#fff" : "#111827",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  });

  if (!images.length) {
    return (
      <div style={{ padding: 8, opacity: 0.8 }}>
        Nenhuma imagem para exibir.
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          gap: 8,
        }}
      >
        {/* {!done && (
          <button
            onClick={addAllCards}
            disabled={loading}
            style={{
              border: "1px solid #e3e6ea",
              background: "#fff",
              color: loading ? "#ccc" : "#111",
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Adding..." : "Add all"}
          </button>
        )} */}

        {/* Abrir exercícios */}
        <button
          onClick={() => setShowExercisesModal(true)}
          style={{
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Exercícios
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 10,
          alignItems: "center",
          justifyItems: "center",
          opacity: loading ? 0.9 : 1,
        }}
      >
        {images.map((image, i) => {
          const url = resolveImgUrl(image);
          const label = image.english ?? image.text ?? "";
          const english = (image.english ?? image.text ?? "").trim();
          const portuguese = (image.portuguese ?? "").trim();
          const finalSrc = url || fallbackSvgDataUri();

          return (
            <div
              key={i}
              style={{
                width: 200,
                height: 200,
                borderRadius: 6,
                padding: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <img
                  src={finalSrc}
                  alt={label || `image-${i}`}
                  loading="lazy"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      fallbackSvgDataUri();
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 0.09) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.09) 100%)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Ouvir texto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (loading) return;
                      handleSpeak(image);
                    }}
                    disabled={loading}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      border: "none",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: 14,
                      textShadow: "0 0 3px #555",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    <i className="fa fa-volume-up" />
                  </button>
                </Tooltip>

                {!clickedButtons.has(i) ? (
                  <Tooltip title="Adicionar aos flashcards">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (loading) return;

                        const imgUrl = resolveImgUrl(image);
                        if (!english || !portuguese) {
                          notifyAlert(
                            "Para criar o flashcard invertido, preciso de 'english' e 'portuguese' no item.",
                            "orange",
                          );
                          return;
                        }

                        addNewCardsInverted(
                          english,
                          portuguese,
                          imgUrl || "",
                          image.languages ?? null,
                        );

                        setClickedButtons((prev) => {
                          const next = new Set(prev);
                          next.add(i);
                          return next;
                        });
                      }}
                      disabled={loading}
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "none",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 14,
                        textShadow: "0 0 3px #555",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      <i className="fa fa-plus" />
                    </button>
                  </Tooltip>
                ) : (
                  <div
                    style={{
                      color: "white",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textShadow: "0 0 3px #555",
                    }}
                  >
                    <i className="fa fa-check" />
                  </div>
                )}
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (loading) return;
                  handleSpeak(image);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (loading) return;
                    handleSpeak(image);
                  }
                }}
                style={{
                  position: "relative",
                  zIndex: 2,
                  color: "#fff",
                  backgroundColor: "#00000095",
                  padding: "6px",
                  borderRadius: 4,
                  textAlign: "center",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  textShadow: "0 0 3px #555",
                  cursor: loading ? "not-allowed" : "pointer",
                  userSelect: "none",
                  opacity: loading ? 0.7 : 1,
                }}
                aria-label={`Falar: ${label || "—"}`}
              >
                {label || "—"}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DOS EXERCÍCIOS (2 tabs) */}
      {showExercisesModal &&
        ReactDOM.createPortal(
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.90)",
                zIndex: 999,
              }}
              onClick={() => setShowExercisesModal(false)}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
                width: "92vw",
                maxWidth: 980,
                maxHeight: "88vh",
                padding: 12,
                zIndex: 1000,
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  gap: 10,
                }}
              >
                <div
                  style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}
                >
                  Exercícios de Imagem
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    style={tabBtn(activeTab === "imageToWord")}
                    onClick={() => setActiveTab("imageToWord")}
                  >
                    Imagem {"> >"} Palavra
                  </button>
                  <button
                    style={tabBtn(activeTab === "wordToImage")}
                    onClick={() => setActiveTab("wordToImage")}
                  >
                    Palavra {"> >"} Imagem
                  </button>

                  <button
                    onClick={() => setShowExercisesModal(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 18,
                      lineHeight: 1,
                      marginLeft: 4,
                    }}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                </div>
              </div>

              {activeTab === "imageToWord" && (
                <ImageToWordExercise
                  images={exerciseImages}
                  labels={imageToWordDefaultLabels}
                  studentId={studentId}
                  courseId={effectiveCourseId}
                  selectedVoice={selectedVoice}
                  language={effectiveLanguage}
                  exerciseScore={(points, desc) => {
                    exerciseScore?.(
                      points,
                      desc || "ImageToWord",
                      element?._id || element?.id,
                    );
                  }}
                />
              )}

              {activeTab === "wordToImage" && (
                <WordToImageExercise
                  images={exerciseImages}
                  labels={wordToImageDefaultLabels}
                  studentId={studentId}
                  courseId={effectiveCourseId}
                  exerciseScore={(points, desc) => {
                    exerciseScore?.(
                      points,
                      desc || "WordToImage",
                      element?._id || element?.id,
                    );
                  }}
                />
              )}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
