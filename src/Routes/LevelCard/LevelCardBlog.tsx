import React, { useState, useEffect } from "react";
import { levels } from "../Ranking/RankingComponents/RankingLevelsList";
import {
  backDomain,
  formatNumber,
  onLoggOut,
  updateInfo,
  updateScore,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import {
  LevelCardBlogLevel,
  LevelCardPhotoBlogLevel,
  DivCardBlogLevel,
  TextLevelBlogCard,
  ExternalDivCardBlogLevel,
} from "./LevelCard.Styled";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { createTheme } from "@mui/material/styles";

interface LevelCardBlogProps {
  headers: MyHeadersType | null;
  _StudentId: string;
  picture: string;
  change: boolean;
}

export function LevelCardBlog({
  headers,
  _StudentId,
  picture,
  change,
}: LevelCardBlogProps) {
  let theme = createTheme({});

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
      setPictureStudent(response.data.picture);
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

  return (
    <ExternalDivCardBlogLevel>
      <DivCardBlogLevel>
        <LevelCardBlogLevel
          style={{ display: showCard }}
          src={items[level].image}
          alt="card"
        />{" "}
        <LevelCardPhotoBlogLevel
          src={
            pictureStudent ||
            "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
          }
          alt="Profile Picture"
        />{" "}
      </DivCardBlogLevel>{" "}
      <TextLevelBlogCard>
        <div style={{ display: showCard }}>
          <div
            style={{
              fontSize: "1rem",
              marginTop: "2rem",
              textAlign: "center",
            }}
          >
            <i
              onClick={() => seeScore(_StudentId)}
              style={{
                display: showCard,
                cursor: "pointer",
              }}
              className="fa fa-refresh"
              aria-hidden="true"
            />{" "}
            <p>
              <b>Total Score:</b> {formatNumber(totalScore)}
            </p>
            <p>
              <b>Monthly Score:</b> {formatNumber(monthlyScore)}
            </p>
            <p>
              <b>Homework Assignments:</b> {formatNumber(assignmentsDone)}
            </p>
            <p>
              <b>Flashcard Daily Reviews:</b> {formatNumber(FC)}
            </p>
          </div>
        </div>
      </TextLevelBlogCard>
    </ExternalDivCardBlogLevel>
  );
}

export default LevelCardBlog;
