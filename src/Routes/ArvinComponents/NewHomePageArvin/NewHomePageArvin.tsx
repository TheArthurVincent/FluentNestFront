import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { backDomain, updateInfo } from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import { Continue } from "../Continue/Continue";
import { FlashcardsReview } from "../GridHomePageComponents/FlashcardsReview";
import { PracticalTipsTarget } from "../GridHomePageComponents/PracticalTipsTarget";
import { HomeworkCard } from "../GridHomePageComponents/HomeworkCard";
import { CalendarCard } from "../GridHomePageComponents/CalendarCard";
import { WeeklyProgress } from "../GridHomePageComponents/WeeklyProgress";
import { RankingCard } from "../GridHomePageComponents/RankingCard";
import Helmets from "../../../Resources/Helmets";
import Tokens from "../../Tokens";
import { Birthdays } from "../GridHomePageComponents/Birthdays";
import { User } from "../../MyProfile/types.MyProfile"; // AJUSTE SE PRECISAR
import ModalShowAllCORINGA from "./ModalAll/NewHomePageArvin";

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
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [showMoney, setShowMoney] = useState<boolean>(false);

  const [universalWarning, setUniversalWarning] = useState<boolean>(false);
  const [showUniversalWarningModal, setShowUniversalWarningModal] =
    useState<boolean>(false);

  const [user, setUser] = useState<User>({} as User);

  const isUniversalWarning = async (userId: string) => {
    try {
      updateInfo(userId, headers);
      setAppLoaded((prev) => !prev);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/universal-warning/${userId}`,
        {
          headers: headers ? { ...headers } : {},
        },
      );

      const warning = response.data.universalWarning;
      setUniversalWarning(warning);
      setShowUniversalWarningModal(warning);

      setTimeout(() => {
        setAppLoaded((prev) => !prev);
      }, 800);
    } catch (error) {
      console.error(error);
    }
  };

  const seeScore = async (userId: string) => {
    try {
      updateInfo(userId, headers);
      setAppLoaded((prev) => !prev);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${userId}`, {
        headers: headers ? { ...headers } : {},
      });

      setMonthlyScore(response.data.monthlyScore);
      setStudentPicture(response.data.picture);

      setAppLoaded((prev) => !prev);
      setTimeout(() => {
        setAppLoaded((prev) => !prev);
      }, 800);
    } catch (error) {
      console.error(error);
    }
  };

  const turnOffUniversalWarning = async () => {
    if (!id) return;

    try {
      await axios.put(
        `${backDomain}/api/v1/universal-warning/${id}`,
        {},
        {
          headers: headers ? { ...headers } : {},
        },
      );

      setUniversalWarning(false);
      setShowUniversalWarningModal(false);

      updateInfo(id, headers);
      setAppLoaded((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const permissions = userLocal.permissions;
    const userId = userLocal.id;

    setUser(userLocal);
    setId(userId);
    setPERMISSIONS(permissions);

    if (userId) {
      seeScore(userId);
      setAppLoaded((prev) => !prev);
      isUniversalWarning(userId);
    }
  }, [change]);

  const cards = [
    {
      showToStudent: false,
      showToTeacher: true,
      component: (
        <Birthdays
          studentId={id}
          appLoaded={appLoaded}
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
          appLoaded={appLoaded}
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
          appLoaded={appLoaded}
        />
      ),
    },
    {
      showToTeacher: false,
      showToStudent: true,
      component: (
        <RankingCard
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={appLoaded}
        />
      ),
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
          appLoaded={appLoaded}
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
  ];

  const canSee = (item: { showToStudent: boolean; showToTeacher: boolean }) => {
    if (PERMISSIONS === "teacher" || PERMISSIONS === "superadmin") {
      return item.showToTeacher;
    }
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
              {PERMISSIONS == "student" && (
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
              )}

              {PERMISSIONS !== "student" && (
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
                  <span
                    onClick={() => setShowMoney(!showMoney)}
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
                    <Tokens id={id} headers={actualHeaders} change={change} />
                  </span>
                </span>
              )}

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
              />
            </span>
          </section>
        </div>
      )}
      <ModalShowAllCORINGA
        universalWarning={universalWarning}
        onClose={() => window.location.reload()}
        user={user}
        headers={actualHeaders}
        isDesktop={isDesktop}
        onSaved={async () => {
          await turnOffUniversalWarning();
        }}
      />
      <Continue isDesktop={isDesktop} actualHeaders={actualHeaders} />

      <div
        style={{
          columnCount: isDesktop ? 2 : 1,
          columnGap: "16px",
          marginTop: "32px",
          paddingBottom: "64px",
        }}
      >
        {cards.map((item, index) => {
          if (!canSee(item)) return null;

          return (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                breakInside: "avoid",
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #E3E8F0",
                padding: "20px",
              }}
            >
              {item.component}
            </div>
          );
        })}
      </div>

      <Helmets text={`Início`} />
    </div>
  );
}

export default MyHomePage;
