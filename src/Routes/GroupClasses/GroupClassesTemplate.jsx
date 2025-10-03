import React, { useEffect, useState } from "react";
import {
  IFrameVideo,
  backDomain,
  getVideoEmbedUrl,
  onLoggOut,
} from "../../Resources/UniversalComponents";
import {
  alwaysBlack,
  alwaysWhite,
  darkGreyColor,
  lightGreyColor,
  partnerColor,
  textTitleFont,
} from "../../Styles/Styles";
import CoursesSideBar from "../../Application/CoursesSideBar/CoursesSideBar";
import styled from "styled-components";
import TopBar from "../../Application/TopBar/TopBar";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  HOne,
  HTwo,
  RouteDiv,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";

export default function GroupClassesTemplate({
  _id,
  title,
  courseColor,
  courses,
}) {
  const [courseModules, setCourseModules] = useState([]);
  const [chosenModule, setChosenModule] = useState(0);
  const [chosenClass, setChosenClass] = useState(0);
  const [chosenTitle, setChosenTitle] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/moduleforcourse/${_id}`
        );
        setCourseModules(response.data.modules);
      } catch (error) {
        onLoggOut();
      }
    }
    fetchData();
  }, []);

  const choseClass = (selectedModule, selectedClass, selectedTitle) => {
    setChosenModule(selectedModule);
    setChosenClass(selectedClass);
    setChosenTitle(selectedTitle);
  };
  const LiItem = styled.li`
    color: ${alwaysBlack()};
    background-color: ${alwaysWhite()};
    list-style: none;
    padding: 0.2rem 0.8rem;
    cursor: pointer;
    &:hover {
      color: ${alwaysWhite()} !important;
      background-color: ${courseColor};
    }
  `;

  const DivCourse = styled.div`
    background-color: ${alwaysWhite()};
    color: ${lightGreyColor()};
    text-transform: capitalize;

    &::-webkit-scrollbar {
      width: 8px;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${courseColor};
    }
    &::-webkit-scrollbar-track {
      background-color: ${alwaysWhite()};
    }
  `;

  const SideBarCourse = styled.div`
    height: 100vh;
    overflow: auto;
    background-color: ${lightGreyColor()};
    color: ${darkGreyColor()};
    text-transform: capitalize;
    border-left: 1px solid lightGreyColor();
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${courseColor};
    }
    &::-webkit-scrollbar-track {
      background-color: ${alwaysWhite()};
    }
    @media (max-width: 800px) {
      border-top: 1px solid ${courseColor};
    }
  `;
  const FullDisplay = styled.div`
    display: flex;
    grid-template-columns: 1fr 20rem;
    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  `;

  return (
    <div>
      {/* <CoursesSideBar courses={courses} /> */}
      <TopBar />
      <RouteSizeControlBox>
        <RouteDiv>
          <div>
            <HOne>{title}</HOne>
            <HTwo>{chosenTitle}</HTwo>
          </div>
          <FullDisplay>
            <DivCourse>
              {courseModules[chosenModule] &&
                courseModules[chosenModule].classes &&
                courseModules[chosenModule].classes[chosenClass] &&
                courseModules[chosenModule].classes[chosenClass].srcVideos.map(
                  (videoItem, videoIndex) => {
                    return (
                      <div
                        key={videoIndex}
                        style={{
                          padding: "1rem",
                          display: "grid",
                          gap: "1rem",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        {videoItem.title && (
                          <p style={{ color: "#000" }}>{videoItem.title}</p>
                        )}{" "}
                        {videoItem.url && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "1rem",
                            }}
                          >
                            <IFrameVideo
                              style={{
                                border: "solid 1px black",
                              }}
                              src={getVideoEmbedUrl(videoItem.url)}
                            />
                          </div>
                        )}
                        {videoItem.description && (
                          <p
                            style={{
                              color: alwaysBlack(),
                              maxWidth: "120ch",
                              padding: "1rem",
                            }}
                          >
                            {videoItem.description}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              {courseModules[chosenModule] &&
                courseModules[chosenModule].classes &&
                courseModules[chosenModule].classes[chosenClass] &&
                courseModules[chosenModule].classes[
                  chosenClass
                ].srcAttachments.map((att, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        maxWidth: "30rem",
                        margin: "5px auto",
                        backgroundColor: alwaysBlack(),
                      }}
                    >
                      {att.title && att.description && (
                        <span style={{ maxWidth: "120ch" }}>
                          {att.description}
                        </span>
                      )}
                      |
                      {att.url && (
                        <Link
                          to={att.url}
                          style={{
                            textDecoration: "underline",
                            color: "white",
                          }}
                        >
                          {att.title}
                        </Link>
                      )}
                    </div>
                  );
                })}
            </DivCourse>
            <SideBarCourse>
              {courseModules.map((item, index) => {
                return item ? (
                  <div key={index}>
                    <ul>
                      <li
                        style={{
                          listStyle: "none",
                        }}
                      >
                        <HTwo
                          style={{
                            padding: "0.3rem 1rem",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.moduleTitle}
                        </HTwo>
                        <div>
                          {item.classes && (
                            <ul>
                              {item.classes.map((classItem, classIndex) => (
                                <LiItem
                                  style={{
                                    fontSize: "1rem",
                                    paddingLeft: "8px",
                                    borderRadius:
                                      classItem.classTitle === chosenTitle
                                        ? "0.2rem"
                                        : "none",
                                    borderLeft:
                                      classItem.classTitle === chosenTitle
                                        ? `4px solid ${courseColor}`
                                        : "none",
                                    color:
                                      classItem.classTitle === chosenTitle
                                        ? courseColor
                                        : "none",
                                    fontWeight:
                                      classItem.classTitle === chosenTitle
                                        ? 800
                                        : "none",
                                    cursor:
                                      classItem.classTitle === chosenTitle
                                        ? "auto"
                                        : "pointer",
                                  }}
                                  key={classIndex}
                                  onClick={() => {
                                    choseClass(
                                      index,
                                      classIndex,
                                      classItem.classTitle
                                    );
                                  }}
                                >
                                  {classItem.classTitle}
                                </LiItem>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : null;
              })}
            </SideBarCourse>
          </FullDisplay>
        </RouteDiv>
      </RouteSizeControlBox>
    </div>
  );
}
