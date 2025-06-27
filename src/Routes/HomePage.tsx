import React, { useEffect, useState } from "react";
import Ranking from "./Ranking/Ranking";
import GroupClasses from "./GroupClasses/GroupClasses";
import { Login } from "@mui/icons-material";
import { verifyToken } from "../App";
import { Outlet, Route, Routes } from "react-router-dom";
import {
  onLoggOut,
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
import { BlogRouteSizeControlBox } from "../Resources/Components/RouteBox";
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

export function HomePage({ headers }: HeadersProps) {
  const [thePermissions, setPermissions] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const [_StudentId, setStudentId] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [change, setChange] = useState<boolean>(true);
  const [see, setSee] = useState(false);

  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    if (user) {
      var { permissions, picture, id } = JSON.parse(user);
      setPermissions(permissions);
      setStudentId(id || _StudentId);
      setPicture(picture);
      setAdmin(permissions === "superadmin" ? true : false);
    } else {
      onLoggOut();
      return;
    }

    updateInfo(id, headers);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSee(true);
    }, 850);
  }, []);

  const appRoutes = [
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
        <MyCalendar thePermissions={thePermissions} headers={headers} />
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
      component: (
        <Listening change={change} onChange={setChange} headers={headers} />
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
      component: <BlogPosts headers={headers} />,
    },
    {
      path: "/adm-businessmanagement",
      title: "Adm",
      component:
        verifyToken() && admin ? (
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
                component.path ? component.path : pathGenerator(component.title)
              }/*`}
              element={
                verifyToken() ? (
                  <>
                    <BlogRouteSizeControlBox
                      style={{ gap: "1rem" }}
                      className="smooth"
                    >
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
  );
}

export default HomePage;
