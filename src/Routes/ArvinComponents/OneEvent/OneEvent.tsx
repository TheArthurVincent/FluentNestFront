import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../NewHomePageArvin/NewHomePageArvin";
import EventVideo from "./sessions/VideoClass";
import MainInfoClass from "./sessions/MainInfoClass";
import Description from "./sessions/Description";
import LastClass from "./sessions/LastEvent";
import Board from "./sessions/BoardLesson";
import LessonContent from "./sessions/LessonContent";
import DeleteClass from "./sessions/DeleteEvent";

type EventProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

const Event: FC<EventProps> = ({ headers, isDesktop }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState<any>(null);

  const [permissionsUser, setPermissionsUser] = useState<string>("student");

  const fetchEventData = async () => {
    setPermissionsUser(
      JSON.parse(localStorage.getItem("loggedIn") || "{}").permissions
    );

    console.log(
      "Fetching data for eventId:",
      JSON.parse(localStorage.getItem("loggedIn") || "{}").permissions
    );
    if (!eventId) return;
    try {
      const res = await axios.get(`${backDomain}/api/v1/event/${eventId}`, {
        headers: headers as any,
      });
      setEventData(res.data.event);
      console.log(res.data.event);
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

  const updateScheduled = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        { status: "marcado" },
        { headers: headers as any }
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
        { headers: headers as any }
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
        { headers: headers as any }
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
                ? `${event.student} ${event.date} (${event.time})`
                : "Evento"}
            </span>
          </section>

          {/* Só mostra os botões se o evento já foi carregado */}
          {event && (
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
          borderRadius: "12px",
          margin: !isDesktop ? "12px" : "0px",
          display: "grid",
          gridAutoColumns: "1fr",
          gap: 12,
        }}
      >
        {/* MOBILE – só renderiza se o evento existir */}
        {!isDesktop && event && event.status && (
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
                    event.status === "Realized" || event.status === "realizada"
                      ? "24px"
                      : "18px",
                  color:
                    event.status === "Realized" || event.status === "realizada"
                      ? "#28a745"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status === "Realized" || event.status === "realizada"
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
                    event.status === "Canceled" || event.status === "desmarcado"
                      ? "24px"
                      : "18px",
                  color:
                    event.status === "Canceled" || event.status === "desmarcado"
                      ? "#dc3545"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status === "Canceled" || event.status === "desmarcado"
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

        {event && (
          <>
            {(event.video || permissionsUser !== "student") && (
              <EventVideo
                allowedToEdit={permissionsUser !== "student"}
                fetchEventData={fetchEventData}
                headers={headers}
                videoUrl={event.video}
                evendId={event._id}
              />
            )}{" "}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
              }}
            >
              <MainInfoClass
                event={event}
                allowedToEdit={permissionsUser !== "student"}
                headers={headers}
                isDesktop={isDesktop}
                fetchEventData={fetchEventData}
                evendId={event._id}
              />
              {(event.description || permissionsUser !== "student") && (
                <Description
                  status={event.status}
                  allowedToEdit={permissionsUser !== "student"}
                  lesson={event.theLesson}
                  headers={headers}
                  theDescription={event.description}
                  evendId={event._id}
                  fetchEventData={fetchEventData}
                />
              )}
            </div>
            {(event.board || permissionsUser !== "student") && (
              <Board
                allowedToEdit={permissionsUser !== "student"}
                headers={headers}
                theBoard={event.board}
                evendId={event._id}
              />
            )}{" "}
            {(event.theLessonRender || permissionsUser !== "student") && (
              <LessonContent
                headers={headers}
                date={event.date}
                theLessonRender={event.theLessonRender}
                eventId={event._id}
                studentID={event.studentID}
              />
            )}
            {(lastLesson || permissionsUser !== "student") && (
              <LastClass
                headers={headers}
                evendId={event._id}
                allowedToEdit={permissionsUser !== "student"}
                isDesktop={isDesktop}
                lastLesson={lastLesson}
              />
            )}
            <DeleteClass
              headers={headers}
              evendId={event._id}
              allowedToEdit={permissionsUser !== "student"}
              isDesktop={isDesktop}
              lastLesson={lastLesson}
            />
          </>
        )}
      </div>

      {isDesktop && (
        <div
          style={{
            minHeight: 200,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Event;
