import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { HeadersProps } from "../../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  truncateString,
} from "../../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { newArvinTitleStyle } from "../../Students";
import { partnerColor } from "../../../../../Styles/Styles";
import { NotebookIcon } from "@phosphor-icons/react";
import { getEmbedUrl } from "../../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { IFrameVideoBlog } from "../../../../HomePage/Blog.Styled";
import { cardBase, cardTitle, pillStatus } from "../types/studentPage.styles";

type StudentClassesHistoryProps = HeadersProps & {
  isDesktop: boolean;
};

interface EventFromApi {
  _id: string;
  board?: string;
  category?: string;
  checkList1?: boolean;
  checkList2?: boolean;
  checkList3?: boolean;
  checkList4?: boolean;
  checkList5?: boolean;
  createdAt?: string;
  date: string;
  description?: string;
  duration?: number;
  edited?: boolean;
  emailSent?: boolean;
  flashcardsAdded?: boolean;
  homeworkAdded?: boolean;
  link?: string;
  notificationSent?: boolean;
  showToAny?: boolean;
  status: string;
  student?: string;
  studentID?: string;
  teacherDescription?: string;
  theLessonRender?: string;
  time?: string;
  tutoringID?: string;
  updatedAt?: string;
  video?: string;
  [key: string]: unknown;
}

interface HomeworkFromApi {
  _id: string;
  title?: string;
  content?: string;
  homework?: string;
  board?: string;
  status?: string;
  [key: string]: unknown;
}

interface EventsResponse {
  events: EventFromApi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  homeworkByEvent?: {
    [eventId: string]: HomeworkFromApi[];
  };
}

export const StudentClassesHistory: React.FC<StudentClassesHistoryProps> = ({
  headers,
  isDesktop,
}) => {
  const { studentId } = useParams<{ studentId: string }>();

  const [eventsList, setEventsList] = useState<EventFromApi[]>([]);
  const [homeworkByEvent, setHomeworkByEvent] = useState<
    Record<string, HomeworkFromApi[]>
  >({});
  const [loadingEventsList, setLoadingEventsList] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const handleSeeClassesHistory = async (): Promise<void> => {
    if (!studentId) return;

    setLoadingEventsList(true);
    setEventsList([]);
    setHomeworkByEvent({});

    try {
      const response = await axios.get<EventsResponse>(
        `${backDomain}/api/v1/event-one-student-pag/${studentId}`,
        {
          headers: headers as any,
        }
      );

      console.log(response.data);
      setEventsList(response.data.events || []);
      setHomeworkByEvent(response.data.homeworkByEvent || {});
      setCurrentPage(0);
      setOpenEventId(null);

      setTimeout(() => {
        setLoadingEventsList(false);
      }, 100);
    } catch (error) {
      notifyAlert("Erro ao buscar histórico de aulas Individuais");
      console.log(error, "Erro ao buscar histórico de aulas Individuais");
      setLoadingEventsList(false);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    handleSeeClassesHistory();
    console.log("studentId mudou:", studentId);
  }, [studentId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const totalEvents = eventsList.length;
  const totalPages = totalEvents === 0 ? 1 : Math.ceil(totalEvents / pageSize);

  const paginatedEvents = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return eventsList.slice(start, end);
  }, [eventsList, currentPage, pageSize]);

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const toggleAccordion = (id: string) => {
    setOpenEventId((prev) => (prev === id ? null : id));
  };

  const getHomeworkHtml = (hw: HomeworkFromApi): string => {
    return (
      (hw.homework as string) ||
      (hw.content as string) ||
      (hw.board as string) ||
      ""
    );
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
            <span style={newArvinTitleStyle}>Histórico de Aulas</span>
          </section>
        </div>
      )}

      {/* CARD PRINCIPAL USANDO cardBase */}
      <div
        style={{
          ...cardBase,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontSize: 14,
          margin: !isDesktop ? 12 : 0,
        }}
      >
        {/* Título interno do card (opcional) */}
        <div
          style={{
            ...cardTitle,
            marginBottom: 14,
            justifyContent: "space-between",
          }}
        >
          <span>Histórico de aulas</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#6B7280",
            }}
          >
            Total: {totalEvents}
          </span>
        </div>

        {/* Controles de paginação (quantidade por página) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
              fontSize: 13,
              color: "#4B5563",
            }}
          >
            Aulas exibidas: {paginatedEvents.length}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                fontSize: 13,
                color: "#4B5563",
              }}
            >
              Mostrar:
            </span>
            <select
              value={pageSize}
              onChange={(e) => handleChangePageSize(Number(e.target.value))}
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                padding: "4px 8px",
                backgroundColor: "#F9FAFB",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Lista de eventos com acordeon */}
        {loadingEventsList && (
          <p
            style={{
              marginTop: 12,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: 13,
              color: "#4B5563",
            }}
          >
            Carregando histórico...
          </p>
        )}

        {!loadingEventsList && paginatedEvents.length === 0 && (
          <p
            style={{
              marginTop: 12,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: 13,
              color: "#4B5563",
            }}
          >
            Nenhuma aula encontrada.
          </p>
        )}

        {!loadingEventsList &&
          paginatedEvents.map((event) => {
            const isOpen = openEventId === event._id;
            const homeworks = homeworkByEvent[event._id] || [];

            return (
              <div
                key={event._id}
                style={{
                  ...cardBase,
                  padding: 12,
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                {/* Cabeçalho do acordeon */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(event._id)}
                  style={{
                    all: "unset",
                    width: "100%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#111827",
                      }}
                    >
                      {formatDate(event.date)} — {event.time || "--:--"}
                    </span>

                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 400,
                        fontSize: 12,
                        color: "#4B5563",
                      }}
                    >
                      {event.description
                        ? truncateString(event.description, 60)
                        : "Sem descrição"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {typeof event.duration === "number" && (
                      <span
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: 12,
                          color: "#4B5563",
                        }}
                      >
                        {event.duration} min
                      </span>
                    )}

                    <span style={pillStatus}>{event.status}</span>

                    <span
                      style={{
                        fontSize: 16,
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.15s ease-out",
                      }}
                    >
                      ▶
                    </span>
                  </div>
                </button>

                {/* Conteúdo do acordeon */}
                {isOpen && (
                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                      marginTop: 10,
                      paddingTop: 10,
                      display: "grid",
                      gap: 10,
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#111827",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#4B5563",
                      }}
                    >
                      <strong>Descrição: </strong>
                      {event.description ? event.description : "-"}
                    </p>

                    {event.video && (
                      <div style={{ display: "grid", gap: 6 }}>
                        <div
                          style={{
                            borderRadius: 8,
                            overflow: "hidden",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <IFrameVideoBlog src={getEmbedUrl(event.video)} />
                        </div>
                      </div>
                    )}

                    {/* HOMEWORK */}
                    {homeworks.length > 0 && (
                      <div
                        style={{
                          borderTop: "1px solid #E5E7EB",
                          paddingTop: 10,
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div style={cardTitle}>
                          <NotebookIcon
                            size={20}
                            color={"#111827"}
                            weight="bold"
                          />
                          <span>Trabalhos de casa</span>
                        </div>

                        <div
                          style={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 500,
                            fontSize: 12,
                            color: "#030303",
                            maxWidth: "100%",
                            maxHeight: 150,
                            padding: "4px 0",
                            overflowY: "auto",
                            scrollbarColor: `${partnerColor()}50 #FFFFFF`,
                            scrollbarWidth: "thin",
                          }}
                        >
                          {homeworks.map((hw) => {
                            const html = getHomeworkHtml(hw);

                            return (
                              <div key={hw._id} style={{ marginBottom: 12 }}>
                                {hw.title && (
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      marginBottom: 4,
                                    }}
                                  >
                                    {hw.title}
                                  </div>
                                )}

                                {html ? (
                                  <div
                                    dangerouslySetInnerHTML={{ __html: html }}
                                  />
                                ) : (
                                  <pre
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontSize: 11,
                                      color: "#6B7280",
                                    }}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: hw?.description || "",
                                      }}
                                    />{" "}
                                  </pre>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <a
                          href={`/my-calendar/event/${event._id}`}
                          style={{
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: "100%",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 8,
                            color: partnerColor(),
                          }}
                        >
                          <span>Acessar</span>
                          <i className="fa fa-chevron-right" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        {/* Paginação (anterior / próxima) */}
        {totalEvents > 0 && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: 12,
              color: "#4B5563",
            }}
          >
            <span>
              Página {currentPage + 1} de {totalPages}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #E5E7EB",
                  backgroundColor: currentPage === 0 ? "#F3F4F6" : "#FFFFFF",
                  cursor: currentPage === 0 ? "default" : "pointer",
                }}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #E5E7EB",
                  backgroundColor:
                    currentPage >= totalPages - 1 ? "#F3F4F6" : "#FFFFFF",
                  cursor: currentPage >= totalPages - 1 ? "default" : "pointer",
                }}
              >
                Próxima
              </button>
            </div>
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

export default StudentClassesHistory;
