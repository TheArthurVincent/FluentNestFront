import React, { useState, useEffect } from "react";
import { levels } from "../Ranking/RankingComponents/RankingLevelsList";
import {
  backDomain,
  formatNumber,
  myProfileSVG,
  updateInfo,
  updateScore,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import {
  LevelCardLevel,
  LevelCardPhotoLevel,
  DivCardLevel,
  TextLevelCard,
  NewLevelCardComponent,
  DivDisapearBig,
  DivSeeBig,
} from "./LevelCard.Styled";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { createTheme } from "@mui/material/styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";

interface LevelCardProps {
  headers: MyHeadersType | null;
  _StudentId: string;
  picture: string;
  change: boolean;
}

export function LevelCard({
  headers,
  _StudentId,
  picture,
  change,
}: LevelCardProps) {
  let theme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
  });

  theme = createTheme(theme, {
    // Custom colors created with augmentColor go here
    palette: {
      salmon: theme.palette.augmentColor({
        color: {
          main: "#000",
        },
        name: "#000",
      }),
    },
  });
  const [pictureStudent, setPictureStudent] = useState<string>(picture);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [monthlyScore, setMonthlyScore] = useState<number>(0);
  const [assignmentsDone, setAssignmentsDone] = useState<number>(0);
  const [FC, setFC] = useState<number>(0);
  const [level, setLevel] = useState<number>(9);
  const [showCard, setShowCard] = useState<any>("none");

  const items = levels();
  const actualHeaders = headers || {};

  const seeScore = async (id: string) => {
    // setLoading(true);
    try {
      updateInfo(id, actualHeaders);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: actualHeaders,
      });
      setTotalScore(response.data.totalScore);
      setMonthlyScore(response.data.monthlyScore);
      setPictureStudent(
        response.data.picture ||
          "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
      );
      setAssignmentsDone(response.data.homeworkAssignmentsDone);
      setFC(response.data.flashcards25Reviews);
      var newValue = updateScore(
        response.data.totalScore,
        response.data.flashcards25Reviews,
        response.data.homeworkAssignmentsDone
      );
      const levelDone = newValue.level;
      setLevel(levelDone - 1);
      setShowCard("block");
      // setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "");
    if (getLoggedUser.id) {
      setTimeout(() => {
        seeScore(getLoggedUser.id);
      }, 100);
    } else {
      window.location.assign("/login");
    }
  }, [change]);
  const theItems = levels();

  const levelNumber = updateScore(totalScore, FC, assignmentsDone).level - 1;
  const { UniversalTexts } = useUserContext();

  return (
    <NewLevelCardComponent className="glowing2 box-shadow-black">
      <DivCardLevel>
        <LevelCardLevel
          style={{
            cursor: "pointer",
            display: showCard,
          }}
          onClick={() => {
            window.location.assign("/my-profile");
          }}
          src={items[level].image}
          alt="card"
        />
        <LevelCardPhotoLevel src={pictureStudent} alt="Profile Picture" />{" "}
      </DivCardLevel>{" "}
      <TextLevelCard>
        {" "}
        <div style={{ display: showCard }}>
          {" "}
          <DivDisapearBig>
            <i
              onClick={() => seeScore(_StudentId)}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
              className={items[level].icon}
              aria-hidden="true"
            />{" "}
          </DivDisapearBig>
          <div
            style={{
              marginTop: "5px",
              display: "grid",
              gap: "10px",
              fontSize: "10px",
              alignItems: "center",
            }}
          >
            <>
              <DivDisapearBig>
                <p style={{ color: "#fff" }}>
                  {UniversalTexts.totalScore}: {formatNumber(totalScore)}
                </p>
                <p style={{ color: "#fff" }}>
                  {UniversalTexts.monthlyScore}: {formatNumber(monthlyScore)}
                </p>
                <p style={{ color: "#fff" }}>
                  {UniversalTexts.homework}: {formatNumber(assignmentsDone)}
                </p>
                <p style={{ color: "#fff" }}>
                  {UniversalTexts.flashcardsDailyReviews}: {formatNumber(FC) || FC}
                </p>
              </DivDisapearBig>
              <div
                style={{
                  display: "grid",
                  gap: "5px",
                }}
              >
                <DivSeeBig>
                  <i
                    onClick={() => seeScore(_StudentId)}
                    style={{
                      display: "grid",
                      alignItems: "center",
                      color: "white",
                      fontSize: "12px",
                    }}
                    className={items[level].icon}
                    aria-hidden="true"
                  />{" "}
                  <p style={{ color: "#fff" }}>
                    <span
                      style={{
                        fontWeight: 1000,
                      }}
                    >
                      {UniversalTexts.totalScore}:{" "}
                    </span>{" "}
                    {formatNumber(totalScore)}
                  </p>
                  <p style={{ color: "#fff" }}>
                    <span
                      style={{
                        fontWeight: 1000,
                      }}
                    >
                      {UniversalTexts.monthlyScore}:{" "}
                    </span>
                    {formatNumber(monthlyScore)}
                  </p>
                  <p style={{ color: "#fff" }}>
                    <span
                      style={{
                        fontWeight: 1000,
                      }}
                    >
                      {UniversalTexts.homework}:{" "}
                    </span>
                    {formatNumber(assignmentsDone)}
                  </p>
                  <p style={{ color: "#fff" }}>
                    <span
                      style={{
                        fontWeight: 1000,
                      }}
                    >
                      {UniversalTexts.flashcardsDailyReviews}:{" "}
                    </span>
                    {formatNumber(FC)}
                  </p>
                </DivSeeBig>
              </div>
            </>
          </div>
        </div>
      </TextLevelCard>
    </NewLevelCardComponent>
  );
}

export default LevelCard;
