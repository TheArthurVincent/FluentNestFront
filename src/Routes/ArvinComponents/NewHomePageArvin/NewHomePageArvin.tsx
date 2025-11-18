import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  updateInfo,
  updateScore,
} from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import { Continue } from "../Continue/Continue";
import { NextClass } from "../GridHomePageComponents/NextClass";
import { FlashcardsReview } from "../GridHomePageComponents/FlashcardsReview";
import { PracticalTipsTarget } from "../GridHomePageComponents/PracticalTipsTarget";
import { HomeworkCard } from "../GridHomePageComponents/HomeworkCard";
import { CalendarCard } from "../GridHomePageComponents/CalendarCard";
import { WeeklyProgress } from "../GridHomePageComponents/WeeklyProgress";
import { RankingCard } from "../GridHomePageComponents/RankingCard";
import { RecommendedMaterials } from "../GridHomePageComponents/RecommendedMaterials";

type MyHomePageProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};

export function MyHomePage({
  headers,
  change,
  setChange,
  isDesktop,
  actualHeaders,
}: MyHomePageProps) {
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [PERMISSIONS, setPERMISSIONS] = useState<
    "student" | "teacher" | "superadmin" | ""
  >("");
  const [studentPicture, setStudentPicture] = useState("");
  const [id, setId] = useState<string>("");

  const [level, setLevel] = useState<number>(9);

  const seeScore = async (id: string) => {
    try {
      updateInfo(id, headers);
    } catch (e) {
      console.log(e);
    }

    // Pega permissões do localStorage
    const { permissions } = JSON.parse(
      localStorage.getItem("loggedIn") || "{}"
    );
    setPERMISSIONS(permissions || "");

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: headers ? { ...headers } : {},
      });
      setMonthlyScore(response.data.monthlyScore);
      setStudentPicture(response.data.picture);
      var newValue = updateScore(
        response.data.totalScore,
        response.data.flashcards25Reviews,
        response.data.homeworkAssignmentsDone
      );
      const levelDone = newValue.level;
      setLevel(levelDone - 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const id = user.id;
    setId(id);
    seeScore(id);
  }, [change]);

  // ====== LÓGICA DE PERMISSÕES ======
  const cards = [
    {
      showToStudent: true,
      showToTeacher: true,
      component: <NextClass studentId={id} actualHeaders={actualHeaders} />,
    },
    {
      showToStudent: true,
      showToTeacher: false,
      component: <FlashcardsReview actualHeaders={actualHeaders} />,
    },
    {
      showToStudent: true,
      showToTeacher: false,
      component: (
        <PracticalTipsTarget
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={true}
        />
      ),
    },
    {
      showToTeacher: false,
      showToStudent: true,
      component: (
        <HomeworkCard
          isDesktop={isDesktop}
          studentId={id}
          actualHeaders={actualHeaders}
          appLoaded={true}
        />
      ),
    },
    {
      showToStudent: false,
      showToTeacher: true,
      component: (
        <CalendarCard
          studentId={id}
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
        />
      ),
    },
    {
      showToStudent: true,
      showToTeacher: false,
      component: (
        <WeeklyProgress
          studentId={id}
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={true}
        />
      ),
    },
    {
      showToStudent: true,
      showToTeacher: false,
      component: (
        <RecommendedMaterials
          studentId={id}
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={true}
        />
      ),
    },
    {
      showToTeacher: true,
      showToStudent: true,
      component: (
        <RankingCard
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={true}
        />
      ),
    },
  ];

  const canSee = (item: { showToStudent: boolean; showToTeacher: boolean }) => {
    // Teacher e superadmin usam showToTeacher
    if (PERMISSIONS === "teacher" || PERMISSIONS === "superadmin") {
      return item.showToTeacher;
    }
    // Qualquer outro caso (student / vazio) usa showToStudent
    return item.showToStudent;
  };

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
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
                onClick={() => {
                  window.location.assign("/my-profile");
                }}
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={
                  studentPicture ||
                  "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                }
                alt={studentPicture}
              />{" "}
            </span>
          </section>
        </div>
      )}
      <Continue isDesktop={isDesktop} actualHeaders={actualHeaders} />
      <div
        style={{
          gap: "16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "start",
          justifyContent: "center",
          marginTop: "32px",
          paddingBottom: "64px",
        }}
      >
        {cards.map((item, index) => {
          if (!canSee(item)) return null; // não renderiza nada se não tiver permissão
          return (
            <div
              key={index}
              style={{
                display: "grid",
                backgroundColor: "white",
                borderRadius: "16px",
                flex: 1,
                minWidth: "320px",
                alignItems: "start",
                height: "fit-content",
                border: "1px solid #E3E8F0",
                padding: "20px",
              }}
            >
              {item.component}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyHomePage;
