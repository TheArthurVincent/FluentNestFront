import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
import { HeadersProps } from "../../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { newArvinTitleStyle } from "../../Students";
import { partnerColor } from "../../../../../Styles/Styles";
import { NotebookIcon } from "@phosphor-icons/react";
import {
  categoryList,
  getEmbedUrl,
} from "../../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { IFrameVideoBlog } from "../../../../HomePage/Blog.Styled";
import { cardBase, cardTitle, pillStatus } from "../types/studentPage.styles";

type StudentClassesHistoryProps = HeadersProps & {
  isDesktop: boolean;
};

interface EventFromApi {
  _id: string;
  board?: string;

  // ✅ campos de reagendamento (podem variar no backend)
  replenish?: boolean; // <- o que você quer filtrar
  rescheduled?: boolean; // fallback (se existir)
  rescheduledDescription?: string;

  category?: string;
  createdAt?: string;
  date: string;
  description?: string;
  duration?: number;
  edited?: boolean;
  emailSent?: boolean;
  flashcardsAdded?: boolean;
  homeworkAdded?: boolean;
  lessonTitle?: string;
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
  studentName?: string;
  description?: string;
  [key: string]: unknown;
}

interface EventsResponse {
  events: EventFromApi[];
  total: number;
  page: number;
  studentName?: string;
  limit: number;
  totalPages: number;
  homeworkByEvent?: {
    [eventId: string]: HomeworkFromApi[];
  };
}

type ClassStatus = "realizada" | "desmarcado" | "reagendada";
type StatusFilter = ClassStatus | "all";

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
  const [studentName, setStudentName] = useState<string>("");

  // 🔍 busca por descrição
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ filtro por status (padrão: realizada)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("realizada");

  // ✅ filtro extra: todas vs só replenish=true
  const [onlyReplenish, setOnlyReplenish] = useState<boolean>(false);

  const handleSeeClassesHistory = async (): Promise<void> => {
    if (!studentId) return;

    setLoadingEventsList(true);
    setEventsList([]);
    setHomeworkByEvent({});

    try {
      const response = await axios.get<EventsResponse>(
        `${backDomain}/api/v1/event-one-student-pag/${studentId}`,
        { headers: headers as any }
      );

      setStudentName(response.data.studentName || "");
      setEventsList(response.data.events || []);
      setHomeworkByEvent(response.data.homeworkByEvent || {});
      setCurrentPage(0);
      setOpenEventId(null);

      setTimeout(() => setLoadingEventsList(false), 100);
    } catch (error) {
      notifyAlert("Erro ao buscar histórico de aulas Individuais");
      console.log(error, "Erro ao buscar histórico de aulas Individuais");
      setLoadingEventsList(false);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    handleSeeClassesHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const normalizeStatus = (raw?: unknown): string => {
    const s = String(raw || "")
      .trim()
      .toLowerCase();
    return s || "";
  };

  const getHomeworkHtml = (hw: HomeworkFromApi): string => {
    return (
      (hw.homework as string) ||
      (hw.content as string) ||
      (hw.board as string) ||
      ""
    );
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      realizada: 0,
      desmarcado: 0,
      reagendada: 0,
    };
    for (const e of eventsList) {
      const s = normalizeStatus(e.status);
      if (counts[s] !== undefined) counts[s] += 1;
    }
    return counts;
  }, [eventsList]);

  // 🔎 aplica: status + busca + replenish
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const status = statusFilter;

    return eventsList.filter((e) => {
      const eStatus = normalizeStatus(e.status);

      const statusOk =
        status === "all" ? true : eStatus === normalizeStatus(status);

      const searchOk = !term
        ? true
        : (e.description || "").toLowerCase().includes(term);

      // ✅ filtro de reagendadas:
      // prioridade no .replenish, com fallback no .rescheduled
      const replenishValue = Boolean(e.replenish) || Boolean(e.rescheduled);
      const replenishOk = onlyReplenish ? replenishValue : true;

      return statusOk && searchOk && replenishOk;
    });
  }, [eventsList, searchTerm, statusFilter, onlyReplenish]);

  // quando mudar busca OU filtros, volta pra página 0
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter, onlyReplenish]);

  const totalEvents = filteredEvents.length;
  const totalPages = totalEvents === 0 ? 1 : Math.ceil(totalEvents / pageSize);

  const paginatedEvents = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, currentPage, pageSize]);

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

  const SwitchReplenish = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "Plus Jakarta Sans", color: "#4B5563" }}>
        Reagendadas:
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          border: `1px solid ${value ? partnerColor() : "#E5E7EB"}`,
          background: value ? `${partnerColor()}20` : "#F3F4F6",
          position: "relative",
          cursor: "pointer",
          padding: 0,
        }}
        aria-pressed={value}
        aria-label="Mostrar apenas aulas reagendadas"
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: value ? partnerColor() : "#9CA3AF",
            position: "absolute",
            top: 2,
            left: value ? 22 : 2,
            transition: "left 180ms ease",
          }}
        />
      </button>
    </div>
  );

  return (
    <div style={{ margin: !isDesktop ? "0px" : "0px 16px 0px 0px" }}>
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
            }}
          >
            <span style={newArvinTitleStyle}>
              Histórico de Aulas de {studentName && `${studentName}`}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          ...cardBase,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          margin: !isDesktop ? 12 : 0,
        }}
      >
        <a
          href={`/students/${studentId}`}
          style={{
            marginTop: 14,
            display: "block",
            fontWeight: 700,
            textAlign: "right",
            color: partnerColor(),
            textDecoration: "none",
            textTransform: "uppercase",
            alignItems: "center",
            gap: 6,
          }}
        >
          Ver aluno
          <i style={{ marginLeft: 8 }} className="fa fa-chevron-right" />
        </a>

        <br />

        {/* Controles: busca + filtros + pageSize */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            justifyContent: "space-between",
            alignItems: isDesktop ? "center" : "flex-start",
            marginBottom: 10,
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              flex: 1,
              maxWidth: 300,
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição da aula..."
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                padding: "6px 10px",
                backgroundColor: "#F9FAFB",
                outline: "none",
                maxWidth: 300,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* ✅ switch replenish */}
            <SwitchReplenish
              value={onlyReplenish}
              onChange={setOnlyReplenish}
            />

            {/* ✅ filtro status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  padding: "6px 10px",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <option value="realizada">
                  Realizada ({statusCounts.realizada})
                </option>
                <option value="desmarcado">
                  Desmarcado ({statusCounts.desmarcado})
                </option>
                <option value="reagendada">
                  Reagendada ({statusCounts.reagendada})
                </option>
                <option value="all">Todas</option>
              </select>
            </div>

            {/* pageSize */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={pageSize}
                onChange={(e) => handleChangePageSize(Number(e.target.value))}
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  maxWidth: 10,
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  padding: "6px 10px",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {loadingEventsList && (
          <p
            style={{
              marginTop: 12,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
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
            const s = normalizeStatus(event.status);

            const statusBg =
              s !== "desmarcado"
                ? `${partnerColor()}20`
                : "rgba(255, 221, 221, 0.41)";
            const statusColor =
              s !== "desmarcado" ? partnerColor() : "rgba(220, 38, 38, 0.8)";

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
                <button
                  type="button"
                  onClick={() => toggleAccordion(event._id)}
                  style={{
                    all: "unset",
                    width: "100%",
                    cursor: "pointer",
                    display: "grid",
                    gap: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "grid", gap: 2 }}>
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        color: "#111827",
                      }}
                    >
                      {event?.lessonTitle
                        ? event.lessonTitle
                        : "Aula Individual"}{" "}
                      - {formatDate(event.date)} — {event.time || "--:--"}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {event.category && (
                      <div
                        style={{
                          ...pillStatus,
                          color:
                            event.category === "Established Group Class"
                              ? "#000"
                              : partnerColor(),
                          marginRight: 8,
                        }}
                      >
                        {categoryList.find(
                          (cat) => cat.value === event.category
                        )?.text || event.category}
                      </div>
                    )}

                    {typeof event.duration === "number" && (
                      <span
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          color: "#4B5563",
                        }}
                      >
                        {event.duration} min
                      </span>
                    )}

                    <span
                      style={{
                        ...pillStatus,
                        backgroundColor: statusBg,
                        color: statusColor,
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                </button>

                {event.rescheduled && event.rescheduledDescription && (
                  <span
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: 12,
                      backgroundColor: "#FEF3F2",
                      padding: "4px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                      marginTop: 12,
                      color: "#4B5563",
                    }}
                  >
                    {String(event.rescheduledDescription)}
                  </span>
                )}

                {isOpen && (
                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                      marginTop: 10,
                      paddingTop: 10,
                      display: "grid",
                      gap: 10,
                      fontFamily: "Plus Jakarta Sans",
                      color: "#111827",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        marginBottom: 8,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <p style={{ margin: 0, color: "#4B5563" }}>
                        <strong>Descrição: </strong>
                        {event.description ? event.description : "-"}
                      </p>

                      <a
                        href={`/my-calendar/event/${event._id}`}
                        style={{
                          display: "block",
                          textAlign: "right",
                          color: partnerColor(),
                          textDecoration: "none",
                          textTransform: "uppercase",
                          alignItems: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ver Evento
                        <i
                          style={{ marginLeft: 8 }}
                          className="fa fa-chevron-right"
                        />
                      </a>
                    </div>

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
                                    style={{ fontWeight: 600, marginBottom: 4 }}
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
                                      color: "#6B7280",
                                    }}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          (hw?.description as string) || "",
                                      }}
                                    />
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

        {totalEvents > 0 && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
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
        <div style={{ minHeight: 200 }}>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default StudentClassesHistory;
