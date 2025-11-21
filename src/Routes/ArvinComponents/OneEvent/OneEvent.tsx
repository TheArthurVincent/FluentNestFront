import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
} from "../../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../NewHomePageArvin/NewHomePageArvin";

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
      setEventData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching event data", err);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const getStatusColor = (status?: string) => {
    if (!status) return "#64748B";
    const s = status.toLowerCase();
    if (s === "marcado") return "#0F9D58";
    if (s === "realizada") return "#2563EB";
    if (s === "desmarcado") return "#EF4444";
    return "#64748B";
  };

  const getStatusBg = (status?: string) => {
    if (!status) return "#E2E8F0";
    const s = status.toLowerCase();
    if (s === "marcado") return "#DCFCE7";
    if (s === "realizada") return "#DBEAFE";
    if (s === "desmarcado") return "#FEE2E2";
    return "#E2E8F0";
  };

  const event = eventData?.event || null;
  const lastLesson = event?.recentUnmarkedEvents?.[0] || null;

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
                ? event.student +
                  " - " +
                  formatDateBr(event.date) +
                  " - " +
                  event.time
                : "Evento"}
            </span>
          </section>
        </div>
      )}

      {/* WRAPPER DOS CARDS */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
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
            {/* CARD: INFORMAÇÕES PRINCIPAIS */}
            <div
              style={{
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
                padding: "10px 12px",
                background:
                  "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 40%, #F8FAFC 100%)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: "#94A3B8",
                  }}
                >
                  Próxima aula
                </span>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    padding: "4px 10px",
                    backgroundColor: getStatusBg(event.status),
                    color: getStatusColor(event.status),
                  }}
                >
                  {event.status}
                </span>
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                {event.student}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#94A3B8" }}>
                    Data
                  </span>
                  <span>
                    {formatDateBr(event.date)} - {event.time}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#94A3B8" }}>
                    Duração
                  </span>
                  <span>{event.duration} minutos</span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#94A3B8" }}>
                    Categoria
                  </span>
                  <span>{event.category || "—"}</span>
                </div>
              </div>

              {event.link && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 999,
                      padding: "6px 12px",
                      backgroundColor: "#0F9D58",
                      color: "#ffffff",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Entrar na sala
                    <span style={{ fontSize: 12 }}>↗</span>
                  </a>
                </div>
              )}
            </div>

            {/* CARD: CHECKLIST DO EVENTO */}
            <div
              style={{
                borderRadius: "10px",
                border: "1px dashed #E2E8F0",
                padding: "10px 12px",
                backgroundColor: "#F9FAFB",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "#94A3B8",
                }}
              >
                Checklist do evento
              </span>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 6,
                  fontSize: 12,
                  color: "#475569",
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

            {/* CARD: ÚLTIMA AULA REALIZADA */}
            {lastLesson && (
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  padding: "10px 12px",
                  backgroundColor: "#F8FAFC",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      color: "#94A3B8",
                    }}
                  >
                    Última aula realizada
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 999,
                      padding: "4px 10px",
                      backgroundColor: getStatusBg(lastLesson.status),
                      color: getStatusColor(lastLesson.status),
                    }}
                  >
                    {lastLesson.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0F172A",
                  }}
                >
                  {lastLesson.theLesson?.title || "Sem título do material"}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#94A3B8" }}>
                    Quando foi
                  </span>
                  <span>
                    {formatDateBr(lastLesson.date)} - {lastLesson.time}
                  </span>
                </div>

                {lastLesson.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      marginTop: 4,
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
                    marginTop: 6,
                  }}
                >
                  {lastLesson.video && (
                    <a
                      href={lastLesson.video}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 999,
                        padding: "6px 10px",
                        backgroundColor: "#0F172A",
                        color: "#FFFFFF",
                        textDecoration: "none",
                      }}
                    >
                      Ver gravação
                    </a>
                  )}

                  {lastLesson.googleDriveLink && (
                    <a
                      href={lastLesson.googleDriveLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 999,
                        padding: "6px 10px",
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
                        borderRadius: 999,
                        padding: "6px 10px",
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
            minHeight: 300,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Event;
