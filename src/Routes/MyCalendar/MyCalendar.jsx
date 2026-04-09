import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HOne,
  HTwo,
  RouteDiv,
  RouteDivCalendar,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";
import {
  alwaysBlack,
  alwaysWhite,
  partnerColor,
  textpartnerColorContrast,
  textPrimaryColorContrast,
  transparentWhite,
} from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { CircularProgress, LinearProgress } from "@mui/material";
import {
  Xp,
  abreviateName,
  backDomain,
  formatDate,
  formatDateBr,
  onLoggOut,
  onLoggOutFee,
  truncateString,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import moment from "moment";
import { StyledDiv } from "./CalendarComponents/MyCalendarFunctions/MyCalendar.Styled";
import Helmets from "../../Resources/Helmets";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import HTMLEditor from "../../Resources/Components/HTMLEditor";
import {
  categoryList,
  convertToBase64,
  formatTimeRange,
  getEmbedUrl,
  getLastMonday,
  isEventTimeNowConsideringDuration,
  times,
  weekDays,
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import ToDoAddButton from "./CalendarComponents/ToDo/ToDoNew";
import {
  containerPlus,
  inputCheckBox,
  recurrentButton,
  seePlusButtonsStyles,
  singleClassButton,
  spanChecked,
  styleLiChecked,
  updateButton,
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFunctions.Styles";
import { display, fontSize } from "@mui/system";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import NewRecurringEventCalendar from "./CalendarComponents/NewRecurringEventCalendar/NewRecurringEventCalendar";
import TodoModal from "./EditToDoModal";
import NewClassModal from "./NewEvent";
import { createPortal } from "react-dom";

function EventPreviewModal({ event, onClose }) {
  if (!event) return null;
  const portalTarget = document.getElementById("modal-root") || document.body;

  const modal = (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 999999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "520px",
          maxWidth: "95vw",
          background: "#ffffff",
          borderRadius: "6px",
          border: "none",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          fontFamily: "Plus Jakarta Sans",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px",
            borderBottom: "1px solid #EEF2F7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(180deg,#F9FAFB 0%,#FFFFFF 100%)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "16px",
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            {event.groupName || event.student || event.description || "Event"}
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#fff",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px", display: "grid", gap: "14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              fontSize: "13px",
              gap: "8px",
            }}
          >
            <strong style={{ color: "#111827" }}>Data</strong>
            <span style={{ color: "#4B5563" }}>
              {formatDateBr(new Date(event.date))}
            </span>
            <strong style={{ color: "#111827" }}>Horário</strong>
            <span style={{ color: "#4B5563" }}>{event.time}</span>
            {event.category !== "Marcar Reposição" && (
              <>
                <strong style={{ color: "#111827" }}>Status</strong>
                <span
                  style={{
                    fontWeight: 800,
                    color:
                      event.status === "realizada"
                        ? partnerColor()
                        : event.status === "desmarcado"
                          ? "rgba(220,38,38,0.9)"
                          : "#2563EB",
                  }}
                >
                  {event.status}
                </span>
              </>
            )}{" "}
          </div>

          {event.link &&
            event.status == "marcado" &&
            event.category !== "Marcar Reposição" && (
              <a
                href={event.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "13px",
                  color: partnerColor(),
                  textDecoration: "none",
                  border: `1px solid ${partnerColor()}40`,
                  padding: "10px 12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  background: `${partnerColor()}10`,
                }}
                target="_blank"
              >
                Abrir link da aula
              </a>
            )}
        </div>
        {/* Footer */}
        <div
          style={{
            padding: "16px 22px",
            borderTop: "1px solid #EEF2F7",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <a
            href={`/my-calendar/event/${event._id}`}
            rel="noreferrer"
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              background: partnerColor(),
              color: "#fff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {event.category === "Marcar Reposição"
              ? "Marcar Reposição"
              : "Abrir Aula"}
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalTarget);
}
function MyCalendar({
  headers,
  isDesktop,
  thePermissions,
  myId,
  setChange,
  change,
}) {
  const [seePlusButtons, setSeePlusButtons] = useState(false);
  const [shouldScrollToToday, setShouldScrollToToday] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [postNew, setPostNew] = useState(false);
  const [dateModal, setDateModal] = useState(new Date());
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [POSTNEWINFOCLASS, setPOSTNEWINFOCLASS] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [alternateText, setAlternateText] = useState("... Updating Class");
  const [modalEditTodo, setModalEditTodo] = useState(false);
  const [descriptionChecklistToEdit, setDescriptionChecklistToEdit] =
    useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [alternateBoolean, setAlternateBoolean] = useState(false);
  const [loadingModalTutoringsInfo, setLoadingModalTutoringsInfo] =
    useState(false);
  const [showStudentsRecurring, setShowStudentsRecurring] = useState(true);
  const [showGroupsRecurring, setShowGroupsRecurring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [theTime, setTheTime] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [theGroup, setTheGroup] = useState("");
  const [video, setVideo] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [homework, setHomework] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [base64String, setBase64String] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [showSeeEditTutoring, setShowSeeEditTutoring] = useState(false);
  const [
    tutoringsListOfOneStudentOrGroup,
    setTutoringsListOfOneStudentOrGroup,
  ] = useState([]);
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [eventFull, setEventFull] = useState({});
  const [loadingTutoringDays, setLoadingTutoringDays] = useState(false);
  const [newEventId, setNewEventId] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [events, setEvents] = useState([]);
  const [isTutoring, setIsTutoring] = useState(false);
  const [homeworkAdded, setHomeworkAdded] = useState(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [seeReplenish, setSeeReplenish] = useState(false);
  const [status, setStatus] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [duration, setDuration] = useState(60);
  const [name, setName] = useState("");
  const [isModalOfTutoringsVisible, setIsModalOfTutoringsVisible] =
    useState("");
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [tutoringId, setTutoringId] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] = useState("");
  const [eventId, setEventId] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
  const [endDateForTutoring, setEndDateForTutoring] = useState(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState(4);
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [newClass, setNewClass] = useState({
    date: "",
    time: "",
    group: "",
    link: "",
    description: "",
    category: "",
    duration: 45,
    studentID: "",
  });
  const [loadingNewClass, setLoadingNewClass] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAlternateText("... Formatting Flashcards");
    }, 2000);
    setTimeout(() => {
      setAlternateText("... Formatting Homework");
    }, 4000);
    setTimeout(() => {
      setAlternateText("... Updating Class");
    }, 6000);
    setTimeout(() => {
      setAlternateText("... Formatting Flashcards");
    }, 8000);
    setTimeout(() => {
      setAlternateText("... Formatting Homework");
    }, 10000);
    setTimeout(() => {
      setAlternateText("... Updating Class");
    }, 12000);
    setTimeout(() => {
      setAlternateText("... Formatting Flashcards");
    }, 14000);
    setTimeout(() => {
      setAlternateText("... Formatting Homework");
    }, 14000);
    setTimeout(() => {
      setAlternateText("... Updating Class");
    }, 16000);
    setTimeout(() => {
      setAlternateText("... Formatting Flashcards");
    }, 18000);
    setTimeout(() => {
      setAlternateText("... Formatting Homework");
    }, 20000);
    setTimeout(() => {
      setAlternateText("... Updating Class");
    }, 22000);
  }, [loadingInfo]);

  const resetEverything = () => {
    setShowEditForm(false);
    setShowHomework(false);
    setShowFlashcards(false);
    setLoading(false);
    setShowNewClassForm(false);
    setEventId("");
    setTheNewLink("");
    setNumberOfWeeks(4);
    setNewClass({
      date: "",
      time: "",
      link: "",
      description: "",
      category: "",
      duration: 45,
      studentID: "",
    });
    setTheNewTimeOfTutoring("");
    setEndDateForTutoring(null);
    setBase64String("");
    setFileName("");
    setFileType("");
    setEndDateForTutoring(null);
    setFlashcards("");
    setSelectedFile(null);
    setUploading(false);
    setCategory("");
    setNewStudentId("");
    setNewGroupId("");
    setShowSeeEditTutoring(false);
    setTutoringsListOfOneStudentOrGroup([]);
    setTheTime("");
    setShowClasses(false);
    setLink("");
    setDescription("");
    setVideo("");
    setGoogleDriveLink("");
    setHomework("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setGroupsList([]);
    setStudentsList([]);
    setGroupsList([]);
    setShowSeeEditTutoring(false);
    setShowEditForm(false);
    setShowHomework(false);
    setShowFlashcards(false);
    setLoading(false);
  };
  const [loadingHWDescription, setLoadingHWDescription] = useState(false);

  const [loadingDescription, setLoadingDescription] = useState(false);
  const handleClassSummary = async () => {
    setLoadingDescription(true);
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myId}`,
          { description, classTitle: theLesson.title },
          { headers },
        );
        const adapted = response.data.adapted;
        setDescription(adapted);
        setLoadingDescription(false);
        setChange(!change);
      } catch (error) {
        setLoadingDescription(false);
        notifyAlert(error?.response?.data?.message);
        console.log(error, "Erro");
      }
    }
  };

  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleOpenEventPreview = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventPreview = () => {
    setSelectedEvent(null);
  };

  const handleHWDescription = async () => {
    setLoadingHWDescription(true);
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description-hw/${myId}`,
          { homework },
          { headers },
        );
        const adapted = response.data.adapted;
        setShowAIGENERATED(true);
        setHomework(adapted);
        setLoadingHWDescription(false);
        setChange(!change);
      } catch (error) {
        setLoadingHWDescription(false);
        console.log(error, "Erro");
        notifyAlert(error?.response?.data?.message);
      }
    }
  };

  const isTutoringExpiringWithinMonth = (tutoring) => {
    if (!tutoring.endDate) return false;
    const today = new Date();
    const oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    const endDate = new Date(tutoring.endDate);
    return endDate < oneMonthFromNow;
  };
  const getDaysUntilExpiration = (tutoring) => {
    if (!tutoring.endDate) return null;
    const today = new Date();
    const endDate = new Date(tutoring.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  var hj = new Date();
  var lm = getLastMonday(hj);
  const [task, setTask] = useState({});
  const [disabledAvoid, setDisabledAvoid] = useState(true);
  const [today, setTheToday] = useState(lm);
  const { UniversalTexts } = useUserContext();
  useEffect(() => {
    if (numberOfWeeks && numberOfWeeks > 0) {
      const today = new Date();
      const nextWeekDay = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
      nextWeekDay.setDate(today.getDate() + daysUntilMonday);
      const endDate = new Date(nextWeekDay);
      endDate.setDate(nextWeekDay.getDate() + numberOfWeeks * 7 - 1);
      setEndDateForTutoring(endDate);
    } else {
      setEndDateForTutoring(null);
    }
  }, [numberOfWeeks]);
  const futureDates = [];
  const fetchStudents = async () => {
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          { headers },
        );
        const res = response.data.listOfStudents;
        setStudentsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar alunos");
      }
    }
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/groups/${myId}`,
          { headers },
        );
        const res = response.data.groups;
        setGroupsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar Turmas");
      }
    }
  };
  const fetchTodo = async (id) => {
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/todo/${myId}?todoId=${id}`,
          { headers },
        );
        setTask(response.data.todo);
        setModalEditTodo(true);
      } catch (error) {
        console.log(error, "Erro ao encontrar alunos");
      }
    }
  };

  const resetEveryThing = () => {
    setGroupsList([]);
    setStudentsList([]);
    setEvents([]);
    setShowSeeEditTutoring(false);
    setShowEditForm(false);
    setShowHomework(false);
    setShowFlashcards(false);
    setLoading(false);
  };

  const [todoList, setTodoList] = useState([]);

  const loadGeneral = async (baseDate) => {
    setModalEditTodo(false);
    setShowDeleteEventConfirmation(false);
    setDisabledAvoid(false);
    setLoading(true);
    setShouldScrollToToday(!baseDate === false); // opcional

    try {
      // Usuário + mensalidade
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id, feeUpToDate } = user;
      updateInfo(id, headers);

      if (!feeUpToDate) {
        onLoggOutFee();
        return;
      }

      const raw = baseDate ? new Date(baseDate) : new Date(); //somar 4 horas ao evento
      raw.setHours(raw.getHours() + 4);
      const monday = getLastMonday(raw);
      setTheToday(monday);
      setShowAIGENERATED(false);
      // Requisição
      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}`,
        { headers, params: { today: monday } },
      );
      // Normalizadores
      const addOneDayAndFormat = (dt) => {
        const d = new Date(dt);
        d.setDate(d.getDate() + 1);
        return formattedDates(d);
      };
      const normalizeEvent = (ev) => ({
        ...ev,
        date: addOneDayAndFormat(ev.date),
        status: ev.status || "marcado",
      });

      const normalizeTodo = (td) => ({
        ...td,
        date: addOneDayAndFormat(td.date),
      });

      // Dados
      const { eventsList = [], todosList = [] } = response.data || {};
      setEvents(eventsList.map(normalizeEvent));
      if (todosList.length) setTodoList(todosList.map(normalizeTodo));

      // Pós-UI padrão
      resetEverything();
      setShowEditForm(false);
      setShowHomework(false);
      setShowFlashcards(false);
      setShowNewClassForm(false);
      setSeePlusButtons(false);
      setShowLastFew(false);
      setModalEditTodo(false);
    } catch (error) {
      if (error?.response?.data?.error) {
        notifyAlert(error.response.data.error, partnerColor());
        setTimeout(() => onLoggOut(), 1000);
      } else {
        console.log(error, "Erro ao carregar eventos");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        setDisabledAvoid(true);
      }, 150);
    }
  };

  useEffect(() => {
    loadGeneral(new Date());
  }, [alternateBoolean]);

  const handleChangeWeek = async (sum) => {
    setShowDeleteEventConfirmation(false);
    setDisabledAvoid(false);

    const chosen = new Date(today);
    chosen.setDate(chosen.getDate() + sum);
    loadGeneral(chosen);
  };

  const handleDateChange = async (e) => {
    const targetDate = new Date(e.target.value);
    loadGeneral(targetDate);
  };
  var [studentsInGroup, setStudentsInGroup] = useState([
    {
      _id: "",
      lastname: "",
      name: "",
    },
  ]);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (studentsInGroup.length > 0) {
      setComments(
        studentsInGroup.map((student) => ({
          studentId: student._id,
          comment: "",
        })),
      );
    }
  }, [studentsInGroup]);

  // Função para atualizar o comentário de um aluno específico
  const handleStudentDescriptionChange = (index, value) => {
    setComments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], comment: value };
      return updated;
    });
  };

  const [lastFew, setLastFew] = useState([]);
  const [showLastFew, setShowLastFew] = useState(false);
  const fetchOneEvent = async (id) => {
    setLoadingModalInfo(true);
    if (!id) {
      return;
    }
    try {
      const response = await axios.get(`${backDomain}/api/v1/event/${id}`, {
        headers,
      });
      setEventFull(response.data.event);
      setLastFew(response.data.event.recentUnmarkedEvents || []);
      if (response?.data?.event?.recentUnmarkedEvents?.[0]?.theLesson) {
        setTheLessonLast(
          response.data.event.recentUnmarkedEvents[0].theLesson || [],
        );
      }

      var theStudentsFromEvent;
      if (response.data.event.listOfStudents) {
        theStudentsFromEvent = response.data.event.listOfStudents;
        setStudentsInGroup(theStudentsFromEvent);
      }

      const test =
        response.data.event.category == "Rep" ||
        response.data.event.category == "Tutoring" ||
        response.data.event.category == "Marcar Reposição" ||
        response.data.event.category == "Group Class";
      if (test) {
        fetchStudents();
      }

      const newFlashcardsAdded = response.data.event.flashcardsAdded || false;
      const newHomeworkAdded = response.data.event.homeworkAdded || false;
      const newCategory = response.data.event.category;
      const newDuration = response.data.event.duration || 55;
      const newStudentID = response.data.event.studentID;
      const newStudent = response.data.event.student;
      const newStatus = response.data.event.status;
      const newLink = response.data.event.link;
      const newDescription = response.data.event.description;
      const newDate = response.data.event.date;
      const newVideo = response.data.event.video;
      const newHomework = response.data.event.homework;
      const newGoogleDriveLink = response.data.event.googleDriveLink || "";
      const newBase64String = response.data.event.base64String || "";
      const newFileName = response.data.event.fileName || "";
      const newFileType = response.data.event.fileType || "";
      const newFlashcards = response.data.event.flashcards || "";
      const newTime = response.data.event.time;
      const newEventId = response.data.event._id;
      const newGroupId = response.data.event.group || "";
      const newGroupName = response.data.event.groupName || "";
      const newTheLesson = response.data.event.theLesson || {};

      var mappedStatus = newStatus;
      if (newStatus === "marcado") {
        mappedStatus = "Scheduled";
      } else if (newStatus === "desmarcado") {
        mappedStatus = "Canceled";
      } else if (newStatus === "realizada") {
        mappedStatus = "Realized";
      }
      setCategory(newCategory);
      setDuration(newDuration);
      setFlashcardsAdded(newFlashcardsAdded);
      setHomeworkAdded(newHomeworkAdded);
      setName(newStudent);
      setStatus(mappedStatus);
      setGroupName(newGroupName);
      setGroupId(newGroupId);
      setNewStudentId(newStudentID);
      setNewEventId(newEventId);
      setLink(newLink);
      setTheLesson(newTheLesson);
      setTheTime(newTime);
      setVideo(newVideo);
      setHomework(newHomework);
      setGoogleDriveLink(newGoogleDriveLink);
      const newDueDate = new Date(newDate);
      newDueDate.setDate(newDueDate.getDate() + 7);
      setDueDate(newDueDate.toISOString().split("T")[0]);
      setBase64String(newBase64String);
      setFileName(newFileName);
      setFileType(newFileType);
      setFlashcards(newFlashcards);
      setDescription(newDescription);
      setDate(newDate);
      setLoadingModalInfo(false);
    } catch (error) {
      console.log(error, "Erro ao encontrarssss alunos");
      setLoadingModalInfo(false);
    }
  };
  const fetchOneSetOfTutorings = async (studentId) => {
    if (!studentId) return;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${studentId}`,
        {
          headers,
        },
      );
      const tutorings = response.data.tutorings;
      setLoadingTutoringDays(true);
      setTutoringsListOfOneStudentOrGroup(response.data.tutorings);
      setLoadingTutoringDays(false);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
    }
  };
  const fetchOneSetOfTutoringsInside = (e) => {
    const eTargetValue = e.target.value;
    setNewStudentId(eTargetValue);
    setShowClasses(true);
  };

  const fetchOneSetOfGroups = async (groupID) => {
    if (!groupID) return;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/groupsrecurrentevents/${groupID}`,
        {
          headers,
        },
      );
      const groups = response.data.tutorings;
      setLoadingTutoringDays(true);
      setTutoringsListOfOneStudentOrGroup(groups);
      setLoadingTutoringDays(false);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
    }
  };

  const fetchOneSetOfGroupClassesInside = (e) => {
    const eTargetValue = e.target.value;
    setNewGroupId(eTargetValue);
    setNewStudentId("");
    setShowClasses(true);
    setSeeEditTutoring(false);
  };

  const postNewEvent = async () => {
    setLoadingInfo(true);
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/event/${id}`,
        {
          category,
          studentID: isTutoring ? newStudentId : null,
          date,
          time: theTime,
          link,
          group: theGroup,
          description,
        },
        {
          headers,
        },
      );
      setLoadingInfo(false);
      setIsVisible(false);
      setCategory("");
      setNewStudentId("");
      setDate("");
      loadGeneral(new Date(date));
    } catch (error) {
      console.log(error, "Erro ao criar evento");
    }
  };
  const deleteOneMaterial = async (id) => {
    setLoadingInfo(true);
    try {
      const response = await axios.delete(`${backDomain}/api/v1/event/${id}`, {
        headers,
      });
      setCategory("");
      setDate("");
      setTheTime("");
      setNewStudentId("");
      setLink("");
      setDescription("");
      if (response) {
        setIsVisible(false);
        setLoadingInfo(false);
        loadGeneral(new Date());
      }
    } catch (error) {
      console.log(error, "Erro ao excluir evento");
    }
  };
  const deleteOneMaterialInside = () => {
    deleteOneMaterial(newEventId);
  };

  const editOneEvent = async (id) => {
    setLoadingInfo(true);
    try {
      let backendStatus = status;
      if (status === "Scheduled") {
        backendStatus = "marcado";
      } else if (status === "Canceled") {
        backendStatus = "desmarcado";
      } else if (status === "Realized") {
        backendStatus = "realizada";
      }
      const user = JSON.parse(localStorage.getItem("loggedIn"));

      const response = await axios.put(
        `${backDomain}/api/v1/event/${id}`,
        {
          studentID: isTutoring ? newStudentId : null,
          date,
          time: theTime,
          category,
          status: backendStatus,
          link,
          video,
          homework,
          googleDriveLink,
          dueDate,
          theLesson: theLesson ? theLesson : null,
          duration,
          base64String,
          fileName,
          showHomework,
          showFlashcards,
          fileType,
          newFlashcards: flashcards,
          description,
          group: groupId,
          teacherID: user.id,
          POSTNEWINFOCLASS,
          comments,
        },
        {
          headers,
        },
      );
      setCategory("");
      setDate("");
      setNewStudentId("");
      if (response) {
        setIsVisible(false);
        setLoadingInfo(false);
        loadGeneral(new Date(date));
      }
    } catch (error) {
      console.log(error, "Erro ao criar evento");
    }
  };
  const editInside = () => {
    editOneEvent(newEventId);
  };
  const ignoreBlurRef = useRef(false);

  function commit(i, value) {}
  const updateScheduled = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "marcado",
        },
        {
          headers,
        },
      );
      if (response) {
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };
  const updateUnscheduled = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "desmarcado",
        },
        {
          headers,
        },
      );
      if (response) {
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };
  const updateRealizedClass = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "realizada",
        },
        {
          headers,
        },
      );
      if (response) {
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  const updateOneTutoring = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoringevent`,
        {
          id: tutoringId,
          studentID: newStudentId || "",
          groupId: newGroupId || "",
          day: weekDay,
          time: timeOfTutoring,
          duration,
          link,
        },
        {
          headers,
        },
      );
      setSeeEditTutoring(false);
      fetchOneSetOfTutorings(newStudentId);
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  const newTutoring = async () => {
    if (endDateForTutoring) {
      const today = new Date();
      const oneMonthFromNow = new Date(today);
      oneMonthFromNow.setMonth(today.getMonth() + 1);

      if (endDateForTutoring < oneMonthFromNow) {
        const endDateFormatted = endDateForTutoring.toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          },
        );

        const confirmMessage = `⚠️ ATENÇÃO: O período selecionado termina em ${endDateFormatted}, que é em menos de 1 mês.\n\nPara períodos curtos, recomendamos:\n• Excluir esta configuração de tutoria recorrente\n• Criar eventos únicos através do botão "Criar Evento"\n\nDeseja continuar mesmo assim?`;

        if (!confirm(confirmMessage)) {
          return;
        }
      }
    }

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/tutoringevent`,
        {
          day: theNewWeekDay,
          time: theNewTimeOfTutoring,
          duration,
          link: theNewLink,
          studentID: newStudentId,
          teacherID: myId,
          groupId: newGroupId,
          numberOfWeeks: numberOfWeeks || 4,
          endDate: endDateForTutoring,
        },
        {
          headers,
        },
      );
      if (response) {
        setSeeEditTutoring(false);
        setShowSeeEditTutoring(false);
        if (newStudentId) {
          fetchOneSetOfTutorings(newStudentId);
        } else if (newGroupId) {
          fetchOneSetOfGroups(newGroupId);
        }
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  function isEventTimeNow(eventTime, hj, date) {
    const [eventHour, eventMinute] = eventTime.time.split(":").map(Number);
    if (
      hj.getDate() == date.getDate() &&
      hj.getMonth() == date.getMonth() &&
      hj.getFullYear() == date.getFullYear() &&
      hj.getHours() == eventHour &&
      hj.getMinutes() >= eventMinute &&
      hj.getMonth() == date.getMonth()
    ) {
      return true;
    }
    return false;
  }

  const deleteTutoring = async (item) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/tutoringevent`,
        {
          data: {
            time: item.time,
            day: item.day,
            id: item.id,
            studentID: newStudentId,
            groupId: newGroupId,
          },
          headers,
        },
      );
      if (response) {
        setSeeEditTutoring(false);
        if (newGroupId) {
          fetchOneSetOfGroups(newGroupId);
        } else {
          fetchOneSetOfTutorings(newStudentId);
        }
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  useEffect(() => {
    if (newStudentId !== "") {
      fetchOneSetOfTutorings(newStudentId);
    }
  }, [newStudentId]);

  useEffect(() => {
    if (newGroupId !== "") {
      fetchOneSetOfGroups(newGroupId);
    }
  }, [newGroupId]);

  const handleSeeModalNew = () => {
    setShowNewClassForm(true);
    fetchStudents();
    setNewClass({
      date: "",
      time: "",
      link: "",
      description: "",
      category: "",
      studentId: "",
    });
  };

  const handleCloseNewClassForm = () => {
    setShowNewClassForm(false);
    setNewClass({
      date: "",
      time: "",
      link: "",
      description: "",
      category: "",
      studentId: "",
    });
  };

  const handleNewClassChange = (field, value) => {
    const updatedClass = {
      ...newClass,
      [field]: value,
    };
    setNewClass(updatedClass);

    const missingFields = [];
    if (!updatedClass.category) missingFields.push("category");
    if (!updatedClass.group) missingFields.push("group");
    if (!updatedClass.date) missingFields.push("date");
    if (!updatedClass.time) missingFields.push("time");
    if (!updatedClass.link) missingFields.push("link");
    if (!updatedClass.description) missingFields.push("description");
  };

  const handleNewClassCategoryChange = (e) => {
    const category = e.target.value;
    let description = "";
    let isTutoringClass = false;

    switch (category) {
      case "Rep":
        description = "Aula de Reposição referente ao dia";
        isTutoringClass = true;
        break;
      case "Standalone":
        description = UniversalTexts.calendarModal.singleClassOf;
        break;
      case "Group Class":
        description = UniversalTexts.calendarModal.classTheme;
        break;
      case "Prize Class":
        isTutoringClass = true;
        break;
      case "Tutoring":
        isTutoringClass = true;
        break;
    }

    const updatedClass = {
      ...newClass,
      category,
      description,
    };

    setNewClass(updatedClass);

    const missingFields = [];
    if (!updatedClass.category) missingFields.push("category");
    if (!updatedClass.date) missingFields.push("date");
    if (!updatedClass.time) missingFields.push("time");
    if (!updatedClass.link) missingFields.push("link");
    if (!updatedClass.description) missingFields.push("description");
  };

  const handleCreateNewClass = async () => {
    setLoadingNewClass(true);
    try {
      const payload = {
        date: newClass.date,
        time: newClass.time,
        link: newClass.link,
        group: newClass.group || "",
        description: newClass.description,
        category: newClass.category,
        duration: newClass.duration || 55,
        studentID: newClass.studentId || null,
        teacherId: myId,
        status: "marcado",
      };

      const response = await axios.post(
        `${backDomain}/api/v1/event/${myId}`,
        payload,
        { headers },
      );

      if (response.status === 200 || response.status === 201) {
        notifyAlert("Aula criada com sucesso!", partnerColor());
        handleCloseNewClassForm();
        loadGeneral(new Date(newClass.date));
      }
    } catch (error) {
      console.log("❌ Erro ao criar nova aula:", error);
      notifyAlert("Erro ao criar aula. Tente novamente.", partnerColor());
    } finally {
      setLoadingNewClass(false);
    }
  };

  const seeEditOneTutoring = (e) => {
    setSeeEditTutoring(true);
    fetchStudents();
    setSeeReplenish(false);
    setTheNewLink("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setTutoringId(e.id);
    setTimeOfTutoring(e.time);
    setLink(e.link);
    setWeekDay(e.day);
    setDuration(e.duration);
  };

  const closeEditOneTutoring = () => {
    setSeeEditTutoring(false);
    setNewStudentId("");
    setSeeReplenish(false);
    setTheTime("");
    setShowClasses(false);
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setWeekDay("");
  };

  const handleCloseModal = (chosenDate) => {
    setSeeReplenish(false);
    setIsVisible(false);
    setNewStudentId("");
    setTheTime("");
    setWeekDay("");
    setTheNewLink("");
    setShowClasses(false);
    setDescription("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setShowEditForm(false);
    clearFile();
    setDueDate(new Date().toISOString().split("T")[0]);
    setFlashcards("");
    loadGeneral(new Date(chosenDate ? chosenDate : new Date()));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      try {
        setUploading(true);
        const base64File = await convertToBase64(file);
        setBase64String(base64File);
        setFileName(file.name);
        setFileType(file.type);
        setUploading(false);
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        setUploading(false);
      }
    } else {
      clearFile();
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);
      const base64File = await convertToBase64(selectedFile);
      setBase64String(base64File);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
      setUploading(false);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setBase64String("");
    setFileName("");
    setFileType("");
  };

  const [dateOfTheWeek, setDateOfTheWeek] = useState(new Date());
  const handleSeeModalOfTutorings = () => {
    setNewStudentId("");
    setSeeReplenish(false);
    setTheTime("");
    setWeekDay("");
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setSeeEditTutoring(false);
    fetchStudents();
    setIsModalOfTutoringsVisible(true);
    setLoadingModalTutoringsInfo(false);
  };

  const handleCloseModalOfTutorings = () => {
    setNewStudentId("");
    setTheTime("");
    setWeekDay("");
    setShowClasses(false);
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setIsModalOfTutoringsVisible(false);
    loadGeneral(new Date(dateOfTheWeek));
  };

  const handleStudentChange = (e) => {
    setNewStudentId(e.target.value);
    setNewGroupId("");
  };

  const handleTheNewWeekDayChange = (e) => {
    setTheNewWeekDay(e.target.value);
  };

  const handleTheNewTimeChange = (e) => {
    setTheNewTimeOfTutoring(e.target.value);
  };
  const [showAIGENERATED, setShowAIGENERATED] = useState(false);

  const handleHomeworkChange = (htmlContent) => {
    setHomework(htmlContent);
  };

  const seeDelete = () => {
    setDeleteVisible(!deleteVisible);
  };
  const [lessonsList, setLessonsList] = useState([]);
  const [theLesson, setTheLesson] = useState(null);
  const [theLessonLast, setTheLessonLast] = useState(null);

  const getClasses = async () => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const { data } = await axios.get(
          `${backDomain}/api/v1/courses-organized/${myId}`,
          { headers },
        );
        const res = data?.lessons ?? [];
        setLessonsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar cursos");
      }
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  const grouped = useMemo(() => {
    const byCourse = {};
    for (const l of lessonsList) {
      const course = l.course ?? "Sem curso";
      const module = l.module ?? "Sem módulo";
      byCourse[course] ||= {};
      byCourse[course][module] ||= [];
      byCourse[course][module].push(l);
    }
    return byCourse;
  }, [lessonsList]); // <<< DEPENDÊNCIAS CORRETAS

  const handleLessonChange = (e) => {
    const id = e.target.value;
    if (!id || id.startsWith("sep:")) return; // segurança extra
    // garanta a comparação como string
    const found = lessonsList.find((l) => String(l.id) === id) || null;
    setTheLesson(found);
  };
  const handleCategoryChange = (e) => {
    setLoadingInfo(true);
    if (e.target.value == "Rep") {
      setLink("");
      setDescription("Aula de Reposição referente ao dia");
      setIsTutoring(true);
    }
    if (e.target.value == "Marcar Reposição") {
      setLink("");
      setDescription("");
      setIsTutoring(false);
    }
    if (e.target.value == "Standalone") {
      setLink("");
      setDescription(UniversalTexts.calendarModal.singleClassOf);
      setIsTutoring(false);
    }
    if (e.target.value == "Group Class") {
      setLink("");
      setDescription(UniversalTexts.calendarModal.classTheme);
      setIsTutoring(false);
    }
    if (e.target.value == "Test") {
      setLink("");
      setDescription("");
      setIsTutoring(false);
    }
    if (e.target.value == "Prize Class") {
      setLink("");
      setDescription("");
      setIsTutoring(true);
    }
    if (e.target.value == "Tutoring") {
      setLink("");
      setDescription("");
      setIsTutoring(true);
    }

    setCategory(e.target.value);
    setLoadingInfo(false);
  };

  const handleWeekDayChange = (e) => {
    setWeekDay(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimeOfTutoring(e.target.value);
  };

  const handleSeeModal = (e) => {
    const checkIfNew = e ? false : true;
    setIsVisible(true);
    setLoadingInfo(true);
    setPostNew(checkIfNew);
    setEventId(e ? e._id : "");
    if (checkIfNew) {
      setLink("");
      setDate("");
      setTheTime("");
      setNewStudentId("");
      setNewGroupId("");
      setDescription("");
      setCategory("");
      setStatus("");
      setLoadingInfo(false);
    } else {
      fetchOneEvent(e._id);
      if (
        e.category == "Standalone" ||
        e.category == "Group Class" ||
        e.category == "Test"
      ) {
        setIsTutoring(false);
      } else if (
        e.category == "Tutoring" ||
        e.category == "Prize Class" ||
        e.category == "Rep"
      ) {
        setIsTutoring(true);
      }
      setLoadingInfo(false);
    }
    if (isVisible) {
      loadGeneral(new Date());
    } else {
      null;
    }
    setDeleteVisible(false);
  };

  const hasEmptySlot = (() => {
    for (let i = 1; i <= 10; i++) {
      const item = task[`checkList${i}`];
      if (!item || !item.description || !item.description.trim()) return true;
    }
    return false;
  })();
  const handleAddChecklistItem = () => {
    const placeholder = "Novo item";

    for (let i = 1; i <= 10; i++) {
      const item = task[`checkList${i}`];

      if (!item || !item.description || !item.description.trim()) {
        updateChecklistTaskDescripton(i, task._id, placeholder);

        setDescriptionChecklistToEdit(placeholder);
        setEditingIndex(i);
        return;
      }
    }
  };

  const handleCheckbox4Change = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventchecklist4/${newEventId}`,
        { headers },
      );
      fetchOneEvent(newEventId);
    } catch (error) {
      console.log(error, "Erro");
    }
  };

  const handleCheckbox5Change = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventchecklist5/${newEventId}`,
        { headers },
      );
      fetchOneEvent(newEventId);
    } catch (error) {
      console.log(error, "Erro");
    }
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    futureDates.push(date);
  }

  const calendarRef = useRef(null);
  const todayRef = useRef(null);

  {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
      const item = task[`checkList${i}`];
      const isEditing = editingIndex === i;
      if (!item || (!item.description && !isEditing)) return null;
      return (
        <li
          key={i}
          style={{
            ...styleLiChecked,
            borderBottom: i < 5 ? "1px solid #eee" : "none",
            background: item.checked ? "#e6fbe8" : "transparent",
          }}
        >
          <input
            type="checkbox"
            checked={item.checked}
            onClick={() => {
              try {
                updateChecklistTask(i, task._id);
              } catch (error) {
                notifyAlert("Erro ao atualizar checklist");
              }
            }}
            style={{
              ...inputCheckBox,
              accentColor: item.checked ? "#22c55e" : "#ddd",
              boxShadow: item.checked ? "0 0 0 2px #22c55e33" : "none",
            }}
          />
          <span
            style={{
              ...spanChecked,
              textDecoration: item.checked ? "line-through" : "none",
              color: item.checked ? "#22c55e" : "#333",
              display: isEditing ? "none" : "block",
            }}
            onClick={() => {
              setEditingIndex(i);
              setDescriptionChecklistToEdit(item.description || "");
            }}
          >
            {item.description}
          </span>
          <input
            type="text"
            value={
              isEditing ? descriptionChecklistToEdit : item.description || ""
            }
            style={{
              textDecoration: item.checked ? "line-through" : "none",
              color: item.checked ? "#22c55e" : "#333",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.2px",
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              display: isEditing ? "block" : "none",
            }}
            onChange={(e) => {
              setDescriptionChecklistToEdit(e.target.value);
              try {
                updateChecklistTaskDescripton(i, task._id, e.target.value);
              } catch (error) {
                notifyAlert("Erro ao editar descrição do checklist");
              }
            }}
            onBlur={() => {
              setEditingIndex(null);
              setDescriptionChecklistToEdit("");
            }}
          />
        </li>
      );
    });
  }
  useEffect(() => {
    if (
      todayRef.current &&
      shouldScrollToToday &&
      calendarRef.current &&
      !loading
    ) {
      const container = calendarRef.current;
      const todayElement = todayRef.current;
      const containerWidth = container.offsetWidth;
      const todayWidth = todayElement.offsetWidth;
      const todayLeft = todayElement.offsetLeft;
      const scrollLeft = todayLeft - containerWidth / 2 + todayWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [loading, futureDates]);

  const formattedDates = (dateString) => {
    const date = new Date(dateString);
    date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
    return new Date(date);
  };

  function newFormatDate(date) {
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    let day = String(d.getDate()).padStart(2, "0");
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let year = d.getFullYear();
    let final = `${day}/${month}/${year}`;
    return final;
  }

  const handleScheduleReplenish = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id } = user;

      const response = await axios.put(
        `${backDomain}/api/v1/scheduleclass/${id}?eventId=${eventId}`,
        {
          headers,
        },
      );
      setShowAIGENERATED(false);
      loadGeneral(new Date());
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const updateChecklistTask = async (index, taskID) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id } = user;
      const response = await axios.put(
        `${backDomain}/api/v1/todochecklist/${id}?todoId=${taskID}&checkList=${index}`,
        {
          headers,
        },
      );
      setShowAIGENERATED(false);
      fetchTodo(taskID);
    } catch (error) {
      console.error(error);
    }
  };
  const updateChecklistTaskDescripton = async (index, taskID, desc) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id } = user;
      const response = await axios.put(
        `${backDomain}/api/v1/todochecklistname/${id}?todoId=${taskID}&checkList=${index}&newDescription=${desc}`,
        {
          headers,
        },
      );
      fetchTodo(taskID);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateInfoTask = async (taskID) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id } = user;
      const response = await axios.put(
        `${backDomain}/api/v1/todo/${id}?todoId=${taskID}`,
        {
          description: editDescription,
          category: editCategory,
          date: editDate,
        },
        {
          headers,
        },
      );
      setSeeEditTutoring(false);
      setSeeReplenish(false);
      setShowEditSection(false);
      loadGeneral(new Date(editDate));
    } catch (error) {
      console.error(error);
    }
  };
  const [showDeleteEventConfirmation, setShowDeleteEventConfirmation] =
    useState(false);
  const handleDeleteTask = async (taskID) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id } = user;

      const response = await axios.delete(
        `${backDomain}/api/v1/todo/${id}?todoId=${taskID}`,
        {
          headers,
        },
      );
      setSeeEditTutoring(false);
      setSeeReplenish(false);
      setShowEditSection(false);
      setShowDeleteEventConfirmation(false);
      loadGeneral(new Date());
    } catch (error) {
      console.error(error);
    }
  };

  const authorizeOrNot =
    thePermissions === "superadmin" || thePermissions === "teacher";

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
            }}
          >
            <span style={newArvinTitleStyle}>Calendário</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
        }}
      >
        {headers ? (
          <div
            style={{
              margin: "16px auto",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              display: "grid",
              flexDirection: "column",
              fontSize: "14px",
              padding: isDesktop ? "1rem" : "5px 1rem ",
              minWidth: 0, // 👈 esse cara é o pai direto do calendário
            }}
          >
            {loading ? (
              <CircularProgress style={{ color: partnerColor() }} />
            ) : (
              <div
                ref={calendarRef}
                onScroll={() => {
                  setShouldScrollToToday(false);
                }}
                style={{
                  display: !isVisible ? "grid" : "none",
                  overflowX: "auto",
                  gridTemplateColumns: `repeat(${futureDates.length}, minmax(200px, 1fr))`,
                  gap: "8px",
                  scrollbarColor: `${partnerColor()} transparent`,
                  // padding: "8px 4px 4px",
                  // maxWidth: "100%",
                  // width: "100%",
                  // boxSizing: "border-box",
                  // flex: "1 1 auto",
                  // minWidth: 0,
                  // scrollbarWidth: "thin",
                  // scrollbarColor: `${partnerColor()} transparent`,
                }}
              >
                {futureDates.map((date, index) => {
                  const hj = new Date();
                  const isToday =
                    hj.getDate() === date.getDate() &&
                    hj.getMonth() === date.getMonth() &&
                    hj.getFullYear() === date.getFullYear();

                  return (
                    <article
                      className={isToday ? "glowing" : "none"}
                      ref={isToday ? todayRef : null}
                      style={{
                        maxHeight: "65vh",
                        overflowY: "auto",
                        marginRight: "12px",
                        fontSize: "10px",
                        border: isToday
                          ? `3px solid ${partnerColor()}`
                          : "1px solid #e0e0e0",
                        borderRadius: "6px",
                        backgroundColor: isToday ? "rgba(0,0,0,0.02)" : "white",
                        boxShadow: isToday
                          ? `0 8px 25px rgba(0,0,0,0.15), 0 0 0 1px ${partnerColor()}20`
                          : "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        minWidth: "150px",
                      }}
                      key={index}
                    >
                      <div
                        style={{
                          padding: "6px",
                          position: "sticky",
                          zIndex: 1,
                          top: 0,
                          fontWeight: 700,
                          textAlign: "center",
                          background: isToday
                            ? partnerColor()
                            : "linear-gradient(135deg, #111, #555)",
                          color: alwaysWhite(),
                          marginBottom: "5px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        <p
                          style={{
                            marginBottom: "2px",
                          }}
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </p>
                        <p>
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div>
                        {todoList && todoList.length > 0 && (
                          <div style={{ margin: "8px 4px" }}>
                            {todoList
                              .filter(
                                (event) =>
                                  event.date.toDateString() ===
                                  date.toDateString(),
                              )
                              .map((todo, idx) => (
                                <div
                                  key={todo._id || idx}
                                  onClick={() => {
                                    fetchTodo(todo._id);
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "2px",
                                    cursor: "pointer",
                                    backgroundColor:
                                      todo.category == "personal"
                                        ? "rgba(215, 192, 192, 0.7)"
                                        : todo.category == "finance"
                                          ? "rgba(234, 215, 191, 0.7)"
                                          : todo.category == "work"
                                            ? "rgba(234, 234, 191, 0.7)"
                                            : todo.category == "study"
                                              ? "rgba(215, 234, 191, 0.7)"
                                              : todo.category == "health"
                                                ? "rgba(191, 234, 212, 0.7)"
                                                : todo.category == "family"
                                                  ? "rgba(191, 201, 234, 0.7)"
                                                  : todo.category == "other"
                                                    ? "rgba(216, 191, 234, 0.7)"
                                                    : "rgba(234, 191, 215, 0.7)",
                                    borderRadius: "6px",
                                    padding: "5px",
                                    boxShadow: "0 1px 2px #b8b8b8ff",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                    }}
                                  >
                                    {todo.description &&
                                      truncateString(todo.description, 5)}
                                  </span>
                                  <span
                                    style={{
                                      display: "flex",
                                      gap: "4px",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                      (i) => {
                                        const check = todo[`checkList${i}`];
                                        if (!check || !check.description)
                                          return null;
                                        return (
                                          <span
                                            key={i}
                                            title={check.description}
                                            style={{
                                              display: "inline-block",
                                              width: "8px",
                                              height: "8px",
                                              borderRadius: "50%",
                                              background: check.checked
                                                ? "#22c55e"
                                                : "#ddd",
                                              border: "1px solid #bbb",
                                            }}
                                          />
                                        );
                                      },
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "5px" }}>
                        {events
                          .filter(
                            (event) =>
                              event.date.toDateString() === date.toDateString(),
                          )
                          .sort((a, b) => {
                            const timeA =
                              parseInt(a.time.split(":")[0]) * 60 +
                              parseInt(a.time.split(":")[1]);
                            const timeB =
                              parseInt(b.time.split(":")[0]) * 60 +
                              parseInt(b.time.split(":")[1]);
                            return timeA - timeB;
                          })
                          .map((event, eventIndex) => {
                            const categoryColors = {
                              "Group Class": {
                                bg: "#614338ff",
                                text: "#fff",
                              },
                              "Established Group Class": {
                                bg: "#003f7eff",
                                text: "#fff",
                              },
                              Rep: { bg: "grey", text: "#fff" },
                              Tutoring: { bg: "#1e007eff", text: "#fff" },
                              "Prize Class": { bg: "#27ae60", text: "#fff" },
                              Standalone: { bg: "#48145fff", text: "#fff" },
                              Test: { bg: "#34495e", text: "#fff" },
                              "Marcar Reposição": {
                                bg: "#2a7db4ff",
                                text: "#fff",
                              },
                            };

                            const statusColors = {
                              desmarcado: {
                                bg: "#ffebee",
                                text: "#c62828",
                                border: "#ef5350",
                              },
                              marcado: {
                                bg: "#e3f2fd",
                                text: "#1565c0",
                                border: "#42a5f5",
                              },
                              realizada: {
                                bg: "#e8f5e8",
                                text: "#2e7d32",
                                border: "#66bb6a",
                              },
                            };
                            const categoryColor = categoryColors[
                              event.category
                            ] || { bg: "#000", text: "#fff" };
                            const statusColor = statusColors[event.status] || {
                              bg: "#f5f5f5",
                              text: "#333",
                              border: "#ddd",
                            };
                            return (
                              <div
                                key={`${event._id}-${eventIndex}`}
                                role="button"
                                tabIndex={0}
                                style={{
                                  marginBottom: "5px",
                                  textDecoration: "none",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  transition: "all 0.2s ease",
                                  cursor: "pointer",
                                  border: `1px solid ${statusColor.border}`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow =
                                    "0 2px 8px rgba(0,0,0,0.1)";
                                }}
                                onClick={() => handleOpenEventPreview(event)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ")
                                    handleOpenEventPreview(event);
                                }}
                              >
                                {/* Live Event Indicator */}
                                {event.status !== "desmarcado" &&
                                  isEventTimeNowConsideringDuration(
                                    event,
                                    hj,
                                    date,
                                    event.duration,
                                  ) && (
                                    <div
                                      style={{
                                        background: "green",
                                        padding: "2px",
                                        position: "relative",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "white",
                                          fontWeight: "600",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: "6px",
                                            height: "6px",
                                            backgroundColor: "white",
                                            borderRadius: "6px",
                                            marginRight: "5px",
                                            animation: "pulse 2s infinite",
                                          }}
                                        />
                                        Live Now
                                      </div>
                                    </div>
                                  )}
                                <div
                                  style={{
                                    background: categoryColor.bg,
                                    color: categoryColor.text,
                                    padding: "5px",
                                    position: "relative",
                                    paddingBottom: `${event.duration / 5}px`,
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      backgroundColor: "rgba(255,255,255,0.2)",
                                      color: categoryColor.text,
                                      padding: "2px 5px",
                                      borderRadius: "6px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.3px",
                                    }}
                                  >
                                    <i className="fa fa-clock-o" style={{}} />

                                    {formatTimeRange(
                                      event.time,
                                      event.duration,
                                    )}
                                  </div>

                                  {/* Event Title/Description */}
                                  <div
                                    style={{
                                      fontWeight: "600",
                                      marginBottom: "5px",
                                      lineHeight: "1.3",
                                      paddingRight: "4rem",
                                    }}
                                  >
                                    {event.groupName
                                      ? truncateString(event.groupName, 11)
                                      : event.student
                                        ? truncateString(event.student, 11)
                                        : event.description
                                          ? truncateString(
                                              event.description,
                                              10,
                                            )
                                          : event.category ===
                                              "Marcar Reposição"
                                            ? "Disponível"
                                            : event.category == "Rep"
                                              ? "Reposição"
                                              : event.category == "Standalone"
                                                ? "Aula Única"
                                                : event.category == "Test"
                                                  ? "Experimental"
                                                  : event.category}
                                  </div>
                                </div>

                                {/* Status Footer */}
                                <div
                                  style={{
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.text,
                                    padding: "5px 5px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    borderTop: `1px solid ${statusColor.border}`,
                                  }}
                                >
                                  {(event.status === "desmarcado" ||
                                    event.status === "Canceled") && (
                                    <>
                                      <i
                                        className="fa fa-times-circle"
                                        style={{ marginRight: "2px" }}
                                      />
                                      {categoryList.find(
                                        (cat) => cat.value === event.category,
                                      )?.text || event.category}
                                    </>
                                  )}
                                  {(event.status === "marcado" ||
                                    event.status === "Scheduled") && (
                                    <>
                                      <i
                                        className="fa fa-calendar-check-o"
                                        style={{ marginRight: "2px" }}
                                      />
                                      {categoryList.find(
                                        (cat) => cat.value === event.category,
                                      )?.text || event.category}
                                    </>
                                  )}
                                  {(event.status === "realizada" ||
                                    event.status === "Completed") && (
                                    <>
                                      <i
                                        className="fa fa-check-circle"
                                        style={{ marginRight: "2px" }}
                                      />

                                      {categoryList.find(
                                        (cat) => cat.value === event.category,
                                      )?.text || event.category}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                        {/* Empty State */}
                        {events.filter(
                          (event) =>
                            event.date.toDateString() === date.toDateString(),
                        ).length === 0 && (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "2rem 1rem",
                              color: "#94a3b8",
                            }}
                          >
                            <i
                              className="fa fa-calendar-o"
                              style={{
                                marginBottom: "5px",
                                display: "block",
                              }}
                            />
                            No events scheduled
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {/* Nova Seção: Criar Nova Aula */}

            <NewClassModal
              showNewClassForm={showNewClassForm}
              loadingNewClass={loadingNewClass}
              newClass={newClass}
              categoryList={categoryList}
              studentsList={studentsList}
              groupsList={groupsList}
              handleCloseNewClassForm={handleCloseNewClassForm}
              handleCreateNewClass={handleCreateNewClass}
              handleNewClassChange={handleNewClassChange}
              handleNewClassCategoryChange={handleNewClassCategoryChange}
              partnerColor={partnerColor}
              alwaysWhite={alwaysWhite}
              transparentWhite={transparentWhite}
              HTwo={HTwo}
            />

            <TodoModal
              open={modalEditTodo}
              task={task}
              onClose={() => loadGeneral(new Date(task.date))}
              showEditSection={showEditSection}
              setShowEditSection={setShowEditSection}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              editDate={editDate}
              setEditDate={setEditDate}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              showDeleteEventConfirmation={showDeleteEventConfirmation}
              setShowDeleteEventConfirmation={setShowDeleteEventConfirmation}
              editingIndex={editingIndex}
              setEditingIndex={setEditingIndex}
              descriptionChecklistToEdit={descriptionChecklistToEdit}
              setDescriptionChecklistToEdit={setDescriptionChecklistToEdit}
              hasEmptySlot={hasEmptySlot}
              onUpdateTask={(id) => handleUpdateInfoTask(id)}
              onDeleteTask={(id) => handleDeleteTask(id)}
              onToggleChecklist={(i, id) => updateChecklistTask(i, id)}
              onSaveChecklistDescription={(i, id, value) =>
                updateChecklistTaskDescripton(i, id, value)
              }
              onAddChecklistItem={handleAddChecklistItem}
              UniversalTexts={UniversalTexts}
              partnerColor={partnerColor}
              textpartnerColorContrast={textpartnerColorContrast}
              HTwo={HTwo}
            />
            {!isVisible && (
              <div
                style={{
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      padding: "2px",
                    }}
                  >
                    <button
                      disabled={!disabledAvoid}
                      style={{
                        width: "28px",
                        height: "28px",
                        background: !disabledAvoid ? "#e9ecef" : "#ffffff",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        color: !disabledAvoid ? "#adb5bd" : "#495057",
                        cursor: !disabledAvoid ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                        fontSize: "12px",
                      }}
                      onClick={() => handleChangeWeek(-7)}
                    >
                      <i className="fa fa-chevron-left" />
                    </button>

                    <div
                      style={{
                        padding: "0 12px",
                        fontWeight: "500",
                        color: "#495057",
                        fontSize: "13px",
                        minWidth: "80px",
                        textAlign: "center",
                      }}
                    >
                      {today.toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <button
                      disabled={!disabledAvoid}
                      style={{
                        width: "28px",
                        height: "28px",
                        background: !disabledAvoid ? "#e9ecef" : "#ffffff",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        color: !disabledAvoid ? "#adb5bd" : "#495057",
                        cursor: !disabledAvoid ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                        fontSize: "12px",
                      }}
                      onClick={() => handleChangeWeek(7)}
                    >
                      <i className="fa fa-chevron-right" />
                    </button>
                  </div>

                  {/* Seletor de Data - Minimalista */}

                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef",
                      overflow: "hidden",
                    }}
                  >
                    <input
                      type="date"
                      onChange={handleDateChange}
                      value={today.toISOString().split("T")[0]}
                      disabled={loading}
                      style={{
                        padding: "6px 32px 6px 10px",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        fontWeight: "400",
                        color: loading ? "#adb5bd" : "#495057",
                        backgroundColor: "transparent",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                      }}
                    />
                  </div>

                  {!isVisible && (
                    <div style={{ display: "grid", gap: "5px" }}>
                      {/* Ações rápidas - Compactas */}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isDesktop
                            ? "auto auto auto auto"
                            : "auto auto",
                          gridAutoFlow: isDesktop ? "column" : "row",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        {/* Botão Hoje */}
                        {authorizeOrNot && (
                          <NewRecurringEventCalendar
                            setAlternateBoolean={setAlternateBoolean}
                            alternateBoolean={alternateBoolean}
                            headers={headers}
                            myId={myId}
                            setChange={setChange}
                            change={change}
                          />
                        )}

                        <button
                          disabled={!disabledAvoid}
                          onClick={() => {
                            loadGeneral(new Date());
                          }}
                        >
                          <i
                            className="fa fa-refresh"
                            style={{ fontSize: "10px" }}
                          />

                          <span>{UniversalTexts.calendarModal.today}</span>
                        </button>

                        {/* Botão Recorrentes */}

                        {authorizeOrNot && (
                          <ToDoAddButton
                            userId={myId}
                            onCreated={() => {
                              setAlternateBoolean(!alternateBoolean);
                            }}
                          />
                        )}

                        {/* Botão Nova Aula */}

                        {authorizeOrNot && (
                          <button
                            onClick={() => {
                              handleSeeModalNew();
                              setSeePlusButtons(false);
                            }}
                          >
                            +
                            <span>
                              {UniversalTexts.calendarModal.singleClass}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <RouteSizeControlBox>
            {UniversalTexts.calendarModal.noLoggedUser}
          </RouteSizeControlBox>
        )}
        <Helmets text="Calendar" />
      </div>
      {selectedEvent && (
        <EventPreviewModal
          event={selectedEvent}
          onClose={handleCloseEventPreview}
        />
      )}
    </div>
  );
}

export default MyCalendar;
