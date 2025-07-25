// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PptxGenJS from "pptxgenjs";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
  getVideoEmbedUrl,
  onLoggOut,
  pathGenerator,
  Xp,
} from "../../Resources/UniversalComponents";
import { HOne, HTwo } from "../../Resources/Components/RouteBox";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { Link } from "react-router-dom";
import {
  alwaysWhite,
  darkGreyColor,
  partnerColor,
  textTitleFont,
  textGeneralFont,
  logoPartner,
  transparentBlack,
} from "../../Styles/Styles";
import Helmets from "../../Resources/Helmets";
import { ImgLesson } from "./Assets/Functions/EnglishActivities.Styled";
import { IFrameVideoBlog } from "../HomePage/Blog.Styled";
import VideoLessonModel from "./Assets/LessonsModels/VideoLessonModel";
import SentenceLessonModel from "./Assets/LessonsModels/SentenceLessonModel";
import TextLessonModel from "./Assets/LessonsModels/TextLessonModel";
import MultipleTextsLessonModel from "./Assets/LessonsModels/MultipleTextsLessonModel";
import SelectExercise from "./Assets/LessonsModels/MultipleSelectExercise";
import ImageLessonModel from "./Assets/LessonsModels/ImageLessonModel";
import ExerciseLessonModel from "./Assets/LessonsModels/ExerciseLessonModel";
import DialogueLessonModel from "./Assets/LessonsModels/DialogueLessonModel";
import SingleImageLessonModel from "./Assets/LessonsModels/SingleImageLessonModel";
import ListenAndTranslateLessonModel from "./Assets/LessonsModels/ListenAndTranslateLessonModel";
import TextsWithTranslateLessonModel from "./Assets/LessonsModels/TextWithNoAudio";
import SentenceLessonModelSlide from "./Assets/SlideModels/SentenceLessonModelSlide";
import TextLessonModelSlide from "./Assets/SlideModels/TextLessonModelSlide";
import TextsWithTranslateSlideLessonModel from "./Assets/SlideModels/TextWithNoAudio";
import ExerciseLessonModelLesson from "./Assets/LessonsModels/ExerciseLessonModelExercise";
import ImageLessonModelSlide from "./Assets/SlideModels/ImageLessonModelSlide";
import { CircularProgress, TextareaAutosize } from "@mui/material";
import QandALessonModel from "./Assets/LessonsModels/QandALessonModel";
import QandALessonPersonalModel from "./Assets/LessonsModels/QandALessonPersonalModel";
import NoFlashcardsSentenceLessonModel from "./Assets/LessonsModels/NoFlashcardsSentenceLessonModel";
import AudioSoundTrack from "./Assets/LessonsModels/AudioSoundTrack";
import TextAreaLesson from "./Assets/Functions/TextAreaLessons";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import Voice from "../../Resources/Voice";
import { notifyAlert } from "./Assets/Functions/FunctionLessons";
import { isArthurVincent } from "../../App";
const styles = {
  container: {
    maxWidth: "90vw",
    margin: "20px auto",
    padding: "10px",
    borderRadius: "6px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  commentBox: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  userImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
    border: "2px solid #ccc",
  },
  commentContent: {
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    flex: 1,
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  commentText: {
    wordWrap: "break-word",
    overflowWrap: "break-word",
    fontSize: "14px",
    color: "#333",
    marginBottom: "5px",
  },
  answerText: {
    fontSize: "13px",
    color: "#555",
    backgroundColor: "#e9e9e9",
    padding: "5px",
    borderRadius: "4px",
    marginTop: "5px",
  },
  commentDate: {
    fontSize: "12px",
    color: "#777",
    marginTop: "5px",
  },
};
interface EnglishClassCourse2ModelProps {
  headers: MyHeadersType | null;
  classId: any;
  course: any;
  courseTitle: any;
  previousClass: any;
  nextClass: any;
  studentsWhoCompletedIt: any;
  order: number | any;
}

export default function EnglishClassCourse2({
  headers,
  classId,
  studentsWhoCompletedIt,
  previousClass,
  nextClass,
  order,
  courseTitle,
}: EnglishClassCourse2ModelProps) {
  const { UniversalTexts } = useUserContext();

  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [myId, setId] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");
  const [thePicture, setPicture] = useState<string>("");
  const [seeSlides, setSeeSlides] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [theclass, setheClass] = useState<any>({});
  const [classTitle, setClassTitle] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [commentsTrigger, setCommentsTrigger] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const actualHeaders = headers || {};

  const getClass = async () => {
    setLoading(true);
    const user = localStorage.getItem("loggedIn");
    const { id, permissions, picture } = JSON.parse(user || "");
    setPermissions(permissions);
    setPicture(picture);

    if (user) {
      setId(id);
      setStudentID(id);
    }
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers: actualHeaders }
      );

      var clss = response.data.classDetails;
      setClassTitle(response.data.classDetails.title);
      if (response.data.classDetails.studentsWhoCompletedIt.includes(id)) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      setheClass(clss);
      setLoading(false);
      setCommentsTrigger(true);
    } catch (error) {
      console.error(error, "Erro ao obter aulas");
      onLoggOut();
      setLoading(false);
    }
  };

  const getClassNoLoading = async () => {
    const user = localStorage.getItem("loggedIn");
    const { id, permissions } = JSON.parse(user || "");
    setPermissions(permissions);
    if (permissions === "superadmin" || permissions === "teacher") {
      fetchStudents();
    }

    if (user) {
      setId(id);
      setStudentID(id);
    }
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers: actualHeaders }
      );

      var clss = response.data.classDetails;
      setClassTitle(response.data.classDetails.title);
      if (response.data.classDetails.studentsWhoCompletedIt.includes(id)) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      setheClass(clss);
    } catch (error) {
      console.error(error, "Erro ao obter aulas");
    }
  };
  // Função para alternar o estado do switch
  const handleToggle = async (event: any) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/course/${classId}`,
        { studentID },
        { headers: actualHeaders }
      );
      getClassNoLoading();
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  };

  const handleCurrentClass = async () => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn) {
      var loggedInData = JSON.parse(loggedIn);
      loggedInData.lastClassId = classId;
      localStorage.setItem("loggedIn", JSON.stringify(loggedInData));
    }

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handlecurrentclass/${loggedInData.id}`,
        { classId },
        { headers: actualHeaders }
      );
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  };

  // Função para sanitizar texto
  const sanitizeText = (text: string, maxLength: number = 500): string => {
    if (!text) return "";

    // Remover apenas caracteres perigosos, mantendo acentos e caracteres especiais normais
    let cleaned = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ") // Remove caracteres de controle
      .replace(/\s+/g, " ") // Normaliza espaços
      .trim();

    // Limitar o comprimento
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength) + "...";
    }

    return cleaned;
  };

  // Função para limpar HTML
  const cleanHtml = (html: string): string => {
    if (!html) return "";

    // Remover tags HTML
    let cleaned = html.replace(/<[^>]*>/g, "");

    // Decodificar entidades HTML básicas
    cleaned = cleaned
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return cleaned.trim();
  };

  // Função para calcular dimensões proporcionais da imagem
  const calculateImageDimensions = (maxWidth: number, maxHeight: number) => {
    // Definir largura fixa e calcular altura proporcionalmente
    const targetWidth = Math.min(maxWidth, 1.5); // Largura máxima de 1.5

    // Assumir uma proporção padrão width:height (pode ser ajustada)
    const aspectRatio = 1.2; // width é 1.2x maior que height

    // Calcular altura baseada na largura
    const calculatedHeight = targetWidth / aspectRatio;

    // Verificar se a altura calculada não excede o limite
    const finalHeight = Math.min(calculatedHeight, maxHeight);

    // Se a altura foi limitada, recalcular a largura para manter proporção
    const finalWidth =
      finalHeight > calculatedHeight ? targetWidth : finalHeight * aspectRatio;

    return {
      width: Number(Math.min(finalWidth, maxWidth).toFixed(2)),
      height: Number(finalHeight.toFixed(2)),
    };
  };

  // Função para gerar PPT
  const generatePPT = async () => {
    try {
      console.log("🎯 Iniciando geração de PPT...");
      notifyAlert("Gerando PowerPoint...", partnerColor());

      const pptx = new PptxGenJS();

      // Configurações básicas
      pptx.author = "Arvin Education";
      pptx.title = sanitizeText(classTitle || "Aula de Inglês");
      pptx.subject = "Aula de Inglês";

      // Slide de título
      const titleSlide = pptx.addSlide();

      // Título principal centralizado - 40
      const safeTitle = sanitizeText(classTitle || "Aula de Inglês", 100);
      titleSlide.addText(safeTitle, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 1.2,
        fontSize: 36,
        bold: true,
        align: "center",
        color: partnerColor().replace("#", ""),
        fontFace: textTitleFont(),
      });

      // Imagem da aula (quadrado - se houver) - centralizado
      if (theclass.image) {
        try {
          titleSlide.addImage({
            path: theclass.image,
            x: 3.75, // Centralizado (10 - 2.5) / 2 = 3.75
            y: 1.8,
            w: 2.5,
            h: 2.5,
          });
        } catch (imageError) {
          console.log(
            "⚠️ Não foi possível carregar a imagem da aula:",
            imageError
          );
        }
      }

      // Subtítulo centralizado - 20
      const safeSubtitle = sanitizeText(`${courseTitle}`, 60);
      const subtitleY = theclass.image ? 4.2 : 2; // Ajustar posição baseado na presença da imagem
      titleSlide.addText(safeSubtitle, {
        x: 0.5,
        y: subtitleY,
        w: 9,
        h: 0.8,
        fontSize: 18,
        align: "center",
        color: darkGreyColor().replace("#", ""),
        fontFace: textGeneralFont(),
      });

      // Data centralizada - 10
      const dateY = theclass.image ? 4.8 : 2.9; // Ajustar posição baseado na presença da imagem
      titleSlide.addText(`${new Date().toLocaleDateString("pt-BR")}`, {
        x: 0.5,
        y: dateY,
        w: 9,
        h: 0.4,
        fontSize: 10,
        align: "center",
        color: darkGreyColor().replace("#", ""),
        fontFace: textGeneralFont(),
      });

      // Logo do partner - Canto direito pequenininho
      try {
        const logoUrl = logoPartner();
        if (logoUrl) {
          titleSlide.addImage({
            path: logoUrl,
            x: 9, // Canto direito
            y: 0.1, // Topo
            w: 0.8,
            h: 0.4,
          });
        }
      } catch (logoError) {
        console.log("⚠️ Não foi possível carregar o logo:", logoError);
      }

      // Processar elementos da aula
      if (theclass.elements && Array.isArray(theclass.elements)) {
        const sortedElements = theclass.elements.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );
        console.log(`🔄 Processando ${sortedElements.length} elementos...`);

        for (const element of sortedElements) {
          console.log(
            `📄 Processando elemento: ${element.type} - ${
              element.subtitle || "Sem título"
            }`
          );

          // Slide de subtítulo para cada elemento
          if (element.subtitle || element.description) {
            const subtitleSlide = pptx.addSlide();

            // Adicionar borda ao slide
            subtitleSlide.addShape(pptx.ShapeType.rect, {
              x: 0.2,
              y: 0.2,
              w: 9.6,
              h: 5.2,
              fill: { color: "FFFFFF" },
              line: { color: partnerColor().replace("#", ""), width: 4 },
            });

            // Adicionar imagem - primeiro verificar se há imagem do elemento, senão usar da aula
            const imageToUse = element.image || theclass.image;
            if (imageToUse) {
              try {
                subtitleSlide.addImage({
                  path: imageToUse,
                  x: 0.5, // Canto esquerdo
                  y: 4.2, // Parte inferior
                  w: 1,
                  h: 1,
                });
              } catch (imageError) {
                console.log(
                  "⚠️ Não foi possível carregar a imagem:",
                  imageError
                );
              }
            }

            // Título principal centralizado
            if (element.subtitle) {
              const safeSubtitle = sanitizeText(element.subtitle, 100);
              subtitleSlide.addText(safeSubtitle, {
                x: 1,
                y: 2,
                w: 8,
                h: 2,
                fontSize: 36,
                bold: true,
                align: "center",
                color: partnerColor().replace("#", ""),
                fontFace: textTitleFont(),
              });
            }

            // Descrição centralizada (se houver)
            if (element.description) {
              const safeDescription = sanitizeText(element.description, 300);
              subtitleSlide.addText(safeDescription, {
                x: 1,
                y: 4.2,
                w: 8,
                h: 1.5,
                fontSize: 18,
                align: "center",
                color: darkGreyColor().replace("#", ""),
                fontFace: textGeneralFont(),
              });
            }

            // Subtítulo da sessão no canto inferior esquerdo
            const sessionSubtitle = `Sessão: ${element.subtitle || "Conteúdo"}`;
            subtitleSlide.addText(sessionSubtitle, {
              x: imageToUse ? 4 : 1, // Ajustar posição se há imagem
              y: 6.2,
              w: 5,
              h: 0.8,
              fontSize: 14,
              bold: true,
              align: "left",
              color: partnerColor().replace("#", ""),
              fontFace: textGeneralFont(),
            });

            // Logo do partner no canto superior direito (pequeno)
            try {
              const logoUrl = logoPartner();
              if (logoUrl) {
                subtitleSlide.addImage({
                  path: logoUrl,
                  x: 8.5,
                  y: 0.5,
                  w: 0.8,
                  h: 0.6,
                });
              }
            } catch (logoError) {
              console.log("⚠️ Não foi possível carregar o logo:", logoError);
            }
          }

          // Processar diferentes tipos de elementos
          switch (element.type) {
            case "text":
              const textSlide = pptx.addSlide();

              // Conteúdo
              if (element.text) {
                const safeText = sanitizeText(element.text, 800);
                textSlide.addText(safeText, {
                  x: 0.5,
                  y: 1,
                  w: 9,
                  h: 6,
                  fontSize: 16,
                  color: darkGreyColor().replace("#", ""),
                  fontFace: textGeneralFont(),
                });
              }
              break;

            case "sentences":
              if (element.sentences && Array.isArray(element.sentences)) {
                // Dividir as frases em grupos de 2
                const sentenceGroups = [];
                for (let i = 0; i < element.sentences.length; i += 2) {
                  sentenceGroups.push(element.sentences.slice(i, i + 2));
                }

                sentenceGroups.forEach((sentenceGroup, groupIndex) => {
                  const sentencesSlide = pptx.addSlide();

                  // Título
                  const safeSubtitle = sanitizeText(
                    `${element.subtitle || "Frases"}${
                      sentenceGroups.length > 1
                        ? ` (${groupIndex + 1}/${sentenceGroups.length})`
                        : ""
                    }`,
                    100
                  );
                  sentencesSlide.addText(safeSubtitle, {
                    x: 0.5,
                    y: 0.5,
                    w: 9,
                    h: 0.8,
                    fontSize: 24,
                    bold: true,
                    color: partnerColor().replace("#", ""),
                    fontFace: textTitleFont(),
                  });

                  // Frases (máximo 2 por slide)
                  let yPos = 2;
                  sentenceGroup.forEach((sentence) => {
                    if (sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      sentencesSlide.addText(`• ${safeEnglish}`, {
                        x: 0.5,
                        y: yPos,
                        w: 9,
                        h: 0.6,
                        fontSize: 18,
                        bold: true,
                        color: partnerColor().replace("#", ""),
                        fontFace: textGeneralFont(),
                      });

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        sentencesSlide.addText(`  ${safePortuguese}`, {
                          x: 0.5,
                          y: yPos + 0.6,
                          w: 9,
                          h: 0.5,
                          fontSize: 16,
                          color: darkGreyColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                        });
                      }
                      yPos += 1.5;
                    }
                  });
                });
              }
              break;

            case "exercise":
              if (element.items && Array.isArray(element.items)) {
                const exerciseSlide = pptx.addSlide();

                // Exercícios
                let yPos = 1;
                for (const item of element.items.slice(0, 2)) {
                  // Máximo 2 exercícios por slide
                  if (item.question) {
                    const safeQuestion = sanitizeText(item.question, 150);
                    exerciseSlide.addText(`• ${safeQuestion}`, {
                      x: 0.5,
                      y: yPos,
                      w: 9,
                      h: 0.5,
                      fontSize: 16,
                      bold: true,
                      color: partnerColor().replace("#", ""),
                      fontFace: textGeneralFont(),
                    });

                    if (item.options && Array.isArray(item.options)) {
                      for (let i = 0; i < item.options.length && i < 4; i++) {
                        const safeOption = sanitizeText(item.options[i], 100);
                        exerciseSlide.addText(
                          `  ${String.fromCharCode(97 + i)}) ${safeOption}`,
                          {
                            x: 0.8,
                            y: yPos + 0.5 + i * 0.3,
                            w: 8,
                            h: 0.3,
                            fontSize: 14,
                            color: darkGreyColor().replace("#", ""),
                            fontFace: textGeneralFont(),
                          }
                        );
                      }
                    }
                    yPos += 2.5;
                  }
                }
              }
              break;

            case "html":
              const htmlSlide = pptx.addSlide();

              // Remover tags HTML e adicionar como texto limpo
              if (element.text) {
                const cleanText = cleanHtml(element.text);
                const safeText = sanitizeText(cleanText, 800);
                htmlSlide.addText(safeText, {
                  x: 0.5,
                  y: 1,
                  w: 9,
                  h: 6,
                  fontSize: 16,
                  color: darkGreyColor().replace("#", ""),
                  fontFace: textGeneralFont(),
                });
              }
              break;

            case "images":
              if (element.images && Array.isArray(element.images)) {
                const imageSlide = pptx.addSlide();

                // Adicionar imagens
                const maxImages = 4; // Máximo 4 imagens por slide
                const imagesToShow = element.images.slice(0, maxImages);

                imagesToShow.forEach((imageItem, index) => {
                  try {
                    if (imageItem.image) {
                      const positions = [
                        { x: 1, y: 1.5, w: 3.5, h: 2.5 }, // Top left
                        { x: 5.5, y: 1.5, w: 3.5, h: 2.5 }, // Top right
                        { x: 1, y: 4.5, w: 3.5, h: 2.5 }, // Bottom left
                        { x: 5.5, y: 4.5, w: 3.5, h: 2.5 }, // Bottom right
                      ];

                      const pos = positions[index] || positions[0];

                      imageSlide.addImage({
                        path: imageItem.image,
                        x: pos.x,
                        y: pos.y,
                        w: pos.w,
                        h: pos.h,
                      });

                      // Adicionar texto da imagem se houver
                      if (imageItem.text) {
                        const safeImageText = sanitizeText(imageItem.text, 100);
                        imageSlide.addText(safeImageText, {
                          x: pos.x,
                          y: pos.y + pos.h + 0.1,
                          w: pos.w,
                          h: 0.4,
                          fontSize: 12,
                          align: "center",
                          color: darkGreyColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                        });
                      }
                    }
                  } catch (imageError) {
                    console.log("⚠️ Erro ao adicionar imagem:", imageError);
                  }
                });
              }
              break;

            case "audiosoundtrack":
              // Slide para o texto do audiotrack
              if (element.text) {
                const audioTextSlide = pptx.addSlide();

                // Título
                const safeAudioTitle = sanitizeText(
                  element.subtitle || "Audio Content",
                  100
                );
                audioTextSlide.addText(safeAudioTitle, {
                  x: 0.5,
                  y: 0.5,
                  w: 9,
                  h: 0.8,
                  fontSize: 24,
                  bold: true,
                  align: "center",
                  color: partnerColor().replace("#", ""),
                  fontFace: textTitleFont(),
                });

                // Texto do audio limpo de HTML
                const cleanAudioText = cleanHtml(element.text);
                const safeAudioText = sanitizeText(cleanAudioText, 3000);
                audioTextSlide.addText(safeAudioText, {
                  x: 0.8,
                  y: 0.5,
                  w: 9,
                  h: 5.5,
                  fontSize: 16,
                  color: darkGreyColor().replace("#", ""),
                  fontFace: textGeneralFont(),
                });
              }

              // Slide para as sentences do audiotrack (se houver)
              if (element.sentences && Array.isArray(element.sentences)) {
                // Dividir as frases em grupos de 3 para melhor visualização
                const sentenceGroups = [];
                for (let i = 0; i < element.sentences.length; i += 3) {
                  sentenceGroups.push(element.sentences.slice(i, i + 3));
                }

                sentenceGroups.forEach((sentenceGroup, groupIndex) => {
                  const audioSentencesSlide = pptx.addSlide();

                  // Título
                  const safeTitle = sanitizeText(
                    `${element.subtitle || "Audio"} - Frases${
                      sentenceGroups.length > 1
                        ? ` (${groupIndex + 1}/${sentenceGroups.length})`
                        : ""
                    }`,
                    100
                  );
                  audioSentencesSlide.addText(safeTitle, {
                    x: 0.5,
                    y: 0.5,
                    w: 9,
                    h: 0.8,
                    fontSize: 24,
                    bold: true,
                    align: "center",
                    color: partnerColor().replace("#", ""),
                    fontFace: textTitleFont(),
                  });

                  // Frases (máximo 3 por slide)
                  let yPos = 1.5;
                  sentenceGroup.forEach((sentence) => {
                    if (sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      audioSentencesSlide.addText(`🔊 ${safeEnglish}`, {
                        x: 0.5,
                        y: yPos,
                        w: 9,
                        h: 0.6,
                        fontSize: 18,
                        bold: true,
                        color: partnerColor().replace("#", ""),
                        fontFace: textGeneralFont(),
                      });

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        audioSentencesSlide.addText(`   ${safePortuguese}`, {
                          x: 0.5,
                          y: yPos + 0.6,
                          w: 9,
                          h: 0.5,
                          fontSize: 16,
                          fontStyle: "italic",
                          color: darkGreyColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                        });
                      }
                      yPos += 1.4;
                    }
                  });
                });
              }
              break;

            case "exercise":
              if (element.item && Array.isArray(element.item)) {
                // Dividir os itens em grupos de 6 por slide
                const itemGroups = [];
                for (let i = 0; i < element.item.length; i += 6) {
                  itemGroups.push(element.item.slice(i, i + 6));
                }

                itemGroups.forEach((itemGroup, groupIndex) => {
                  const exerciseSlide = pptx.addSlide();

                  // Título
                  const safeExerciseTitle = sanitizeText(
                    `${element.subtitle || "Exercise"}${
                      itemGroups.length > 1
                        ? ` (${groupIndex + 1}/${itemGroups.length})`
                        : ""
                    }`,
                    100
                  );
                  exerciseSlide.addText(safeExerciseTitle, {
                    x: 0.5,
                    y: 0.5,
                    w: 9,
                    h: 0.8,
                    fontSize: 24,
                    bold: true,
                    align: "center",
                    color: partnerColor().replace("#", ""),
                    fontFace: textTitleFont(),
                  });

                  // Lista de exercícios (máximo 6 por slide)
                  let yPos = 1.5;
                  itemGroup.forEach((item, index) => {
                    const itemNumber = groupIndex * 6 + index + 1;
                    const safeItem = sanitizeText(item, 200);
                    exerciseSlide.addText(`${itemNumber}. ${safeItem}`, {
                      x: 0.8,
                      y: yPos,
                      w: 8.2,
                      h: 0.8,
                      fontSize: 16,
                      color: darkGreyColor().replace("#", ""),
                      fontFace: textGeneralFont(),
                    });
                    yPos += 0.8;
                  });
                });
              }
              break;

            default:
              // Suporte para outros tipos de elementos (fallback)
              if (
                [
                  "multipletexts",
                  "selectexercise",
                  "qanda",
                  "personalqanda",
                  "dialogue",
                  "singleimages",
                  "listenandtranslate",
                  "listinenglish",
                  "nfsentences",
                ].includes(element.type)
              ) {
                const genericSlide = pptx.addSlide();

                // Título
                const safeGenericTitle = sanitizeText(
                  element.subtitle || `Elemento: ${element.type}`,
                  100
                );
                genericSlide.addText(safeGenericTitle, {
                  x: 0.5,
                  y: 2,
                  w: 9,
                  h: 1,
                  fontSize: 24,
                  bold: true,
                  align: "center",
                  color: partnerColor().replace("#", ""),
                  fontFace: textTitleFont(),
                });

                // Texto genérico
                const genericText = `Este slide representa um elemento do tipo "${element.type}". \\n\\nEdite este conteúdo conforme necessário.`;
                genericSlide.addText(genericText, {
                  x: 1,
                  y: 4,
                  w: 8,
                  h: 2,
                  fontSize: 18,
                  align: "center",
                  color: darkGreyColor().replace("#", ""),
                  fontFace: textGeneralFont(),
                });
              }
              break;
          }
        }
      }

      console.log("🎯 Gerando arquivo PPT...");

      // Gerar arquivo
      const safeFileName = sanitizeText(classTitle || "aula", 30).replace(
        /\s+/g,
        "_"
      );
      const fileName = `${safeFileName}.pptx`;

      await pptx.writeFile({ fileName });

      console.log("✅ PPT gerado com sucesso!");
      notifyAlert("PowerPoint gerado com sucesso!", "green");
    } catch (error) {
      console.error("❌ Erro ao gerar PPT:", error);
      notifyAlert("Erro ao gerar PowerPoint. Tente novamente.", "red");
    }
  };

  const verifyCheck = async () => {
    if (
      theclass &&
      Array.isArray(theclass.studentsWhoCompletedIt) &&
      theclass.studentsWhoCompletedIt.length > 0 &&
      theclass.studentsWhoCompletedIt.includes(studentID)
    ) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleCurrentClass();
    }, 5000);
  }, [studentID]);

  useEffect(() => {
    verifyCheck();
  }, [theclass]);

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      fetchStudents();
    }
  }, [commentsTrigger]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Escape") {
      setSeeSlides(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theid = event.target.value;
    setStudentID(theid);
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        {
          headers: actualHeaders,
        }
      );
      setStudentsList(response.data.listOfStudents);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  const backToCourses = () => {
    window.location.assign(`/english-courses/${pathGenerator(courseTitle)}`);
  };
  const NXTClass = () => {
    window.location.assign(
      `/english-courses/${pathGenerator(courseTitle)}/${nextClass}`
    );
  };
  const PVSClass = () => {
    window.location.assign(
      `/english-courses/${pathGenerator(courseTitle)}/${previousClass}`
    );
  };

  const [showCourses, setShowCourses] = useState(true);
  const [comment, setComment] = useState("");
  const [arrow, setArrow] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [myComments, setMyComments] = useState([]);
  const [comments, setComments] = useState([]);
  const getComments = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/comments/${classId}/${myId}`,
        { headers: actualHeaders }
      );
      var com = [];
      var myCom = [];
      com = response.data.comments || [];
      myCom = response.data.myComments | [];
      setComments(com);
      setMyComments(myCom);
    } catch (error) {
      console.error(error, "Erro ao buscar comentários");
    }
  };
  const sendComment = async () => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/comment/`,
        {
          studentID: myId,
          lessonID: classId,
          comment,
          lesson: window.location.href,
        },
        { headers: actualHeaders }
      );

      notifyAlert(
        "Comentário enviado. Você será respondido em breve!",
        partnerColor()
      );
      setComment("");
      getComments();
    } catch (error) {
      console.error(error, "Erro ao comentar");
      notifyAlert("Erro ao comentar");
    }
  };

  useEffect(() => {
    getComments();
  }, [commentsTrigger]);

  const handleShowCourses = () => {
    setShowCourses(!showCourses);
    setArrow(!arrow);
  };

  const deleteComment = async (id: any) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/comment/${id}`,
        { headers: actualHeaders }
      );

      notifyAlert("Comentário excluído!", "green");
      setComment("");
      getComments();
    } catch (error) {
      console.error(error, "Erro ao comentar");
    }
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  return (
    <div>
      <Helmets text={classTitle} />

      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                fontSize: "10px",
                color: "#000",
              }}
              to="/english-courses"
            >
              English Courses
            </Link>{" "}
            <span style={{ color: darkGreyColor() }}>-</span>
            <span
              style={{
                textDecoration: "none",
                fontSize: "10px",
                color: "#000",
                cursor: "pointer",
              }}
              onClick={backToCourses}
            >
              {courseTitle}
            </span>{" "}
            <span style={{ color: darkGreyColor() }}>-</span>
            <span
              style={{
                textDecoration: "none",
                fontStyle: "italic",
                fontSize: "10px",
                color: partnerColor(),
              }}
            >
              {theclass.title}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              margin: "1rem auto",
              padding: "0 1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {previousClass !== "123456" ? (
              <span
                style={{
                  color: partnerColor(),
                  cursor: "pointer",
                }}
                onClick={PVSClass}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No previous class
              </span>
            )}
            <HOne
              style={{
                fontSize: "18px",
                fontFamily: textTitleFont(),
                color: partnerColor(),
              }}
            >
              {`${order + 1}- ${theclass.title}`}{" "}
              {isCompleted && (
                <i
                  style={{
                    color: "white",
                    backgroundColor: partnerColor(),
                    padding: "1px",
                    borderRadius: "50%",
                    margin: "0 0.5rem",
                  }}
                  className={`fa fa-check`}
                />
              )}
            </HOne>

            {nextClass !== "123456" ? (
              <span
                style={{
                  color: partnerColor(),
                  cursor: "pointer",
                }}
                onClick={NXTClass}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No next class
              </span>
            )}
          </div>
          <ArvinButton
            style={{ margin: "1rem auto", display: "block" }}
            onClick={() => {
              setSeeSlides(!seeSlides);
            }}
          >
            See Board
          </ArvinButton>
          <ArvinButton
            style={{
              margin: "1rem auto",
              display: "block",
              backgroundColor: partnerColor(),
            }}
            onClick={generatePPT}
          >
            📄 Generate PowerPoint
          </ArvinButton>
          <label>
            <input
              style={{
                cursor: "pointer",
              }}
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={loading}
            />
            {loading
              ? "  Atualizando..."
              : isCompleted
              ? "  Completed"
              : "  Not Completed"}
          </label>
          {
            <div
              className="box-shadow-white"
              style={{
                height: "3rem",
                padding: "0 10px ",
                backgroundColor: alwaysWhite(),
                position: "fixed",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                minWidth: "100px",
                bottom: 5,
                left: 0,
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  display:
                    thePermissions === "superadmin" ||
                    thePermissions === "teacher"
                      ? "block"
                      : "none",
                  marginRight: "10px",
                }}
              >
                <select
                  onChange={(e) => handleStudentChange(e)}
                  value={studentID}
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f9f9f9",
                    fontSize: "0.9rem",
                    maxWidth: "8rem",
                    margin: "auto",
                    color: "#333",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                >
                  {studentsList.map((student: any, index: number) => (
                    <option key={index} value={student.id}>
                      {student.name + " " + student.lastname}
                    </option>
                  ))}
                </select>
              </span>
              <Voice
                maxW="8rem"
                changeB={changeNumber}
                setChangeB={setChangeNumber}
              />
            </div>
          }
          {theclass.image && (
            <ImgLesson src={theclass.image} alt={theclass.subtitle} />
          )}
          {theclass.video && isArthurVincent && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <IFrameVideoBlog src={getVideoEmbedUrl(theclass.video)} />
            </div>
          )}
          {/* {theclass.description && (
            <p
              style={{
                margin: "1rem 0",
                padding: "0.3rem",
                backgroundColor: "#f9f9f9",
                fontSize: "1.1rem",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {theclass.description}
            </p>
          )} */}
          {theclass.elements &&
            theclass.elements
              .sort((a: any, b: any) => a.order - b.order)
              .map((element: any, index: number) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  {element.subtitle && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <HTwo>{element.subtitle}</HTwo>
                    </div>
                  )}
                  {element.image && element.subtitle && (
                    <ImgLesson src={element.image} alt={element.subtitle} />
                  )}
                  {element.video && element.subtitle && isArthurVincent && (
                    <VideoLessonModel element={element} />
                  )}

                  {element.comments && (
                    <p
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        borderRadius: "6px",
                        margin: "0.5rem 0",
                        fontStyle: "italic",
                      }}
                    >
                      {element.comments}
                    </p>
                  )}
                  {element.type === "sentences" ? (
                    <SentenceLessonModel
                      mainTag={theclass.mainTag}
                      element={element}
                      studentId={studentID}
                      headers={headers}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "nfsentences" ? (
                    <NoFlashcardsSentenceLessonModel
                      element={element}
                      headers={headers}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "text" ? (
                    <TextLessonModel
                      headers={headers}
                      text={element.text ? element.text : ""}
                    />
                  ) : element.type === "html" ? (
                    <div
                      style={{
                        padding: "1rem",
                        justifyContent: "center",
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: element.text }} />
                    </div>
                  ) : element.type === "multipletexts" ? (
                    <MultipleTextsLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "selectexercise" ? (
                    <SelectExercise
                      headers={headers}
                      element={element}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "images" ? (
                    <ImageLessonModel
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      id={myId}
                      headers={headers}
                      element={element}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "exercise" ? (
                    <ExerciseLessonModel
                      headers={headers}
                      item={element.items}
                    />
                  ) : element.type === "qanda" ? (
                    <QandALessonModel
                      headers={headers}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      item={element}
                    />
                  ) : element.type === "audiosoundtrack" ? (
                    <AudioSoundTrack
                      headers={headers}
                      text={element.text}
                      src={element.src}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      element={element}
                      link={element.link}
                      subtitle={element.subtitle}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "personalqanda" ? (
                    <QandALessonPersonalModel
                      headers={headers}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      item={element}
                    />
                  ) : element.type === "dialogue" ? (
                    <DialogueLessonModel headers={headers} element={element} />
                  ) : element.type === "singleimages" ? (
                    <SingleImageLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "listenandtranslate" ? (
                    <ListenAndTranslateLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "listinenglish" ? (
                    <TextsWithTranslateLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ))}
          <div
            style={{
              display: "flex",
              margin: "1rem auto",
              padding: "0 1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {previousClass !== "123456" ? (
              <span
                style={{
                  color: partnerColor(),
                  cursor: "pointer",
                }}
                onClick={PVSClass}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No previous class
              </span>
            )}
            {nextClass !== "123456" ? (
              <span
                style={{
                  color: partnerColor(),
                  cursor: "pointer",
                }}
                onClick={NXTClass}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No next class
              </span>
            )}
          </div>
          <ArvinButton
            style={{ margin: "1rem auto", display: "block" }}
            onClick={() => {
              setSeeSlides(!seeSlides);
            }}
          >
            See Board
          </ArvinButton>
          <ArvinButton
            style={{
              margin: "1rem auto",
              display: "block",
              backgroundColor: partnerColor(),
            }}
            onClick={generatePPT}
          >
            📄 Generate PowerPoint
          </ArvinButton>
          <div>
            <HTwo>{UniversalTexts.leaveAComment}</HTwo>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {" "}
              <img
                style={styles.userImage} //klç
                src={thePicture}
                alt="User"
              />
              <textarea
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                type="text"
                className="comments2"
                placeholder="Type your comment here..."
                value={comment}
              />
            </div>
            <div>
              <ArvinButton
                style={{
                  display: "flex",
                  marginLeft: "auto",
                }}
                onClick={sendComment}
              >
                {UniversalTexts.leaveAComment}
              </ArvinButton>

              <>
                {comments.length > 0 && (
                  <div style={styles.container}>
                    <HTwo>{UniversalTexts.comments}</HTwo>
                    <div style={styles.commentList}>
                      {comments.map((comment: any, index: number) => (
                        <div key={index} style={styles.commentBox}>
                          <img
                            style={styles.userImage}
                            src={comment.photo}
                            alt="User"
                          />
                          <div style={styles.commentContent}>
                            <p style={styles.commentText}>{comment.comment}</p>
                            {comment.answer && (
                              <p style={styles.answerText}>
                                <strong>Resposta:</strong> {comment.answer}
                              </p>
                            )}
                            <span style={styles.commentDate}>
                              {formatDateBr(new Date(comment.date))}
                            </span>
                          </div>
                          {thePermissions == "superadmin" ||
                            (thePermissions == "teacher" && (
                              <span>
                                <ArvinButton
                                  onClick={() => deleteComment(comment.id)}
                                  color="red"
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </ArvinButton>
                              </span>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {myComments.length > 0 && (
                  <div style={styles.container}>
                    <HTwo>{UniversalTexts.myPendingComments}</HTwo>
                    <ul style={styles.commentList}>
                      {myComments.map((comment: any, index: number) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {comment.comment}{" "}
                          {thePermissions == "superadmin" ||
                            (thePermissions == "teacher" && (
                              <span>
                                <ArvinButton
                                  onClick={() => deleteComment(comment.id)}
                                  color="red"
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </ArvinButton>
                              </span>
                            ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            </div>
          </div>
          <label>
            <input
              style={{
                cursor: "pointer",
              }}
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={loading}
            />
            {loading
              ? "  Atualizando..."
              : isCompleted
              ? "  Completed"
              : "  Not Completed"}
          </label>
        </>
      )}
      <>
        <div
          onClick={() => {
            setSeeSlides(!seeSlides);
          }}
          style={{
            backgroundColor: transparentBlack(),
            zIndex: 100000000000,
            position: "fixed",
            top: 0,
            display: seeSlides ? "block" : "none",
            left: 0,
            width: "100000000vw",
            height: "100000000vw",
          }}
        />
        <div
          style={{
            padding: "2rem",
            position: "fixed",
            display: seeSlides ? "block" : "none",
            top: 5,
            left: 5,
            width: "94vw",
            border: "1px grey solid",
            borderRadius: "6px",
            height: "97vh",
            zIndex: 10000000000000,
            backgroundColor: "white",
          }}
        >
          <Xp
            style={{ margin: "1rem auto", display: "block" }}
            onClick={() => {
              setSeeSlides(!seeSlides);
            }}
          >
            x
          </Xp>
          <div
            style={{
              height: "75vh",
              overflow: "auto",
            }}
          >
            {theclass.elements &&
              theclass.elements
                .sort((a: any, b: any) => a.order - b.order)
                .map((element: any, index: number) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    {element.type === "sentences" ? (
                      <SentenceLessonModelSlide
                        studentId={studentID}
                        element={element}
                        selectedVoice={selectedVoice}
                        headers={headers}
                      />
                    ) : element.type === "text" ? (
                      <TextLessonModelSlide
                        text={element.text ? element.text : ""}
                      />
                    ) : element.type === "listinenglish" ? (
                      <TextsWithTranslateSlideLessonModel
                        headers={headers}
                        element={element}
                      />
                    ) : element.type === "exercise" ? (
                      <ExerciseLessonModelLesson
                        headers={headers}
                        item={element.items}
                      />
                    ) : element.type === "images" ? (
                      <ImageLessonModelSlide
                        headers={headers}
                        element={element}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </>
    </div>
  );
}
//
