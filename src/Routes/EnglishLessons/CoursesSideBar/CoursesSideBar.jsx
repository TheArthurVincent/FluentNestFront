import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { pathGenerator } from "../../../Resources/UniversalComponents";
import {
  CoursesList,
  CoursesListContainer,
  CoursesListInnerContainer,
  CoursesListInnerInnerContainer,
  CoursesListItem,
} from "./CoursesSideBarStyled";
import {
  alwaysWhite,
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../Styles/Styles";
import { HOne, HTwo } from "../../../Resources/Components/RouteBox";

export const truncateTitle = (title, maxChars) => {
  if (title.length > maxChars) {
    return title.substring(0, maxChars).trim() + " ...";
  }
  return title;
};

function CoursesSideBar({ courses }) {
  const [showCourses, setShowCourses] = useState(false);
  const [arrow, setArrow] = useState(false);
  const handleShowCourses = () => {
    setShowCourses(!showCourses);
    setArrow(!arrow);
  };
  const handleHideCourses = () => {
    setShowCourses(false);
    setArrow(false);
  };
  const location = useLocation();
  const go = (e) => {
    window.location.assign(pathGenerator(e));
  };

  const [transit, setTransit] = useState("none");

  useEffect(() => {
    setTimeout(() => {
      setTransit("block");
    }, 500);
  });

  return (
    <span style={{ display: transit }}>
      <CoursesListContainer
        style={showCourses ? { left: "0rem" } : { left: "-18.4rem" }}
      >
        <CoursesListInnerContainer>
          <CoursesListInnerInnerContainer>
            <div onClick={handleShowCourses}>
              <div
                style={{
                  alignItems: "center",
                  backgroundColor: partnerColor(),
                  border: `ridge 4px ${partnerColor()}`,
                  borderRadius: "50px",
                  color: alwaysWhite(),
                  cursor: "pointer",
                  display: "flex",
                  gap: "9rem",
                  justifyContent: "space-between",
                  left: showCourses ? -150 : "-17.8rem",
                  maxHeight: "1rem",
                  padding: "0.6rem",
                  position: "fixed",
                  transition: "left 0.3s ease-out",
                  top: 400,
                  width: "18rem",
                  zIndex: -1,
                }}
              >
                <HOne>Modules</HOne>
                <HOne>
                  <i
                    className={`fa fa-arrow-${arrow ? "left" : "right"}`}
                    style={{ fontSize: "16px" }}
                    aria-hidden="true"
                  />
                </HOne>
              </div>
              {courses.map((course, index) => (
                <div style={{ padding: "1rem 0" }} key={index}>
                  <HTwo style={{ padding: "0 1rem " }}> {course.type} </HTwo>
                  <CoursesList>
                    {course.lessons[0].lessons.map((lesson, idx) => {
                      return (
                        <div
                          key={idx}
                          style={{ textDecoration: "none" }}
                          onClick={() => go(lesson.title)}
                        >
                          <CoursesListItem
                            className="hover-color"
                            style={{
                              borderRadius: "4px",
                              color: "#000",
                              backgroundColor: location.pathname.includes(
                                pathGenerator(lesson.title)
                              )
                                ? partnerColor()
                                : textPrimaryColorContrast(),
                            }}
                            onClick={handleHideCourses}
                          >
                            <span>
                              {idx + "- " + truncateTitle(lesson.title, 30)}
                            </span>
                          </CoursesListItem>
                        </div>
                      );
                    })}
                  </CoursesList>
                </div>
              ))}
            </div>
          </CoursesListInnerInnerContainer>
        </CoursesListInnerContainer>
        <div
          onClick={handleHideCourses}
          style={{
            display: showCourses ? "block" : "none",
            width: "1000vw",
            height: "1000vw",
          }}
        />
      </CoursesListContainer>
    </span>
  );
}
export default CoursesSideBar;
