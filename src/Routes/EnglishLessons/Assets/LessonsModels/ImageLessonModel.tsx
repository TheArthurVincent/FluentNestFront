import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import axios from "axios";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { Tooltip } from "@mui/material";

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
  element: { images?: ImageItem[] } | any;
  id?: string;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
}

/** Codifica APENAS itens que dão problema em <img> e CSS: parênteses e espaços */
const sanitizeUrlForImg = (u: string): string =>
  u.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20");

/** Data URI de fallback */
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
}: ImageLessonModelProps) {
  const actualHeaders = (headers as any) || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());

  const addNewCardsInverted = async (
    frontText: string,
    backText: string,
    img: string,
    languages: Langs | null
  ) => {
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
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${studentId}`,
        { newCards },
        { headers: actualHeaders }
      );
      const showThis =
        `${response?.data?.addedNewFlashcards ?? ""}` +
        `${response?.data?.invalidNewCards ?? ""}`;
      notifyAlert(showThis || "Enviado.", "green");
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    }
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

  const resolveImgUrl = (item: ImageItem): string => {
    const raw = item.img || item.image || item.url || "";
    return raw ? sanitizeUrlForImg(raw) : "";
  };

  const images: ImageItem[] = Array.isArray(element?.images)
    ? element.images
    : [];

  if (!images.length) {
    return (
      <div style={{ padding: 8, opacity: 0.8 }}>
        Nenhuma imagem para exibir.
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 10,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {images.map((image, i) => {
          const url = resolveImgUrl(image);
          const label = image.english ?? image.text ?? "";
          const english = image.english ?? image.text ?? "";
          const portuguese = image.portuguese ?? "";

          // Escolhe um src final já com fallback imediato quando não houver URL
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
              {/* Imagem com onError para fallback */}
              <div style={{ position: "absolute", inset: 0 }}>
                <img
                  src={image.img || image.image || image.url || ""}
                  alt={label || `image-${i}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      fallbackSvgDataUri();
                  }}
                />
                {/* Gradiente para legibilidade dos botões */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 0.09) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.09) 100%)",
                  }}
                />
              </div>

              {/* Barra superior: áudio e + / check */}
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
                      handleSpeak(image);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      border: "none",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 14,
                      textShadow: "0 0 3px #555",
                    }}
                    aria-label="Ouvir texto"
                  >
                    <i className="fa fa-volume-up" />
                  </button>
                </Tooltip>

                {!clickedButtons.has(i) ? (
                  <Tooltip title="Adicionar aos flashcards">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const imgUrl = resolveImgUrl(image);
                        if (!english || !portuguese) {
                          notifyAlert(
                            "Para criar o flashcard invertido, preciso de 'english' e 'portuguese' no item."
                          );
                          return;
                        }
                        addNewCardsInverted(
                          english,
                          portuguese,
                          imgUrl || "",
                          image.languages ?? null
                        );
                        setClickedButtons((prev) => {
                          const next = new Set(prev);
                          next.add(i);
                          return next;
                        });
                      }}
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "none",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 16,
                        textShadow: "0 0 3px #555",
                      }}
                      aria-label="Adicionar aos flashcards"
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
                    aria-label="Adicionado"
                  >
                    <i className="fa fa-check" />
                  </div>
                )}
              </div>

              {/* Botão inferior com o nome (agora realmente fala ao clicar) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSpeak(image)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
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
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-label={`Falar: ${label || "—"}`}
              >
                {label || "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
