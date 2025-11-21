import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
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
                ? `${event.student} - ${formatDateBr(event.date)} - ${
                    event.time
                  }`
                : "Evento"}
            </span>
          </section>
        </div>
      )}

      {/* WRAPPER PRINCIPAL (semelhante ao Students) */}
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
          gap: 12,
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
            {/* CARD 1 – Próxima aula */}
            <div style={cardBase}>
              <div
                style={{
                  ...cardTitle,
                  marginBottom: 12,
                  justifyContent: "space-between",
                }}
              >
                <span>Próxima aula</span>
                {renderStatusPill(event.status)}
              </div>

              {/* Stats principais */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                }}
              >
                <div style={statCardBase}>
                  <span style={statLabel}>Aluno</span>
                  <span style={statValue}>{event.student}</span>
                </div>

                <div style={statCardBase}>
                  <span style={statLabel}>Data e horário</span>
                  <span style={statValue}>
                    {formatDateBr(event.date)} - {event.time}
                  </span>
                </div>

                <div style={statCardBase}>
                  <span style={statLabel}>Duração</span>
                  <span style={statValue}>{event.duration} min</span>
                </div>

                <div style={statCardBase}>
                  <span style={statLabel}>Categoria</span>
                  <span style={statValue}>{event.category || "—"}</span>
                </div>
              </div>

              {event.link && (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "8px 14px",
                      borderRadius: 999,
                      backgroundColor: "#0F9D58",
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    Entrar na sala
                  </a>
                </div>
              )}
            </div>

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
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
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
                      {formatDateBr(lastLesson.date)} - {lastLesson.time}
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
                  {lastLesson.video && (
                    <a
                      href={lastLesson.video}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: 999,
                        backgroundColor: "#111827",
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

                  {lastLesson.importantLink &&
                    !lastLesson.googleDriveLink && (
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
