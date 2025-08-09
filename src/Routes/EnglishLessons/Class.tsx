import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PptxGenJS from "pptxgenjs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
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
import { t } from "framer-motion/dist/types.d-D0HXPxHm";
import VocabularyLesson from "./Assets/LessonsModels/VocabularyLessonModel";
import ExplanationLesson from "./Assets/LessonsModels/ExplanationLesson";
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

  const sanitizeText = (text: string, maxLength: number = 500): string => {
    if (!text) return "";

    let cleaned = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength) + "...";
    }

    return cleaned;
  };

  const cleanHtml = (html: string): string => {
    if (!html) return "";

    let cleaned = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<hr\s*\/?>/gi, "\n---\n");

    cleaned = cleaned.replace(/<[^>]*>/g, "");

    cleaned = cleaned
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    cleaned = cleaned.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ");

    return cleaned.trim();
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url) {
      return false;
    }

    const problematicDomains = [
      "britannica.com",
      "getty",
      "shutterstock",
      "istockphoto",
      "alamy",
      "bigstock",
    ];

    const hasProblematicDomain = problematicDomains.some((domain) =>
      url.toLowerCase().includes(domain)
    );

    if (hasProblematicDomain) {
      console.log(`⚠️ Domínio com possíveis restrições CORS detectado: ${url}`);
      return false;
    }

    return true;
  };

  const addImageSafely = async (
    slide: any,
    imagePath: string,
    options: any
  ): Promise<boolean> => {
    try {
      if (!isValidImageUrl(imagePath)) {
        console.log(
          `⚠️ Imagem ignorada devido a possíveis problemas de CORS: ${imagePath}`
        );
        return false;
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout ao carregar imagem"));
        }, 5000);

        try {
          slide.addImage({
            path: imagePath,
            ...options,
          });

          clearTimeout(timeout);
          resolve(true);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    } catch (error) {
      console.log(`⚠️ Erro ao adicionar imagem: ${imagePath}`, error);
      return false;
    }
  };

  const generatePPT = async () => {
    try {
      notifyAlert("Gerando PowerPoint...", partnerColor());

      const pptx = new PptxGenJS();

      pptx.author = "Arvin Education";
      pptx.title = sanitizeText(classTitle || "Aula de Inglês");
      pptx.subject = "Aula de Inglês";

      const titleSlide = pptx.addSlide();

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

      if (theclass.image) {
        try {
          await addImageSafely(titleSlide, theclass.image, {
            x: 3.75,
            y: 1.8,
            w: 2.5,
            h: 2.5,
          });
        } catch (imageError) {
          console.log(
            "⚠️ Erro ao adicionar imagem da aula no slide de título, continuando sem imagem:",
            imageError
          );
        }
      }

      const safeSubtitle = sanitizeText(`${courseTitle}`, 60);
      const subtitleY = theclass.image ? 4.2 : 2;
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

      const dateY = theclass.image ? 4.8 : 2.9;
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

      const logoUrl = logoPartner();
      if (logoUrl) {
        try {
          await addImageSafely(titleSlide, logoUrl, {
            x: 9,
            y: 0.1,
            w: 0.8,
            h: 0.4,
          });
        } catch (logoError) {
          console.log(
            "⚠️ Erro ao adicionar logo do partner no slide de título, continuando sem logo:",
            logoError
          );
        }
      }

      if (theclass.elements && Array.isArray(theclass.elements)) {
        const sortedElements = theclass.elements.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );

        for (const element of sortedElements) {
          try {
            console.log(
              `📄 Processando elemento: ${element.type} - ${
                element.subtitle || "Sem título"
              }`
            );

            if (element.subtitle || element.description) {
              try {
                const subtitleSlide = pptx.addSlide();

                subtitleSlide.addShape(pptx.ShapeType.rect, {
                  x: 0.2,
                  y: 0.2,
                  w: 9.6,
                  h: 5.2,
                  fill: { color: "FFFFFF" },
                  line: { color: partnerColor().replace("#", ""), width: 4 },
                });

                const imageToUse = element.image || theclass.image;
                if (imageToUse) {
                  try {
                    await addImageSafely(subtitleSlide, imageToUse, {
                      x: 0.5,
                      y: 4.2,
                      w: 1,
                      h: 1,
                    });
                  } catch (imageError) {
                    console.log(
                      "⚠️ Erro ao adicionar imagem do slide de subtítulo, continuando sem imagem:",
                      imageError
                    );
                  }
                }

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

                if (element.description) {
                  const safeDescription = sanitizeText(
                    element.description,
                    300
                  );
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

                const sessionSubtitle = `Sessão: ${
                  element.subtitle || "Conteúdo"
                }`;
                subtitleSlide.addText(sessionSubtitle, {
                  x: imageToUse ? 4 : 1,
                  y: 6.2,
                  w: 5,
                  h: 0.8,
                  fontSize: 14,
                  bold: true,
                  align: "left",
                  color: partnerColor().replace("#", ""),
                  fontFace: textGeneralFont(),
                });

                const logoUrl = logoPartner();
                if (logoUrl) {
                  try {
                    await addImageSafely(subtitleSlide, logoUrl, {
                      x: 8.5,
                      y: 0.5,
                      w: 0.8,
                      h: 0.6,
                    });
                  } catch (logoError) {
                    console.log(
                      "⚠️ Erro ao adicionar logo do partner, continuando sem logo:",
                      logoError
                    );
                  }
                }
              } catch (subtitleSlideError) {
                console.log(
                  "⚠️ Erro ao criar slide de subtítulo, pulando para o conteúdo:",
                  subtitleSlideError
                );
              }
            }

            switch (element.type) {
              case "text":
                try {
                  const textSlide = pptx.addSlide();

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
                      breakLine: true,
                    });
                  }
                } catch (textError) {
                  console.log(
                    "⚠️ Erro ao processar elemento text, pulando sessão:",
                    textError
                  );
                }
                break;
              //@ts-ignore
              case "sentences" || "nfsentences":
                if (element.sentences && Array.isArray(element.sentences)) {
                  const sentenceGroups = [];
                  for (let i = 0; i < element.sentences.length; i += 2) {
                    sentenceGroups.push(element.sentences.slice(i, i + 2));
                  }

                  sentenceGroups.forEach((sentenceGroup, groupIndex) => {
                    const sentencesSlide = pptx.addSlide();

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

                    let yPos = 2;
                    //@ts-ignore

                    sentenceGroup.forEach((sentence) => {
                      if (sentence.english) {
                        const safeEnglish = sanitizeText(sentence.english, 200);
                        sentencesSlide.addText(`${safeEnglish}`, {
                          x: 0.5,
                          y: yPos,
                          w: 9,
                          h: 0.6,
                          fontSize: 16,
                          bold: true,
                          color: partnerColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                        });

                        if (sentence.portuguese) {
                          const safePortuguese = sanitizeText(
                            sentence.portuguese,
                            200
                          );
                          sentencesSlide.addText(`${safePortuguese}`, {
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

              case "nfsentences":
                if (element.sentences && Array.isArray(element.sentences)) {
                  const sentenceGroups = [];
                  for (let i = 0; i < element.sentences.length; i += 2) {
                    sentenceGroups.push(element.sentences.slice(i, i + 2));
                  }

                  sentenceGroups.forEach((sentenceGroup, groupIndex) => {
                    const sentencesSlide = pptx.addSlide();

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

                    let yPos = 2;
                    //@ts-ignore

                    sentenceGroup.forEach((sentence) => {
                      if (sentence.english) {
                        const safeEnglish = sanitizeText(sentence.english, 200);
                        sentencesSlide.addText(`${safeEnglish}`, {
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
                          sentencesSlide.addText(` ${safePortuguese}`, {
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
                try {
                  if (element.items && Array.isArray(element.items)) {
                    const itemsPerSlide = 6; // Número de exercícios por slide
                    const exerciseGroups = [];
                    for (
                      let i = 0;
                      i < element.items.length;
                      i += itemsPerSlide
                    ) {
                      exerciseGroups.push(
                        element.items.slice(i, i + itemsPerSlide)
                      );
                    }

                    exerciseGroups.forEach((exerciseGroup, groupIndex) => {
                      try {
                        const exerciseSlide = pptx.addSlide();

                        const safeTitle = sanitizeText(
                          `${element.subtitle || "Exercise"}${
                            exerciseGroups.length > 1
                              ? ` (${groupIndex + 1}/${exerciseGroups.length})`
                              : ""
                          }`,
                          100
                        );
                        exerciseSlide.addText(safeTitle, {
                          x: 0.5,
                          y: 0.5,
                          w: 9,
                          h: 0.5,
                          fontSize: 28,
                          bold: true,
                          align: "center",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });

                        let yPos = 1.5;
                        //@ts-ignore

                        exerciseGroup.forEach((exerciseItem, itemIndex) => {
                          const exerciseNumber =
                            groupIndex * itemsPerSlide + itemIndex + 1;
                          const safeExercise = sanitizeText(exerciseItem, 300);

                          exerciseSlide.addText(
                            `${exerciseNumber}. ${safeExercise}`,
                            {
                              x: 0.5,
                              y: yPos,
                              w: 9,
                              h: 0.5,
                              fontSize: 24,
                              color: darkGreyColor().replace("#", ""),
                              fontFace: textGeneralFont(),
                              valign: "top",
                            }
                          );
                          yPos += 1;
                        });
                      } catch (exerciseSlideError) {
                        console.log(
                          "⚠️ Erro ao criar slide de exercise, pulando slide:",
                          exerciseSlideError
                        );
                      }
                    });
                  }
                } catch (exerciseError) {
                  console.log(
                    "⚠️ Erro ao processar elemento exercise, pulando sessão:",
                    exerciseError
                  );
                }
                break;

              case "html":
                try {
                  if (element.text) {
                    const cleanText = cleanHtml(element.text);
                    const safeText = sanitizeText(cleanText, 2000);

                    const paragraphs = safeText
                      .split("\n")
                      .filter((p) => p.trim().length > 0);
                    const maxParagraphsPerSlide = 3;

                    const paragraphGroups = [];
                    for (
                      let i = 0;
                      i < paragraphs.length;
                      i += maxParagraphsPerSlide
                    ) {
                      paragraphGroups.push(
                        paragraphs.slice(i, i + maxParagraphsPerSlide)
                      );
                    }

                    paragraphGroups.forEach((paragraphGroup, groupIndex) => {
                      try {
                        const htmlSlide = pptx.addSlide();

                        const safeHtmlTitle = sanitizeText(
                          `${element.subtitle || "Content"}${
                            paragraphGroups.length > 1
                              ? ` (${groupIndex + 1}/${paragraphGroups.length})`
                              : ""
                          }`,
                          100
                        );
                        htmlSlide.addText(safeHtmlTitle, {
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

                        let yPos = 1.5;
                        paragraphGroup.forEach((paragraph) => {
                          const safeParagraph = sanitizeText(paragraph, 400);
                          htmlSlide.addText(safeParagraph, {
                            x: 0.5,
                            y: yPos,
                            w: 9,
                            h: 1.5,
                            fontSize: 16,
                            color: darkGreyColor().replace("#", ""),
                            fontFace: textGeneralFont(),
                            valign: "top",
                            breakLine: true,
                          });
                          yPos += 1.8;
                        });
                      } catch (htmlSlideError) {
                        console.log(
                          "⚠️ Erro ao criar slide de HTML, pulando slide:",
                          htmlSlideError
                        );
                      }
                    });
                  }
                } catch (htmlError) {
                  console.log(
                    "⚠️ Erro ao processar elemento html, pulando sessão:",
                    htmlError
                  );
                }
                break;

              case "images":
                try {
                  if (element.images && Array.isArray(element.images)) {
                    const imageGroups = [];
                    for (let i = 0; i < element.images.length; i += 2) {
                      imageGroups.push(element.images.slice(i, i + 2));
                    }

                    imageGroups.forEach((imageGroup, groupIndex) => {
                      try {
                        const imageSlide = pptx.addSlide();

                        const safeImageTitle = sanitizeText(
                          `${element.subtitle || "Images"}${
                            imageGroups.length > 1
                              ? ` (${groupIndex + 1}/${imageGroups.length})`
                              : ""
                          }`,
                          100
                        );
                        imageSlide.addText(safeImageTitle, {
                          x: 0.5,
                          y: 0.2,
                          w: 9,
                          h: 0.6,
                          fontSize: 20,
                          bold: true,
                          align: "center",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });

                        const positions = [
                          { x: 1, y: 1.2, w: 3.5, h: 2.5 },
                          { x: 5.5, y: 1.2, w: 3.5, h: 2.5 },
                          { x: 1, y: 4.2, w: 3.5, h: 2.5 },
                          { x: 5.5, y: 4.2, w: 3.5, h: 2.5 },
                        ];

                        //@ts-ignore
                        imageGroup.forEach((imageItem, index) => {
                          try {
                            if (imageItem.img) {
                              const pos = positions[index] || positions[0];

                              imageSlide.addImage({
                                path: imageItem.img,
                                x: pos.x,
                                y: pos.y,
                                w: pos.w,
                                h: pos.h,
                              });

                              if (imageItem.text) {
                                const safeImageText = sanitizeText(
                                  imageItem.text,
                                  100
                                );
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
                            console.log(
                              "⚠️ Erro ao adicionar imagem individual no slide, pulando imagem:",
                              imageError
                            );
                          }
                        });
                      } catch (imageSlideError) {
                        console.log(
                          "⚠️ Erro ao criar slide de images, pulando slide:",
                          imageSlideError
                        );
                      }
                    });
                  }
                } catch (imagesError) {
                  console.log(
                    "⚠️ Erro ao processar elemento images, pulando sessão:",
                    imagesError
                  );
                }
                break;

              case "singleimages":
                try {
                  if (element.images && Array.isArray(element.images)) {
                    for (
                      let imageIndex = 0;
                      imageIndex < element.images.length;
                      imageIndex++
                    ) {
                      try {
                        const imageUrl = element.images[imageIndex];
                        const imageSlide = pptx.addSlide();

                        const safeImageTitle = sanitizeText(
                          `${element.subtitle || "Image"}${
                            element.images.length > 1
                              ? ` (${imageIndex + 1}/${element.images.length})`
                              : ""
                          }`,
                          100
                        );
                        imageSlide.addText(safeImageTitle, {
                          x: 0.5,
                          y: 0.2,
                          w: 9,
                          h: 0.6,
                          fontSize: 24,
                          bold: true,
                          align: "center",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });

                        try {
                          await addImageSafely(imageSlide, imageUrl, {
                            x: 2,
                            y: 1.2,
                            w: 6,
                            h: 4.5,
                          });
                        } catch (imageError) {
                          console.log(
                            "⚠️ Erro ao adicionar imagem single, pulando imagem:",
                            imageError
                          );
                        }
                      } catch (singleImageSlideError) {
                        console.log(
                          "⚠️ Erro ao criar slide de single image, pulando slide:",
                          singleImageSlideError
                        );
                      }
                    }
                  }
                } catch (singleImagesError) {
                  console.log(
                    "⚠️ Erro ao processar elemento singleimages, pulando sessão:",
                    singleImagesError
                  );
                }
                break;

              case "audiosoundtrack":
                if (element.text) {
                  const audioTextSlide = pptx.addSlide();

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
                    breakLine: true,
                  });
                }

                if (element.sentences && Array.isArray(element.sentences)) {
                  const sentenceGroups = [];
                  for (let i = 0; i < element.sentences.length; i += 3) {
                    sentenceGroups.push(element.sentences.slice(i, i + 3));
                  }

                  sentenceGroups.forEach((sentenceGroup, groupIndex) => {
                    const audioSentencesSlide = pptx.addSlide();

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

                    let yPos = 1.5;
                    //@ts-ignore

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
                            //@ts-ignore

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

              case "explanation":
                try {
                  if (
                    element.explanation &&
                    Array.isArray(element.explanation)
                  ) {
                    element.explanation.forEach(
                      (explanationItem: any, explIndex: number) => {
                        const explanationSlide = pptx.addSlide();

                        // Título da explicação
                        if (explanationItem.title) {
                          const safeTitle = sanitizeText(
                            explanationItem.title,
                            100
                          );
                          explanationSlide.addText(safeTitle, {
                            x: 0.5,
                            y: 0.5,
                            w: 9,
                            h: 0.8,
                            fontSize: 28,
                            bold: true,
                            align: "center",
                            color: partnerColor().replace("#", ""),
                            fontFace: textTitleFont(),
                          });
                        }

                        let yPos = 1.5;

                        // Imagem se existir
                        if (explanationItem.image) {
                          try {
                            addImageSafely(
                              explanationSlide,
                              explanationItem.image,
                              {
                                x: 7,
                                y: yPos,
                                w: 2,
                                h: 2,
                              }
                            );
                          } catch (imageError) {
                            console.log(
                              "⚠️ Erro ao adicionar imagem da explicação:",
                              imageError
                            );
                          }
                        }

                        // Lista de explicações
                        if (
                          explanationItem.list &&
                          Array.isArray(explanationItem.list)
                        ) {
                          explanationItem.list.forEach(
                            (listItem: string, listIndex: number) => {
                              const safeListItem = sanitizeText(listItem, 400);
                              explanationSlide.addText(`• ${safeListItem}`, {
                                x: 0.5,
                                y: yPos,
                                w: explanationItem.image ? 6 : 9,
                                h: 0.8,
                                fontSize: 16,
                                color: darkGreyColor().replace("#", ""),
                                fontFace: textGeneralFont(),
                                valign: "top",
                              });
                              yPos += 0.8;
                            }
                          );
                        }
                      }
                    );
                  }
                } catch (explanationError) {
                  console.log(
                    "⚠️ Erro ao processar elemento explanation:",
                    explanationError
                  );
                }
                break;

              case "vocabulary":
                try {
                  const vocabularySlide = pptx.addSlide();

                  // Título da sessão de vocabulário
                  if (element.subtitle) {
                    const safeSubtitle = sanitizeText(element.subtitle, 100);
                    vocabularySlide.addText(safeSubtitle, {
                      x: 0.5,
                      y: 0.5,
                      w: 9,
                      h: 0.8,
                      fontSize: 28,
                      bold: true,
                      align: "center",
                      color: partnerColor().replace("#", ""),
                      fontFace: textTitleFont(),
                    });
                  }

                  // Processar vocabulário (sentences com english e portuguese)
                  if (element.sentences && Array.isArray(element.sentences)) {
                    let yPos = 1.5;
                    const itemsPerSlide = 5; // Máximo de itens por slide
                    let currentSlide = vocabularySlide;
                    let itemCount = 0;

                    element.sentences.forEach(
                      (vocab: any, vocabIndex: number) => {
                        // Criar novo slide se necessário
                        if (
                          itemCount >= itemsPerSlide &&
                          vocabIndex < element.sentences.length
                        ) {
                          currentSlide = pptx.addSlide();
                          if (element.subtitle) {
                            const safeSubtitle = sanitizeText(
                              element.subtitle + " (cont.)",
                              100
                            );
                            currentSlide.addText(safeSubtitle, {
                              x: 0.5,
                              y: 0.3,
                              w: 9,
                              h: 0.6,
                              fontSize: 24,
                              bold: true,
                              align: "center",
                              color: partnerColor().replace("#", ""),
                              fontFace: textTitleFont(),
                            });
                          }
                          yPos = 1.2;
                          itemCount = 0;
                        }

                        if (vocab.english && vocab.portuguese) {
                          const safeEnglish = sanitizeText(vocab.english, 50);
                          const safePortuguese = sanitizeText(
                            vocab.portuguese,
                            50
                          );

                          // Texto em inglês (lado esquerdo)
                          currentSlide.addText(safeEnglish, {
                            x: 1,
                            y: yPos,
                            w: 3.5,
                            h: 0.6,
                            fontSize: 16,
                            bold: true,
                            align: "left",
                            color: darkGreyColor().replace("#", ""),
                            fontFace: textTitleFont(),
                          });

                          // Hífen separador
                          currentSlide.addText("-", {
                            x: 4.5,
                            y: yPos,
                            w: 1,
                            h: 0.6,
                            fontSize: 18,
                            bold: true,
                            align: "center",
                            color: partnerColor().replace("#", ""),
                          });

                          // Texto em português (lado direito)
                          currentSlide.addText(safePortuguese, {
                            x: 5.5,
                            y: yPos,
                            w: 3.5,
                            h: 0.6,
                            fontSize: 16,
                            align: "left",
                            color: darkGreyColor().replace("#", ""),
                            fontFace: textGeneralFont(),
                            italic: true,
                          });

                          yPos += 0.7;
                          itemCount++;
                        }
                      }
                    );
                  }
                } catch (vocabularyError) {
                  console.log(
                    "⚠️ Erro ao processar elemento vocabulary:",
                    vocabularyError
                  );
                }
                break;

              case "dialogue":
                try {
                  if (element.dialogue && Array.isArray(element.dialogue)) {
                    // Agrupar falas em pares (2 por slide)
                    for (let i = 0; i < element.dialogue.length; i += 2) {
                      const dialogueSlide = pptx.addSlide();

                      // Título do diálogo (apenas no primeiro slide)
                      if (i === 0 && element.subtitle) {
                        const safeSubtitle = sanitizeText(
                          element.subtitle,
                          100
                        );
                        dialogueSlide.addText(safeSubtitle, {
                          x: 0.5,
                          y: 0.3,
                          w: 9,
                          h: 0.8,
                          fontSize: 28,
                          bold: true,
                          align: "center",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });
                      }

                      let yPos = i === 0 && element.subtitle ? 1.2 : 0.8;

                      // Primeira fala (A)
                      if (element.dialogue[i]) {
                        const safeDialogueA = sanitizeText(
                          element.dialogue[i],
                          150
                        );

                        // Label da pessoa A
                        dialogueSlide.addText("A:", {
                          x: 0.8,
                          y: yPos,
                          w: 1,
                          h: 0.6,
                          fontSize: 20,
                          bold: true,
                          align: "left",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });

                        // Fala da pessoa A
                        dialogueSlide.addText(safeDialogueA, {
                          x: 1.8,
                          y: yPos,
                          w: 7.2,
                          h: 1.2,
                          fontSize: 16,
                          align: "left",
                          color: darkGreyColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                          valign: "top",
                        });

                        yPos += 1.5;
                      }

                      // Segunda fala (B)
                      if (element.dialogue[i + 1]) {
                        const safeDialogueB = sanitizeText(
                          element.dialogue[i + 1],
                          150
                        );

                        // Label da pessoa B
                        dialogueSlide.addText("B:", {
                          x: 0.8,
                          y: yPos,
                          w: 1,
                          h: 0.6,
                          fontSize: 20,
                          bold: true,
                          align: "left",
                          color: partnerColor().replace("#", ""),
                          fontFace: textTitleFont(),
                        });

                        // Fala da pessoa B
                        dialogueSlide.addText(safeDialogueB, {
                          x: 1.8,
                          y: yPos,
                          w: 7.2,
                          h: 1.2,
                          fontSize: 16,
                          align: "left",
                          color: darkGreyColor().replace("#", ""),
                          fontFace: textGeneralFont(),
                          valign: "top",
                        });
                      }
                    }
                  }
                } catch (dialogueError) {
                  console.log(
                    "⚠️ Erro ao processar elemento dialogue:",
                    dialogueError
                  );
                }
                break;

              default:
                try {
                  if (
                    [
                      "multipletexts",
                      "selectexercise",
                      "personalqanda",
                      "singleimages",
                      "listenandtranslate",
                      "listinenglish",
                    ].includes(element.type)
                  ) {
                    const genericSlide = pptx.addSlide();

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
                } catch (defaultError) {
                  console.log(
                    "⚠️ Erro ao processar elemento genérico, pulando sessão:",
                    defaultError
                  );
                }
                break;
            }
          } catch (elementError) {
            console.log(
              `⚠️ Erro ao processar elemento "${
                element.subtitle || element.type
              }", pulando sessão:`,
              elementError
            );
          }
        }
      }

      const safeFileName = sanitizeText(classTitle || "aula", 30).replace(
        /\s+/g,
        "_"
      );
      const fileName = `${safeFileName}.pptx`;

      await pptx.writeFile({ fileName });

      notifyAlert("PowerPoint gerado com sucesso!", "green");
    } catch (error) {
      console.error("❌ Erro ao gerar PPT:", error);
      notifyAlert("Erro ao gerar PowerPoint. Tente novamente.", "red");
    }
  };

  const generateWord = async () => {
    try {
      notifyAlert("Gerando documento Word...", partnerColor());

      const children = [];

      // Título principal
      const safeTitle = sanitizeText(classTitle || "Aula de Inglês", 100);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safeTitle,
              bold: true,
              size: 48,
              color: partnerColor().replace("#", ""),
              font: textTitleFont(),
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Subtítulo
      const safeSubtitle = sanitizeText(`${courseTitle}`, 60);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safeSubtitle,
              size: 24,
              color: darkGreyColor().replace("#", ""),
              font: textGeneralFont(),
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );

      // Data
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Data: ${new Date().toLocaleDateString("pt-BR")}`,
              size: 20,
              color: darkGreyColor().replace("#", ""),
              font: textGeneralFont(),
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        })
      );

      // Descrição da aula (se houver)
      if (theclass.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Descrição:",
                bold: true,
                size: 24,
                color: partnerColor().replace("#", ""),
                font: textTitleFont(),
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );

        const safeDescription = sanitizeText(theclass.description, 500);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: safeDescription,
                size: 22,
                font: textGeneralFont(),
              }),
            ],
            spacing: { after: 400 },
          })
        );
      }

      // Processar elementos da aula
      if (theclass.elements && Array.isArray(theclass.elements)) {
        const sortedElements = theclass.elements.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );

        for (const element of sortedElements) {
          try {
            // Título da sessão
            if (element.subtitle) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: element.subtitle,
                      bold: true,
                      size: 28,
                      color: partnerColor().replace("#", ""),
                      font: textTitleFont(),
                    }),
                  ],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 600, after: 300 },
                })
              );
            }

            // Descrição da sessão
            if (element.description) {
              const safeDescription = sanitizeText(element.description, 300);
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: safeDescription,
                      size: 20,
                      italics: true,
                      font: textGeneralFont(),
                    }),
                  ],
                  spacing: { after: 300 },
                })
              );
            }

            // Processar conteúdo baseado no tipo
            switch (element.type) {
              case "text":
                if (element.text) {
                  const safeText = sanitizeText(element.text, 2000);
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: safeText,
                          size: 22,
                          font: textGeneralFont(),
                        }),
                      ],
                      spacing: { after: 300 },
                    })
                  );
                }
                break;

              case "sentences":
              case "nfsentences":
                if (element.sentences && Array.isArray(element.sentences)) {
                  element.sentences.forEach((sentence: any, index: number) => {
                    if (sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: safeEnglish,
                              bold: true,
                              size: 22,
                              color: partnerColor().replace("#", ""),
                              font: textTitleFont(),
                            }),
                          ],
                          spacing: { after: 100 },
                        })
                      );

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        children.push(
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `  ${safePortuguese}`,
                                size: 16,
                                italics: true,
                                color: darkGreyColor().replace("#", ""),
                                font: textGeneralFont(),
                              }),
                            ],
                            spacing: { after: 200 },
                          })
                        );
                      }
                    }
                  });
                }
                break;

              case "exercise":
                if (element.items && Array.isArray(element.items)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Exercícios:",
                          bold: true,
                          size: 24,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );

                  element.items.forEach((item: any, index: number) => {
                    const safeItem = sanitizeText(item, 300);
                    children.push(
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: safeItem,
                            size: 20,
                            font: textGeneralFont(),
                          }),
                        ],
                        spacing: { after: 150 },
                      })
                    );
                  });
                }
                break;

              case "html":
                if (element.text) {
                  const cleanText = cleanHtml(element.text);
                  const safeText = sanitizeText(cleanText, 2000);

                  const paragraphs = safeText
                    .split("\n")
                    .filter((p) => p.trim().length > 0);
                  paragraphs.forEach((paragraph) => {
                    const safeParagraph = sanitizeText(paragraph, 400);
                    children.push(
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: safeParagraph,
                            size: 20,
                            font: textGeneralFont(),
                          }),
                        ],
                        spacing: { after: 200 },
                      })
                    );
                  });
                }
                break;

              case "audiosoundtrack":
                if (element.text) {
                  const cleanAudioText = cleanHtml(element.text);
                  const safeAudioText = sanitizeText(cleanAudioText, 3000);

                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "🎵 Conteúdo do Áudio:",
                          bold: true,
                          size: 22,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );

                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: safeAudioText,
                          size: 20,
                          font: textGeneralFont(),
                        }),
                      ],
                      spacing: { after: 300 },
                    })
                  );
                }

                if (element.sentences && Array.isArray(element.sentences)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "🎵 Frases do Áudio:",
                          bold: true,
                          size: 22,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );

                  element.sentences.forEach((sentence: any, index: number) => {
                    if (sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: safeEnglish,
                              bold: true,
                              size: 20,
                              color: partnerColor().replace("#", ""),
                              font: textTitleFont(),
                            }),
                          ],
                          spacing: { after: 100 },
                        })
                      );

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        children.push(
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `   ${safePortuguese}`,
                                size: 18,
                                color: darkGreyColor().replace("#", ""),
                                font: textGeneralFont(),
                              }),
                            ],
                            spacing: { after: 200 },
                          })
                        );
                      }
                    }
                  });
                }
                break;

              case "images":
                if (element.images && Array.isArray(element.images)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "🖼️ Imagens da sessão:",
                          bold: true,
                          size: 22,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );

                  element.images.forEach((imageItem: any, index: number) => {
                    if (imageItem.english) {
                      const safeEnglish = sanitizeText(imageItem.english, 100);
                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: safeEnglish,
                              size: 20,
                              font: textTitleFont(),
                            }),
                          ],
                          spacing: { after: 100 },
                        })
                      );
                    }
                    if (imageItem.portuguese) {
                      const safePortuguese = sanitizeText(
                        imageItem.portuguese,
                        100
                      );
                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `   ${safePortuguese}`,
                              size: 18,
                              color: darkGreyColor().replace("#", ""),
                              font: textGeneralFont(),
                            }),
                          ],
                          spacing: { after: 150 },
                        })
                      );
                    }
                  });
                }
                break;

              case "singleimages":
                if (element.images && Array.isArray(element.images)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `🖼️ ${element.images.length} imagem(ns) nesta sessão`,
                          bold: true,
                          size: 20,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );
                }
                break;

              case "explanation":
                if (element.explanation && Array.isArray(element.explanation)) {
                  element.explanation.forEach(
                    (explanationItem: any, explIndex: number) => {
                      // Título da explicação
                      if (explanationItem.title) {
                        children.push(
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: explanationItem.title,
                                bold: true,
                                size: 32,
                                color: partnerColor().replace("#", ""),
                                font: textTitleFont(),
                              }),
                            ],
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 400, after: 300 },
                          })
                        );
                      }

                      // Lista de explicações
                      if (
                        explanationItem.list &&
                        Array.isArray(explanationItem.list)
                      ) {
                        explanationItem.list.forEach(
                          (listItem: string, listIndex: number) => {
                            const safeListItem = sanitizeText(listItem, 500);
                            children.push(
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `• ${safeListItem}`,
                                    size: 22,
                                    font: textGeneralFont(),
                                  }),
                                ],
                                spacing: { after: 200 },
                              })
                            );
                          }
                        );
                      }

                      // Espaço entre explicações
                      if (explIndex < element.explanation.length - 1) {
                        children.push(
                          new Paragraph({
                            children: [new TextRun({ text: "" })],
                            spacing: { after: 400 },
                          })
                        );
                      }
                    }
                  );
                }
                break;

              case "vocabulary":
                if (element.sentences && Array.isArray(element.sentences)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Vocabulario:",
                          bold: true,
                          size: 24,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 400, after: 300 },
                    })
                  );

                  element.sentences.forEach(
                    (vocab: any, vocabIndex: number) => {
                      if (vocab.english && vocab.portuguese) {
                        const safeEnglish = sanitizeText(vocab.english, 100);
                        const safePortuguese = sanitizeText(
                          vocab.portuguese,
                          100
                        );

                        // Palavra em inglês - tradução em português
                        children.push(
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: safeEnglish,
                                bold: true,
                                size: 20,
                                color: darkGreyColor().replace("#", ""),
                                font: textTitleFont(),
                              }),
                              new TextRun({
                                text: " - ",
                                bold: true,
                                size: 18,
                                color: partnerColor().replace("#", ""),
                              }),
                              new TextRun({
                                text: safePortuguese,
                                size: 20,
                                color: darkGreyColor().replace("#", ""),
                                font: textGeneralFont(),
                                italics: true,
                              }),
                            ],
                            spacing: { after: 150 },
                          })
                        );
                      }
                    }
                  );
                }
                break;

              case "dialogue":
                if (element.dialogue && Array.isArray(element.dialogue)) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Dialogo:",
                          bold: true,
                          size: 24,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 400, after: 300 },
                    })
                  );

                  element.dialogue.forEach(
                    (dialogueText: string, dialogueIndex: number) => {
                      const speaker = dialogueIndex % 2 === 0 ? "A" : "B";
                      const safeDialogue = sanitizeText(dialogueText, 200);

                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${speaker} - `,
                              bold: true,
                              size: 18,
                              color: partnerColor().replace("#", ""),
                              font: textTitleFont(),
                            }),
                            new TextRun({
                              text: safeDialogue,
                              size: 18,
                              color: darkGreyColor().replace("#", ""),
                              font: textGeneralFont(),
                            }),
                          ],
                          spacing: { after: 150 },
                        })
                      );
                    }
                  );
                }
                break;

              default:
                if (
                  [
                    "multipletexts",
                    "selectexercise",
                    "personalqanda",
                    "listenandtranslate",
                    "listinenglish",
                  ].includes(element.type)
                ) {
                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `📋 Elemento: ${element.type}`,
                          bold: true,
                          size: 20,
                          color: partnerColor().replace("#", ""),
                          font: textTitleFont(),
                        }),
                      ],
                      spacing: { before: 300, after: 200 },
                    })
                  );

                  children.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Este conteúdo requer interação digital e está disponível na plataforma online.",
                          size: 18,
                          italics: true,
                          color: darkGreyColor().replace("#", ""),
                          font: textGeneralFont(),
                        }),
                      ],
                      spacing: { after: 300 },
                    })
                  );
                }
                break;
            }

            // Adicionar linha separadora entre sessões
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "─".repeat(50),
                    size: 16,
                    color: darkGreyColor().replace("#", ""),
                    font: textGeneralFont(),
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400, after: 400 },
              })
            );
          } catch (elementError) {
            console.log(
              `⚠️ Erro ao processar elemento "${
                element.subtitle || element.type
              }" no Word, pulando sessão:`,
              elementError
            );
          }
        }
      }

      // Criar o documento
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children,
          },
        ],
      });

      const safeFileName = sanitizeText(classTitle || "aula", 30).replace(
        /\s+/g,
        "_"
      );
      const fileName = `${safeFileName}.docx`;

      // Gerar e fazer download do arquivo
      const blob = await Packer.toBlob(doc);
      saveAs(blob, fileName);
      notifyAlert("Documento Word gerado com sucesso!", "green");
    } catch (error) {
      console.error("❌ Erro ao gerar Word:", error);
      notifyAlert("Erro ao gerar documento Word. Tente novamente.", "red");
    }
  };

  const generatePDF = async () => {
    try {
      notifyAlert("Gerando documento PDF...", partnerColor());

      const pdf = new jsPDF();
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pdf.internal.pageSize.width - 2 * margin;

      // Função para adicionar nova página se necessário
      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Função para quebrar texto em linhas
      const splitTextToSize = (
        text: string,
        maxWidth: number,
        fontSize: number
      ) => {
        pdf.setFontSize(fontSize);
        return pdf.splitTextToSize(text, maxWidth);
      };

      // Título principal
      const safeTitle = sanitizeText(classTitle || "Aula de Inglês", 100);
      pdf.setFontSize(20);
      const partnerColorHex = partnerColor().replace("#", "");
      const r = parseInt(partnerColorHex.substring(0, 2), 16);
      const g = parseInt(partnerColorHex.substring(2, 4), 16);
      const b = parseInt(partnerColorHex.substring(4, 6), 16);
      pdf.setTextColor(r, g, b);
      const titleLines = splitTextToSize(safeTitle, maxWidth, 20);
      checkPageBreak(titleLines.length * 7);
      pdf.text(titleLines, margin, yPosition);
      yPosition += titleLines.length * 7 + 5;

      // Subtítulo do curso
      const safeSubtitle = sanitizeText(`${courseTitle}`, 60);
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const subtitleLines = splitTextToSize(safeSubtitle, maxWidth, 12);
      checkPageBreak(subtitleLines.length * 5);
      pdf.text(subtitleLines, margin, yPosition);
      yPosition += subtitleLines.length * 5 + 15;

      // Processar elementos da aula (apenas conteúdo essencial)
      if (theclass.elements && Array.isArray(theclass.elements)) {
        const sortedElements = theclass.elements.sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );

        for (const element of sortedElements) {
          try {
            // Título da sessão
            if (element.subtitle) {
              checkPageBreak(8);
              pdf.setFontSize(16);
              pdf.setTextColor(r, g, b);
              const subtitleLines = splitTextToSize(
                element.subtitle,
                maxWidth,
                16
              );
              pdf.text(subtitleLines, margin, yPosition);
              yPosition += subtitleLines.length * 6 + 8;
            }

            // Comentários/descrição da sessão
            if (element.comments) {
              const safeComments = sanitizeText(element.comments, 300);
              pdf.setFontSize(10);
              pdf.setTextColor(120, 120, 120);
              const commentsLines = splitTextToSize(safeComments, maxWidth, 10);
              checkPageBreak(commentsLines.length * 4);
              pdf.text(commentsLines, margin, yPosition);
              yPosition += commentsLines.length * 4 + 6;
            }

            // Processar apenas conteúdo visualizável (sem interações)
            switch (element.type) {
              case "text":
                if (element.text) {
                  const cleanText = cleanHtml(element.text);
                  const safeText = sanitizeText(cleanText, 1500);
                  pdf.setFontSize(11);
                  pdf.setTextColor(0, 0, 0);
                  const textLines = splitTextToSize(safeText, maxWidth, 11);
                  checkPageBreak(textLines.length * 4);
                  pdf.text(textLines, margin, yPosition);
                  yPosition += textLines.length * 4 + 8;
                }
                break;

              case "html":
                if (element.text) {
                  const cleanText = cleanHtml(element.text);
                  const safeText = sanitizeText(cleanText, 1500);
                  pdf.setFontSize(11);
                  pdf.setTextColor(0, 0, 0);
                  const textLines = splitTextToSize(safeText, maxWidth, 11);
                  checkPageBreak(textLines.length * 4);
                  pdf.text(textLines, margin, yPosition);
                  yPosition += textLines.length * 4 + 8;
                }
                break;

              case "sentences":
              case "nfsentences":
                if (element.sentences && Array.isArray(element.sentences)) {
                  element.sentences.forEach((sentence: any, index: number) => {
                    if (sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      pdf.setFontSize(11);
                      pdf.setTextColor(0, 0, 0);
                      const englishLines = splitTextToSize(
                        safeEnglish,
                        maxWidth,
                        11
                      );
                      checkPageBreak(englishLines.length * 4);
                      pdf.text(englishLines, margin, yPosition);
                      yPosition += englishLines.length * 4 + 2;

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        pdf.setFontSize(9);
                        pdf.setTextColor(120, 120, 120);
                        const portugueseLines = splitTextToSize(
                          `   ${safePortuguese}`,
                          maxWidth,
                          9
                        );
                        checkPageBreak(portugueseLines.length * 3);
                        pdf.text(portugueseLines, margin, yPosition);
                        yPosition += portugueseLines.length * 3 + 6;
                      }
                    }
                  });
                }
                break;

              case "exercise":
                if (element.items && Array.isArray(element.items)) {
                  pdf.setFontSize(12);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(5);
                  pdf.text("Exercícios:", margin, yPosition);
                  yPosition += 8;

                  element.items.forEach((item: any, index: number) => {
                    const safeItem = sanitizeText(item, 300);
                    pdf.setFontSize(10);
                    pdf.setTextColor(0, 0, 0);
                    const itemText = `${index + 1}. ${safeItem}`;
                    const itemLines = splitTextToSize(itemText, maxWidth, 10);
                    checkPageBreak(itemLines.length * 3);
                    pdf.text(itemLines, margin, yPosition);
                    yPosition += itemLines.length * 3 + 4;
                  });
                }
                break;

              case "audio":
                if (element.text) {
                  const cleanAudioText = cleanHtml(element.text);
                  const safeAudioText = sanitizeText(cleanAudioText, 3000);

                  pdf.setFontSize(14);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(7);
                  pdf.text("🎵 Conteúdo do Áudio:", margin, yPosition);
                  yPosition += 12;

                  pdf.setFontSize(11);
                  pdf.setTextColor(0, 0, 0);
                  const audioLines = splitTextToSize(
                    safeAudioText,
                    maxWidth,
                    11
                  );
                  checkPageBreak(audioLines.length * 4);
                  pdf.text(audioLines, margin, yPosition);
                  yPosition += audioLines.length * 4 + 8;
                }

                if (element.sentences && Array.isArray(element.sentences)) {
                  element.sentences.forEach((sentence: any) => {
                    if (sentence && sentence.english) {
                      const safeEnglish = sanitizeText(sentence.english, 200);
                      pdf.setFontSize(10);
                      pdf.setTextColor(0, 0, 0);
                      const englishLines = splitTextToSize(
                        safeEnglish,
                        maxWidth,
                        10
                      );
                      checkPageBreak(englishLines.length * 3);
                      pdf.text(englishLines, margin, yPosition);
                      yPosition += englishLines.length * 3 + 2;

                      if (sentence.portuguese) {
                        const safePortuguese = sanitizeText(
                          sentence.portuguese,
                          200
                        );
                        pdf.setFontSize(9);
                        pdf.setTextColor(120, 120, 120);
                        const portugueseLines = splitTextToSize(
                          `   ${safePortuguese}`,
                          maxWidth,
                          9
                        );
                        checkPageBreak(portugueseLines.length * 3);
                        pdf.text(portugueseLines, margin, yPosition);
                        yPosition += portugueseLines.length * 3 + 4;
                      }
                    }
                  });
                }
                break;

              case "images":
                if (element.images && Array.isArray(element.images)) {
                  pdf.setFontSize(14);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(7);
                  pdf.text("🖼️ Imagens da sessão:", margin, yPosition);
                  yPosition += 12;

                  element.images.forEach((imageItem: any, index: number) => {
                    if (imageItem.english) {
                      const safeEnglish = sanitizeText(imageItem.english, 100);
                      pdf.setFontSize(11);
                      pdf.setTextColor(0, 0, 0);
                      const englishLines = splitTextToSize(
                        safeEnglish,
                        maxWidth,
                        11
                      );
                      checkPageBreak(englishLines.length * 4);
                      pdf.text(englishLines, margin, yPosition);
                      yPosition += englishLines.length * 4 + 3;
                      pdf.text(englishLines, margin, yPosition);
                      yPosition += englishLines.length * 4 + 3;
                    }
                    if (imageItem.portuguese) {
                      const safePortuguese = sanitizeText(
                        imageItem.portuguese,
                        100
                      );
                    }
                  });
                }
                break;

              case "images":
                if (element.images && Array.isArray(element.images)) {
                  pdf.setFontSize(12);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(5);
                  pdf.text("🖼️ Imagens:", margin, yPosition);
                  yPosition += 8;

                  element.images.forEach((imageItem: any, index: number) => {
                    if (imageItem.english) {
                      const safeEnglish = sanitizeText(imageItem.english, 150);
                      pdf.setFontSize(10);
                      pdf.setTextColor(0, 0, 0);
                      const englishLines = splitTextToSize(
                        `• ${safeEnglish}`,
                        maxWidth,
                        10
                      );
                      checkPageBreak(englishLines.length * 3);
                      pdf.text(englishLines, margin, yPosition);
                      yPosition += englishLines.length * 3 + 2;
                    }
                    if (imageItem.portuguese) {
                      const safePortuguese = sanitizeText(
                        imageItem.portuguese,
                        150
                      );
                      pdf.setFontSize(9);
                      pdf.setTextColor(120, 120, 120);
                      const portugueseLines = splitTextToSize(
                        `   ${safePortuguese}`,
                        maxWidth,
                        9
                      );
                      checkPageBreak(portugueseLines.length * 3);
                      pdf.text(portugueseLines, margin, yPosition);
                      yPosition += portugueseLines.length * 3 + 4;
                    }
                  });
                }
                break;

              case "explanation":
                if (element.explanation && Array.isArray(element.explanation)) {
                  element.explanation.forEach(
                    (explanationItem: any, explIndex: number) => {
                      // Título da explicação
                      if (explanationItem.title) {
                        pdf.setFontSize(16);
                        pdf.setTextColor(r, g, b);
                        checkPageBreak(8);
                        const titleLines = splitTextToSize(
                          explanationItem.title,
                          maxWidth,
                          16
                        );
                        pdf.text(titleLines, margin, yPosition);
                        yPosition += titleLines.length * 6 + 10;
                      }

                      // Lista de explicações
                      if (
                        explanationItem.list &&
                        Array.isArray(explanationItem.list)
                      ) {
                        explanationItem.list.forEach(
                          (listItem: string, listIndex: number) => {
                            const safeListItem = sanitizeText(listItem, 400);
                            pdf.setFontSize(11);
                            pdf.setTextColor(0, 0, 0);
                            const listLines = splitTextToSize(
                              `• ${safeListItem}`,
                              maxWidth,
                              11
                            );
                            checkPageBreak(listLines.length * 4);
                            pdf.text(listLines, margin, yPosition);
                            yPosition += listLines.length * 4 + 4;
                          }
                        );
                      }

                      // Espaço entre explicações
                      if (explIndex < element.explanation.length - 1) {
                        yPosition += 8;
                      }
                    }
                  );
                }
                break;

              case "vocabulary":
                if (element.sentences && Array.isArray(element.sentences)) {
                  pdf.setFontSize(14);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(7);
                  pdf.text("Vocabulario:", margin, yPosition);
                  yPosition += 15;

                  element.sentences.forEach(
                    (vocab: any, vocabIndex: number) => {
                      if (vocab.english && vocab.portuguese) {
                        const safeEnglish = sanitizeText(vocab.english, 60);
                        const safePortuguese = sanitizeText(
                          vocab.portuguese,
                          60
                        );

                        // Palavra em inglês (em negrito)
                        pdf.setFontSize(12);
                        pdf.setTextColor(40, 40, 40);
                        pdf.setFont("helvetica", "bold");
                        const englishLines = splitTextToSize(
                          safeEnglish,
                          maxWidth * 0.4,
                          12
                        );
                        checkPageBreak(englishLines.length * 4);
                        pdf.text(englishLines, margin, yPosition);

                        // Hífen separador
                        pdf.setFont("helvetica", "normal");
                        pdf.setTextColor(r, g, b);
                        pdf.text("-", margin + 80, yPosition);

                        // Palavra em português (em itálico)
                        pdf.setFont("helvetica", "italic");
                        pdf.setTextColor(80, 80, 80);
                        const portugueseLines = splitTextToSize(
                          safePortuguese,
                          maxWidth * 0.4,
                          12
                        );
                        pdf.text(portugueseLines, margin + 100, yPosition);

                        // Resetar fonte para normal
                        pdf.setFont("helvetica", "normal");

                        yPosition +=
                          Math.max(
                            englishLines.length,
                            portugueseLines.length
                          ) *
                            4 +
                          5;
                      }
                    }
                  );

                  // Espaço extra após vocabulário
                  yPosition += 8;
                }
                break;

              case "dialogue":
                if (element.dialogue && Array.isArray(element.dialogue)) {
                  pdf.setFontSize(14);
                  pdf.setTextColor(r, g, b);
                  checkPageBreak(7);
                  pdf.text("Dialogo:", margin, yPosition);
                  yPosition += 15;

                  element.dialogue.forEach(
                    (dialogueText: string, dialogueIndex: number) => {
                      const speaker = dialogueIndex % 2 === 0 ? "A" : "B";
                      const safeDialogue = sanitizeText(dialogueText, 200);

                      pdf.setFontSize(11);
                      pdf.setTextColor(40, 40, 40);
                      const dialogueLine = `${speaker} - ${safeDialogue}`;
                      const dialogueLines = splitTextToSize(
                        dialogueLine,
                        maxWidth,
                        11
                      );
                      checkPageBreak(dialogueLines.length * 4);
                      pdf.text(dialogueLines, margin, yPosition);
                      yPosition += dialogueLines.length * 4 + 4;
                    }
                  );

                  // Espaço extra após diálogo
                  yPosition += 8;
                }
                break;

              // Pular elementos interativos completamente
              case "multipletexts":
              case "selectexercise":
              case "personalqanda":
              case "listenandtranslate":
              case "singleimages":
                // Não incluir elementos que requerem interação
                break;

              default:
                // Outros tipos de elemento são ignorados no PDF simples
                break;
            }

            // Espaço menor entre sessões
            yPosition += 10;
          } catch (elementError) {
            console.log(
              `⚠️ Erro ao processar elemento "${
                element.subtitle || element.type
              }" no PDF, pulando sessão:`,
              elementError
            );
          }
        }
      }

      const safeFileName = sanitizeText(classTitle || "aula", 30).replace(
        /\s+/g,
        "_"
      );
      const fileName = `${safeFileName}_conteudo.pdf`;

      // Salvar o PDF
      pdf.save(fileName);

      notifyAlert("PDF da aula gerado com sucesso!", "green");
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      notifyAlert("Erro ao gerar documento PDF. Tente novamente.", "red");
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
      //@ts-ignore

      myCom = response.data.myComments | [];
      setComments(com);
      //@ts-ignore

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
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                justifyContent: "center",
                margin: "1rem auto",
                flexWrap: "wrap",
              }}
            >
              <button
                title="Gerar PowerPoint"
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  minWidth: "50px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={generatePPT}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(-1px)";
                  target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/ppticon.png?updatedAt=1753531551291"
                  alt="PowerPoint"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>

              <button
                title="Gerar Word"
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  minWidth: "50px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={generateWord}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(-1px)";
                  target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/wordicon.png?updatedAt=1753531551302"
                  alt="Word"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>

              <button
                title="Gerar PDF"
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  minWidth: "50px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={generatePDF}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(-1px)";
                  target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/pdficon?updatedAt=1754086801314"
                  alt="PDF"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
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
                    ) : element.type === "vocabulary" ? (
                      <VocabularyLesson
                        mainTag={theclass.mainTag}
                        element={element}
                        studentId={studentID}
                        headers={headers}
                        selectedVoice={selectedVoice}
                      />
                    ) : element.type === "nfsentences" ? (
                      <NoFlashcardsSentenceLessonModel
                        element={element}
                        selectedVoice={selectedVoice}
                      />
                    ) : element.type === "text" ? (
                      <TextLessonModel
                        headers={headers}
                        text={element.text ? element.text : ""}
                        image={element.image ? element.image : ""}
                      />
                    ) : element.type === "html" ? (
                      <div
                        style={{
                          padding: "1rem",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: element.text }}
                        />
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
                    ) : element.type === "explanation" ? (
                      <ExplanationLesson headers={headers} element={element} />
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
                      <DialogueLessonModel
                        headers={headers}
                        element={element}
                      />
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
                //@ts-ignore
                style={styles.userImage}
                src={thePicture}
                alt="User"
              />
              <textarea
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                //@ts-ignore

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

                    {/* @ts-ignore */}

                    <div style={styles.commentList}>
                      {comments.map((comment: any, index: number) => (
                        //@ts-ignore

                        <div key={index} style={styles.commentBox}>
                          <img
                            //@ts-ignore

                            style={styles.userImage}
                            src={comment.photo}
                            alt="User"
                          />
                          {/* @ts-ignore */}

                          <div style={styles.commentContent}>
                            {/* @ts-ignore */}

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
                    {/* @ts-ignore */}

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
                        element={element}
                        selectedVoice={selectedVoice}
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
