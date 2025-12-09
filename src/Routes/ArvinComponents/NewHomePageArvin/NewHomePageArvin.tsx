import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatNumber,
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
import { SearchMaterials } from "../SearchMaterials/SearchMaterials";
import Helmets from "../../../Resources/Helmets";
import Tokens from "../../Tokens";

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
  const [loadingReports, setLoadingReports] = useState<boolean>(true);
  const [totalPaidSoFar, setTotalPaidSoFar] = useState<number>(0);
  const [showMoney, setShowMoney] = useState<boolean>(false);

  const seeScore = async (id: string) => {
    try {
      updateInfo(id, headers);
      setAppLoaded(!appLoaded);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(`${backDomain}/api/v1/score/${id}`, {
        headers: headers ? { ...headers } : {},
      });
      setMonthlyScore(response.data.monthlyScore);
      setStudentPicture(response.data.picture);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const permissions = user.permissions;
    const id = user.id;
    setId(id);
    setPERMISSIONS(permissions);
    seeScore(id);
  }, [change]);

  const cards = [
    // {
    //   showToStudent: true,
    //   showToTeacher: true,
    //   component: (
    //     <NextClass
    //       isDesktop={isDesktop}
    //       studentId={id}
    //       actualHeaders={actualHeaders}
    //     />
    //   ),
    // },
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
      showToTeacher: true,
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
    {
      showToStudent: true,
      showToTeacher: false,
      component: (
        <RecommendedMaterials
          studentId={id}
          isDesktop={isDesktop}
          actualHeaders={actualHeaders}
          appLoaded={appLoaded}
        />
      ),
    },
  ];

  const seeReports = async () => {
    setLoadingReports(true);
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentYear = currentDate.getFullYear();

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/finance-entries/${id}`,
        {
          headers: headers ? { ...headers } : {},
          params: { month: `${currentMonth}-${currentYear}` },
        }
      );
      console.log("Financial reports response:", response.data);
      setTotalPaidSoFar(response.data.totalPaidSoFar || 0);
      setLoadingReports(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    seeReports();
  }, [id, change]);

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
              {/* <span style={{ position: "relative", display: "inline-block" }}>
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
                <SearchMaterials
                  headers={headers}
                  change={change}
                  setChange={setChange}
                  isDesktop={isDesktop}
                  actualHeaders={actualHeaders}
                />
              </span> */}
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
                    display: !loadingReports ? "flex" : "none",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "80px",
                    padding: "8px 12px",
                    backgroundColor: `${partnerColor()}20`,
                    border: `1px solid ${partnerColor()}50`,
                  }}
                >
                  <i
                    className="fa fa-money"
                    style={{
                      fontSize: "12px",
                      left: "10px",
                      marginTop: "2px",
                      top: "50%",
                      color: partnerColor(),
                      pointerEvents: "none",
                    }}
                  />
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
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        color: partnerColor(),
                        fontStyle: "SemiBold",
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                      }}
                    >
                      {formatNumber(totalPaidSoFar)}
                    </span>
                  </span>
                </span>
              )}{" "}
              {PERMISSIONS !== "student" && (
                <span
                  onClick={() => {
                    seeScore(id);
                  }}
                  style={{
                    display: !loadingReports ? "flex" : "none",
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
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        color: partnerColor(),
                        fontStyle: "SemiBold",
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                      }}
                    >
                      {
                        <Tokens
                          id={id}
                          headers={actualHeaders}
                          change={change}
                        />
                      }
                    </span>
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
              />{" "}
            </span>
          </section>
        </div>
      )}
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
