import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedLi2, HTwo } from "../../../Resources/Components/RouteBox";
import {
  ImgResponsive3,
  backDomain,
  formatNumber,
  updateScore,
} from "../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { levels } from "./RankingLevelsList";
import { partnerColor } from "../../../Styles/Styles";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";

export default function StudentsRankingTotal({ headers }: HeadersProps) {
  const [students, setStudents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const theItems = levels();
  const [isAdm, setIsAdm] = useState<string>("student");

  const [showInfo, setShowInfo] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});

  const toggleInfo = (type: "points" | "hw" | "fc", index: number) => {
    setShowInfo((prevState) => {
      const newState = { ...prevState };

      if (!newState[index]) {
        newState[index] = { points: false, hw: false, fc: false };
      }

      newState[index][type] = !newState[index][type];

      return newState;
    });
  };
  const actualHeaders = headers || {};
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [FIRST, setFIRST] = useState(true);

  const fetchStudents = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const { id } = JSON.parse(localStorage.getItem("loggedIn") || "");

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/scorestotalranking/${id}?page=${page}&limit=10`,
        {
          headers: actualHeaders,
        }
      );
      setStudents((prev: any[]) => [...prev, ...response.data.listOfStudents]);
      setHasMore(response.data.hasMore);
      setPage((prev) => prev + 1);
      setLoading(false);
      setFIRST(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setFIRST(false);
      notifyAlert("Erro ao encontrar alunos");
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
          fetchStudents();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const sortedStudents = [...students].sort((a, b) => {
    const levelA = updateScore(
      a.totalScore,
      a.flashcards25Reviews,
      a.homeworkAssignmentsDone
    ).level;
    const levelB = updateScore(
      b.totalScore,
      b.flashcards25Reviews,
      b.homeworkAssignmentsDone
    ).level;

    if (levelA === levelB) {
      return b.totalScore - a.totalScore;
    }

    return levelB - levelA;
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ display: "grid" }}>
      {loading && FIRST ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {sortedStudents.map((item: any, index: number) => {
            const levelNumber = updateScore(
              item.totalScore,
              item.flashcards25Reviews,
              item.homeworkAssignmentsDone
            ).level;

            const nextLevel = theItems[levelNumber] || {};
            const remainingPoints =
              (Number(nextLevel.totalScore) || 0) -
              (Number(item.totalScore) || 0);
            const remainingHW =
              (Number(nextLevel.homeworkAssignmentsDone) || 0) -
              (Number(item.homeworkAssignmentsDone) || 0);
            const remainingFC =
              (Number(nextLevel.flashcards25Reviews) || 0) -
              (Number(item.flashcards25Reviews) || 0);
            const isLast = index === sortedStudents.length - 1;

            return (
              <div
                key={item._id}
                ref={isLast ? lastStudentRef : null}
                style={{
                  display: "block",
                  border: `1px solid ${theItems[levelNumber - 1].color}`,
                  backgroundColor: "#000",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                  padding: "5px",
                }}
              >
                <AnimatedLi2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    marginBottom: "0.5rem",
                    background: theItems[levelNumber - 1].color,
                    color: theItems[levelNumber - 1].textcolor,
                    borderRadius: "6px",
                    position: "relative",
                  }}
                >
                  <ImgResponsive3
                    src={theItems[levelNumber - 1].image2}
                    alt="level"
                    style={{ marginRight: "1rem" }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 550 }}>
                      #{index + 1} | {item.name} {item.lastname}
                    </p>
                  </div>
                </AnimatedLi2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem",
                    margin: "0 0 0.5rem 0",
                    zIndex: 10,
                  }}
                >
                  {/* Bloco de Pontos */}
                  <div
                    className="hover-color2"
                    style={{
                      padding: "5px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      maxWidth: "11rem",
                      fontSize: "12px",
                    }}
                    onClick={() => toggleInfo("points", index)}
                  >
                    Total Score:{" "}
                    <span
                      style={{
                        fontWeight: "1000",
                      }}
                    >
                      {formatNumber(item.totalScore)}
                    </span>
                    {showInfo[index]?.points && (
                      <div
                        style={{
                          backgroundColor:
                            remainingPoints <= 0 ? "green" : "red",
                          color: "white",
                          padding: "5px",
                          borderRadius: "6px",
                          marginTop: "5px",
                          fontSize: "12px",
                          textAlign: "left",
                          zIndex: 99,
                        }}
                      >
                        {`São necessários ${nextLevel.totalScore} pontos para passar para o nível ${nextLevel.text}, e ${item.name} fez ${item.totalScore}. `}
                      </div>
                    )}
                  </div>
                  {/* Bloco de Tarefas Restantes */}
                  <div
                    className="hover-color2"
                    style={{
                      padding: "5px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      maxWidth: "11rem",
                      fontSize: "12px",
                    }}
                    onClick={() => toggleInfo("hw", index)}
                  >
                    Homework assignments:{" "}
                    <span
                      style={{
                        fontWeight: "1000",
                      }}
                    >
                      {formatNumber(item.homeworkAssignmentsDone)}
                    </span>
                    {showInfo[index]?.hw && (
                      <div
                        style={{
                          backgroundColor: remainingHW <= 0 ? "green" : "red",
                          color: "white",
                          padding: "5px",
                          borderRadius: "6px",
                          marginTop: "5px",
                          fontSize: "12px",
                          textAlign: "left",
                          zIndex: 99,
                        }}
                      >
                        {`São necessários ${nextLevel.homeworkAssignmentsDone} lições de casa para passar para o nível ${nextLevel.text}, e ${item.name} fez ${item.homeworkAssignmentsDone}.`}
                      </div>
                    )}
                  </div>
                  {/* Bloco de Revisões de 25 cards */}
                  <div
                    className="hover-color2"
                    style={{
                      padding: "5px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",

                      maxWidth: "11rem",
                      fontSize: "12px",
                    }}
                    onClick={() => toggleInfo("fc", index)}
                  >
                    Flashcard daily reviews:{" "}
                    <span
                      style={{
                        fontWeight: "1000",
                      }}
                    >
                      {formatNumber(item.flashcards25Reviews)}
                    </span>
                    {showInfo[index]?.fc && (
                      <div
                        style={{
                          backgroundColor: remainingFC <= 0 ? "green" : "red",
                          color: "white",
                          padding: "5px",
                          borderRadius: "6px",
                          marginTop: "5px",
                          fontSize: "12px",
                          textAlign: "left",
                          zIndex: 99,
                        }}
                      >
                        {`São necessários ${nextLevel.flashcards25Reviews} dias com pelo menos 25 revisões de cards para passar para o nível ${nextLevel.text}, e ${item.name} fez ${item.flashcards25Reviews}. `}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
