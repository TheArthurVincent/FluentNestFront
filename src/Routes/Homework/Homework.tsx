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

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
}

export default function Homework({ headers, setChange, change }: HWProps) {
  const [tutoringList, setTutoringList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [ID, setID] = useState<string>("");
  const [myPermissions, setPermissions] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

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

  const submitHomework = async (homeworkId: string) => {
    if (!selectedFile) {
      notifyAlert(UniversalTexts?.pleaseSelectFile || "Por favor, selecione um arquivo");
      return;
    }

    setUploading(true);
    try {
      const base64File = await convertToBase64(selectedFile);

      await axios.post(
        `${backDomain}/api/v1/submithomework/${homeworkId}`,
        {
          base64String: base64File,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
        {
          headers: actualHeaders,
        }
      );

      notifyAlert(UniversalTexts?.homeworkSubmittedSuccess || "Homework enviado com sucesso!", "green");
      setSelectedFile(null);
      setTimeout(() => {
        fetchHW(studentID);
      }, 500);
    } catch (error) {
      notifyAlert(UniversalTexts?.errorSubmittingHomework || "Erro ao enviar homework");
      console.error(error);
    } finally {
      setUploading(false);
    }
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
        notifyAlert(UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos");
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
      setLoading(false);
    } catch (error) {
      console.log(error, "erro ao listar homework");
    }
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
      notifyAlert(UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos");
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
      notifyAlert(UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos");
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      fetchHW(studentID);
    } catch (error) {
      notifyAlert(UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos");
    }
  };
  const { UniversalTexts } = useUserContext();

  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  const isAllowed = myPermissions == "superadmin" || myPermissions == "teacher";
  return (
    <RouteDiv>
      {loading ? (
        <CircularProgress
          style={{
            color: partnerColor(),
          }}
        />
      ) : (
        <span>
          <Helmets text="Homework" />

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

          <HOne
            style={{
              fontFamily: textTitleFont(),
              color: partnerColor(),
              textAlign: "center",
              margin: "0 0 1.5rem 0",
              fontSize: "1.5rem",
            }}
          >
            {UniversalTexts.homework}
          </HOne>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "600px",
              margin: "0 auto",
              padding: "1rem 0.5rem",
            }}
          >
            <ul
              style={{
                width: "100%",
                maxWidth: "500px",
                overflowY: "auto",
                maxHeight: "70vh",
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {tutoringList.map((homework: any, index: number) => (
                <li
                  key={index}
                  style={{
                    listStyle: "none",

                    margin: "0.75rem 0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #f1f5f9",
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
                    <HTwo
                      style={{ margin: 0, color: "inherit", fontSize: "14px" }}
                    >
                      📚 {UniversalTexts.dueDate}{" "}
                      {formatDateBr(homework.dueDate)}
                    </HTwo>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "green",
                      }}
                    >
                      <i
                        className={`fa fa-${
                          homework?.status === "done"
                            ? "check-circle"
                            : "clock-o"
                        }`}
                        aria-hidden="true"
                        style={{ fontSize: "14px" }}
                      />
                      {homework?.status === "done" ? (UniversalTexts?.completed || "Concluído") : (UniversalTexts?.pending || "Pendente")}
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  {(homework.status &&
                    isAllowed &&
                    homework?.status === "pending") ||
                  isAllowed ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        padding: "0.5rem 1rem 1rem",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      {homework.status &&
                        isAllowed &&
                        homework?.status === "pending" && (
                          <>
                            <ArvinButton
                              disabled={disabled}
                              onClick={() =>
                                updateRealizedClass(homework._id, pointsMadeHW)
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
                                cursor: disabled ? "not-allowed" : "pointer",
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
                                updateRealizedClass(homework._id, pointsLateHW)
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
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.6 : 1,
                              }}
                            >
                              <i
                                className="fa fa-clock-o"
                                style={{ fontSize: "10px" }}
                              />
                              Late
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
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.6 : 1,
                              }}
                            >
                              <i
                                className="fa fa-edit"
                                style={{ fontSize: "10px" }}
                              />
                              Just status
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
                          Double Click
                        </ArvinButton>
                      )}
                    </div>
                  ) : null}

                  {/* Description Section */}
                  <div
                    style={{
                      backgroundColor: "#fafbfc",
                      border: "none",
                      borderRadius: "0",
                      padding: "1rem",
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

                  {/* Links Section */}
                  {(homework.googleDriveLink || homework.attachments) && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexDirection: "column",
                        padding: "0.5rem 1rem 1rem",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      {homework.googleDriveLink && (
                        <Link
                          to={homework.googleDriveLink}
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
                            className="fa fa-external-link"
                            style={{ fontSize: "11px" }}
                          />
                          Access the class here
                        </Link>
                      )}
                      {homework.attachments && (
                        <Link
                          to={homework.attachments}
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
                          Homework Enviado
                        </Link>
                      )}
                    </div>
                  )}

                  {/* File Upload Section */}
                  {homework?.status === "pending" && (
                    <div
                      style={{
                        backgroundColor: "#fafbfc",
                        border: "1px dashed #e2e8f0",
                        borderRadius: "0",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "0.75rem",
                          fontWeight: "500",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        Enviar Homework
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          style={{
                            padding: "8px 10px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "4px",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        />
                        {selectedFile && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              fontStyle: "italic",
                            }}
                          >
                            📎 {selectedFile.name}
                          </div>
                        )}
                        <ArvinButton
                          onClick={() => submitHomework(homework._id)}
                          disabled={uploading || !selectedFile}
                          style={{
                            backgroundColor:
                              uploading || !selectedFile
                                ? "#ccc"
                                : partnerColor(),
                            color: "white",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor:
                              uploading || !selectedFile
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          {uploading ? (
                            <>
                              <CircularProgress
                                size={16}
                                style={{ color: "white" }}
                              />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-upload" />
                              Enviar
                            </>
                          )}
                        </ArvinButton>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </span>
      )}
    </RouteDiv>
  );
}
