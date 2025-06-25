import React, { useEffect, useState } from "react";
import {
  RouteDiv,
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
} from "../../Resources/UniversalComponents";
import { alwaysWhite, secondaryColor } from "../../Styles/Styles";
import { Button, CircularProgress } from "@mui/material";
import {
  DivModal,
  IFrameAsaas,
  IFrameVideoPannel,
  ImgBlog,
  InternDivModal,
} from "./Blog.Styled";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";

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
  const [name, setName] = useState<string>("");
  const [permissions, setPermissions] = useState<string>("");
  // Booleans
  const [seeConfirmDelete, setSeeConfirmDelete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Loading
  const [posts, setPosts] = useState<any>([
    {
      title: <CircularProgress style={{ color: secondaryColor() }} />,
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
    setName(getLoggedUser.name);
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
      const response = await axios.get(`${backDomain}/api/v1/blogposts`, {
        headers: actualHeaders,
      });
      setTimeout(() => {
        const filteredPosts = response.data.listOfPosts.filter(
          (post: any) => post !== null
        );
        setPosts(filteredPosts);
        setLoading(false);
      }, 300);

      console.log(response.data.listOfPosts);
    } catch (error: any) {
      alert(error.response.data.error);
      window.location.assign("/login");
      setLoading(false);
    }
  }

  return (
    <>
      <div
        style={{
          maxWidth: "900px",
        }}
      >
        <Helmets text="Blog Posts" />
        <div
          style={{
            margin: "1rem 0.5rem 0 0",
            display: "flex",
            maxWidth: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "5px" }}></div>
        </div>
        <div>
          <HOne>{UniversalTexts.mural}</HOne>
          <div>
            {posts.map((post: any, index: number) => (
              <div
                key={index}
                style={{
                  maxWidth: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
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
                              permissions == "superadmin" ? "grid" : "none",
                          }}
                          onClick={() => seeEdition(post._id)}
                        >
                          <i className="fa fa-edit" aria-hidden="true" />
                        </button>
                      )}
                      <HTwo> {post.title}</HTwo>
                    </span>
                    {post.createdAt && (
                      <span>{formatDate(post.createdAt)}</span>
                    )}
                  </BlogPostTitle>
                )}
                {post.videoUrl ? (
                  <div
                    style={{
                      margin: "auto",
                    }}
                  >
                    <IFrameAsaas src={getVideoEmbedUrl(post.videoUrl)} />
                  </div>
                ) : post.img ? (
                  <ImgBlog src={post.img} alt="logo" />
                ) : null}
                <div
                  style={{
                    margin: "1rem",
                    fontSize: "1.1rem",
                    display: "block",
                    padding: "1rem 0",
                  }}
                  className="limited-text"
                >
                  <div dangerouslySetInnerHTML={{ __html: post.text }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

export default BlogPosts;
