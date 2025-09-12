import React, { useEffect, useState } from "react";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Tab, CircularProgress } from "@mui/material";
import { alwaysWhite, partnerColor, textTitleFont } from "../../Styles/Styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddFlashCards from "./FlashCardsComponents/AddFlashCards";
import ReviewFlashCards from "./FlashCardsComponents/ReviewFlashCards";
import AllCards from "./FlashCardsComponents/AllCards";
import { onLoggOut, backDomain } from "../../Resources/UniversalComponents";
import FlashcardsHistory from "./FlashCardsComponents/FlashcardsHistory";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";

interface FlashCardsProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}
const FlashCards = ({ headers, onChange, change }: FlashCardsProps) => {
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
  };

  const fetchData = async () => {
    const user = localStorage.getItem("loggedIn");

    if (user) {
      const { permissions, id } = JSON.parse(user);

      setPermissions(permissions);
      setMyId(id);
      setSelectedStudentId(id);
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
      title: UniversalTexts.sentences,
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
      title: UniversalTexts.myCards,
      value: "2",
      adm: false,
      component: (
        <AllCards headers={headers} selectedStudentId={getCurrentStudentId()} />
      ),
    },
    {
      title: UniversalTexts.history,
      value: "3",
      adm: false,
      component: (
        <FlashcardsHistory
          headers={headers}
          selectedStudentId={getCurrentStudentId()}
        />
      ),
    },
    {
      title: UniversalTexts.add,
      value: "4",
      adm: true,
      component: (
        <AddFlashCards
          display="block"
          selectedStudentName={selectedStudent}
          headers={headers}
          selectedStudentId={getCurrentStudentId()}
        />
      ),
    },
  ];

  const displayIsAdm =
    myPermissions === "superadmin" || myPermissions == "teacher"
      ? "block"
      : "none";
  return (
    <RouteDiv
      style={{
        maxWidth: "90vw",
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
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
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
                setSelectedStudent(
                  studentSelected.name + " " + studentSelected.lastname
                );
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
                minWidth: "200px",
                maxWidth: "300px",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: alwaysWhite(),
            justifyContent: "space-between",
          }}
        >
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              fontFamily: textTitleFont(),
              color: partnerColor(),
              "& .MuiTab-root": {
                fontFamily: textTitleFont(),
                color: partnerColor(),
              },
              "& .Mui-selected": {
                color: partnerColor(),
              },
              "& .MuiTabs-indicator": {
                backgroundColor: partnerColor(),
              },
            }}
          >
            {componentsToRender.map((component, index) => {
              return (
                <Tab
                  key={index + component.value}
                  style={{
                    color: partnerColor(),
                    fontWeight: (index + 1).toString() === value ? 800 : 500,
                    display: component.adm === false ? "block" : displayIsAdm,
                  }}
                  label={component.title}
                  value={component.value}
                />
              );
            })}
          </TabList>
        </div>
        {componentsToRender.map((component, index) => {
          return (
            <TabPanel
              style={{
                padding: 0,
                margin: "1rem auto",
              }}
              key={index + component.value}
              value={component.value}
            >
              {component.component}
            </TabPanel>
          );
        })}
      </TabContext>
    </RouteDiv>
  );
};

export default FlashCards;
