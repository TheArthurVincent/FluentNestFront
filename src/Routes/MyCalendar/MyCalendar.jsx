import React, { useEffect, useState } from "react";
import {
  HOne,
  HTwo,
  RouteDiv,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";
import {
  alwaysBlack,
  alwaysWhite,
  partnerColor,
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
  // states
  // Filtra apenas cursos cujo campo booleano `arthurVincent` seja `false`
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

  // AXIOS
  const fetchStudents = async () => {
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      console.log("Fetching students list");
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
      // onLoggOut();
    }
  };
  useEffect(() => {
    fetchGeneralEvents();
  }, []);
  const fetchGeneralEventsNoLoading = async () => {
    setPostNew(false);
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    const id = user.id;
    if (user.permissions == "superadmin") {
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
        // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/event/`,
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      setLink(
        "https://us06web.zoom.us/j/85428761031?pwd=NUrme8jYCSNMjlGfyEPehIKXsFQJ0r.1"
      );
      setDescription("Aula de Reposição referente ao dia");
      setIsTutoring(true);
    }
    if (e.target.value == "Marcar Reposição") {
      setLink(
        "https://us06web.zoom.us/j/85428761031?pwd=NUrme8jYCSNMjlGfyEPehIKXsFQJ0r.1"
      );
      setDescription("");
      setIsTutoring(false);
    }
    if (e.target.value == "Standalone") {
      setLink(
        "https://us06web.zoom.us/j/85428761031?pwd=NUrme8jYCSNMjlGfyEPehIKXsFQJ0r.1"
      );
      setDescription("Aula única de");
      setIsTutoring(false);
    }
    if (e.target.value == "Group Class") {
      setLink(
        "https://us06web.zoom.us/j/82907112201?pwd=fF9Bv9Ll9U9pPXmdOS7KJsak2SHngM.1"
      );
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
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
      // onLoggOut();
    }
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    futureDates.push(date);
  }

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
      // onLoggOut();
      console.error(error);
    }
  };

  return (
    <>
      {headers ? (
        <RouteDiv>
          <Helmets text="Calendar" />
          <div>
            <HOne
              style={{
                fontFamily: textTitleFont(),
                color: partnerColor(),
              }}
            >
              {UniversalTexts.calendar}
            </HOne>
            <div style={{ display: "flex" }}>
              <button
                style={{
                  backgroundColor: partnerColor(),
                }}
                className="button"
                style={{
                  backgroundColor: partnerColor(),
                  display: thePermissions == "superadmin" ? "flex" : "none",
                }}
                onClick={() => handleSeeModal(false)}
              >
                Schedule 1 class
              </button>
              <button
                disabled={!disabledAvoid}
                style={{
                  backgroundColor: partnerColor(),
                }}
                className="button"
                style={{
                  backgroundColor: partnerColor(),
                  display: thePermissions == "superadmin" ? "flex" : "none",
                }}
                onClick={() => handleSeeModalOfTutorings()}
              >
                Schedule recurrent class
              </button>
              <button
                disabled={!disabledAvoid}
                style={{
                  backgroundColor: partnerColor(),
                }}
                className="button"
                onClick={() => fetchGeneralEvents()}
              >
                <i className="fa fa-refresh" aria-hidden="true" />
              </button>
              <button
                disabled={!disabledAvoid}
                style={{
                  width: "3.5rem",
                  backgroundColor: partnerColor(),
                }}
                className="button2"
                onClick={() => handleChangeWeek(-7)}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </button>{" "}
              <button
                disabled={!disabledAvoid}
                style={{
                  width: "3.5rem",
                  backgroundColor: partnerColor(),
                }}
                className="button2"
                onClick={() => handleChangeWeek(7)}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </button>
              <input type="date" onChange={changeToday} />
              <button
                disabled={!disabledAvoid}
                style={{
                  width: "3.5rem",
                  backgroundColor: partnerColor(),
                }}
                className="button2"
                onClick={handleBackToToday}
              >
                Today
              </button>{" "}
            </div>
            {loading ? (
              <CircularProgress style={{ color: partnerColor() }} />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  overflowX: "auto",
                }}
              >
                {futureDates.map((date, index) => {
                  const hj = new Date();
                  return (
                    <StyledDiv
                      className={
                        hj.getDate() == date.getDate() &&
                        hj.getMonth() == date.getMonth() &&
                        hj.getFullYear() == date.getFullYear()
                          ? "glowing"
                          : "none"
                      }
                      style={{
                        border:
                          hj.getDate() == date.getDate() &&
                          hj.getMonth() == date.getMonth() &&
                          hj.getFullYear() == date.getFullYear()
                            ? `2px solid ${partnerColor()}`
                            : "null",
                      }}
                      key={index}
                    >
                      <p
                        style={{
                          padding: "5px",
                          position: "sticky",
                          top: 0,
                          fontWeight: 700,
                          textAlign: "center",
                          fontSize: "0.9rem",
                          fontFamily: textTitleFont(),
                          backgroundColor:
                            hj.getDate() == date.getDate() &&
                            hj.getMonth() == date.getMonth() &&
                            hj.getFullYear() == date.getFullYear()
                              ? partnerColor()
                              : alwaysBlack(),
                          color: alwaysWhite(),
                        }}
                      >
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
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
                        .map((event, index) => (
                          <div
                            className="box-shadow-white"
                            style={{
                              margin: "4px",
                              marginBottom: "1rem",
                              padding: "2px",
                              borderRadius: "4px",
                              border: "1px solid #aaa",
                              backgroundColor:
                                event.category === "Group Class"
                                  ? "orange"
                                  : event.category === "Rep"
                                  ? partnerColor()
                                  : event.category === "Tutoring"
                                  ? "#111"
                                  : event.category === "Prize Class"
                                  ? "green"
                                  : event.category === "Standalone"
                                  ? "#333"
                                  : event.category === "Test"
                                  ? "#1C1C1C"
                                  : event.category === "Marcar Reposição"
                                  ? "#407CB1"
                                  : "#000",
                              textAlign: "center",
                              display: "grid",
                            }}
                            key={event + index}
                          >
                            {event.status !== "desmarcado" &&
                              isEventTimeNow(event, hj, date) && (
                                <span
                                  style={{
                                    paddingBottom: "0px",
                                    marginBottom: "5px",
                                    padding: "3px",
                                    border: `2px solid ${partnerColor()}`,
                                    backgroundColor: `${partnerColor()}`,
                                  }}
                                >
                                  <LinearProgress color="inherit" />
                                </span>
                              )}
                            <p
                              onClick={() => {
                                handleSeeModal(event);
                              }}
                              className="name"
                              style={{
                                padding: "8px",
                                margin: "2px",
                                backgroundColor:
                                  event.category === "Group Class"
                                    ? "orange"
                                    : event.category === "Rep"
                                    ? partnerColor()
                                    : event.category === "Tutoring"
                                    ? "#111"
                                    : event.category === "Prize Class"
                                    ? "green"
                                    : event.category === "Standalone"
                                    ? "#333"
                                    : event.category === "Test"
                                    ? "#1C1C1C"
                                    : event.category === "Marcar Reposição"
                                    ? "#407CB1"
                                    : "#000",
                                display: "grid",
                                cursor: "pointer",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                              }}
                            >
                              {event.student ? (
                                <span
                                  style={{
                                    fontSize: "8px",
                                    fontWeight: 600,
                                    color:
                                      event.category === "Group Class"
                                        ? "#fff" // Amarelo mais escuro, sem ser tão claro
                                        : event.category === "Rep"
                                        ? textPrimaryColorContrast() // Tom de azul mais escuro e sóbrio
                                        : event.category === "Tutoring"
                                        ? textPrimaryColorContrast() // Cinza mais escuro
                                        : event.category === "Prize Class"
                                        ? "#fff" // Amarelo mais escuro e mais sóbrio
                                        : event.category === "Standalone"
                                        ? "#fff" // Azul bem escuro
                                        : event.category === "Test"
                                        ? "#fff" // Cinza muito escuro
                                        : event.category === "Marcar Reposição"
                                        ? "#fff" // Verde escuro e sóbrio
                                        : "#fff", // Preto para categoria não especificada
                                  }}
                                >
                                  {event.student}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "8px",
                                    fontWeight: 600,
                                    color:
                                      event.category === "Group Class"
                                        ? "#fff" // Amarelo mais escuro, sem ser tão claro
                                        : event.category === "Rep"
                                        ? textPrimaryColorContrast() // Tom de azul mais escuro e sóbrio
                                        : event.category === "Tutoring"
                                        ? textPrimaryColorContrast() // Cinza mais escuro
                                        : event.category === "Prize Class"
                                        ? "#fff" // Amarelo mais escuro e mais sóbrio
                                        : event.category === "Standalone"
                                        ? "#fff" // Azul bem escuro
                                        : event.category === "Test"
                                        ? "#fff" // Cinza muito escuro
                                        : event.category === "Marcar Reposição"
                                        ? "#fff" // Verde escuro e sóbrio
                                        : "#fff", // Preto para categoria não especificada
                                  }}
                                >
                                  {event.description}
                                </span>
                              )}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexDirection: "column",
                                margin: "2px",
                                borderRadius: "4px",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  event.status == "desmarcado"
                                    ? "#FFCCCC"
                                    : event.status == "marcado"
                                    ? "#CCE5FF"
                                    : event.status == "realizada"
                                    ? "#CCFFCC"
                                    : "#000",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  color:
                                    event.status == "marcado"
                                      ? "#000"
                                      : event.status == "realizada"
                                      ? partnerColor()
                                      : event.status == "desmarcado"
                                      ? "red"
                                      : "#000",
                                  fontSize: "8px",
                                  padding: "5px",
                                  fontWeight: 600,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "8px",
                                  }}
                                >
                                  {` ${event.time} | ${event.category}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
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
                borderRadius: "4px",
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
                        fontSize: "1.5rem",
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
                        gap: "0.5rem",
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
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
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
                        gap: "0.5rem",
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
                        gap: "0.5rem",
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

                    {category !== "Marcar Reposição" && (
                      <Link
                        to={link}
                        target="_blank"
                        style={{
                          color: partnerColor(),
                          textDecoration: "none",
                          fontWeight: "500",
                          padding: "0.5rem 1rem",
                          backgroundColor: "white",
                          border: `2px solid ${partnerColor()}`,
                          borderRadius: "6px",
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
                          padding: "1rem",
                          borderRadius: "6px",
                          border: "1px solid #dee2e6",
                          borderLeft: `4px solid ${partnerColor()}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
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
                      <div
                        style={{ display: !seeReplenish ? "block" : "none" }}
                      >
                        <ArvinButton
                          onClick={() => setSeeReplenish(true)}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            fontSize: "1rem",
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
                            fontSize: "1.1rem",
                            fontWeight: "500",
                          }}
                        >
                          ⚠️ Deseja marcar este horário para marcar reposição?
                          Esta ação não pode ser desfeita.
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
                              padding: "0.5rem 1.5rem",
                              fontWeight: "500",
                            }}
                          >
                            ❌ Não
                          </ArvinButton>
                          <ArvinButton
                            onClick={handleScheduleReplenish}
                            color="green"
                            style={{
                              padding: "0.5rem 1.5rem",
                              fontWeight: "500",
                            }}
                          >
                            ✅ Sim
                          </ArvinButton>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Section */}
                  {thePermissions == "superadmin" && (
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
                          <CircularProgress style={{ color: partnerColor() }} />
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
                              padding: "1rem",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
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
                                  fontSize: "0.8rem",
                                  color: "#6c757d",
                                  marginTop: "0.25rem",
                                }}
                              >
                                Scheduled
                              </div>
                            </div>

                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
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
                                  fontSize: "0.8rem",
                                  color: "#6c757d",
                                  marginTop: "0.25rem",
                                }}
                              >
                                Realized
                              </div>
                            </div>

                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
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
                                  fontSize: "0.8rem",
                                  color: "#6c757d",
                                  marginTop: "0.25rem",
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
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "1rem",
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
                                  padding: "0.75rem",
                                  borderRadius: "6px",
                                  border: "1px solid #ced4da",
                                  fontSize: "1rem",
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
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "1rem",
                              }}
                              required
                            />

                            <input
                              className="inputs-style"
                              value={theTime}
                              onChange={(e) => setTheTime(e.target.value)}
                              type="time"
                              style={{
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "1rem",
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
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "1rem",
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
                                padding: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ced4da",
                                fontSize: "1rem",
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
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                              {[
                                {
                                  key: "checkList1",
                                  text: "0. Subir Vídeo no vimeo",
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
                                    gap: "0.75rem",
                                    padding: "0.5rem",
                                    backgroundColor: eventFull[item.key]
                                      ? "#d4edda"
                                      : "white",
                                    borderRadius: "6px",
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
                                      fontSize: "0.95rem",
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
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
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
                              fontSize: "1.1rem",
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
                                padding: "0.75rem 1.5rem",
                                backgroundColor: partnerColor(),
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "500",
                              }}
                            >
                              No, Cancel
                            </button>
                            <button
                              onClick={deleteOneMaterialInside}
                              style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "500",
                              }}
                            >
                              Yes, Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                padding: "1rem",
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
                padding: "1rem",
                width: "20rem",
                height: "30rem",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Xp onClick={handleCloseModalOfTutorings}>X</Xp>
              <HTwo
                style={{
                  margin: "0.5rem 0",
                }}
              >
                {UniversalTexts.editTurorings}
              </HTwo>
              {loadingModalTutoringsInfo ? (
                <CircularProgress style={{ color: partnerColor() }} />
              ) : (
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <select
                    onChange={(e) => {
                      fetchOneSetOfTutoringsInside(e);
                    }}
                    name="students"
                    id=""
                    value={newStudentId}
                    style={{ display: "block" }}
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
                </form>
              )}
              {loadingTutoringDays ? (
                <CircularProgress style={{ color: partnerColor() }} />
              ) : (
                <div>
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
                            padding: "10px",
                            display: showClasses ? "flex" : "none",
                            gap: "5px",
                          }}
                        >
                          <p style={{ fontWeight: 600 }}>Class #{index + 1}</p>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <p>
                              {item.day} - {item.time} -
                              <Link target="_blank" to={item.link}>
                                Link
                              </Link>
                            </p>
                            <button
                              onClick={() => {
                                seeEditOneTutoring(item);
                              }}
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteTutoring(item)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              <div
                style={{
                  display: seeEditTutoring ? "block" : "none",
                }}
              >
                <button
                  style={{
                    backgroundColor: partnerColor(),
                  }}
                  className="button"
                  onClick={closeEditOneTutoring}
                >
                  x
                </button>
                <select
                  onChange={handleWeekDayChange}
                  name="students"
                  id=""
                  value={weekDay}
                  style={{ display: "block" }}
                >
                  <option value="select week day" hidden>
                    Select week day
                  </option>
                  {weekDays.map((weekDay, index) => {
                    return (
                      <option key={index} value={weekDay.id}>
                        {weekDay}
                      </option>
                    );
                  })}
                </select>
                <select
                  onChange={handleTimeChange}
                  name="students"
                  id=""
                  value={timeOfTutoring}
                  style={{ display: "block" }}
                >
                  <option value="select time" hidden>
                    Select time
                  </option>
                  {times.map((weekDay, index) => {
                    return (
                      <option key={index} value={weekDay.id}>
                        {weekDay}
                      </option>
                    );
                  })}
                </select>
                <input
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                  type="text"
                  required
                />
                <button onClick={updateOneTutoring}>Save</button>
              </div>
              <div style={{ display: !seeEditTutoring ? "block" : "none" }}>
                <HTwo>New</HTwo>
                <select
                  onChange={handleTheNewWeekDayChange}
                  name="students"
                  id=""
                  value={theNewWeekDay}
                  style={{ display: "block" }}
                >
                  <option hidden value="select week day">
                    Select Week Day
                  </option>
                  {weekDays.map((weekDay, index) => {
                    return (
                      <option key={index} value={weekDay.id}>
                        {weekDay}
                      </option>
                    );
                  })}
                </select>
                <select
                  onChange={handleTheNewTimeChange}
                  name="students"
                  id=""
                  value={theNewTimeOfTutoring}
                  style={{ display: "block" }}
                >
                  <option hidden value="Select Time">
                    Select Time
                  </option>
                  {times.map((weekDay, index) => {
                    return (
                      <option key={index} value={weekDay.id}>
                        {weekDay}
                      </option>
                    );
                  })}
                </select>
                <input
                  placeholder="New link"
                  value={theNewLink}
                  onChange={(e) => {
                    setTheNewLink(e.target.value);
                  }}
                  type="text"
                  required
                />
                <button onClick={newTutoring}>New</button>
              </div>
            </div>
          </>
        </RouteDiv>
      ) : (
        <RouteSizeControlBox>Nenhum usuário logado</RouteSizeControlBox>
      )}
    </>
  );
}
