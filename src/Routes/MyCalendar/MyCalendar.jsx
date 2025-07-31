import React, { useEffect, useRef, useState } from "react";
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
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import moment from "moment";
import { StyledDiv } from "./MyCalendar.Styled";
import Helmets from "../../Resources/Helmets";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import HTMLEditor from "../../Resources/Components/HTMLEditor";

// Function to convert video URLs to embed URLs
const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube URL patterns
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo URL patterns
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // If it's already an embed URL or other format, return as is
  return url;
};

// File handling functions
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function MyCalendar({ headers, thePermissions, myId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [postNew, setPostNew] = useState(false);
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // Novo estado para controlar a exibição do formulário de edição
  const [POSTNEWINFOCLASS, setPOSTNEWINFOCLASS] = useState(false); // Novo estado para controlar a exibição do formulário de edição
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [alternateText, setAlternateText] = useState("... Updating Class");

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

  const [loadingModalTutoringsInfo, setLoadingModalTutoringsInfo] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [theTime, setTheTime] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
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
  const [tutoringsListOfOneStudent, setTutoringsListOfOneStudent] = useState(
    []
  );

  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [eventFull, setEventFull] = useState({});
  const [loadingTutoringDays, setLoadingTutoringDays] = useState(false);
  const [newEventId, setNewEventId] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [events, setEvents] = useState([]);
  const [isTutoring, setIsTutoring] = useState(false);
  const [homeworkAdded, setHomeworkAdded] = useState(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState(false);
  const [seeReplenish, setSeeReplenish] = useState(false);
  const [status, setStatus] = useState("");
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

  // Estados específicos para criar nova aula
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [newClass, setNewClass] = useState({
    date: "",
    time: "",
    link: "",
    description: "",
    category: "",
    studentID: "",
  });
  const [loadingNewClass, setLoadingNewClass] = useState(false);
  const getLastMonday = (targetDate) => {
    const date = new Date(targetDate);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const lastMonday = new Date(date.setDate(diff));
    return lastMonday;
  };

  var hj = new Date();
  var lm = getLastMonday(hj);

  const [disabledAvoid, setDisabledAvoid] = useState(true);
  const [today, setTheToday] = useState(lm);
  const { UniversalTexts } = useUserContext();

  const futureDates = [];

  const fetchStudents = async () => {
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          {
            headers,
          }
        );
        const res = response.data.listOfStudents;
        setStudentsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar alunos");
      }
    } else {
      console.log("Not Fetching students list");
    }
  };

  const [isFee, setIsFee] = useState(true);

  const fetchGeneralEvents = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn"));
      const { id, feeUpToDate } = user;
      updateInfo(id, headers);
      setIsFee(feeUpToDate);

      if (!feeUpToDate) {
        onLoggOutFee();
      } else {
      }

      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}?today=${today}`,
        {
          headers,
        }
      );
      const res = response.data.eventsList;
      const eventsLoop = res.map((event) => {
        const nextDay = new Date(event.date);
        nextDay.setDate(nextDay.getDate() + 1);
        event.date = formattedDates(nextDay);

        return event;
      });
      setEvents(eventsLoop);
      console.log(eventsLoop);
      setLoading(false);
    } catch (error) {
      notifyAlert(error.response.data.error, partnerColor());
      setTimeout(() => {
        onLoggOut();
      }, 1000);
    }
  };
  useEffect(() => {
    fetchGeneralEvents();
  }, []);
  const fetchGeneralEventsNoLoading = async () => {
    setPostNew(false);
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    if (user.permissions == "superadmin" || user.permissions == "teacher") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/eventsgeneral/${id}?today=${today}`,
          {
            headers,
          }
        );
        const res = response.data.eventsList;
        const eventsLoop = res.map((event) => {
          const nextDay = new Date(event.date);
          nextDay.setDate(nextDay.getDate() + 1);
          event.date = formattedDates(nextDay);
          // Garantir que todos os eventos tenham um status
          if (!event.status) {
            event.status = "marcado"; // Status padrão para eventos sem status
          }
          return event;
        });
        setEvents(eventsLoop);
      } catch (error) {
        console.log(error);
      }
    } else {
      null;
    }
  };
  const changeToday = async (e) => {
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    setLoading(true);
    const targetDate = new Date(e.target.value);
    const newDate = getLastMonday(targetDate); // Obtém a última segunda-feira em relação à data escolhida
    setTheToday(newDate);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}?today=${newDate}`,
        {
          headers,
        }
      );
      const res = response.data.eventsList;
      const eventsLoop = res.map((event) => {
        const nextDay = new Date(event.date);
        nextDay.setDate(nextDay.getDate() + 1);
        event.date = formattedDates(nextDay);
        // Garantir que todos os eventos tenham um status
        if (!event.status) {
          event.status = "marcado"; // Status padrão para eventos sem status
        }
        return event;
      });
      setEvents(eventsLoop);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
      console.log(error);
    }
  };
  const handleChangeWeek = async (sum) => {
    setDisabledAvoid(false);
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    setLoading(true);
    const chosenDate = today;
    chosenDate.setDate(chosenDate.getDate() + sum);
    const newDate = getLastMonday(chosenDate);
    setTheToday(newDate);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}?today=${newDate}`,
        {
          headers,
        }
      );
      const res = response.data.eventsList;
      const eventsLoop = res.map((event) => {
        const nextDay = new Date(event.date);
        nextDay.setDate(nextDay.getDate() + 1);
        event.date = formattedDates(nextDay);
        // Garantir que todos os eventos tenham um status
        if (!event.status) {
          event.status = "marcado"; // Status padrão para eventos sem status
        }
        return event;
      });
      setEvents(eventsLoop);
      setTimeout(() => {
        setLoading(false);
        setDisabledAvoid(true);
      }, 100);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
      console.log(error);
    }
  };
  const handleBackToToday = async () => {
    setDisabledAvoid(false);
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    setLoading(true);
    const todayy = new Date();
    const newDate = getLastMonday(todayy);
    setTheToday(newDate);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}?today=${newDate}`,
        {
          headers,
        }
      );
      const res = response.data.eventsList;
      const eventsLoop = res.map((event) => {
        const nextDay = new Date(event.date);
        nextDay.setDate(nextDay.getDate() + 1);
        event.date = formattedDates(nextDay);
        // Garantir que todos os eventos tenham um status
        if (!event.status) {
          event.status = "marcado"; // Status padrão para eventos sem status
        }
        return event;
      });
      setEvents(eventsLoop);
      setTimeout(() => {
        setLoading(false);
        setDisabledAvoid(true);
      }, 100);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
      console.log(error);
    }
  };
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

      // Mapear status do backend para frontend
      let mappedStatus = newStatus;
      if (newStatus === "marcado") {
        mappedStatus = "Scheduled";
      } else if (newStatus === "desmarcado") {
        mappedStatus = "Canceled";
      } else if (newStatus === "realizada") {
        mappedStatus = "Realized";
      }
      setFlashcardsAdded(newFlashcardsAdded);
      setHomeworkAdded(newHomeworkAdded);
      setName(newStudent);
      setStatus(mappedStatus);
      setCategory(newCategory);
      setNewStudentId(newStudentID);
      setNewEventId(newEventId);
      setLink(newLink);
      setTheTime(newTime);
      setVideo(newVideo);
      setHomework(newHomework);
      setGoogleDriveLink(newGoogleDriveLink);
      //somar 7 dias abaixo para pegar a data correta
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
      console.log("Evento carregado:", response.data.event);
    } catch (error) {
      console.log(error, "Erro ao encontrarssss alunos");
      console.log(error);
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
      setTutoringsListOfOneStudent(response.data.tutorings);
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
      fetchGeneralEvents();
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
        fetchGeneralEvents();
      }
    } catch (error) {
      console.log(error, "Erro ao excluir evento");
      console.log(error);
    }
  };
  const deleteOneMaterialInside = () => {
    deleteOneMaterial(newEventId);
  };

  const editOneEvent = async (id) => {
    setLoadingInfo(true);
    try {
      // Converter status do frontend para o backend
      let backendStatus = status;
      if (status === "Scheduled") {
        backendStatus = "marcado";
      } else if (status === "Canceled") {
        backendStatus = "desmarcado";
      } else if (status === "Realized") {
        backendStatus = "realizada";
      }

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
          base64String,
          fileName,
          fileType,
          newFlashcards: flashcards,
          description,
          POSTNEWINFOCLASS,
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
        fetchGeneralEvents();
      }
    } catch (error) {
      console.log(error, "Erro ao criar evento");
      console.log(error);
    }
  };
  const editInside = () => {
    editOneEvent(newEventId);
  };

  const updateScheduled = async (id) => {
    console.log(status, "STATUS");

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
        // Buscar o evento atualizado do backend para garantir o status correto
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
    }
  };
  const updateUnscheduled = async (id) => {
    console.log(status, "STATUS");

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
        // Buscar o evento atualizado do backend para garantir o status correto
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
    }
  };

  const reminderEmail = async (id) => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/eventreminder/${id}`,
        {},
        { headers }
      );
      alert("E-mail lembrete enviado");
    } catch (error) {
      console.log(error, "Erro ao enviar e-mail");
      console.log(error);
    }
  };

  const updateRealizedClass = async (id) => {
    console.log(status, "STATUS");
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
        // Buscar o evento atualizado do backend para garantir o status correto
        fetchOneEvent(id);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
    }
  };

  const updateOneTutoring = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoringevent`,
        {
          id: tutoringId,
          studentID: newStudentId,
          day: weekDay,
          time: timeOfTutoring,
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
      console.log(error);
    }
  };

  const newTutoring = async () => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/tutoringevent`,
        {
          day: theNewWeekDay,
          time: theNewTimeOfTutoring,
          link: theNewLink,
          studentID: newStudentId,
        },
        {
          headers,
        }
      );
      if (response) {
        setSeeEditTutoring(false);

        fetchOneSetOfTutorings(newStudentId);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
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
          },
          headers,
        }
      );
      if (response) {
        setSeeEditTutoring(false);

        fetchOneSetOfTutorings(newStudentId);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
    }
  };

  useEffect(() => {
    if (newStudentId !== "") {
      fetchOneSetOfTutorings(newStudentId);
    }
  }, [newStudentId]);

  // ModalControls
  const handleSeeModalNew = () => {
    // Abre a seção de criar nova aula ao invés do modal
    setShowNewClassForm(true);
    fetchStudents();
    // Reset dos campos da nova aula
    setNewClass({
      date: "",
      time: "",
      link: "",
      description: "",
      category: "",
      studentId: "",
    });
  };

  // Funções para gerenciar a nova seção de criar aula
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
    setNewClass((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    setNewClass((prev) => ({
      ...prev,
      category,
      description,
    }));
  };

  const handleCreateNewClass = async () => {
    setLoadingNewClass(true);
    try {
      const payload = {
        date: newClass.date,
        time: newClass.time,
        link: newClass.link,
        description: newClass.description,
        category: newClass.category,
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
        fetchGeneralEvents(); // Atualiza a lista de eventos
      }
    } catch (error) {
      console.log(error, "Erro ao criar nova aula");
      notifyAlert("Erro ao criar aula. Tente novamente.", partnerColor());
    } finally {
      setLoadingNewClass(false);
    }
  };

  const seeEditOneTutoring = (e) => {
    setSeeEditTutoring(true);
    fetchStudents();
    setTutoringId(e.id);
    setSeeReplenish(false);
    setLink(e.link);
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setTimeOfTutoring(e.time);
    setWeekDay(e.day);
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

  const handleCloseModal = () => {
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
    setShowEditForm(false); // Reset do formulário de edição

    // Clear file upload fields
    clearFile();
    setDueDate(new Date().toISOString().split("T")[0]);
    setFlashcards("");

    fetchGeneralEventsNoLoading();
  };

  // File handling functions
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

  const handleSeeModalOfTutorings = () => {
    setNewStudentId("");
    setSeeReplenish(false);
    setTheTime("");
    setWeekDay("");
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setLoadingModalTutoringsInfo(true);
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
    fetchGeneralEvents();
  };

  const handleStudentChange = (e) => {
    setNewStudentId(e.target.value);
  };

  const handleTheNewWeekDayChange = (e) => {
    setTheNewWeekDay(e.target.value);
  };

  const handleTheNewTimeChange = (e) => {
    setTheNewTimeOfTutoring(e.target.value);
  };

  const handleHomeworkChange = (htmlContent) => {
    setHomework(htmlContent);
  };

  const seeDelete = () => {
    setDeleteVisible(!deleteVisible);
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
      fetchGeneralEvents();
    } else {
      null;
    }
    setDeleteVisible(false);
  };

  // Formulas
  const handleCheckbox1Change = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventchecklist1/${newEventId}`,
        { headers }
      );

      fetchOneEvent(newEventId);
    } catch (error) {
      console.log(error, "Erro");
      console.log(error);
    }
  };

  const handleCheckbox2Change = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventchecklist2/${newEventId}`,
        { headers }
      );
      fetchOneEvent(newEventId);
    } catch (error) {
      console.log(error, "Erro");
      console.log(error);
    }
  };

  const handleCheckbox3Change = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventchecklist3/${newEventId}`,
        { headers }
      );
      fetchOneEvent(newEventId);
    } catch (error) {
      console.log(error, "Erro");
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    futureDates.push(date);
  }

  const calendarRef = useRef(null);
  const todayRef = useRef(null);

  // ...existing code...

  // Adicione este useEffect para centralizar o dia de hoje
  useEffect(() => {
    if (todayRef.current && calendarRef.current && !loading) {
      const container = calendarRef.current;
      const todayElement = todayRef.current;

      // Calcula a posição para centralizar
      const containerWidth = container.offsetWidth;
      const todayWidth = todayElement.offsetWidth;
      const todayLeft = todayElement.offsetLeft;

      const scrollLeft = todayLeft - containerWidth / 2 + todayWidth / 2;

      // Faz o scroll suave
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const times = [
    "6:00",
    "6:15",
    "6:30",
    "6:45",

    "7:00",
    "7:15",
    "7:30",
    "7:45",

    "8:00",
    "8:15",
    "8:30",
    "8:45",

    "9:00",
    "9:15",
    "9:30",
    "9:45",

    "10:00",
    "10:15",
    "10:30",
    "10:45",

    "11:00",
    "11:15",
    "11:30",
    "11:45",

    "12:00",
    "12:15",
    "12:30",
    "12:45",

    "13:00",
    "13:15",
    "13:30",
    "13:45",

    "14:00",
    "14:15",
    "14:30",
    "14:45",

    "15:00",
    "15:15",
    "15:30",
    "15:45",

    "16:00",
    "16:15",
    "16:30",
    "16:45",

    "17:00",
    "17:15",
    "17:30",
    "17:45",

    "18:00",
    "18:15",
    "18:30",
    "18:45",

    "19:00",
    "19:15",
    "19:30",
    "19:45",

    "20:00",
    "20:15",
    "20:30",
    "20:45",

    "21:00",
    "21:15",
    "21:30",
    "21:45",

    "22:00",
    "22:15",
    "22:30",
    "22:45",
  ];

  function newFormatDate(date) {
    let d = new Date(date);
    d.setDate(d.getDate() + 1); // Aumenta um dia na data
    let day = String(d.getDate()).padStart(2, "0");
    let month = String(d.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
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

      fetchGeneralEvents();
      handleCloseModal();
    } catch (error) {
      console.log(error);

      console.error(error);
    }
  };

  return (
    <>
      {headers ? (
        <RouteDiv
          style={{
            width: "96vw",
          }}
        >
          <div>
            <HOne
              style={{
                fontFamily: textTitleFont(),
                color: partnerColor(),
              }}
            >
              {UniversalTexts.calendar}
            </HOne>

            {loading ? (
              <CircularProgress style={{ color: partnerColor() }} />
            ) : (
              <div
                ref={calendarRef}
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
                        borderRadius: "8px",
                        backgroundColor: isToday ? "rgba(0,0,0,0.02)" : "white",
                        boxShadow: isToday
                          ? `0 8px 25px rgba(0,0,0,0.15), 0 0 0 1px ${partnerColor()}20`
                          : "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        minWidth: "280px",
                      }}
                      key={index}
                    >
                      {/* Date Header */}
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

                      {/* Events Container */}
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
                              "Group Class": { bg: "#ff6b35", text: "#fff" },
                              Rep: { bg: partnerColor(), text: "#fff" },
                              Tutoring: { bg: "#111", text: "#fff" },
                              "Prize Class": { bg: "#27ae60", text: "#fff" },
                              Standalone: { bg: "#8e44ad", text: "#fff" },
                              Test: { bg: "#34495e", text: "#fff" },
                              "Marcar Reposição": {
                                bg: "#3498db",
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
                                  borderRadius: "8px",
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
                                  isEventTimeNow(event, hj, date) && (
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
                                            borderRadius: "8px%",
                                            marginRight: "5px",
                                            animation: "pulse 2s infinite",
                                          }}
                                        ></span>
                                        Live Now
                                      </div>
                                    </div>
                                  )}

                                {/* Event Content */}
                                <div
                                  style={{
                                    background: categoryColor.bg,
                                    color: categoryColor.text,
                                    padding: "5px",
                                    position: "relative",
                                  }}
                                >
                                  {/* Category Badge */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      backgroundColor: "rgba(255,255,255,0.2)",
                                      color: categoryColor.text,
                                      padding: "2px 5px",
                                      borderRadius: "8px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.3px",
                                    }}
                                  >
                                    {event.category}
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
                                    {event.student ||
                                      event.description ||
                                      "No description"}
                                  </div>

                                  {/* Time Display */}
                                  <div
                                    style={{
                                      fontWeight: "700",
                                      opacity: 0.9,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "2px",
                                    }}
                                  >
                                    <i className="fa fa-clock-o" style={{}} />
                                    {event.time}
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
                                      Canceled
                                    </>
                                  )}
                                  {(event.status === "marcado" ||
                                    event.status === "Scheduled") && (
                                    <>
                                      <i
                                        className="fa fa-calendar-check-o"
                                        style={{ marginRight: "2px" }}
                                      />
                                      Scheduled
                                    </>
                                  )}
                                  {(event.status === "realizada" ||
                                    event.status === "Completed") && (
                                    <>
                                      <i
                                        className="fa fa-check-circle"
                                        style={{ marginRight: "2px" }}
                                      />
                                      Completed
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
          <>
            {/*Modal de nosos/edição de eventos particulares */}
            <div
              style={{
                backgroundColor: transparentWhite(),
                width: "10000px",
                height: "10000px",
                top: "0",
                left: "0",
                position: "fixed",
                borderRadius: "8px",
                zIndex: 99,
                display: isVisible ? "block" : "none",
              }}
              onClick={handleCloseModal}
            />

            <div
              className="modal box-shadow-white"
              style={{
                position: "fixed",
                display: isVisible ? "block" : "none",
                zIndex: 100,
                backgroundColor: alwaysWhite(),
                width: "90vw",
                height: "85vh",
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
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <HTwo
                      style={{
                        margin: 0,
                        color: partnerColor(),
                      }}
                    >
                      {UniversalTexts.calendarModal.accessEvent}
                    </HTwo>
                    <Xp
                      onClick={handleCloseModal}
                      style={{
                        cursor: "pointer",

                        color: "#999",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = partnerColor())
                      }
                      onMouseLeave={(e) => (e.target.style.color = "#999")}
                    >
                      ×
                    </Xp>
                  </div>
                </div>
              )}
              {/* Event Information */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.2rem",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
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
                    {(thePermissions == "superadmin" ||
                      thePermissions == "teacher") && (
                      <div>
                        <div
                          style={{
                            borderTop: "2px solid #e9ecef",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                          }}
                        >
                          {/* Botão Editar */}
                          {!postNew && !showEditForm && (
                            <div style={{ textAlign: "center" }}>
                              {name && (
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#6c757d",
                                    margin: "0.5rem",
                                  }}
                                >
                                  {name}
                                </p>
                              )}
                              <button
                                onClick={() => {
                                  setShowEditForm(true);
                                  setPOSTNEWINFOCLASS(true);
                                  console.log("Abrindo Edição");
                                }}
                                style={{
                                  padding: "0.5rem 1rem",
                                  backgroundColor: partnerColor(),
                                  color: "white",
                                  border: "none",
                                  borderRadius: "10px",
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
                                Editar Evento
                              </button>
                              {/* Status Icons */}
                              {!postNew && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "1rem",
                                    padding: "0.5rem",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
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

                          {/* Formulário de Edição - só aparece quando showEditForm é true */}
                          {(showEditForm || postNew) && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "1rem",
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
                                <button
                                  onClick={() => {
                                    setShowEditForm(false);
                                    setPOSTNEWINFOCLASS(false);
                                    console.log("Fechando Edição");
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
                                    e.target.style.backgroundColor = "#5a6268";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#6c757d";
                                  }}
                                >
                                  <i
                                    className="fa fa-times"
                                    style={{ marginRight: "0.5rem" }}
                                  />
                                  Fechar Edição
                                </button>
                              </div>

                              {loadingInfo ? (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                  }}
                                >
                                  <CircularProgress
                                    style={{ color: partnerColor() }}
                                  />
                                  {alternateText}
                                </div>
                              ) : (
                                <>
                                  {/* Form */}
                                  <form
                                    style={{
                                      width: "90%",
                                      display: "grid",
                                      gap: "1.5rem",
                                      backgroundColor: "#f9f9f9",
                                      borderRadius: "8px",
                                      border: "1px solid #e5e7eb",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                    }}
                                  >
                                    {/* Seção para Aulas Realizadas */}
                                    {status == "marcado" ||
                                    status == "Realized" ? (
                                      <div
                                        style={{
                                          backgroundColor: "#f9f9f9",
                                          maxWidth: " 90%",
                                          boxSizing: "border-box",
                                          borderRadius: "8px",
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
                                              width: "28px",
                                              height: "28px",
                                              backgroundColor: "#059669",
                                              borderRadius: "6px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <i
                                              className="fa fa-check"
                                              style={{
                                                color: "white",
                                                fontSize: "0.8rem",
                                              }}
                                            />
                                          </div>
                                          <h4
                                            style={{
                                              margin: 0,
                                              color: "#374151",
                                              fontWeight: "500",
                                              fontSize: "1rem",
                                            }}
                                          >
                                            Conteúdo da Aula Realizada
                                          </h4>
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
                                              fontFamily: "inherit",
                                              lineHeight: "1.5",
                                              backgroundColor: "#ffffff",
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
                                              e.target.style.boxShadow = "none";
                                            }}
                                            required
                                          />
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
                                                fontFamily: "inherit",
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
                                              GDLink
                                            </label>
                                            <input
                                              value={googleDriveLink}
                                              onChange={(e) =>
                                                setGoogleDriveLink(
                                                  e.target.value
                                                )
                                              }
                                              placeholder="https://drive.google.com/..."
                                              type="url"
                                              style={{
                                                width: "90%",
                                                padding: "0.75rem",
                                                borderRadius: "6px",
                                                border: "1px solid #d1d5db",
                                                fontSize: "0.875rem",
                                                backgroundColor: "#ffffff",
                                                fontFamily: "inherit",
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
                                          {/* Homework */}
                                          {!homeworkAdded && (
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
                                              <div
                                                style={{
                                                  backgroundColor: "white",
                                                  borderRadius: "8px",
                                                  border: "1px solid #ced4da",
                                                  overflow: "hidden",
                                                }}
                                              >
                                                <HTMLEditor
                                                  onChange={
                                                    handleHomeworkChange
                                                  }
                                                  initialContent={homework}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {/* Due Date */}
                                          {!homeworkAdded && (
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
                                                  fontFamily: "inherit",
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

                                          {/* File Upload */}
                                          {!homeworkAdded && (
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
                                                  fontFamily: "inherit",
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

                                          {/* Flashcards */}
                                          {!flashcardsAdded && (
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
                                                🃏{" "}
                                                {
                                                  UniversalTexts.calendarModal
                                                    .uploadFlashcards
                                                }
                                              </label>
                                              <textarea
                                                value={flashcards || ""}
                                                onChange={(e) => {
                                                  const newValue =
                                                    e.target.value;
                                                  if (newValue.length <= 2000) {
                                                    setFlashcards(newValue);
                                                  }
                                                }}
                                                placeholder={
                                                  UniversalTexts.calendarModal
                                                    .enterFlashcards
                                                }
                                                rows={4}
                                                maxLength={1000}
                                                style={{
                                                  width: "90%",
                                                  padding: "0.75rem",
                                                  borderRadius: "6px",
                                                  border: "1px solid #d1d5db",
                                                  fontSize: "0.875rem",
                                                  backgroundColor: "#ffffff",
                                                  fontFamily: "inherit",
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
                                                    flashcards.length > 900
                                                      ? "#dc3545"
                                                      : "#6c757d",
                                                  marginTop: "0.25rem",
                                                  textAlign: "right",
                                                  width: "90%",
                                                }}
                                              >
                                                {flashcards
                                                  ? `${flashcards.length}/1000 caracteres`
                                                  : "0/1000 caracteres"}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <span>
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
                                            📋{" "}
                                            {
                                              UniversalTexts.calendarModal
                                                .selectCategory
                                            }
                                          </label>
                                          <select
                                            onChange={handleCategoryChange}
                                            name="category"
                                            value={category}
                                            // className="inputs-style"
                                            style={{
                                              width: "100%",
                                              padding: "0.75rem",
                                              borderRadius: "8px",
                                              border: "1px solid #ced4da",
                                              fontSize: "0.9rem",
                                              backgroundColor: "white",
                                            }}
                                          >
                                            <option value="category" hidden>
                                              Select category...
                                            </option>
                                            {[
                                              "Test",
                                              "Standalone",
                                              "Group Class",
                                              "Rep",
                                              "Prize Class",
                                              "Tutoring",
                                              "Marcar Reposição",
                                            ].map((cat, index) => (
                                              <option key={index} value={cat}>
                                                {cat}
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
                                              👤{" "}
                                              {
                                                UniversalTexts.calendarModal
                                                  .selectStudent
                                              }
                                            </label>
                                            <select
                                              // className="inputs-style"
                                              onChange={handleStudentChange}
                                              name="students"
                                              value={newStudentId}
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "8px",
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
                                              // className="inputs-style"
                                              value={date}
                                              onChange={(e) =>
                                                setDate(e.target.value)
                                              }
                                              type="date"
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "8px",
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
                                              // className="inputs-style"
                                              value={theTime}
                                              onChange={(e) =>
                                                setTheTime(e.target.value)
                                              }
                                              type="time"
                                              style={{
                                                width: "100%",
                                                padding: "0.75rem",
                                                borderRadius: "8px",
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
                                            🔗{" "}
                                            {UniversalTexts.calendarModal.link}
                                          </label>
                                          <input
                                            // className="inputs-style"
                                            value={link}
                                            onChange={(e) =>
                                              setLink(e.target.value)
                                            }
                                            placeholder="https://meet.google.com/..."
                                            type="url"
                                            style={{
                                              width: "100%",
                                              padding: "0.75rem",
                                              borderRadius: "8px",
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
                                            📝{" "}
                                            {
                                              UniversalTexts.calendarModal
                                                .classDescription
                                            }
                                          </label>
                                          <input
                                            // className="inputs-style"
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
                                              borderRadius: "8px",
                                              border: "1px solid #ced4da",
                                              fontSize: "0.9rem",
                                              fontFamily: "inherit",
                                              lineHeight: "1.5",
                                            }}
                                            required
                                          />
                                        </div>
                                      </span>
                                    )}
                                  </form>

                                  {/* Checklist */}
                                  {!postNew && (
                                    <div
                                      style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: "1.5rem",
                                        borderRadius: "8px",
                                        border: "1px solid #e9ecef",
                                      }}
                                    >
                                      <h4
                                        style={{
                                          margin: "0 0 1rem 0",
                                          color: partnerColor(),
                                        }}
                                      >
                                        {
                                          UniversalTexts.calendarModal
                                            .taskChecklist
                                        }
                                      </h4>
                                      <div
                                        style={{ display: "grid", gap: "5px" }}
                                      >
                                        {[
                                          {
                                            key: "checkList1",
                                            text: UniversalTexts.calendarModal
                                              .uploadVideo,
                                            handler: handleCheckbox1Change,
                                          },
                                          {
                                            key: "checkList2",
                                            text: UniversalTexts.calendarModal
                                              .uploadClassesToPlatform,
                                            handler: handleCheckbox2Change,
                                          },
                                          {
                                            key: "checkList3",
                                            text: UniversalTexts.calendarModal
                                              .addHomeworkActivities,
                                            handler: handleCheckbox3Change,
                                          },
                                          {
                                            key: "checkList4",
                                            text: UniversalTexts.calendarModal
                                              .uploadFlashcards,
                                            handler: handleCheckbox4Change,
                                          },
                                          {
                                            key: "checkList5",
                                            text: UniversalTexts.calendarModal
                                              .formatMaterial,
                                            handler: handleCheckbox5Change,
                                          },
                                        ].map((item, index) => (
                                          <label
                                            key={index}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                              padding: "5px",
                                              backgroundColor: eventFull[
                                                item.key
                                              ]
                                                ? "#d4edda"
                                                : "white",
                                              borderRadius: "8px",
                                              border: "1px solid #dee2e6",
                                              cursor: "pointer",
                                              transition: "all 0.2s",
                                            }}
                                          >
                                            <input
                                              checked={
                                                eventFull[item.key] || false
                                              }
                                              type="checkbox"
                                              onChange={item.handler}
                                              style={{
                                                width: "18px",
                                                height: "18px",
                                                cursor: "pointer",
                                              }}
                                            />
                                            <span
                                              style={{
                                                color: "#495057",
                                                textDecoration: eventFull[
                                                  item.key
                                                ]
                                                  ? "line-through"
                                                  : "none",
                                              }}
                                            >
                                              {item.text}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

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
                                        <ArvinButton
                                          key={index}
                                          color={item.color}
                                          onClick={item.onClick}
                                          style={{
                                            padding: "5px 1.5rem",

                                            fontWeight: "500",
                                            minWidth: "100px",
                                          }}
                                        >
                                          {item.text}
                                        </ArvinButton>
                                      )
                                  )}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#f8d7da",
                                    padding: "1.5rem",
                                    borderRadius: "8px",
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
                                    ⚠️{" "}
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
                                        borderRadius: "8px",
                                        cursor: "pointer",

                                        fontWeight: "500",
                                      }}
                                    >
                                      {UniversalTexts.calendarModal.noCancel}
                                    </button>
                                    <button
                                      onClick={deleteOneMaterialInside}
                                      style={{
                                        padding: "5px 1.5rem",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",

                                        fontWeight: "500",
                                      }}
                                    >
                                      {UniversalTexts.calendarModal.yesDelete}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {!showEditForm && (
                      <span>
                        {/* Link de Acesso */}
                        {link && (
                          <div
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <Link
                              to={link}
                              target="_blank"
                              style={{
                                color: partnerColor(),
                                textDecoration: "none",
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "white",
                                border: `2px solid ${partnerColor()}`,
                                borderRadius: "10px",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                                minWidth: "100%",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = partnerColor();
                                e.target.style.color = "white";
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow =
                                  "0 4px 8px rgba(0,0,0,0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.color = partnerColor();
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow =
                                  "0 2px 4px rgba(0,0,0,0.1)";
                              }}
                            >
                              {UniversalTexts.calendarModal.clickToAccessClass}
                            </Link>
                          </div>
                        )}
                        {/* Descrição */}
                        {description && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "10px",
                              borderRadius: "10px",
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

                        {/* Informações do Evento */}
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "0.75rem",
                            borderRadius: "8px",
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
                                      padding: "0.2rem 0.6rem",
                                      borderRadius: "12px",
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

                              {/* Coluna do Vídeo */}
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
                                      paddingBottom: "56.25%", // 16:9 aspect ratio
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
                            // Layout sem vídeo - apenas informações
                            <div>
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
                                  {UniversalTexts.calendarModal.category}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: partnerColor(),
                                    color: "white",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "12px",
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

                        {/* Homework (HTML Content) */}
                        {homework && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "0.75rem",
                              borderRadius: "8px",
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
                                📝 {UniversalTexts.calendarModal.homework}
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
                                // maxHeight: "300px",
                                // overflowY: "auto",
                              }}
                              dangerouslySetInnerHTML={{ __html: homework }}
                            />
                          </div>
                        )}

                        {/* Due Date */}
                        {dueDate && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "0.75rem",
                              borderRadius: "8px",
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
                                📅 Data de Entrega
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
                              }}
                            >
                              {new Date(dueDate).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        )}

                        {/* File Attachment */}
                        {fileName && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "0.75rem",
                              borderRadius: "8px",
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
                                  // Create download link for the file
                                  const link = document.createElement("a");
                                  link.href = `data:${fileType};base64,${base64String}`;
                                  link.download = fileName;
                                  link.click();
                                }
                              }}
                            >
                              {fileName}{" "}
                              {base64String && "👆 Clique para baixar"}
                            </div>
                          </div>
                        )}

                        {/* Flashcards */}
                        {flashcards && (
                          <div
                            style={{
                              backgroundColor: "white",
                              padding: "0.75rem",
                              borderRadius: "8px",
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
                                🃏{" "}
                                {UniversalTexts.calendarModal.uploadFlashcards}
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
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {flashcards}
                            </div>
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Replenish Section */}
              {category == "Marcar Reposição" && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: "1.2rem",
                    borderRadius: "8px",
                    border: "1px solid #ffeaa7",
                  }}
                >
                  <div style={{ display: !seeReplenish ? "block" : "none" }}>
                    <ArvinButton
                      onClick={() => setSeeReplenish(true)}
                      style={{
                        width: "100%",
                        padding: "5px",

                        fontWeight: "500",
                      }}
                    >
                      {UniversalTexts.calendarModal.reserveTimeForReplacement}
                    </ArvinButton>
                  </div>

                  <div
                    style={{
                      display: seeReplenish ? "block" : "none",
                      backgroundColor: "#6c757d",
                      color: "white",
                      padding: "1.2rem",
                      borderRadius: "8px",
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
                      <ArvinButton
                        onClick={() => setSeeReplenish(false)}
                        color="red"
                        style={{
                          padding: "5px 1.5rem",
                          fontWeight: "500",
                        }}
                      >
                        ❌ Não
                      </ArvinButton>
                      <ArvinButton
                        onClick={handleScheduleReplenish}
                        color="green"
                        style={{
                          padding: "5px 1.5rem",
                          fontWeight: "500",
                        }}
                      >
                        ✅ Sim
                      </ArvinButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
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
                display: isModalOfTutoringsVisible ? "block" : "none",
                padding: "0.5rem",
              }}
              onClick={handleCloseModalOfTutorings}
            />
            <div
              className="modal box-shadow-white"
              style={{
                position: "fixed",
                display: isModalOfTutoringsVisible ? "block" : "none",
                zIndex: 100,
                backgroundColor: alwaysWhite(),
                padding: "1.5rem",
                width: window.innerWidth <= 768 ? "90vw" : "28rem",
                maxHeight: "80vh",
                overflow: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "8px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <HTwo
                  style={{
                    margin: 0,
                    color: partnerColor(),
                  }}
                >
                  {UniversalTexts.editTurorings}
                </HTwo>
                <Xp
                  onClick={handleCloseModalOfTutorings}
                  style={{
                    cursor: "pointer",
                    color: "#999",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = partnerColor())}
                  onMouseLeave={(e) => (e.target.style.color = "#999")}
                >
                  ×
                </Xp>
              </div>

              {loadingModalTutoringsInfo ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <CircularProgress style={{ color: partnerColor() }} />
                  ...
                </div>
              ) : (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    {UniversalTexts.calendarModal.selectStudent}:
                  </label>
                  <select
                    onChange={(e) => {
                      fetchOneSetOfTutoringsInside(e);
                    }}
                    name="students"
                    value={newStudentId}
                    style={{
                      width: "100%",
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",

                      backgroundColor: "white",
                    }}
                  >
                    <option value="category" hidden>
                      Select student
                    </option>
                    {studentsList.map((student, index) => {
                      return (
                        <option key={index} value={student.id}>
                          {student.name + " " + student.lastname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Existing Classes */}
              {loadingTutoringDays ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <CircularProgress style={{ color: partnerColor() }} />
                </div>
              ) : (
                <div style={{ marginBottom: "1.5rem" }}>
                  {showClasses && tutoringsListOfOneStudent.length > 0 && (
                    <div>
                      <h4
                        style={{ color: partnerColor(), marginBottom: "1rem" }}
                      >
                        {UniversalTexts.calendarModal.currentClasses}
                      </h4>
                      <div style={{ display: "grid", gap: "5px" }}>
                        {tutoringsListOfOneStudent
                          .sort(
                            (a, b) =>
                              moment(a.day, "dddd").day() -
                              moment(b.day, "dddd").day()
                          )
                          .map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  backgroundColor: "#f8f9fa",
                                  padding: "0.5rem",
                                  borderRadius: "8px",
                                  border: "1px solid #dee2e6",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "5px",
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        color: "#495057",
                                      }}
                                    >
                                      Class #{index + 1}
                                    </span>
                                    <div
                                      style={{
                                        color: "#6c757d",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {item.day} - {item.time} -
                                      <Link
                                        target="_blank"
                                        to={item.link}
                                        style={{
                                          color: partnerColor(),
                                          textDecoration: "none",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        Access Link
                                      </Link>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", gap: "5px" }}>
                                    <button
                                      onClick={() => {
                                        seeEditOneTutoring(item);
                                      }}
                                      style={{
                                        padding: "5px 1rem",
                                        backgroundColor: partnerColor(),
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteTutoring(item)}
                                      style={{
                                        padding: "5px 1rem",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Form */}
              <div
                style={{
                  display: seeEditTutoring ? "block" : "none",
                  backgroundColor: "#fff3cd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ffeaa7",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h4 style={{ margin: 0, color: "#856404" }}>
                    {UniversalTexts.calendarModal.editClass}
                  </h4>
                  <button
                    onClick={closeEditOneTutoring}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px 1rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <select
                    onChange={handleWeekDayChange}
                    value={weekDay}
                    style={{
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",

                      backgroundColor: "white",
                    }}
                  >
                    <option value="select week day" hidden>
                      {UniversalTexts.calendarModal.selectWeekDay}
                    </option>
                    {weekDays.map((weekDay, index) => {
                      return (
                        <option key={index} value={weekDay}>
                          {weekDay}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    onChange={handleTimeChange}
                    value={timeOfTutoring}
                    style={{
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",

                      backgroundColor: "white",
                    }}
                  >
                    <option value="select time" hidden>
                      {UniversalTexts.calendarModal.selectTime}
                    </option>
                    {times.map((time, index) => {
                      return (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                    placeholder={UniversalTexts.calendarModal.meetingLink}
                    type="text"
                    style={{
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",
                    }}
                    required
                  />
                  <button
                    onClick={updateOneTutoring}
                    style={{
                      padding: "5px 1.5rem",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",

                      fontWeight: "500",
                    }}
                  >
                    {UniversalTexts.calendarModal.saveChanges}
                  </button>
                </div>
              </div>

              {/* New Class Form */}
              <div style={{ display: !seeEditTutoring ? "block" : "none" }}>
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  <h4 style={{ margin: "0 0 1rem 0", color: "#155724" }}>
                    {UniversalTexts.calendarModal.addNewClass}
                  </h4>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <select
                      onChange={handleTheNewWeekDayChange}
                      value={theNewWeekDay}
                      style={{
                        padding: "5px",
                        borderRadius: "8px",
                        border: "1px solid #ced4da",

                        backgroundColor: "white",
                      }}
                    >
                      <option hidden value="select week day">
                        {UniversalTexts.calendarModal.selectWeekDayOption}
                      </option>
                      {weekDays.map((weekDay, index) => {
                        return (
                          <option key={index} value={weekDay}>
                            {weekDay}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      onChange={handleTheNewTimeChange}
                      value={theNewTimeOfTutoring}
                      style={{
                        padding: "5px",
                        borderRadius: "8px",
                        border: "1px solid #ced4da",

                        backgroundColor: "white",
                      }}
                    >
                      <option hidden value="Select Time">
                        {UniversalTexts.calendarModal.selectTimeOption}
                      </option>
                      {times.map((time, index) => {
                        return (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      placeholder={UniversalTexts.calendarModal.meetingLink}
                      value={theNewLink}
                      onChange={(e) => {
                        setTheNewLink(e.target.value);
                      }}
                      type="text"
                      style={{
                        padding: "5px",
                        borderRadius: "8px",
                        border: "1px solid #ced4da",
                      }}
                      required
                    />
                    <button
                      onClick={newTutoring}
                      style={{
                        padding: "5px 1.5rem",
                        backgroundColor: partnerColor(),
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",

                        fontWeight: "500",
                      }}
                    >
                      {UniversalTexts.calendarModal.addNewClass}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>

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
                borderRadius: "12px",
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
                        fontSize: "1.5rem",
                        color: "#999",
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
                        e.target.style.color = "#999";
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Form */}
                  <div
                    style={{
                      display: "grid",
                      gap: "1.5rem",
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
                          borderRadius: "8px",
                          border: "1px solid #ced4da",
                          fontSize: "0.9rem",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="" hidden>
                          Selecione a categoria...
                        </option>
                        {[
                          "Test",
                          "Standalone",
                          "Group Class",
                          "Rep",
                          "Prize Class",
                          "Tutoring",
                          "Marcar Reposição",
                        ].map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
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
                            borderRadius: "8px",
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

                    {/* Data e Hora */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          window.innerWidth < 768 ? "1fr" : "1fr 1fr",
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
                            borderRadius: "8px",
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
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            fontSize: "0.9rem",
                          }}
                          required
                        />
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
                          borderRadius: "8px",
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
                          borderRadius: "8px",
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
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#5a6268";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#6c757d";
                        }}
                      >
                        <i
                          className="fa fa-times"
                          style={{ marginRight: "0.5rem" }}
                        />
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateNewClass}
                        disabled={
                          !newClass.category ||
                          !newClass.date ||
                          !newClass.time ||
                          !newClass.link ||
                          !newClass.description
                        }
                        style={{
                          padding: "0.75rem 1.5rem",
                          backgroundColor: partnerColor(),
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
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
                        onMouseEnter={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
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

          {/* Toolbar moderna do calendário */}
          <div
            style={{
              marginBottom: "1rem",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e1e5e9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              padding: "12px 16px",
            }}
          >
            {/* Seção Principal - Navegação compacta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {/* Navegação de Semana - Compacta */}
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
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.borderColor = "#ced4da";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#dee2e6";
                    }
                  }}
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
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.borderColor = "#ced4da";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#dee2e6";
                    }
                  }}
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
                  onChange={changeToday}
                  style={{
                    padding: "6px 32px 6px 10px",
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    fontWeight: "400",
                    color: "#495057",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    minWidth: "120px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#6c757d",
                    fontSize: "11px",
                  }}
                >
                  <i className="fa fa-calendar" />
                </div>
              </div>

              {/* Ações rápidas - Compactas */}
              <div
                style={{ display: "flex", gap: "6px", alignItems: "center" }}
              >
                {/* Botão Hoje */}
                <button
                  disabled={!disabledAvoid}
                  style={{
                    padding: "6px 12px",
                    background: !disabledAvoid ? "#f8f9fa" : "#ffffff",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    color: !disabledAvoid ? "#adb5bd" : "#495057",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: "400",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onClick={handleBackToToday}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.borderColor = partnerColor();
                      e.target.style.color = partnerColor();
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#dee2e6";
                      e.target.style.color = "#495057";
                    }
                  }}
                >
                  <i className="fa fa-home" style={{ fontSize: "10px" }} />
                  <span>{UniversalTexts.calendarModal.today}</span>
                </button>

                {/* Botão Atualizar */}
                <button
                  disabled={!disabledAvoid}
                  style={{
                    width: "32px",
                    height: "32px",
                    background: !disabledAvoid ? "#f8f9fa" : "#ffffff",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    color: !disabledAvoid ? "#adb5bd" : "#6c757d",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => fetchGeneralEvents()}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.borderColor = partnerColor();
                      e.target.style.color = partnerColor();
                      e.target.style.transform = "rotate(90deg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.background = "#ffffff";
                      e.target.style.borderColor = "#dee2e6";
                      e.target.style.color = "#6c757d";
                      e.target.style.transform = "rotate(0deg)";
                    }
                  }}
                >
                  <i className="fa fa-refresh" />
                </button>

                {/* Separador */}
                <div
                  style={{
                    width: "1px",
                    height: "20px",
                    background: "#e9ecef",
                    margin: "0 4px",
                  }}
                />

                {/* Botões de Criação - Compactos */}
                {(thePermissions === "superadmin" ||
                  thePermissions === "teacher") && (
                  <>
                    {/* Botão Nova Aula */}
                    <button
                      style={{
                        padding: "6px 12px",
                        background: "#ffffff",
                        border: `1px solid ${partnerColor()}`,
                        borderRadius: "6px",
                        color: partnerColor(),
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() => {
                        handleSeeModalNew();
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = partnerColor();
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#ffffff";
                        e.target.style.color = partnerColor();
                      }}
                    >
                      <i className="fa fa-plus" style={{ fontSize: "10px" }} />
                      <span>{UniversalTexts.calendarModal.singleClass}</span>
                    </button>

                    {/* Botão Recorrentes */}
                    <button
                      disabled={!disabledAvoid}
                      style={{
                        padding: "6px 12px",
                        background: !disabledAvoid ? "#f8f9fa" : "#ffffff",
                        border: `1px solid ${
                          !disabledAvoid ? "#dee2e6" : "#22c55e"
                        }`,
                        borderRadius: "6px",
                        color: !disabledAvoid ? "#adb5bd" : "#22c55e",
                        cursor: !disabledAvoid ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() => handleSeeModalOfTutorings()}
                      onMouseEnter={(e) => {
                        if (disabledAvoid) {
                          e.target.style.background = "#22c55e";
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (disabledAvoid) {
                          e.target.style.background = "#ffffff";
                          e.target.style.color = "#22c55e";
                        }
                      }}
                    >
                      <i
                        className="fa fa-repeat"
                        style={{ fontSize: "10px" }}
                      />
                      <span>
                        {UniversalTexts.calendarModal.recurringClasses}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </RouteDiv>
      ) : (
        <RouteSizeControlBox>Nenhum usuário logado</RouteSizeControlBox>
      )}
      <Helmets text="Calendar" />
    </>
  );
}
