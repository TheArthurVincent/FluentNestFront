import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { HOne, HTwo, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { Link } from "react-router-dom";
import {
  backDomain,
  formatDateBr,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { listOfCriteria } from "../Ranking/RankingComponents/ListOfCriteria";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor, textTitleFont, alwaysWhite } from "../../Styles/Styles";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";
import { getEmbedUrl } from "../MyCalendar/CalendarComponents/MyCalendarFuncions";
import HTMLEditor from "../../Resources/Components/HTMLEditor";

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
}

export default function Homework({ headers, setChange, change }: HWProps) {
  const [tutoringList, setTutoringList] = useState<any>([]);
  const [filteredTutoringList, setFilteredTutoringList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [ID, setID] = useState<string>("");
  const [myPermissions, setPermissions] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDueDate, setSelectedDueDate] = useState<string>("");
  const [availableDueDates, setAvailableDueDates] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("");
  const [selectedHomeworkContent, setSelectedHomeworkContent] =
    useState<string>("");
  const [submissionMode, setSubmissionMode] = useState<"file" | "editor">(
    "file"
  );
  const [homeworkAnswer, setHomeworkAnswer] = useState<string>("");

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
      notifyAlert("Por favor, escreva sua resposta antes de enviar");
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
        fetchHW(studentID);
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

  const openSubmissionModal = (
    homeworkId: string,
    homeworkDescription?: string
  ) => {
    setSelectedHomeworkId(homeworkId);
    setSelectedHomeworkContent(homeworkDescription || "");
    setHomeworkAnswer(homeworkDescription || "");
    setIsModalOpen(true);
  };

  const closeSubmissionModal = () => {
    setIsModalOpen(false);
    setSelectedHomeworkId("");
    setSelectedHomeworkContent("");
    setSelectedFile(null);
    setHomeworkAnswer("");
    setSubmissionMode("file");
  };

  const handleHomeworkAnswerChange = (content: string) => {
    setHomeworkAnswer(content);
  };
  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentID(event.target.value);
    fetchHW(event.target.value);
  };

  const fetchStudents = async () => {
    setLoading(true);
    if (ID == "") {
      setLoading(false);
      return;
    } else if (isAllowed) {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${ID}`,
          {
            headers: actualHeaders,
          }
        );
        setStudentsList(response.data.listOfStudents);
        setLoading(false);
      } catch (error) {
        notifyAlert(
          UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
        );
        console.log(error, "Erro ao encontrar alunos");
        setLoading(false);
      }
      setLoading(false);
    } else null;
  };

  const actualHeaders = headers || {};

  const fetchHW = async (studentId: string) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      const tt = response.data.tutoringHomeworkList;
      setTutoringList(tt);
      processDueDates(tt);
      console.log(tt);
      setLoading(false);
    } catch (error) {
      console.log(error, "erro ao listar homework");
    }
  };

  const processDueDates = (homeworkList: any[]) => {
    // Extract unique due dates and sort from newest to oldest
    const dueDates = [...new Set(homeworkList.map((hw) => hw.dueDate))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    setAvailableDueDates(dueDates);
    console.log("due dates:", dueDates[0]);

    // Don't auto-select first date, start with null
    // Don't show any homework until a date is selected
    if (!selectedDueDate) {
      setFilteredTutoringList([]);
    } else {
      filterHomeworkByDueDate(homeworkList, selectedDueDate);
    }
  };

  const filterHomeworkByDueDate = (homeworkList: any[], dueDate: string) => {
    if (!dueDate) {
      setFilteredTutoringList(homeworkList);
      return;
    }

    const filtered = homeworkList.filter((hw) => hw.dueDate === dueDate);
    setFilteredTutoringList(filtered);
  };

  const handleDueDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDueDate = event.target.value;
    setSelectedDueDate(newDueDate);
    filterHomeworkByDueDate(tutoringList, newDueDate);
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;
    setStudentID(id);
    setID(id);
    fetchHW(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [ID]);

  useEffect(() => {
    if (tutoringList.length > 0) {
      if (!selectedDueDate) {
        setFilteredTutoringList([]);
      } else {
        filterHomeworkByDueDate(tutoringList, selectedDueDate);
      }
    }
  }, [selectedDueDate, tutoringList]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const updateRealizedClass = async (tutoringId: string, score: number) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework/${studentID}`,
        {
          tutoringId,
          score,
        },
        {
          headers: actualHeaders,
        }
      );
      setChange(!change);
      fetchHW(studentID);
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
        `${backDomain}/api/v1/homeworkjuststatus/${studentID}`,
        {
          tutoringId,
        },
        {
          headers: actualHeaders,
        }
      );
      setChange(!change);
      fetchHW(studentID);
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
      fetchHW(studentID);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos"
      );
    }
  };
  const { UniversalTexts } = useUserContext();

  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  const isAllowed = myPermissions == "superadmin" || myPermissions == "teacher";
  return (
    <RouteDiv>
      {isAllowed && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: alwaysWhite(),
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <select
            onChange={handleStudentChange}
            value={studentID}
            style={{
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: "13px",
              fontWeight: "400",
              color: "#64748b",
              padding: "6px 8px",
              minWidth: "200px",
              maxWidth: "300px",
              outline: "none",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = partnerColor();
              e.target.style.backgroundColor = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.backgroundColor = "#f8fafc";
            }}
          >
            {studentsList.map((student: any, index: number) => (
              <option key={index} value={student.id}>
                {student.name + " " + student.lastname}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Due Date Filter */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: alwaysWhite(),
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <label
          style={{
            fontSize: "13px",
            color: "#64748b",
            fontWeight: "500",
          }}
        >
          Filtrar por Data de Entrega:
        </label>
        <select
          onChange={handleDueDateChange}
          value={selectedDueDate}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "13px",
            fontWeight: "400",
            color: "#64748b",
            padding: "6px 8px",
            minWidth: "200px",
            maxWidth: "300px",
            outline: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = partnerColor();
            e.target.style.backgroundColor = "#ffffff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.backgroundColor = "#f8fafc";
          }}
        >
          <option value="" disabled>
            📅 Selecione uma data de entrega
          </option>
          {availableDueDates.map((dueDate: string, index: number) => (
            <option key={index} value={dueDate}>
              📅 {formatDateBr(dueDate)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <CircularProgress
          style={{
            color: partnerColor(),
          }}
        />
      ) : (
        <span>
          <Helmets text="Homework" />
          <HOne>{UniversalTexts.homework}</HOne>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              padding: "1rem 0.5rem",
            }}
          >
            <ul
              style={{
                width: "100%",
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {filteredTutoringList.length > 0 ? (
                filteredTutoringList.map((homework: any, index: number) => (
                  <li
                    key={index}
                    style={{
                      listStyle: "none",
                      margin: "0.75rem 0",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Header Section */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#374151",
                        padding: "0.75rem 1rem",
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        borderBottom:
                          homework?.status === "done"
                            ? "none"
                            : "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <HTwo
                          style={{
                            margin: 0,
                            color: "inherit",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          📚 {UniversalTexts.dueDate}{" "}
                          {formatDateBr(homework.dueDate)}
                        </HTwo>
                        {homework.assignmentDate && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              fontWeight: "400",
                            }}
                          >
                            Atribuído em:{" "}
                            {formatDateBr(homework.assignmentDate)}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            fontWeight: "500",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor:
                              homework?.status === "done"
                                ? "#22c55e"
                                : "#f59e0b",
                            color: "white",
                          }}
                        >
                          <i
                            className={`fa fa-${
                              homework?.status === "done"
                                ? "check-circle"
                                : "clock-o"
                            }`}
                            aria-hidden="true"
                            style={{ fontSize: "12px" }}
                          />
                          {homework?.status === "done"
                            ? UniversalTexts?.completed || "Concluído"
                            : UniversalTexts?.pending || "Pendente"}
                        </div>
                        {homework.submitted !== undefined && (
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>
                            {homework.submitted ? "Enviado" : "Não enviado"}
                          </span>
                        )}
                      </div>
                    </div>
                    {homework.status !== "done" && (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <ArvinButton
                          onClick={() =>
                            openSubmissionModal(
                              homework._id,
                              homework.answers || homework.description
                            )
                          }
                          style={{
                            backgroundColor: partnerColor(),
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className="fa fa-upload" />

                          {homework.submitted
                            ? UniversalTexts.edit
                            : UniversalTexts?.submitHomework}
                        </ArvinButton>
                      </div>
                    )}

                    {/* Action Buttons Section */}
                    {((homework.status &&
                      isAllowed &&
                      homework?.status === "pending") ||
                      isAllowed) && (
                      <div
                        style={{
                          margin: "1rem",
                          padding: "1rem",
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa fa-cogs" />
                          ⚙️ Ações do Professor
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {homework.status &&
                            isAllowed &&
                            homework?.status === "pending" && (
                              <>
                                <ArvinButton
                                  disabled={disabled}
                                  onClick={() =>
                                    updateRealizedClass(
                                      homework._id,
                                      pointsMadeHW
                                    )
                                  }
                                  style={{
                                    backgroundColor: partnerColor(),
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: disabled
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: disabled ? 0.6 : 1,
                                  }}
                                >
                                  <i
                                    className="fa fa-check"
                                    style={{ fontSize: "10px" }}
                                  />
                                  {UniversalTexts?.upToDate || "Up to date"}
                                </ArvinButton>
                                <ArvinButton
                                  disabled={disabled}
                                  onClick={() =>
                                    updateRealizedClass(
                                      homework._id,
                                      pointsLateHW
                                    )
                                  }
                                  style={{
                                    backgroundColor: "#f59e0b",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: disabled
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: disabled ? 0.6 : 1,
                                  }}
                                >
                                  <i
                                    className="fa fa-clock-o"
                                    style={{ fontSize: "10px" }}
                                  />
                                  {UniversalTexts?.late || "Late"}
                                </ArvinButton>
                                <ArvinButton
                                  disabled={disabled}
                                  onClick={() => justStatus(homework._id)}
                                  style={{
                                    backgroundColor: "#64748b",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: disabled
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: disabled ? 0.6 : 1,
                                  }}
                                >
                                  <i
                                    className="fa fa-edit"
                                    style={{ fontSize: "10px" }}
                                  />
                                  {UniversalTexts?.justStatus || "Just status"}
                                </ArvinButton>
                              </>
                            )}
                          {isAllowed && (
                            <ArvinButton
                              color="red"
                              onDoubleClick={() => deleteHomework(homework._id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={{ fontSize: "10px" }}
                              />
                              {UniversalTexts?.doubleClick || "Double Click"}
                            </ArvinButton>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Class Details Section */}
                    {homework.eventDetails && (
                      <div
                        style={{
                          margin: "1rem",
                          padding: "1rem",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #0ea5e9",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0c4a6e",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa fa-graduation-cap" />
                          🎓 Detalhes da Aula Relacionada
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {homework.eventDetails.date && (
                            <div>
                              <strong
                                style={{ color: "#0c4a6e", fontSize: "13px" }}
                              >
                                Data da Aula:
                              </strong>
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "13px",
                                  color: "#075985",
                                }}
                              >
                                {formatDateBr(homework.eventDetails.date)} às{" "}
                                {homework.eventDetails.time}
                              </span>
                            </div>
                          )}

                          {homework.eventDetails.status && (
                            <div>
                              <strong
                                style={{ color: "#0c4a6e", fontSize: "13px" }}
                              >
                                Status:
                              </strong>
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "12px",
                                  padding: "2px 6px",
                                  borderRadius: "8px",
                                  backgroundColor:
                                    homework.eventDetails.status === "realizada"
                                      ? "#22c55e"
                                      : "#f59e0b",
                                  color: "white",
                                }}
                              >
                                {homework.eventDetails.status === "realizada"
                                  ? "Realizada"
                                  : homework.eventDetails.status}
                              </span>
                            </div>
                          )}

                          {homework.eventDetails.description && (
                            <div>
                              <strong
                                style={{ color: "#0c4a6e", fontSize: "13px" }}
                              >
                                Descrição da Aula:
                              </strong>
                              <p
                                style={{
                                  margin: "4px 0",
                                  fontSize: "12px",
                                  color: "#075985",
                                  lineHeight: "1.4",
                                }}
                              >
                                {homework.eventDetails.description}
                              </p>
                            </div>
                          )}

                          {/* Class Links */}
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                              marginTop: "8px",
                            }}
                          >
                            {homework.eventDetails.importantLink && (
                              <Link
                                to={homework.eventDetails.importantLink}
                                target="_blank"
                                style={{
                                  color: "#0ea5e9",
                                  textDecoration: "none",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  backgroundColor: "white",
                                  borderRadius: "4px",
                                  border: "1px solid #0ea5e9",
                                }}
                              >
                                <i className="fa fa-external-link" />
                                Material
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description Section */}
                    <div
                      style={{
                        margin: "1rem",
                        padding: "1rem",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fa fa-file-text-o" />
                        📝 Descrição do Homework
                      </h4>
                      <div
                        style={{
                          lineHeight: "1.6",
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: homework.description,
                          }}
                        />
                      </div>
                    </div>

                    {/* Links Section */}
                    {(homework.googleDriveLink || homework.attachments) && (
                      <div
                        style={{
                          margin: "1rem",
                          padding: "1rem",
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa fa-link" />
                          🔗 Links e Recursos
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexDirection: "column",
                          }}
                        >
                          {homework.googleDriveLink && (
                            <Link
                              to={homework.googleDriveLink}
                              target="_blank"
                              style={{
                                color: partnerColor(),
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                backgroundColor: "white",
                                borderRadius: "4px",
                                border: `1px solid ${partnerColor()}30`,
                                transition: "all 0.2s ease",
                              }}
                            >
                              <i
                                className="fa fa-google-drive"
                                style={{ fontSize: "11px" }}
                              />
                              {UniversalTexts?.accessClassHere ||
                                "Access the class here"}
                            </Link>
                          )}
                          {homework.attachments && (
                            <Link
                              to={homework.attachments}
                              target="_blank"
                              style={{
                                color: partnerColor(),
                                textDecoration: "none",
                                fontWeight: "500",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                backgroundColor: "white",
                                borderRadius: "4px",
                                border: `1px solid ${partnerColor()}30`,
                                transition: "all 0.2s ease",
                              }}
                            >
                              <i
                                className="fa fa-download"
                                style={{ fontSize: "11px" }}
                              />
                              {UniversalTexts?.homeworkSent ||
                                "Homework Enviado"}
                            </Link>
                          )}
                          {homework.answers && (
                            <>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "#374151",
                                  fontWeight: "500",
                                  margin: "0 0 8px",
                                }}
                              >
                                {UniversalTexts?.homeworkAnswers ||
                                  "Minha resposta"}
                              </p>

                              <div
                                style={{
                                  backgroundColor: "#eff0daff",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  padding: "1.2rem",
                                  fontFamily: "cursive",
                                  lineHeight: "1.6",
                                  color: "#444",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: homework.answers,
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Homework Submission Info */}
                    {homework.submittedAt && (
                      <div
                        style={{
                          margin: "1rem",
                          padding: "1rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #22c55e",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#16a34a",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa fa-check-circle" />✅ Status de Envio
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#16a34a",
                              fontWeight: "500",
                            }}
                          >
                            Enviado em: {formatDateBr(homework.submittedAt)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Video Section - moved to bottom */}
                    {homework.eventDetails?.video && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          padding: "1rem",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          margin: "0 1rem 1rem",
                        }}
                      >
                        <strong style={{ color: "#374151", fontSize: "14px" }}>
                          🎥 Gravação da Aula:
                        </strong>

                        {/* Responsive Video Container */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            paddingBottom: "56.25%", // 16:9 aspect ratio
                            height: 0,
                            overflow: "hidden",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#000",
                          }}
                        >
                          <iframe
                            src={getEmbedUrl(homework.eventDetails.video)}
                            title={`Aula - ${homework.eventDetails.date}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              border: "none",
                              borderRadius: "8px",
                            }}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata Section */}
                    <div
                      style={{
                        margin: "1rem",
                        padding: "1rem",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fa fa-info-circle" />
                        ℹ️ Informações do Sistema
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "8px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {homework.eventDetails?.createdAt && (
                          <span>
                            Criado:{" "}
                            {new Date(
                              homework.eventDetails.createdAt
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        {homework.eventDetails?.updatedAt && (
                          <span>
                            Atualizado:{" "}
                            {new Date(
                              homework.eventDetails.updatedAt
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li
                  style={{
                    listStyle: "none",
                    margin: "2rem 0",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "16px",
                    fontStyle: "italic",
                  }}
                >
                  {selectedDueDate
                    ? `📚 Nenhum homework encontrado para ${formatDateBr(
                        selectedDueDate
                      )}`
                    : "📚 Selecione uma data de entrega para ver os homeworks"}
                </li>
              )}
            </ul>
          </div>
        </span>
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
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeSubmissionModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "16px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                📤 {UniversalTexts?.submitHomework || "Enviar Homework"}
              </h2>
              <button
                onClick={closeSubmissionModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "background-color 0.2s",
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
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                🎯 Como você quer responder?
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <button
                  onClick={() => setSubmissionMode("file")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: `2px solid ${
                      submissionMode === "file" ? partnerColor() : "#e2e8f0"
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      submissionMode === "file"
                        ? `${partnerColor()}10`
                        : "#ffffff",
                    color:
                      submissionMode === "file" ? partnerColor() : "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fa fa-file" />
                  Enviar Arquivo
                </button>
                <button
                  onClick={() => setSubmissionMode("editor")}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: `2px solid ${
                      submissionMode === "editor" ? partnerColor() : "#e2e8f0"
                    }`,
                    borderRadius: "8px",
                    backgroundColor:
                      submissionMode === "editor"
                        ? `${partnerColor()}10`
                        : "#ffffff",
                    color:
                      submissionMode === "editor" ? partnerColor() : "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fa fa-edit" />
                  Responder na Plataforma
                </button>
              </div>
            </div>

            {/* Modal Content based on submission mode */}
            {submissionMode === "file" ? (
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
                  📎 Escolha o arquivo:
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px dashed #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "#f8fafc",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#64748b",
                    transition: "border-color 0.2s",
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
                      borderRadius: "8px",
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
                  ✍️ Responda diretamente aqui:
                </label>
                <div
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
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
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <ArvinButton
                onClick={closeSubmissionModal}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                Cancelar
              </ArvinButton>
              <ArvinButton
                onClick={() => submitHomework()}
                disabled={
                  uploading ||
                  (submissionMode === "file"
                    ? !selectedFile
                    : !homeworkAnswer.trim())
                }
                style={{
                  backgroundColor:
                    uploading ||
                    (submissionMode === "file"
                      ? !selectedFile
                      : !homeworkAnswer.trim())
                      ? "#ccc"
                      : partnerColor(),
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor:
                    uploading ||
                    (submissionMode === "file"
                      ? !selectedFile
                      : !homeworkAnswer.trim())
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.2s",
                }}
              >
                {uploading ? (
                  <>
                    <CircularProgress size={16} style={{ color: "white" }} />
                    {UniversalTexts?.sending || "Enviando..."}
                  </>
                ) : (
                  <>
                    <i
                      className={`fa fa-${
                        submissionMode === "file" ? "upload" : "paper-plane"
                      }`}
                    />
                    {submissionMode === "file"
                      ? UniversalTexts?.send || "Enviar Arquivo"
                      : "Enviar Resposta"}
                  </>
                )}
              </ArvinButton>
            </div>
          </div>
        </div>
      )}
    </RouteDiv>
  );
}
