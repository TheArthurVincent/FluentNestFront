import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
  getResponsiveEmbedUrl,
} from "../../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../NewHomePageArvin/NewHomePageArvin";

// ⚠️ Ajuste o caminho se estiver diferente na sua estrutura
import {
  cardBase,
  cardTitle,
  pillStatus,
  statCardBase,
  statLabel,
  statValue,
} from "../Students/TheStudent/types/studentPage.styles";
import {
  categoryList,
  getEmbedUrl,
} from "../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { IFrameAsaas, IFrameVideoBlog } from "../../HomePage/Blog.Styled";
import { partnerColor } from "../../../Styles/Styles";
import EventVideo from "./sessions/VideoClass";
import MainInfoClass from "./sessions/MainInfoClass";

type EventProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

const Event: FC<EventProps> = ({ headers, isDesktop }) => {
  const { eventId } = useParams<{ eventId: string }>();

  const [eventData, setEventData] = useState<any>(null);

  const fetchEventData = async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${backDomain}/api/v1/event/${eventId}`, {
        headers: headers as any,
      });
      setEventData(res.data.event); // o objeto é exatamente o evento que você mandou
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching event data", err);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const event = eventData; // atalho
  const lastLesson = eventData?.recentUnmarkedEvents?.[0] || null;

  const renderStatusPill = (status?: string) => {
    if (!status) return null;
    return <span style={pillStatus}>{status}</span>;
  };

  const updateScheduled = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "marcado",
        },
        {
          headers: headers as any,
        }
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };
  const updateUnscheduled = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "desmarcado",
        },
        {
          headers: headers as any,
        }
      );
      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar evento");
    }
  };
  const updateRealizedClass = async (id: string) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${id}`,
        {
          status: "realizada",
        },
        {
          headers: headers as any,
        }
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              padding: "0.5rem",

              borderRadius: "4px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateScheduled(event._id)}
            >
              <i
                className="fa fa-clock-o"
                style={{
                  fontSize:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "#007bff"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "#007bff"
                      : "#6c757d",
                  marginTop: "2px",
                }}
              >
                Agendado
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateRealizedClass(event._id)}
            >
              <i
                className="fa fa-check-circle"
                style={{
                  fontSize:
                    event.status == "Realized" || event.status == "realizada"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Realized" || event.status == "realizada"
                      ? "#28a745"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Realized" || event.status == "realizada"
                      ? "#28a745"
                      : "#6c757d",
                  marginTop: "2px",
                }}
              >
                Realizado
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateUnscheduled(event._id)}
            >
              <i
                className="fa fa-times-circle-o"
                style={{
                  fontSize:
                    event.status == "Canceled" || event.status == "desmarcado"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Canceled" || event.status == "desmarcado"
                      ? "#dc3545"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Canceled" || event.status == "desmarcado"
                      ? "#dc3545"
                      : "#6c757d",
                  marginTop: "2px",
                }}
              >
                Cancelado
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WRAPPER PRINCIPAL (semelhante ao Students) */}
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
        {!isDesktop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              fontSize: "0.8rem",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateScheduled(event._id)}
            >
              <i
                className="fa fa-clock-o"
                style={{
                  fontSize:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "#007bff"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Scheduled" || event.status == "marcado"
                      ? "#007bff"
                      : "#6c757d",
                  marginTop: "2px",
                }}
              >
                Agendado
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateRealizedClass(event._id)}
            >
              <i
                className="fa fa-check-circle"
                style={{
                  fontSize:
                    event.status == "Realized" || event.status == "realizada"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Realized" || event.status == "realizada"
                      ? "#28a745"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Realized" || event.status == "realizada"
                      ? "#28a745"
                      : "#6c757d",
                  marginTop: "2px",
                }}
              >
                Realizado
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => updateUnscheduled(event._id)}
            >
              <i
                className="fa fa-times-circle-o"
                style={{
                  fontSize:
                    event.status == "Canceled" || event.status == "desmarcado"
                      ? "24px"
                      : "18px",
                  color:
                    event.status == "Canceled" || event.status == "desmarcado"
                      ? "#dc3545"
                      : "#6c757d",
                  transition: "all 0.2s",
                }}
              />
              <div
                style={{
                  color:
                    event.status == "Canceled" || event.status == "desmarcado"
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
            <EventVideo
              fetchEventData={fetchEventData}
              headers={headers}
              videoUrl={event.video}
              evendId={event._id}
            />
            {/* CARD 1 – Próxima aula */}

            <MainInfoClass
              event={event}
              headers={headers}
              isDesktop={isDesktop}
              fetchEventData={fetchEventData}
              evendId={event._id}
            />

            {/* CARD 2 – Checklist do evento */}
            <div style={cardBase}>
              <div style={cardTitle}>Checklist do evento</div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#4B5563",
                }}
              >
                <span>{event.emailSent ? "✅" : "⬜"} E-mail enviado</span>
                <span>
                  {event.homeworkAdded ? "✅" : "⬜"} Lição de casa adicionada
                </span>
                <span>
                  {event.flashcardsAdded ? "✅" : "⬜"} Flashcards adicionados
                </span>
                <span>
                  {event.notificationSent ? "✅" : "⬜"} Notificação enviada
                </span>
              </div>
            </div>

            {/* CARD 3 – Última aula realizada */}
            {lastLesson && (
              <div style={cardBase}>
                <div
                  style={{
                    ...cardTitle,
                    marginBottom: 12,
                    justifyContent: "space-between",
                  }}
                >
                  <span>Última aula realizada</span>
                  {renderStatusPill(lastLesson.status)}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={statCardBase}>
                    <span style={statLabel}>Material</span>
                    <span style={statValue}>
                      {lastLesson.theLesson?.title || "Sem título"}
                    </span>
                  </div>

                  <div style={statCardBase}>
                    <span style={statLabel}>Quando foi</span>
                    <span style={statValue}>
                      {lastLesson.date} ({lastLesson.time})
                    </span>
                  </div>
                </div>

                {lastLesson.description && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#4B5563",
                      marginBottom: 10,
                    }}
                  >
                    {lastLesson.description}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  {lastLesson.googleDriveLink && (
                    <a
                      href={lastLesson.googleDriveLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: 999,
                        backgroundColor: "#1D4ED8",
                        color: "#FFFFFF",
                        textDecoration: "none",
                      }}
                    >
                      Material / Drive
                    </a>
                  )}

                  {lastLesson.importantLink && !lastLesson.googleDriveLink && (
                    <a
                      href={lastLesson.importantLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: 999,
                        backgroundColor: "#1D4ED8",
                        color: "#FFFFFF",
                        textDecoration: "none",
                      }}
                    >
                      Link importante
                    </a>
                  )}
                </div>
              </div>
            )}
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
