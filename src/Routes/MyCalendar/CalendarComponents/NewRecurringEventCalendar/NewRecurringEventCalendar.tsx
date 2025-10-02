import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { backDomain, Xp } from "../../../../Resources/UniversalComponents";
import {
  alwaysWhite,
  partnerColor,
  transparentWhite,
} from "../../../../Styles/Styles";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { HTwo } from "../../../../Resources/Components/RouteBox";
import { times, weekDays } from "../MyCalendarFuncions";
interface NewRecurringEventCalendarProps {
  headers: any; // substitua pelo tipo real se possível
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean: boolean;
  setAlternateBoolean: React.Dispatch<React.SetStateAction<boolean>>;
  studentsList?: Array<{ id: string | number; name: string }>;
  groupsList?: Array<{ id: string | number; name: string }>;
}
function NewRecurringEventCalendar({
  headers,
  myId,
  setChange,
  change,
  alternateBoolean,
  setAlternateBoolean,
  studentsList = [],
  groupsList = [],
}: NewRecurringEventCalendarProps) {
  // --- estado base do modal ---
  const [isModalOfTutoringsVisible, setIsModalOfTutoringsVisible] =
    useState(false);
  const [loadingModalTutoringsInfo, setLoadingModalTutoringsInfo] =
    useState(false);

  // alternância Aluno/Grupo
  const [showStudentsRecurring, setShowStudentsRecurring] = useState(true);
  const [showGroupsRecurring, setShowGroupsRecurring] = useState(false);

  // filtros e listas
  const [newStudentId, setNewStudentId] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const [
    tutoringsListOfOneStudentOrGroup,
    setTutoringsListOfOneStudentOrGroup,
  ] = useState([]);
  const [loadingTutoringDays, setLoadingTutoringDays] = useState(false);

  // criar nova recorrência
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
  const [duration, setDuration] = useState<any>(60);
  const [numberOfWeeks, setNumberOfWeeks] = useState<any>(4);

  // editar recorrência existente
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [weekDay, setWeekDay] = useState("");
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [link, setLink] = useState("");
  const [tutoringId, setTutoringId] = useState("");

  // controles auxiliares
  const [showSeeEditTutoring, setShowSeeEditTutoring] = useState(false);

  const { UniversalTexts } = useUserContext();

  // ----- utils -----
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
    //@ts-ignore
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSeeModalOfTutorings = () => {
    setChange?.(!change);
    setNewStudentId("");
    setNewGroupId("");
    setShowClasses(false);
    setTheNewLink("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setSeeEditTutoring(false);
    setIsModalOfTutoringsVisible(true);
    setLoadingTutoringDays(false);
    setLoadingModalTutoringsInfo(false);
    setShowSeeEditTutoring(false);
  };

  const handleCloseModalOfTutorings = () => {
    setNewStudentId("");
    setNewGroupId("");
    setShowClasses(false);
    setTheNewLink("");
    setTheNewWeekDay("");
    setTheNewTimeOfTutoring("");
    setIsModalOfTutoringsVisible(false);
    setAlternateBoolean(!alternateBoolean);
    setChange?.(!change);
  };

  // ----- fetch lista por aluno/grupo -----
  const fetchOneSetOfTutorings = async (studentId: any) => {
    if (!studentId) return;
    try {
      setLoadingTutoringDays(true);
      const { data } = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${studentId}`,
        { headers }
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
        { headers }
      );
      setTutoringsListOfOneStudentOrGroup(data?.tutorings ?? []);
    } catch (error) {
      console.log(error, "Erro ao encontrar tutorias do grupo");
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  const fetchOneSetOfTutoringsInside = (e: any) => {
    const id = e.target.value;
    setNewStudentId(id);
    setNewGroupId("");
    setShowClasses(true);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);
    fetchOneSetOfTutorings(id);
  };

  const fetchOneSetOfGroupClassesInside = (e: any) => {
    const id = e.target.value;
    setNewGroupId(id);
    setNewStudentId("");
    setShowClasses(true);
    setSeeEditTutoring(false);
    setShowSeeEditTutoring(false);
    fetchOneSetOfGroups(id);
  };

  // ----- editar existente -----
  const seeEditOneTutoring = (item: any) => {
    setSeeEditTutoring(true);
    setTutoringId(item.id);
    setTimeOfTutoring(item.time);
    setLink(item.link || "");
    setWeekDay(item.day);
    setDuration(item.duration ?? 60);
  };

  const closeEditOneTutoring = () => {
    setSeeEditTutoring(false);
    setWeekDay("");
    setTimeOfTutoring("");
    setLink("");
  };

  const handleWeekDayChange = (e: any) => setWeekDay(e.target.value);
  const handleTimeChange = (e: any) => setTimeOfTutoring(e.target.value);

  const updateOneTutoring = async () => {
    try {
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
        { headers }
      );

      setSeeEditTutoring(false);
      if (newStudentId) fetchOneSetOfTutorings(newStudentId);
      if (newGroupId) fetchOneSetOfGroups(newGroupId);
    } catch (error) {
      console.log(error, "Erro ao atualizar recorrência");
    }
  };

  // ----- criar nova -----
  const handleTheNewWeekDayChange = (e: any) =>
    setTheNewWeekDay(e.target.value);
  const handleTheNewTimeChange = (e: any) =>
    setTheNewTimeOfTutoring(e.target.value);

  const newTutoring = async () => {
    // calcula endDate (de próxima segunda até N semanas)
    const today = new Date();
    const nextWeekDay = new Date(today);
    const dow = today.getDay();
    const daysUntilMonday = dow === 0 ? 1 : (8 - dow) % 7;
    nextWeekDay.setDate(today.getDate() + daysUntilMonday);
    const endDate = new Date(nextWeekDay);
    endDate.setDate(
      nextWeekDay.getDate() + (Number(numberOfWeeks) || 4) * 7 - 1
    );

    // alerta se < 1 mês
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    if (endDate < oneMonthFromNow) {
      const endDateFormatted = endDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const confirmMessage =
        `⚠️ ATENÇÃO: O período selecionado termina em ${endDateFormatted}, que é em menos de 1 mês.\n\n` +
        `Para períodos curtos, recomendamos:\n• Excluir esta configuração de tutoria recorrente\n• Criar eventos únicos através do botão "Criar Evento"\n\n` +
        `Deseja continuar mesmo assim?`;
      if (!window.confirm(confirmMessage)) return;
    }

    try {
      await axios.post(
        `${backDomain}/api/v1/tutoringevent`,
        {
          day: theNewWeekDay,
          time: theNewTimeOfTutoring,
          duration,
          link: theNewLink,
          studentID: newStudentId || "",
          teacherID: myId,
          groupId: newGroupId || "",
          numberOfWeeks: Number(numberOfWeeks) || 4,
          endDate,
        },
        { headers }
      );

      setSeeEditTutoring(false);
      setShowSeeEditTutoring(false);
      if (newStudentId) fetchOneSetOfTutorings(newStudentId);
      if (newGroupId) fetchOneSetOfGroups(newGroupId);
    } catch (error) {
      console.log(error, "Erro ao criar recorrência");
    }
  };

  // ----- deletar -----
  const deleteTutoring = async (item: any) => {
    try {
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
      if (newGroupId) fetchOneSetOfGroups(newGroupId);
      else if (newStudentId) fetchOneSetOfTutorings(newStudentId);
    } catch (error) {
      console.log(error, "Erro ao deletar recorrência");
    }
  };

  // ----- render -----
  const isFormIncompleteNew =
    !theNewWeekDay ||
    !theNewTimeOfTutoring ||
    !theNewLink ||
    !numberOfWeeks ||
    Number(numberOfWeeks) <= 0 ||
    Number(duration) <= 0;

  return (
    <>
      <button onClick={handleSeeModalOfTutorings}>
        <i className="fa fa-repeat" style={{ fontSize: "10px" }} />
        <span>{UniversalTexts.calendarModal.recurringClasses}</span>
      </button>

      {/* backdrop */}
      <div
        style={{
          backgroundColor: transparentWhite(),
          width: "10000px",
          height: "10000px",
          top: 0,
          left: 0,
          position: "fixed",
          zIndex: 99,
          display: isModalOfTutoringsVisible ? "block" : "none",
          padding: "0.5rem",
        }}
        onClick={handleCloseModalOfTutorings}
      />

      {/* modal */}
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
          borderRadius: "6px",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <HTwo style={{ margin: 0, color: partnerColor() }}>
            {UniversalTexts.editTurorings}
          </HTwo>
          <Xp
            onClick={handleCloseModalOfTutorings}
            style={{
              cursor: "pointer",
              color: "#998",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e: any) => (e.target.style.color = partnerColor())}
            onMouseLeave={(e: any) => (e.target.style.color = "#998")}
          >
            ✕
          </Xp>
        </div>

        {/* conteúdo */}
        {loadingModalTutoringsInfo ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        ) : (
          <div style={{ marginBottom: "1.5rem" }}>
            {/* tabs aluno/grupo */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  borderRadius: "1rem 1rem 0 0",
                  padding: "10px",
                  backgroundColor: showStudentsRecurring ? "#eee" : "white",
                }}
              >
                <button
                  style={{
                    backgroundColor: showStudentsRecurring
                      ? partnerColor()
                      : "grey",
                    color: "white",
                    padding: "5px 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "1rem",
                  }}
                  onClick={() => {
                    setShowStudentsRecurring(true);
                    setShowGroupsRecurring(false);
                  }}
                >
                  Selecionar Aluno
                </button>
              </div>
              <div
                style={{
                  borderRadius: "1rem 1rem 0 0",
                  padding: "10px",
                  backgroundColor: showGroupsRecurring ? "#eee" : "white",
                }}
              >
                <button
                  style={{
                    backgroundColor: showGroupsRecurring
                      ? partnerColor()
                      : "grey",
                    color: "white",
                    padding: "5px 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "1rem",
                  }}
                  onClick={() => {
                    setShowStudentsRecurring(false);
                    setShowGroupsRecurring(true);
                  }}
                >
                  Selecionar Grupo
                </button>
              </div>
            </div>

            {/* seleção */}
            {showStudentsRecurring && (
              <div
                style={{
                  borderRadius: "0 0 1rem 1rem",
                  padding: "10px",
                  backgroundColor: "#eee",
                }}
              >
                <select
                  onChange={fetchOneSetOfTutoringsInside}
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
                  <option value="" hidden>
                    Select student
                  </option>
                  {studentsList.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.name + " " + student.lastname}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showGroupsRecurring && (
              <div
                style={{
                  borderRadius: "0 0 1rem 1rem",
                  padding: "10px",
                  backgroundColor: "#eee",
                }}
              >
                <select
                  value={newGroupId}
                  onChange={fetchOneSetOfGroupClassesInside}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    fontSize: "0.9rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="" hidden>
                    Selecione o grupo...
                  </option>
                  {groupsList.map((group: any) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* lista de recorrências */}
        {loadingTutoringDays ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress style={{ color: partnerColor() }} />
          </div>
        ) : (
          <div style={{ marginBottom: "1.5rem" }}>
            {showClasses && tutoringsListOfOneStudentOrGroup.length > 0 && (
              <div>
                <h4 style={{ color: partnerColor(), marginBottom: "1rem" }}>
                  {UniversalTexts.calendarModal.currentClasses}
                </h4>
                <div style={{ display: "grid", gap: "5px" }}>
                  {tutoringsListOfOneStudentOrGroup
                    .sort(
                      (a: any, b: any) =>
                        moment(a.day, "dddd").day() -
                        moment(b.day, "dddd").day()
                    )
                    .map((item: any, index: number) => {
                      const isExpiring = isTutoringExpiringWithinMonth(item);
                      const daysLeft = getDaysUntilExpiration(item);
                      return (
                        <div
                          key={`${item.day}-${item.time}-${index}`}
                          style={{
                            backgroundColor: isExpiring ? "#ffebee" : "#f8f9fa",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            border: isExpiring
                              ? "2px solid #f44336"
                              : "1px solid #dee2e6",
                            boxShadow: isExpiring
                              ? "0 2px 8px rgba(244, 67, 54, 0.2)"
                              : "none",
                          }}
                        >
                          {isExpiring && (
                            <div
                              style={{
                                backgroundColor: "#f44336",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 600,
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              ⚠️
                              {/* @ts-ignore */}
                              {daysLeft > 0
                                ? `${UniversalTexts.endsIn} ${daysLeft} dia${
                                    // @ts-ignore
                                    daysLeft > 1 ? "s" : ""
                                  } (${new Date(
                                    item.endDate
                                  ).toLocaleDateString("pt-BR")})`
                                : `${UniversalTexts.expired} ${new Date(
                                    item.endDate
                                  ).toLocaleDateString("pt-BR")}`}
                              {UniversalTexts.tutoringExpiring}
                            </div>
                          )}

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
                                style={{ fontWeight: 600, color: "#495057" }}
                              >
                                {UniversalTexts.Class} #{index + 1}
                              </span>
                              <div style={{ color: "#6c757d", marginTop: 2 }}>
                                {item.day} - {item.time}
                                {item.link ? (
                                  <Link
                                    target="_blank"
                                    to={item.link}
                                    style={{
                                      color: partnerColor(),
                                      textDecoration: "none",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {UniversalTexts.accessClass}
                                  </Link>
                                ) : null}
                                {item.endDate && (
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                      color: "#6c757d",
                                    }}
                                  >
                                    (Ends on:
                                    {moment(item.endDate).format("DD/MM/YYYY")})
                                  </span>
                                )}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "5px" }}>
                              <button
                                onClick={() => seeEditOneTutoring(item)}
                                style={{
                                  padding: "5px 1rem",
                                  backgroundColor: partnerColor(),
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
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
                                  borderRadius: "6px",
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

        {/* editor de recorrência existente */}
        <div
          style={{
            display: seeEditTutoring ? "block" : "none",
            backgroundColor: "#fff3cd",
            padding: "1.5rem",
            borderRadius: "6px",
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
                borderRadius: "6px",
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
                borderRadius: "6px",
                border: "1px solid #ced4da",
                backgroundColor: "white",
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
              onChange={handleTimeChange}
              value={timeOfTutoring}
              style={{
                padding: "5px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                backgroundColor: "white",
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
                padding: "5px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
              }}
              required
            />

            <input
              value={duration}
              onChange={(e) => {
                const v = e.target.value;
                if (
                  v === "" ||
                  (v.length <= 3 && Number(v) >= 0 && Number(v) <= 300)
                ) {
                  setDuration(v);
                }
              }}
              placeholder={UniversalTexts.duration}
              type="number"
              min="1"
              max="300"
              style={{
                padding: "5px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                maxWidth: "80px",
                textAlign: "center",
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
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {UniversalTexts.calendarModal.saveChanges}
            </button>
          </div>
        </div>

        {/* toggle e form para criar nova recorrência */}
        {(newStudentId !== "" || newGroupId !== "") && (
          <button
            onClick={() => setShowSeeEditTutoring(!showSeeEditTutoring)}
            style={{
              padding: "8px 1.5rem",
              marginBottom: "5px",
              borderRadius: "6px",
              backgroundColor: !showSeeEditTutoring ? "#f0f9f0" : "#fdf2f2",
              border: !showSeeEditTutoring
                ? "1px solid #d4e6d4"
                : "1px solid #f5c6c6",
              color: !showSeeEditTutoring ? "#2d5016" : "#8b2635",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = !showSeeEditTutoring
                ? "#e8f5e8"
                : "#fce8e8";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = !showSeeEditTutoring
                ? "#f0f9f0"
                : "#fdf2f2";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            {showSeeEditTutoring
              ? UniversalTexts.hideShowClasses
              : UniversalTexts.showShowClasses}
          </button>
        )}

        {(newStudentId !== "" || newGroupId !== "") &&
          showSeeEditTutoring &&
          !seeEditTutoring && (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "6px",
                backgroundColor: "#d4edda",
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
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    backgroundColor: "white",
                  }}
                >
                  <option hidden value="">
                    {UniversalTexts.calendarModal.selectWeekDayOption}
                  </option>
                  {weekDays.map((wd) => (
                    <option key={wd} value={wd}>
                      {wd}
                    </option>
                  ))}
                </select>

                <select
                  onChange={handleTheNewTimeChange}
                  value={theNewTimeOfTutoring}
                  style={{
                    padding: "5px",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                    backgroundColor: "white",
                  }}
                >
                  <option hidden value="">
                    {UniversalTexts.calendarModal.selectTimeOption}
                  </option>
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <input
                  placeholder={UniversalTexts.calendarModal.meetingLink}
                  value={theNewLink}
                  onChange={(e) => setTheNewLink(e.target.value)}
                  type="text"
                  style={{
                    padding: "5px",
                    borderRadius: "6px",
                    border: "1px solid #ced4da",
                  }}
                  required
                />

                {/* atalhos e duração */}
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
                      { label: "3m", weeks: 12, tooltip: "3 meses" },
                      { label: "6m", weeks: 24, tooltip: "6 meses" },
                      { label: "1a", weeks: 52, tooltip: "1 ano" },
                      { label: "2a", weeks: 104, tooltip: "2 anos" },
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
                        onMouseEnter={(e) => {
                          if (Number(numberOfWeeks) !== weeks) {
                            e.currentTarget.style.backgroundColor = "#f0f0f0";
                            e.currentTarget.style.borderColor = "#bdbdbd";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (Number(numberOfWeeks) !== weeks) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                            e.currentTarget.style.borderColor = "#e0e0e0";
                          }
                        }}
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
                          (v.length <= 2 && Number(v) >= 0 && Number(v) <= 99)
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
                      { label: "30min", minutes: 30, tooltip: "30 minutos" },
                      { label: "45min", minutes: 45, tooltip: "45 minutos" },
                      { label: "1h", minutes: 60, tooltip: "1 hora" },
                      { label: "1h30min", minutes: 90, tooltip: "1h30" },
                      { label: "2h", minutes: 120, tooltip: "2 horas" },
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
                        onMouseEnter={(e) => {
                          if (Number(duration) !== minutes) {
                            e.currentTarget.style.backgroundColor = "#f0f0f0";
                            e.currentTarget.style.borderColor = "#bdbdbd";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (Number(duration) !== minutes) {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                            e.currentTarget.style.borderColor = "#e0e0e0";
                          }
                        }}
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
                          (v.length <= 3 && Number(v) >= 0 && Number(v) <= 300)
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

                  {/* preview do período */}
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
                    {numberOfWeeks && Number(numberOfWeeks) > 0 ? (
                      <div>
                        {(() => {
                          const today = new Date();
                          const nextWeekDay = new Date(today);
                          const dow = today.getDay();
                          const daysUntilMonday = dow === 0 ? 1 : (8 - dow) % 7;
                          nextWeekDay.setDate(
                            today.getDate() + daysUntilMonday
                          );
                          const endDate = new Date(nextWeekDay);
                          endDate.setDate(
                            nextWeekDay.getDate() +
                              (Number(numberOfWeeks) || 4) * 7 -
                              1
                          );
                          const fmt = (d: any) =>
                            d.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            });
                          return `${fmt(nextWeekDay)} até ${fmt(
                            endDate
                          )} (${numberOfWeeks} semana${
                            Number(numberOfWeeks) > 1 ? "s" : ""
                          })`;
                        })()}
                      </div>
                    ) : (
                      <div>
                        {UniversalTexts.calendarModal.selectNumberOfWeeks}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={newTutoring}
                  disabled={isFormIncompleteNew}
                  style={{
                    padding: "5px 1.5rem",
                    backgroundColor: isFormIncompleteNew
                      ? "#6c757d"
                      : partnerColor(),
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isFormIncompleteNew ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    opacity: isFormIncompleteNew ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  title={
                    isFormIncompleteNew
                      ? "Preencha todos os campos: estudante/grupo, dia, horário, link e número de semanas"
                      : "Criar tutoria recorrente"
                  }
                >
                  {UniversalTexts.calendarModal.addNewClass}
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

export default NewRecurringEventCalendar;
