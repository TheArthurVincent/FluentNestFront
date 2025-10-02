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
  textGeneralFont,
  textpartnerColorContrast,
  textPrimaryColorContrast,
  textTitleFont,
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
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFuncions";
import ToDoAddButton from "./CalendarComponents/ToDo/ToDoNew";
import {
  containerPlus,
  inputCheckBox,
  recurrentButton,
  singleClassButton,
  spanChecked,
  styleLiChecked,
  updateButton,
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFuncions.Styles";
import { display, fontSize } from "@mui/system";
import NewEventCalendar from "./CalendarComponents/NewEventCalendar/NewEventCalendar";
import { isLocalHost } from "../../App";
import NewRecurringEventCalendar from "./CalendarComponents/NewRecurringEventCalendar/NewRecurringEventCalendar";

function MyCalendarRefactor({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
}) {
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
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [tutoringId, setTutoringId] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] = useState("");
  const [eventId, setEventId] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
  const [endDateForTutoring, setEndDateForTutoring] = useState(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState(4);

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
    setEventId("");
    setTheNewLink("");
    setNumberOfWeeks(4);
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
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingHWDescription, setLoadingHWDescription] = useState(false);

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
        console.log(error, "Erro ao encontrar grupos");
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
  const [isFee, setIsFee] = useState(true);
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
    setShouldScrollToToday(!!baseDate === false); // opcional

    try {
      // Usuário + mensalidade
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id, feeUpToDate } = user;
      updateInfo(id, headers);
      setIsFee(!!feeUpToDate);
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
      console.log(response.data.event);
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

  useEffect(() => {
    fetchStudents();
  }, [change]);

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
    fetchStudents();
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
    <>
      {headers ? (
        <RouteDiv
          style={{
            width: "96vw",
          }}
        >
          <div>
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
                    borderRadius: "6px",
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
                      gap: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#f3f4f6",
                        color: "#555",
                        borderRadius: "6px",
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
                        borderRadius: "6px",
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
                        borderRadius: "6px",
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
                          borderRadius: "6px",
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
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
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
                                borderRadius: "6px",
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
                                borderRadius: "6px",
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
                                borderRadius: "6px",
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
                      borderRadius: "6px",
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
                          borderRadius: "6px",
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
                          borderRadius: "6px",
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
                        borderRadius: "6px",
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
            <HOne>{UniversalTexts.calendar}</HOne>
            {loading ? (
              <CircularProgress style={{ color: partnerColor() }} />
            ) : (
              <div
                ref={calendarRef}
                onScroll={() => {
                  setShouldScrollToToday(false);
                }}
                style={{
                  display: "flex",
                  gap: "5px",
                  overflowX: "auto",
                  padding: "1rem 0",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${partnerColor()} transparent`,
                }}
              >
                {futureDates.map((date, index) => {
                  const hj = new Date();
                  const isToday =
                    hj.getDate() === date.getDate() &&
                    hj.getMonth() === date.getMonth() &&
                    hj.getFullYear() === date.getFullYear();

                  return (
                    <StyledDiv
                      className={isToday ? "glowing" : "none"}
                      ref={isToday ? todayRef : null}
                      style={{
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
                        minWidth: "200px",
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
                          fontFamily: textGeneralFont(),
                          background: isToday
                            ? partnerColor()
                            : "linear-gradient(135deg, #111, #555)",
                          color: alwaysWhite(),
                          marginBottom: "5px",
                          letterSpacing: "0.5px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        <div
                          style={{
                            marginBottom: "2px",
                          }}
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </div>
                        <div>
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
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
                                      }
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "0 5px 1rem" }}>
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
                              "Group Class": { bg: "#614338ff", text: "#fff" },
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
                                style={{
                                  marginBottom: "5px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                                onClick={() => handleSeeModal(event)}
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
                              </div>
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
                    </StyledDiv>
                  );
                })}
              </div>
            )}
          </div>
          {/*Modal de nossos/edição de eventos particulares */}
          <div>
            <div
              style={{
                backgroundColor: transparentWhite(),
                width: "10000px",
                height: "10000px",
                top: "0",
                left: "0",
                position: "fixed",
                borderRadius: "6px",
                zIndex: 98,
                display: isVisible ? "block" : "none",
              }}
            />
            <div
              className="modal box-shadow-white"
              style={{
                position: "fixed",
                display: isVisible ? "block" : "none",
                zIndex: 100,
                backgroundColor: alwaysWhite(),
                width: "90vw",
                height: "90vh",
                overflowY: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {loadingModalInfo ? (
                <CircularProgress style={{ color: partnerColor() }} />
              ) : (
                <div
                  style={{
                    padding: "1.5rem",
                    maxHeight: "40rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      height: "10px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {name && (
                      <HOne
                        style={{
                          fontWeight: "700",
                          fontSize: "1.5rem",
                        }}
                      >
                        {name}
                        {theTime && ` - ${theTime}`}
                      </HOne>
                    )}
                    {!loadingInfo && (
                      <span
                        onClick={() => handleCloseModal(date)}
                        style={{
                          cursor: "pointer",
                          color: "#998",
                          fontSize: "1.5rem",
                          fontWeight: "800",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = partnerColor())
                        }
                        onMouseLeave={(e) => (e.target.style.color = "#998")}
                      >
                        ×
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Event Information */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.2rem",
                  borderRadius: "6px",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                {!postNew && (
                  <div
                    style={{
                      display: "grid",
                      gap: "1rem",
                    }}
                  >
                    {/* Admin Section */}
                    {authorizeOrNot && (
                      <div>
                        <div
                          style={{
                            borderTop: "2px solid #e9ecef",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.5rem",
                          }}
                        >
                          {!postNew && !showEditForm && (
                            <div
                              style={{
                                margin: "1rem",

                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() => {
                                  setShowEditForm(true);
                                  setPOSTNEWINFOCLASS(true);
                                  getClasses();
                                }}
                                style={{
                                  padding: "0.5rem 1rem",
                                  backgroundColor: partnerColor(),
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  margin: "0 auto",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = "translateY(-2px)";
                                  e.target.style.boxShadow =
                                    "0 6px 20px rgba(0,0,0,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow =
                                    "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                              >
                                <i className="fa fa-edit" />
                                {UniversalTexts.edit}
                              </button>
                              {!postNew && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "1rem",
                                    padding: "0.5rem",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <div
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => updateScheduled(newEventId)}
                                  >
                                    <i
                                      className="fa fa-clock-o"
                                      style={{
                                        fontSize:
                                          status == "Scheduled" ||
                                          status == "marcado"
                                            ? "24px"
                                            : "18px",
                                        color:
                                          status == "Scheduled" ||
                                          status == "marcado"
                                            ? "#007bff"
                                            : "#6c757d",
                                        transition: "all 0.2s",
                                      }}
                                    />
                                    <div
                                      style={{
                                        color:
                                          status == "Scheduled" ||
                                          status == "marcado"
                                            ? "#007bff"
                                            : "#6c757d",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {UniversalTexts.calendarModal.scheduled}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      updateRealizedClass(newEventId)
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle"
                                      style={{
                                        fontSize:
                                          status == "Realized" ||
                                          status == "realizado"
                                            ? "24px"
                                            : "18px",
                                        color:
                                          status == "Realized" ||
                                          status == "realizado"
                                            ? "#28a745"
                                            : "#6c757d",
                                        transition: "all 0.2s",
                                      }}
                                    />
                                    <div
                                      style={{
                                        color:
                                          status == "Realized" ||
                                          status == "realizado"
                                            ? "#28a745"
                                            : "#6c757d",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {UniversalTexts.calendarModal.realized}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      updateUnscheduled(newEventId)
                                    }
                                  >
                                    <i
                                      className="fa fa-times-circle-o"
                                      style={{
                                        fontSize:
                                          status == "Canceled" ||
                                          status == "desmarcado"
                                            ? "24px"
                                            : "18px",
                                        color:
                                          status == "Canceled" ||
                                          status == "desmarcado"
                                            ? "#dc3545"
                                            : "#6c757d",
                                        transition: "all 0.2s",
                                      }}
                                    />
                                    <div
                                      style={{
                                        color:
                                          status == "Canceled" ||
                                          status == "desmarcado"
                                            ? "#dc3545"
                                            : "#6c757d",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {UniversalTexts.calendarModal.canceled}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {(showEditForm || postNew) && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "1rem",
                                  width: "80%",
                                }}
                              >
                                <HTwo
                                  style={{ margin: 0, color: partnerColor() }}
                                >
                                  {
                                    UniversalTexts.calendarModal
                                      .scheduleOneClass
                                  }
                                </HTwo>
                                {!loadingInfo && (
                                  <button
                                    onClick={() => {
                                      setShowEditForm(false);
                                      setPOSTNEWINFOCLASS(false);
                                    }}
                                    style={{
                                      padding: "0.5rem 1rem",
                                      backgroundColor: "#6c757d",
                                      color: "white",
                                      border: "none",
                                      marginLeft: "auto",
                                      borderRadius: "6px",
                                      fontSize: "0.9rem",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        "#5a6268";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor =
                                        "#6c757d";
                                    }}
                                  >
                                    <i
                                      className="fa fa-times"
                                      style={{ marginRight: "0.5rem" }}
                                    />
                                  </button>
                                )}
                              </div>

                              {loadingInfo ? (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    color: partnerColor(),
                                    fontWeight: "800",
                                    fontStyle: "italic",
                                  }}
                                >
                                  <CircularProgress
                                    style={{ color: partnerColor() }}
                                  />
                                  <br />
                                  <br />
                                  {alternateText}
                                </div>
                              ) : (
                                <>
                                  {/* Form */}
                                  <form
                                    style={{
                                      width: "80%",
                                      display: "grid",
                                      gap: "1.5rem",
                                      borderRadius: "6px",
                                      padding: "8px",
                                    }}
                                  >
                                    {/* Seção para Aulas Realizadas */}
                                    {status == "marcado" ||
                                    status == "Realized" ? (
                                      <div
                                        style={{
                                          boxSizing: "border-box",
                                          borderRadius: "6px",
                                          marginTop: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            marginBottom: "1.5rem",
                                            borderBottom: "1px solid #e5e7eb",
                                          }}
                                        >
                                          <div
                                            style={{
                                              borderRadius: "6px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <i
                                              className="fa fa-check"
                                              style={{
                                                color: "#059669",
                                              }}
                                            />
                                          </div>
                                          <h3
                                            style={{
                                              margin: 0,
                                              color: "#374151",
                                              fontWeight: "500",
                                              fontSize: "1rem",
                                            }}
                                          >
                                            Conteúdo da Aula Realizada - Aluno:
                                            <strong>{name}</strong>
                                          </h3>
                                        </div>
                                        {/* Descrição */}
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              marginBottom: "0.5rem",
                                              fontWeight: "500",
                                              color: "#374151",
                                              fontSize: "0.875rem",
                                            }}
                                          >
                                            {
                                              UniversalTexts.calendarModal
                                                .classDescription
                                            }
                                          </label>
                                          {loadingDescription ? (
                                            <CircularProgress
                                              style={{
                                                color: partnerColor(),
                                                fontSize: "0.5rem",
                                              }}
                                            />
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                              }}
                                            >
                                              <input
                                                type="text"
                                                value={description}
                                                onChange={(e) =>
                                                  setDescription(e.target.value)
                                                }
                                                placeholder={
                                                  UniversalTexts.calendarModal
                                                    .classDescriptionPlaceholder
                                                }
                                                style={{
                                                  width: "90%",
                                                  padding: "0.75rem",
                                                  borderRadius: "6px",
                                                  border: "1px solid #d1d5db",
                                                  fontSize: "0.875rem",
                                                  lineHeight: "1.5",
                                                  backgroundColor: "#ffffff",
                                                  transition:
                                                    "border-color 0.2s ease",
                                                }}
                                                onFocus={(e) => {
                                                  e.target.style.borderColor =
                                                    partnerColor();
                                                  e.target.style.outline =
                                                    "none";
                                                  e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                }}
                                                onBlur={(e) => {
                                                  e.target.style.borderColor =
                                                    "#d1d5db";
                                                  e.target.style.boxShadow =
                                                    "none";
                                                }}
                                                required
                                              />
                                              <button
                                                title="-5"
                                                style={{
                                                  fontSize: "1rem",
                                                  border: "null",
                                                  padding: "0",
                                                  backgroundColor:
                                                    "transparent",
                                                  cursor:
                                                    loadingDescription ||
                                                    !description
                                                      ? "not-allowed"
                                                      : "pointer",
                                                  opacity:
                                                    loadingDescription ||
                                                    !description
                                                      ? 0.5
                                                      : 1,
                                                }}
                                                disabled={
                                                  loadingDescription ||
                                                  !description
                                                }
                                                onClick={handleClassSummary}
                                              >
                                                ✨ (-5)
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                        <div
                                          style={{
                                            display: "grid",
                                            gap: "1.5rem",
                                          }}
                                        >
                                          {/* Vídeo */}
                                          <div>
                                            <label
                                              style={{
                                                display: "block",
                                                marginBottom: "0.5rem",
                                                fontWeight: "500",
                                                width: "90%",
                                                color: "#374151",
                                                fontSize: "0.875rem",
                                              }}
                                            >
                                              {
                                                UniversalTexts.calendarModal
                                                  .video
                                              }
                                            </label>
                                            <input
                                              value={video}
                                              onChange={(e) =>
                                                setVideo(e.target.value)
                                              }
                                              placeholder="https://youtube.com/... ou https://vimeo.com/..."
                                              type="url"
                                              style={{
                                                width: "90%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
                                                border: "1px solid #d1d5db",
                                                fontSize: "0.875rem",
                                                backgroundColor: "#ffffff",
                                                lineHeight: "1.5",
                                                transition:
                                                  "border-color 0.2s ease",
                                              }}
                                              onFocus={(e) => {
                                                e.target.style.borderColor =
                                                  partnerColor();
                                                e.target.style.outline = "none";
                                                e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                              }}
                                              onBlur={(e) => {
                                                e.target.style.borderColor =
                                                  "#d1d5db";
                                                e.target.style.boxShadow =
                                                  "none";
                                              }}
                                            />
                                          </div>
                                          {/* Important Link Class */}
                                          <div>
                                            <label
                                              style={{
                                                display: "block",
                                                marginBottom: "0.5rem",
                                                fontWeight: "500",
                                                width: "90%",
                                                color: "#374151",
                                                fontSize: "0.875rem",
                                              }}
                                            >
                                              Important link
                                            </label>
                                            <input
                                              placeholder="https://... .com/..."
                                              value={googleDriveLink}
                                              onChange={(e) =>
                                                setGoogleDriveLink(
                                                  e.target.value
                                                )
                                              }
                                              type="url"
                                              style={{
                                                width: "90%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
                                                border: "1px solid #d1d5db",
                                                fontSize: "0.875rem",
                                                backgroundColor: "#ffffff",
                                                lineHeight: "1.5",
                                                transition:
                                                  "border-color 0.2s ease",
                                              }}
                                              onFocus={(e) => {
                                                e.target.style.borderColor =
                                                  partnerColor();
                                                e.target.style.outline = "none";
                                                e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                              }}
                                              onBlur={(e) => {
                                                e.target.style.borderColor =
                                                  "#d1d5db";
                                                e.target.style.boxShadow =
                                                  "none";
                                              }}
                                            />
                                            <div>
                                              <label
                                                style={{
                                                  display: "block",
                                                  marginBottom: "0.5rem",
                                                  fontWeight: "500",
                                                  width: "90%",
                                                  color: "#374151",
                                                  fontSize: "0.875rem",
                                                }}
                                              >
                                                Aula Usada
                                              </label>
                                              <select
                                                onChange={handleLessonChange}
                                                value={
                                                  theLesson?.id
                                                    ? String(theLesson.id)
                                                    : ""
                                                } // garanta string
                                                style={{
                                                  width: "100%",
                                                  padding: "0.75rem",
                                                  borderRadius: 8,
                                                  border: "1px solid #ced4da",
                                                  fontSize: "0.9rem",
                                                  backgroundColor: "white",
                                                }}
                                              >
                                                <option value="" hidden>
                                                  Select lesson...
                                                </option>

                                                {Object.entries(grouped).map(
                                                  ([course, modules]) => (
                                                    <optgroup
                                                      key={course}
                                                      label={course}
                                                    >
                                                      {Object.entries(
                                                        modules
                                                      ).map(([module, ls]) => (
                                                        <React.Fragment
                                                          key={`${course}-${module}`}
                                                        >
                                                          <option
                                                            value={`sep:${course}:${module}`}
                                                            disabled
                                                          >
                                                            — {module} —
                                                          </option>
                                                          {ls.map((l) => (
                                                            <option
                                                              key={l.id}
                                                              value={String(
                                                                l.id
                                                              )}
                                                            >
                                                              {l.title}
                                                            </option>
                                                          ))}
                                                        </React.Fragment>
                                                      ))}
                                                    </optgroup>
                                                  )
                                                )}
                                              </select>
                                              <div
                                                style={{
                                                  border: "1px solid #e0e0e0",
                                                  borderRadius: "6px",
                                                  padding: "1rem",
                                                  backgroundColor: "#f9fafb",
                                                  marginTop: "1rem",
                                                  boxShadow:
                                                    "0 2px 6px rgba(0,0,0,0.08)",
                                                  maxWidth: "400px",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    marginBottom: "0.75rem",
                                                    color: "#374151",
                                                  }}
                                                >
                                                  🎓 Aula Selecionada
                                                </p>

                                                {theLesson ? (
                                                  <>
                                                    <p>
                                                      <strong>Título:</strong>

                                                      {theLesson.title}
                                                    </p>
                                                    <p>
                                                      <strong>Curso:</strong>

                                                      {theLesson.course}
                                                    </p>
                                                    <p>
                                                      <strong>Módulo:</strong>
                                                      {theLesson.module}
                                                    </p>
                                                  </>
                                                ) : (
                                                  <p
                                                    style={{ color: "#6b7280" }}
                                                  >
                                                    Nenhuma aula selecionada.
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          {!homeworkAdded && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setShowHomework(!showHomework)
                                              }
                                              style={{
                                                padding: "6px 12px",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                                color: "#6c757d",
                                                backgroundColor: "transparent",
                                                border: "1px solid #e9ecef",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                                marginBottom: "8px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                              }}
                                              onMouseEnter={(e) => {
                                                e.target.style.backgroundColor =
                                                  "#f8f9fa";
                                                e.target.style.borderColor =
                                                  "#dee2e6";
                                                e.target.style.color =
                                                  "#495057";
                                              }}
                                              onMouseLeave={(e) => {
                                                e.target.style.backgroundColor =
                                                  "transparent";
                                                e.target.style.borderColor =
                                                  "#e9ecef";
                                                e.target.style.color =
                                                  "#6c757d";
                                              }}
                                            >
                                              <span
                                                style={{ fontSize: "10px" }}
                                              >
                                                {showHomework ? "📝" : "➕"}
                                              </span>
                                              {showHomework
                                                ? "Hide Homework"
                                                : "Add Homework"}
                                            </button>
                                          )}
                                          {showHomework && (
                                            <div>
                                              <label
                                                style={{
                                                  display: "block",
                                                  marginBottom: "0.5rem",
                                                  fontWeight: "500",
                                                  color: "#374151",
                                                  fontSize: "0.875rem",
                                                }}
                                              >
                                                {
                                                  UniversalTexts.calendarModal
                                                    .homework
                                                }
                                              </label>
                                              {!loadingHWDescription ? (
                                                <>
                                                  {" "}
                                                  <div
                                                    style={{
                                                      backgroundColor: "white",
                                                      borderRadius: "6px",
                                                      border:
                                                        "1px solid #ced4da",
                                                      overflow: "hidden",
                                                    }}
                                                  >
                                                    {!showAIGENERATED ? (
                                                      <span>
                                                        <HTMLEditor
                                                          onChange={
                                                            handleHomeworkChange
                                                          }
                                                          initialContent={
                                                            "Type"
                                                          }
                                                        />
                                                      </span>
                                                    ) : (
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: homework,
                                                        }}
                                                      />
                                                    )}
                                                  </div>
                                                  <div
                                                    style={{
                                                      margin: "1rem",
                                                    }}
                                                  />
                                                  {showAIGENERATED ? (
                                                    <button
                                                      style={{
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowAIGENERATED(
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      Voltar ao editor (isto
                                                      excluirá a descrição
                                                      gerada)
                                                    </button>
                                                  ) : (
                                                    <button
                                                      title="-15"
                                                      style={{
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={
                                                        handleHWDescription
                                                      }
                                                    >
                                                      ✨Ajude-me com a descrição
                                                      do homework (-15)
                                                    </button>
                                                  )}
                                                </>
                                              ) : (
                                                <CircularProgress
                                                  style={{
                                                    color: partnerColor(),
                                                  }}
                                                />
                                              )}
                                              {studentsInGroup.length > 1 && (
                                                <div
                                                  style={{
                                                    marginTop: "1rem",
                                                  }}
                                                >
                                                  <label
                                                    style={{
                                                      display: "block",
                                                      marginBottom: "0.5rem",
                                                      fontWeight: "600",
                                                      color: "#495057",
                                                      fontSize: "0.9rem",
                                                    }}
                                                  >
                                                    📝 Descrição individual para
                                                    cada aluno.
                                                  </label>
                                                  {studentsInGroup.map(
                                                    (student, index) => (
                                                      <div
                                                        key={
                                                          student._id || index
                                                        }
                                                      >
                                                        {student.name +
                                                          " " +
                                                          student.lastname}
                                                        <input
                                                          type="text"
                                                          value={
                                                            comments[index]
                                                              ?.comment || ""
                                                          }
                                                          onChange={(e) =>
                                                            handleStudentDescriptionChange(
                                                              index,
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder="Comentário para o aluno"
                                                          style={{
                                                            width: "100%",
                                                            padding: "0.75rem",
                                                            borderRadius: "6px",
                                                            border:
                                                              "1px solid #ced4da",
                                                            fontSize: "0.9rem",
                                                            marginTop: "0.5rem",
                                                          }}
                                                        />
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          {/* Due Date */}
                                          {!homeworkAdded && showHomework && (
                                            <div>
                                              <label
                                                style={{
                                                  display: "block",
                                                  marginBottom: "0.5rem",
                                                  fontWeight: "500",
                                                  color: "#374151",
                                                  fontSize: "0.875rem",
                                                }}
                                              >
                                                📅 Data de Entrega
                                              </label>

                                              <input
                                                value={
                                                  dueDate
                                                    ? dueDate.split("T")[0]
                                                    : ""
                                                }
                                                onChange={(e) =>
                                                  setDueDate(e.target.value)
                                                }
                                                type="date"
                                                style={{
                                                  width: "90%",
                                                  padding: "0.75rem",
                                                  borderRadius: "6px",
                                                  border: "1px solid #d1d5db",
                                                  fontSize: "0.875rem",
                                                  backgroundColor: "#ffffff",
                                                  lineHeight: "1.5",
                                                  transition:
                                                    "border-color 0.2s ease",
                                                }}
                                                onFocus={(e) => {
                                                  e.target.style.borderColor =
                                                    partnerColor();
                                                  e.target.style.outline =
                                                    "none";
                                                  e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                }}
                                                onBlur={(e) => {
                                                  e.target.style.borderColor =
                                                    "#d1d5db";
                                                  e.target.style.boxShadow =
                                                    "none";
                                                }}
                                              />
                                            </div>
                                          )}
                                          {!homeworkAdded &&
                                            showHomework &&
                                            category !== "Group Class" &&
                                            category !== "Standalone" &&
                                            category !== "Aula experimental" &&
                                            category !== "Aula única" &&
                                            category !==
                                              "Horário vazio para reposição" && (
                                              <div>
                                                <label
                                                  style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    fontWeight: "500",
                                                    color: "#374151",
                                                    fontSize: "0.875rem",
                                                  }}
                                                >
                                                  📎 Anexar Arquivo
                                                </label>

                                                <input
                                                  type="file"
                                                  onChange={handleFileChange}
                                                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                                  style={{
                                                    width: "90%",
                                                    padding: "0.75rem",
                                                    borderRadius: "6px",
                                                    border: "1px solid #d1d5db",
                                                    fontSize: "0.875rem",
                                                    backgroundColor: "#ffffff",
                                                    cursor: "pointer",
                                                  }}
                                                />

                                                {uploading && (
                                                  <div
                                                    style={{
                                                      fontSize: "0.8rem",
                                                      color: "#666",
                                                      marginTop: "0.5rem",
                                                      fontStyle: "italic",
                                                    }}
                                                  >
                                                    Processando arquivo...
                                                  </div>
                                                )}

                                                {selectedFile && !uploading && (
                                                  <div
                                                    style={{
                                                      fontSize: "0.8rem",
                                                      color: "#28a745",
                                                      marginTop: "0.5rem",
                                                      fontStyle: "italic",
                                                    }}
                                                  >
                                                    ✅ {selectedFile.name}
                                                    <button
                                                      type="button"
                                                      onClick={clearFile}
                                                      style={{
                                                        marginLeft: "0.5rem",
                                                        background: "none",
                                                        border: "none",
                                                        color: "#dc3545",
                                                        cursor: "pointer",
                                                        fontSize: "0.8rem",
                                                      }}
                                                    >
                                                      ❌ Remover
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                          {category !== "Group Class" &&
                                            category !== "Standalone" &&
                                            category !== "Aula experimental" &&
                                            category !== "Aula única" &&
                                            category !==
                                              "Horário vazio para reposição" && (
                                              <div>
                                                {/* Flashcards */}

                                                {!flashcardsAdded && (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setShowFlashcards(
                                                        !showFlashcards
                                                      )
                                                    }
                                                    style={{
                                                      padding: "6px 12px",
                                                      fontSize: "13px",
                                                      fontWeight: "500",
                                                      color: "#6c757d",
                                                      backgroundColor:
                                                        "transparent",
                                                      border:
                                                        "1px solid #e9ecef",
                                                      borderRadius: "4px",
                                                      cursor: "pointer",
                                                      transition:
                                                        "all 0.2s ease",
                                                      marginBottom: "8px",
                                                      display: "inline-flex",
                                                      alignItems: "center",
                                                      gap: "4px",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      e.target.style.backgroundColor =
                                                        "#f8f9fa";
                                                      e.target.style.borderColor =
                                                        "#dee2e6";
                                                      e.target.style.color =
                                                        "#495057";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      e.target.style.backgroundColor =
                                                        "transparent";
                                                      e.target.style.borderColor =
                                                        "#e9ecef";
                                                      e.target.style.color =
                                                        "#6c757d";
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: "12px",
                                                      }}
                                                    >
                                                      {showFlashcards
                                                        ? "🃏"
                                                        : "➕"}
                                                    </span>

                                                    {showFlashcards
                                                      ? "Hide Flashcards"
                                                      : "Add Flashcards"}
                                                  </button>
                                                )}

                                                {!flashcardsAdded &&
                                                  showFlashcards && (
                                                    <div>
                                                      <label
                                                        style={{
                                                          display: "block",
                                                          marginBottom:
                                                            "0.5rem",
                                                          fontWeight: "500",
                                                          color: "#374151",
                                                          fontSize: "0.875rem",
                                                        }}
                                                      >
                                                        🃏
                                                        {
                                                          UniversalTexts
                                                            .calendarModal
                                                            .uploadFlashcards
                                                        }
                                                      </label>
                                                      <textarea
                                                        value={flashcards || ""}
                                                        onChange={(e) => {
                                                          const newValue =
                                                            e.target.value;
                                                          if (
                                                            newValue.length <=
                                                            2000
                                                          ) {
                                                            setFlashcards(
                                                              newValue
                                                            );
                                                          }
                                                        }}
                                                        placeholder={
                                                          UniversalTexts
                                                            .calendarModal
                                                            .enterFlashcards
                                                        }
                                                        rows={4}
                                                        maxLength={2000}
                                                        style={{
                                                          width: "90%",
                                                          padding: "0.75rem",
                                                          borderRadius: "6px",
                                                          border:
                                                            "1px solid #d1d5db",
                                                          fontSize: "0.875rem",
                                                          backgroundColor:
                                                            "#ffffff",
                                                          lineHeight: "1.5",
                                                          transition:
                                                            "border-color 0.2s ease",
                                                          resize: "vertical",
                                                        }}
                                                        onFocus={(e) => {
                                                          e.target.style.borderColor =
                                                            partnerColor();
                                                          e.target.style.outline =
                                                            "none";
                                                          e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                        }}
                                                        onBlur={(e) => {
                                                          e.target.style.borderColor =
                                                            "#d1d5db";
                                                          e.target.style.boxShadow =
                                                            "none";
                                                        }}
                                                      />
                                                      <div
                                                        style={{
                                                          fontSize: "0.75rem",
                                                          color:
                                                            flashcards &&
                                                            flashcards.length >
                                                              900
                                                              ? "#dc3545"
                                                              : "#6c757d",
                                                          marginTop: "0.25rem",
                                                          textAlign: "right",
                                                          width: "90%",
                                                        }}
                                                      >
                                                        {flashcards
                                                          ? `${flashcards.length}/2000 caracteres`
                                                          : "0/2000 caracteres"}

                                                        <br />
                                                        {flashcards.length >
                                                          1900 &&
                                                          "Você pode adicionar mais flashcards para este aluno na aba 'Flashcards - Add"}
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    ) : (
                                      <span>
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
                                            📋
                                            {
                                              UniversalTexts.calendarModal
                                                .selectCategory
                                            }
                                          </label>
                                          <select
                                            onChange={handleCategoryChange}
                                            name="category"
                                            value={category}
                                            style={{
                                              width: "100%",
                                              padding: "0.75rem",
                                              borderRadius: "6px",
                                              border: "1px solid #ced4da",
                                              fontSize: "0.9rem",
                                              backgroundColor: "white",
                                            }}
                                          >
                                            <option value="category" hidden>
                                              Select category...
                                            </option>
                                            {categoryList.map((cat, index) => (
                                              <option
                                                key={index}
                                                value={cat.value}
                                              >
                                                {cat.text}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Estudante (se for tutoring) */}
                                        {isTutoring && (
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
                                              👤
                                              {
                                                UniversalTexts.calendarModal
                                                  .selectStudent
                                              }
                                            </label>
                                            <select
                                              onChange={handleStudentChange}
                                              name="students"
                                              value={newStudentId}
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
                                                border: "1px solid #ced4da",
                                                fontSize: "0.9rem",
                                                backgroundColor: "white",
                                              }}
                                            >
                                              <option value="category" hidden>
                                                Select student...
                                              </option>
                                              {studentsList.map(
                                                (student, index) => (
                                                  <option
                                                    key={index}
                                                    value={student.id}
                                                  >
                                                    {student.name +
                                                      " " +
                                                      student.lastname}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}

                                        {/* Data e Hora */}
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                              window.innerWidth < 768
                                                ? "1fr"
                                                : "1fr 1fr",
                                            gap: "1rem",
                                          }}
                                        >
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
                                              📅 Date
                                            </label>
                                            <input
                                              value={date}
                                              onChange={(e) =>
                                                setDate(e.target.value)
                                              }
                                              type="date"
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
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
                                              ⏰ Time
                                            </label>
                                            <input
                                              value={theTime}
                                              onChange={(e) =>
                                                setTheTime(e.target.value)
                                              }
                                              type="time"
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
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
                                                fontWeight: "500",
                                                width: "90%",
                                                color: "#374151",
                                                fontSize: "0.875rem",
                                              }}
                                            >
                                              Aula Usada
                                            </label>
                                            <select
                                              onChange={handleLessonChange}
                                              value={
                                                theLesson?.id
                                                  ? String(theLesson.id)
                                                  : ""
                                              } // garanta string
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: 8,
                                                border: "1px solid #ced4da",
                                                fontSize: "0.9rem",
                                                backgroundColor: "white",
                                              }}
                                            >
                                              <option value="" hidden>
                                                Select lesson...
                                              </option>

                                              {Object.entries(grouped).map(
                                                ([course, modules]) => (
                                                  <optgroup
                                                    key={course}
                                                    label={course}
                                                  >
                                                    {Object.entries(
                                                      modules
                                                    ).map(([module, ls]) => (
                                                      <React.Fragment
                                                        key={`${course}-${module}`}
                                                      >
                                                        <option
                                                          value={`sep:${course}:${module}`}
                                                          disabled
                                                        >
                                                          — {module} —
                                                        </option>
                                                        {ls.map((l) => (
                                                          <option
                                                            key={l.id}
                                                            value={String(l.id)}
                                                          >
                                                            {l.title}
                                                          </option>
                                                        ))}
                                                      </React.Fragment>
                                                    ))}
                                                  </optgroup>
                                                )
                                              )}
                                            </select>
                                            <div
                                              style={{
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "6px",
                                                padding: "1rem",
                                                backgroundColor: "#f9fafb",
                                                marginTop: "1rem",
                                                boxShadow:
                                                  "0 2px 6px rgba(0,0,0,0.08)",
                                                maxWidth: "400px",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  marginBottom: "0.75rem",
                                                  color: "#374151",
                                                }}
                                              >
                                                🎓 Aula Selecionada
                                              </p>

                                              {theLesson ? (
                                                <>
                                                  <p>
                                                    <strong>Título:</strong>

                                                    {theLesson.title}
                                                  </p>
                                                  <p>
                                                    <strong>Curso:</strong>

                                                    {theLesson.course}
                                                  </p>
                                                  <p>
                                                    <strong>Módulo:</strong>

                                                    {theLesson.module}
                                                  </p>
                                                </>
                                              ) : (
                                                <p style={{ color: "#6b7280" }}>
                                                  Nenhuma aula selecionada.
                                                </p>
                                              )}
                                            </div>
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
                                              ⏰ Duration in minutes:
                                              {duration < 60
                                                ? `${duration} min`
                                                : duration === 60
                                                ? "1h"
                                                : duration % 60 === 0
                                                ? `${Math.floor(
                                                    duration / 60
                                                  )}h`
                                                : `${Math.floor(
                                                    duration / 60
                                                  )}h ${duration % 60}min`}
                                            </label>
                                            <input
                                              value={duration}
                                              onChange={(e) =>
                                                setDuration(e.target.value)
                                              }
                                              type="number"
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
                                                border: "1px solid #ced4da",
                                                fontSize: "0.9rem",
                                              }}
                                              required
                                            />
                                          </div>
                                        </div>

                                        {/* Link da Reunião */}
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
                                            🔗
                                            {UniversalTexts.calendarModal.link}
                                          </label>
                                          <input
                                            value={link}
                                            onChange={(e) =>
                                              setLink(e.target.value)
                                            }
                                            placeholder="https://meet.google.com/..."
                                            type="url"
                                            style={{
                                              width: "100%",
                                              padding: "0.75rem",
                                              borderRadius: "6px",
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
                                            📝
                                            {
                                              UniversalTexts.calendarModal
                                                .classDescription
                                            }
                                          </label>
                                          <input
                                            type="text"
                                            value={description}
                                            onChange={(e) =>
                                              setDescription(e.target.value)
                                            }
                                            placeholder={
                                              UniversalTexts.calendarModal
                                                .classDescriptionPlaceholder
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "0.75rem",
                                              borderRadius: "6px",
                                              border: "1px solid #ced4da",
                                              fontSize: "0.9rem",
                                              lineHeight: "1.5",
                                            }}
                                            required
                                          />
                                        </div>
                                      </span>
                                    )}
                                  </form>
                                </>
                              )}
                              {!loadingInfo && (
                                <>
                                  {/* Action Buttons */}
                                  {!deleteVisible ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "1rem",
                                        justifyContent: "center",
                                        paddingTop: "1rem",
                                      }}
                                    >
                                      {[
                                        {
                                          text: "Delete",
                                          color: "red",
                                          onClick: seeDelete,
                                          visible: !postNew,
                                        },
                                        {
                                          text: "Cancel",
                                          color: "blue",
                                          onClick: () => setShowEditForm(false),
                                          visible: true,
                                        },
                                        {
                                          text: "Save",
                                          color: "green",
                                          onClick: postNew
                                            ? postNewEvent
                                            : editInside,
                                          visible: true,
                                        },
                                      ].map(
                                        (item, index) =>
                                          item.visible && (
                                            <button
                                              key={index}
                                              color={item.color}
                                              onClick={item.onClick}
                                              style={{
                                                padding: "5px 1.5rem",

                                                fontWeight: "500",
                                                width: "80px",
                                              }}
                                            >
                                              {item.text}
                                            </button>
                                          )
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        backgroundColor: "#f8d7da",
                                        padding: "1.5rem",
                                        borderRadius: "6px",
                                        border: "1px solid #f5c6cb",
                                        textAlign: "center",
                                      }}
                                    >
                                      <p
                                        style={{
                                          margin: "0 0 1rem 0",

                                          fontWeight: "500",
                                          color: "#721c24",
                                        }}
                                      >
                                        ⚠️
                                        {
                                          UniversalTexts.calendarModal
                                            .deleteConfirmation
                                        }
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "1rem",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <button
                                          onClick={seeDelete}
                                          style={{
                                            padding: "5px 1.5rem",
                                            backgroundColor: partnerColor(),
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",

                                            fontWeight: "500",
                                          }}
                                        >
                                          {
                                            UniversalTexts.calendarModal
                                              .noCancel
                                          }
                                        </button>
                                        <button
                                          onClick={deleteOneMaterialInside}
                                          style={{
                                            padding: "5px 1.5rem",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {
                                            UniversalTexts.calendarModal
                                              .yesDelete
                                          }
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {!showEditForm && (
                      <span>
                        {/* Link de Acesso */}

                        {!showEditForm && (
                          <span>
                            {/* Link de Acesso */}
                            {link &&
                            (status === "marcado" || status === "Scheduled") ? (
                              <div style={{ textAlign: "center" }}>
                                <Link
                                  to={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-block",
                                    color: partnerColor(),
                                    textDecoration: "none",
                                    padding: "0.75rem 1.5rem",
                                    backgroundColor: "white",
                                    border: `2px solid ${partnerColor()}`,
                                    borderRadius: "6px",
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    minWidth: "80%",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                  onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = partnerColor();
                                    el.style.color = "white";
                                    el.style.transform = "translateY(-2px)";
                                    el.style.boxShadow =
                                      "0 4px 8px rgba(0,0,0,0.15)";
                                  }}
                                  onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = "white";
                                    el.style.color = partnerColor();
                                    el.style.transform = "translateY(0)";
                                    el.style.boxShadow =
                                      "0 2px 4px rgba(0,0,0,0.1)";
                                  }}
                                >
                                  {
                                    UniversalTexts.calendarModal
                                      .clickToAccessClass
                                  }
                                </Link>
                              </div>
                            ) : googleDriveLink ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  marginTop: "2rem",
                                }}
                              >
                                <Link
                                  to={googleDriveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-block",
                                    color: partnerColor(),
                                    textDecoration: "none",
                                    padding: "0.75rem 1.5rem",
                                    backgroundColor: "white",
                                    border: `2px solid ${partnerColor()}`,
                                    borderRadius: "6px",
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    minWidth: "80%",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                  onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = partnerColor();
                                    el.style.color = "white";
                                    el.style.transform = "translateY(-2px)";
                                    el.style.boxShadow =
                                      "0 4px 8px rgba(0,0,0,0.15)";
                                  }}
                                  onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = "white";
                                    el.style.color = partnerColor();
                                    el.style.transform = "translateY(0)";
                                    el.style.boxShadow =
                                      "0 2px 4px rgba(0,0,0,0.1)";
                                  }}
                                >
                                  <b>Important Link:</b>{" "}
                                  {truncateString(googleDriveLink, 30)}
                                </Link>
                              </div>
                            ) : null}
                          </span>
                        )}

                        {/* Descrição */}
                        <div
                          style={{
                            display: "grid",
                            maxWidth: "85%",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        >
                          {description && (
                            <div
                              style={{
                                backgroundColor: "white",
                                marginTop: "2rem",
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #dee2e6",
                                borderLeft: `4px solid ${partnerColor()}`,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  color: "#495057",
                                }}
                              >
                                {description}
                              </p>
                            </div>
                          )}
                          {theLesson && theLesson.course && theLesson.id && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "0.75rem",
                              }}
                            >
                              <a
                                target="_blank"
                                href={`/teaching-materials/${theLesson.course
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .replace(/[^\w\-]+/g, "")}/${theLesson.id}`}
                                style={{
                                  gap: "5px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: partnerColor(),
                                  textDecoration: "none",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  borderRadius: "6px",
                                  backgroundColor: textpartnerColorContrast(),
                                  fontFamily: "Arial, sans-serif",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.textDecoration =
                                    "underline")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.textDecoration =
                                    "none")
                                }
                              >
                                <span>Aula relacionada</span>
                                <span>
                                  <strong>
                                    {theLesson.title} | {theLesson.course}
                                  </strong>
                                </span>
                              </a>
                            </div>
                          )}
                        </div>

                        {lastFew.length > 0 &&
                          category !== "Test Class" &&
                          category !== "Standalone" &&
                          category !== "Group Class" &&
                          category !== "Established Group Class" &&
                          category !== "Marcar Reposição" && (
                            <div
                              style={{
                                display: "flex",
                                margin: "1rem",
                                marginTop: "2rem",
                                justifySelf: "center",
                                flexDirection: "column",
                                textAlign: "center",
                                display: "block",
                                width: "90%",
                              }}
                            >
                              {!showLastFew && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#6c757d",
                                    margin: " 10px 0",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    display: "block",
                                    width: "100%",
                                    borderRadius: "6px",
                                    fontWeight: 600,
                                    padding: "8px",
                                    border: `1px solid ${partnerColor()}`,
                                    backgroundColor: "transparent",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                    transition:
                                      "background-color 120ms ease, box-shadow 120ms ease",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#fff")
                                  }
                                  onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "transparent")
                                  }
                                  onClick={() => setShowLastFew(!showLastFew)}
                                >
                                  Histórico de aulas dadas
                                </span>
                              )}
                              {showLastFew && (
                                <ul
                                  style={{
                                    padding: 0,
                                    margin: "8px 0",
                                    listStyle: "none",
                                  }}
                                >
                                  {lastFew.map((evt, idx) => (
                                    <li
                                      key={evt._id || evt.id}
                                      style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderLeft: `3px solid ${
                                          partnerColor?.() || "#829ad1"
                                        }`,
                                        borderRadius: "6px",
                                        padding: "8px 12px",
                                        marginTop: "8px",
                                        marginBottom: "8px",
                                        fontSize: "12px",
                                        display: "grid",
                                        gridTemplateColumns: "1fr",
                                        gap: "6px",
                                        alignItems: "start",
                                        textAlign: "left",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                        transition:
                                          "box-shadow 120ms ease, border-color 120ms ease",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                          "0 2px 6px rgba(0,0,0,0.08)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                          "0 1px 2px rgba(0,0,0,0.04)")
                                      }
                                    >
                                      {idx == 0 && (
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                            marginBottom: "8px",
                                            fontWeight: "600",
                                            fontSize: "14px",
                                          }}
                                          onMouseOver={(e) =>
                                            (e.currentTarget.style.color =
                                              partnerColor())
                                          }
                                          onMouseDown={(e) =>
                                            (e.currentTarget.style.color =
                                              "black")
                                          }
                                          onClick={() => setShowLastFew(false)}
                                        >
                                          x
                                        </span>
                                      )}
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          alignSelf: "start",
                                          display: "inline-block",
                                          justifyContent: "space-between",
                                          padding: "2px 6px",
                                          display: "flex",
                                          borderRadius: "4px",
                                          backgroundColor: "#f3f4f6",
                                          color: "#111827",
                                          border: "1px solid #e5e7eb",
                                        }}
                                      >
                                        <span>
                                          {formatDateBr(evt.date) || "Sem data"}
                                        </span>
                                      </span>
                                      <span
                                        style={{
                                          opacity: 0.95,
                                          lineHeight: 1.5,
                                          color: "#374151",
                                        }}
                                      >
                                        {evt.description || "Sem descrição"}
                                      </span>

                                      <span
                                        style={{
                                          display: "block",
                                          opacity: 0.95,
                                          color: "#374151",
                                        }}
                                      >
                                        <strong style={{ fontWeight: 600 }}>
                                          Homework:
                                        </strong>
                                        <div
                                          style={{
                                            marginTop: "6px",
                                            backgroundColor: "#ffffff",
                                            padding: "0.75rem",
                                            borderRadius: "6px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "0.85rem",
                                            color: "#374151",
                                            lineHeight: 1.5,
                                            maxHeight: "150px",
                                            overflowY: "auto",
                                            whiteSpace: "pre-wrap",
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html: evt.homework,
                                          }}
                                        />
                                      </span>

                                      {theLessonLast &&
                                        theLessonLast.course &&
                                        theLessonLast.id && (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              marginTop: "4px",
                                            }}
                                          >
                                            <a
                                              target="_blank"
                                              href={`/teaching-materials/${theLessonLast.course
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")
                                                .replace(/[^\w\-]+/g, "")}/${
                                                theLessonLast.id
                                              }`}
                                              style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                                color: partnerColor(),
                                                textDecoration: "none",
                                                padding: "8px 10px",
                                                borderRadius: "6px",
                                                border: `1px solid ${
                                                  partnerColor?.() || "#829ad1"
                                                }`,
                                                backgroundColor:
                                                  textpartnerColorContrast(),
                                                boxShadow:
                                                  "0 1px 2px rgba(0,0,0,0.04)",
                                                transition:
                                                  "box-shadow 120ms ease, text-decoration-color 120ms ease",
                                              }}
                                              onMouseOver={(e) =>
                                                (e.currentTarget.style.textDecoration =
                                                  "underline")
                                              }
                                              onMouseOut={(e) =>
                                                (e.currentTarget.style.textDecoration =
                                                  "none")
                                              }
                                            >
                                              <span style={{ fontWeight: 500 }}>
                                                Aula relacionada
                                              </span>
                                              <span>
                                                <strong>
                                                  {theLessonLast.title} |{" "}
                                                  {theLessonLast.course}
                                                </strong>
                                              </span>
                                            </a>
                                          </div>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                        {duration && (
                          <div
                            style={{
                              backgroundColor: "#f8f9fa",
                              marginTop: "0.5rem",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #e9ecef",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.9rem",
                                opacity: 0.7,
                              }}
                            >
                              ⏱️
                            </span>
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: "#6c757d",
                                fontWeight: "500",
                              }}
                            >
                              Duração:
                              {duration < 60
                                ? `${duration} min`
                                : duration === 60
                                ? "1h"
                                : duration % 60 === 0
                                ? `${Math.floor(duration / 60)}h`
                                : `${Math.floor(duration / 60)}h ${
                                    duration % 60
                                  }min`}
                            </span>
                          </div>
                        )}

                        {/* Informações do Evento */}
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #e9ecef",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          {/* Container flex para Informações + Vídeo */}
                          {video ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              {/* Coluna das Informações */}
                              <div style={{ flex: "1", minWidth: "250px" }}>
                                {/* Categoria */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "0.5rem",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#6c757d",
                                      fontSize: "0.8rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    📋 {UniversalTexts.calendarModal.category}
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: partnerColor(),
                                      color: "white",
                                      padding: "0.2rem 0.75rem",
                                      borderRadius: "6px",
                                      fontWeight: "500",
                                      fontSize: "0.75rem",
                                      textAlign: "center",
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                                    }}
                                  >
                                    {category === "Test"
                                      ? "Test Class"
                                      : category === "Standalone"
                                      ? "Standalone Class"
                                      : category === "Group Class"
                                      ? "Group Class"
                                      : category === "Rep"
                                      ? "Marcar Reposição"
                                      : category === "Marcar Reposição"
                                      ? "Janela de Marcar Reposição"
                                      : category === "Prize Class"
                                      ? "Prize Class"
                                      : category === "Tutoring"
                                      ? "Tutoring: Private Class"
                                      : ""}
                                  </span>
                                </div>

                                {/* Data e Hora */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        color: "#6c757d",
                                        fontSize: "0.8rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                    >
                                      📅 {newFormatDate(date)}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        color: "#6c757d",
                                        fontSize: "0.8rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                    >
                                      ⏰ {theTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  flex: "1",
                                  minWidth: "300px",
                                  maxWidth: "400px",
                                }}
                              >
                                <div
                                  style={{
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#6c757d",
                                      fontSize: "0.8rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    🎥 {UniversalTexts.calendarModal.video}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "0.5rem",
                                    borderRadius: "6px",
                                    border: "1px solid #dee2e6",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      paddingBottom: "56.25%",
                                      height: 0,
                                      overflow: "hidden",
                                      borderRadius: "4px",
                                      backgroundColor: "#000",
                                    }}
                                  >
                                    <iframe
                                      src={getEmbedUrl(video)}
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                        borderRadius: "4px",
                                      }}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title="Class Video"
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                      textAlign: "center",
                                    }}
                                  >
                                    <a
                                      href={video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: partnerColor(),
                                        textDecoration: "none",
                                        fontWeight: "500",
                                        fontSize: "0.75rem",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.textDecoration =
                                          "underline";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.textDecoration = "none";
                                      }}
                                    >
                                      <i className="fa fa-external-link" />
                                      {video.includes("youtube.com") ||
                                      video.includes("youtu.be")
                                        ? "YouTube"
                                        : video.includes("vimeo.com")
                                        ? "Vimeo"
                                        : "Vídeo"}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "0.5rem",
                                  flexWrap: "wrap",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#6c757d",
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  {UniversalTexts.calendarModal.category}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: partnerColor(),
                                    color: "white",
                                    padding: "0.2rem 0.75rem",
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    fontSize: "0.75rem",
                                    textAlign: "center",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                                  }}
                                >
                                  {category === "Test"
                                    ? "Test Class"
                                    : category === "Standalone"
                                    ? "Standalone Class"
                                    : category === "Group Class"
                                    ? "Group Class"
                                    : category === "Rep"
                                    ? "Marcar Reposição"
                                    : category === "Marcar Reposição"
                                    ? "Janela de Marcar Reposição"
                                    : category === "Prize Class"
                                    ? "Prize Class"
                                    : category === "Established Group Class"
                                    ? `Aula do grupo: ${groupName}`
                                    : category === "Tutoring"
                                    ? "Tutoring: Private Class"
                                    : ""}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "0.5rem",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#6c757d",
                                      fontSize: "0.8rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    {newFormatDate(date)}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#6c757d",
                                      fontSize: "0.8rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                    }}
                                  >
                                    {theTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {eventFull.homeworkDetails && (
                          <div
                            style={{
                              backgroundColor: "#f8fafc",
                              padding: "1rem",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                              marginTop: "1rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "1rem",
                                borderBottom: "1px solid #e2e8f0",
                                paddingBottom: "0.5rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "grid",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#6c757d",
                                    fontSize: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  📝 {UniversalTexts.calendarModal.homework}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  backgroundColor:
                                    eventFull.homeworkDetails.status ===
                                    "pending"
                                      ? "#fef3c7"
                                      : "#dcfce7",
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  fontWeight: "500",
                                }}
                              >
                                {eventFull.homeworkDetails.status === "pending"
                                  ? "Pendente"
                                  : "Concluído"}
                              </span>
                            </div>
                            <Link
                              to="/my-homework-and-lessons"
                              target="_blank"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginBottom: "1rem",
                                gap: "0.5rem",
                                backgroundColor: partnerColor(),
                                color: "white",
                                textDecoration: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                                fontSize: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow =
                                  "0 4px 8px rgba(0, 0, 0, 0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0px)";
                                e.target.style.boxShadow =
                                  "0 2px 4px rgba(0, 0, 0, 0.1)";
                              }}
                            >
                              <i className="fa fa-external-link" />
                              {UniversalTexts.seeOnHomeworkPage}
                            </Link>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <i
                                  className="fa fa-calendar"
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.8rem",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                  }}
                                >
                                  <strong>Data de Entrega:</strong>

                                  {new Date(
                                    eventFull.homeworkDetails.dueDate
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <i
                                  className="fa fa-tag"
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.8rem",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                  }}
                                >
                                  <strong>Categoria:</strong>

                                  {eventFull.homeworkDetails.category}
                                </span>
                              </div>
                              {eventFull.homeworkDetails.description && (
                                <div style={{ marginTop: "0.5rem" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    <i
                                      className="fa fa-file-text-o"
                                      style={{
                                        color: "#6b7280",
                                        fontSize: "0.8rem",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#6b7280",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Descrição:
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      backgroundColor: "white",
                                      padding: "0.75rem",
                                      borderRadius: "6px",
                                      border: "1px solid #e5e7eb",
                                      fontSize: "0.85rem",
                                      color: "#374151",
                                      lineHeight: "1.5",
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        eventFull.homeworkDetails.description,
                                    }}
                                  />
                                </div>
                              )}
                              {eventFull.homeworkDetails.attachments && (
                                <div style={{ marginTop: "0.5rem" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    <i
                                      className="fa fa-paperclip"
                                      style={{
                                        color: "#6b7280",
                                        fontSize: "0.8rem",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#6b7280",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Material Anexo:
                                    </span>
                                  </div>
                                  <a
                                    href={eventFull.homeworkDetails.attachments}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      color: "#0ea5e9",
                                      textDecoration: "none",
                                      fontSize: "0.8rem",
                                      fontWeight: "500",
                                      padding: "0.5rem 0.75rem",
                                      backgroundColor: "white",
                                      border: "1px solid #0ea5e920",
                                      borderRadius: "6px",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        "#f0f9ff";
                                      e.target.style.borderColor = "#0ea5e940";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = "white";
                                      e.target.style.borderColor = "#0ea5e920";
                                    }}
                                  >
                                    <i className="fa fa-download" />
                                    Baixar Material
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {fileName && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "0.75rem",
                              borderRadius: "6px",
                              border: "1px solid #e9ecef",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              marginTop: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  color: "#6c757d",
                                  fontSize: "0.8rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                              >
                                📎 Arquivo Anexado
                              </span>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f8f9fa",
                                padding: "1rem",
                                borderRadius: "6px",
                                border: "1px solid #dee2e6",
                                lineHeight: "1.6",
                                fontSize: "0.9rem",
                                color: "#495057",
                                cursor: base64String ? "pointer" : "default",
                              }}
                              onClick={() => {
                                if (base64String) {
                                  const link = document.createElement("a");
                                  link.href = `data:${fileType};base64,${base64String}`;
                                  link.download = fileName;
                                  link.click();
                                }
                              }}
                            >
                              {fileName}

                              {base64String && "👆 Clique para baixar"}
                            </div>
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {category == "Marcar Reposição" && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: "1.2rem",
                    borderRadius: "6px",
                    border: "1px solid #ffeaa7",
                  }}
                >
                  <div style={{ display: !seeReplenish ? "block" : "none" }}>
                    <button
                      onClick={() => setSeeReplenish(true)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        fontWeight: "500",
                      }}
                    >
                      {UniversalTexts.calendarModal.reserveTimeForReplacement}
                    </button>
                  </div>
                  <div
                    style={{
                      display: seeReplenish ? "block" : "none",
                      backgroundColor: "#6c757d",
                      color: "white",
                      padding: "1.2rem",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 1rem 0",
                        fontWeight: "500",
                      }}
                    >
                      {UniversalTexts.calendarModal.replaceClassConfirmation}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <button
                        onClick={() => setSeeReplenish(false)}
                        color="red"
                        style={{
                          padding: "5px 1.5rem",
                          fontWeight: "500",
                        }}
                      >
                        ❌ Não
                      </button>
                      <button
                        onClick={handleScheduleReplenish}
                        color="green"
                        style={{
                          padding: "5px 1.5rem",
                          fontWeight: "500",
                        }}
                      >
                        ✅ Sim
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nova Seção: Criar Nova Aula */}
          <></>

          <div
            style={{
              marginBottom: "1rem",
              background: "#ffffff",
              borderRadius: "6px",
              border: "1px solid #e1e5e9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              padding: "12px 16px",
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
                  position: "relative",
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
              <div style={{ display: "grid", gap: "5px" }}>
                {/* Ações rápidas - Compactas */}
                <div
                  style={{ display: "flex", gap: "6px", alignItems: "center" }}
                >
                  {/* Botão Hoje */}
                  <button
                    disabled={!disabledAvoid}
                    onClick={() => {
                      loadGeneral(new Date());
                    }}
                  >
                    <i className="fa fa-refresh" style={{ fontSize: "10px" }} />
                    <span>{UniversalTexts.calendarModal.today}</span>
                  </button>
                  {authorizeOrNot && (
                    <span>
                      //// //// //// //// //// //// //// //// ////
                      <NewRecurringEventCalendar
                        setAlternateBoolean={setAlternateBoolean}
                        alternateBoolean={alternateBoolean}
                        headers={headers}
                        thePermissions={thePermissions}
                        myId={myId}
                        setChange={setChange}
                        change={change}
                        studentsList={studentsList}
                        groupsList={groupsList}
                      />
                      //// //// //// //// //// //// //// //// ////
                      <ToDoAddButton
                        userId={myId}
                        onCreated={() => {
                          setAlternateBoolean(!alternateBoolean);
                        }}
                      />
                      <NewEventCalendar
                        setAlternateBoolean={setAlternateBoolean}
                        alternateBoolean={alternateBoolean}
                        headers={headers}
                        thePermissions={thePermissions}
                        myId={myId}
                        setChange={setChange}
                        change={change}
                        studentsList={studentsList}
                        groupsList={groupsList}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RouteDiv>
      ) : (
        <RouteSizeControlBox>
          {UniversalTexts.calendarModal.noLoggedUser}
        </RouteSizeControlBox>
      )}
      <Helmets text="Calendar" />
    </>
  );
}

export default MyCalendarRefactor;
