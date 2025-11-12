import axios from "axios";
import React, { useEffect, useState } from "react";
import Ranking from "./Ranking/Ranking";
import GroupClasses from "./GroupClasses/GroupClasses";
import { isArthurVincent, verifyToken } from "../App";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
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
import { RouteDiv } from "../Resources/Components/RouteBox";
import { HeadersProps } from "../Resources/types.universalInterfaces";
import FlashCards from "./FlashCards/FlashCards";
import Homework from "./Homework/Homework";
import EnglishCourses from "./EnglishLessons/Courses";
import Listening from "./ListeningExercise/Listening";
import SentenceMining from "./SentenceMining/SentenceMining";
import BlogPosts from "./HomePage/BlogPosts";
import Login from "./Login/Login";
import MyCalendar from "./MyCalendar/MyCalendar";
import {
  textPrimaryColorContrast,
  logoPartner,
  partnerColor,
} from "../Styles/Styles";
import Redirect from "../Redirect";
import Tokens from "./Tokens";
import MyCalendarNew from "./MyCalendar/MyCalendarNew";
import { ArvinTopBar } from "./ArvinComponents/ArvinTopSideBar/NewTopSideBar";
import {
  ItemRow,
  menuItems,
} from "./ArvinComponents/ArvinTopSideBar/SideDownBar/menuItems";
import { DotsThreeCircleIcon } from "@phosphor-icons/react";
import MyHomePage from "./ArvinComponents/NewHomePageArvin/NewHomePageArvin";

export const useIsDesktop = (breakpoint = 700) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
};

export function ArvinNewHomePage({ headers }: HeadersProps) {
  var [loading, setLoading] = useState<boolean>(true);
  var [thePermissions, setPermissions] = useState<string>("");
  var [admin, setAdmin] = useState<boolean>(false);
  var [teacher, setTeacher] = useState<boolean>(false);
  var [_StudentId, setStudentId] = useState<string>("");
  var [picture, setPicture] = useState<string>("");
  var [change, setChange] = useState<boolean>(true);
  var [see, setSee] = useState(false);
  var [seeMenuDown, setSeeMenuDown] = useState(false);
  var [appLoaded, setAppLoaded] = useState<boolean>(false);

  const location = useLocation();
  const currentPath = location.pathname;
  const bgActive = `${partnerColor()}09`;
  const baseTextColor = "#030303";
  useEffect(() => {
    setAppLoaded(!appLoaded);

    if (!verifyToken()) {
      console.log(
        "Token inválido no ArvinNewHomePage, redirecionando para login"
      );
      onLoggOutToken();
      return;
    }

    var user = localStorage.getItem("loggedIn");
    if (user) {
      var { permissions, picture, id } = JSON.parse(user);
      setPermissions(permissions);
      setStudentId(id || _StudentId);
      setPicture(picture);
      setAdmin(permissions == "superadmin" ? true : false);
      setTeacher(permissions == "teacher" ? true : false);

      updateInfo(id, headers);
    } else {
      onLoggOut();
      return;
    }
  }, []);

  var seeFee = async () => {
    try {
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
    document.body.style.backgroundColor = `${partnerColor()}05`;
    setTimeout(() => {
      setLoading(false);
    }, 150);
  }, []);

  const isDesktop = useIsDesktop(500);

  var appRoutes = [
    {
      title: "Blog",
      path: "/",
      levelcard: true,
      component: (
        <MyHomePage change={change} headers={headers} setChange={setChange} />
      ),
    },
    {
      path: "/dispose",
      title: "My Classes",
      component: <MyClasses headers={headers} />,
    },
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
        <FlashCards
          setChangeTokens={setChange}
          changeTokens={change}
          change={change}
          onChange={setChange}
          headers={headers}
        />
      ),
    },
    {
      title: "Ranking",
      component: <Ranking headers={headers} />,
    },
    {
      title: "English Courses",
      component: (
        <EnglishCourses
          setChange={setChange}
          isDesktop={isDesktop}
          change={change}
          headers={headers}
        />
      ),
    },
    {
      title: "Teaching Materials",
      topbar: false,
      component: (
        <EnglishCourses
          isDesktop={isDesktop}
          setChange={setChange}
          change={change}
          headers={headers}
        />
      ),
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
          <MyHomePage change={change} headers={headers} setChange={setChange} />
        ),
    },
  ];

  return !loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        height: "100vh",
        width: "100%",
      }}
    >
      {window.location.href.includes("teaching") ? null : (
        <ArvinTopBar admin={admin || teacher} appLoaded={appLoaded} />
      )}
      <Routes>
        {appRoutes.map((component, index) => {
          return (
            <Route
              key={index}
              path={`${
                component.path ? component.path : pathGenerator(component.title)
              }/*`}
              element={
                verifyToken() ? (
                  <div
                    style={{
                      width: "100%",
                      transform: isDesktop
                        ? "translateY(0)"
                        : "translateY(-70px)",
                    }}
                  >
                    {component.component}
                  </div>
                ) : (
                  <Login />
                )
              }
            />
          );
        })}
      </Routes>
      {/* {(thePermissions == "superadmin" || thePermissions == "teacher") && (
            <Tokens id={_StudentId} headers={headers} change={change} />
          )} */}
      <footer
        style={{
          display: isDesktop ? "none" : "flex",
          position: "fixed",
          bottom: 0,
          zIndex: 100,
          left: 0,
          boxShadow: "0 -2px 60px rgba(0, 0, 0, 0.1)",
          width: "100%",
          height: 70,
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          justifyContent: "space-around",
          alignItems: "center",
        }}
        className="footer-arvin-mobile"
      >
        {menuItems
          .sort((a, b) => (a.orderMobile || 0) - (b.orderMobile || 0))
          .map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                textDecoration: "none",
                color: "#111827",
                display: item.isMobile ? "flex" : "none",
                flexDirection: "column",
                alignItems: "center",
                borderTop: `4px solid ${
                  window.location.href.includes(item.path)
                    ? partnerColor()
                    : "transparent"
                }`,
                borderRadius: "8px",
                padding: "8px ",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              <span style={{ fontSize: 22, marginBottom: 4 }}>
                <item.Icon
                  color={
                    window.location.href.includes(item.path)
                      ? partnerColor()
                      : "#111827"
                  }
                  weight="bold"
                  size={20}
                />
              </span>
              <b>{item.label}</b>
            </Link>
          ))}
        <div
          style={{
            borderTop: `4px solid transparent`,
            borderRadius: "8px",
            padding: "8px ",
            textDecoration: "none",
            color: "#111827",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          <span
            onClick={() => {
              setSeeMenuDown(!seeMenuDown);
            }}
            style={{ fontSize: 22, marginBottom: 4 }}
          >
            <DotsThreeCircleIcon color={"#111827"} weight="bold" size={20} />
          </span>
          <b>Menu</b>
        </div>
      </footer>

      {!isDesktop && (
        <>
          <div
            style={{
              backgroundColor: "#00000080",
              width: 100000,
              height: 100000,
              position: "fixed",
              zIndex: 98,
              display: seeMenuDown ? "block" : "none",
            }}
            onClick={() => setSeeMenuDown(false)}
          />
          <ul
            style={{
              display: seeMenuDown ? "flex" : "none",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              padding: "16px",
              position: "fixed",
              bottom: 70,
              zIndex: 99,
              height: "50vh",
              width: "100%",
              left: 0,
              right: 0,
              borderRadius: "16px 16px 0 0",
              borderTop: "1px solid #e5e7eb",
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            {menuItems
              .filter((item) => {
                if (item.showInBottomBar) {
                  return true;
                }
              })
              .map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "grid",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                >
                  <ItemRow
                    key={`side-${item.path}-${idx}`}
                    item={item}
                    admin={admin || teacher}
                    currentPath={currentPath}
                    bgActive={bgActive}
                    baseTextColor={baseTextColor}
                    partnerColor={partnerColor}
                  />
                </span>
              ))}
          </ul>
        </>
      )}

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
        background: `white`,
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
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.innerHTML = `
                <div style="
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
  );
}

export default ArvinNewHomePage;
