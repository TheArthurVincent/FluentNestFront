import React, { useEffect, useState } from "react";
import Ranking from "./Ranking/Ranking";
import GroupClasses from "./GroupClasses/GroupClasses";
import { isArthurVincent, isLocalHost, verifyToken } from "../App";
import { Outlet, Route, Routes } from "react-router-dom";
import {
  backDomain,
  onLoggOut,
  onLoggOutFee,
  pathGenerator,
  updateInfo,
} from "../Resources/UniversalComponents";
import MyProfile from "./MyProfile/MyProfile";
import Faq from "./Faq/Faq";
import MyClasses from "./MyClasses/MyClasses";
import MyCalendar from "./MyCalendar/MyCalendar";
import Adm from "./Adm/Adm";
import Blog from "./HomePage/HomePageContent";
import { LevelCard } from "./LevelCard/LevelCard";
import {
  BlogRouteSizeControlBox,
  RouteDiv,
} from "../Resources/Components/RouteBox";
import { HeadersProps } from "../Resources/types.universalInterfaces";
import { TopBar } from "../Application/TopBar/TopBar";
import FlashCards from "./FlashCards/FlashCards";
import Homework from "./Homework/Homework";
import AppFooter from "../Application/Footer/Footer";
import EnglishCourses from "./EnglishLessons/Courses";
import Listening from "./ListeningExercise/Listening";
import SentenceMining from "./SentenceMining/SentenceMining";
import BlogPosts from "./HomePage/BlogPosts";
import WordOfTheDayList from "./WordOfTheDay/WordOfTheDayList";
import Login from "./Login/Login";
import Redirect from "../Redirect";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import {
  partnerColor,
  theBackgroundColor,
  textPrimaryColorContrast,
  logoPartner,
  textTitleFont,
  textGeneralFont,
} from "../Styles/Styles";

export function HomePage({ headers }: HeadersProps) {
  var [loading, setLoading] = useState<boolean>(true);
  var [thePermissions, setPermissions] = useState<string>("");
  var [admin, setAdmin] = useState<boolean>(false);
  var [teacher, setTeacher] = useState<boolean>(false);
  var [_StudentId, setStudentId] = useState<string>("");
  var [picture, setPicture] = useState<string>("");
  var [change, setChange] = useState<boolean>(true);
  var [see, setSee] = useState(false);
  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    if (user) {
      var { permissions, picture, id } = JSON.parse(user);
      setPermissions(permissions);
      setStudentId(id || _StudentId);
      setPicture(picture);
      setAdmin(permissions === "superadmin" ? true : false);
      setTeacher(permissions === "teacher" ? true : false);
    } else {
      onLoggOut();
      return;
    }

    updateInfo(id, headers);
  }, []);

  var seeFee = async () => {
    if (_StudentId !== "") {
      console.log("Student ID is set, proceeding with fee check.");

      var response = await axios.get(
        `${backDomain}/api/v1/studentfeeuptodate/${_StudentId}`
      );
      if (response.data.feeUpToDate === false) {
        onLoggOutFee();
      } else {
        console.log("Fee is up to date");
      }
    } else {
      console.log("Student ID is not set, skipping fee check.");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSee(true);
    }, 850);
  }, []);

  useEffect(() => {
    setInterval(() => {
      seeFee();
      // console.log("Checking fee status 30...");
    }, 30000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      seeFee();
      console.log("Checking fee status first...");
    }, 2000);
  }, [_StudentId]);

  useEffect(() => {
    setTimeout(() => {
      var WL = localStorage.getItem("whiteLabel");
      if (WL) {
        document.body.style.backgroundColor =
          JSON.parse(WL).backgroundColor || "#e3e3e3ff";
        setLoading(false);
      }
    }, 1000);
  }, []);

  var appRoutes = [
    {
      title: "Blog",
      path: "/",
      levelcard: true,
      component: (
        <Blog
          change={change}
          headers={headers}
          studentIdd={_StudentId}
          picture={picture}
          setChange={setChange}
        />
      ),
    },
    {
      title: "My Classes",
      component: <MyClasses headers={headers} />,
    },
    {
      title: "Words of The Day",
      component: <WordOfTheDayList headers={headers} />,
    },
    {
      title: "Homework",
      levelcard: true,
      component: (
        <Homework change={change} setChange={setChange} headers={headers} />
      ),
    },
    {
      title: "My Calendar",
      component: (
        <MyCalendar
          myId={_StudentId}
          thePermissions={thePermissions}
          headers={headers}
        />
      ),
    },
    {
      title: "Flash Cards",
      levelcard: true,
      component: (
        <FlashCards change={change} onChange={setChange} headers={headers} />
      ),
    },
    {
      title: "Ranking",
      component: <Ranking headers={headers} />,
    },
    {
      title: "English Courses",
      component: <EnglishCourses headers={headers} />,
    },
    {
      levelcard: true,
      title: "Listening",
      component:
        isArthurVincent || isLocalHost ? (
          <Listening change={change} onChange={setChange} headers={headers} />
        ) : (
          <Redirect to={"/flash-cards"} />
        ),
    },
    {
      levelcard: true,
      title: "Sentence Mining",
      component: (
        <SentenceMining
          onChange={setChange}
          change={change}
          headers={headers}
        />
      ),
    },
    {
      title: "Live Classes",
      component: <GroupClasses headers={headers} />,
    },
    {
      title: "FAQ",
      component: <Faq headers={headers} />,
    },
    {
      title: "My Profile",
      component: <MyProfile headers={headers} />,
    },
    {
      title: "Posts",
      component: (
        <RouteDiv>
          <BlogPosts headers={headers} />
        </RouteDiv>
      ),
    },
    {
      path: "/adm-businessmanagement",
      title: "Adm",
      component:
        verifyToken() && (admin || teacher) ? (
          <Adm headers={headers} />
        ) : (
          <Blog
            change={change}
            headers={headers}
            setChange={setChange}
            studentIdd={_StudentId}
            picture={picture}
          />
        ),
    },
  ];

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: `linear-gradient(135deg, ${partnerColor()} 0%, ${theBackgroundColor()} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated background elements */}
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: `${textPrimaryColorContrast()}20`,
              top: "10%",
              left: "10%",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: `${textPrimaryColorContrast()}15`,
              bottom: "20%",
              right: "15%",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: `${textPrimaryColorContrast()}10`,
              top: "50%",
              right: "10%",
              animation: "float 4s ease-in-out infinite",
            }}
          />

          {/* Main loading content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
              zIndex: 1,
              textAlign: "center",
            }}
          >
            {/* Logo Partner */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "20px",
                background: `${textPrimaryColorContrast()}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: `2px solid ${textPrimaryColorContrast()}30`,
                animation: "pulse 2s ease-in-out infinite",
                overflow: "hidden",
              }}
            >
              <img
                src={logoPartner()}
                alt="Logo"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = `
                <div style="
                  font-family: ${textTitleFont()};
                  font-size: 2.5rem;
                  font-weight: bold;
                  color: ${textPrimaryColorContrast()};
                ">
                  A
                </div>
              `;
                  }
                }}
              />
            </div>

            {/* Loading spinner with custom styling */}
            <div style={{ position: "relative" }}>
              <CircularProgress
                size={60}
                thickness={3}
                style={{
                  color: textPrimaryColorContrast(),
                  filter: `drop-shadow(0 0 10px ${textPrimaryColorContrast()}50)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `${textPrimaryColorContrast()}10`,
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>

            {/* Loading text */}
            <div
              style={{
                color: textPrimaryColorContrast(),
                fontSize: "2rem",
                fontFamily: textTitleFont(),
                animation: "fadeInOut 2s ease-in-out infinite",
              }}
            >
              Loading...
            </div>
            {/* Loading dots */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: `${textPrimaryColorContrast()}80`,
                    animation: `bounce 1.4s ease-in-out infinite both`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Add CSS keyframes to document head */}
          <style>{`
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg); 
        }
        33% { 
          transform: translateY(-20px) rotate(5deg); 
        }
        66% { 
          transform: translateY(-10px) rotate(-5deg); 
        }
      }
      
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 0 20px ${textPrimaryColorContrast()}30;
        }
        50% { 
          transform: scale(1.05); 
          box-shadow: 0 0 30px ${textPrimaryColorContrast()}50;
        }
      }
      
      @keyframes fadeInOut {
        0%, 100% { 
          opacity: 0.6; 
        }
        50% { 
          opacity: 1; 
        }
      }
      
      @keyframes bounce {
        0%, 80%, 100% { 
          transform: scale(0); 
        } 
        40% { 
          transform: scale(1); 
        }
      }
    `}</style>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            justifyContent: "space-between",
          }}
        >
          <TopBar />
          <Routes>
            {appRoutes.map((component, index) => {
              return (
                <Route
                  key={index}
                  path={`${
                    component.path
                      ? component.path
                      : pathGenerator(component.title)
                  }/*`}
                  element={
                    verifyToken() ? (
                      <>
                        <BlogRouteSizeControlBox style={{ gap: "1rem" }}>
                          {component.component}
                          {component.levelcard && (
                            <LevelCard
                              change={change}
                              headers={headers}
                              _StudentId={_StudentId}
                              picture={picture}
                            />
                          )}
                        </BlogRouteSizeControlBox>
                      </>
                    ) : (
                      <Login />
                    )
                  }
                />
              );
            })}
          </Routes>
          <AppFooter see={see} />
          <Outlet />
        </div>
      )}
    </>
  );
}

export default HomePage;
// DURAÇÃO DA AULA nos eventos
// BLOG DO TEACHER
// DURAÇÃO DA AULA
// DURAÇÃO DA AULA
// LINK HOMEWORK QD MARCA SOSZINHO
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2
// 🎁 Seu código promocional: yara14cal2

//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
//   QUANDO CRIAR O TEACHR, TEM QUE CRIAR O WHITELABEL!!
// DATAS DE NASCIMENTO
