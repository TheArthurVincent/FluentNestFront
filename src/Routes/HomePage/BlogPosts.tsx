import React, { useEffect, useState } from "react";
import {
  BlogPostTitle,
  BackgroundClickBlog,
  HTwo,
  HOne,
} from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";
import {
  formatDate,
  backDomain,
  getVideoEmbedUrl,
  Xp,
  UniversalButtonsDivFlex,
  onLoggOut,
} from "../../Resources/UniversalComponents";
import {
  alwaysWhite,
  partnerColor,
  textGeneralFont,
  textTitleFont,
} from "../../Styles/Styles";
import { Button, CircularProgress } from "@mui/material";
import { DivModal, IFrameAsaas, ImgBlog, InternDivModal } from "./Blog.Styled";
import HTMLEditor from "../../Resources/Components/HTMLEditor";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { getEmbedUrl } from "../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFuncions";

interface BlogPostsProps {
  headers: MyHeadersType | null;
}

export function BlogPosts({ headers }: BlogPostsProps) {
  const { UniversalTexts } = useUserContext();
  // Strings
  const [newTitle, setNewTitle] = useState<string>("");
  const [_id, setID] = useState<string>("");
  const [_StudentId, setStudentId] = useState<string>("");
  const [newText, setNewText] = useState<string>("");
  const [newImg, setNewImg] = useState<string>("");
  const [newUrlVideo, setNewUrlVideo] = useState<string>("");
  const [permissions, setPermissions] = useState<string>("");
  // Booleans
  const [seeConfirmDelete, setSeeConfirmDelete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Loading
  const [posts, setPosts] = useState<any>([
    {
      title: <CircularProgress style={{ color: partnerColor() }} />,
    },
  ]);

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const theuser = JSON.parse(localStorage.getItem("loggedIn") || "");
    if (user) {
      setUser(theuser);
    } else {
    }
    let getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "");
    fetchData();
    setStudentId(getLoggedUser.id || _StudentId);
    setPermissions(getLoggedUser.permissions);
  }, []);

  const handleSeeModal = () => {
    setIsVisible(!isVisible);
    setSeeConfirmDelete(false);
  };
  const handleConfirmDelete = () => {
    setSeeConfirmDelete(!seeConfirmDelete);
  };

  const actualHeaders = headers || {};

  const seeEdition = async (id: string): Promise<void> => {
    handleSeeModal();
    try {
      const response = await axios.get(`${backDomain}/api/v1/blogpost/${id}`, {
        headers: actualHeaders,
      });
      setID(response.data.formattedBlogPost.id);
      setNewTitle(response.data.formattedBlogPost.title);
      setNewUrlVideo(response.data.formattedBlogPost.videoUrl);
      setNewText(response.data.formattedBlogPost.text);
      setNewImg(response.data.formattedBlogPost.img);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

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
      const { teacherID } = JSON.parse(localStorage.getItem("loggedIn") || "");
      const response = await axios.get(
        `${backDomain}/api/v1/blogposts/${teacherID}`,
        {
          headers: actualHeaders,
        }
      );
      if (response.data.listOfPosts) {
        setTimeout(() => {
          const filteredPosts = response.data.listOfPosts.filter(
            (post: any) => post !== null
          );
          setPosts(filteredPosts);
          setLoading(false);
        }, 1000);
      } else {
        setPosts([]);
        setLoading(false);
      }
    } catch (error: any) {
      notifyAlert(error.response.data.error);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div>
        <HOne>{UniversalTexts.mural}</HOne>
        {posts.length > 0 ? (
          <div>
            {posts.map((post: any, index: number) => (
              <div
                key={index}
                style={{
                  maxWidth: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                {post.title && (
                  <BlogPostTitle>
                    <span
                      style={{
                        maxWidth: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {!loading && (
                        <button
                          style={{
                            cursor: "pointer",
                            display:
                              permissions == "superadmin" ||
                              permissions == "teacher"
                                ? "grid"
                                : "none",
                          }}
                          onClick={() => seeEdition(post._id)}
                        >
                          <i className="fa fa-edit" aria-hidden="true" />
                        </button>
                      )}
                      <HTwo style={{ fontFamily: textGeneralFont() }}>
                        {post.title}
                      </HTwo>
                    </span>
                    {post.createdAt && (
                      <span>{formatDate(post.createdAt)}</span>
                    )}
                  </BlogPostTitle>
                )}
                {post.videoUrl ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "6px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#000",
                      }}
                    >
                      <iframe
                        src={getEmbedUrl(post.videoUrl)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: "6px",
                        }}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                ) : post.img ? (
                  <ImgBlog src={post.img} alt="logo" />
                ) : null}
                <div
                  style={{
                    margin: "1rem auto",
                    fontSize: "0.8rem",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    maxWidth: "800px",
                    lineHeight: "1",
                    color: "#222",
                  }}
                  className="limited-text"
                >
                  <div dangerouslySetInnerHTML={{ __html: post.text }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p>Nenhum post encontrado.</p>
          </>
        )}
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 99,
          display: isVisible ? "block" : "none",
        }}
        onClick={() => handleSeeModal()}
      />
      <div
        className="modal"
        style={{
          position: "fixed",
          zIndex: 100,
          backgroundColor: `${alwaysWhite()}`,
          padding: "1rem",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "90vh",
          width: "90vw",
          overflowY: "auto",
          display: isVisible ? "block" : "none",
        }}
      >
        <Xp onClick={() => handleSeeModal()}>✕</Xp>
        <HOne>{UniversalTexts.editPost}</HOne>
        <InternDivModal>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            id="title"
            placeholder="Title"
            type="text"
          />
          <input
            value={newUrlVideo}
            onChange={(event) => setNewUrlVideo(event.target.value)}
            id="VideoUrl"
            placeholder="VideoUrl (Youtube/Vimeo)"
            type="text"
          />
          <HTMLEditor initialContent={newText} onChange={setNewText} />
        </InternDivModal>
        <UniversalButtonsDivFlex
          style={{
            display: !seeConfirmDelete ? "flex" : "none",
          }}
        >
          <button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#ba3c3c",
            }}
            onClick={() => handleConfirmDelete()}
          >
            {UniversalTexts.delete}
          </button>
          <button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#194169",
            }}
            onClick={() => handleSeeModal()}
          >
            {UniversalTexts.cancel}
          </button>
          <button
            style={{
              color: alwaysWhite(),
              backgroundColor: "#138017",
            }}
            onClick={() => editPost(_id)}
          >
            {UniversalTexts.save}
          </button>
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
            <button
              style={{
                color: alwaysWhite(),
                backgroundColor: "#194169",
              }}
              onClick={() => handleConfirmDelete()}
            >
              {UniversalTexts.no}
            </button>
            <button
              style={{
                color: alwaysWhite(),
                backgroundColor: "#ba3c3c",
              }}
              onClick={() => deletePost(_id)}
            >
              {UniversalTexts.yes}
            </button>
          </UniversalButtonsDivFlex>
        </div>
      </div>
      <BackgroundClickBlog
        onClick={() => handleSeeModal()}
        style={{ display: !isVisible ? "none" : "flex" }}
      />
    </div>
  );
}

export default BlogPosts;
