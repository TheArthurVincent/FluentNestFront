import React, { useEffect, useState, useRef } from "react";
import {
  HOne,
  RouteDiv,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";
import { partnerColor } from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { CircularProgress } from "@mui/material";
import {
  backDomain,
  onLoggOut,
  onLoggOutFee,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { getLastMonday } from "./CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { CardCalendar } from "./CalendarComponents/Card/CardCalendar";
import ToDoAddButton from "./CalendarComponents/ToDo/ToDoNew";
import NewRecurringEventCalendar from "./CalendarComponents/NewRecurringEventCalendar/NewRecurringEventCalendar";
import NewEventModal from "./CalendarComponents/NewEventStandalone/NewEventModal";
import EventEditModal from "./CalendarComponents/OneEventCard/EventEditModal/EventEditModal";

interface MyCalendarNewProps {
  headers: any;
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
}

function MyCalendarNew({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
}: MyCalendarNewProps) {
  // Estados básicos
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<any[]>([]);
  const [todoList, setTodoList] = useState<any[]>([]);
  const [today, setToday] = useState<Date>(getLastMonday(new Date()));
  const [shouldScrollToToday, setShouldScrollToToday] = useState<boolean>(true);
  const [disabledAvoid, setDisabledAvoid] = useState<boolean>(true);
  const [alternateBoolean, setAlternateBoolean] = useState<boolean>(false);
  const [showNewEventModal, setShowNewEventModal] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [groupsList, setGroupsList] = useState<any[]>([]);

  // Estados para visualização de evento único
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);
  const [showSingleEventView, setShowSingleEventView] =
    useState<boolean>(false);

  // Refs
  const calendarRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const { UniversalTexts } = useUserContext();

  // Função para carregar estudantes e grupos

  // Buscar estudantes e grupos
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${myId}`,
        { headers }
      );
      const res = response.data.listOfStudents;
      setStudentsList(res || []);
    } catch (error: any) {
      console.log(error, "Erro ao buscar estudantes e grupos");
    }
  };
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/groups/${myId}`, {
        headers,
      });
      const res = response.data.groups;
      setGroupsList(res || []);
      console.log(res, "Grupos buscados");
    } catch (error: any) {
      console.log(error, "Erro ao buscar estudantes e grupos");
    }
  };

  // Carregar dados quando modal abrir
  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, [change]);

  const loadGeneral = async (baseDate?: Date) => {
    setDisabledAvoid(false);
    setLoading(true);
    setShouldScrollToToday(!baseDate);

    try {
      // Verificar usuário e mensalidade
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const { id, feeUpToDate } = user;
      updateInfo(id, headers);

      if (!feeUpToDate) {
        onLoggOutFee();
        return;
      }

      // Calcular data base
      const raw = baseDate ? new Date(baseDate) : new Date();
      raw.setHours(raw.getHours() + 4);
      const monday = getLastMonday(raw);
      setToday(monday);

      // Fazer requisição
      const response = await axios.get(
        `${backDomain}/api/v1/eventsgeneral/${id}`,
        { headers, params: { today: monday } }
      );

      // Normalizar dados
      const addOneDayAndFormat = (dt: any) => {
        const d = new Date(dt);
        d.setDate(d.getDate() + 1);
        return new Date(d);
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

      // Atualizar estados
      const { eventsList = [], todosList = [] } = response.data || {};
      setEvents(eventsList.map(normalizeEvent));
      setTodoList(todosList.map(normalizeTodo));
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

  // Efeito inicial
  useEffect(() => {
    loadGeneral(new Date());
  }, [alternateBoolean]);

  // Função para mudar semana
  const handleChangeWeek = async (sum: number) => {
    setDisabledAvoid(false);
    const chosen = new Date(today);
    chosen.setDate(chosen.getDate() + sum);
    loadGeneral(chosen);
  };

  // Função para mudança de data
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetDate = new Date(e.target.value);
    loadGeneral(targetDate);
  };

  // Gerar datas da semana ou dia único
  const futureDates = [];
  if (showSingleEventView && selectedEventDate) {
    // Mostrar apenas o dia do evento selecionado
    futureDates.push(new Date(selectedEventDate));
  } else {
    // Mostrar a semana normal
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      futureDates.push(date);
    }
  }

  // Efeito para scroll automático (apenas na visualização de semana)
  useEffect(() => {
    if (
      !showSingleEventView &&
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
  }, [loading, futureDates, showSingleEventView]);

  // Handlers para eventos e todos
  const handleEventClick = (event: any) => {
    // Configurar a visualização de evento único
    setSelectedEvent(event);
    setSelectedEventDate(event.date);
    setShowSingleEventView(true);

    // Navegar para o dia do evento
    loadGeneral(event.date);
  };

  const handleBackToWeekView = () => {
    setSelectedEvent(null);
    setSelectedEventDate(null);
    setShowSingleEventView(false);

    // Recarregar a visualização de semana
    loadGeneral(new Date());
  };

  const handleTodoClick = (todoId: string) => {
    console.log("Todo clicked:", todoId);
    // TODO: Implementar modal de todo
  };

  // Handler para quando evento for criado
  const handleEventCreated = () => {
    setAlternateBoolean(!alternateBoolean); // Recarregar dados
    setChange(!change); // Trigger mudança no parent se necessário
  };

  const authorizeOrNot =
    thePermissions === "superadmin" || thePermissions === "teacher";

  return (
    <>
      {headers ? (
        <RouteDiv style={{ width: "96vw" }}>
          <div>
            <HOne>📅 {UniversalTexts.calendar} - Nova Versão</HOne>

            {/* Controles de Navegação */}
            <div
              style={{
                marginBottom: "1rem",
                background: "#ffffff",
                borderRadius: 4,
                border: "1px solid #e1e5e9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {/* Botão de voltar à visualização de semana */}
                {showSingleEventView && (
                  <button
                    onClick={handleBackToWeekView}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#495057",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.background = "#e9ecef";
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.background = "#f8f9fa";
                    }}
                  >
                    ← Voltar à Semana
                  </button>
                )}

                {/* Navegação de Semanas (apenas na visualização de semana) */}
                {!showSingleEventView && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#f8f9fa",
                        borderRadius: 4,
                        padding: "4px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <button
                        disabled={!disabledAvoid}
                        style={{
                          width: "32px",
                          height: "32px",
                          background: !disabledAvoid ? "#e9ecef" : "#ffffff",
                          border: "1px solid #dee2e6",
                          borderRadius: 4,
                          color: !disabledAvoid ? "#adb5bd" : "#495057",
                          cursor: !disabledAvoid ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                        onClick={() => handleChangeWeek(-7)}
                      >
                        ←
                      </button>

                      <div
                        style={{
                          padding: "0 16px",
                          fontWeight: "600",
                          color: "#495057",
                          fontSize: "14px",
                          minWidth: "120px",
                          textAlign: "center",
                        }}
                      >
                        {today.toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <button
                        disabled={!disabledAvoid}
                        style={{
                          width: "32px",
                          height: "32px",
                          background: !disabledAvoid ? "#e9ecef" : "#ffffff",
                          border: "1px solid #dee2e6",
                          borderRadius: 4,
                          color: !disabledAvoid ? "#adb5bd" : "#495057",
                          cursor: !disabledAvoid ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                        onClick={() => handleChangeWeek(7)}
                      >
                        →
                      </button>
                    </div>

                    {/* Seletor de Data */}
                    <div
                      style={{
                        position: "relative",
                        background: "#f8f9fa",
                        borderRadius: 4,
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
                          padding: "8px 12px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: loading ? "#adb5bd" : "#495057",
                          backgroundColor: "transparent",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.6 : 1,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Título da visualização de evento único */}
                {showSingleEventView && selectedEvent && (
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "#495057",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    📅{" "}
                    {selectedEventDate?.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}

                {/* Ações do Professor (apenas na visualização de semana) */}
                {authorizeOrNot && !showSingleEventView && (
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <button onClick={() => setShowNewEventModal(true)}>
                      + Nova Aula
                    </button>
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
                  </div>
                )}
              </div>
            </div>

            {/* Calendário da Semana */}
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <CircularProgress style={{ color: partnerColor() }} />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2.5fr",
                  gap: "16px",
                  height: showSingleEventView ? "calc(100vh - 200px)" : "auto",
                }}
              >
                {/* Container do Calendário */}
                <div
                  style={{
                    flex: showSingleEventView ? "0 0 60%" : "1",
                    minWidth: showSingleEventView ? "60%" : "auto",
                  }}
                >
                  <div
                    ref={calendarRef}
                    onScroll={() => setShouldScrollToToday(false)}
                    style={{
                      display: "flex",
                      gap: "8px",
                      overflowX: showSingleEventView ? "hidden" : "auto",
                      padding: "16px 0",
                      scrollbarWidth: "thin",
                      scrollbarColor: `${partnerColor()} transparent`,
                      justifyContent: showSingleEventView
                        ? "flex-start"
                        : "flex-start",
                    }}
                  >
                    {futureDates.map((date, index) => {
                      const hj = new Date();
                      const isToday =
                        hj.getDate() === date.getDate() &&
                        hj.getMonth() === date.getMonth() &&
                        hj.getFullYear() === date.getFullYear();

                      return (
                        <CardCalendar
                          key={index}
                          date={date}
                          index={index}
                          isToday={isToday}
                          todayRef={isToday ? todayRef : undefined}
                          todoList={todoList}
                          events={events}
                          onTodoClick={handleTodoClick}
                          onEventClick={handleEventClick}
                          headers={headers}
                          thePermissions={thePermissions}
                          myId={myId}
                          setChange={setChange}
                          change={change}
                          alternateBoolean={alternateBoolean}
                          setAlternateBoolean={setAlternateBoolean}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Container do Modal de Edição (apenas na visualização de evento único) */}
                {showSingleEventView && selectedEvent && (
                  <div
                    style={{
                      flex: "0 0 40%",
                      minWidth: "40%",
                      background: "#ffffff",
                      borderRadius: 4,
                      border: "1px solid #e1e5e9",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      padding: "16px",
                      overflow: "auto",
                      maxHeight: "calc(100vh - 200px)",
                    }}
                  >
                    <EventEditModal
                      headers={headers}
                      thePermissions={thePermissions}
                      myId={myId}
                      setChange={setChange}
                      fetchStudents={fetchStudents}
                      change={change}
                      studentID={selectedEvent.student?._id || selectedEvent.student.id}
                      alternateBoolean={alternateBoolean}
                      setAlternateBoolean={setAlternateBoolean}
                      event={selectedEvent}
                      onClose={() => {
                        setShowSingleEventView(false);
                        setSelectedEvent(null);
                      }}
                      onEventUpdated={() => loadGeneral(selectedEventDate || new Date())}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal de Nova Aula */}
          <NewEventModal
            isVisible={showNewEventModal}
            onClose={() => setShowNewEventModal(false)}
            headers={headers}
            myId={myId}
            onEventCreated={handleEventCreated}
            initialDate={today.toISOString().split("T")[0]}
          />
        </RouteDiv>
      ) : (
        <RouteSizeControlBox>
          {UniversalTexts.calendarModal.noLoggedUser}
        </RouteSizeControlBox>
      )}
    </>
  );
}

export default MyCalendarNew;
