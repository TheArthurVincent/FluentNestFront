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
  const [studentPermissions, setStudentPermissions] = useState("");
  const [id, setId] = useState<string>("");

  const [level, setLevel] = useState<number>(9);
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const seeScore = async (id: string) => {
    try {
      updateInfo(id, headers);
      setAppLoaded(!appLoaded);
    } catch (e) {
      console.log(e);
    }

    // Pega permissões do localStorage
    const { permissions } = JSON.parse(
      localStorage.getItem("loggedIn") || "{}"
    );
    setPERMISSIONS(permissions || "");
    console.log("Score data response:", permissions);

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
  const [financialReports, setFinancialReports] = useState<any[]>([]);
  const [thereAreReports, setThereAreReports] = useState<boolean>(false);
  const [loadingReports, setLoadingReports] = useState<boolean>(true);

  const seeReports = async () => {
    //fórmula que pega a data atual e coloca no formato mm-yyyy
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Meses são baseados em zero
    const currentYear = currentDate.getFullYear();
    const currentMonthYear = `${currentMonth}-${currentYear}`;

    try {
      const response = await axios.get(`${backDomain}/api/v1/finance/${id}`, {
        headers: headers ? { ...headers } : {},
        params: { month: currentMonthYear },
      });

      if (response.data.financialReportsOfTheMonth?.length === 0) {
        setFinancialReports(
          response.data.financialReportsOfTheMonth?.length > 0
            ? response.data.financialReportsOfTheMonth
            : []
        );
        setThereAreReports(false);
      } else {
        setFinancialReports(response.data.financialReportsOfTheMonth || []);
        setTimeout(() => {
          setThereAreReports(true);
        }, 500);
      }
      setLoadingReports(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  const entradasRecebidas = financialReports
    .filter(
      (report) =>
        report.accountFor &&
        report.typeOfItem !== "debt" &&
        (report.paidFor || (report.paidSoFar && report.paidSoFar > 0))
    )
    .reduce((total, report) => {
      // Sempre usar paidSoFar quando disponível, pois pode ser maior que o valor original
      if (report.paidSoFar && report.paidSoFar > 0) {
        return total + Math.abs(report.paidSoFar);
      } else if (report.paidFor) {
        // Fallback para casos onde paidFor é true mas paidSoFar não está definido
        return total + (Math.abs(report.amount || 0) - (report.discount || 0));
      }
      return total;
    }, 0);

  useEffect(() => {
    seeReports();
  }, []);

  const canSee = (item: { showToStudent: boolean; showToTeacher: boolean }) => {
    // Teacher e superadmin usam showToTeacher
    if (PERMISSIONS === "teacher" || PERMISSIONS === "superadmin") {
      return item.showToTeacher;
    }
    // Qualquer outro caso (student / vazio) usa showToStudent
    return item.showToStudent;
  };
  const [showMoney, setShowMoney] = useState<boolean>(false);

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
              {studentPermissions == "student" ? (
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
              ) : (
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
                    {!showMoney ? (
                      <i
                        style={{
                          color: partnerColor(),
                        }}
                        className="fa fa-eye"
                      />
                    ) : (
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
                        {formatNumber(entradasRecebidas)}
                      </span>
                    )}
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
          columnCount: isDesktop ? 2 : 1, // 2 colunas no desktop, 1 no celular
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
                breakInside: "avoid", // evita quebrar o card entre colunas
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
