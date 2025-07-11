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
import { notifyError } from "../EnglishLessons/Assets/Functions/FunctionLessons";
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
        notifyError("Erro ao encontrar alunos");
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

  const updateRealizedClass = async (tutoringId: string, score: number) => {
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
    } catch (error) {
      notifyError("Erro ao encontrar alunos");
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
      notifyError("Erro ao encontrar alunos");
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      fetchHW(studentID);
    } catch (error) {
      notifyError("Erro ao encontrar alunos");
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
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
              {UniversalTexts.activitiesBelowTutoring}
            </p>
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
                    margin: "2px",
                    textDecoration: "none",
                    display: "grid",
                    gap: "8px",
                    listStyle: "none",
                    padding: "1rem",
                  }}
                >
                  <HTwo>
                    {UniversalTexts.dueDate} {formatDateBr(homework.dueDate)}
                    <span>
                      {" "}
                      ({homework?.status}){" "}
                      <i
                        style={{
                          display: "inline",
                          color:
                            homework?.status == "done" ? "green" : "orange",
                        }}
                        className={`fa fa-${
                          homework?.status == "done"
                            ? "check-circle"
                            : "ellipsis-h"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </HTwo>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {homework.status &&
                      isAllowed &&
                      homework?.status === "pending" && (
                        <>
                          <ArvinButton
                            onClick={() =>
                              updateRealizedClass(homework._id, pointsMadeHW)
                            }
                          >
                            Up to date
                          </ArvinButton>
                          <ArvinButton
                            onClick={() =>
                              updateRealizedClass(homework._id, pointsLateHW)
                            }
                          >
                            Late
                          </ArvinButton>
                          <ArvinButton onClick={() => justStatus(homework._id)}>
                            Just status
                          </ArvinButton>
                        </>
                      )}
                    {isAllowed && (
                      <ArvinButton
                        color="red"
                        onDoubleClick={() => deleteHomework(homework._id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true" /> Double
                        Click
                      </ArvinButton>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        padding: "1rem",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: homework.description,
                      }}
                    />
                  </div>
                  <Link to={homework.googleDriveLink}>
                    Access the class here
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </span>
      )}
    </RouteDiv>
  );
}
