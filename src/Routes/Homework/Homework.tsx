import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { HOne, HTwo, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { Link } from "react-router-dom";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { listOfCriteria } from "../Ranking/RankingComponents/ListOfCriteria";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor, textTitleFont } from "../../Styles/Styles";

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
}

export default function Homework({ headers, setChange, change }: HWProps) {
  const [groupList, setGroupList] = useState<any>([]);
  const [tutoringList, setTutoringList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [permissions, setPermissions] = useState<string>("");
  const [tabValue, setTabValue] = useState(0); // State para o controle das abas

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentID(event.target.value);
    fetchClasses(event.target.value);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
        headers: actualHeaders,
      });
      setStudentsList(response.data.listOfStudents);
    } catch (error) {
      onLoggOut();
      alert("Erro ao encontrar alunos");
    }
  };

  const actualHeaders = headers || {};

  const fetchClasses = async (studentId: string) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      const gc = response.data.groupClassHomeworkList;
      const tt = response.data.tutoringHomeworkList;
      setGroupList(gc);
      setTutoringList(tt);
      setLoading(false);
    } catch (error) {
      onLoggOut();
      console.log(error, "erro ao listar homework");
    }
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    //@ts-ignore
    const { id, permissions } = getLoggedUser;
    setStudentID(id);
    fetchClasses(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
    permissions == "superadmin" ? fetchStudents() : null;
  }, []);

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
      fetchClasses(studentID);
    } catch (error) {
      alert("Erro ao encontrar alunos");
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
      fetchClasses(studentID);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      fetchClasses(studentID);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    }
  };
  const { UniversalTexts } = useUserContext();

  const pointsMadeHW = listOfCriteria[0].score[0].score;
  const pointsLateHW = listOfCriteria[0].score[1].score;

  return (
    <RouteDiv>
      <Helmets text="Homework" />
      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
        }}
      >
        {UniversalTexts.homework}
      </HOne>
      <ArvinButton onClick={() => fetchClasses(studentID)}>
        <i className="fa fa-refresh" aria-hidden="true" />
      </ArvinButton>
      {permissions == "superadmin" && (
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
                      color: homework?.status == "done" ? "green" : "orange",
                    }}
                    className={`fa fa-${
                      homework?.status == "done" ? "check-circle" : "ellipsis-h"
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </HTwo>
              <div style={{ display: "flex", gap: "5px" }}>
                {homework.status &&
                  permissions === "superadmin" &&
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
                {permissions === "superadmin" && (
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
              <Link to={homework.googleDriveLink}>Access the class here</Link>
            </li>
          ))}
        </ul>
      </div>
    </RouteDiv>
  );
}
