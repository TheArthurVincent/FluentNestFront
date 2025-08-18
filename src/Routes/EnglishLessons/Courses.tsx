import React, { useEffect, useState } from "react";
import { HOne } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  backDomain,
  onLoggOut,
  pathGenerator,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Modules from "./Modules";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";

interface EnglishCoursesHomeProps {
  headers: MyHeadersType | null;
}

export default function EnglishCourses({ headers }: EnglishCoursesHomeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [stId, setStId] = useState<boolean>(false);
  const [listOfCoursesFromDatabase, setListOfCoursesFromDatabase] =
    useState<any>([]);

  const actualHeaders = headers || {};

  const getCourses = async () => {
    setLoading(true);

    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const studentId = getLoggedUser.id;
    setStId(studentId);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/courses/${studentId}`,
        { headers: actualHeaders }
      );
      var classesDB = response.data.courses;
      setListOfCoursesFromDatabase(classesDB);
      setLoading(false);
    } catch (error) {
      console.log("Erro ao obter aulas");
      onLoggOut();
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const loc = useLocation();
  const [displayRouteDiv, setDisplayRouteDiv] = useState<boolean>(true);

  useEffect(() => {
    const isRootPath =
      loc.pathname === "/english-courses" ||
      loc.pathname === "/english-courses/";
    setDisplayRouteDiv(isRootPath);
  }, [loc.pathname]);

  const { UniversalTexts } = useUserContext();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Routes>
        {listOfCoursesFromDatabase.map((route: any, idx: number) => (
          <Route
            key={idx}
            path={`${pathGenerator(route.title)}/*`}
            element={
              <Modules
                courseId={route._id}
                title={route.title}
                headers={headers}
                studentId={stId}
              />
            }
          />
        ))}
      </Routes>
      <Helmets text="Courses" />
      {displayRouteDiv ? (
        !loading ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.59)",
              width: "90vw",
            }}
          >
            <HOne>{UniversalTexts.theCourses}</HOne>
            <button onClick={getCourses}>
              <span
                style={{
                  marginBottom: "12px",
                }}
              >
                <i className="fa fa-refresh" aria-hidden={true} />
              </span>
            </button>
            <div>
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                  padding: "0",
                  listStyle: "none",
                }}
              >
                {listOfCoursesFromDatabase
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((route: any, idx: number) => (
                    <li
                      key={idx}
                      style={{
                        listStyle: "none",
                        borderRadius: "6px",
                        overflow: "hidden",
                        transition: "transform 0.3s",
                      }}
                      className="card"
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                        }}
                        to={`${pathGenerator(route.title)}/`}
                      >
                        <div
                          style={{
                            height: "300px",
                            backgroundColor: "#333",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          className="card-content"
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              transition: "transform 0.3s, opacity 0.3s",
                            }}
                            src={route.image}
                            alt={`${route.title}img`}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              width: "100%",
                              background: "rgba(0, 0, 0, 0.7)",
                              color: "#fff",
                              padding: "10px",
                              textAlign: "center",
                            }}
                          >
                            <p>{route.title}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <CircularProgress style={{ color: partnerColor() }} />
        )
      ) : null}
      <Outlet />
    </div>
  );
}
