import React, { useEffect, useState } from "react";
import axios from "axios";
import PptxGenJS from "pptxgenjs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import {
  backDomain,
  formatDateBrWithHour,
  getVideoEmbedUrl,
  pathGenerator,
  truncateString,
} from "../../Resources/UniversalComponents";
import { HOne } from "../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";
import { darkGreyColor, partnerColor, logoPartner } from "../../Styles/Styles";
import Helmets from "../../Resources/Helmets";
import { ImgLesson } from "./Assets/Functions/EnglishActivities.Styled";
import { IFrameVideoBlog } from "../HomePage/Blog.Styled";
import VideoLessonModel from "./Assets/LessonsModels/VideoLessonModel";
import SentenceLessonModel from "./Assets/LessonsModels/SentenceLessonModel";
import TextLessonModel from "./Assets/LessonsModels/TextLessonModel";
import MultipleTextsLessonModel from "./Assets/LessonsModels/MultipleTextsLessonModel";
import ImageLessonModel from "./Assets/LessonsModels/ImageLessonModel";
import DialogueLessonModel from "./Assets/LessonsModels/DialogueLessonModel";
import SingleImageLessonModel from "./Assets/LessonsModels/SingleImageLessonModel";
import { CircularProgress } from "@mui/material";
import NoFlashcardsSentenceLessonModel from "./Assets/LessonsModels/NoFlashcardsSentenceLessonModel";
import AudioSoundTrack from "./Assets/LessonsModels/AudioSoundTrack";
import Voice from "../../Resources/Voice";
import { notifyAlert } from "./Assets/Functions/FunctionLessons";
import { isArthurVincent } from "../../App";
import VocabularyLesson from "./Assets/LessonsModels/VocabularyLessonModel";
import ExplanationLesson from "./Assets/LessonsModels/ExplanationLesson";
import AudioFile from "./Assets/LessonsModels/AudioSoundTrackGD";
import HTMLEditor from "../../Resources/Components/HTMLEditor";
import ExerciseRunner from "./Exercises/Exercises";
import EditLesson from "./EditLesson/EditLesson";
import ExerciseLessonModel from "./Assets/LessonsModels/ExerciseLessonModel";

interface EnglishClassCourse2ModelProps {
  headers: any;
  classId: any;
  courseTitle?: any;
  previousClass?: any;
  nextClass?: any;
  setChange?: any;
  mainStudentID?: string;
  change?: any;
  fetchEventData?: any;
  canEditCourse: boolean | undefined;
}

export default function EnglishClassCourse2({
  headers,
  classId,
  previousClass,
  nextClass,
  fetchEventData,
  courseTitle,
  setChange,
  change,
  mainStudentID,
  canEditCourse,
}: EnglishClassCourse2ModelProps) {
  const [studentsList, setStudentsList] = useState<any>([]);

  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== "undefined" ? window.innerWidth > 700 : false
  );

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const baseBtnStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    padding: isDesktop ? "6px 10px" : "10px 16px",
    borderRadius: 4,
    fontSize: isDesktop ? 12 : 14,
    cursor: "pointer",
    margin: isDesktop ? "0 4px" : "4px 0",
    width: isDesktop ? "auto" : "100%",
  };
  const [studentID, setStudentID] = useState<string>(mainStudentID || "");
  const [myId, setId] = useState<string>(mainStudentID || "");
  const [thePermissions, setPermissions] = useState<string>("");
  const [editorKey, setEditorKey] = useState(0); // Force re-render key
  const [newHWDescription, setNewHWDescription] = useState("");
  const [loadingBoard, setLoadingBoard] = useState<boolean>(false);
  const [boardZoom, setBoardZoom] = useState<number>(100); // Estado para controlar o zoom da lousa em %
  const [seeOptions, setSeeOptions] = useState<boolean>(false);
  const handleHWDescriptionChange = (htmlContent: any) => {
    setConfirm(true);
    setNewHWDescription(htmlContent);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [theclass, setheClass] = useState<any>({});
  const [classTitle, setClassTitle] = useState<string>("");
  const [theStudentsWhoCompletedIt, setStudentsWhoCompletedIt] = useState<any>(
    []
  );
  const [exercise, setExercise] = useState<boolean>(false);
  const [seeEdit, setSeeEdit] = useState<boolean>(false);
  const [classLanguage, setClassLanguage] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [commentsTrigger, setCommentsTrigger] = useState<boolean>(false);
  const [seeAudios, setSeeAudios] = useState<boolean>(false);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [barOffset, setBarOffset] = React.useState(96); // fallback
  const [activeId, setActiveId] = React.useState<string>("");
  const sectionElems = React.useMemo(
    () =>
      (theclass?.elements || []).sort((a: any, b: any) => a.order - b.order),
    [theclass?.elements]
  );

  const makeId = (title: string, idx: number) =>
    `${String(title || "-")}-${idx}`;

  // mede a altura real da barra sticky pra offset
  React.useEffect(() => {
    const measure = () => {
      if (!barRef.current) return;
      setBarOffset(
        Math.ceil(barRef.current.getBoundingClientRect().height + 10)
      ); // +10px respiro
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // rolar com offset respeitando a barra
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // primeiro aproxima a seção
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // depois corrige o offset da sticky bar
    setTimeout(() => {
      window.scrollBy({ top: -barOffset, left: 0, behavior: "instant" as any });
    }, 0);
  };

  // destacar seção ativa (IntersectionObserver)
  React.useEffect(() => {
    const els = sectionElems
      .map((e: any, i: number) =>
        document.getElementById(makeId(e.subtitle, i))
      )
      .filter(Boolean) as Element[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pega a que mais aparece no viewport
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        // disparar quando ~30% visível, considerando a barra
        rootMargin: `-${barOffset}px 0px 0px 0px`,
        threshold: [0.3, 0.6, 0.9],
      }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionElems, barOffset]);

  // arraste horizontal no scroller
  const dragState = React.useRef<{
    down: boolean;
    startX: number;
    scrollLeft: number;
  }>({
    down: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollerRef.current) return;
    dragState.current.down = true;
    dragState.current.startX = e.pageX - scrollerRef.current.offsetLeft;
    dragState.current.scrollLeft = scrollerRef.current.scrollLeft;
  };
  const onMouseLeave = () => (dragState.current.down = false);
  const onMouseUp = () => (dragState.current.down = false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.down || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1; // sensibilidade
    scrollerRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  // rolagem com roda do mouse → horizontal quando necessário
  const onWheel = (e: React.WheelEvent) => {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollerRef.current.scrollLeft += e.deltaY;
    }
  };
  const actualHeaders = headers || {};

  const handleStudentChange = (event: any) => {
    setFlag(!flag);
    var theid = event.target.value;
    const selectedStudent = studentsList.find(
      (student: any) => student.id === theid
    );
    setStudentID(theid);
    handleGetBoard(theid);
    localStorage.setItem("selectedStudentID", theid);
    setIsCompleted(theStudentsWhoCompletedIt.includes(event.target.value));

    if (selectedStudent) {
      setStudentName(selectedStudent.name + " " + selectedStudent.lastname);
    }
  };

  var exerciseScore = async (score: number, description: string) => {
    try {
      var response = await axios.put(
        `${backDomain}/api/v1/exercise-score/${studentID}`,
        {
          score,
          description,
        },
        { headers: actualHeaders || undefined }
      );
      notifyAlert(response.data.message || "Sucesso", partnerColor());
    } catch (error) {
      notifyAlert("Erro ao pontuar");
    }
  };

  const getClass = async () => {
    setLoading(true);
    const user = localStorage.getItem("loggedIn");
    const { id, permissions } = JSON.parse(user || "");
    setPermissions(permissions);
    const selectedStudentID = localStorage.getItem("selectedStudentID") || null;
    if (user) {
      setId(id);
      setStudentID(selectedStudentID || id);
      handleGetBoard(id);
    }
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers: actualHeaders }
      );

      var clss = response.data.classDetails;
      setClassLanguage(response.data.classDetails.language);
      setClassTitle(response.data.classDetails.title);
      setStudentsWhoCompletedIt(
        response.data.classDetails.studentsWhoCompletedIt
      );
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
      setLoading(false);
    }
  };

  const downloadBoardPDF = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    iframe.contentDocument!.open();
    iframe.contentDocument!.write(`
<html>
  <head>
    <title>Board PDF</title>
    <style>
              @import url("https://fonts.googleapis.com/css2?family=Athiti:wght@200;300;400;500;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Athiti:wght@200;300;400;500;600;700&family=Electrolize&family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Gotu&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,900&family=PT+Sans+Narrow:wght@400;700&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Athiti:wght@200;300;400;500;600;700&family=Electrolize&family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Gotu&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,900&family=PT+Sans+Narrow:wght@400;700&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&family=East+Sea+Dokdo&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Athiti&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=PT+Sans&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Ubuntu&display=swap");
                body {padding: 24px; }
                h1, h2, h3 { color: ${partnerColor()}; }
                img { max-width: 100%; border-radius: 4px; margin-bottom: 1rem; }
                p { font-size: 18px; margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <span style="font-size: 12px; color: gray"
        >${formatDateBrWithHour(new Date())}</span
      >
              <span style="font-size: 12px; color: gray"
        >${studentName}</span
      >
      <img src="${logoPartner()}" alt="logo" style="max-width: 70px" />
    </div>
    <div>${newHWDescription}</div>
  
  
    </body>
</html>
  `);
    iframe.contentDocument!.close();
    setTimeout(() => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      document.body.removeChild(iframe);
    }, 500);
  };

  const handleToggle = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/course/${classId}`,
        { studentID },
        { headers: actualHeaders }
      );
      var studentsWhoCompletedItUpdated = response.data.studentsWhoCompletedIt;
      setStudentsWhoCompletedIt(studentsWhoCompletedItUpdated);
      setIsCompleted(response.data.studentsWhoCompletedIt.includes(studentID));
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
        `${backDomain}/api/v1/handlecurrentclass`,
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

      const safeSubtitle = sanitizeText(`${courseTitle || ""}`, 60);
      const subtitleY = theclass.image ? 4.2 : 2;
      titleSlide.addText(safeSubtitle, {
        x: 0.5,
        y: subtitleY,
        w: 9,
        h: 0.8,
        fontSize: 16,
        align: "center",
        color: darkGreyColor().replace("#", ""),
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
        const sortedElements = theclass.elements;

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
                    fontSize: 16,
                    align: "center",
                    color: darkGreyColor().replace("#", ""),
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
                          fontSize: 16,
                          bold: true,
                          color: partnerColor().replace("#", ""),
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
                          });

                          // Hífen separador
                          currentSlide.addText("-", {
                            x: 4.5,
                            y: yPos,
                            w: 1,
                            h: 0.6,
                            fontSize: 16,
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
                    });

                    const genericText = `Este slide representa um elemento do tipo "${element.type}". \\n\\nEdite este conteúdo conforme necessário.`;
                    genericSlide.addText(genericText, {
                      x: 1,
                      y: 4,
                      w: 8,
                      h: 2,
                      fontSize: 16,
                      align: "center",
                      color: darkGreyColor().replace("#", ""),
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

      notifyAlert("PowerPoint gerado com sucesso!", partnerColor());
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
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Subtítulo
      const safeSubtitle = sanitizeText(`${courseTitle || ""}`, 60);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: safeSubtitle,
              size: 24,
              color: darkGreyColor().replace("#", ""),
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
                            }),
                            new TextRun({
                              text: safeDialogue,
                              size: 18,
                              color: darkGreyColor().replace("#", ""),
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
      notifyAlert("Documento Word gerado com sucesso!", partnerColor());
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
      const safeSubtitle = sanitizeText(`${courseTitle || ""}`, 60);
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
                        pdf.setFont("helvetica", "normal");
                        pdf.setTextColor(r, g, b);
                        pdf.text("-", margin + 80, yPosition);
                        pdf.setFont("helvetica", "italic");
                        pdf.setTextColor(80, 80, 80);
                        const portugueseLines = splitTextToSize(
                          safePortuguese,
                          maxWidth * 0.4,
                          12
                        );
                        pdf.text(portugueseLines, margin + 100, yPosition);
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

      notifyAlert("PDF da aula gerado com sucesso!", partnerColor());
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
    }, 1000);
  }, [studentID, mainStudentID]);

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

  const [confirm, setConfirm] = useState(false);
  const [seeConfirm, setSeeConfirm] = useState(false);
  const [flag, setFlag] = useState(false);
  const [studentName, setStudentName] = useState("");

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

  const NXTClass = () => {
    window.location.assign(
      `/teaching-materials/${pathGenerator(courseTitle || "")}/${
        nextClass || ""
      }`
    );
  };

  const PVSClass = () => {
    window.location.assign(
      `/teaching-materials/${pathGenerator(courseTitle || "")}/${
        previousClass || ""
      }`
    );
  };

  const [comment, setComment] = useState("");
  const [seeCheck, setSeeCheck] = useState(false);
  const [boardDate, setBoardDate] = useState<Date | any>(null);

  const handleSaveBoard = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/board/${classId}?student=${studentID}`,
        { content: newHWDescription, date: new Date() },
        { headers: actualHeaders }
      );
      setConfirm(false);
      setSeeCheck(true);
      setSeeConfirm(false);
      setBoardDate(new Date());
      setTimeout(() => {
        setSeeCheck(false);
      }, 2000);
    } catch (error) {
      console.error(error, "Erro ao buscar comentários");
    }
  };

  const [seeBoard, setSeeBoard] = useState(false);

  const handleGetBoard = async (id: string) => {
    setLoadingBoard(true);
    setConfirm(false);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/board/${classId}?student=${id}`,
        { headers: actualHeaders }
      );
      if (!response.data.studentSavedBoard) {
        setNewHWDescription(generateInitialBoardContent());
        setEditorContent(generateInitialBoardContent());
        setLoadingBoard(false);
        return;
      }
      setEditorContent(response.data.studentSavedBoard);
      setBoardDate(response.data.date);
      setNewHWDescription(response.data);
      setLoadingBoard(false);
    } catch (error) {
      setLoadingBoard(false);

      console.error(error, "Erro ao buscar comentários");
    }
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  const [editorContent, setEditorContent] = useState<string>("");
  const generateInitialBoardContent = () => {
    const p = (html: string) => `<p>${html}</p>`;
    const b = (txt: string) => `<b>${sanitizeText(txt, 300)}</b>`;
    const i = (txt: string) => `<i>${sanitizeText(txt, 300)}</i>`;

    let content = "";

    // Título da aula (como título -> negrito)
    content += p(b(sanitizeText(classTitle || "Aula de Inglês", 100)));

    // Data (apenas <p>)
    content += p(`Data: ${new Date().toLocaleDateString("pt-BR")}`);

    if (theclass.elements && Array.isArray(theclass.elements)) {
      const sortedElements = theclass.elements.sort(
        (a: any, b: any) => (a.order || 0) - (b.order || 0)
      );

      sortedElements.forEach((element: any) => {
        // Subtítulo (título -> negrito)
        if (element.subtitle) {
          content += p(`<b>${sanitizeText(element.subtitle, 100)}</b></br>`);
        }

        // Descrição (apenas <p>)
        if (element.description) {
          content += p(sanitizeText(element.description, 300));
        }

        switch (element.type) {
          case "text":
            if (element.text) {
              content += p(sanitizeText(element.text, 2000));
            }
            break;

          case "sentences":
          case "nfsentences":
            if (Array.isArray(element.sentences)) {
              element.sentences.forEach((s: any) => {
                if (s.english) content += p(sanitizeText(s.english, 200));
              });
            }
            break;

          case "exercise":
            if (Array.isArray(element.items)) {
              content += p(b("Exercícios:"));
              element.items.forEach((item: any, idx: number) => {
                content += p(`${idx + 1}. ${sanitizeText(item, 300)}`);
              });
            }
            break;

          case "html":
            // Mantém apenas texto plano para respeitar "somente <p>"
            if (element.text) {
              const plain = sanitizeText(
                element.text.replace(/<[^>]+>/g, " "),
                2000
              );
              content += p(plain);
            }
            break;

          case "audio":
            if (element.text) {
              content += p(b("Áudio:"));
              const plain = sanitizeText(
                element.text.replace(/<[^>]+>/g, " "),
                2000
              );
              content += p(plain);
            }
            if (Array.isArray(element.sentences)) {
              content += p(b("Frases do Áudio:"));
              element.sentences.forEach((s: any) => {
                if (s.english) content += p(sanitizeText(s.english, 200));
                if (s.portuguese) content += p(i(s.portuguese));
              });
            }
            break;

          case "audiosoundtrack":
            if (element.text) {
              content += p(b("Conteúdo do Áudio:"));
              const plain = sanitizeText(
                element.text.replace(/<[^>]+>/g, " "),
                2000
              );
              content += p(plain);
            }
            if (Array.isArray(element.sentences)) {
              content += p(b("Frases do Áudio:"));
              element.sentences.forEach((s: any) => {
                if (s.english) content += p(sanitizeText(s.english, 200));
                if (s.portuguese) content += p(i(s.portuguese));
              });
            }
            break;

          case "images":
          case "singleimages":
            // Imagens omitidas para manter apenas <p>; se houver legendas, mostramos:
            if (Array.isArray((element as any).images)) {
              (element.images as any[]).forEach((imgItem: any) => {
                if (imgItem?.english)
                  content += p(sanitizeText(imgItem.english, 100));
                if (imgItem?.portuguese) content += p(i(imgItem.portuguese));
              });
            }
            break;

          case "explanation":
            if (Array.isArray(element.explanation)) {
              element.explanation.forEach((ex: any) => {
                if (ex.title) content += p(b(ex.title));
                if (Array.isArray(ex.list)) {
                  ex.list.forEach((li: string) => {
                    content += p(`• ${sanitizeText(li, 400)}`);
                  });
                }
              });
            }
            break;

          case "vocabulary":
            if (Array.isArray(element.sentences)) {
              content += p(b("Vocabulário:"));
              element.sentences.forEach((v: any) => {
                if (v.english && v.portuguese) {
                  content += p(
                    `${sanitizeText(v.english, 100)} - ${i(v.portuguese)}`
                  );
                } else if (v.english) {
                  content += p(sanitizeText(v.english, 100));
                } else if (v.portuguese) {
                  content += p(i(v.portuguese));
                }
              });
            }
            break;

          case "dialogue":
            if (Array.isArray(element.dialogue)) {
              content += p(b("Diálogo:"));
              element.dialogue.forEach((line: string, idx: number) => {
                const speaker = idx % 2 === 0 ? "A" : "B";
                content += p(`${speaker}: ${sanitizeText(line, 200)}`);
              });
            }
            break;
          default:
            break;
        }
      });
    }

    return content;
  };

  useEffect(() => {
    if (!editorContent && theclass && classTitle) {
      setEditorContent(generateInitialBoardContent());
    }
    // eslint-disable-next-line
  }, [theclass, classTitle, courseTitle || ""]);

  const [hasAudioElement, setHasAudioElement] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  useEffect(() => {
    if (theclass?.elements && Array.isArray(theclass.elements)) {
      const found = theclass.elements.some(
        (el: any) =>
          (el && el.type === "audio") || (el && el.type === "audiosoundtrack")
      );
      setHasAudioElement(found);
      // Reset audio index when class changes
      setCurrentAudioIndex(0);
    } else {
      setHasAudioElement(false);
      setCurrentAudioIndex(0);
    }
  }, [theclass]);

  return (
    <div
      style={{
        // margin: "auto",
        padding: mainStudentID ? 0 : "1rem",
        minHeight: theclass?.elements?.length > 0 ? "80vh" : "none",
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 600,
        fontStyle: "SemiBold",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
      }}
    >
      {classTitle && <Helmets text={classTitle || ""} />}
      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <>
          {!seeEdit && (
            <>
              {!mainStudentID && (
                <>
                  {" "}
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
                        fontSize: "14px",
                        color: "#000",
                      }}
                      to="/teaching-materials"
                    >
                      Materiais de Ensino
                    </Link>{" "}
                    -{" "}
                    <Link
                      style={{
                        textDecoration: "none",
                        fontSize: "14px",
                        color: "#000",
                      }}
                      to={`/teaching-materials/${pathGenerator(
                        courseTitle || "" || ""
                      )}`}
                    >
                      {courseTitle || ""
                        ? truncateString(courseTitle || "", 25)
                        : "..."}
                    </Link>{" "}
                    <span style={{ color: darkGreyColor() }}>-</span>
                    <span
                      style={{
                        textDecoration: "none",
                        fontStyle: "italic",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: partnerColor(),
                      }}
                    >
                      {theclass?.title
                        ? truncateString(theclass.title, 25)
                        : "..."}
                    </span>
                  </div>
                  <div
                    style={{
                      display: !exercise ? "flex" : "none",
                      margin: "1rem auto",
                      padding: "0 1rem",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color:
                          previousClass && previousClass !== "123456"
                            ? partnerColor()
                            : "#eee",
                        cursor:
                          previousClass && previousClass !== "123456"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={PVSClass}
                    >
                      <i className="fa fa-arrow-left" aria-hidden="true" />
                    </span>
                    <HOne
                      style={{
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      {theclass.title}
                    </HOne>
                    {nextClass && (
                      <span
                        style={{
                          color:
                            nextClass && nextClass !== "123456"
                              ? partnerColor()
                              : "#eee",
                          cursor:
                            nextClass && nextClass !== "123456"
                              ? "pointer"
                              : "default",
                        }}
                        onClick={NXTClass}
                      >
                        <i className="fa fa-arrow-right" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {!exercise && (
            <>
              {canEditCourse && !seeBoard && thePermissions !== "student" && (
                <EditLesson
                  setChange={setChange}
                  change={change}
                  studentId={myId}
                  buttonText={"Editar Aula"}
                  setSeeEdit={setSeeEdit}
                  headers={actualHeaders}
                  classId={classId}
                  language={classLanguage}
                  fetchEventData={fetchEventData}
                />
              )}
            </>
          )}
          {!seeEdit && (
            <>
              {!seeBoard ? (
                <>
                  <div
                    style={{
                      display: "grid",
                      zIndex: 2,
                      top: "-10px",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "0.5rem 0",
                        marginBottom: "0",
                        boxSizing: "border-box",
                        padding: "4px 8px",
                        background: "rgba(255,255,255)",
                        flexWrap: "wrap",
                        gap: "8px",
                        backdropFilter: "saturate(1.1) blur(2px)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {!mainStudentID && (
                          <select
                            onChange={(e) => handleStudentChange(e)}
                            value={studentID}
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#f8fafc",
                              fontSize: "11px",
                              fontWeight: "400",
                              color: "#64748b",
                              padding: "4px 6px",
                              height: "28px",
                              maxWidth: "70px",
                              outline: "none",
                              cursor: "pointer",
                              display:
                                thePermissions === "superadmin" ||
                                thePermissions === "teacher"
                                  ? "block"
                                  : "none",
                            }}
                            onFocus={(e) =>
                              (e.currentTarget.style.borderColor =
                                partnerColor())
                            }
                            onBlur={(e) =>
                              (e.currentTarget.style.borderColor = "#e2e8f0")
                            }
                          >
                            {studentsList.map((student: any, index: number) => (
                              <option key={index} value={student.id}>
                                {truncateString(
                                  student.name + " " + student.lastname,
                                  15
                                )}
                              </option>
                            ))}
                          </select>
                        )}
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {theclass?.elements?.length > 0 && (
                            <Voice
                              maxW="70px"
                              changeB={changeNumber}
                              setChangeB={setChangeNumber}
                              chosenLanguage={classLanguage}
                            />
                          )}
                        </span>
                      </div>
                      {theclass?.elements?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => setExercise(!exercise)}
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#f8fafc",
                              fontSize: "11px",
                              fontWeight: "400",
                              color: "#64748b",
                              padding: "4px 6px",
                              height: "28px",
                              outline: "none",
                              cursor: "pointer",
                              display: "block",
                            }}
                          >
                            {exercise ? "Voltar à Aula" : "Fazer Exercícios"}
                          </button>
                          {!exercise && (
                            <div
                              className="isMobileDisapear"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <button
                                title="Gerar PowerPoint"
                                style={{
                                  all: "unset",
                                  cursor: "pointer",
                                  padding: "4px 6px",
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "4px",
                                }}
                                onClick={generatePPT}
                                onMouseEnter={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f1f5f9";
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f8fafc";
                                }}
                              >
                                <img
                                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/ppticon.png?updatedAt=1753531551291"
                                  alt="PowerPoint"
                                  style={{ width: "12px", height: "12px" }}
                                />
                              </button>
                              <button
                                title="Gerar Word"
                                style={{
                                  all: "unset",
                                  cursor: "pointer",
                                  padding: "4px 6px",
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "4px",
                                }}
                                onClick={generateWord}
                                onMouseEnter={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f1f5f9";
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f8fafc";
                                }}
                              >
                                <img
                                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/wordicon.png?updatedAt=1753531551302"
                                  alt="Word"
                                  style={{ width: "12px", height: "12px" }}
                                />
                              </button>
                              <button
                                title="Gerar PDF"
                                style={{
                                  all: "unset",
                                  cursor: "pointer",
                                  padding: "4px 6px",
                                  backgroundColor: "#f8fafc",
                                  borderRadius: "4px",
                                }}
                                onClick={generatePDF}
                                onMouseEnter={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f1f5f9";
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.background = "#f8fafc";
                                }}
                              >
                                <img
                                  src="https://ik.imagekit.io/vjz75qw96/assets/icons/pdficon?updatedAt=1754086801314"
                                  alt="PDF"
                                  style={{ width: "12px", height: "12px" }}
                                />
                              </button>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  fontWeight: "400",
                                  color: "#64748b",
                                }}
                              >
                                <input
                                  style={{
                                    cursor: "pointer",
                                    width: "12px",
                                    height: "12px",
                                    accentColor: partnerColor(),
                                  }}
                                  type="checkbox"
                                  checked={isCompleted}
                                  onChange={handleToggle}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </span>

                    {!seeBoard &&
                      !exercise &&
                      theclass?.elements?.length > 0 && (
                        <span
                          style={{
                            backgroundColor: "#fff",
                            padding: "2px ",
                            display: "block",
                            width: "100%",
                            boxSizing: "border-box",
                            borderRadius: "6px",
                            overflowX: "auto",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                            }}
                          >
                            <div
                              ref={scrollerRef}
                              onMouseDown={onMouseDown}
                              onMouseLeave={onMouseLeave}
                              onMouseUp={onMouseUp}
                              onMouseMove={onMouseMove}
                              onWheel={onWheel}
                              style={{
                                display: "flex",
                                flexWrap: "nowrap",
                                alignItems: "center",
                                overflowX: "auto",
                                minWidth: 0, // ⬅️ permite encolher e criar overflow
                                gap: "5px",
                                padding: "2px",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                touchAction: "pan-x", // ⬅️ melhora no touch
                                overscrollBehaviorX: "contain", // ⬅️ evita “puxar” a página
                              }}
                              className="topbar-sections"
                            >
                              <style>{`.topbar-sections::-webkit-scrollbar { display: none; }`}</style>
                              {sectionElems.map((s: any, i: number) => {
                                // Só renderiza se tiver subtitle e não for exercise/selectexercise
                                if (!s.subtitle || s.type === "selectexercise")
                                  return null;

                                const id = makeId(s.subtitle, i);
                                const isActive = id === activeId;

                                return (
                                  <button
                                    key={i}
                                    style={{
                                      all: "unset", // ok manter
                                      display: "inline-flex", // importante p/ flex container
                                      alignItems: "center",
                                      flex: "0 0 auto", // não encolher (gera overflow)
                                      cursor: "pointer",
                                      fontWeight: isActive ? "600" : "500",
                                      borderBottom: isActive
                                        ? `1px solid ${partnerColor()}`
                                        : "1px solid transparent",
                                      color: isActive ? "grey" : "#64748b",
                                      padding: "4px 6px", // área de clique
                                      textTransform: "uppercase",
                                      fontSize: "10px", // (8px pode ficar minúsculo)
                                    }}
                                    onMouseOver={(e) => {
                                      (e.target as HTMLElement).style.color =
                                        partnerColor();
                                      (
                                        e.target as HTMLElement
                                      ).style.backgroundColor = "#eeeeeeb4";
                                    }}
                                    onMouseOut={(e) => {
                                      (e.target as HTMLElement).style.color =
                                        isActive ? "grey" : "#64748b";
                                      (
                                        e.target as HTMLElement
                                      ).style.backgroundColor = "transparent";
                                    }}
                                    onClick={() => scrollToSection(id)}
                                  >
                                    {truncateString(s.subtitle, 12)}
                                  </button>
                                );
                              })}
                            </div>
                          </span>
                        </span>
                      )}
                  </div>
                  {!exercise ? (
                    <>
                      {theclass?.elements?.length > 0 && (
                        <div
                          style={{
                            maxWidth: "780%",
                            margin: "0 auto",
                            background: "#ffffff",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              background: `${partnerColor()}05`,
                              borderRadius: "50%",
                              zIndex: 0,
                              opacity: 0.3,
                            }}
                          />
                          {theclass.image && (
                            <ImgLesson
                              src={theclass.image}
                              alt={theclass.subtitle}
                            />
                          )}

                          {theclass.description && (
                            <div
                              style={{
                                margin: "1rem auto",
                                maxWidth: "800px",
                                fontSize: "16px",
                                textAlign: "center",
                                color: darkGreyColor(),
                                lineHeight: 1.5,
                              }}
                            >
                              {theclass.description}
                            </div>
                          )}
                          {theclass.video && isArthurVincent && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                              }}
                            >
                              <IFrameVideoBlog
                                src={getVideoEmbedUrl(theclass.video)}
                              />
                            </div>
                          )}
                          <div
                            style={{
                              position: "relative",
                              zIndex: 1,
                              paddingBottom: "40px",
                            }}
                          >
                            {theclass.elements &&
                              theclass.elements
                                .sort((a: any, b: any) => a.order - b.order)
                                .map((element: any, index: number) => (
                                  <div
                                    key={index}
                                    id={makeId(element.subtitle, index)}
                                    style={{
                                      margin: "24px 0",
                                      position: "relative",
                                      scrollMarginTop: `${barOffset + 4}px`,
                                    }}
                                  >
                                    {element.subtitle &&
                                      element.type !== "selectexercise" && (
                                        <div
                                          style={{
                                            // position: "sticky",
                                            display: element.subtitle
                                              ? "block"
                                              : "none",
                                            top: "4rem",
                                            zIndex: 4,
                                            marginBottom: 8,
                                            background:
                                              "rgba(255,255,255,0.98)",
                                            backdropFilter:
                                              "saturate(1.1) blur(6px)",
                                            borderBottom: `2px solid ${partnerColor()}15`,
                                            borderRadius: 4,
                                          }}
                                        >
                                          <h2
                                            style={{
                                              margin: 0,
                                              padding: "10px",
                                              fontSize: "18px",
                                              fontWeight: 600,
                                              color: partnerColor(),
                                              textAlign: "center",
                                            }}
                                          >
                                            {element.subtitle}
                                          </h2>
                                        </div>
                                      )}
                                    {element.image && element.subtitle && (
                                      <ImgLesson
                                        src={element.image}
                                        alt={element.subtitle}
                                      />
                                    )}
                                    {element.video &&
                                      element.subtitle &&
                                      isArthurVincent && (
                                        <VideoLessonModel element={element} />
                                      )}

                                    {element.comments && (
                                      <p
                                        style={{
                                          padding: "0.5rem",
                                          textAlign: "center",
                                          backgroundColor: "#f6f6f6",
                                          borderRadius: "4px",
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
                                        studentId={mainStudentID || studentID}
                                        headers={headers}
                                        selectedVoice={selectedVoice}
                                      />
                                    ) : element.type === "vocabulary" ? (
                                      <VocabularyLesson
                                        mainTag={theclass.mainTag}
                                        element={element}
                                        studentId={mainStudentID || studentID}
                                        headers={headers}
                                        selectedVoice={selectedVoice}
                                      />
                                    ) : element.type === "nfsentences" ? (
                                      <NoFlashcardsSentenceLessonModel
                                        element={element}
                                        selectedVoice={selectedVoice}
                                      />
                                    ) : element.type === "audio" ? (
                                      <AudioFile
                                        selectedVoice={selectedVoice}
                                        element={element}
                                      />
                                    ) : element.type === "text" ? (
                                      <TextLessonModel
                                        headers={headers}
                                        text={element.text ? element.text : ""}
                                        image={
                                          element.image ? element.image : ""
                                        }
                                      />
                                    ) : element.type === "html" ? (
                                      <div
                                        style={{
                                          padding: "1rem",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: element.text,
                                          }}
                                        />
                                      </div>
                                    ) : element.type === "multipletexts" ? (
                                      <MultipleTextsLessonModel
                                        headers={headers}
                                        element={element}
                                      />
                                    ) : // ) : element.type === "selectexercise" ? (
                                    //   <SelectExercise
                                    //     headers={headers}
                                    //     element={element}
                                    //     selectedVoice={selectedVoice}
                                    //   />
                                    element.type === "images" ? (
                                      <ImageLessonModel
                                        studentId={studentID}
                                        mainTag={theclass.mainTag}
                                        id={myId}
                                        headers={headers}
                                        element={element}
                                        selectedVoice={selectedVoice}
                                      />
                                    ) : element.type === "explanation" ? (
                                      <ExplanationLesson
                                        headers={headers}
                                        element={element}
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
                                    ) : element.type === "dialogue" ? (
                                      <DialogueLessonModel
                                        headers={headers}
                                        element={element}
                                        language={classLanguage}
                                      />
                                    ) : element.type === "singleimages" ? (
                                      <SingleImageLessonModel
                                        headers={headers}
                                        element={element}
                                      />
                                    ) : element.type === "exercise" ? (
                                      <ExerciseLessonModel
                                        headers={headers}
                                        item={element.items}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <ExerciseRunner
                      key={`exercises-${studentID}`} // Force re-render when student changes
                      classId={theclass._id}
                      exerciseScore={exerciseScore}
                      elements={theclass.elements}
                      count={1000000}
                      dictationItems={10000000}
                      studentId={studentID}
                      headers={headers}
                      selectedVoice={selectedVoice}
                      language={classLanguage}
                    />
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      padding: 10,
                      maxWidth: "99%",
                      margin: "0 auto",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        // position: "sticky",
                        top: 0,
                        zIndex: 5,
                        display: "flex",
                        flexDirection: isDesktop ? "row" : "column",
                        alignItems: isDesktop ? "center" : "stretch",
                        justifyContent: "space-between",
                        gap: isDesktop ? 12 : 8,
                        padding: isDesktop ? 10 : 8,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 100%)",
                        borderBottom: "1px solid #eef0f2",
                        backdropFilter: "saturate(1.1) blur(6px)",
                        borderRadius: isDesktop ? 12 : 8,
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Lado esquerdo: ações principais */}
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: isDesktop ? 8 : 6,
                        }}
                      >
                        {hasAudioElement && (
                          <button
                            onClick={() => setSeeAudios((v) => !v)}
                            style={{
                              ...baseBtnStyle,
                              padding: isDesktop ? "6px 10px" : "5px 8px",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Áudios
                          </button>
                        )}

                        <button
                          onClick={downloadBoardPDF}
                          title="Baixar PDF"
                          style={{
                            all: "unset",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <img
                            src="https://ik.imagekit.io/vjz75qw96/assets/icons/pdficon?updatedAt=1754086801314"
                            alt="PDF"
                            style={{ width: 18, height: 18 }}
                          />
                        </button>

                        <button
                          style={{
                            ...baseBtnStyle,
                            padding: isDesktop ? "6px 10px" : "5px 8px",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => {
                            setSeeOptions(!seeOptions);
                          }}
                        >
                          {seeOptions ? "Ocultar Opções" : "Mostrar Opções"}
                        </button>

                        {/* Grupo Restaurar/Salvar + check + data */}
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: isDesktop
                              ? "flex-end"
                              : "flex-start",
                            gap: isDesktop ? 8 : 6,
                          }}
                        >
                          <button
                            onClick={() => {
                              const template = generateInitialBoardContent();
                              setEditorKey((v) => v + 1);
                              setNewHWDescription(template);
                              setEditorContent(template);
                              setConfirm(true);
                            }}
                            title="Restaurar"
                            style={{
                              ...baseBtnStyle,
                              padding: isDesktop ? "6px 10px" : "5px 8px",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Restaurar
                          </button>

                          {confirm && (
                            <button
                              onClick={handleSaveBoard}
                              style={{
                                ...baseBtnStyle,
                                padding: isDesktop ? "6px 14px" : "5px 10px",
                                fontSize: 12,
                                border: `1px solid ${
                                  partnerColor?.() || "#2563eb"
                                }`,
                                background: partnerColor?.() || "#2563eb",
                                color: "#fff",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Salvar
                            </button>
                          )}

                          {seeCheck && (
                            <i
                              className="fa fa-check"
                              style={{
                                padding: 6,
                                borderRadius: "999px",
                                backgroundColor: "#fff",
                                color: "green",
                                fontSize: 12,
                                border: "1px solid #e5e7eb",
                              }}
                            />
                          )}

                          {boardDate && (
                            <span
                              style={{
                                color: "#6b7280",
                                fontSize: 11,
                                fontStyle: "italic",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Última edição:{" "}
                              <strong>{formatDateBrWithHour(boardDate)}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lado direito: fechar / confirmação */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isDesktop ? "flex-end" : "flex-start",
                          gap: 8,
                        }}
                      >
                        {seeConfirm ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: isDesktop ? "row" : "column",
                              gap: 6,
                            }}
                          >
                            <button
                              onClick={() => {
                                setSeeAudios(false);
                                setSeeConfirm(false);
                              }}
                              style={{
                                background: "#fff",
                                color: "#111827",
                                fontSize: 12,
                                cursor: "pointer",
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => {
                                setSeeAudios(false);
                                setSeeConfirm(false);
                                setSeeBoard(false);
                                const template = generateInitialBoardContent();
                                setEditorContent(template);
                                setNewHWDescription(template);
                              }}
                              style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                padding: "6px 10px",
                                borderRadius: 6,
                                fontSize: 12,
                                cursor: "pointer",
                                border: "1px solid #fecaca",
                              }}
                            >
                              Fechar sem salvar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSeeAudios(false);
                              if (confirm) setSeeConfirm(true);
                              else setSeeBoard(false);
                            }}
                            aria-label="Fechar"
                            style={{
                              all: "unset",
                              background: "#fff",
                              cursor: "pointer",
                              color: "#b91c1c",
                              width: 18,
                              height: 18,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 999,
                              border: "1px solid #fecaca",
                              fontSize: 12,
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Controles de zoom */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        borderRadius: 8,
                        fontSize: 12,
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <button
                        onClick={() =>
                          setBoardZoom((prev) => Math.max(prev - 10, 100))
                        }
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "4px 10px",
                          background: "#f3f4f6",
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: "bold",
                          lineHeight: 1,
                        }}
                        title="Diminuir zoom (Ctrl + -)"
                      >
                        -
                      </button>
                      <span
                        style={{
                          minWidth: 48,
                          textAlign: "center",
                          fontVariantNumeric: "tabular-nums",
                          fontSize: 12,
                          color: "#4b5563",
                        }}
                      >
                        {Math.round(boardZoom)}%
                      </span>
                      <button
                        onClick={() =>
                          setBoardZoom((prev) => Math.min(prev + 10, 200))
                        }
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "4px 10px",
                          background: "#f3f4f6",
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: "bold",
                          lineHeight: 1,
                        }}
                        title="Aumentar zoom (Ctrl + +)"
                      >
                        +
                      </button>
                    </div>

                    {/* Editor / Read-only */}
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {!loadingBoard ? (
                        <div
                          style={{
                            height: isDesktop ? "70vh" : "60vh",
                            overflow: "auto",
                            width: "100%",
                            padding: isDesktop ? 16 : 10,
                            boxSizing: "border-box",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              transform: `scale(${boardZoom / 100})`,
                              transformOrigin: "top center",
                              transition: "transform 0.15s ease-in-out",
                            }}
                          >
                            <div
                              style={{
                                width: "75vw",
                              }}
                            >
                              <HTMLEditor
                                key={editorKey}
                                initialContent={editorContent}
                                onChange={handleHWDescriptionChange}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            height: isDesktop ? "70vh" : "60vh",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <CircularProgress
                            style={{ color: partnerColor?.() || "#2563eb" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Áudios */}
                    {hasAudioElement && seeAudios && (
                      <div
                        style={{
                          borderRadius: isDesktop ? 12 : 10,
                          padding: isDesktop ? 12 : 10,
                          overflow: "hidden",
                          display: "grid",
                          gridTemplateRows: "auto 1fr",
                          minHeight: 0,
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          gap: 4,
                        }}
                      >
                        <div style={{ overflow: "auto", paddingTop: 4 }}>
                          {(() => {
                            const audioElements =
                              (theclass?.elements || []).filter(
                                (el: any) =>
                                  el.type === "audio" ||
                                  el.type === "audiosoundtrack"
                              ) || [];
                            const currentAudio =
                              audioElements[currentAudioIndex];
                            if (!currentAudio) return null;

                            const total = audioElements.length;

                            return (
                              <div style={{ display: "grid", gap: 6 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: isDesktop ? "row" : "column",
                                    alignItems: isDesktop
                                      ? "center"
                                      : "flex-start",
                                    justifyContent: "space-between",
                                    gap: 6,
                                  }}
                                >
                                  {currentAudio.subtitle && (
                                    <h4
                                      style={{
                                        margin: 0,
                                        fontSize: 13,
                                        color: partnerColor?.() || "#111827",
                                      }}
                                    >
                                      {currentAudio.subtitle}
                                    </h4>
                                  )}

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      paddingBottom: 4,
                                    }}
                                  >
                                    <button
                                      onClick={() =>
                                        setCurrentAudioIndex((i) =>
                                          Math.max(0, i - 1)
                                        )
                                      }
                                      disabled={currentAudioIndex === 0}
                                      style={{
                                        all: "unset",
                                        cursor:
                                          currentAudioIndex === 0
                                            ? "not-allowed"
                                            : "pointer",
                                        color:
                                          currentAudioIndex === 0
                                            ? "#cbd5e1"
                                            : partnerColor?.() || "#111827",
                                        fontSize: 16,
                                        padding: 4,
                                      }}
                                      aria-label="Anterior"
                                      title="Anterior"
                                    >
                                      ←
                                    </button>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: "#6b7280",
                                        minWidth: 40,
                                        textAlign: "center",
                                      }}
                                    >
                                      {Math.min(currentAudioIndex + 1, total)} /{" "}
                                      {total}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setCurrentAudioIndex((i) =>
                                          Math.min(total - 1, i + 1)
                                        )
                                      }
                                      disabled={currentAudioIndex >= total - 1}
                                      style={{
                                        all: "unset",
                                        cursor:
                                          currentAudioIndex >= total - 1
                                            ? "not-allowed"
                                            : "pointer",
                                        color:
                                          currentAudioIndex >= total - 1
                                            ? "#cbd5e1"
                                            : partnerColor?.() || "#111827",
                                        fontSize: 16,
                                        padding: 4,
                                      }}
                                      aria-label="Próximo"
                                      title="Próximo"
                                    >
                                      →
                                    </button>
                                    <button
                                      style={{
                                        all: "unset",
                                        cursor: "pointer",
                                        color: "#933232ff",
                                        fontSize: 12,
                                        padding: 4,
                                        borderRadius: 999,
                                      }}
                                      onClick={() => {
                                        setSeeAudios(false);
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>

                                {currentAudio.type === "audio" ? (
                                  <AudioFile
                                    hideText
                                    element={currentAudio}
                                    selectedVoice={selectedVoice}
                                  />
                                ) : (
                                  <AudioSoundTrack
                                    headers={headers}
                                    text={currentAudio.text}
                                    hideText
                                    src={currentAudio.src}
                                    studentId={studentID}
                                    mainTag={theclass.mainTag}
                                    element={currentAudio}
                                    link={currentAudio.link}
                                    subtitle={currentAudio.subtitle}
                                    selectedVoice={selectedVoice}
                                  />
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {!exercise && (
                <div
                  style={{
                    display: "flex",
                    margin: "1rem auto",
                    padding: "0 1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {previousClass && (
                    <span
                      style={{
                        color:
                          previousClass && previousClass !== "123456"
                            ? partnerColor()
                            : "#eee",
                        cursor:
                          previousClass && previousClass !== "123456"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={PVSClass}
                    >
                      <i className="fa fa-arrow-left" aria-hidden="true" />
                    </span>
                  )}

                  {nextClass && (
                    <span
                      style={{
                        color:
                          nextClass && nextClass !== "123456"
                            ? partnerColor()
                            : "#eee",
                        cursor:
                          nextClass && nextClass !== "123456"
                            ? "pointer"
                            : "default",
                      }}
                      onClick={NXTClass}
                    >
                      <i className="fa fa-arrow-right" aria-hidden="true" />
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
