import axios from "axios";
import React, { useEffect, useState } from "react";
import Ranking from "./Ranking/Ranking";
import GroupClasses from "./GroupClasses/GroupClasses";
import { isArthurVincent, verifyToken } from "../App";
import { Outlet, Route, Routes } from "react-router-dom";
import {
  backDomain,
  onLoggOut,
  onLoggOutFee,
  onLoggOutLimitDate,
  onLoggOutToken,
  pathGenerator,
  updateInfo,
} from "../Resources/UniversalComponents";
import MyProfile from "./MyProfile/MyProfile";
import Faq from "./Faq/Faq";
import MyClasses from "./MyClasses/MyClasses";
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
// import WordOfTheDayList from "./WordOfTheDay/WordOfTheDayList";
import Login from "./Login/Login";
import MyCalendar from "./MyCalendar/MyCalendar";
import {
  partnerColor,
  textPrimaryColorContrast,
  logoPartner,
  textTitleFont,
} from "../Styles/Styles";
import Redirect from "../Redirect";
import Tokens from "./Tokens";
import MyCalendarNew from "./MyCalendar/MyCalendarNew";

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
    // Verificar se o token JWT é válido antes de prosseguir
    if (!verifyToken()) {
      console.log("Token inválido no HomePage, redirecionando para login");
      onLoggOutToken();
      return;
    }

    var user = localStorage.getItem("loggedIn");
    if (user) {
      var { permissions, picture, id } = JSON.parse(user);
      setPermissions(permissions);
      setStudentId(id || _StudentId);
      setPicture(picture);
      setAdmin(permissions === "superadmin" ? true : false);
      setTeacher(permissions === "teacher" ? true : false);
      updateInfo(id, headers);
    } else {
      onLoggOut();
      return;
    }
  }, []);

  var seeFee = async () => {
    try {
      // Verificar se o token JWT ainda é válido antes de fazer qualquer chamada
      if (!verifyToken()) {
        console.log("Token JWT expirado ou inválido em seeFee");
        onLoggOutToken();
        return;
      }

      var userHere = localStorage.getItem("loggedIn");
      if (!userHere) {
        console.log("Usuário não encontrado no localStorage");
        onLoggOut();
        return;
      }

      //@ts-ignore
      var { id } = JSON.parse(userHere);
      if (!id) {
        console.log("ID do usuário não encontrado");
        onLoggOut();
        return;
      }

      // Fazer as chamadas da API com headers de autorização
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem("authorization")}`,
      };

      var response = await axios.get(
        `${backDomain}/api/v1/studentfeeuptodate/${id}`,
        { headers: authHeaders }
      );

      const response2 = await axios.get(
        `${backDomain}/api/v1/uploadneeded/${id}`,
        { headers: authHeaders }
      );

      const response3 = await axios.get(
        `${backDomain}/api/v1/logmeoutornot/${id}`,
        { headers: authHeaders }
      );

      const response4 = await axios.get(
        `${backDomain}/api/v1/limitdate/${id}`,
        { headers: authHeaders }
      );

      if (response.data.feeUpToDate === false) {
        onLoggOutFee();
      }
      if (response2.data.uploadNeeded) {
        window.location.reload();
      }
      if (response3.data.logoutNeeded == true) {
        console.log(response3.data.logoutNeeded, "ExpiredToken");
        onLoggOutToken();
      }
      if (response4.data.logoutLimitDate == true) {
        console.log(response4.data.logoutLimitDate, "Assinatura Expirada");
        onLoggOutLimitDate();
      }
    } catch (error: any) {
      console.error("Error checking fee status:", error);
      // Erros de autenticação já são tratados pelo interceptor, mas mantendo como fallback
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log(
          "Erro de autorização em seeFee, token possivelmente inválido"
        );
        onLoggOutToken();
      }
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
    }, 100000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      seeFee();
    }, 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      var WL = localStorage.getItem("whiteLabel");
      if (WL) {
        document.body.style.backgroundColor =
          JSON.parse(WL).backgroundColor || "#e3e3e3ff";
        setLoading(false);
      }
    }, 2000);
  }, []);

  var appRoutes = [
    {
      title: "Blog",
      path: "/",
      levelcard: true,
      component: (
        <Blog change={change} headers={headers} setChange={setChange} />
      ),
    },
    {
      path: "/dispose",
      title: "My Classes",
      component: <MyClasses headers={headers} />,
    },
    // {
    //   title: "Words of The Day",
    //   component: <WordOfTheDayList />,
    // },
    {
      title: "Homework",
      levelcard: false,
      component: (
        <Homework change={change} setChange={setChange} headers={headers} />
      ),
    },
    {
      path: "my-homework-and-lessons",
      title: "Homework",
      levelcard: false,
      component: (
        <Homework change={change} setChange={setChange} headers={headers} />
      ),
    },
    {
      title: "Homework",
      levelcard: false,
      path: "/my-classes",
      component: (
        <Homework change={change} setChange={setChange} headers={headers} />
      ),
    },
    {
      title: "My Calendar",
      component: (
        <MyCalendar
          change={change}
          setChange={setChange}
          myId={_StudentId}
          thePermissions={thePermissions}
          headers={headers}
        />
      ),
    },
    {
      title: "My Calendar Ref",
      component: (
        <MyCalendarNew
          change={change}
          setChange={setChange}
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
      title: "Teaching Materials",
      component: <EnglishCourses headers={headers} />,
    },
    {
      levelcard: true,
      title: "Listening",
      component: isArthurVincent ? (
        <Listening change={change} onChange={setChange} headers={headers} />
      ) : (
        <Redirect to="/" />
      ),
    },
    {
      levelcard: true,
      title: "Sentence Mining",
      component:
        thePermissions === "teacher" ||
        thePermissions === "superadmin" ||
        isArthurVincent ? (
          <SentenceMining
            myPermissions={thePermissions}
            onChange={setChange}
            change={change}
            headers={headers}
          />
        ) : (
          <Redirect to="/" />
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
          <Blog change={change} headers={headers} setChange={setChange} />
        ),
    },
  ];

  return (
    <>
      {!loading ? (
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
          {(thePermissions == "superadmin" || thePermissions == "teacher") && (
            <Tokens id={_StudentId} headers={headers} change={change} />
          )}
          <AppFooter see={see} />
          <Outlet />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: `linear-gradient(135deg, ${partnerColor()} 0%, black 100%)`,
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
                padding: "40px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`,
                border: `2px solid ${textPrimaryColorContrast()}30`,
                animation: "pulse 2s ease-in-out infinite",
                overflow: "hidden",
              }}
            >
              <img
                src={logoPartner()}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "scale-down",
                  filter: `drop-shadow(0 0 10px ${textPrimaryColorContrast()}50)`,
                }}
                onError={(e) => {
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
      )}
    </>
  );
}

export default HomePage;
