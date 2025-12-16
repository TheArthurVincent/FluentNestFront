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
    new Date().toISOString().split("T")[0]
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
          { headers }
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
  const handleHWDescription = async () => {
    setLoadingHWDescription(true);
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description-hw/${myId}`,
          { homework },
          { headers }
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
          { headers }
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
          { headers }
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
          { headers }
        );
        setTask(response.data.todo);
        setModalEditTodo(true);
      } catch (error) {
        console.log(error, "Erro ao encontrar alunos");
      }
    }
  };
  // const [isFee, setIsFee] = useState(true);
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
        { headers, params: { today: monday } }
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
        }))
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
          response.data.event.recentUnmarkedEvents[0].theLesson || []
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
          }
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
        }
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
        }
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
        { headers }
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
          { headers }
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
        { headers }
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
        { headers }
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
        }
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
        }
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
        }
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
        }
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
        }
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
          borderRadius: "12px",
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
                        borderRadius: "4px",
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
                                  date.toDateString()
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
                                    borderRadius: "4px",
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
                                      }
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
                              event.date.toDateString() === date.toDateString()
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
                              <a
                                key={`${event._id}-${eventIndex}`}
                                style={{
                                  marginBottom: "5px",
                                  textDecoration: "none",
                                  borderRadius: "4px",
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
                                // onClick={() => handleSeeModal(event)}
                                // onClick={() => {
                                //   window.location.assign(
                                //     `my-calendar/event/${event._id}`
                                //   );
                                // }}
                                href={`my-calendar/event/${event._id}`}
                              >
                                {/* Live Event Indicator */}
                                {event.status !== "desmarcado" &&
                                  isEventTimeNowConsideringDuration(
                                    event,
                                    hj,
                                    date,
                                    event.duration
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
                                            borderRadius: "4px",
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
                                      borderRadius: "4px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.3px",
                                    }}
                                  >
                                    <i className="fa fa-clock-o" style={{}} />

                                    {formatTimeRange(
                                      event.time,
                                      event.duration
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
                                      ? truncateString(event.description, 10)
                                      : "No description"}
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
                                        (cat) => cat.value === event.category
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
                                        (cat) => cat.value === event.category
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
                                        (cat) => cat.value === event.category
                                      )?.text || event.category}
                                    </>
                                  )}
                                </div>
                              </a>
                            );
                          })}

                        {/* Empty State */}
                        {events.filter(
                          (event) =>
                            event.date.toDateString() === date.toDateString()
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
            <>
              <div
                style={{
                  backgroundColor: transparentWhite(),
                  width: "10000px",
                  height: "10000px",
                  top: "0",
                  left: "0",
                  position: "fixed",
                  zIndex: 99,
                  display: showNewClassForm ? "block" : "none",
                }}
                onClick={handleCloseNewClassForm}
              />
              <div
                className="modal box-shadow-white"
                style={{
                  position: "fixed",
                  display: showNewClassForm ? "block" : "none",
                  zIndex: 100,
                  backgroundColor: alwaysWhite(),
                  width: "90vw",
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                {loadingNewClass ? (
                  <div style={{ textAlign: "center", padding: "3rem" }}>
                    <CircularProgress style={{ color: partnerColor() }} />
                    <p style={{ marginTop: "1rem", color: "#666" }}>
                      Criando nova aula...
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: "2rem" }}>
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "2rem",
                        paddingBottom: "1rem",
                        borderBottom: "2px solid #e9ecef",
                      }}
                    >
                      <HTwo
                        style={{
                          margin: 0,
                          color: partnerColor(),
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <i className="fa fa-plus-circle" />
                        Criar Nova Aula
                      </HTwo>
                      <button
                        onClick={handleCloseNewClassForm}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1rem",
                          color: "#998",
                          cursor: "pointer",
                          padding: "0.5rem",
                          borderRadius: "50%",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                          e.target.style.color = partnerColor();
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#998";
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Form */}
                    <div
                      style={{
                        display: "grid",
                        gap: "1rem",
                      }}
                    >
                      {/* Categoria */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#495057",
                            fontSize: "0.9rem",
                          }}
                        >
                          📋 Categoria da Aula
                        </label>
                        <select
                          value={newClass.category}
                          onChange={handleNewClassCategoryChange}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                            backgroundColor: "white",
                          }}
                        >
                          <option value="" hidden>
                            Selecione a categoria...
                          </option>
                          {categoryList.map((cat, index) => (
                            <option key={index} value={cat.value}>
                              {cat.text}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Student Selection (if tutoring) */}
                      {(newClass.category === "Tutoring" ||
                        newClass.category === "Prize Class" ||
                        newClass.category === "Rep") && (
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "0.5rem",
                              fontWeight: "600",
                              color: "#495057",
                              fontSize: "0.9rem",
                            }}
                          >
                            👤 Selecionar Aluno
                          </label>
                          <select
                            value={newClass.studentId}
                            onChange={(e) =>
                              handleNewClassChange("studentId", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "4px",
                              border: "1px solid #ced4da",
                              fontSize: "0.9rem",
                              backgroundColor: "white",
                            }}
                          >
                            <option value="" hidden>
                              Selecione o aluno...
                            </option>
                            {studentsList.map((student, index) => (
                              <option key={index} value={student.id}>
                                {student.name} {student.lastname}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* Student Selection (if tutoring) */}
                      {newClass.category === "Established Group Class" && (
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "0.5rem",
                              fontWeight: "600",
                              color: "#495057",
                              fontSize: "0.9rem",
                            }}
                          >
                            👤 Selecionar Grupo
                          </label>
                          <select
                            value={newClass.group}
                            onChange={(e) =>
                              handleNewClassChange("group", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "4px",
                              border: "1px solid #ced4da",
                              fontSize: "0.9rem",
                              backgroundColor: "white",
                            }}
                          >
                            <option value="" hidden>
                              Selecione o grupo...
                            </option>
                            {groupsList.map((group, index) => (
                              <option key={index} value={group._id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Data e Hora */}

                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#495057",
                            fontSize: "0.9rem",
                          }}
                        >
                          📅 Data
                        </label>
                        <input
                          type="date"
                          value={newClass.date}
                          onChange={(e) =>
                            handleNewClassChange("date", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#495057",
                            fontSize: "0.9rem",
                          }}
                        >
                          ⏰ Horário
                        </label>
                        <input
                          type="time"
                          value={newClass.time}
                          onChange={(e) =>
                            handleNewClassChange("time", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.3rem",
                            fontWeight: "500",
                            color: "#6c757d",
                            fontSize: "0.8rem",
                          }}
                        >
                          Duração
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.25rem",
                            marginBottom: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {[30, 45, 60, 90, 120].map((minutes) => (
                            <button
                              key={minutes}
                              type="button"
                              onClick={() =>
                                handleNewClassChange("duration", minutes)
                              }
                              style={{
                                padding: "0.25rem 0.5rem",
                                border: `1px solid ${
                                  newClass.duration == minutes
                                    ? "#adb5bd"
                                    : "#e9ecef"
                                }`,
                                backgroundColor:
                                  newClass.duration == minutes
                                    ? "#f8f9fa"
                                    : "white",
                                color:
                                  newClass.duration == minutes
                                    ? "#495057"
                                    : "#6c757d",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: "400",
                                transition: "all 0.15s ease",
                                minWidth: "auto",
                              }}
                            >
                              {minutes < 60
                                ? `${minutes}min`
                                : `${minutes / 60}h${
                                    minutes % 60 ? ` ${minutes % 60}min` : ""
                                  }`}
                            </button>
                          ))}
                          <input
                            type="number"
                            value={newClass.duration}
                            onChange={(e) =>
                              handleNewClassChange(
                                "duration",
                                parseInt(e.target.value) || 60
                              )
                            }
                            min="15"
                            max="240"
                            style={{
                              width: "50px",
                              padding: "0.25rem",
                              borderRadius: "4px",
                              border: "1px solid #e9ecef",
                              fontSize: "0.75rem",
                              textAlign: "center",
                              marginLeft: "0.25rem",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#adb5bd",
                              alignSelf: "center",
                            }}
                          >
                            min
                          </span>
                        </div>
                      </div>
                      {/* Link */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#495057",
                            fontSize: "0.9rem",
                          }}
                        >
                          🔗 Link da Reunião
                        </label>
                        <input
                          type="url"
                          value={newClass.link}
                          onChange={(e) =>
                            handleNewClassChange("link", e.target.value)
                          }
                          placeholder="https://meet.google.com/..."
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                          }}
                          required
                        />
                      </div>

                      {/* Descrição */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#495057",
                            fontSize: "0.9rem",
                          }}
                        >
                          📝 Descrição da Aula
                        </label>
                        <input
                          type="text"
                          value={newClass.description}
                          onChange={(e) =>
                            handleNewClassChange("description", e.target.value)
                          }
                          placeholder="Descreva o conteúdo da aula..."
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                          }}
                          required
                        />
                      </div>

                      {/* Botões */}
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "flex-end",
                          paddingTop: "1rem",
                          borderTop: "1px solid #e9ecef",
                        }}
                      >
                        <button
                          onClick={handleCloseNewClassForm}
                          style={{
                            padding: "0.75rem 1rem",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i
                            className="fa fa-times"
                            style={{ marginRight: "0.5rem" }}
                          />
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleCreateNewClass();
                          }}
                          disabled={
                            !newClass.category ||
                            !newClass.date ||
                            !newClass.time ||
                            !newClass.link ||
                            !newClass.description
                          }
                          style={{
                            padding: "0.75rem 1rem",
                            backgroundColor: partnerColor(),
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor:
                              !newClass.category ||
                              !newClass.date ||
                              !newClass.time ||
                              !newClass.link ||
                              !newClass.description
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            opacity:
                              !newClass.category ||
                              !newClass.date ||
                              !newClass.time ||
                              !newClass.link ||
                              !newClass.description
                                ? 0.6
                                : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i
                            className="fa fa-plus"
                            style={{ marginRight: "0.5rem" }}
                          />
                          Criar Aula
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>

            {modalEditTodo && (
              <div
                className="todo-modal"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  zIndex: 2000,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  loadGeneral(new Date(task.date));
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "#fff",
                    borderRadius: "4px",
                    boxShadow: "0 8px 32px #0002",
                    minWidth: "340px",
                    maxWidth: "95vw",
                    padding: "1rem",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => {
                      loadGeneral(new Date(task.date));
                    }}
                    style={{
                      position: "absolute",
                      top: "18px",
                      right: "18px",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "900",
                      transition: "background 0.2s",
                    }}
                    title="Fechar"
                  >
                    ×
                  </button>
                  <HTwo>{task.description || "ToDo"}</HTwo>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#f3f4f6",
                        color: "#555",
                        borderRadius: "4px",
                        padding: "4px 12px",
                        fontWeight: 500,
                      }}
                    >
                      {task.category}
                    </span>
                    <span
                      style={{
                        background: "#f3f4f6",
                        color: "#555",
                        borderRadius: "4px",
                        padding: "4px 12px",
                        fontWeight: 500,
                      }}
                    >
                      {task.date}
                    </span>
                    <button
                      onClick={() => {
                        setEditCategory(task.category);
                        setEditDate(task.date);
                        setEditDescription(task.description);
                        setShowEditSection(true);
                      }}
                      style={{
                        background: partnerColor(),
                        color: textpartnerColorContrast(),
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 16px",
                        fontWeight: 600,
                        marginLeft: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {UniversalTexts.edit}
                    </button>
                  </div>
                  <div>
                    {showEditSection && (
                      <div
                        style={{
                          marginTop: "1rem",
                          background: "#f6f6f6",
                          borderRadius: "4px",
                          padding: "1rem",
                          boxShadow: "0 2px 8px #0001",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          maxWidth: "320px",
                        }}
                      >
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Descrição"
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        >
                          <option value="">Selecione a categoria</option>
                          <option value="personal">Vida pessoal</option>
                          <option value="finance">Financeiro</option>
                          <option value="work">Trabalho</option>
                          <option value="study">Estudos</option>
                          <option value="health">Saúde</option>
                          <option value="family">Família</option>
                          <option value="other">Outro</option>
                        </select>
                        {!showDeleteEventConfirmation && (
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              justifyContent: "flex-end",
                              marginTop: "10px",
                            }}
                          >
                            <button
                              onClick={() => {
                                setShowDeleteEventConfirmation(true);
                              }}
                              style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 16px",
                                fontWeight: 600,
                              }}
                            >
                              {UniversalTexts.delete}
                            </button>

                            <button
                              onClick={() => setShowEditSection(false)}
                              style={{
                                background: "#eee",
                                color: "#333",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 16px",
                                fontWeight: 500,
                              }}
                            >
                              {UniversalTexts.cancel}
                            </button>

                            <button
                              onClick={() => {
                                handleUpdateInfoTask(task._id);
                              }}
                              style={{
                                background: partnerColor(),
                                color: textpartnerColorContrast(),
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 16px",
                                fontWeight: 600,
                              }}
                            >
                              {UniversalTexts.save}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: showDeleteEventConfirmation ? "block" : "none",
                      background: "#f9fafb",
                      borderRadius: "4px",
                      padding: "12px 16px",
                      boxShadow: "0 2px 8px #0001",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {UniversalTexts.deleteConfirm}
                    <div
                      style={{
                        display: "flex",
                        margin: "2px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowDeleteEventConfirmation(false);
                        }}
                        style={{
                          background: "blue",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 16px",
                          fontWeight: 600,
                        }}
                      >
                        {UniversalTexts.cancel}
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteTask(task._id);
                        }}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 16px",
                          fontWeight: 600,
                        }}
                      >
                        {UniversalTexts.delete}
                      </button>
                    </div>
                  </div>
                  <div style={{ marginBottom: "1.2rem" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "1.05rem",
                      }}
                    >
                      Checklist
                    </span>

                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "10px 0 0 0",
                        background: "#f9fafb",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px #0001",
                        border: "1px solid #e5e7eb",
                        maxWidth: "320px",
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                        const item = task[`checkList${i}`];
                        const isEditing = editingIndex === i;
                        if (!item || (!item.description && !isEditing)) {
                          return null;
                        }
                        return (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 12px",
                              borderBottom: i < 5 ? "1px solid #eee" : "none",
                              transition: "background 0.2s",
                              background: item.checked
                                ? "#e6fbe8"
                                : "transparent",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => updateChecklistTask(i, task._id)}
                              style={{
                                accentColor: item.checked ? "#22c55e" : "#ddd",
                                width: "15px",
                                height: "15px",
                                marginRight: "12px",
                                cursor: "pointer",
                                boxShadow: item.checked
                                  ? "0 0 0 2px #22c55e33"
                                  : "none",
                              }}
                            />

                            {!isEditing ? (
                              <span
                                onClick={() => {
                                  setEditingIndex(i);
                                  setDescriptionChecklistToEdit(
                                    item.description || ""
                                  );
                                }}
                              >
                                {item.description}
                              </span>
                            ) : (
                              <span>
                                <input
                                  type="text"
                                  value={descriptionChecklistToEdit}
                                  autoFocus
                                  onChange={(e) =>
                                    setDescriptionChecklistToEdit(
                                      e.target.value
                                    )
                                  }
                                  onBlur={() => {
                                    const value =
                                      descriptionChecklistToEdit.trim();
                                    updateChecklistTaskDescripton(
                                      i,
                                      task._id,
                                      value
                                    );
                                    setEditingIndex(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      e.currentTarget.blur();
                                    if (e.key === "Escape") {
                                      setDescriptionChecklistToEdit(
                                        item.description || ""
                                      );
                                      setEditingIndex(null);
                                    }
                                  }}
                                />
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {hasEmptySlot && (
                      <button
                        type="button"
                        onClick={handleAddChecklistItem}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          boxShadow: "0 1px 3px #0001",
                          cursor: "pointer",
                          marginTop: 8,
                        }}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!isVisible && (
              <div
                style={{
                  marginBottom: "1rem",
                  borderRadius: "4px",
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
                      borderRadius: "4px",
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
                        borderRadius: "4px",
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
                        borderRadius: "4px",
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
                      borderRadius: "4px",
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
                          <NewRecurringEventCalendar
                            setAlternateBoolean={setAlternateBoolean}
                            alternateBoolean={alternateBoolean}
                            headers={headers}
                            myId={myId}
                            setChange={setChange}
                            change={change}
                          />
                        )}

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
    </div>
  );
}

export default MyCalendar;
