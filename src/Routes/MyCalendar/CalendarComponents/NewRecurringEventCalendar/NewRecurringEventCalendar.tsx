import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { createPortal } from "react-dom";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { alwaysWhite, partnerColor } from "../../../../Styles/Styles";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { HTwo } from "../../../../Resources/Components/RouteBox";

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

interface NewRecurringEventCalendarProps {
  headers: any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean: boolean;
  setAlternateBoolean: React.Dispatch<React.SetStateAction<boolean>>;
}

const getNextDayOfWeek = (dayOfWeek: string, fromDate: Date) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const target = daysOfWeek.indexOf(dayOfWeek);
  if (target < 0) return null;

  const current = fromDate.getDay();
  const diff = (target - current + 7) % 7; // 0 = hoje

  const next = new Date(fromDate);
  next.setDate(fromDate.getDate() + diff);
  return next;
};

const formatTime = (timeStr: string) => {
  const [hours, minutes] = (timeStr || "00:00").split(":");
  return `${String(hours || "0").padStart(2, "0")}:${String(
    minutes || "0",
  ).padStart(2, "0")}`;
};

const todayYYYYMMDD = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseYYYYMMDDToLocalDate = (yyyyMmDd: string) => {
  // força local 00:00 sem depender de parsing ISO/UTC
  const [y, m, d] = (yyyyMmDd || "").split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
};

const buildDateWithTime = (baseDate: Date, timeHHmm: string) => {
  const [hh, mm] = (timeHHmm || "00:00").split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hh || 0, mm || 0, 0, 0);
  return d;
};

const isTutoringExpiringWithinMonth = (tutoring: any) => {
  if (!tutoring.endDate) return false;
  const today = new Date();
  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(today.getMonth() + 1);
  const endDate = new Date(tutoring.endDate);
  return endDate < oneMonthFromNow;
};

const getDaysUntilExpiration = (tutoring: any) => {
  if (!tutoring.endDate) return null;
  const today = new Date();
  const endDate = new Date(tutoring.endDate);
  // @ts-ignore
  const diffTime = endDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const NewRecurringEventCalendar: FC<NewRecurringEventCalendarProps> = ({
  headers,
  myId,
  setChange,
  change,
  alternateBoolean,
  setAlternateBoolean,
}) => {
  const { UniversalTexts } = useUserContext();

  // modal
  const [isModalOfTutoringsVisible, setIsModalOfTutoringsVisible] =
    useState(false);
  const [loadingModalTutoringsInfo, setLoadingModalTutoringsInfo] =
    useState(false);

  // tabs
  const [showStudentsRecurring, setShowStudentsRecurring] = useState(true);
  const [showGroupsRecurring, setShowGroupsRecurring] = useState(false);
  const [SHOWEMPTY, setSHOWEMPTY] = useState(false);

  // filtros
  const [newStudentId, setNewStudentId] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [showClasses, setShowClasses] = useState(false);

  // listas
  const [
    tutoringsListOfOneStudentOrGroup,
    setTutoringsListOfOneStudentOrGroup,
  ] = useState<any[]>([]);
  const [fixedTeacherTutorings, setFixedTeacherTutorings] = useState<any[]>([]);
  const [loadingTutoringDays, setLoadingTutoringDays] = useState(false);

  // criar nova
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
  const [duration, setDuration] = useState<any>(60);
  const [numberOfWeeks, setNumberOfWeeks] = useState<any>(4);

  // startDate (novo)
  const [startDate, setStartDate] = useState<string>(() => todayYYYYMMDD());

  // editar existente
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [weekDay, setWeekDay] = useState("");
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [link, setLink] = useState("");
  const [tutoringId, setTutoringId] = useState("");

  const [showSeeEditTutoring, setShowSeeEditTutoring] = useState(false);

  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [groupsList, setGroupsList] = useState<any[]>([]);

  // lista usada na UI
  const listToRender = SHOWEMPTY
    ? fixedTeacherTutorings
    : tutoringsListOfOneStudentOrGroup;

  const resetNewForm = () => {
    setTheNewLink("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setDuration(60);
    setNumberOfWeeks(4);
    setStartDate(todayYYYYMMDD());
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        { headers },
      );
      setStudentsList(response.data.listOfStudents || []);
    } catch (error) {
      console.log(error, "Erro ao encontrar alunos");
    }

    try {
      const response = await axios.get(`${backDomain}/api/v1/groups/${myId}`, {
        headers,
      });
      setGroupsList(response.data.groups || []);
    } catch (error) {
      console.log(error, "Erro ao encontrar Turmas");
    }
  };

  const fetchOneSetOfTutorings = async (studentId: any) => {
    if (!studentId) return;
    try {
      setLoadingTutoringDays(true);
      const { data } = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${studentId}`,
        { headers },
      );
      setTutoringsListOfOneStudentOrGroup(data?.tutorings ?? []);
    } catch (error) {
      console.log(error, "Erro ao encontrar tutorias do aluno");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const fetchOneSetOfGroups = async (groupID: any) => {
    if (!groupID) return;
    try {
      setLoadingTutoringDays(true);
      const { data } = await axios.get(
        `${backDomain}/api/v1/groupsrecurrentevents/${groupID}`,
        { headers },
      );
      setTutoringsListOfOneStudentOrGroup(data?.tutorings ?? []);
    } catch (error) {
      console.log(error, "Erro ao encontrar tutorias do grupo");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const fetchOneSetOfFixedTeacherTutorings = async (teacherId: any) => {
    if (!teacherId) return;
    try {
      setLoadingTutoringDays(true);
      const { data } = await axios.get(
        `${backDomain}/api/v1/tutoring-teachers/${teacherId}`,
        { headers },
      );
      setFixedTeacherTutorings(data?.tutorings ?? []);
    } catch (error) {
      console.log(error, "Erro ao encontrar tutorias do professor");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const handleSeeModalOfTutorings = async () => {
    setNewStudentId("");
    setNewGroupId("");
    setShowClasses(false);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);
    resetNewForm();

    setIsModalOfTutoringsVisible(true);
    setLoadingTutoringDays(false);

    setLoadingModalTutoringsInfo(true);
    try {
      await fetchStudents();
    } finally {
      setLoadingModalTutoringsInfo(false);
    }
  };

  const handleCloseModalOfTutorings = () => {
    setNewStudentId("");
    setNewGroupId("");
    setShowClasses(false);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);
    resetNewForm();

    setIsModalOfTutoringsVisible(false);
    setAlternateBoolean(!alternateBoolean);
    setChange?.(!change);
  };

  const fetchOneSetOfTutoringsInside = (e: any) => {
    const id = e.target.value;
    setNewStudentId(id);
    setNewGroupId("");
    setSHOWEMPTY(false);

    setShowClasses(true);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);

    fetchOneSetOfTutorings(id);
  };

  const fetchOneSetOfGroupClassesInside = (e: any) => {
    const id = e.target.value;
    setNewGroupId(id);
    setNewStudentId("");
    setSHOWEMPTY(false);

    setShowClasses(true);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);

    fetchOneSetOfGroups(id);
  };

  // editar existente
  const seeEditOneTutoring = (item: any) => {
    setSeeEditTutoring(true);
    setTutoringId(item.id);
    setTimeOfTutoring(item.time || item.startTime || "");
    setLink(item.link || "");
    setWeekDay(item.day);
    setDuration(item.duration ?? 60);
  };

  const closeEditOneTutoring = () => {
    setSeeEditTutoring(false);
    setWeekDay("");
    setTimeOfTutoring("");
    setLink("");
    setTutoringId("");
  };

  const updateOneTutoring = async () => {
    if (!weekDay || !timeOfTutoring || !link || !tutoringId) return;

    setLoadingTutoringDays(true);
    setSeeEditTutoring(true);

    try {
      if (SHOWEMPTY) {
        await axios.put(
          `${backDomain}/api/v1/tutoringevent-fixed`,
          {
            id: tutoringId,
            teacherID: myId,
            day: weekDay,
            time: timeOfTutoring,
            duration,
            link,
          },
          { headers },
        );

        setSeeEditTutoring(false);
        setTimeout(() => fetchOneSetOfFixedTeacherTutorings(myId), 200);
      } else {
        await axios.put(
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
          { headers },
        );

        setSeeEditTutoring(false);
        if (newStudentId) await fetchOneSetOfTutorings(newStudentId);
        if (newGroupId) await fetchOneSetOfGroups(newGroupId);
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar recorrência");
    } finally {
      setLoadingTutoringDays(false);
      setSeeEditTutoring(false);
    }
  };

  // criar nova
  const newTutoring = async () => {
    setLoadingTutoringDays(true);
    const base = parseYYYYMMDDToLocalDate(startDate || todayYYYYMMDD());
    const firstDate = theNewWeekDay && getNextDayOfWeek(theNewWeekDay, base);

    if (!firstDate) {
      alert(
        UniversalTexts.calendarModal.selectWeekDayOption ||
          "Selecione um dia da semana.",
      );
      return;
    }

    const computedStartDate = buildDateWithTime(
      firstDate,
      theNewTimeOfTutoring,
    );

    const endDate = new Date(firstDate);
    endDate.setDate(firstDate.getDate() + (Number(numberOfWeeks) || 4) * 7 - 1);

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    if (endDate < oneMonthFromNow) {
      const endDateFormatted = endDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const confirmMessage =
        `ATENÇÃO: O período selecionado termina em ${endDateFormatted}, que é em menos de 1 mês.\n\n` +
        `Para períodos curtos, recomendamos:\n- Excluir esta configuração de tutoria recorrente\n- Criar eventos únicos através do botão "Criar Evento"\n\n` +
        `Deseja continuar mesmo assim?`;

      if (!window.confirm(confirmMessage)) return;
    }

    try {
      if (SHOWEMPTY) {
        await axios.post(
          `${backDomain}/api/v1/tutoringevent-fixed`,
          {
            teacherID: myId,
            day: theNewWeekDay,
            time: formatTime(theNewTimeOfTutoring),
            duration,
            link: theNewLink,
            numberOfWeeks: Number(numberOfWeeks) || 4,
            startDate: computedStartDate, // Date
            endDate,
          },
          { headers },
        );

        setSeeEditTutoring(false);
        setShowSeeEditTutoring(false);
        setTimeout(() => fetchOneSetOfFixedTeacherTutorings(myId), 200);
      } else {
        await axios.post(
          `${backDomain}/api/v1/tutoringevent`,
          {
            day: theNewWeekDay,
            time: formatTime(theNewTimeOfTutoring),
            duration,
            link: theNewLink,
            studentID: newStudentId || "",
            teacherID: myId,
            groupId: newGroupId || "",
            numberOfWeeks: Number(numberOfWeeks) || 4,
            startDate: computedStartDate, // Date
            endDate,
          },
          { headers },
        );

        setSeeEditTutoring(false);
        setShowSeeEditTutoring(false);
        if (newStudentId) await fetchOneSetOfTutorings(newStudentId);
        if (newGroupId) await fetchOneSetOfGroups(newGroupId);
      }

      resetNewForm();
      setLoadingTutoringDays(false);
    } catch (error) {
      console.log(error, "Erro ao criar recorrência");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const deleteTutoring = async (item: any) => {
    setLoadingTutoringDays(true);

    try {
      if (SHOWEMPTY) {
        await axios.delete(`${backDomain}/api/v1/tutoringevent-fixed`, {
          data: {
            id: item.id,
            teacherID: myId,
            day: item.day,
            time: item.time || item.startTime || "",
          },
          headers,
        });

        setSeeEditTutoring(false);
        setTimeout(() => fetchOneSetOfFixedTeacherTutorings(myId), 200);
      } else {
        await axios.delete(`${backDomain}/api/v1/tutoringevent`, {
          data: {
            time: item.time,
            day: item.day,
            id: item.id,
            studentID: newStudentId || "",
            groupId: newGroupId || "",
          },
          headers,
        });

        setSeeEditTutoring(false);
        if (newGroupId) await fetchOneSetOfGroups(newGroupId);
        else if (newStudentId) await fetchOneSetOfTutorings(newStudentId);
      }
    } catch (error) {
      console.log(error, "Erro ao deletar recorrência");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const isFormIncompleteNew =
    !startDate ||
    !theNewWeekDay ||
    !theNewTimeOfTutoring ||
    !theNewLink ||
    !numberOfWeeks ||
    Number(numberOfWeeks) <= 0 ||
    Number(duration) <= 0;

  const renderPeriodPreview = () => {
    if (!numberOfWeeks || Number(numberOfWeeks) <= 0 || !theNewWeekDay) {
      return (
        <div>{UniversalTexts.calendarModal.selectNumberOfWeeks || ""}</div>
      );
    }

    const base = parseYYYYMMDDToLocalDate(startDate || todayYYYYMMDD());
    const first = getNextDayOfWeek(theNewWeekDay, base);
    if (!first) return UniversalTexts.calendarModal.selectWeekDayOption || "";

    const end = new Date(first);
    end.setDate(first.getDate() + (Number(numberOfWeeks) || 4) * 7 - 1);

    const fmt = (d: Date) =>
      d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return `${fmt(first)} até ${fmt(end)} (${numberOfWeeks} semana${
      Number(numberOfWeeks) > 1 ? "s" : ""
    })`;
  };

  return (
    <>
      <button
        onClick={handleSeeModalOfTutorings}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: "999px",
          border: "1px solid " + partnerColor(),
          background: "rgba(0,0,0,0.02)",
          color: partnerColor(),
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <i className="fa fa-repeat" style={{ fontSize: 11 }} />
        <span>{UniversalTexts.calendarModal.recurringClasses}</span>
      </button>

      {isModalOfTutoringsVisible &&
        createPortal(
          <>
            <div
              onClick={handleCloseModalOfTutorings}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.45)",
                zIndex: 999,
              }}
            />

            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
              onClick={handleCloseModalOfTutorings}
            >
              <div
                className="arvin-modal box-shadow-white"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 520,
                  maxHeight: "90vh",
                  overflow: "hidden",
                  borderRadius: 12,
                  backgroundColor: alwaysWhite(),
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <HTwo
                      style={{
                        margin: 0,
                        color: partnerColor(),
                        fontSize: 18,
                      }}
                    >
                      {UniversalTexts.editTurorings}
                    </HTwo>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      {UniversalTexts.calendarModal.recurringSubtitle ||
                        "Gerencie as aulas recorrentes de alunos, grupos e horários fixos."}
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModalOfTutorings}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      width: 28,
                      height: 28,
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: "#94a3b8",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    padding: "14px 18px 16px",
                    overflowY: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {loadingModalTutoringsInfo ? (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <CircularProgress style={{ color: partnerColor() }} />
                    </div>
                  ) : (
                    <section
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#475569",
                          margin: 0,
                        }}
                      >
                        {UniversalTexts.calendarModal.step1 ||
                          "1. Escolha um aluno, grupo ou horário fixo"}
                      </p>

                      <div
                        style={{
                          display: "inline-flex",
                          padding: 4,
                          borderRadius: 999,
                          backgroundColor: "#f1f5f9",
                          gap: 4,
                          width: "fit-content",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShowStudentsRecurring(true);
                            setShowGroupsRecurring(false);
                            setSHOWEMPTY(false);

                            setNewGroupId("");
                            setShowClasses(false);
                            setSeeEditTutoring(false);
                            setShowSeeEditTutoring(false);
                          }}
                          style={{
                            border: "none",
                            cursor: "pointer",
                            borderRadius: 999,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: showStudentsRecurring
                              ? partnerColor()
                              : "transparent",
                            color: showStudentsRecurring ? "#fff" : "#475569",
                          }}
                        >
                          {UniversalTexts.student || "Aluno"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowStudentsRecurring(false);
                            setShowGroupsRecurring(true);
                            setSHOWEMPTY(false);

                            setNewStudentId("");
                            setShowClasses(false);
                            setSeeEditTutoring(false);
                            setShowSeeEditTutoring(false);
                          }}
                          style={{
                            border: "none",
                            cursor: "pointer",
                            borderRadius: 999,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: showGroupsRecurring
                              ? partnerColor()
                              : "transparent",
                            color: showGroupsRecurring ? "#fff" : "#475569",
                          }}
                        >
                          {UniversalTexts.group || "Grupo"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowStudentsRecurring(false);
                            setShowGroupsRecurring(false);
                            setSHOWEMPTY(true);

                            setNewStudentId("");
                            setNewGroupId("");
                            setSeeEditTutoring(false);
                            setShowSeeEditTutoring(false);

                            setShowClasses(true);
                            fetchOneSetOfFixedTeacherTutorings(myId);
                          }}
                          style={{
                            border: "none",
                            cursor: "pointer",
                            borderRadius: 999,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: SHOWEMPTY
                              ? partnerColor()
                              : "transparent",
                            color: SHOWEMPTY ? "#fff" : "#475569",
                          }}
                        >
                          {"Horários Recorrentes"}
                        </button>
                      </div>

                      {showStudentsRecurring && (
                        <div
                          style={{
                            borderRadius: 8,
                            padding: 10,
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontSize: 11,
                              fontWeight: 600,
                              marginBottom: 4,
                              color: "#64748b",
                            }}
                          >
                            {UniversalTexts.selectStudent || "Selecionar aluno"}
                          </label>

                          <select
                            onChange={fetchOneSetOfTutoringsInside}
                            value={newStudentId}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              borderRadius: 6,
                              border: "1px solid #cbd5e1",
                              fontSize: 13,
                            }}
                          >
                            <option value="" hidden>
                              {UniversalTexts.selectStudentPlaceholder ||
                                "Escolha um aluno..."}
                            </option>

                            {studentsList && studentsList.length > 0 ? (
                              studentsList.map((student: any) => (
                                <option
                                  key={student.id || student._id}
                                  value={student.id || student._id}
                                >
                                  {(student.name ||
                                    student.firstName ||
                                    student.username) +
                                    " " +
                                    (student.lastname ||
                                      student.lastName ||
                                      "")}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading students...</option>
                            )}
                          </select>
                        </div>
                      )}

                      {showGroupsRecurring && (
                        <div
                          style={{
                            borderRadius: 8,
                            padding: 10,
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontSize: 11,
                              fontWeight: 600,
                              marginBottom: 4,
                              color: "#64748b",
                            }}
                          >
                            {UniversalTexts.selectGroup || "Selecionar grupo"}
                          </label>

                          <select
                            value={newGroupId}
                            onChange={fetchOneSetOfGroupClassesInside}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              borderRadius: 6,
                              border: "1px solid #cbd5e1",
                              fontSize: 13,
                            }}
                          >
                            <option value="" hidden>
                              {UniversalTexts.selectGroupPlaceholder ||
                                "Escolha um grupo..."}
                            </option>

                            {groupsList && groupsList.length > 0 ? (
                              groupsList.map((group: any) => (
                                <option
                                  key={group._id || group.id}
                                  value={group._id || group.id}
                                >
                                  {group.name || group.title || group.groupName}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading groups...</option>
                            )}
                          </select>
                        </div>
                      )}
                    </section>
                  )}

                  <section>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#475569",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {UniversalTexts.calendarModal.step2 ||
                        "2. Veja e edite as aulas recorrentes"}
                    </p>

                    {loadingTutoringDays ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <CircularProgress style={{ color: partnerColor() }} />
                      </div>
                    ) : showClasses && listToRender.length > 0 ? (
                      <div style={{ display: "grid", gap: 8 }}>
                        {listToRender
                          .sort(
                            (a: any, b: any) =>
                              moment(a.day, "dddd").day() -
                              moment(b.day, "dddd").day(),
                          )
                          .map((item: any, index: number) => {
                            const isExpiring =
                              isTutoringExpiringWithinMonth(item);
                            const daysLeft = getDaysUntilExpiration(item);

                            return (
                              <div
                                key={`${item.day}-${item.time || item.startTime || ""}-${index}`}
                                style={{
                                  backgroundColor: isExpiring
                                    ? "#fff1f2"
                                    : "#f8fafc",
                                  padding: "8px 10px",
                                  borderRadius: 8,
                                  border: isExpiring
                                    ? "1px solid #fb7185"
                                    : "1px solid #e2e8f0",
                                }}
                              >
                                {isExpiring && item.endDate && (
                                  <div
                                    style={{
                                      backgroundColor: "#fb7185",
                                      color: "white",
                                      padding: "2px 6px",
                                      borderRadius: 999,
                                      fontSize: 10,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      marginBottom: 6,
                                    }}
                                  >
                                    {daysLeft && daysLeft > 0
                                      ? `${UniversalTexts.endsIn} ${daysLeft} dia${
                                          daysLeft > 1 ? "s" : ""
                                        } (${new Date(item.endDate).toLocaleDateString("pt-BR")})`
                                      : `${UniversalTexts.expired} ${new Date(item.endDate).toLocaleDateString("pt-BR")}`}
                                  </div>
                                )}

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        fontSize: 13,
                                        color: "#0f172a",
                                      }}
                                    >
                                      {SHOWEMPTY
                                        ? `Horário #${index + 1}`
                                        : `${UniversalTexts.Class} #${index + 1}`}
                                    </span>

                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "#64748b",
                                        marginTop: 2,
                                      }}
                                    >
                                      {item.day} • {item.time || item.startTime}
                                      {item.link && (
                                        <Link
                                          target="_blank"
                                          to={item.link}
                                          style={{
                                            color: partnerColor(),
                                            textDecoration: "none",
                                            marginLeft: 6,
                                            fontWeight: 500,
                                          }}
                                        >
                                          {UniversalTexts.accessClass}
                                        </Link>
                                      )}
                                      {item.endDate && (
                                        <span style={{ marginLeft: 6 }}>
                                          {moment(item.endDate).format(
                                            "DD/MM/YYYY",
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{ display: "inline-flex", gap: 6 }}
                                  >
                                    <button
                                      onClick={() => seeEditOneTutoring(item)}
                                      style={{
                                        padding: "4px 10px",
                                        fontSize: 11,
                                        borderRadius: 999,
                                        border: "none",
                                        cursor: "pointer",
                                        backgroundColor: partnerColor(),
                                        color: "#fff",
                                      }}
                                    >
                                      {UniversalTexts.edit || "Editar"}
                                    </button>

                                    <button
                                      onClick={() => deleteTutoring(item)}
                                      style={{
                                        padding: "4px 10px",
                                        fontSize: 11,
                                        borderRadius: 999,
                                        border: "none",
                                        cursor: "pointer",
                                        backgroundColor: "#ef4444",
                                        color: "#fff",
                                      }}
                                    >
                                      {UniversalTexts.delete || "Excluir"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : showClasses ? (
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        {SHOWEMPTY
                          ? "Nenhum horário recorrente configurado para o professor."
                          : UniversalTexts.calendarModal.noRecurringClasses ||
                            "Nenhuma recorrência encontrada para este aluno/grupo."}
                      </p>
                    ) : (
                      <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>
                        {UniversalTexts.calendarModal.selectAStudentOrGroup ||
                          "Selecione um aluno ou grupo para carregar as recorrências."}
                      </p>
                    )}
                  </section>

                  {!loadingTutoringDays && seeEditTutoring && (
                    <section
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h4
                          style={{ margin: 0, fontSize: 13, color: "#9a3412" }}
                        >
                          {UniversalTexts.calendarModal.editClass}
                        </h4>

                        <button
                          onClick={closeEditOneTutoring}
                          style={{
                            padding: "4px 10px",
                            fontSize: 11,
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            backgroundColor: "#ef4444",
                            color: "#fff",
                          }}
                        >
                          {UniversalTexts.cancel || "Cancelar"}
                        </button>
                      </div>

                      <div style={{ display: "grid", gap: 8 }}>
                        <select
                          onChange={(e) => setWeekDay(e.target.value)}
                          value={weekDay}
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            fontSize: 13,
                          }}
                        >
                          <option value="" hidden>
                            {UniversalTexts.calendarModal.selectWeekDay}
                          </option>
                          {weekDays.map((wd) => (
                            <option key={wd} value={wd}>
                              {wd}
                            </option>
                          ))}
                        </select>

                        <select
                          onChange={(e) => setTimeOfTutoring(e.target.value)}
                          value={timeOfTutoring}
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            fontSize: 13,
                          }}
                        >
                          <option value="" hidden>
                            {UniversalTexts.calendarModal.selectTime}
                          </option>
                          {times.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <input
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder={UniversalTexts.calendarModal.meetingLink}
                          type="text"
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            fontSize: 13,
                          }}
                        />

                        <input
                          value={duration}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (
                              v === "" ||
                              (v.length <= 3 &&
                                Number(v) >= 0 &&
                                Number(v) <= 300)
                            ) {
                              setDuration(v);
                            }
                          }}
                          placeholder={UniversalTexts.duration}
                          type="number"
                          min={1}
                          max={300}
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                            fontSize: 13,
                            maxWidth: 90,
                          }}
                        />

                        <button
                          onClick={updateOneTutoring}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: "#22c55e",
                            color: "#fff",
                            alignSelf: "flex-start",
                          }}
                        >
                          {UniversalTexts.calendarModal.saveChanges}
                        </button>
                      </div>
                    </section>
                  )}

                  {!loadingModalTutoringsInfo &&
                    (newStudentId !== "" || newGroupId !== "" || SHOWEMPTY) && (
                      <>
                        <button
                          onClick={() =>
                            setShowSeeEditTutoring(!showSeeEditTutoring)
                          }
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid #cbd5e1",
                            backgroundColor: showSeeEditTutoring
                              ? "#fee2e2"
                              : "#ecfdf3",
                            color: showSeeEditTutoring ? "#b91c1c" : "#15803d",
                            fontSize: 12,
                            cursor: "pointer",
                            alignSelf: "flex-start",
                          }}
                        >
                          {showSeeEditTutoring
                            ? UniversalTexts.hideShowClasses
                            : UniversalTexts.showShowClasses}
                        </button>

                        {showSeeEditTutoring && !seeEditTutoring && (
                          <section
                            style={{
                              padding: 12,
                              borderRadius: 10,
                              backgroundColor: "#ecfdf3",
                              border: "1px solid #bbf7d0",
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#166534",
                                margin: 0,
                              }}
                            >
                              {UniversalTexts.calendarModal.addNewClass}
                            </p>

                            <div style={{ display: "grid", gap: 8 }}>
                              <label
                                style={{
                                  display: "block",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  marginBottom: 2,
                                  color: "#64748b",
                                }}
                              >
                                Data de início
                              </label>

                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                }}
                              />

                              <select
                                onChange={(e) =>
                                  setTheNewWeekDay(e.target.value)
                                }
                                value={theNewWeekDay}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                }}
                              >
                                <option hidden value="">
                                  {
                                    UniversalTexts.calendarModal
                                      .selectWeekDayOption
                                  }
                                </option>
                                {weekDays.map((wd) => (
                                  <option key={wd} value={wd}>
                                    {wd}
                                  </option>
                                ))}
                              </select>

                              <select
                                onChange={(e) =>
                                  setTheNewTimeOfTutoring(e.target.value)
                                }
                                value={theNewTimeOfTutoring}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                }}
                              >
                                <option hidden value="">
                                  {
                                    UniversalTexts.calendarModal
                                      .selectTimeOption
                                  }
                                </option>
                                {times.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>

                              <input
                                placeholder={
                                  UniversalTexts.calendarModal.meetingLink
                                }
                                value={theNewLink}
                                onChange={(e) => setTheNewLink(e.target.value)}
                                type="text"
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                }}
                              />
                            </div>

                            <div>
                              <p
                                style={{
                                  display: "block",
                                  marginBottom: "5px",
                                  fontSize: "12px",
                                  color: "#6c757d",
                                  fontWeight: 500,
                                  margin: "0 0 5px 0",
                                }}
                              >
                                {UniversalTexts.repeatFor}:
                              </p>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  marginBottom: "8px",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                {[
                                  { label: "1m", weeks: 4, tooltip: "1 mês" },
                                  {
                                    label: "3m",
                                    weeks: 12,
                                    tooltip: "3 meses",
                                  },
                                  {
                                    label: "6m",
                                    weeks: 24,
                                    tooltip: "6 meses",
                                  },
                                  { label: "1a", weeks: 52, tooltip: "1 ano" },
                                  {
                                    label: "2a",
                                    weeks: 104,
                                    tooltip: "2 anos",
                                  },
                                ].map(({ label, weeks, tooltip }) => (
                                  <button
                                    key={label}
                                    title={tooltip}
                                    style={{
                                      backgroundColor:
                                        Number(numberOfWeeks) === weeks
                                          ? "#e3f2fd"
                                          : "#f8f9fa",
                                      border:
                                        Number(numberOfWeeks) === weeks
                                          ? "1px solid #2196f3"
                                          : "1px solid #e0e0e0",
                                      cursor: "pointer",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      fontSize: "10px",
                                      fontWeight: 500,
                                      color:
                                        Number(numberOfWeeks) === weeks
                                          ? "#1976d2"
                                          : "#6c757d",
                                      transition: "all 0.2s ease",
                                      minWidth: "24px",
                                      height: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => setNumberOfWeeks(weeks)}
                                  >
                                    {label}
                                  </button>
                                ))}

                                <input
                                  placeholder="Ex: 8"
                                  value={numberOfWeeks}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (
                                      v === "" ||
                                      (v.length <= 2 &&
                                        Number(v) >= 0 &&
                                        Number(v) <= 99)
                                    ) {
                                      setNumberOfWeeks(v);
                                    }
                                  }}
                                  type="number"
                                  min="1"
                                  max="99"
                                  style={{
                                    padding: "6px",
                                    maxWidth: "60px",
                                    borderRadius: "4px",
                                    border: "1px solid #ced4da",
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                  required
                                />

                                <p
                                  style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontSize: "12px",
                                    color: "#6c757d",
                                    fontWeight: 500,
                                    margin: "0 0 5px 0",
                                  }}
                                >
                                  {UniversalTexts.duration}:
                                </p>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  marginBottom: "8px",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                {[
                                  {
                                    label: "30min",
                                    minutes: 30,
                                    tooltip: "30 minutos",
                                  },
                                  {
                                    label: "45min",
                                    minutes: 45,
                                    tooltip: "45 minutos",
                                  },
                                  {
                                    label: "1h",
                                    minutes: 60,
                                    tooltip: "1 hora",
                                  },
                                  {
                                    label: "1h30min",
                                    minutes: 90,
                                    tooltip: "1h30",
                                  },
                                  {
                                    label: "2h",
                                    minutes: 120,
                                    tooltip: "2 horas",
                                  },
                                ].map(({ label, minutes, tooltip }) => (
                                  <button
                                    key={label}
                                    title={tooltip}
                                    style={{
                                      backgroundColor:
                                        Number(duration) === minutes
                                          ? "#e3f2fd"
                                          : "#f8f9fa",
                                      border:
                                        Number(duration) === minutes
                                          ? "1px solid #2196f3"
                                          : "1px solid #e0e0e0",
                                      cursor: "pointer",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      fontSize: "10px",
                                      fontWeight: 500,
                                      color:
                                        Number(duration) === minutes
                                          ? "#1976d2"
                                          : "#6c757d",
                                      transition: "all 0.2s ease",
                                      minWidth: "24px",
                                      height: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => setDuration(minutes)}
                                  >
                                    {label}
                                  </button>
                                ))}

                                <input
                                  placeholder="Ex: 55"
                                  value={duration}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (
                                      v === "" ||
                                      (v.length <= 3 &&
                                        Number(v) >= 0 &&
                                        Number(v) <= 300)
                                    ) {
                                      setDuration(v);
                                    }
                                  }}
                                  type="number"
                                  min="1"
                                  max="300"
                                  style={{
                                    padding: "6px",
                                    maxWidth: "60px",
                                    borderRadius: "4px",
                                    border: "1px solid #ced4da",
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                  required
                                />
                              </div>

                              <div
                                style={{
                                  marginTop: "8px",
                                  padding: "6px 8px",
                                  backgroundColor: "#f8f9fa",
                                  border: "1px solid #e9ecef",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  color: "#6c757d",
                                  lineHeight: "1.3",
                                }}
                              >
                                {renderPeriodPreview()}
                              </div>
                            </div>

                            <button
                              onClick={newTutoring}
                              disabled={isFormIncompleteNew}
                              style={{
                                marginTop: 4,
                                padding: "6px 12px",
                                borderRadius: 999,
                                border: "none",
                                cursor: isFormIncompleteNew
                                  ? "not-allowed"
                                  : "pointer",
                                fontSize: 12,
                                fontWeight: 500,
                                backgroundColor: isFormIncompleteNew
                                  ? "#94a3b8"
                                  : partnerColor(),
                                color: "#fff",
                                opacity: isFormIncompleteNew ? 0.7 : 1,
                              }}
                            >
                              {UniversalTexts.calendarModal.addNewClass}
                            </button>
                          </section>
                        )}
                      </>
                    )}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

export default NewRecurringEventCalendar;
