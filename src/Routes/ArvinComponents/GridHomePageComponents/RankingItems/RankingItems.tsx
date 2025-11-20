import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  abreviateName,
  backDomain,
  formatNumber,
  updateScore,
} from "../../../../Resources/UniversalComponents";
import { levels } from "../../../Ranking/RankingComponents/RankingLevelsList";
import { partnerColor } from "../../../../Styles/Styles";
import { CircularProgress } from "@mui/material";

interface StudentsRankingProps {
  headers: MyHeadersType | null;
  appLoaded?: boolean;
}

export default function StudentsRanking({
  headers,
  appLoaded,
}: StudentsRankingProps) {
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

  const [students, setStudents] = useState<StudentsType[]>([]);
  const actualHeaders = headers || {};

  const [isAdm, setIsAdm] = useState<boolean>(false);

  const theItems = levels();

  useEffect(() => {
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "");
    getLoggedUser.permissions === "superadmin" ? setIsAdm(true) : null;
    const { teacherID } = JSON.parse(localStorage.getItem("loggedIn") || "");
    setTeacherID(teacherID);
  }, []);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [FIRST, setFIRST] = useState(true);
  const [theTeacherID, setTeacherID] = useState<string>("");

  const fetchStudentsScore = async () => {
    if (!theTeacherID) return; // 👈 novo
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/scoresranking/${theTeacherID}?page=${page}`,
        { headers: actualHeaders }
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
    const raw = localStorage.getItem("loggedIn");
    if (!raw) return;

    let getLoggedUser;
    try {
      getLoggedUser = JSON.parse(raw);
    } catch {
      return;
    }

    if (getLoggedUser.permissions === "superadmin") setIsAdm(true);
    if (getLoggedUser.teacherID) setTeacherID(getLoggedUser.teacherID);
  }, []);

  useEffect(() => {
    if (!theTeacherID) return; // 👈 garante que só chame depois de setar
    fetchStudentsScore();
  }, [appLoaded, theTeacherID]);

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
