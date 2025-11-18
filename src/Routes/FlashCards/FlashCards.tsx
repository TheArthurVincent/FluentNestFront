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
        margin: "16px auto",
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 600,
        fontStyle: "SemiBold",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8eaed",
        padding: "2rem",
        width: isDesktop ? "70vw" : "",
      }}
    >
      <Helmets text="Flashcards" />
      {(myPermissions === "superadmin" || myPermissions === "teacher") && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: alwaysWhite(),
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          {loadingStudents ? (
            <CircularProgress size={20} style={{ color: partnerColor() }} />
          ) : (
            <select
              onChange={(e) => {
                handleStudentChange(e);
                const studentSelected = students.find(
                  (student) => student.id === e.target.value
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
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "13px",
                fontWeight: "400",
                color: "#64748b",
                padding: "6px 8px",
                minWidth: isDesktop ? "200px" : "unset",
                maxWidth: isDesktop ? "300px" : "unset",
                width: isDesktop ? "auto" : "100%",
                outline: "none",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = partnerColor();
                e.target.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
              }}
            >
              <option value="">
                {UniversalTexts?.selectAStudent || "Selecione um aluno..."}
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
          )}
        </div>
      )}

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          sx={() => {
            const color = partnerColor();
            return {
              width: "100%",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              justifyContent: "space-between",
              display: "flex",
              color,
              "& .MuiTab-root": {
                color,
                padding: 0, // mantém seu padding original
                minHeight: 44,
              },
              "& .Mui-selected": {
                color,
                padding: 0, // mantém seu padding original
              },
              "& .MuiTabs-indicator": {
                backgroundColor: color,
                height: 2,
              },
            };
          }}
        >
          {componentsToRender.map((component, index) => {
            const color = partnerColor();
            return (
              <Tab
                key={index + component.value}
                style={{
                  color,
                  fontWeight: (index + 1).toString() === value ? 800 : 500,
                  display: component.adm === false ? "block" : displayIsAdm,
                  // RESPONSIVO: tabs mais “clicáveis” no mobile
                  flex: isDesktop ? "0 0 auto" : "1 0 auto",
                }}
                label={component.title}
                value={component.value}
              />
            );
          })}
        </TabList>

        {componentsToRender.map((component, index) => {
          return (
            <TabPanel
              style={{
                padding: 0,
                margin: isDesktop ? "1rem auto" : "0.75rem auto",
              }}
              key={index + component.value}
              value={component.value}
            >
              {component.component}
            </TabPanel>
          );
        })}
      </TabContext>
    </div>
  );
};

export default FlashCards;
