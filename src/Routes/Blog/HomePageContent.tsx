import React, { useEffect, useState } from "react";
import {
  RouteDiv,
  BackgroundClickBlog,
  HTwo,
  HOne,
} from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";
import {
  backDomain,
  Xp,
  UniversalButtonsDivFlex,
  DivFlex,
  DivMarginBorder,
} from "../../Resources/UniversalComponents";
import { alwaysWhite, secondaryColor } from "../../Styles/Styles";
import { Button, CircularProgress } from "@mui/material";
import { DivModal, InternDivModal } from "./Blog.Styled";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import WordOfTheDay from "../WordOfTheDay/WordOfTheDay";
import Countdown from "../Ranking/RankingComponents/Countdown";
import { notifyError } from "../EnglishLessons/Assets/Functions/FunctionLessons";

interface BlogProps {
  headers: MyHeadersType | null;
  studentIdd: string;
  picture: string;
  change: boolean;
  setChange: any;
}

export function Blog({
  headers,
  studentIdd,
  picture,
  change,
  setChange,
}: BlogProps) {
  const { UniversalTexts } = useUserContext();
  // Strings
  const [newTitle, setNewTitle] = useState<string>("");
  const [_id, setID] = useState<string>("");
  const [_StudentId, setStudentId] = useState<string>("");
  const [newText, setNewText] = useState<string>("");
  const [newImg, setNewImg] = useState<string>("");
  const [newUrlVideo, setNewUrlVideo] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [permissions, setPermissions] = useState<string>("");
  // Booleans
  const [seeConfirmDelete, setSeeConfirmDelete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextTutoring, setNextTutoring] = useState<any>();

  // Loading
  const [posts, setPosts] = useState<any>([
    {
      title: <CircularProgress style={{ color: secondaryColor() }} />,
    },
  ]);

  const [user, setUser] = useState<any>({});

  const fetchClasses = async (studentId: string) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homeworknext/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      const tt = response.data.tutoringHomeworkList;
      setNextTutoring(tt);
      setLoading(false);
    } catch (error) {
      console.log(error, "erro ao listar itens");
    }
  };

  var [course, setCourse] = useState<String>("");
  var [module, setModule] = useState<String>("");
  var [lesson, setLesson] = useState<String>("");
  var [img, setImg] = useState("");
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
      var mod = response.data.module.title;
      var less = response.data.classDetails.title;
      var imgg = response.data.classDetails.image;
      setCourse(cour);
      setModule(mod);
      setLesson(less);
      setImg(imgg);
      setLoadingLESSON(false);
    } catch (error) {
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
    fetchData();
    setClassId(getLoggedUser.lastClassId);
    setName(getLoggedUser.name);
    setStudentId(getLoggedUser.id || _StudentId);
    setPermissions(getLoggedUser.permissions);
    fetchClasses(getLoggedUser.id);
    setTimeout(() => {
      fetchLastClassId(getLoggedUser.lastClassId);
    }, 2000);
  }, []);

  const handleSeeModal = () => {
    setIsVisible(!isVisible);
    setSeeConfirmDelete(false);
  };
  const handleConfirmDelete = () => {
    setSeeConfirmDelete(!seeConfirmDelete);
  };

  const actualHeaders = headers || {};
  const sessions = [
    {
      id: "current-lesson",
      title: `${UniversalTexts.currentLesson}  - ${lesson}`,
      description: UniversalTexts.retome,
      img: img,
      link: `/english-courses/${course
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")}/${classId}`,
    },

    {
      id: "calendar",
      title: UniversalTexts.nextGroupClasses,
      description: UniversalTexts.nextGroupClasses,
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/actions.jpg?updatedAt=1720616041429",
      link: "/my-calendar",
    },
    {
      id: "flash-cards",
      title: "Flashcards",
      description: UniversalTexts.revise,
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/flashcards.png?updatedAt=1742402052092",
      link: "/flash-cards",
    },
    {
      id: "listening",
      title: UniversalTexts.listening,
      description: UniversalTexts.pratique,
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/list.png?updatedAt=1742402052061",
      link: "/listening",
    },
    {
      id: "sentence-mining",
      title: UniversalTexts.vocabulary,
      description: UniversalTexts.enriqueça,
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/mining.png?updatedAt=1742402051850",
      link: "/sentence-mining",
    },
    {
      id: "my-lessons",
      title: UniversalTexts.myClasses,
      description: UniversalTexts.myClasses,
      img: "https://ik.imagekit.io/vjz75qw96/assets/icons/future.jpg?updatedAt=1720527411882",
      link: "/my-classes",
    },
  ];

  const editPost = async (id: string): Promise<void> => {
    try {
      const editedPost = {
        title: newTitle,
        videoUrl: newUrlVideo,
        text: newText,
        img: newImg,
      };
      const response = await axios.put(
        `${backDomain}/api/v1/blogposts/${id}`,
        editedPost,
        { headers: actualHeaders }
      );
      fetchData();
      handleSeeModal();
    } catch (error) {
      alert("Erro ao editar post");
      console.error(error);
      fetchData();
      handleSeeModal();
    }
  };

  const deletePost = async (id: string): Promise<void> => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/blogposts/${id}`,
        { headers: actualHeaders }
      );
      alert("Post definitivamente excluído");
      handleSeeModal();
      fetchData();
    } catch (error) {
      alert("Erro ao editar post");
      console.error(error);
      handleSeeModal();
      fetchData();
    }
  };

  async function fetchData(): Promise<void> {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/blogpost`, {
        headers: actualHeaders,
      });
      setTimeout(() => {
        const filteredPosts = response.data.listOfPosts.filter(
          (post: any) => post !== null
        );
        setPosts(filteredPosts);
        setLoading(false);
      }, 300);
    } catch (error: any) {
      notifyError(error.response.data.error);
      setTimeout(() => {
        window.location.assign("/login");
        setLoading(false);
      }, 2500);
    }
  }

  return (
    <>
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
            <i className="fa fa-user " aria-hidden="true" />
            <p>
              {UniversalTexts.hello}
              {name}!
            </p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}></div>
        </div>
        <DivFlex>
          <div className="grid-flex-2">
            <DivMarginBorder>
              <WordOfTheDay
                change={change}
                onChange={setChange}
                headers={headers}
              />
            </DivMarginBorder>
          </div>
          <div className="grid-flex-2">
            <DivMarginBorder>
              {loadingLESSON ? (
                <CircularProgress style={{ color: secondaryColor() }} />
              ) : (
                <div className="study-container">
                  <HOne>{UniversalTexts.studyEnglish}</HOne>
                  <div className="grid-container">
                    {sessions.map((session) => (
                      <a
                        key={session.id}
                        href={session.link}
                        className="grid-item"
                      >
                        <span className="session-title">{session.title}</span>
                        <div
                          className="image-background"
                          style={{ backgroundImage: `url(${session.img})` }}
                        />

                        <div className="overlay">
                          <p className="session-description">
                            {session.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </DivMarginBorder>
          </div>
        </DivFlex>
      </RouteDiv>

      <DivModal
        className="modal"
        style={{
          display: isVisible ? "block" : "none",
        }}
      >
        <Xp onClick={() => handleSeeModal()}>X</Xp>
        <HTwo>{UniversalTexts.editPost}</HTwo>
        <InternDivModal>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            id="title"
            placeholder="Title"
            type="text"
            className="inputs-style"
          />
          <input
            className="inputs-style"
            value={newUrlVideo}
            onChange={(event) => setNewUrlVideo(event.target.value)}
            id="VideoUrl"
            placeholder="VideoUrl (Youtube/Vimeo)"
            type="text"
          />
          <input
            value={newImg}
            onChange={(event) => setNewImg(event.target.value)}
            id="VideoUrl"
            placeholder="Imagem URL"
            type="text"
            className="inputs-style"
          />
          <textarea
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            id="Texto"
            placeholder="Texto"
            cols={20}
            rows={10}
            required
            className="inputs-style"
          />
        </InternDivModal>
        <UniversalButtonsDivFlex
          style={{
            display: !seeConfirmDelete ? "flex" : "none",
          }}
        >
          <Button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#ba3c3c",
            }}
            onClick={() => handleConfirmDelete()}
          >
            {UniversalTexts.delete}
          </Button>
          <Button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#194169",
            }}
            onClick={() => handleSeeModal()}
          >
            {UniversalTexts.cancel}
          </Button>
          <Button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#138017",
            }}
            onClick={() => editPost(_id)}
          >
            {UniversalTexts.save}
          </Button>
        </UniversalButtonsDivFlex>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            display: seeConfirmDelete ? "grid" : "none",
          }}
        >
          <p
            style={{
              color: "#ba3c3c",
              paddingTop: "1rem",
              fontWeight: 700,
            }}
          >
            {UniversalTexts.deleteConfirm}
          </p>
          <UniversalButtonsDivFlex>
            <Button
              style={{
                color: alwaysWhite(),
                backgroundColor: "#194169",
              }}
              onClick={() => handleConfirmDelete()}
            >
              {UniversalTexts.no}
            </Button>
            <Button
              style={{
                color: alwaysWhite(),
                backgroundColor: "#ba3c3c",
              }}
              onClick={() => deletePost(_id)}
            >
              {UniversalTexts.yes}
            </Button>
          </UniversalButtonsDivFlex>
        </div>
      </DivModal>
      <BackgroundClickBlog
        onClick={() => handleSeeModal()}
        style={{ display: !isVisible ? "none" : "flex" }}
      />
    </>
  );
}

export default Blog;
