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

export default function MyCalendar({ headers, thePermissions, myId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [postNew, setPostNew] = useState(false);
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingModalTutoringsInfo, setLoadingModalTutoringsInfo] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [theTime, setTheTime] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
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
  const [seeReplenish, setSeeReplenish] = useState(false);
  const [status, setStatus] = useState("");
  const [isModalOfTutoringsVisible, setIsModalOfTutoringsVisible] =
    useState("");
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [tutoringId, setTutoringId] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] = useState("");
  const [eventId, setEventId] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
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
      setLoading(false);
    } catch (error) {
      console.log(error);
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

      const newCategory = response.data.event.category;
      const newStudentID = response.data.event.studentID;
      const newStatus = response.data.event.status;
      const newLink = response.data.event.link;
      const newDescription = response.data.event.description;
      const newDate = response.data.event.date;
      const newTime = response.data.event.time;
      const newEventId = response.data.event._id;
      setStatus(newStatus);
      setCategory(newCategory);
      setNewStudentId(newStudentID);
      setNewEventId(newEventId);
      setLink(newLink);
      setTheTime(newTime);
      setDescription(newDescription);
      setDate(newDate);
      setLoadingModalInfo(false);
    } catch (error) {
      console.log(error, "Erro ao encontrarssss alunos");
      console.log(error);
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
      console.log(error);

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
      const response = await axios.put(
        `${backDomain}/api/v1/event/${id}`,
        {
          studentID: isTutoring ? newStudentId : null,
          date,
          time: theTime,
          category,
          status,
          link,
          description,
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
        setStatus("Scheduled");
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
      console.log(error);
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
      setStatus("Canceled");
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
      setStatus("Realized");
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
    setPostNew(true);
    fetchStudents();
    setSeeReplenish(false);
    setNewStudentId("");
    setTheTime("");
    setTheNewLink("");
    setTimeOfTutoring("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setWeekDay("");
    handleSeeModal();
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
    fetchGeneralEventsNoLoading();
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
      setDescription("Aula única de");
      setIsTutoring(false);
    }
    if (e.target.value == "Group Class") {
      setLink("");
      setDescription("Class Theme:");
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
    setEventId(e._id);
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
                                        background: `linear-gradient(90deg, ${partnerColor()}, ${partnerColor()}dd)`,
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
                                  {event.status === "desmarcado" && (
                                    <>
                                      <i
                                        className="fa fa-times-circle"
                                        style={{ marginRight: "2px" }}
                                      />
                                      Canceled
                                    </>
                                  )}
                                  {event.status === "marcado" && (
                                    <>
                                      <i
                                        className="fa fa-calendar-check-o"
                                        style={{ marginRight: "2px" }}
                                      />
                                      Scheduled
                                    </>
                                  )}
                                  {event.status === "realizada" && (
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
                width: window.innerWidth <= 768 ? "90vw" : "35rem",
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
                      Access the event
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#495057",
                      minWidth: "80px",
                    }}
                  >
                    Category:
                  </span>
                  <span
                    style={{
                      backgroundColor: partnerColor(),
                      color: "white",
                      padding: "2px 5px",
                      borderRadius: "8px",

                      fontWeight: "500",
                    }}
                  >
                    {category == "Test"
                      ? "Test Class"
                      : category == "Standalone"
                      ? "Standalone Class"
                      : category == "Group Class"
                      ? "Group Class"
                      : category == "Rep"
                      ? "Marcar Reposição"
                      : category == "Marcar Reposição"
                      ? "Janela de Marcar Reposição"
                      : category == "Prize Class"
                      ? "Prize Class"
                      : category == "Tutoring"
                      ? "Tutoring: Private Class"
                      : ""}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#495057",
                      minWidth: "80px",
                    }}
                  >
                    Date:
                  </span>
                  <span style={{ color: "#6c757d", fontWeight: "500" }}>
                    {newFormatDate(date)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#495057",
                      minWidth: "80px",
                    }}
                  >
                    Time:
                  </span>
                  <span style={{ color: "#6c757d", fontWeight: "500" }}>
                    {theTime}
                  </span>
                </div>
                {/* Admin Section */}
                {(thePermissions == "superadmin" ||
                  thePermissions == "teacher") && (
                  <div
                    style={{
                      maxHeight: "20rem",
                      overflowY: "auto",
                      display: "flex",
                    }}
                  >
                    {
                      <div
                        style={{
                          borderTop: "2px solid #e9ecef",
                          paddingTop: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.5rem",
                        }}
                      >
                        <HTwo style={{ margin: 0, color: partnerColor() }}>
                          {UniversalTexts.editPost}
                        </HTwo>

                        {loadingInfo ? (
                          <div style={{ textAlign: "center", padding: "2rem" }}>
                            <CircularProgress
                              style={{ color: partnerColor() }}
                            />
                          </div>
                        ) : (
                          <>
                            {/* Status Icons */}
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
                                      status == "Scheduled" ? "24px" : "18px",
                                    color:
                                      status == "Scheduled"
                                        ? "#007bff"
                                        : "#6c757d",
                                    transition: "all 0.2s",
                                  }}
                                />
                                <div
                                  style={{
                                    color: "#6c757d",
                                    marginTop: "2px",
                                  }}
                                >
                                  Scheduled
                                </div>
                              </div>

                              <div
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => updateRealizedClass(newEventId)}
                              >
                                <i
                                  className="fa fa-check-circle"
                                  style={{
                                    fontSize:
                                      status == "Realized" ? "24px" : "18px",
                                    color:
                                      status == "Realized"
                                        ? "#28a745"
                                        : "#6c757d",
                                    transition: "all 0.2s",
                                  }}
                                />
                                <div
                                  style={{
                                    color: "#6c757d",
                                    marginTop: "2px",
                                  }}
                                >
                                  Realized
                                </div>
                              </div>

                              <div
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => updateUnscheduled(newEventId)}
                              >
                                <i
                                  className="fa fa-times-circle-o"
                                  style={{
                                    fontSize:
                                      status == "Canceled" ? "24px" : "18px",
                                    color:
                                      status == "Canceled"
                                        ? "#dc3545"
                                        : "#6c757d",
                                    transition: "all 0.2s",
                                  }}
                                />
                                <div
                                  style={{
                                    color: "#6c757d",
                                    marginTop: "2px",
                                  }}
                                >
                                  Canceled
                                </div>
                              </div>
                            </div>

                            {/* Form */}
                            <form
                              style={{
                                display: "grid",
                                gap: "1rem",
                                backgroundColor: "#f8f9fa",
                                padding: "1.5rem",
                                borderRadius: "8px",
                              }}
                            >
                              <select
                                onChange={handleCategoryChange}
                                name="category"
                                value={category}
                                className="inputs-style"
                                style={{
                                  padding: "5px",
                                  borderRadius: "8px",
                                  border: "1px solid #ced4da",
                                }}
                              >
                                <option value="category" hidden>
                                  Select category
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

                              {isTutoring && (
                                <select
                                  className="inputs-style"
                                  onChange={handleStudentChange}
                                  name="students"
                                  value={newStudentId}
                                  style={{
                                    padding: "5px",
                                    borderRadius: "8px",
                                    border: "1px solid #ced4da",
                                  }}
                                >
                                  <option value="category" hidden>
                                    Select student
                                  </option>
                                  {studentsList.map((student, index) => (
                                    <option key={index} value={student.id}>
                                      {student.name + " " + student.lastname}
                                    </option>
                                  ))}
                                </select>
                              )}

                              <input
                                className="inputs-style"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                type="date"
                                style={{
                                  padding: "5px",
                                  borderRadius: "8px",
                                  border: "1px solid #ced4da",
                                }}
                                required
                              />

                              <input
                                className="inputs-style"
                                value={theTime}
                                onChange={(e) => setTheTime(e.target.value)}
                                type="time"
                                style={{
                                  padding: "5px",
                                  borderRadius: "8px",
                                  border: "1px solid #ced4da",
                                }}
                                required
                              />

                              <input
                                className="inputs-style"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Link"
                                type="text"
                                style={{
                                  padding: "5px",
                                  borderRadius: "8px",
                                  border: "1px solid #ced4da",
                                }}
                                required
                              />

                              <input
                                className="inputs-style"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                type="text"
                                style={{
                                  padding: "5px",
                                  borderRadius: "8px",
                                  border: "1px solid #ced4da",
                                }}
                                required
                              />
                            </form>

                            {/* Checklist */}
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
                                Task Checklist
                              </h4>
                              <div style={{ display: "grid", gap: "5px" }}>
                                {[
                                  {
                                    key: "checkList1",
                                    text: "0. Subir Vídeo",
                                    handler: handleCheckbox1Change,
                                  },
                                  {
                                    key: "checkList2",
                                    text: "1. Subir Aulas na Plataforma",
                                    handler: handleCheckbox2Change,
                                  },
                                  {
                                    key: "checkList3",
                                    text: "2. Adicionar Atividades de Homework",
                                    handler: handleCheckbox3Change,
                                  },
                                  {
                                    key: "checkList4",
                                    text: "3. Subir Flashcards",
                                    handler: handleCheckbox4Change,
                                  },
                                  {
                                    key: "checkList5",
                                    text: "4. Formatar Material",
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
                                      backgroundColor: eventFull[item.key]
                                        ? "#d4edda"
                                        : "white",
                                      borderRadius: "8px",
                                      border: "1px solid #dee2e6",
                                      cursor: "pointer",
                                      transition: "all 0.2s",
                                    }}
                                  >
                                    <input
                                      checked={eventFull[item.key] || false}
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
                                        textDecoration: eventFull[item.key]
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
                                onClick: handleCloseModal,
                                visible: true,
                              },
                              {
                                text: "Save",
                                color: "green",
                                onClick: postNew ? postNewEvent : editInside,
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
                              ⚠️ Are you sure you want to delete this event?
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
                                No, Cancel
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
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  </div>
                )}

                {category !== "Marcar Reposição" && (
                  <Link
                    to={link}
                    target="_blank"
                    style={{
                      color: partnerColor(),
                      textDecoration: "none",
                      fontWeight: "500",
                      padding: "5px 1rem",
                      backgroundColor: "white",
                      border: `2px solid ${partnerColor()}`,
                      borderRadius: "8px",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = partnerColor();
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = partnerColor();
                    }}
                  >
                    🔗 Click here to access the class
                  </Link>
                )}

                {description && (
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6",
                      borderLeft: `4px solid ${partnerColor()}`,
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
                      📅 Reservar este horário para Marcar Reposição
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
                      ⚠️ Deseja marcar este horário para marcar reposição? Esta
                      ação não pode ser desfeita.
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
                    Select Student:
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
                        Current Classes:
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
                  <h4 style={{ margin: 0, color: "#856404" }}>Edit Class</h4>
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
                      Select week day
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
                      Select time
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
                    placeholder="Meeting Link"
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
                    Save Changes
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
                    Add New Class
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
                        Select Week Day
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
                        Select Time
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
                      placeholder="Meeting Link"
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
                      Add New Class
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>

          {/* Toolbar moderna do calendário */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "0.5rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Seção Principal - Navegação e Data */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* Navegação de Semana */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "white",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <button
                  disabled={!disabledAvoid}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: !disabledAvoid
                      ? "#6c757d"
                      : partnerColor(),
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    opacity: !disabledAvoid ? 0.6 : 1,
                  }}
                  onClick={() => handleChangeWeek(-7)}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.transform = "translateX(-2px)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateX(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <i className="fa fa-chevron-left" />
                </button>

                <div
                  style={{
                    padding: "0 1rem",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "0.95rem",
                    minWidth: "120px",
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
                    width: "40px",
                    height: "40px",
                    backgroundColor: !disabledAvoid
                      ? "#6c757d"
                      : partnerColor(),
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    opacity: !disabledAvoid ? 0.6 : 1,
                  }}
                  onClick={() => handleChangeWeek(7)}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.transform = "translateX(2px)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateX(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <i className="fa fa-chevron-right" />
                </button>
              </div>

              {/* Seletor de Data Customizado */}
              <div
                style={{
                  position: "relative",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <input
                  type="date"
                  onChange={changeToday}
                  style={{
                    padding: "0.75rem 1rem",
                    border: "none",
                    outline: "none",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    color: "#495057",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    minWidth: "150px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: partnerColor(),
                  }}
                >
                  <i className="fa fa-calendar" />
                </div>
              </div>

              {/* Botão de Atualizar */}
              <button
                disabled={!disabledAvoid}
                style={{
                  padding: "0.75rem",
                  backgroundColor: !disabledAvoid ? "#6c757d" : "white",
                  border: `2px solid ${
                    !disabledAvoid ? "#6c757d" : partnerColor()
                  }`,
                  borderRadius: "8px",
                  color: !disabledAvoid ? "white" : partnerColor(),
                  cursor: !disabledAvoid ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  transition: "all 0.2s ease",
                  opacity: !disabledAvoid ? 0.6 : 1,
                  minWidth: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => fetchGeneralEvents()}
                onMouseEnter={(e) => {
                  if (disabledAvoid) {
                    e.target.style.backgroundColor = partnerColor();
                    e.target.style.color = "white";
                    e.target.style.transform = "rotate(180deg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (disabledAvoid) {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = partnerColor();
                    e.target.style.transform = "rotate(0deg)";
                  }
                }}
              >
                <i className="fa fa-refresh" />
              </button>
            </div>

            {/* Seção de Ações - Criar Eventos */}
            {(thePermissions === "superadmin" ||
              thePermissions === "teacher") && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#6c757d",
                    marginRight: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <i className="fa fa-plus-circle" />
                  <span>Criar Evento:</span>
                </div>

                {/* Botão Standalone */}
                <button
                  style={{
                    padding: "0.6rem 1.2rem",
                    backgroundColor: "white",
                    border: `2px solid ${partnerColor()}`,
                    borderRadius: "20px",
                    color: partnerColor(),
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={() => {
                    fetchStudents();
                    handleSeeModal(false);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = partnerColor();
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = partnerColor();
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <i className="fa fa-calendar-plus-o" />
                  <span>Aula Única</span>
                </button>

                {/* Botão Recurrent */}
                <button
                  disabled={!disabledAvoid}
                  style={{
                    padding: "0.6rem 1.2rem",
                    backgroundColor: !disabledAvoid ? "#f8f9fa" : "white",
                    border: `2px solid ${
                      !disabledAvoid ? "#6c757d" : "#28a745"
                    }`,
                    borderRadius: "20px",
                    color: !disabledAvoid ? "#6c757d" : "#28a745",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    opacity: !disabledAvoid ? 0.6 : 1,
                  }}
                  onClick={() => handleSeeModalOfTutorings()}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.backgroundColor = "#28a745";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "#28a745";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <i className="fa fa-repeat" />
                  <span>Aulas Recorrentes</span>
                </button>

                {/* Botão Hoje (Reativado) */}
                <button
                  disabled={!disabledAvoid}
                  style={{
                    padding: "0.6rem 1.2rem",
                    backgroundColor: !disabledAvoid ? "#f8f9fa" : "white",
                    border: `2px solid ${
                      !disabledAvoid ? "#6c757d" : "#17a2b8"
                    }`,
                    borderRadius: "20px",
                    color: !disabledAvoid ? "#6c757d" : "#17a2b8",
                    cursor: !disabledAvoid ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    opacity: !disabledAvoid ? 0.6 : 1,
                  }}
                  onClick={handleBackToToday}
                  onMouseEnter={(e) => {
                    if (disabledAvoid) {
                      e.target.style.backgroundColor = "#17a2b8";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (disabledAvoid) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "#17a2b8";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <i className="fa fa-home" />
                  <span>Hoje</span>
                </button>
              </div>
            )}
          </div>
        </RouteDiv>
      ) : (
        <RouteSizeControlBox>Nenhum usuário logado</RouteSizeControlBox>
      )}
      <Helmets text="Calendar" />
    </>
  );
}
