import React, { useEffect, useState } from "react";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Tab, CircularProgress } from "@mui/material";
import { alwaysWhite, partnerColor } from "../../Styles/Styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddFlashCards from "./FlashCardsComponents/AddFlashCards";
import ReviewFlashCards from "./FlashCardsComponents/ReviewFlashCards";
import AllCards from "./FlashCardsComponents/AllCards";
import { onLoggOut, backDomain } from "../../Resources/UniversalComponents";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import "./flashcards.css";
import axios from "axios";
import { newArvinTitleStyle } from "../ArvinComponents/Groups/Groups";

interface FlashCardsProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
  changeTokens: boolean;
  setChangeTokens: any;
  isDesktop?: boolean;
}

/* ===============================
   Hook responsivo (fallback)
   =============================== */
const useIsDesktop = (bp = 700) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > bp : true
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return isDesktop;
};

const FlashCards = ({
  headers,
  onChange,
  change,
  changeTokens,
  isDesktop: isDesktopProp,
  setChangeTokens,
}: FlashCardsProps) => {
  const isDesktop = isDesktopProp ?? useIsDesktop(700);

  const [myId, setMyId] = useState<string>("");
  const [myPermissions, setPermissions] = useState<string>("");
  const [value, setValue] = useState<string>("1");
  const { UniversalTexts } = useUserContext();

  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);

  const actualHeaders = headers || {};
  const getCurrentStudentId = () => {
    if (
      (myPermissions === "superadmin" || myPermissions === "teacher") &&
      selectedStudentId
    ) {
      return selectedStudentId;
    }
    return myId;
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentID", studentId);
  };

  const fetchData = async () => {
    const user = localStorage.getItem("loggedIn");

    if (user) {
      const { permissions, id } = JSON.parse(user);
      const selectedStudentID =
        localStorage.getItem("selectedStudentID") || "null";

      setPermissions(permissions);
      setMyId(id);
      setSelectedStudentId(selectedStudentID || id);
      if (permissions === "superadmin" || permissions === "teacher") {
        setLoadingStudents(true);
        try {
          const response = await axios.get(
            `${backDomain}/api/v1/students/${id}`,
            {
              headers: actualHeaders,
            }
          );
          const allUsers = response.data.listOfStudents || response.data;
          setStudents(allUsers);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setLoadingStudents(false);
        }
      }
    } else {
      console.log("No user found in localStorage, logging out");
      onLoggOut();
    }
  };

  useEffect(() => {
    fetchData();
  }, [actualHeaders]);

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const componentsToRender = [
    {
      title: UniversalTexts.reviewFlashcards,
      value: "1",
      adm: false,
      component: (
        <ReviewFlashCards
          onChange={onChange}
          change={change}
          headers={headers}
          selectedStudentId={getCurrentStudentId()}
        />
      ),
    },

    {
      title: UniversalTexts.add,
      value: "2",
      adm: true,
      component: (
        <AddFlashCards
          display="block"
          change={changeTokens}
          setChange={setChangeTokens}
          selectedStudentName={selectedStudent}
          headers={headers}
          selectedStudentId={getCurrentStudentId()}
        />
      ),
    },
    {
      title: UniversalTexts.myCards,
      value: "3",
      adm: false,
      component: (
        <AllCards headers={headers} selectedStudentId={getCurrentStudentId()} />
      ),
    },
  ];

  const displayIsAdm =
    myPermissions === "superadmin" || myPermissions == "teacher"
      ? "block"
      : "none";

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {/* Título da página (desktop) */}
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
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
            <span style={newArvinTitleStyle}>Flashcards</span>
          </section>
        </div>
      )}

      {/* CARD PRINCIPAL */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          margin: !isDesktop ? "12px" : "16px auto",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          border: "1px solid #e8eaed",
          padding: isDesktop ? "16px 18px 18px" : "12px 14px 16px",
          maxWidth: 960,
        }}
      >
        <Helmets text="Flashcards" />

        {/* HEADER DO CARD: título + seleção de aluno (quando ADM) */}
        {(myPermissions === "superadmin" || myPermissions === "teacher") && (
          <header
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              justifyContent: "space-between",
              alignItems: isDesktop ? "center" : "flex-start",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                padding: "6px 8px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "auto",
                minWidth: isDesktop ? 200 : "90%",
              }}
            >
              {loadingStudents ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "90%",
                  }}
                >
                  <CircularProgress
                    size={18}
                    style={{ color: partnerColor() }}
                  />
                </div>
              ) : (
                <>
                  <select
                    onChange={(e) => {
                      handleStudentChange(e);
                      const studentSelected = students.find(
                        (student) =>
                          student.id === e.target.value ||
                          student.theId === e.target.value
                      );
                      if (studentSelected) {
                        setSelectedStudent(
                          (studentSelected.name || "") +
                            " " +
                            (studentSelected.lastname || "")
                        );
                      } else {
                        setSelectedStudent("");
                      }
                    }}
                    value={selectedStudentId}
                    style={{
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      fontWeight: 400,
                      maxWidth: isDesktop ? "140px" : "90%",
                      padding: "4px 8px",
                      minWidth: isDesktop ? "180px" : "100%",
                      outline: "none",
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = partnerColor();
                      e.target.style.backgroundColor = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.backgroundColor = alwaysWhite();
                    }}
                  >
                    <option value="">
                      {UniversalTexts?.selectAStudent ||
                        "Selecione um aluno..."}
                    </option>
                    {students.map((student) => (
                      <option
                        key={student.id || student.theId}
                        value={student.id || student.theId}
                      >
                        {student.name} {student.lastname}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                marginBottom: 10,
              }}
            />
          </header>
        )}

        {/* LINHA DIVISÓRIA */}

        {/* TABS + CONTEÚDO */}
        <TabContext value={value}>
          {/* TABLIST em “pill” style */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="flashcards tabs"
              sx={() => {
                const color = partnerColor();
                return {
                  width: "fit-content",
                  maxWidth: 520,
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiTabs-flexContainer": {
                    gap: 4,
                    backgroundColor: "#f1f5f9",
                    borderRadius: 6,
                    padding: "3px",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    minHeight: 32,
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 6,
                    color: "#64748b",
                    "&.Mui-selected": {
                      color: color,
                      backgroundColor: "#ffffff",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                };
              }}
            >
              {componentsToRender.map((component, index) => {
                const color = partnerColor();
                const isSelected = component.value === value;
                return (
                  <Tab
                    key={index + component.value}
                    style={{
                      color,
                      fontWeight: isSelected ? 800 : 500,
                      display: component.adm === false ? "block" : displayIsAdm,
                      flex: isDesktop ? "0 0 auto" : "1 0 auto",
                    }}
                    label={component.title}
                    value={component.value}
                  />
                );
              })}
            </TabList>
          </div>

          {/* PAINÉIS */}
          {componentsToRender.map((component, index) => {
            return (
              <TabPanel
                key={index + component.value}
                value={component.value}
                style={{
                  padding: 0,
                  margin: isDesktop ? "0.75rem auto 0" : "0.5rem auto 0",
                }}
              >
                {component.component}
              </TabPanel>
            );
          })}
        </TabContext>
      </div>
    </div>
  );
};

export default FlashCards;
