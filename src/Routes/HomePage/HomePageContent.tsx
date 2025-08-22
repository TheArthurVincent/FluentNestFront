import React, { useEffect, useState } from "react";
import { RouteDiv, HOne } from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";
import {
  backDomain,
  DivFlex,
  DivMarginBorder,
} from "../../Resources/UniversalComponents";
import { partnerColor, textTitleFont } from "../../Styles/Styles";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import ReviewFlashCards from "../FlashCards/FlashCardsComponents/ReviewFlashCards";
import BlogPosts from "./BlogPosts";
import { isArthurVincent } from "../../App";

interface BlogProps {
  headers: MyHeadersType | null;
  change: boolean;
  setChange: any;
}

export function Blog({ headers, change, setChange }: BlogProps) {
  const { UniversalTexts } = useUserContext();
  const [name, setName] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [myId, setMyId] = useState<string>("");
  const [user, setUser] = useState<any>({});
  var [course, setCourse] = useState<String>("");
  var [lesson, setLesson] = useState<String>("");
  var [img, setImg] = useState("");
  var [NO, setNo] = useState(true);
  var [loadingLESSON, setLoadingLESSON] = useState<Boolean>(true);

  const fetchLastClassId = async (classid: string) => {
    setLoadingLESSON(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lesson/${classid}`,
        {
          headers: actualHeaders,
        }
      );

      var cour = response.data.course.title;
      var less = response.data.classDetails.title;
      var imgg = response.data.classDetails.image
        ? response.data.classDetails.image
        : "https://ik.imagekit.io/vjz75qw96/assets/icons/mustshould.png?updatedAt=1748264443512";
      setCourse(cour);
      setLesson(less);
      setImg(imgg);
      setLoadingLESSON(false);
    } catch (error) {
      setNo(false);
      console.log(error, "Erro ao encontrar aula");
    }
  };

  useEffect(() => {
    const theuser = JSON.parse(localStorage.getItem("loggedIn") || "");
    if (user) {
      setUser(theuser);
    } else {
    }
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "");
    setClassId(getLoggedUser.lastClassId);
    setName(getLoggedUser.name);
    setMyId(getLoggedUser.id);
    setTimeout(() => {
      fetchLastClassId(getLoggedUser.lastClassId);
    }, 2000);
  }, []);

  const actualHeaders = headers || {};
  const sessions = [
    {
      id: "flash-cards",
      title: "Flashcards",
      description: UniversalTexts.revise,
      display: "flex",
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/flashcards.png?updatedAt=1742402052092",
      link: "/flash-cards",
    },
    {
      id: "current-lesson",
      title: NO
        ? `${UniversalTexts.currentLesson}  - ${lesson}`
        : "Begin your journey!",
      description: UniversalTexts.retome,
      display: loadingLESSON ? "flex" : "none",
      img: img,
      link: NO
        ? `/english-courses/${course
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")}/${classId}`
        : "/english-courses/english-grammar/667ac39b4b4d6245dc8f385b",
    },
    {
      id: "listening",
      title: UniversalTexts.listening,
      description: UniversalTexts.pratique,
      display: "flex",
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/list.png?updatedAt=1742402052061",
      link: "/listening",
    },
    {
      id: "sentence-mining",
      title: UniversalTexts.vocabulary,
      description: UniversalTexts.enriqueça,
      display: "flex",
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/mining.png?updatedAt=1742402051850",
      link: "/sentence-mining",
    },
  ];

  return (
    <RouteDiv>
      <Helmets text="Home Page" />
      <div
        style={{
          margin: "1rem 0.5rem 0 0",
          display: "flex",
          maxWidth: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "1rem",
            maxWidth: "100%",
            gap: "1rem",
          }}
        >
          <i className="fa fa-user" aria-hidden="true" />
          <p>
            {UniversalTexts.hello}
            {name}!
          </p>
        </div>
        <div style={{ display: "flex", gap: "5px" }}></div>
      </div>
      <DivFlex>
        {/* <div className="grid-flex-2">
          <DivMarginBorder>
            <ReviewFlashCards
              selectedStudentId={myId}
              change={change}
              onChange={setChange}
              headers={headers}
            />
          </DivMarginBorder>
        </div> */}
        <div className="grid-flex-2">
          <DivMarginBorder>
            {/* {loadingLESSON ? (
              <CircularProgress style={{ color: partnerColor() }} />
            ) : ( */}
              <div className="study-container">
                <HOne>{UniversalTexts.studyEnglish}</HOne>
                <div 
                className="grid-container"
                >
                  {sessions.map((session) => (
                    <a
                      key={session.id}
                      href={session.link}
                      className="grid-item"
                      style={{
                        display: session.display,
                      }}
                    >
                      <span className="session-title">{session.title}</span>
                      <div
                        className="image-background"
                        style={{ backgroundImage: `url(${session.img})` }}
                      />

                      {/* <div className="overlay">
                        <p className="session-description">
                          {session.description}
                        </p>
                      </div> */}
                    </a>
                  ))}
                </div>
              </div>
        {/*       )}*/}
          </DivMarginBorder>
        </div>
        <div className="grid-flex-2">
          <DivMarginBorder
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* @ts-ignore */}
            <BlogPosts headers={actualHeaders} />
          </DivMarginBorder>
        </div>
      </DivFlex>
    </RouteDiv>
  );
}

export default Blog;
