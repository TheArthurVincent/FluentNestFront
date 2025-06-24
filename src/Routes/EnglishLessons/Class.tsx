// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
  getVideoEmbedUrl,
  onLoggOut,
  pathGenerator,
  Xp,
} from "../../Resources/UniversalComponents";
import { HOne, HTwo } from "../../Resources/Components/RouteBox";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { Link } from "react-router-dom";
import {
  alwaysWhite,
  darkGreyColor,
  primaryColor,
  secondaryColor,
  textTitleFont,
  transparentBlack,
} from "../../Styles/Styles";
import Helmets from "../../Resources/Helmets";
import { ImgLesson } from "./Assets/Functions/EnglishActivities.Styled";
import { IFrameVideoBlog } from "../Blog/Blog.Styled";
import VideoLessonModel from "./Assets/LessonsModels/VideoLessonModel";
import SentenceLessonModel from "./Assets/LessonsModels/SentenceLessonModel";
import TextLessonModel from "./Assets/LessonsModels/TextLessonModel";
import MultipleTextsLessonModel from "./Assets/LessonsModels/MultipleTextsLessonModel";
import SelectExercise from "./Assets/LessonsModels/MultipleSelectExercise";
import ImageLessonModel from "./Assets/LessonsModels/ImageLessonModel";
import ExerciseLessonModel from "./Assets/LessonsModels/ExerciseLessonModel";
import DialogueLessonModel from "./Assets/LessonsModels/DialogueLessonModel";
import SingleImageLessonModel from "./Assets/LessonsModels/SingleImageLessonModel";
import ListenAndTranslateLessonModel from "./Assets/LessonsModels/ListenAndTranslateLessonModel";
import TextsWithTranslateLessonModel from "./Assets/LessonsModels/TextWithNoAudio";
import SentenceLessonModelSlide from "./Assets/SlideModels/SentenceLessonModelSlide";
import TextLessonModelSlide from "./Assets/SlideModels/TextLessonModelSlide";
import TextsWithTranslateSlideLessonModel from "./Assets/SlideModels/TextWithNoAudio";
import ExerciseLessonModelLesson from "./Assets/LessonsModels/ExerciseLessonModelExercise";
import ImageLessonModelSlide from "./Assets/SlideModels/ImageLessonModelSlide";
import { CircularProgress, TextareaAutosize } from "@mui/material";
import QandALessonModel from "./Assets/LessonsModels/QandALessonModel";
import QandALessonPersonalModel from "./Assets/LessonsModels/QandALessonPersonalModel";
import NoFlashcardsSentenceLessonModel from "./Assets/LessonsModels/NoFlashcardsSentenceLessonModel";
import AudioSoundTrack from "./Assets/LessonsModels/AudioSoundTrack";
import TextAreaLesson from "./Assets/Functions/TextAreaLessons";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import Voice from "../../Resources/Voice";
import { notifyError } from "./Assets/Functions/FunctionLessons";
const styles = {
  container: {
    maxWidth: "90vw",
    margin: "20px auto",
    padding: "10px",
    borderRadius: "6px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  commentBox: {
    display: "flex",
    alignItems: "flex-start",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  userImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
    border: "2px solid #ccc",
  },
  commentContent: {
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    flex: 1,
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  commentText: {
    wordWrap: "break-word",
    overflowWrap: "break-word",
    fontSize: "14px",
    color: "#333",
    marginBottom: "5px",
  },
  answerText: {
    fontSize: "13px",
    color: "#555",
    backgroundColor: "#e9e9e9",
    padding: "5px",
    borderRadius: "4px",
    marginTop: "5px",
  },
  commentDate: {
    fontSize: "12px",
    color: "#777",
    marginTop: "5px",
  },
};
interface EnglishClassCourse2ModelProps {
  headers: MyHeadersType | null;
  classId: any;
  course: any;
  courseTitle: any;
  previousClass: any;
  nextClass: any;
  studentsWhoCompletedIt: any;
  order: number | any;
}

export default function EnglishClassCourse2({
  headers,
  classId,
  studentsWhoCompletedIt,
  previousClass,
  nextClass,
  order,
  courseTitle,
}: EnglishClassCourse2ModelProps) {
  const { UniversalTexts } = useUserContext();

  const [studentsList, setStudentsList] = useState<any>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [myId, setId] = useState<string>("");
  const [thePermissions, setPermissions] = useState<string>("");
  const [thePicture, setPicture] = useState<string>("");
  const [seeSlides, setSeeSlides] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [theclass, setheClass] = useState<any>({});
  const [classTitle, setClassTitle] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [commentsTrigger, setCommentsTrigger] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const actualHeaders = headers || {};

  const getClass = async () => {
    setLoading(true);
    const user = localStorage.getItem("loggedIn");
    const { id, permissions, picture } = JSON.parse(user || "");
    setPermissions(permissions);
    setPicture(picture);
    if (permissions == "superadmin") {
      fetchStudents();
    }

    if (user) {
      setId(id);
      setStudentID(id);
    }
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers: actualHeaders }
      );

      var clss = response.data.classDetails;
      setClassTitle(response.data.classDetails.title);
      if (response.data.classDetails.studentsWhoCompletedIt.includes(id)) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      setheClass(clss);
      setLoading(false);
      setCommentsTrigger(true);
    } catch (error) {
      console.log(error, "Erro ao obter aulas");
      onLoggOut();
      setLoading(false);
    }
  };

  const getClassNoLoading = async () => {
    const user = localStorage.getItem("loggedIn");
    const { id, permissions } = JSON.parse(user || "");
    setPermissions(permissions);
    if (permissions == "superadmin") {
      fetchStudents();
    }

    if (user) {
      setId(id);
      setStudentID(id);
    }
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers: actualHeaders }
      );

      var clss = response.data.classDetails;
      setClassTitle(response.data.classDetails.title);
      console.log(response.data.classDetails.studentsWhoCompletedIt, studentID);
      if (response.data.classDetails.studentsWhoCompletedIt.includes(id)) {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
      setheClass(clss);
    } catch (error) {
      console.log(error, "Erro ao obter aulas");
    }
  };
  // Função para alternar o estado do switch
  const handleToggle = async (event: any) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/course/${classId}`,
        { studentID },
        { headers: actualHeaders }
      );
      getClassNoLoading();
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  };

  const handleCurrentClass = async () => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn) {
      var loggedInData = JSON.parse(loggedIn);
      loggedInData.lastClassId = classId;
      localStorage.setItem("loggedIn", JSON.stringify(loggedInData));
    }

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handlecurrentclass/${loggedInData.id}`,
        { classId },
        { headers: actualHeaders }
      );
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  };

  const verifyCheck = async () => {
    if (
      theclass &&
      Array.isArray(theclass.studentsWhoCompletedIt) &&
      theclass.studentsWhoCompletedIt.length > 0 &&
      theclass.studentsWhoCompletedIt.includes(studentID)
    ) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleCurrentClass();
    }, 5000);
  }, [studentID]);

  useEffect(() => {
    verifyCheck();
  }, [theclass]);

  useEffect(() => {
    getClass();
  }, []);

  const handleKeyDown = (event: any) => {
    if (event.key === "Escape") {
      setSeeSlides(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theid = event.target.value;
    setStudentID(theid);
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
        headers: actualHeaders,
      });
      setStudentsList(response.data.listOfStudents);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    }
  };

  const backToCourses = () => {
    window.location.assign(`/english-courses/${pathGenerator(courseTitle)}`);
  };
  const NXTClass = () => {
    window.location.assign(
      `/english-courses/${pathGenerator(courseTitle)}/${nextClass}`
    );
  };
  const PVSClass = () => {
    window.location.assign(
      `/english-courses/${pathGenerator(courseTitle)}/${previousClass}`
    );
  };

  const [showCourses, setShowCourses] = useState(true);
  const [comment, setComment] = useState("");
  const [arrow, setArrow] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [myComments, setMyComments] = useState([]);
  const [comments, setComments] = useState([]);
  const getComments = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/comments/${classId}/${myId}`,
        { headers: actualHeaders }
      );
      const com = response.data.comments;
      const myCom = response.data.myComments;
      setComments(com);
      setMyComments(myCom);
    } catch (error) {
      console.log(error, "Erro ao buscar comentários");
      // onLoggOut();
    }
  };
  const sendComment = async () => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/comment/`,
        {
          studentID: myId,
          lessonID: classId,
          comment,
          lesson: window.location.href,
        },
        { headers: actualHeaders }
      );

      notifyError(
        "Comentário enviado. Você será respondido em breve!",
        secondaryColor()
      );
      setComment("");
      getComments();
    } catch (error) {
      console.log(error, "Erro ao comentar");
      // onLoggOut();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getComments();
    }, 500);
  }, [commentsTrigger]);

  const handleShowCourses = () => {
    setShowCourses(!showCourses);
    setArrow(!arrow);
  };

  const deleteComment = async (id: any) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/comment/${id}`,
        { headers: actualHeaders }
      );

      window.alert("Comentário excluído!");
      setComment("");
      getComments();
    } catch (error) {
      console.log(error, "Erro ao comentar");
      // onLoggOut();
    }
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
    console.log(storedVoice);
  }, [selectedVoice, changeNumber]);

  return (
    <div>
      <Helmets text={classTitle} />

      {loading ? (
        <CircularProgress style={{ color: secondaryColor() }} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                fontSize: "10px",
                color: primaryColor(),
              }}
              to="/english-courses"
            >
              English Courses
            </Link>{" "}
            <span style={{ color: darkGreyColor() }}>-</span>
            <span
              style={{
                textDecoration: "none",
                fontSize: "10px",
                color: primaryColor(),
                cursor: "pointer",
              }}
              onClick={backToCourses}
            >
              {courseTitle}
            </span>{" "}
            <span style={{ color: darkGreyColor() }}>-</span>
            <span
              style={{
                textDecoration: "none",
                fontStyle: "italic",
                fontSize: "10px",
                color: secondaryColor(),
              }}
            >
              {theclass.title}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              margin: "1rem auto",
              padding: "0 1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {previousClass !== "123456" ? (
              <span
                style={{
                  color: secondaryColor(),
                  cursor: "pointer",
                }}
                onClick={PVSClass}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No previous class
              </span>
            )}
            <HOne
              style={{
                fontSize: "18px",
              }}
            >
              {`${order + 1}- ${theclass.title}`}{" "}
              <i
                style={{
                  color: "white",
                  backgroundColor: "green",
                  padding: "1px",
                  borderRadius: "50%",
                  margin: "0 0.5rem",
                }}
                className={isCompleted ? `fa fa-check` : `fa fa-circle`}
              />
            </HOne>

            {nextClass !== "123456" ? (
              <span
                style={{
                  color: secondaryColor(),
                  cursor: "pointer",
                }}
                onClick={NXTClass}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No next class
              </span>
            )}
          </div>
          <label>
            <input
              style={{
                cursor: "pointer",
              }}
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={loading}
            />
            {loading
              ? "  Atualizando..."
              : isCompleted
              ? "  Completed"
              : "  Not Completed"}
          </label>
          {thePermissions == "superadmin" && (
            <div
              onClick={handleCurrentClass}
              style={{
                margin: "5px",
                padding: "5px",
                cursor: "pointer",
                backgroundColor: "#eee",
                display: "inline",
              }}
            >
              handleCurrentClass
            </div>
          )}

          {
            <div
              className="box-shadow-white"
              style={{
                height: "3rem",
                padding: "0 10px ",
                backgroundColor: alwaysWhite(),
                position: "fixed",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                minWidth: "100px",
                bottom: 5,
                left: showCourses ? -250 : 3,
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  display: thePermissions === "superadmin" ? "block" : "none",
                  // display:  "none"
                }}
              >
                <select
                  onChange={(e) => handleStudentChange(e)}
                  value={studentID}
                >
                  {studentsList.map((student: any, index: number) => (
                    <option key={index} value={student.id}>
                      {student.name + " " + student.lastname}
                    </option>
                  ))}
                </select>
                <ArvinButton color="green" onClick={fetchStudents}>
                  <i className="fa fa-refresh" aria-hidden="true" />
                </ArvinButton>
              </span>
              <Voice changeB={changeNumber} setChangeB={setChangeNumber} />

              <span
                style={{
                  fontSize: "10px",
                  marginLeft: "16px",
                }}
              >
                <i
                  className={`fa fa-arrow-${arrow ? "left" : "right"}`}
                  style={{
                    margin: "5px",
                    fontSize: "16px",
                  }}
                  onClick={handleShowCourses}
                  aria-hidden="true"
                />
              </span>
            </div>
          }
          {theclass.image && (
            <ImgLesson src={theclass.image} alt={theclass.subtitle} />
          )}
          {theclass.video && (
            <div style={{ margin: "1rem auto 0 auto" }}>
              <IFrameVideoBlog src={getVideoEmbedUrl(theclass.video)} />
            </div>
          )}
          {theclass.description && (
            <p
              style={{
                margin: "1rem 0",
                padding: "0.3rem",
                backgroundColor: "#f9f9f9",
                fontSize: "1.1rem",
                fontFamily: textTitleFont(),
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {theclass.description}
            </p>
          )}
          {theclass.elements &&
            theclass.elements
              .sort((a: any, b: any) => a.order - b.order)
              .map((element: any, index: number) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  {element.subtitle && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <HTwo>{index + 1 + "- " + element.subtitle}</HTwo>
                    </div>
                  )}
                  {element.image && element.subtitle && (
                    <ImgLesson src={element.image} alt={element.subtitle} />
                  )}
                  {element.video && element.subtitle && (
                    <VideoLessonModel element={element} />
                  )}

                  {element.comments && (
                    <p
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        borderRadius: "6px",
                        margin: "0.5rem 0",
                        fontStyle: "italic",
                      }}
                    >
                      {element.comments}
                    </p>
                  )}
                  {element.type === "sentences" ? (
                    <SentenceLessonModel
                      mainTag={theclass.mainTag}
                      element={element}
                      studentId={studentID}
                      headers={headers}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "nfsentences" ? (
                    <NoFlashcardsSentenceLessonModel
                      element={element}
                      headers={headers}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "text" ? (
                    <TextLessonModel
                      headers={headers}
                      text={element.text ? element.text : ""}
                    />
                  ) : element.type === "html" ? (
                    <div
                      style={{
                        padding: "1rem",
                        justifyContent: "center",
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: element.text }} />
                    </div>
                  ) : element.type === "multipletexts" ? (
                    <MultipleTextsLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "selectexercise" ? (
                    <SelectExercise
                      headers={headers}
                      element={element}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "images" ? (
                    <ImageLessonModel
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      id={myId}
                      headers={headers}
                      element={element}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "exercise" ? (
                    <ExerciseLessonModel
                      headers={headers}
                      item={element.items}
                    />
                  ) : element.type === "qanda" ? (
                    <QandALessonModel
                      headers={headers}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      item={element}
                    />
                  ) : element.type === "audiosoundtrack" ? (
                    <AudioSoundTrack
                      headers={headers}
                      text={element.text}
                      src={element.src}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      element={element}
                      link={element.link}
                      subtitle={element.subtitle}
                      selectedVoice={selectedVoice}
                    />
                  ) : element.type === "personalqanda" ? (
                    <QandALessonPersonalModel
                      headers={headers}
                      studentId={studentID}
                      mainTag={theclass.mainTag}
                      item={element}
                    />
                  ) : element.type === "dialogue" ? (
                    <DialogueLessonModel headers={headers} element={element} />
                  ) : element.type === "singleimages" ? (
                    <SingleImageLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "listenandtranslate" ? (
                    <ListenAndTranslateLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : element.type === "listinenglish" ? (
                    <TextsWithTranslateLessonModel
                      headers={headers}
                      element={element}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ))}
          <div
            style={{
              display: "flex",
              margin: "1rem auto",
              padding: "0 1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {previousClass !== "123456" ? (
              <span
                style={{
                  color: secondaryColor(),
                  cursor: "pointer",
                }}
                onClick={PVSClass}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No previous class
              </span>
            )}
            {nextClass !== "123456" ? (
              <span
                style={{
                  color: secondaryColor(),
                  cursor: "pointer",
                }}
                onClick={NXTClass}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </span>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                }}
              >
                No next class
              </span>
            )}
          </div>
          <ArvinButton
            style={{ margin: "1rem auto", display: "block" }}
            onClick={() => {
              setSeeSlides(!seeSlides);
            }}
          >
            See slides
          </ArvinButton>
          <div>
            <HTwo>{UniversalTexts.leaveAComment}</HTwo>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {" "}
              <img
                style={styles.userImage} //klç
                src={thePicture}
                alt="User"
              />
              <textarea
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                type="text"
                className="comments2"
                placeholder="Type your comment here..."
                value={comment}
              />
            </div>
            <div>
              <ArvinButton
                style={{
                  display: "flex",
                  marginLeft: "auto",
                }}
                onClick={sendComment}
              >
                {UniversalTexts.leaveAComment}
              </ArvinButton>

              <>
                {comments.length > 0 && (
                  <div style={styles.container}>
                    <HTwo>{UniversalTexts.comments}</HTwo>
                    <div style={styles.commentList}>
                      {comments.map((comment: any, index: number) => (
                        <div key={index} style={styles.commentBox}>
                          <img
                            style={styles.userImage}
                            src={comment.photo}
                            alt="User"
                          />
                          <div style={styles.commentContent}>
                            <p style={styles.commentText}>{comment.comment}</p>
                            {comment.answer && (
                              <p style={styles.answerText}>
                                <strong>Resposta:</strong> {comment.answer}
                              </p>
                            )}
                            <span style={styles.commentDate}>
                              {formatDateBr(new Date(comment.date))}
                            </span>
                          </div>
                          {thePermissions == "superadmin" && (
                            <span>
                              <ArvinButton
                                onClick={() => deleteComment(comment.id)}
                                color="red"
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </ArvinButton>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {myComments.length > 0 && (
                  <div style={styles.container}>
                    <HTwo>{UniversalTexts.myPendingComments}</HTwo>
                    <ul style={styles.commentList}>
                      {myComments.map((comment: any, index: number) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {comment.comment}{" "}
                          {thePermissions == "superadmin" && (
                            <span>
                              <ArvinButton
                                onClick={() => deleteComment(comment.id)}
                                color="red"
                              >
                                <i className="fa fa-trash" aria-hidden="true" />
                              </ArvinButton>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            </div>
          </div>
          <label>
            <input
              style={{
                cursor: "pointer",
              }}
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={loading}
            />
            {loading
              ? "  Atualizando..."
              : isCompleted
              ? "  Completed"
              : "  Not Completed"}
          </label>
        </>
      )}
      {/* Teacher */}
      {/* Teacher */}
      {/* Teacher */}
      {/* Teacher */}
      {/* Teacher */}
      {seeSlides && (
        <>
          <div
            onClick={() => {
              setSeeSlides(!seeSlides);
            }}
            style={{
              backgroundColor: transparentBlack(),
              zIndex: 100000000000,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100000000vw",
              height: "100000000vw",
            }}
          />
          <div
            style={{
              padding: "2rem",
              position: "fixed",
              top: 5,
              left: 5,
              width: "94vw",
              border: "1px grey solid",
              borderRadius: "6px",
              height: "97vh",
              zIndex: 10000000000000,
              backgroundColor: "white",
            }}
          >
            <Xp
              style={{ margin: "1rem auto", display: "block" }}
              onClick={() => {
                setSeeSlides(!seeSlides);
              }}
            >
              x
            </Xp>
            <div
              style={{
                height: "75vh",
                overflow: "auto",
              }}
            >
              {theclass.elements
                .sort((a: any, b: any) => a.order - b.order)
                .map((element: any, index: number) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    {element.type === "sentences" ? (
                      <SentenceLessonModelSlide
                        studentId={studentID}
                        element={element}
                        headers={headers}
                      />
                    ) : element.type === "text" ? (
                      <TextLessonModelSlide
                        text={element.text ? element.text : ""}
                      />
                    ) : element.type === "listinenglish" ? (
                      <TextsWithTranslateSlideLessonModel
                        headers={headers}
                        element={element}
                      />
                    ) : element.type === "exercise" ? (
                      <ExerciseLessonModelLesson
                        headers={headers}
                        item={element.items}
                      />
                    ) : element.type === "images" ? (
                      <ImageLessonModelSlide
                        headers={headers}
                        element={element}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
//
