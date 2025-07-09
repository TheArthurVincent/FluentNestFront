import React, { useCallback, useEffect, useRef, useState } from "react";
import { DivFont, HTwo } from "../../../Resources/Components/RouteBox";
import {
  ImgResponsive0,
  Xp,
  abreviateName,
  backDomain,
  formatNumber,
  updateScore,
} from "../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { levels } from "./RankingLevelsList";
import {
  alwaysBlack,
  alwaysWhite,
  partnerColor,
  transparentBlack,
} from "../../../Styles/Styles";
import { listOfButtons } from "./ListOfCriteria";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../MyClasses/MyClasses.Styled";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";
import styled, { keyframes } from "styled-components";

interface StudentsRankingProps {
  headers: MyHeadersType | null;
  monthNow: string;
}

export default function StudentsRanking({
  headers,
  monthNow,
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
    animation: ${fadeIn} 0.3s forwards,
      ${(props) => changeColors(props.color1, props.color2)} 3s infinite;
    border-radius: 6px;
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
  const [card, setCard] = useState<boolean>(false);
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
  const handleSeeModal = () => {
    setStudents([]);
    setPage(1);
    setHasMore(true);
    setIsVisible(!isVisible);
    fetchStudentsScore();
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [FIRST, setFIRST] = useState(true);

  const fetchStudentsScore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/scoresranking/?page=${page}`,
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
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  // useEffect(() => {
  //   setInterval(() => {
  //     fetchStudentsScore();
  //   }, 6000);
  // }, []);
  // ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////
  ///////////

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
  const { UniversalTexts } = useUserContext();

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
      <div
        style={{
          backgroundColor: transparentBlack(),
          width: "10000px",
          height: "10000px",
          top: "0",
          left: "0",
          position: "fixed",
          zIndex: 95,
          display: isVisible ? "block" : "none",
          padding: "1rem",
        }}
        onClick={() => handleSeeModal()}
      />
      <div
        style={{
          position: "fixed",
          zIndex: 100,
          padding: "1rem",
          backgroundColor: alwaysWhite(),
          top: "50%",
          left: "50%",
          width: "100vw",
          maxWidth: "40rem",
          maxHeight: "75vh",
          overflow: "auto",
          display: isVisible ? "block" : "none",
          transform: "translate(-50%, -50%)",
        }}
      >
        {loadingScore ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
            }}
          >
            <Xp
              onClick={() => handleSeeModal()}
              style={{
                fontSize: "1.5rem",
              }}
            >
              x
            </Xp>
            <HThree>
              Monthly Score: <strong>{formatNumber(monthlyScore)} </strong>{" "}
            </HThree>
            <HThree>
              Total Score: <strong>{formatNumber(totalScore)} </strong>
            </HThree>
            <HThree>
              Homework Done: <strong>{totalHomeworkDone} </strong>{" "}
            </HThree>
            <HThree>
              Flashcards 25/day: <strong>{totalFlashCards25} </strong>
            </HThree>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gap: "1rem",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
            }}
          >
            {listOfButtons.map((item, index) => {
              return (
                <ArvinButton
                  key={index}
                  disabled={disabled}
                  style={{
                    color: alwaysWhite(),
                    fontSize: "0.8rem",
                  }}
                  color={item.color}
                  onClick={() =>
                    submitPlusScore(
                      ID,
                      item.score,
                      item.description,
                      item.category
                    )
                  }
                >
                  {item.text}
                </ArvinButton>
              );
            })}

            <div>
              <p>Personalizado</p>
              <input
                style={{ maxWidth: "5rem", marginRight: "5px" }}
                placeholder="Special Score"
                onChange={(e) => changePlusScore(Number(e.target.value))}
                type="number"
              />
              <input
                style={{ maxWidth: "5rem", marginRight: "5px" }}
                placeholder="Description"
                onChange={(e) => setDescSpecial(e.target.value)}
                type="text"
              />
              <ArvinButton
                onClick={() =>
                  submitPlusScore(ID, plusScore, descSpecial, "Others")
                }
              >
                +
              </ArvinButton>
            </div>
            <ArvinButton
              onClick={() => {
                setCard(!card);
              }}
            >
              See card
            </ArvinButton>
          </div>
          <div
            id="the-card"
            style={{ display: card ? "block" : "none", position: "relative" }}
          >
            <img
              style={{
                maxWidth: "30rem",
                position: "absolute",
                zIndex: 1,
              }}
              src={
                updateScore(totalScore, totalFlashCards25, totalHomeworkDone)
                  .card
              }
              alt=""
            />
            <img
              style={{
                maxWidth: "16rem",
                width: "16rem",
                height: "16rem",
                objectFit: "cover",
                margin: "auto",
                borderRadius: "50%",
                position: "relative",
                zIndex: 2,
                left: "7em",
                top: "1em",
              }}
              src={pic}
              alt=""
            />
            <p
              style={{
                position: "relative",
                zIndex: 3,
                maxWidth: "16rem",
                width: "16rem",
                height: "16rem",
                objectFit: "cover",
                margin: "auto",
                borderRadius: "50%",
                left: name.length < 15 ? "5rem" : "3.4rem",
                top: "5rem",
                fontSize: "1.4rem",
              }}
            >
              {name}
            </p>
          </div>
          <p>
            New{" "}
            {updateScore(totalScore, totalFlashCards25, totalHomeworkDone).text}
            !! Congratulations, {name}
          </p>
        </div>
      </div>
      {loading && FIRST ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <ul
          className="border-radius-white"
          style={{
            margin: "20px 0px",
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
                <AnimatedLi
                  style={{
                    border:
                      item._id !== user.id
                        ? "none"
                        : `2px groove ${theItems[levelNumber].backgroundcolor}`,
                  }}
                  color1={theItems[levelNumber].color}
                  color2={
                    item._id !== user.id
                      ? theItems[levelNumber].color
                      : theItems[levelNumber].backgroundcolor
                  }
                  index={index}
                  item={item}
                  background={theItems[levelNumber].color}
                  textColor={theItems[levelNumber].textcolor}
                  className="box-shadow-white"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ImgResponsive0
                      src={theItems[levelNumber].image2}
                      alt="level"
                    />
                    <img
                      style={{
                        width: "3rem",
                        height: "3rem",
                        objectFit: "cover",
                        margin: "auto",
                        borderRadius: "50%",
                        border: `solid ${alwaysWhite()} 2px`,
                      }}
                      src={
                        item.picture ||
                        "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                      }
                    />
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      width: "10rem",
                      padding: "5px",
                      backgroundColor: "none",
                      textAlign: "left",
                      color: theItems[levelNumber].textcolor,
                    }}
                  >
                    #{index + 1} |{" "}
                    {item.name + " " + abreviateName(item.lastname)}
                  </p>
                  <div
                    style={{
                      display: isAdm ? "grid" : "none",
                      // display: "none",
                      alignItems: "center",
                      fontSize: "0.5rem",
                    }}
                  >
                    <div
                      className="pointer-text"
                      style={{
                        padding: "5px",
                        display: "grid",
                        marginBottom: "5px",
                        borderRadius: "6px",
                        alignItems: "center",
                        textAlign: "center",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: item.feeUpToDate ? "green" : "red",
                      }}
                      onClick={() => updateFeeStatus(item._id)}
                    >
                      {item.feeUpToDate ? "Fee Ok" : "Late Fee"}
                    </div>
                    <div
                      className="pointer-text"
                      style={{
                        padding: "5px",
                        display: "grid",
                        alignItems: "center",
                        marginBottom: "5px",
                        borderRadius: "6px",
                        textAlign: "center",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: item.replenishTarget ? "green" : "red",
                      }}
                      onClick={() => updateReplenishTargetStatus(item._id)}
                    >
                      {item.replenishTarget ? "Replenish" : "Non-Replenish"}
                    </div>{" "}
                    <div
                      className="pointer-text"
                      style={{
                        padding: "5px",
                        display: "grid",
                        alignItems: "center",
                        marginBottom: "5px",
                        borderRadius: "6px",
                        textAlign: "center",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: item.tutoree ? "blue" : "orange",
                      }}
                      onClick={() => updateTutoree(item._id)}
                    >
                      {item.tutoree ? "Tutoree" : "Not a tutoreee"}
                    </div>
                    <div
                      className="pointer-text"
                      style={{
                        padding: "5px",
                        display: "grid",
                        alignItems: "center",
                        marginBottom: "5px",
                        borderRadius: "6px",
                        textAlign: "center",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: "#456",
                      }}
                      onClick={() => seeEdition(item._id)}
                    >
                      {formatNumber(item.totalScore)} +
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        borderRadius: "0.5rem",
                        marginBottom: "0.2rem",
                        padding: "5px",
                      }}
                    >
                      <DivFont
                        style={{
                          textAlign: "center",
                          color: alwaysWhite(),
                          textShadow: `2px 0 ${alwaysBlack()},
                             -2px 0 ${alwaysBlack()}, 
                             0 2px ${alwaysBlack()},
                              0 -2px ${alwaysBlack()},
                               1px 1px ${alwaysBlack()},
                                -1px -1px ${alwaysBlack()},
                                 1px -1px ${alwaysBlack()},
                                  -1px 1px ${alwaysBlack()}`,
                        }}
                      >
                        {formatNumber(item.monthlyScore)}{" "}
                      </DivFont>
                    </div>
                  </div>
                </AnimatedLi>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}

{
  /* <span className="top-item">
            {students.map((item: any, index: number) => {
              const levelNumber =
                updateScore(
                  item.totalScore,
                  item.flashcards25Reviews,
                  item.homeworkAssignmentsDone
                ).level - 1;
              return (
                <div
                  style={{
                    display:
                      item._id === user.id && index > 4 ? "block" : "none",
                  }}
                >
                  <HTwo>{UniversalTexts.you}</HTwo>
                  <AnimatedLi
                    style={{
                      border:
                        item._id !== user.id
                          ? "none"
                          : `2px groove ${theItems[levelNumber].backgroundcolor}`,
                    }}
                    key={index + item.picture || "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"}
                    color1={theItems[levelNumber].color}
                    color2={
                      item._id !== user.id
                        ? theItems[levelNumber].color
                        : theItems[levelNumber].backgroundcolor
                    }
                    index={index}
                    item={item}
                    background={theItems[levelNumber].color}
                    textColor={theItems[levelNumber].textcolor}
                    className="box-shadow-white"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ImgResponsive0
                        src={theItems[levelNumber].image2}
                        alt="level"
                      />
                      <img
                        style={{
                          width: "3rem",
                          height: "3rem",
                          objectFit: "cover",
                          margin: "auto",
                          borderRadius: "50%",
                          border: `solid ${alwaysWhite()} 2px`,
                        }}
                        src={item.picture || "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"}
                      />
                    </div>
                    <p
                      style={{
                        fontWeight: 600,
                        width: "fit-content",
                        padding: "5px",
                        textAlign: "left",
                        backgroundColor: "none",
                        color: theItems[levelNumber].textcolor,
                      }}
                    >
                      #{index + 1} |{" "}
                      {item.name + " " + abreviateName(item.lastname)}
                    </p>
                    <div
                      style={{
                        display: isAdm ? "grid" : "none",
                        alignItems: "center",
                        fontSize: "0.5rem",
                      }}
                    >
                      <div
                        className="pointer-text"
                        style={{
                          padding: "5px",
                          display: "grid",
                          marginBottom: "5px",
                          borderRadius: "6px",
                          alignItems: "center",
                          textAlign: "center",
                          width: "fit-content",
                          color: "white",
                          backgroundColor: item.feeUpToDate ? "green" : "red",
                        }}
                        onClick={() => updateFeeStatus(item._id)}
                      >
                        {item.feeUpToDate ? "Fee Ok" : "Late Fee"}
                      </div>
                      <div
                        className="pointer-text"
                        style={{
                          padding: "5px",
                          display: "grid",
                          alignItems: "center",
                          marginBottom: "5px",
                          borderRadius: "6px",
                          textAlign: "center",
                          width: "fit-content",
                          color: "white",
                          backgroundColor: item.replenishTarget
                            ? "green"
                            : "red",
                        }}
                        onClick={() => updateReplenishTargetStatus(item._id)}
                      >
                        {item.replenishTarget ? "Replenish" : "Non-Replenish"}
                      </div>
                      <div
                        className="pointer-text"
                        style={{
                          padding: "5px",
                          display: "grid",
                          alignItems: "center",
                          marginBottom: "5px",
                          borderRadius: "6px",
                          textAlign: "center",
                          width: "fit-content",
                          color: "white",
                          backgroundColor: "#456",
                        }}
                        onClick={() => seeEdition(item._id)}
                      >
                        {formatNumber(item.totalScore)} +
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          borderRadius: "0.5rem",
                          marginBottom: "0.2rem",
                          padding: "5px",
                        }}
                      >
                        <DivFont
                          style={{
                            textAlign: "center",
                            color: alwaysWhite(),
                            textShadow: `2px 0 ${alwaysBlack()},
                             -2px 0 ${alwaysBlack()}, 
                             0 2px ${alwaysBlack()},
                              0 -2px ${alwaysBlack()},
                               1px 1px ${alwaysBlack()},
                                -1px -1px ${alwaysBlack()},
                                 1px -1px ${alwaysBlack()},
                                  -1px 1px ${alwaysBlack()}`,
                          }}
                        >
                          {formatNumber(item.monthlyScore)}{" "}
                        </DivFont>
                      </div>
                    </div>
                  </AnimatedLi>
                </div>
              );
            })}
          </span> */
}
