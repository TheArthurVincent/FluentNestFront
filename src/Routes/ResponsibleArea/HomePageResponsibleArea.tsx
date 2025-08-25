import { useEffect, useState } from "react";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import { onLoggOut, pathGenerator } from "../../Resources/UniversalComponents";
import AppFooter from "../../Application/Footer/Footer";
import { Outlet, Route, Routes } from "react-router-dom";
import { Login } from "@mui/icons-material";
import {
  BlogRouteSizeControlBox,
  RouteDiv,
} from "../../Resources/Components/RouteBox";
import { TopBar } from "../../Application/TopBar/TopBar";
import {
  logoPartner,
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../Styles/Styles";
import { verifyToken } from "../../App";
import React from "react";
import SeeMyStudents from "./SeeMyStudents";
import TopBarResponsible from "./TopBarResponsible";

export function HomePageResponsibleArea({ headers }: HeadersProps) {
  var [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    if (user) {
      var theUserJson = JSON.parse(user);
    } else {
      onLoggOut();
      return;
    }
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
      component: <SeeMyStudents headers={headers} />,
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
          <div
            style={{
              display: "grid",
            }}
          >
            <TopBarResponsible />
            <Routes>
              {appRoutes.map((component, index) => {
                return (
                  <Route
                    key={index}
                    path={component.path}
                    element={
                      verifyToken() ? (
                        <>
                          <BlogRouteSizeControlBox style={{ gap: "1rem" }}>
                            {component.component}
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
          </div>
          <AppFooter see={true} />
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
                boxShadow: `0 0 20px grey`,
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

export default HomePageResponsibleArea;
