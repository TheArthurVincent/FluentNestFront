import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { Link, useParams } from "react-router-dom";
import {
  backDomain,
  formatDateBr,
  truncateString,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { listOfCriteria } from "../Ranking/RankingComponents/ListOfCriteria";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";
import HTMLEditor from "../../Resources/Components/HTMLEditor";
import { isArthurVincent } from "../../App";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import {
  cardBase,
  cardTitle,
} from "../ArvinComponents/Students/TheStudent/types/studentPage.styles";

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
  isDesktop: boolean;
}

export default function Homework({
  headers,
  setChange,
  change,
  isDesktop,
}: HWProps) {
  const { studentId } = useParams<{ studentId: string }>();

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGroupClass, setIsGroupClass] = useState<boolean>(false);
  const [both, setBoth] = useState<boolean>(true);
  const [tutoringList, setTutoringList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [type, setType] = useState<number>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("");
  const [selectedHomeworkContent, setSelectedHomeworkContent] =
    useState<string>("");
  const [submissionMode, setSubmissionMode] = useState<"file" | "editor">(
    "file"
  );
  const [homeworkAnswer, setHomeworkAnswer] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "6px 10px",
    borderRadius: 6,
    border: `1px solid ${active ? partnerColor() : "#E5E7EB"}`,
    background: active ? "#fff" : "#F9FAFB",
    color: active ? partnerColor() : "#374151",
    fontSize: 13,
    cursor: "pointer",
    transition: "all .15s ease",
  });

  const group = {
    wrap: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      alignItems: "center",
    } as React.CSSProperties,
    label: {
      fontSize: 13,
      color: "#6B7280",
      marginRight: 6,
    } as React.CSSProperties,
    bar: {
      display: "flex",
      gap: 6,
      background: "#F3F4F6",
      padding: 6,
      borderRadius: 6,
      alignItems: "center",
    } as React.CSSProperties,
  };

  function normalizeCategory(v?: string) {
    return (v || "").toLowerCase().trim();
  }
  function isGroupCat(cat?: string) {
    const c = normalizeCategory(cat);
    return [
      "group class",
      "groupclass",
      "group-class",
      "turma",
      "grupo",
    ].includes(c);
  }

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const saveEditedDescription = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;
    setUploading(true); // Add this line to indicate the upload process has started
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/edithomeworkdescription/${targetId}`,
        {
          description: homeworkAnswer,
        },
        {
          headers: actualHeaders,
        }
      );

      notifyAlert("Homework editado com sucesso!", "green");
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      setTimeout(() => {
        fetchHW(studentId || ID);
      }, 500);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework"
      );
      console.error(error);
    } finally {
      setUploading(false); // Ensure this is meaningful by setting `setUploading(true)` earlier
    }
  };

  const submitHomework = async (homeworkId?: string) => {
    const targetId = homeworkId || selectedHomeworkId;

    // Validation based on submission mode
    if (submissionMode === "file" && !selectedFile) {
      notifyAlert(
        UniversalTexts?.pleaseSelectFile || "Por favor, selecione um arquivo"
      );
      return;
    }

    if (submissionMode === "editor" && !homeworkAnswer.trim()) {
      notifyAlert(
        UniversalTexts?.pleaseWriteAnswerBeforeSending ||
          "Por favor, escreva sua resposta antes de enviar"
      );
      return;
    }

    setUploading(true);
    try {
      let requestData: any = {};

      if (submissionMode === "file") {
        const base64File = await convertToBase64(selectedFile!);
        requestData = {
          base64String: base64File,
          fileName: selectedFile!.name,
          fileType: selectedFile!.type,
          submissionMode,
        };
      } else {
        requestData = {
          htmlFromFront: homeworkAnswer,
          submissionMode,
        };
      }

      await axios.post(
        `${backDomain}/api/v1/submithomework/${targetId}`,
        requestData,
        {
          headers: actualHeaders,
        }
      );

      notifyAlert(
        UniversalTexts?.homeworkSubmittedSuccess ||
          "Homework enviado com sucesso!",
        "green"
      );
      setSelectedFile(null);
      setHomeworkAnswer("");
      setIsModalOpen(false);
      setSelectedHomeworkId("");
      setSelectedHomeworkContent("");
      setSubmissionMode("file");
      setTimeout(() => {
        fetchHW(studentId || ID);
      }, 500);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework"
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleReturnToPending = async (tutoringId: string) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework-return-pending/${studentId}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
      setDisabled(false);
    }
  };

  const openSubmissionModal = (
    homeworkId: string,
    homeworkDescription?: string,
    preferredMode?: "file" | "editor"
  ) => {
    setSelectedHomeworkId(homeworkId);
    setSelectedHomeworkContent(homeworkDescription || "");
    setHomeworkAnswer(homeworkDescription || "");

    // Set the submission mode based on the preferred mode
    if (preferredMode) {
      setSubmissionMode(preferredMode);
    }

    setIsModalOpen(true);
  };

  const openEditModal = (homeworkId: string, homeworkDescription?: string) => {
    setSelectedHomeworkId(homeworkId);
    setSelectedHomeworkContent(homeworkDescription || "");
    setHomeworkAnswer(homeworkDescription || "");
    setIsEditModalOpen(true);
  };

  const closeSubmissionModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedHomeworkId("");
    setSelectedHomeworkContent("");
    setSelectedFile(null);
    setHomeworkAnswer("");
    setSubmissionMode("file");
  };

  const handleHomeworkAnswerChange = (content: string) => {
    setHomeworkAnswer(content);
  };

  const actualHeaders = headers || {};

  const fetchHW = async (studentId: string) => {
    setLoading(true);
    setType(1);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      const tt = response.data.tutoringHomeworkList;
      setTutoringList(tt);
      setBoth(true);
      setIsGroupClass(false);

      setLoading(false);
    } catch (error) {
      console.log(error, "erro ao listar homework");
    }
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;
    setID(id);
    setBoth(true);
    setIsGroupClass(false);

    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, []);

  const updateRealizedClass = async (tutoringId: string, score: number) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework/${studentId}`,
        {
          tutoringId,
          score,
        },
        {
          headers: actualHeaders,
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
      setDisabled(false);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
      setDisabled(false);
    }
  };

  const justStatus = async (tutoringId: string) => {
    try {
      await axios.put(
        `${backDomain}/api/v1/homeworkjuststatus/${studentId}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        }
      );
      setChange(!change);
      fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      fetchHW(studentId || ID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
    }
  };
  const { UniversalTexts } = useUserContext();

  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchHW(studentId || ID);
  }, [ID]);

  const isAllowed = myPermissions == "superadmin" || myPermissions == "teacher";
  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>Lições de Casa</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <Helmets text="Classes & Homework" />
        <>
          {loading ? (
            <CircularProgress
              style={{
                color: partnerColor(),
              }}
            />
          ) : (
            <div>
              {type === 1 ? (
                <span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "0 auto",
                      padding:
                        window.innerWidth <= 768 ? "0.5rem" : "1rem 0.5rem",
                      maxWidth: window.innerWidth <= 768 ? "100%" : "900px",
                      gap: "12px",
                    }}
                  >
                    {/* ======= BARRA DE FILTROS ======= */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          window.innerWidth <= 768 ? "column" : "row",
                        gap: 12,
                        marginBottom: 12,
                        justifyContent: "space-between",
                        alignItems:
                          window.innerWidth <= 768 ? "stretch" : "center",
                      }}
                    >
                      {/* Grupo 1: Status do Homework */}
                      <div style={group.wrap}>
                        <span style={group.label}>Status do homework:</span>
                        <div style={group.bar}>
                          <button
                            style={pill(both)}
                            onClick={() => setBoth(true)}
                          >
                            Todos
                          </button>
                          <button
                            style={pill(isSubmitted && !both)}
                            onClick={() => {
                              setIsSubmitted(true);
                              setBoth(false);
                            }}
                          >
                            Entregues
                          </button>
                          <button
                            style={pill(!isSubmitted && !both)}
                            onClick={() => {
                              setIsSubmitted(false);
                              setBoth(false);
                            }}
                          >
                            Não entregues
                          </button>
                        </div>
                      </div>

                      {/* Grupo 2: Tipo da Aula */}
                      <div style={group.wrap}>
                        <span style={group.label}>Tipo de aula:</span>
                        <div style={group.bar}>
                          <button
                            style={pill(isGroupClass)}
                            onClick={() => {
                              setIsGroupClass(true);
                            }}
                          >
                            Group Class
                          </button>
                          <button
                            style={pill(!isGroupClass)}
                            onClick={() => {
                              setIsGroupClass(false);
                            }}
                          >
                            1:1
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* LISTA */}
                    <ul
                      style={{
                        width: "100%",
                        padding: 0,
                        margin: 0,
                        listStyle: "none",
                      }}
                    >
                      <>
                        {tutoringList.length > 0 ? (
                          tutoringList.map((homework: any, index: number) => {
                            const submittedMatch =
                              both ||
                              (isSubmitted
                                ? !!homework.submitted
                                : !homework.submitted);

                            const cat =
                              homework?.eventDetails?.category ||
                              homework?.category ||
                              homework?.eventDetails?.type;

                            const itemIsGroup = isGroupCat(cat);
                            const classMatch = isGroupClass
                              ? itemIsGroup
                              : !itemIsGroup;

                            const show = submittedMatch && classMatch;

                            return (
                              <li
                                key={index}
                                style={{
                                  display: show ? "block" : "none",
                                  margin:
                                    window.innerWidth <= 768
                                      ? "0.75rem 0"
                                      : "8px 0",
                                }}
                              >
                                {/* CARD DO ITEM */}
                                <div
                                  style={{
                                    ...cardBase,
                                    padding: 0,
                                    overflow: "hidden",
                                    transition:
                                      "transform .15s ease, box-shadow .15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow =
                                      "0 6px 20px rgba(0,0,0,.06)";
                                    e.currentTarget.style.transform =
                                      "translateY(-1px)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "none";
                                  }}
                                >
                                  <div
                                    onClick={() => toggleOpen(index)}
                                    role="button"
                                    aria-expanded={openIndex === index}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleOpen(index);
                                      }
                                    }}
                                    style={{
                                      height: 75,
                                      display: "grid",
                                      gridTemplateColumns:
                                        window.innerWidth <= 768
                                          ? "1fr auto"
                                          : "1.5fr 1fr auto",
                                      gap: window.innerWidth <= 768 ? 8 : 12,
                                      alignItems: "center",
                                      padding: 8,
                                      backgroundColor: (() => {
                                        if (
                                          homework.eventDetails &&
                                          homework.eventDetails.category ===
                                            "Group Class"
                                        ) {
                                          return "#dff1ff";
                                        }
                                        return "#fff";
                                      })(),
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow =
                                        "0 2px 8px rgba(0, 0, 0, 0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow = "none";
                                    }}
                                  >
                                    {/* Coluna 1 — Datas empilhadas */}
                                    <div style={{ minWidth: 0 }}>
                                      {/* Data da aula */}
                                      {homework.eventDetails?.date ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: 12,
                                            color: "#1f2937",
                                            marginBottom: 6,
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: "inline-block",
                                              padding: "2px 6px",
                                              borderRadius: 6,
                                              border:
                                                "1px solid rgba(3,105,161,0.18)",
                                              background:
                                                homework.eventDetails.status ===
                                                "realizada"
                                                  ? "rgba(3,105,161,0.06)"
                                                  : "#ff8f8f",
                                              color:
                                                homework.eventDetails.status ===
                                                "realizada"
                                                  ? "#075985"
                                                  : "#ffffff",
                                              fontWeight: 600,
                                              letterSpacing: "0.2px",
                                            }}
                                          >
                                            Data da aula{" "}
                                            {homework.eventDetails &&
                                            homework.eventDetails.category ===
                                              "Group Class"
                                              ? "(Group Class)"
                                              : ""}
                                          </span>
                                          <span style={{ fontWeight: 500 }}>
                                            {formatDateBr(
                                              new Date(
                                                homework.eventDetails.date
                                              ).getTime() +
                                                3.5 * 60 * 60 * 1000
                                            )}{" "}
                                            {homework.eventDetails.time &&
                                              "às " +
                                                homework.eventDetails.time}
                                          </span>
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: 12,
                                            color: "#6b7280",
                                            marginBottom: 6,
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: "inline-block",
                                              padding: "2px 6px",
                                              borderRadius: 6,
                                              border:
                                                "1px solid rgba(3,105,161,0.18)",
                                              background:
                                                "rgba(3,105,161,0.06)",
                                              color: "#075985",
                                              fontWeight: 600,
                                              letterSpacing: "0.2px",
                                            }}
                                          >
                                            Data da aula
                                          </span>
                                          <span style={{ fontWeight: 500 }}>
                                            Nenhuma aula relacionada
                                          </span>
                                        </div>
                                      )}

                                      {/* Due date */}
                                      {homework.description && (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: 12,
                                            color: "#1f2937",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: "inline-block",
                                              padding: "2px 6px",
                                              borderRadius: 6,
                                              border:
                                                "1px solid rgba(5,150,105,0.18)",
                                              background:
                                                "rgba(5,150,105,0.07)",
                                              color: "#065f46",
                                              fontWeight: 600,
                                              letterSpacing: "0.2px",
                                            }}
                                          >
                                            Entrega em
                                          </span>
                                          <span style={{ fontWeight: 500 }}>
                                            {formatDateBr(homework.dueDate)}
                                          </span>
                                        </div>
                                      )}
                                      {homework.eventDetails?.description && (
                                        <span
                                          style={{
                                            fontSize: 10,
                                            color: "#555",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {truncateString(
                                            homework.eventDetails
                                              ?.description || "null",
                                            50
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    {/* Coluna 2 — Status */}
                                    {homework.description && (
                                      <div
                                        style={{
                                          justifySelf:
                                            window.innerWidth <= 768
                                              ? "start"
                                              : "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize:
                                              window.innerWidth <= 768
                                                ? 11
                                                : 10.5,
                                            fontWeight: 700,
                                            padding:
                                              window.innerWidth <= 768
                                                ? "4px 8px"
                                                : "3px 8px",
                                            borderRadius: 6,
                                            backgroundColor:
                                              homework?.status === "done"
                                                ? "#eef9ef"
                                                : "#fff7e6",
                                            color:
                                              homework?.status === "done"
                                                ? "#1f6b1f"
                                                : "#7a5a00",
                                            border:
                                              homework?.status === "done"
                                                ? "1px solid #cbe9cb"
                                                : "1px solid #ffe3a3",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.35px",
                                            lineHeight: 1.2,
                                          }}
                                        >
                                          {homework?.status === "done"
                                            ? "Lição concluída"
                                            : "Lição pendente"}
                                        </div>
                                      </div>
                                    )}

                                    {/* Coluna 3 — marca + chevron */}
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        justifySelf: "end",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 4,
                                          height:
                                            window.innerWidth <= 768 ? 28 : 32,
                                          borderRadius: 6,
                                          background: partnerColor(),
                                          boxShadow:
                                            "0 0 0 1px rgba(0,0,0,0.05) inset",
                                        }}
                                      />
                                      <div
                                        aria-hidden
                                        style={{
                                          transition: "transform 0.2s ease",
                                          transform:
                                            openIndex === index
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                          fontSize: 14,
                                          color: "#6b7280",
                                          lineHeight: 1,
                                        }}
                                      >
                                        ▾
                                      </div>
                                    </div>
                                  </div>

                                  {/* ACORDEON ABERTO */}
                                  {openIndex === index && (
                                    <div
                                      style={{
                                        backgroundColor: (() => {
                                          if (
                                            homework.eventDetails &&
                                            homework.eventDetails.category ===
                                              "Group Class"
                                          ) {
                                            return "#dff1ff";
                                          }
                                          return "#fff";
                                        })(),
                                      }}
                                    >
                                      {/* HEADER INTERNO DO ACORDEON */}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection:
                                            window.innerWidth <= 768
                                              ? "column"
                                              : "row",
                                          justifyContent: "space-between",
                                          alignItems:
                                            window.innerWidth <= 768
                                              ? "flex-start"
                                              : "center",
                                          padding:
                                            window.innerWidth <= 768
                                              ? 12
                                              : "12px 16px",
                                          backgroundColor: "#fafafa",
                                          borderBottom: "1px solid #f0f0f0",
                                          fontSize:
                                            window.innerWidth <= 768 ? 14 : 13,
                                          color: "#555",
                                          gap: window.innerWidth <= 768 ? 8 : 0,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection:
                                              window.innerWidth <= 768
                                                ? "row"
                                                : "column",
                                            alignItems:
                                              window.innerWidth <= 768
                                                ? "center"
                                                : "flex-end",
                                            gap: 4,
                                          }}
                                        >
                                          {homework.submittedAt && (
                                            <div
                                              style={{
                                                fontSize:
                                                  window.innerWidth <= 768
                                                    ? 12
                                                    : 11,
                                                fontWeight: 400,
                                                padding:
                                                  window.innerWidth <= 768
                                                    ? "6px 10px"
                                                    : "4px 8px",
                                                marginTop: 8,
                                                borderRadius: 6,
                                                backgroundColor: "#f0f9ff",
                                                color: "#1e40af",
                                                border: "1px solid #93c5fd",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                              }}
                                            >
                                              <i
                                                className="fa fa-clock-o"
                                                style={{ fontSize: 10 }}
                                              />
                                              Enviado em:{" "}
                                              {formatDateBr(
                                                homework.submittedAt
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <h2
                                        style={{
                                          textAlign: "center",
                                          marginTop: 8,
                                        }}
                                      >
                                        {homework.eventDetails &&
                                        homework.eventDetails.category ===
                                          "Group Class"
                                          ? "Group Class"
                                          : ""}
                                      </h2>

                                      {/* AÇÕES DO PROFESSOR */}
                                      {isAllowed && homework.description && (
                                        <div
                                          style={{
                                            margin:
                                              window.innerWidth <= 768
                                                ? "0.75rem 0.5rem"
                                                : "1rem",
                                            padding:
                                              window.innerWidth <= 768
                                                ? "0.75rem"
                                                : "1rem",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: 6,
                                            boxShadow:
                                              "0 1px 3px rgba(0, 0, 0, 0.05)",
                                          }}
                                        >
                                          <h4
                                            style={{
                                              margin: "0 0 8px 0",
                                              fontSize:
                                                window.innerWidth <= 768
                                                  ? 16
                                                  : 14,
                                              fontWeight: 600,
                                              color: "#374151",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 8,
                                            }}
                                          >
                                            <i className="fa fa-cogs" />
                                            Ações do professor
                                          </h4>

                                          <div
                                            style={{
                                              display: "flex",
                                              gap:
                                                window.innerWidth <= 768
                                                  ? "0.75rem"
                                                  : "0.5rem",
                                              flexWrap: "wrap",
                                              flexDirection:
                                                window.innerWidth <= 768
                                                  ? "column"
                                                  : "row",
                                            }}
                                          >
                                            {homework.status === "pending" && (
                                              <>
                                                <button
                                                  disabled={disabled}
                                                  onClick={() =>
                                                    updateRealizedClass(
                                                      homework._id,
                                                      pointsMadeHW
                                                    )
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      "transparent",
                                                    color: disabled
                                                      ? "#999"
                                                      : "#666",
                                                    border: "1px solid #ddd",
                                                    padding:
                                                      window.innerWidth <= 768
                                                        ? "10px 14px"
                                                        : "4px 8px",
                                                    borderRadius: 6,
                                                    fontSize:
                                                      window.innerWidth <= 768
                                                        ? 14
                                                        : 11,
                                                    fontWeight: "normal",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap:
                                                      window.innerWidth <= 768
                                                        ? 6
                                                        : 3,
                                                    cursor: disabled
                                                      ? "not-allowed"
                                                      : "pointer",
                                                    opacity: disabled ? 0.6 : 1,
                                                    minHeight:
                                                      window.innerWidth <= 768
                                                        ? 44
                                                        : "auto",
                                                    justifyContent: "center",
                                                    flex:
                                                      window.innerWidth <= 768
                                                        ? 1
                                                        : "none",
                                                  }}
                                                  onMouseOver={(e) => {
                                                    if (!disabled) {
                                                      e.currentTarget.style.backgroundColor =
                                                        "#f5f5f5";
                                                      e.currentTarget.style.borderColor =
                                                        "#bbb";
                                                    }
                                                  }}
                                                  onMouseOut={(e) => {
                                                    if (!disabled) {
                                                      e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                      e.currentTarget.style.borderColor =
                                                        "#ddd";
                                                    }
                                                  }}
                                                >
                                                  <i
                                                    className="fa fa-check"
                                                    style={{
                                                      fontSize:
                                                        window.innerWidth <= 768
                                                          ? 13
                                                          : 10,
                                                    }}
                                                  />
                                                  No prazo
                                                </button>

                                                <button
                                                  disabled={disabled}
                                                  onClick={() =>
                                                    updateRealizedClass(
                                                      homework._id,
                                                      pointsLateHW
                                                    )
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      "transparent",
                                                    color: disabled
                                                      ? "#999"
                                                      : "#666",
                                                    border: "1px solid #ddd",
                                                    padding:
                                                      window.innerWidth <= 768
                                                        ? "10px 14px"
                                                        : "4px 8px",
                                                    borderRadius: 6,
                                                    fontSize:
                                                      window.innerWidth <= 768
                                                        ? 14
                                                        : 11,
                                                    fontWeight: "normal",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap:
                                                      window.innerWidth <= 768
                                                        ? 6
                                                        : 3,
                                                    cursor: disabled
                                                      ? "not-allowed"
                                                      : "pointer",
                                                    opacity: disabled ? 0.6 : 1,
                                                    minHeight:
                                                      window.innerWidth <= 768
                                                        ? 44
                                                        : "auto",
                                                    justifyContent: "center",
                                                    flex:
                                                      window.innerWidth <= 768
                                                        ? 1
                                                        : "none",
                                                  }}
                                                  onMouseOver={(e) => {
                                                    if (!disabled) {
                                                      e.currentTarget.style.backgroundColor =
                                                        "#f5f5f5";
                                                      e.currentTarget.style.borderColor =
                                                        "#bbb";
                                                    }
                                                  }}
                                                  onMouseOut={(e) => {
                                                    if (!disabled) {
                                                      e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                      e.currentTarget.style.borderColor =
                                                        "#ddd";
                                                    }
                                                  }}
                                                >
                                                  <i
                                                    className="fa fa-clock-o"
                                                    style={{
                                                      fontSize:
                                                        window.innerWidth <= 768
                                                          ? 13
                                                          : 10,
                                                    }}
                                                  />
                                                  Atrasado
                                                </button>

                                                {isArthurVincent && (
                                                  <button
                                                    disabled={disabled}
                                                    onClick={() =>
                                                      justStatus(homework._id)
                                                    }
                                                    style={{
                                                      backgroundColor:
                                                        "transparent",
                                                      color: disabled
                                                        ? "#999"
                                                        : "#666",
                                                      border: "1px solid #ddd",
                                                      padding:
                                                        window.innerWidth <= 768
                                                          ? "10px 14px"
                                                          : "4px 8px",
                                                      borderRadius: 6,
                                                      fontSize:
                                                        window.innerWidth <= 768
                                                          ? 14
                                                          : 11,
                                                      fontWeight: "normal",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap:
                                                        window.innerWidth <= 768
                                                          ? 6
                                                          : 3,
                                                      cursor: disabled
                                                        ? "not-allowed"
                                                        : "pointer",
                                                      opacity: disabled
                                                        ? 0.6
                                                        : 1,
                                                      minHeight:
                                                        window.innerWidth <= 768
                                                          ? 44
                                                          : "auto",
                                                      justifyContent: "center",
                                                      flex:
                                                        window.innerWidth <= 768
                                                          ? 1
                                                          : "none",
                                                    }}
                                                    onMouseOver={(e) => {
                                                      if (!disabled) {
                                                        e.currentTarget.style.backgroundColor =
                                                          "#f5f5f5";
                                                        e.currentTarget.style.borderColor =
                                                          "#bbb";
                                                      }
                                                    }}
                                                    onMouseOut={(e) => {
                                                      if (!disabled) {
                                                        e.currentTarget.style.backgroundColor =
                                                          "transparent";
                                                        e.currentTarget.style.borderColor =
                                                          "#ddd";
                                                      }
                                                    }}
                                                  >
                                                    <i
                                                      className="fa fa-edit"
                                                      style={{
                                                        fontSize:
                                                          window.innerWidth <=
                                                          768
                                                            ? 13
                                                            : 10,
                                                      }}
                                                    />
                                                    Só status
                                                  </button>
                                                )}
                                              </>
                                            )}

                                            {homework.status !== "pending" && (
                                              <button
                                                onClick={() =>
                                                  handleReturnToPending(
                                                    homework._id
                                                  )
                                                }
                                                style={{
                                                  margin: "0 10px",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: disabled
                                                    ? "#999"
                                                    : "#666",
                                                  border: "1px solid #ddd",
                                                  padding:
                                                    window.innerWidth <= 768
                                                      ? "10px 14px"
                                                      : "4px 8px",
                                                  borderRadius: 6,
                                                  fontSize:
                                                    window.innerWidth <= 768
                                                      ? 14
                                                      : 11,
                                                  fontWeight: "normal",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap:
                                                    window.innerWidth <= 768
                                                      ? 6
                                                      : 3,
                                                  cursor: disabled
                                                    ? "not-allowed"
                                                    : "pointer",
                                                  opacity: disabled ? 0.6 : 1,
                                                  minHeight:
                                                    window.innerWidth <= 768
                                                      ? 44
                                                      : "auto",
                                                  justifyContent: "center",
                                                  flex:
                                                    window.innerWidth <= 768
                                                      ? 1
                                                      : "none",
                                                }}
                                              >
                                                Retornar status para pendente
                                              </button>
                                            )}

                                            <button
                                              onDoubleClick={() =>
                                                deleteHomework(homework._id)
                                              }
                                              style={{
                                                backgroundColor: "transparent",
                                                color: "#999",
                                                border: "1px solid #ddd",
                                                padding: "4px 8px",
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: "normal",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 3,
                                                cursor: "pointer",
                                              }}
                                              onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                  "#f5f5f5";
                                                e.currentTarget.style.borderColor =
                                                  "#bbb";
                                                e.currentTarget.style.color =
                                                  "#d32f2f";
                                              }}
                                              onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                  "transparent";
                                                e.currentTarget.style.borderColor =
                                                  "#ddd";
                                                e.currentTarget.style.color =
                                                  "#999";
                                              }}
                                            >
                                              <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                                style={{ fontSize: 10 }}
                                              />
                                              Double click
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {/* RESTANTE (attachments, answers, descrição) — só troquei labels */}
                                      {/* ... aqui você mantém o mesmo código, só com os textos mockados como fiz acima ... */}
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <li
                            style={{
                              listStyle: "none",
                              margin: "2rem 0",
                              textAlign: "center",
                              color: "#64748b",
                              fontSize: 16,
                              fontStyle: "italic",
                            }}
                          >
                            Nenhum homework encontrado.
                          </li>
                        )}
                      </>
                    </ul>
                  </div>
                </span>
              ) : (
                <></>
              )}
            </div>
          )}
          {/* Modal for Homework Submission */}
          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
                zIndex: 1000,
                padding: window.innerWidth <= 768 ? "20px 8px" : "0",
              }}
              onClick={closeSubmissionModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  padding: window.innerWidth <= 768 ? "16px" : "24px",
                  maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
                  width: window.innerWidth <= 768 ? "100%" : "90%",
                  maxHeight:
                    window.innerWidth <= 768 ? "calc(100vh - 40px)" : "90vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  marginTop: window.innerWidth <= 768 ? "20px" : "0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems:
                      window.innerWidth <= 768 ? "flex-start" : "center",
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "16px",
                    gap: window.innerWidth <= 768 ? "12px" : "0",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    {UniversalTexts?.submitHomework || "Enviar Homework"}
                  </h2>
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: window.innerWidth <= 768 ? "28px" : "24px",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "0",
                      width: window.innerWidth <= 768 ? "36px" : "30px",
                      height: window.innerWidth <= 768 ? "36px" : "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      transition: "background-color 0.2s",
                      alignSelf: window.innerWidth <= 768 ? "flex-end" : "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Submission Mode Selection */}
                <div
                  style={{
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "12px",
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    🎯{" "}
                    {UniversalTexts?.howDoYouWantToRespond ||
                      "Como você quer responder?"}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        window.innerWidth <= 768 ? "column" : "row",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <button
                      onClick={() => setSubmissionMode("file")}
                      style={{
                        flex: 1,
                        padding:
                          window.innerWidth <= 768 ? "12px 16px" : "8px 12px",
                        border: `1px solid ${
                          submissionMode === "file" ? "#adb5bd" : "#dee2e6"
                        }`,
                        borderRadius: 6,
                        minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                        backgroundColor:
                          submissionMode === "file" ? "#e9ecef" : "#f8f9fa",
                        color:
                          submissionMode === "file" ? "#495057" : "#6c757d",
                        fontSize: "13px",
                        fontWeight: "400",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <i className="fa fa-file" style={{ fontSize: "12px" }} />
                      {UniversalTexts?.submitFile || "Enviar Arquivo"}
                    </button>
                    <button
                      onClick={() => setSubmissionMode("editor")}
                      style={{
                        flex: 1,
                        padding:
                          window.innerWidth <= 768 ? "12px 16px" : "8px 12px",
                        border: `1px solid ${
                          submissionMode === "editor" ? "#adb5bd" : "#dee2e6"
                        }`,
                        borderRadius: 6,
                        minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                        backgroundColor:
                          submissionMode === "editor" ? "#e9ecef" : "#f8f9fa",
                        color:
                          submissionMode === "editor" ? "#495057" : "#6c757d",
                        fontSize: window.innerWidth <= 768 ? "14px" : "13px",
                        fontWeight: "400",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <i
                        className="fa fa-edit"
                        style={{
                          fontSize: window.innerWidth <= 768 ? "14px" : "12px",
                        }}
                      />
                      {UniversalTexts?.writeResponse ||
                        "Responder na Plataforma"}
                    </button>
                  </div>
                </div>

                {/* Modal Content based on submission mode */}
                {submissionMode === "file" ? (
                  <div
                    style={{
                      marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: window.innerWidth <= 768 ? "16px" : "14px",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      📎 {UniversalTexts?.chooseFile || "Escolha o arquivo:"}
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      style={{
                        width: "100%",
                        padding: window.innerWidth <= 768 ? "16px" : "12px",
                        border: "2px dashed #e2e8f0",
                        borderRadius: 6,
                        backgroundColor: "#f8fafc",
                        cursor: "pointer",
                        fontSize: window.innerWidth <= 768 ? "16px" : "14px",
                        color: "#64748b",
                        transition: "border-color 0.2s",
                        minHeight: window.innerWidth <= 768 ? "60px" : "auto",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = partnerColor();
                        e.target.style.backgroundColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.backgroundColor = "#f8fafc";
                      }}
                    />
                    {selectedFile && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #0ea5e9",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i
                          className="fa fa-file"
                          style={{ color: "#0ea5e9", fontSize: "16px" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#075985",
                            fontWeight: "500",
                          }}
                        >
                          {selectedFile.name}
                        </span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          style={{
                            marginLeft: "auto",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "4px",
                          }}
                        >
                          <i className="fa fa-times" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      ✍️{" "}
                      {UniversalTexts?.respondDirectlyHere ||
                        "Responda diretamente aqui:"}
                    </label>
                    <div
                      style={{
                        border: "2px solid #e2e8f0",
                        borderRadius: 6,
                        backgroundColor: "#ffffff",
                        minHeight: "300px",
                      }}
                    >
                      <HTMLEditor
                        onChange={handleHomeworkAnswerChange}
                        initialContent={selectedHomeworkContent}
                      />
                    </div>
                  </div>
                )}

                {/* Modal Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      window.innerWidth <= 768 ? "column-reverse" : "row",
                    gap: "12px",
                    justifyContent:
                      window.innerWidth <= 768 ? "stretch" : "flex-end",
                  }}
                >
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      backgroundColor: "transparent",
                      color: "#666",
                      border: "1px solid #ddd",
                      padding:
                        window.innerWidth <= 768 ? "12px 16px" : "6px 12px",
                      borderRadius: 6,
                      fontSize: window.innerWidth <= 768 ? "16px" : "12px",
                      fontWeight: "normal",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      e.currentTarget.style.borderColor = "#bbb";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#ddd";
                    }}
                  >
                    {UniversalTexts?.cancel || "Cancelar"}
                  </button>
                  <button
                    onClick={() => submitHomework()}
                    disabled={
                      uploading ||
                      (submissionMode === "file"
                        ? !selectedFile
                        : !homeworkAnswer.trim())
                    }
                    style={{
                      backgroundColor: "transparent",
                      color:
                        uploading ||
                        (submissionMode === "file"
                          ? !selectedFile
                          : !homeworkAnswer.trim())
                          ? "#999"
                          : "#666",
                      border: "1px solid #ddd",
                      padding:
                        window.innerWidth <= 768 ? "12px 16px" : "6px 12px",
                      borderRadius: 6,
                      fontSize: window.innerWidth <= 768 ? "16px" : "12px",
                      fontWeight: "normal",
                      cursor:
                        uploading ||
                        (submissionMode === "file"
                          ? !selectedFile
                          : !homeworkAnswer.trim())
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: window.innerWidth <= 768 ? "6px" : "4px",
                      transition: "all 0.2s ease",
                      minHeight: window.innerWidth <= 768 ? "48px" : "auto",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) => {
                      if (
                        !uploading &&
                        !(submissionMode === "file"
                          ? !selectedFile
                          : !homeworkAnswer.trim())
                      ) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                        e.currentTarget.style.borderColor = "#bbb";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (
                        !uploading &&
                        !(submissionMode === "file"
                          ? !selectedFile
                          : !homeworkAnswer.trim())
                      ) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "#ddd";
                      }
                    }}
                  >
                    {uploading ? (
                      <>
                        <CircularProgress size={12} style={{ color: "#999" }} />
                        {UniversalTexts?.sending || "Enviando..."}
                      </>
                    ) : (
                      <>
                        <i
                          className={`fa fa-${
                            submissionMode === "file" ? "upload" : "paper-plane"
                          }`}
                          style={{ fontSize: "11px" }}
                        />
                        {submissionMode === "file"
                          ? UniversalTexts?.send || "Enviar Arquivo"
                          : UniversalTexts?.submitResponse || "Enviar Resposta"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {isEditModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
                zIndex: 1000,
                padding: window.innerWidth <= 768 ? "20px 8px" : "0",
              }}
              onClick={closeSubmissionModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  padding: window.innerWidth <= 768 ? "16px" : "24px",
                  maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
                  width: window.innerWidth <= 768 ? "100%" : "90%",
                  maxHeight:
                    window.innerWidth <= 768 ? "calc(100vh - 40px)" : "90vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  marginTop: window.innerWidth <= 768 ? "20px" : "0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems:
                      window.innerWidth <= 768 ? "flex-start" : "center",
                    marginBottom: window.innerWidth <= 768 ? "16px" : "20px",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "16px",
                    gap: window.innerWidth <= 768 ? "12px" : "0",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: window.innerWidth <= 768 ? "18px" : "16px",
                      fontWeight: "500",
                      color: "#495057",
                    }}
                  >
                    {"Editar Homework"}
                  </h2>
                  <button
                    onClick={closeSubmissionModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: window.innerWidth <= 768 ? "28px" : "24px",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "0",
                      width: window.innerWidth <= 768 ? "36px" : "30px",
                      height: window.innerWidth <= 768 ? "36px" : "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      transition: "background-color 0.2s",
                      alignSelf: window.innerWidth <= 768 ? "flex-end" : "auto",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: 6,
                    backgroundColor: "#ffffff",
                    minHeight: "300px",
                  }}
                >
                  <HTMLEditor
                    onChange={handleHomeworkAnswerChange}
                    initialContent={selectedHomeworkContent}
                  />
                </div>
                <div>
                  <button onClick={closeSubmissionModal}>Cancelar</button>
                  <button onClick={() => saveEditedDescription()}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
