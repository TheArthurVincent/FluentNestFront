import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Outlet, useParams } from "react-router-dom";
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
import { partnerColor } from "../../../Styles/Styles";
import HomeworkClass from "./sessions/HomeworkClass";
import Helmets from "../../../Resources/Helmets";

type EventProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};
type TabType = "dados" | "homework" | "conteudo";

const Event: FC<EventProps> = ({ headers, isDesktop }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState<any>(null);
  const [replicateLastEvent, setReplicateLastEvent] = useState<boolean>(false);
  const [permissionsUser, setPermissionsUser] = useState<string>("student");
  const [seeReplenish, setSeeReplenish] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // NOVO: controle de abas  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("dados");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabType | null;

    if (
      tabFromUrl === "dados" ||
      tabFromUrl === "conteudo" ||
      tabFromUrl === "homework"
    ) {
      setActiveTab(tabFromUrl);
    } else {
      // se não tiver `tab` na URL, garante o default
      setActiveTab("dados");
    }
  }, [searchParams]);

  const handleChangeTab = (tab: TabType) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);

    // se quiser SEMPRE explicitar a aba na URL:
    newParams.set("tab", tab);

    // se quiser que a aba padrão não use ?tab=...
    // if (tab === "dados") newParams.delete("tab");
    // else newParams.set("tab", tab);

    setSearchParams(newParams);
  };

  const fetchEventData = async () => {
    setPermissionsUser(
      JSON.parse(localStorage.getItem("loggedIn") || "{}").permissions
    );

    if (!eventId) return;
    try {
      const res = await axios.get(`${backDomain}/api/v1/event/${eventId}`, {
        headers: headers as any,
      });
      console.log(res.data.event);
      setEventData(res.data.event);
      setReplicateLastEvent(res.data.event.replicateLastEvent);
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

  const handleScheduleReplenish = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "null");
      const { id } = user;

      const response = await axios.put(
        `${backDomain}/api/v1/scheduleclass/${id}?eventId=${eventId}`,
        {
          headers,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
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
          borderRadius: "12px",
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
                onClick={() => setSeeReplenish(true)}
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
                Reservar o horário de {event.date} às {event.time} reposição
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={() => setSeeReplenish(false)}
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
                    onClick={async () => {
                      await handleScheduleReplenish();
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
                      cursor: "pointer",
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
            {/* ABAS */}
            <div
              style={{
                display: "flex",
                gap: 8,
                borderBottom: "1px solid #e2e8f0",
                marginBottom: 4,
              }}
            >
              <button
                onClick={() => handleChangeTab("dados")}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  borderRadius: 0,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: activeTab === "dados" ? partnerColor() : "#64748B",
                  outline: "none",
                }}
              >
                Dados da aula
              </button>
              <button
                onClick={() => handleChangeTab("conteudo")}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 0,
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: activeTab === "conteudo" ? partnerColor() : "#64748B",
                  outline: "none",
                }}
              >
                Conteúdo da aula
              </button>
              <button
                onClick={() => handleChangeTab("homework")}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 0,
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: activeTab === "homework" ? partnerColor() : "#64748B",
                  outline: "none",
                }}
              >
                Exercícios
              </button>
            </div>

            {/* ABA: DADOS DA AULA */}
            {activeTab === "dados" && (
              <>
                {(event.video || permissionsUser !== "student") && (
                  <EventVideo
                    allowedToEdit={permissionsUser !== "student"}
                    fetchEventData={fetchEventData}
                    headers={headers}
                    videoUrl={event.video}
                    evendId={event._id}
                  />
                )}
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
                      title={event.student || "Aluno particular"}
                      status={event.status}
                      allowedToEdit={permissionsUser !== "student"}
                      lesson={event.theLesson}
                      headers={headers}
                      theDescription={event.description}
                      theTeacherDescription={event.teacherDescription}
                      evendId={event._id}
                      fetchEventData={fetchEventData}
                    />
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
                </div>
              </>
            )}

            {/* ABA: CONTEÚDO DA AULA */}
            {activeTab === "conteudo" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    isDesktop && event.board ? "1fr 0.5fr" : "1fr",
                  gap: 12,
                }}
              >
                {(event.theLessonRender || permissionsUser !== "student") && (
                  <div
                    style={{
                      paddingLeft: isDesktop ? 12 : 0,
                      overflowY: "visible",
                    }}
                  >
                    <LessonContent
                      headers={headers}
                      fetchEventData={fetchEventData}
                      seeExercise={false}
                      date={event.date}
                      theLessonRender={event.theLessonRender}
                      eventId={event._id}
                      studentID={event.studentID}
                    />
                  </div>
                )}
                {(event.board || permissionsUser !== "student") && (
                  <div
                    style={{
                      position: isDesktop ? "sticky" : "relative",
                      top: isDesktop ? 20 : 0,
                      alignSelf: "start", // mantém o sticky no topo
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
              </div>
            )}
            {activeTab === "homework" && (
              <>
                <div
                  style={{
                    paddingLeft: isDesktop ? 12 : 0,
                    overflowY: "visible",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {(event.homeworkDetails || permissionsUser !== "student") && (
                    <HomeworkClass
                      homeworkID={event.homeworkID}
                      homeworkData={
                        event.homeworkDetails
                          ? event.homeworkDetails.description
                          : "Type here"
                      }
                      headers={headers}
                      evendId={event._id}
                      event={event}
                      isDesktop={isDesktop}
                      fetchEventData={fetchEventData}
                      allowedToEdit={permissionsUser !== "student"}
                    />
                  )}
                  {(event.theLessonRender || permissionsUser !== "student") && (
                    <LessonContent
                      headers={headers}
                      fetchEventData={fetchEventData}
                      date={event.date}
                      seeExercise={true}
                      theLessonRender={event.theLessonRender}
                      eventId={event._id}
                      studentID={event.studentID}
                    />
                  )}
                </div>
              </>
            )}
          </>
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
                window.location.assign(`/my-calendar/event/${lastLesson._id}`)
              }
            >
              <i
                style={{
                  marginTop: 3,
                }}
                className="fa fa-arrow-left"
              />
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
