import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  updateInfo,
  updateScore,
} from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";

type MyHomePageProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};
export function MyHomePage({ headers, change, setChange }: MyHomePageProps) {
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [studentPicture, setStudentPicture] = useState("");
  const [id, setId] = useState<string>("");

  const [level, setLevel] = useState<number>(9);

  const seeScore = async (id: string) => {
    // setLoading(true);
    try {
      updateInfo(id, headers);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: headers ? { ...headers } : {},
      });
      setTotalScore(response.data.totalScore);
      setMonthlyScore(response.data.monthlyScore);
      setStudentPicture(response.data.picture);
      var newValue = updateScore(
        response.data.totalScore,
        response.data.flashcards25Reviews,
        response.data.homeworkAssignmentsDone
      );
      console.log("Using headers:", response.data);

      const levelDone = newValue.level;
      setLevel(levelDone - 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "");
    const id = user.id;
    setId(id);
    console.log("Fetching score for user ID:", id);
    console.log("Using headers:", headers);
    seeScore(id);
  }, [change]);

  return (
    <div
      style={{
        paddingTop: 29,
        paddingBottom: 17,
        display: "flex",
        marginRight: "24px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "8px",
          fontSize: "1.5rem",
        }}
      >
        <span style={newArvinTitleStyle}>Início</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            justifyContent: "space-between",
          }}
        >
          <span style={{ position: "relative", display: "inline-block" }}>
            <i
              className="fa fa-search"
              style={{
                fontSize: "12px",
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                pointerEvents: "none",
              }}
            />
            <input
              style={{
                width: "312px",
                padding: "8px 8px 8px 32px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              placeholder="Busque materiais, palavras e etc..."
              type="text"
            />
          </span>
          <span
            onClick={() => {
              seeScore(id);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "80px",
              padding: "8px 12px",
              backgroundColor: `${partnerColor()}20`,
              border: `1px solid ${partnerColor()}50`,
            }}
          >
            <i
              className="fa fa-trophy"
              style={{
                fontSize: "12px",
                left: "10px",
                top: "50%",
                color: partnerColor(),
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontStyle: "SemiBold",
                fontSize: "14px",
                color: partnerColor(),
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              {monthlyScore} pts
            </span>
          </span>
          <img
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "27px",
            }}
            src={
              studentPicture ||
              "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
            }
            alt=""
          />{" "}
        </span>
      </section>
    </div>
  );
}

export default MyHomePage;
