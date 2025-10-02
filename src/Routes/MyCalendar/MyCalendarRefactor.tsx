import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HOne,
  HTwo,
  RouteDiv,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";
import {
  alwaysWhite,
  partnerColor,
  textGeneralFont,
  textpartnerColorContrast,
  transparentWhite,
} from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { CircularProgress } from "@mui/material";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  onLoggOutFee,
  truncateString,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { StyledDiv } from "./CalendarComponents/MyCalendarFunctions/MyCalendar.Styled";
import Helmets from "../../Resources/Helmets";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import HTMLEditor from "../../Resources/Components/HTMLEditor";
import {
  categoryList,
  convertToBase64,
  getEmbedUrl,
  getLastMonday,
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import ToDoAddButton from "./CalendarComponents/ToDo/ToDoNew";
import {
  inputCheckBox,
  spanChecked,
  styleLiChecked,
} from "./CalendarComponents/MyCalendarFunctions/MyCalendarFunctions.Styles";
import NewEventCalendar from "./CalendarComponents/NewEventCalendar/NewEventCalendar";
import NewRecurringEventCalendar from "./CalendarComponents/NewRecurringEventCalendar/NewRecurringEventCalendar";
import CardOneEvent from "./CalendarComponents/OneEventCard/CardOneEvent";

interface MyCalendarRefactorProps {
  headers: any; // substitua pelo tipo real se souber a estrutura
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
}

function MyCalendarRefactor({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
}: MyCalendarRefactorProps) {
  const [shouldScrollToToday, setShouldScrollToToday] = useState<any | null>(
    true
  );
  const [isVisible, setIsVisible] = useState<any | null>(false);
  const [deleteVisible, setDeleteVisible] = useState<any | null>(false);
  const [postNew, setPostNew] = useState<any | null>(false);
  const [showEditForm, setShowEditForm] = useState<any | null>(false);
  const [POSTNEWINFOCLASS, setPOSTNEWINFOCLASS] = useState<any | null>(false);
  const [loadingInfo, setLoadingInfo] = useState<any | null>(true);
  const [alternateText, setAlternateText] = useState<any | null>(
    "... Updating Class"
  );
  const [modalEditTodo, setModalEditTodo] = useState<any | null>(false);
  const [descriptionChecklistToEdit, setDescriptionChecklistToEdit] = useState<
    any | null
  >("");
  const [editingIndex, setEditingIndex] = useState<any | null>(null);
  const [alternateBoolean, setAlternateBoolean] = useState<any | null>(false);

  const [loading, setLoading] = useState<any | null>(true);
  const [date, setDate] = useState<any | null>("");
  const [theTime, setTheTime] = useState<any | null>("");
  const [link, setLink] = useState<any | null>("");
  const [description, setDescription] = useState<any | null>("");
  const [theGroup, setTheGroup] = useState<any | null>("");
  const [video, setVideo] = useState<any | null>("");
  const [googleDriveLink, setGoogleDriveLink] = useState<any | null>("");
  const [homework, setHomework] = useState<any | null>("");
  const [dueDate, setDueDate] = useState<any | null>(
    new Date().toISOString().split("T")[0]
  );
  const [base64String, setBase64String] = useState<any | null>("");
  const [fileName, setFileName] = useState<any | null>("");
  const [fileType, setFileType] = useState<any | null>("");
  const [flashcards, setFlashcards] = useState<any | null>("");
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [uploading, setUploading] = useState<any | null>(false);
  const [category, setCategory] = useState<any | null>("");
  const [newStudentId, setNewStudentId] = useState<any | null>("");
  const [newGroupId, setNewGroupId] = useState<any | null>("");
  const [loadingModalInfo, setLoadingModalInfo] = useState<any | null>(false);
  const [eventFull, setEventFull] = useState<any | null>({});
  const [newEventId, setNewEventId] = useState<any | null>("");
  const [studentsList, setStudentsList] = useState<any | null>([]);
  const [groupsList, setGroupsList] = useState<any | null>([]);
  const [events, setEvents] = useState<any | null>([]);
  const [isTutoring, setIsTutoring] = useState<any | null>(false);
  const [homeworkAdded, setHomeworkAdded] = useState<any | null>(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState<any | null>(false);
  const [showHomework, setShowHomework] = useState<any | null>(false);
  const [showFlashcards, setShowFlashcards] = useState<any | null>(false);
  const [showEditSection, setShowEditSection] = useState<any | null>(false);
  const [editDescription, setEditDescription] = useState<any | null>("");
  const [editDate, setEditDate] = useState<any | null>("");
  const [editCategory, setEditCategory] = useState<any | null>("");
  const [seeReplenish, setSeeReplenish] = useState<any | null>(false);
  const [status, setStatus] = useState<any | null>("");
  const [groupName, setGroupName] = useState<any | null>("");
  const [groupId, setGroupId] = useState<any | null>("");
  const [duration, setDuration] = useState<any | null>(60);
  const [name, setName] = useState<any | null>("");
  const [eventId, setEventId] = useState<any | null>("");
  const [numberOfWeeks, setNumberOfWeeks] = useState<any | null>(4);
  const [loadingDescription, setLoadingDescription] = useState<any | null>(
    false
  );
  const [loadingHWDescription, setLoadingHWDescription] = useState<any | null>(
    false
  );

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
    setNumberOfWeeks(4);
    setBase64String("");
    setFileName("");
    setFileType("");
    setFlashcards("");
    setSelectedFile(null);
    setUploading(false);
    setCategory("");
    setNewStudentId("");
    setNewGroupId("");
    setTheTime("");
    setLink("");
    setDescription("");
    setVideo("");
    setGoogleDriveLink("");
    setHomework("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setGroupsList([]);
    setStudentsList([]);
    setGroupsList([]);
    setShowEditForm(false);
    setShowHomework(false);
    setShowFlashcards(false);
    setLoading(false);
  };
  const handleClassSummary = async () => {
    setLoadingDescription(true);
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myId}`,
          { description, classTitle: theLesson?.title },
          { headers }
        );
        const adapted = response.data.adapted;
        setDescription(adapted);
        setLoadingDescription(false);
        setChange(!change);
      } catch (error: any) {
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
      } catch (error: any) {
        setLoadingHWDescription(false);
        console.log(error, "Erro");
        notifyAlert(error?.response?.data?.message);
      }
    }
  };

  var hj = new Date();
  var lm = getLastMonday(hj);
  const [task, setTask] = useState<any | null>({});
  const [disabledAvoid, setDisabledAvoid] = useState<any | null>(true);
  const [today, setTheToday] = useState<any | null>(lm);
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
    } else {
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
      } catch (error: any) {
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
      } catch (error: any) {
        console.log(error, "Erro ao encontrar grupos");
      }
    }
  };

  const fetchTodo = async (id: any) => {
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/todo/${myId}?todoId=${id}`,
          { headers }
        );
        setTask(response.data.todo);
        setModalEditTodo(true);
      } catch (error: any) {
        console.log(error, "Erro ao encontrar alunos");
      }
    }
  };

  const [todoList, setTodoList] = useState<any | null>([]);

  const loadGeneral = async (baseDate: any) => {
    setShowDeleteEventConfirmation(false);
    setDisabledAvoid(false);
    setLoading(true);
    setShouldScrollToToday(!!baseDate === false); // opcional

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
      const addOneDayAndFormat = (dt: any) => {
        const d = new Date(dt);
        d.setDate(d.getDate() + 1);
        return formattedDates(d);
      };
      const normalizeEvent = (ev: any) => ({
        ...ev,
        date: addOneDayAndFormat(ev.date),
        status: ev.status || "marcado",
      });

      const normalizeTodo = (td: any) => ({
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
    } catch (error: any) {
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

  const handleChangeWeek = async (sum: any) => {
    setShowDeleteEventConfirmation(false);
    setDisabledAvoid(false);

    const chosen = new Date(today);
    chosen.setDate(chosen.getDate() + sum);
    loadGeneral(chosen);
  };

  const handleDateChange = async (e: any) => {
    const targetDate = new Date(e.target.value);
    loadGeneral(targetDate);
  };
  var [studentsInGroup, setStudentsInGroup] = useState<any | null>([
    {
      _id: "",
      lastname: "",
      name: "",
    },
  ]);
  const [comments, setComments] = useState<any | null>([]);
  useEffect(() => {
    if (studentsInGroup.length > 0) {
      setComments(
        studentsInGroup.map((student: any) => ({
          studentId: student._id,
          comment: "",
        }))
      );
    }
  }, [studentsInGroup]);

  // Função para atualizar o comentário de um aluno específico
  const handleStudentDescriptionChange = (index: any, value: any) => {
    setComments((prev: any) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], comment: value };
      return updated;
    });
  };

  const [lastFew, setLastFew] = useState<any | null>([]);
  const [showLastFew, setShowLastFew] = useState<any | null>(false);

  const fetchOneEvent = async (id: any) => {
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
    } catch (error: any) {
      console.log(error, "Erro ao encontrarssss alunos");
      setLoadingModalInfo(false);
    }
  };
  const fetchOneSetOfTutorings = async (studentId: any) => {
    if (!studentId) return;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${studentId}`,
        {
          headers,
        }
      );
      const tutorings = response.data.tutorings;
    } catch (error: any) {
      console.log(error, "Erro ao encontrar alunos");
    }
  };

  const fetchOneSetOfGroups = async (groupID: any) => {
    if (!groupID) return;
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/groupsrecurrentevents/${groupID}`,
        {
          headers,
        }
      );
      const groups = response.data.tutorings;
    } catch (error: any) {
      console.log(error, "Erro ao encontrar alunos");
    }
  };

  const postNewEvent = async () => {
    setLoadingInfo(true);
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
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
    } catch (error: any) {
      console.log(error, "Erro ao criar evento");
    }
  };
  const deleteOneMaterial = async (id: any) => {
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
    } catch (error: any) {
      console.log(error, "Erro ao excluir evento");
    }
  };
  const deleteOneMaterialInside = () => {
    deleteOneMaterial(newEventId);
  };

  const editOneEvent = async (id: any) => {
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
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");

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
    } catch (error: any) {
      console.log(error, "Erro ao criar evento");
    }
  };
  const editInside = () => {
    editOneEvent(newEventId);
  };

  const updateScheduled = async (id: any) => {
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
    } catch (error: any) {
      console.log(error, "Erro ao atualizar evento");
    }
  };
  const updateUnscheduled = async (id: any) => {
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
    } catch (error: any) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  const updateRealizedClass = async (id: any) => {
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
    } catch (error: any) {
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

  const handleCloseModal = (chosenDate: any) => {
    setSeeReplenish(false);
    setIsVisible(false);
    setNewStudentId("");
    setTheTime("");
    setDescription("");
    setShowEditForm(false);
    clearFile();
    setDueDate(new Date().toISOString().split("T")[0]);
    setFlashcards("");
    loadGeneral(new Date(chosenDate ? chosenDate : new Date()));
  };

  const handleFileChange = async (event: any) => {
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
      } catch (error: any) {
        console.error("Erro ao processar arquivo:", error);
        setUploading(false);
      }
    } else {
      clearFile();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setBase64String("");
    setFileName("");
    setFileType("");
  };

  const handleStudentChange = (e: any) => {
    setNewStudentId(e.target.value);
    setNewGroupId("");
  };

  const [showAIGENERATED, setShowAIGENERATED] = useState<any | null>(false);

  const handleHomeworkChange = (htmlContent: any) => {
    setHomework(htmlContent);
  };

  const seeDelete = () => {
    setDeleteVisible(!deleteVisible);
  };
  const [lessonsList, setLessonsList] = useState<any | null>([]);
  const [theLesson, setTheLesson] = useState<any | null>(null);
  const [theLessonLast, setTheLessonLast] = useState<any | null>(null);

  const getClasses = async () => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const { data } = await axios.get(
          `${backDomain}/api/v1/courses-organized/${myId}`,
          { headers }
        );
        const res = data?.lessons ?? [];
        setLessonsList(res);
      } catch (error: any) {
        console.log(error, "Erro ao encontrar cursos");
      }
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  const grouped = useMemo(() => {
    const byCourse: { [course: string]: { [module: string]: any[] } } = {};
    for (const lesson of lessonsList) {
      const course = lesson.course ?? "Sem curso";
      const module = lesson.module ?? "Sem módulo";
      byCourse[course] ||= {};
      byCourse[course][module] ||= [];
      byCourse[course][module].push(lesson);
    }
    return byCourse;
  }, [lessonsList]); // <<< DEPENDÊNCIAS CORRETAS

  const handleLessonChange = (e: any) => {
    const id = e.target.value;
    if (!id || id.startsWith("sep:")) return; // segurança extra
    // garanta a comparação como string
    const found =
      lessonsList.find((lesson: any) => String(lesson.id) === id) || null;
    setTheLesson(found);
  };
  const handleCategoryChange = (e: any) => {
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

  const handleSeeModal = (e: any) => {
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

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    futureDates.push(date);
  }

  const calendarRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

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
              } catch (error: any) {
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
            onChange={(e: any) => {
              setDescriptionChecklistToEdit(e.target.value);
              try {
                updateChecklistTaskDescripton(i, task._id, e.target.value);
              } catch (error: any) {
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
      const containerWidth = container?.offsetWidth;
      const todayWidth = todayElement?.offsetWidth;
      const todayLeft = todayElement?.offsetLeft;
      const scrollLeft = todayLeft - containerWidth / 2 + todayWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [loading, futureDates]);

  const formattedDates = (dateString: any) => {
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

  function newFormatDate(date: any) {
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
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id } = user;

      const response = await axios.put(
        `${backDomain}/api/v1/scheduleclass/${id}?eventId=${eventId}`,
        {
          headers,
        }
      );
      setShowAIGENERATED(false);
      loadGeneral(new Date());
      handleCloseModal(new Date());
    } catch (error: any) {
      console.error(error);
    }
  };

  const updateChecklistTask = async (index: any, taskID: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id } = user;
      const response = await axios.put(
        `${backDomain}/api/v1/todochecklist/${id}?todoId=${taskID}&checkList=${index}`,
        {
          headers,
        }
      );
      setShowAIGENERATED(false);
      fetchTodo(taskID);
    } catch (error: any) {
      console.error(error);
    }
  };
  const updateChecklistTaskDescripton = async (
    index: any,
    taskID: any,
    desc: any
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id } = user;
      const response = await axios.put(
        `${backDomain}/api/v1/todochecklistname/${id}?todoId=${taskID}&checkList=${index}&newDescription=${desc}`,
        {
          headers,
        }
      );
      fetchTodo(taskID);
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleUpdateInfoTask = async (taskID: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
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
      setSeeReplenish(false);
      setShowEditSection(false);
      loadGeneral(new Date(editDate));
    } catch (error: any) {
      console.error(error);
    }
  };
  const [showDeleteEventConfirmation, setShowDeleteEventConfirmation] =
    useState<any | null>(false);
  const handleDeleteTask = async (taskID: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id } = user;

      const response = await axios.delete(
        `${backDomain}/api/v1/todo/${id}?todoId=${taskID}`,
        {
          headers,
        }
      );
      setSeeReplenish(false);
      setShowEditSection(false);
      setShowDeleteEventConfirmation(false);
      loadGeneral(new Date());
    } catch (error: any) {
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
                  onClick={(e: any) => e.stopPropagation()}
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
                          onChange={(e: any) =>
                            setEditDescription(e.target.value)
                          }
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
                          onChange={(e: any) => setEditDate(e.target.value)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <select
                          value={editCategory}
                          onChange={(e: any) => setEditCategory(e.target.value)}
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
                                  onChange={(e: any) =>
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
                                  onKeyDown={(e: any) => {
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
            <HOne>
              REFATORADO REFATORADO REFATORADO {UniversalTexts.calendar}
            </HOne>
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
                                (event: any) =>
                                  event.date.toDateString() ===
                                  date.toDateString()
                              )
                              .map((todo: any, idx: any) => (
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
                            (event: any) =>
                              event.date.toDateString() === date.toDateString()
                          )
                          .sort((a: any, b: any) => {
                            const timeA =
                              parseInt(a.time.split(":")[0]) * 60 +
                              parseInt(a.time.split(":")[1]);
                            const timeB =
                              parseInt(b.time.split(":")[0]) * 60 +
                              parseInt(b.time.split(":")[1]);
                            return timeA - timeB;
                          })
                          .map((event: any, eventIndex: any) => {
                            
                            return (
                              <div
                                key={`${event._id}-${eventIndex}`}
                                onClick={() => handleSeeModal(event)}
                              >
                                <CardOneEvent
                                  headers={headers}
                                  thePermissions={thePermissions}
                                  myId={myId}
                                  setChange={setChange}
                                  change={change}
                                  alternateBoolean={alternateBoolean}
                                  event={event}
                                  eventIndex={eventIndex}
                                  setAlternateBoolean={setAlternateBoolean}
                                />
                              </div>
                            );
                          })}

                        {events.filter(
                          (event: any) =>
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
                        onMouseEnter={(e: any) =>
                          (e.target.style.color = partnerColor())
                        }
                        onMouseLeave={(e: any) =>
                          (e.target.style.color = "#998")
                        }
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
                                onMouseEnter={(e: any) => {
                                  e.target.style.transform = "translateY(-2px)";
                                  e.target.style.boxShadow =
                                    "0 6px 20px rgba(0,0,0,0.2)";
                                }}
                                onMouseLeave={(e: any) => {
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
                                    onMouseEnter={(e: any) => {
                                      e.target.style.backgroundColor =
                                        "#5a6268";
                                    }}
                                    onMouseLeave={(e: any) => {
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
                                                onChange={(e: any) =>
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
                                                onFocus={(e: any) => {
                                                  e.target.style.borderColor =
                                                    partnerColor();
                                                  e.target.style.outline =
                                                    "none";
                                                  e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                }}
                                                onBlur={(e: any) => {
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
                                              onChange={(e: any) =>
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
                                              onFocus={(e: any) => {
                                                e.target.style.borderColor =
                                                  partnerColor();
                                                e.target.style.outline = "none";
                                                e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                              }}
                                              onBlur={(e: any) => {
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
                                              onChange={(e: any) =>
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
                                              onFocus={(e: any) => {
                                                e.target.style.borderColor =
                                                  partnerColor();
                                                e.target.style.outline = "none";
                                                e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                              }}
                                              onBlur={(e: any) => {
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
                                                        modules as Record<
                                                          string,
                                                          any
                                                        >
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
                                                          {ls.map((l: any) => (
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
                                              onMouseEnter={(e: any) => {
                                                e.target.style.backgroundColor =
                                                  "#f8f9fa";
                                                e.target.style.borderColor =
                                                  "#dee2e6";
                                                e.target.style.color =
                                                  "#495057";
                                              }}
                                              onMouseLeave={(e: any) => {
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
                                                      onClick={(e: any) => {
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
                                                    (
                                                      student: any,
                                                      index: number
                                                    ) => (
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
                                                          onChange={(e: any) =>
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
                                                onChange={(e: any) =>
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
                                                onFocus={(e: any) => {
                                                  e.target.style.borderColor =
                                                    partnerColor();
                                                  e.target.style.outline =
                                                    "none";
                                                  e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                }}
                                                onBlur={(e: any) => {
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
                                                    onMouseEnter={(e: any) => {
                                                      e.target.style.backgroundColor =
                                                        "#f8f9fa";
                                                      e.target.style.borderColor =
                                                        "#dee2e6";
                                                      e.target.style.color =
                                                        "#495057";
                                                    }}
                                                    onMouseLeave={(e: any) => {
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
                                                        onChange={(e: any) => {
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
                                                        onFocus={(e: any) => {
                                                          e.target.style.borderColor =
                                                            partnerColor();
                                                          e.target.style.outline =
                                                            "none";
                                                          e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                                                        }}
                                                        onBlur={(e: any) => {
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
                                                (
                                                  student: any,
                                                  index: number
                                                ) => (
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
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                              onChange={(e: any) =>
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
                                            onChange={(e: any) =>
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
                                            onChange={(e: any) =>
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
                                  onMouseEnter={(e: any) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = partnerColor();
                                    el.style.color = "white";
                                    el.style.transform = "translateY(-2px)";
                                    el.style.boxShadow =
                                      "0 4px 8px rgba(0,0,0,0.15)";
                                  }}
                                  onMouseLeave={(e: any) => {
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
                                  onMouseEnter={(e: any) => {
                                    const el = e.currentTarget;
                                    el.style.backgroundColor = partnerColor();
                                    el.style.color = "white";
                                    el.style.transform = "translateY(-2px)";
                                    el.style.boxShadow =
                                      "0 4px 8px rgba(0,0,0,0.15)";
                                  }}
                                  onMouseLeave={(e: any) => {
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
                                onMouseOver={(e: any) =>
                                  (e.currentTarget.style.textDecoration =
                                    "underline")
                                }
                                onMouseOut={(e: any) =>
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
                                width: "90%",
                              }}
                            >
                              {!showLastFew && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#6c757d",
                                    margin: " 10px 0",
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
                                  onMouseOver={(e: any) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#fff")
                                  }
                                  onMouseOut={(e: any) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "transparent")
                                  }
                                  onClick={() => setShowLastFew(!showLastFew)}
                                >
                                  Última aula
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
                                  {lastFew.map((evt: any, idx: any) => (
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
                                      onMouseEnter={(e: any) =>
                                        (e.currentTarget.style.boxShadow =
                                          "0 2px 6px rgba(0,0,0,0.08)")
                                      }
                                      onMouseLeave={(e: any) =>
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
                                          onMouseOver={(e: any) =>
                                            (e.currentTarget.style.color =
                                              partnerColor())
                                          }
                                          onMouseDown={(e: any) =>
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
                                              onMouseOver={(e: any) =>
                                                (e.currentTarget.style.textDecoration =
                                                  "underline")
                                              }
                                              onMouseOut={(e: any) =>
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
                                      onMouseEnter={(e: any) => {
                                        e.target.style.textDecoration =
                                          "underline";
                                      }}
                                      onMouseLeave={(e: any) => {
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
                              onMouseEnter={(e: any) => {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow =
                                  "0 4px 8px rgba(0, 0, 0, 0.15)";
                              }}
                              onMouseLeave={(e: any) => {
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
                                    onMouseEnter={(e: any) => {
                                      e.target.style.backgroundColor =
                                        "#f0f9ff";
                                      e.target.style.borderColor = "#0ea5e940";
                                    }}
                                    onMouseLeave={(e: any) => {
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
          {/*Modal de nossos/edição de eventos particulares */}
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
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
                {/* Alterador de Semanas */}
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
                      fontSize: "11px",
                      minWidth: "70px",
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
              </div>
              {/* Ações do professor - Compactas */}
              {authorizeOrNot && (
                <div
                  style={{ display: "flex", gap: "4px", alignItems: "center" }}
                >
                  <NewRecurringEventCalendar
                    setAlternateBoolean={setAlternateBoolean}
                    alternateBoolean={alternateBoolean}
                    headers={headers}
                    myId={myId}
                    setChange={setChange}
                    change={change}
                    studentsList={studentsList}
                    groupsList={groupsList}
                  />
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
                </div>
              )}
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
