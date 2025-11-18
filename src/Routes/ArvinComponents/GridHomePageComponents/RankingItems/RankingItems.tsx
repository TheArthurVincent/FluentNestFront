import React, { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  abreviateName,
  backDomain,
  formatNumber,
  ImgResponsive0,
  updateScore,
} from "../../../../Resources/UniversalComponents";
import { levels } from "../../../Ranking/RankingComponents/RankingLevelsList";
import { partnerColor } from "../../../../Styles/Styles";
import { CircularProgress } from "@mui/material";
import styled, { keyframes } from "styled-components";

interface StudentsRankingProps {
  headers: MyHeadersType | null;
}

export default function StudentsRanking({ headers }: StudentsRankingProps) {
  interface StudentsType {
    id: string;
    lastname: string;
    name: string;
    homeworkAssignmentsDone: number;
    flashcards25Reviews: number;
    picture: string;
    username: string;
    monthlyScore: number;
    totalScore: number;
  }

  interface UserType {
    id: string;
    name: string;
    lastname: string;
    dateOfBirth: string;
    doc: string;
    email: string;
    googleDriveLink: string;
    homeworkAssignmentsDone: number;
    flashcards25Reviews: number;
    permissions: string;
    phoneNumber: string;
    picture: string;
    username: string;
    monthlyScore: number;
    totalScore: number;
  }

  const [students, setStudents] = useState<StudentsType[]>([]);
  const [user, setUser] = useState<UserType>({
    id: "",
    name: "",
    lastname: "",
    dateOfBirth: "",
    doc: "",
    email: "",
    googleDriveLink: "",
    permissions: "",
    phoneNumber: "",
    picture: "",
    username: "",
    homeworkAssignmentsDone: 0,
    flashcards25Reviews: 0,
    monthlyScore: 0,
    totalScore: 0,
  });
  const actualHeaders = headers || {};

  const changeColors = (color1: string, color2: string) => keyframes`
  0% {
    background-color: ${color1};
  }
  50% {
    background-color: ${color2};
  }
  100% {
    background-color: ${color1};
  }
`;
  interface AnimatedLiProps {
    color1: string;
    color2: string;
    index: number;
    item: any;
    background: string;
    textColor: string;
  }
  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  const AnimatedLi = styled.li<AnimatedLiProps>`
    padding: 0.2rem 1rem;
    margin-bottom: 5px;
    list-style: none;
    grid-template-columns: 0.5fr 1fr 0.5fr;
    box-shadow: 5px 5px 10px #aaa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    // animation: ${fadeIn} 0.3s forwards,
    //   ${(props) => changeColors(props.color1, props.color2)} 3s infinite;
    border-radius: 4px;
    height: 100%; /* Garante altura uniforme */
    background: ${(props) => props.background};
    color: ${(props) => props.textColor};
    overflow-x: hidden;
  `;

  const [isAdm, setIsAdm] = useState<boolean>(false);
  const [loadingScore, setLoadingScore] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [descSpecial, setDescSpecial] = useState<string>("");
  const [plusScore, setPlusScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalFlashCards25, setTotalFlashCards25] = useState<number>(0);
  const [totalHomeworkDone, setTotalHomeworkDone] = useState<number>(0);
  const [monthlyScore, setMonthlyScore] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [ID, setId] = useState<string>("");
  const [card, setCard] = useState<boolean>(true);
  const [pic, setPic] = useState<string>("");
  const [name, setName] = useState<string>("");

  const seeEdition = async (id: string) => {
    setDisabled(true);
    setLoadingScore(true);
    setIsVisible(!isVisible);
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers: actualHeaders,
      });
      setTotalScore(response.data.formattedStudentData.totalScore);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore);
      setTotalFlashCards25(
        response.data.formattedStudentData.flashcards25Reviews
      );
      setTotalHomeworkDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
      );
      setId(response.data.formattedStudentData.id);
      setPic(response.data.formattedStudentData.picture);
      setName(
        response.data.formattedStudentData.name +
          " " +
          abreviateName(response.data.formattedStudentData.lastname)
      );
      setDisabled(false);

      setLoadingScore(false);
    } catch (error) {
      console.log("error", error);
      console.error(error);
    }
  };

  const changePlusScore = (score: number) => {
    setPlusScore(score);
  };

  const updateScoreNow = async (id: string) => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers: actualHeaders,
      });
      setTotalScore(response.data.formattedStudentData.totalScore);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore);
      setTotalFlashCards25(
        response.data.formattedStudentData.flashcards25Reviews
      );
      setTotalHomeworkDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
      );
    } catch (error: any) {
      console.log(error);
      console.error(error);
    }
  };

  const submitPlusScore = async (
    id: string,
    score: number,
    description: string,
    type: string
  ) => {
    setLoadingScore(true);
    setDisabled(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/score/${id}`,
        {
          score,
          description,
          type,
        },
        {
          headers: actualHeaders,
        }
      );

      updateScoreNow(id);
      setDisabled(false);
      setLoadingScore(false);
    } catch (error) {
      console.log("Erro ao somar pontuação");
      setDisabled(false);
    }
  };

  const theItems = levels();

  useEffect(() => {
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "");
    setUser(getLoggedUser);
    getLoggedUser.permissions === "superadmin" ? setIsAdm(true) : null;
  }, []);
  const handleSeeModal = (studentId?: string) => {
    if (studentId) {
      seeEdition(studentId);
    } else {
      setIsVisible(false);
    }
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [FIRST, setFIRST] = useState(true);

  const fetchStudentsScore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    const { teacherID } = JSON.parse(localStorage.getItem("loggedIn") || "");

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/scoresranking/${teacherID}?page=${page}`,
        {
          headers: actualHeaders,
        }
      );

      setStudents((prev) => [...prev, ...response.data.listOfStudents]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
      setFIRST(false);
    } catch (error) {
      setFIRST(false);
      console.log("Erro ao encontrar alunos");
    } finally {
      setFIRST(false);
      setLoading(false);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastStudentRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchStudentsScore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchStudentsScore();
  }, []);

  const updateFeeStatus = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/feeuptodate/${id}`,
        {},
        {
          headers: actualHeaders,
        }
      );
      fetchStudentsScore();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateTutoree = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoree/${id}`,
        {},
        {
          headers: actualHeaders,
        }
      );
      fetchStudentsScore();
    } catch (error) {
      console.log("error", error);
    }
  };
  const updateReplenishTargetStatus = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/targetforreplenishuptodate/${id}`,
        {},
        {
          headers: actualHeaders,
        }
      );
      fetchStudentsScore();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      {loading && FIRST ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <ul
          style={{
            marginTop: 20,
          }}
        >
          {students.map((item: any, index: number) => {
            const levelNumber =
              updateScore(
                item.totalScore,
                item.flashcards25Reviews,
                item.homeworkAssignmentsDone
              ).level - 1;

            const isLast = index === students.length - 1;

            return (
              <div ref={isLast ? lastStudentRef : null} key={item._id}>
                <li
                  style={{
                    listStyle: "none",
                    display: index < 5 ? "flex" : "none",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: 16,
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#65748C",
                        marginRight: 4,
                      }}
                    >
                      {index + 1}.
                    </span>
                    <span
                      style={{
                        color: theItems[levelNumber].backgroundcolor,
                        marginRight: 4,
                      }}
                    >
                      <i className={theItems[levelNumber].icon} />
                    </span>
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: 16,
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#65748C",
                      }}
                    >
                      {item.name + " " + abreviateName(item.lastname)}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 600,
                      fontStyle: "SemiBold",
                      fontSize: 16,
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#65748C",
                    }}
                  >
                    {formatNumber(item.monthlyScore)}{" "}
                  </span>
                </li>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
