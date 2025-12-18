import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HeadersProps } from "../../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../../Styles/Styles";
import { getEmbedUrl } from "../../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { IFrameVideoBlog } from "../../../../HomePage/Blog.Styled";
import { newArvinTitleStyle } from "../../Groups";
import {
  cardBase,
  pillStatus,
} from "../../../Students/TheStudent/types/studentPage.styles";

type GroupClassesHistoryProps = HeadersProps & {
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

interface GroupEventsResponse {
  classesGroup: EventFromApi[];
  groupName?: string;
  limit?: number;
  total?: number;
}

type ClassStatus = "realizada" | "desmarcada" | "reagendada";
type StatusFilter = ClassStatus | "all";

export const GroupClassesHistory: React.FC<GroupClassesHistoryProps> = ({
  headers,
  isDesktop,
}) => {
  const { groupId } = useParams<{ groupId: string }>();

  const [eventsList, setEventsList] = useState<EventFromApi[]>([]);
  const [loadingEventsList, setLoadingEventsList] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");

  // 🔍 busca por descrição
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ filtro por status (padrão: realizada)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("realizada");

  const handleSeeClassesHistory = async (): Promise<void> => {
    if (!groupId) return;

    setLoadingEventsList(true);
    setEventsList([]);

    try {
      const response = await axios.get<GroupEventsResponse>(
        `${backDomain}/api/v1/grouphistory/${groupId}`,
        { headers: headers as any }
      );

      setGroupName(response.data.groupName || "");
      setEventsList(response.data.classesGroup || []);
      setCurrentPage(0);
      setOpenEventId(null);

      setTimeout(() => setLoadingEventsList(false), 100);
    } catch (error) {
      notifyAlert("Erro ao buscar histórico de aulas da turma");
      console.log(error, "Erro ao buscar histórico de aulas da turma");
      setLoadingEventsList(false);
    }
  };

  useEffect(() => {
    if (!groupId) return;
    handleSeeClassesHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

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
    return String(raw || "")
      .trim()
      .toLowerCase();
  };

  // contador por status (baseado na lista completa)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      realizada: 0,
      desmarcada: 0,
      reagendada: 0,
    };
    for (const e of eventsList) {
      const s = normalizeStatus(e.status);
      if (counts[s] !== undefined) counts[s] += 1;
    }
    return counts;
  }, [eventsList]);

  // ✅ filtro: status + descrição
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sf = statusFilter;

    return eventsList.filter((e) => {
      const eStatus = normalizeStatus(e.status);

      const statusOk = sf === "all" ? true : eStatus === normalizeStatus(sf);

      const searchOk = !term
        ? true
        : (e.description || "").toLowerCase().includes(term);

      return statusOk && searchOk;
    });
  }, [eventsList, searchTerm, statusFilter]);

  // quando mudar busca OU filtro de status, volta pra página 0
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter]);

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
              Histórico de Aulas {groupName && `da turma "${groupName}"`}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          ...cardBase,
          fontFamily: "Plus Jakarta Sans",

          margin: !isDesktop ? 12 : 0,
        }}
      >
        <a
          href={`/groups/${groupId}`}
          style={{
            marginTop: 14,
            display: "block",

            textAlign: "right",
            color: partnerColor(),
            textDecoration: "none",
            textTransform: "uppercase",
            alignItems: "center",
            gap: 6,
          }}
        >
          Ver turma
          <i style={{ marginLeft: 8 }} className="fa fa-chevron-right" />
        </a>

        <br />

        {/* Controles: busca + status + pageSize */}
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
            {/* ✅ filtro status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  color: "#4B5563",
                }}
              >
                Status:
              </span>

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
                <option value="desmarcada">
                  Desmarcada ({statusCounts.desmarcada})
                </option>
                <option value="reagendada">
                  Reagendada ({statusCounts.reagendada})
                </option>
                <option value="all">Todas</option>
              </select>
            </div>

            {/* pageSize */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
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
        </div>

        {loadingEventsList && (
          <p
            style={{
              marginTop: 12,
              fontFamily: "Plus Jakarta Sans",

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

              color: "#4B5563",
            }}
          >
            Nenhuma aula encontrada.
          </p>
        )}

        {!loadingEventsList &&
          paginatedEvents.map((event) => {
            const isOpen = openEventId === event._id;
            const s = normalizeStatus(event.status);

            const statusBg =
              s !== "desmarcada"
                ? `${partnerColor()}20`
                : "rgba(255, 221, 221, 0.41)";
            const statusColor =
              s !== "desmarcada" ? partnerColor() : "rgba(220, 38, 38, 0.8)";

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
                    display: "flex",
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
                      {event?.lessonTitle ? event.lessonTitle : "Aula de Grupo"}{" "}
                      - {formatDate(event.date)} — {event.time || "--:--"}
                    </span>

                    {event.category && (
                      <span
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: 12,
                          color: "#6B7280",
                        }}
                      >
                        {event.category}
                      </span>
                    )}
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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

                    <span
                      style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.15s ease-out",
                      }}
                    >
                      ▶
                    </span>
                  </div>
                </button>

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
                        display: "flex",
                        marginBottom: 8,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <p style={{ margin: 0, color: "#4B5563", flex: 1 }}>
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
    </div>
  );
};

export default GroupClassesHistory;
