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
import { partnerColor, textTitleFont } from "../../Styles/Styles";
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
      notifyAlert("Por favor, selecione um arquivo");
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

      notifyAlert("Homework enviado com sucesso!", "green");
      setSelectedFile(null);
      setTimeout(() => {
        fetchHW(studentID);
      }, 500);
    } catch (error) {
      notifyAlert("Erro ao enviar homework");
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
        notifyAlert("Erro ao encontrar alunos");
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
      console.log(tt);
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
      notifyAlert("Erro ao encontrar alunos");
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
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      fetchHW(studentID);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
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
          <HOne
            style={{
              fontFamily: textTitleFont(),
              color: partnerColor(),
            }}
          >
            {UniversalTexts.homework}
          </HOne>
          {isAllowed && (
            <div
              style={{
                display: "inline",
                marginBottom: "1rem",
              }}
            >
              <select onChange={handleStudentChange} value={studentID}>
                {studentsList.map((student: any, index: number) => (
                  <option key={index} value={student.id}>
                    {student.name + " " + student.lastname}{" "}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <ul
              style={{
                overflowY: "auto",
                maxHeight: "70vh",
              }}
            >
              {tutoringList.map((homework: any, index: number) => (
                <li
                  key={index}
                  className="box-shadow-white"
                  style={{
                    margin: "8px 0",
                    textDecoration: "none",
                    display: "grid",
                    gap: "16px",
                    listStyle: "none",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: `2px solid ${
                      homework?.status === "done" ? "#4caf50" : "#ff9800"
                    }20`,
                    backgroundColor: "#fafafa",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Header Section */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: "12px",
                    }}
                  >
                    <HTwo style={{ margin: 0, color: "#333" }}>
                      {UniversalTexts.dueDate} {formatDateBr(homework.dueDate)}
                    </HTwo>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor:
                          homework?.status === "done" ? "#4caf50" : "#ff9800",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      <i
                        className={`fa fa-${
                          homework?.status === "done"
                            ? "check-circle"
                            : "clock-o"
                        }`}
                        aria-hidden="true"
                      />
                      {homework?.status}
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
                        gap: "8px",
                        flexWrap: "wrap",
                        padding: "8px 0",
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
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i className="fa fa-check" />
                              Up to date
                            </ArvinButton>
                            <ArvinButton
                              disabled={disabled}
                              onClick={() =>
                                updateRealizedClass(homework._id, pointsLateHW)
                              }
                              style={{
                                backgroundColor: "#ff9800",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i className="fa fa-clock-o" />
                              Late
                            </ArvinButton>
                            <ArvinButton
                              disabled={disabled}
                              onClick={() => justStatus(homework._id)}
                              style={{
                                backgroundColor: "#2196f3",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i className="fa fa-edit" />
                              Just status
                            </ArvinButton>
                          </>
                        )}
                      {isAllowed && (
                        <ArvinButton
                          color="red"
                          onDoubleClick={() => deleteHomework(homework._id)}
                          style={{
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="fa fa-trash" aria-hidden="true" />
                          Double Click
                        </ArvinButton>
                      )}
                    </div>
                  ) : null}

                  {/* Description Section */}
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "1.2rem",
                      lineHeight: "1.6",
                      color: "#444",
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
                        gap: "12px",
                        flexDirection: "column",
                        padding: "8px 0",
                      }}
                    >
                      {homework.googleDriveLink && (
                        <Link
                          to={homework.googleDriveLink}
                          style={{
                            color: partnerColor(),
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: `1px solid ${partnerColor()}30`,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className="fa fa-external-link" />
                          Access the class here
                        </Link>
                      )}
                      {homework.attachments && (
                        <Link
                          to={homework.attachments}
                          style={{
                            color: "#4caf50",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            border: "1px solid #4caf5030",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className="fa fa-download" />
                          Homework Enviado
                        </Link>
                      )}
                    </div>
                  )}

                  {/* File Upload Section */}
                  {homework?.status === "pending" && (
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "2px dashed #ddd",
                        borderRadius: "8px",
                        padding: "1.2rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "12px",
                          fontWeight: "600",
                          color: "#666",
                        }}
                      >
                        Enviar Homework
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          style={{
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
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
