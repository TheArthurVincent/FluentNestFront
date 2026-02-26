import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../NewHomePageArvin/NewHomePageArvin";
import MainInfoClass from "./sessions/MainInfoClass";
import LastClass from "./sessions/LastEvent";
import Board from "./sessions/BoardLesson";
import LessonContent from "./sessions/LessonContent";
import DeleteClass from "./sessions/DeleteEvent";
import { partnerColor } from "../../../Styles/Styles";
import HomeworkClass from "./sessions/HomeworkClass";
import Helmets from "../../../Resources/Helmets";

type EventProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

const Event: FC<EventProps> = ({ headers, isDesktop }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState<any>(null);
  const [replicateLastEvent, setReplicateLastEvent] = useState<boolean>(false);
  const [permissionsUser, setPermissionsUser] = useState<string>("student");
  const [seeReplenish, setSeeReplenish] = useState(false);
  const [selectedFutureEventId, setSelectedFutureEventId] =
    useState<string>("");
  const [rescheduling, setRescheduling] = useState(false);

  const rescheduleEvent = async (
    id: string,
    forced?: { date: string; time: string; idNew?: string },
  ) => {
    try {
      setRescheduling(true);
      const response = await axios.put(
        `${backDomain}/api/v1/event-reschedule/${id}`,
        { forced },
        { headers: headers as any },
      );
      console.log("Evento reagendado com sucesso", response.data.event._id);
      window.location.assign(`/my-calendar/event/${response.data.event._id}`);
    } catch (error) {
      console.error("Erro ao reagendar o evento", error);
    } finally {
      setRescheduling(false);
    }
  };

  const fetchEventData = async () => {
    setPermissionsUser(
      JSON.parse(localStorage.getItem("loggedIn") || "{}").permissions,
    );

    if (!eventId) return;
    try {
      const res = await axios.get(`${backDomain}/api/v1/event/${eventId}`, {
        headers: headers as any,
      });
      setEventData(res.data.event);
      console.log(res.data.event);
      setReplicateLastEvent(
        res.data.event.replicateLastEvent 
        // &&  res.data.event.category !== "Established Group Class",
      );
    } catch (err) {
      console.error("Error fetching event data", err);
    }
  };

  useEffect(() => {
    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const event = eventData;
  const lastLesson = eventData?.recentUnmarkedEvents?.[0] || null;

  const [futureEventsData, setFutureEventsData] = useState<any>(null);

  const fetchFutureEventsData = async () => {
    const student = JSON.parse(localStorage.getItem("loggedIn") || "{}");

    setPermissionsUser(
      JSON.parse(localStorage.getItem("loggedIn") || "{}").permissions,
    );

    if (!eventId) return;
    try {
      const res = await axios.get(
        `${backDomain}/api/v1/next-few-events/${student.id || student._id}?eventId=${eventId}`,
        {
          headers: headers as any,
        },
      );
      setFutureEventsData(res.data.eventsList);
      console.log(res.data.eventsList);
    } catch (err) {
      console.error("Error fetching event data", err);
    }
  };

  const updateScheduled = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        { status: "marcado" },
        { headers: headers as any },
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  const updateUnscheduled = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        { status: "desmarcado" },
        { headers: headers as any },
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

  const updateRealizedClass = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        { status: "realizada" },
        { headers: headers as any },
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };

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
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>
              {event
                ? `${event.student ? event.student : ""} ${event.date} (${event.time})`
                : "Evento"}
            </span>
            <Helmets
              text={
                event
                  ? `${event.student} ${event.date} (${event.time})`
                  : "Evento"
              }
            />
          </section>

          {/* Só mostra os botões se o evento já foi carregado */}
          {event && event.category !== "Marcar Reposição" && (
            <div
              style={{
                display: permissionsUser !== "student" ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateScheduled(event._id)}
              >
                <i
                  className="fa fa-clock-o"
                  style={{
                    fontSize:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "#007bff"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "#007bff"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Agendado
                </div>
              </div>

              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateRealizedClass(event._id)}
              >
                <i
                  className="fa fa-check-circle"
                  style={{
                    fontSize:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "#28a745"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "#28a745"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Realizado
                </div>
              </div>

              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateUnscheduled(event._id)}
              >
                <i
                  className="fa fa-times-circle-o"
                  style={{
                    fontSize:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "#dc3545"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "#dc3545"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Cancelado
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WRAPPER PRINCIPAL */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          borderRadius: "8px",
          margin: !isDesktop ? "12px" : "0px",
          display: "grid",
          gridAutoColumns: "1fr",
          gap: 12,
        }}
      >
        {/* MOBILE – só renderiza se o evento existir */}
        {!isDesktop &&
          event &&
          event.status &&
          event.category !== "Marcar Reposição" && (
            <div
              style={{
                display: permissionsUser !== "student" ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                fontSize: "0.8rem",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateScheduled(event._id)}
              >
                <i
                  className="fa fa-clock-o"
                  style={{
                    fontSize:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "#007bff"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Scheduled" || event.status === "marcado"
                        ? "#007bff"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Agendado
                </div>
              </div>
              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateRealizedClass(event._id)}
              >
                <i
                  className="fa fa-check-circle"
                  style={{
                    fontSize:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "#28a745"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Realized" ||
                      event.status === "realizada"
                        ? "#28a745"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Realizado
                </div>
              </div>

              <div
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => updateUnscheduled(event._id)}
              >
                <i
                  className="fa fa-times-circle-o"
                  style={{
                    fontSize:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "24px"
                        : "18px",
                    color:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "#dc3545"
                        : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color:
                      event.status === "Canceled" ||
                      event.status === "desmarcado"
                        ? "#dc3545"
                        : "#6c757d",
                    marginTop: "2px",
                  }}
                >
                  Cancelado
                </div>
              </div>
            </div>
          )}

        {!event && (
          <div
            style={{
              fontWeight: 500,
              fontSize: 13,
              color: "#64748B",
            }}
          >
            Carregando dados do evento...
          </div>
        )}

        {event && event.category === "Marcar Reposição" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            {/* Botão principal */}
            {!seeReplenish && (
              <button
                onClick={() => {
                  fetchFutureEventsData();
                  setSelectedFutureEventId("");
                  setTimeout(() => setSeeReplenish(true), 500);
                }}
                style={{
                  marginTop: 4,
                  width: "100%",
                  borderRadius: 999,
                  border: "1px solid transparent",
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: `linear-gradient(90deg, ${partnerColor()}, ${partnerColor()}cc)`,
                  color: "#ffffff",
                }}
              >
                Reservar o horário
              </button>
            )}

            {/* Confirmação */}
            {seeReplenish && (
              <div
                style={{
                  marginTop: 6,
                  borderRadius: 10,
                  padding: "12px 12px 10px",
                  backgroundColor: "#0f172a",
                  color: "#e5e7eb",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Deseja agendar sua aula de reposição para este horário? Esta
                  ação não poderá ser desfeita.
                </p>
                Escolha uma de suas aulas agendadas para transferir para{" "}
                {event.date}: <br />
                <div
                  style={{
                    display: "grid",
                    overflowY: "auto",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {futureEventsData && futureEventsData.length > 0
                    ? futureEventsData.map((futureEvent: any) => {
                        const isSelected =
                          selectedFutureEventId === futureEvent._id;
                        return (
                          <div
                            key={futureEvent._id}
                            onClick={() =>
                              setSelectedFutureEventId(futureEvent._id)
                            }
                            style={{
                              gap: 20,
                              border: isSelected
                                ? `1px solid ${partnerColor()}`
                                : "1px solid #334155",
                              borderRadius: 8,
                              padding: 8,
                              fontSize: 12,
                              color: "#e5e7eb",
                              cursor: "pointer",
                              background: isSelected
                                ? partnerColor()
                                : "transparent",
                            }}
                          >
                            {futureEvent.date} às {futureEvent.time}
                          </div>
                        );
                      })
                    : "Nenhuma aula agendada disponível para substituição/reposição."}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedFutureEventId("");
                      setSeeReplenish(false);
                    }}
                    style={{
                      padding: "6px 16px",
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={!selectedFutureEventId || rescheduling}
                    onClick={async () => {
                      if (!eventId) return; // slot destino (Marcar Reposição)
                      if (!selectedFutureEventId) return;
                      await rescheduleEvent(selectedFutureEventId, {
                        idNew: eventId, // o slot "Marcar Reposição" atual
                        date: event.date, // só pra descrição no back
                        time: event.time, // só pra descrição no back
                      });

                      setSeeReplenish(false);
                    }}
                    style={{
                      padding: "6px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 999,
                      border: "1px solid transparent",
                      background: `linear-gradient(90deg, ${partnerColor()}, ${partnerColor()}cc)`,
                      color: "#ffffff",
                      cursor:
                        !selectedFutureEventId || rescheduling
                          ? "not-allowed"
                          : "pointer",
                      opacity: !selectedFutureEventId || rescheduling ? 0.6 : 1,
                    }}
                  >
                    Confirmar reposição
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {event && event.category !== "Marcar Reposição" && (
          <>
            {(event.homeworkDetails || permissionsUser !== "student") && (
              <>
                <HomeworkClass
                  homeworkID={event.homeworkID}
                  homeworkData={event.homeworkDetails?.description || ""}
                  homeworkAnswer={event.homeworkDetails?.answers || ""}
                  headers={headers}
                  evendId={event._id}
                  event={event}
                  isDesktop={isDesktop}
                  fetchEventData={fetchEventData}
                  allowedToEdit={permissionsUser !== "student"}
                  allowedToAnswer={permissionsUser === "student"} // ou true
                />
              </>
            )}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr",
              }}
            >
              <MainInfoClass
                event={event}
                headers={headers}
                permissionsUser={permissionsUser}
                isDesktop={isDesktop}
                fetchEventData={fetchEventData}
                evendId={event._id}
                allowedToEdit={permissionsUser !== "student"}
                theDescription={event.description}
                theTeacherDescription={event.teacherDescription}
                lesson={event.theLesson}
                status={event.status}
                title={event.student || "Aluno particular"}
              />
            </div>
            <LessonContent
              headers={headers}
              fetchEventData={fetchEventData}
              permissionsUser={permissionsUser}
              seeExercise={false}
              date={event.date}
              theLessonRender={event.theLessonRender}
              eventId={event._id}
              studentID={event.studentID}
              studentsIds={event.listOfStudents.map((a: any) => a._id)}
            />
            {(event.board || permissionsUser !== "student") && (
              <div
                style={{
                  height: "fit-content",
                  maxHeight: isDesktop ? "90vw" : "none",
                  zIndex: 5, // garante sobreposição
                }}
              >
                <Board
                  allowedToEdit={permissionsUser !== "student"}
                  headers={headers}
                  theBoard={event.board}
                  evendId={event._id}
                />
              </div>
            )}

            {lastLesson && permissionsUser !== "student" && (
              <LastClass
                replicateLastEvent={replicateLastEvent}
                headers={headers}
                evendId={event._id}
                allowedToEdit={permissionsUser !== "student"}
                isDesktop={isDesktop}
                lastLesson={lastLesson}
              />
            )}
            {event && permissionsUser !== "student" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: partnerColor(),
                    maxWidth: "fit-content",
                    maxHeight: "fit-content",
                    padding: "6px 12px",
                  }}
                  onClick={() =>
                    window.location.assign(
                      `/my-calendar/event/${lastLesson._id}`,
                    )
                  }
                >
                  <i className="fa fa-arrow-left" />
                  Aula anterior
                </button>
                <DeleteClass
                  headers={headers}
                  evendId={event._id}
                  allowedToEdit={permissionsUser !== "student"}
                  isDesktop={isDesktop}
                  lastLesson={lastLesson}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Event;
