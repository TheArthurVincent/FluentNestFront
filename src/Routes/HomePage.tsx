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

export function HomePage({ headers }: HeadersProps) {
  var [loading, setLoading] = useState<boolean>(true);
  var [thePermissions, setPermissions] = useState<string>("");
  var [admin, setAdmin] = useState<boolean>(false);
  var [teacher, setTeacher] = useState<boolean>(false);
  var [_StudentId, setStudentId] = useState<string>("");
  var [picture, setPicture] = useState<string>("");
  var [change, setChange] = useState<boolean>(true);
  var [see, setSee] = useState(false);
  var [whiteLabel, setWhiteLabel] = useState<any>({});
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
        setLoading(false);
      }
    }, 1500);
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
        <RouteDiv>
          <CircularProgress />
        </RouteDiv>
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
