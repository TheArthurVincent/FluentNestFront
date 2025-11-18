import React, { FC, useState, useMemo } from "react";
import { partnerColor } from "../../../Styles/Styles";
import { CalendarIcon } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { createPortal } from "react-dom";

interface CalendarCardProps {
  actualHeaders?: any;
  isDesktop?: boolean;
  studentId?: string;
}

export const CalendarCard: FC<CalendarCardProps> = ({
  actualHeaders,
  isDesktop,
  studentId,
}) => {
  // ====== STATE PARA O SELECT ======
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  // ====== STATE DO MODAL ======
  const [dayEvents, setDayEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDateLabel, setModalDateLabel] = useState<string>("");

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // ====== FUNÇÃO PARA BUSCAR EVENTOS DE UM DIA ======
  const getDayEvents = async (date: Date) => {
    if (!studentId) return;

    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/events-today/${studentId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
          params: { today: dateStr },
        }
      );

      const data = response.data || {};
      const events = data.events || [];

      setDayEvents(events);
      setModalDateLabel(date.toLocaleDateString("pt-BR"));
      setIsModalOpen(true);

      console.log("EVENTS FOR", dateStr, data);
    } catch (error) {
      console.log("Erro ao buscar eventos do dia:", error);
      setDayEvents([]);
      setModalDateLabel(date.toLocaleDateString("pt-BR"));
      setIsModalOpen(true);
    }
  };

  // ====== CÁLCULO DO CALENDÁRIO ======
  const daysArray = useMemo(() => {
    const firstDay = new Date(currentYear, selectedMonth, 1);
    const lastDay = new Date(currentYear, selectedMonth + 1, 0);

    const startIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevMonthDays = new Date(currentYear, selectedMonth, 0).getDate();

    let arr: { day: number; current: boolean; date: Date }[] = [];

    for (let i = 0; i < 42; i++) {
      const dayNumber =
        i < startIndex
          ? prevMonthDays - (startIndex - 1 - i) // mês anterior
          : i - startIndex + 1 <= totalDays
          ? i - startIndex + 1 // mês atual
          : i - startIndex - totalDays + 1; // próximo mês

      const isCurrentMonth = i >= startIndex && i < startIndex + totalDays;

      const dateObj = new Date(
        currentYear,
        isCurrentMonth
          ? selectedMonth
          : i < startIndex
          ? selectedMonth - 1
          : selectedMonth + 1,
        dayNumber
      );

      arr.push({
        day: dayNumber,
        current: isCurrentMonth,
        date: dateObj,
      });
    }

    return arr;
  }, [currentYear, selectedMonth]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // ===== JSX =====

  return (
    <>
      {/* Título + Select de mês */}
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            color: "#030303",
          }}
        >
          <CalendarIcon size={20} color={"#030303"} weight="bold" />
          <span>Calendário</span>
        </span>

        {/* SELECT DO MÊS */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #E3E8F0",
            fontFamily: "Plus Jakarta Sans",
            fontSize: "12px",
            fontWeight: 600,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {monthNames.map((m, index) => (
            <option key={index} value={index}>
              {m}
            </option>
          ))}
        </select>
      </span>

      {/* ===== Nomes dos dias da semana ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginTop: "16px",
          justifyItems: "center",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        {weekDays.map((wd) => (
          <div
            key={wd}
            style={{
              textAlign: "center",
              fontFamily: "Plus Jakarta Sans",
              fontSize: "12px",
              fontWeight: 700,
              color: "#030303",
            }}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* ===== Dias ===== */}
      <div
        style={{
          display: "grid",
          marginTop: "8px",
          gridTemplateColumns: "repeat(7, 1fr)",
          alignContent: "center",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {daysArray.map((d, idx) => {
          const isToday =
            d.date.getDate() === today.getDate() &&
            d.date.getMonth() === today.getMonth() &&
            d.date.getFullYear() === today.getFullYear();

          return (
            <div
              key={idx}
              onClick={() => getDayEvents(d.date)}
              style={{
                height: "41px",
                width: "41px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: isToday
                  ? partnerColor()
                  : d.current
                  ? "#ffffff"
                  : "#f0f0f0",
                color: isToday ? "white" : d.current ? "#030303" : "#9e9e9e",
                border: "1px solid #E3E8F0",
                cursor: "pointer",
              }}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {/* Botão final */}
      <div>
        <a
          href="/my-calendar"
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            marginTop: "20px",
            fontSize: "12px",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "flex",
            color: partnerColor(),
            alignItems: "center",
            gap: "8px",
          }}
        >
          Acessar calendário
          <i className="fa fa-chevron-right" />
        </a>
      </div>

      {/* ===== MODAL DE EVENTOS DO DIA ===== */}
      {isModalOpen &&
        createPortal(
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15,23,42,0.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999, // maior que sua lateral
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "20px 20px 16px",
                width: isDesktop ? 480 : "90%",
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
              }}
            >
              {/* Header modal */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",

                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Eventos do dia
                  </span>
                  <span
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    {modalDateLabel}
                  </span>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: "4px 8px",
                  }}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  borderTop: "1px solid #E5E7EB",
                  marginTop: "4px",
                  paddingTop: "8px",
                  overflowY: "auto",
                }}
              >
                {dayEvents.length === 0 ? (
                  <div
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "12px",
                      color: "#6b7280",
                      padding: "8px 2px",
                    }}
                  >
                    Nenhum evento neste dia.
                  </div>
                ) : (
                  dayEvents.map((ev) => {
                    const isCanceled = ev.status === "desmarcado";

                    return (
                      <div
                        key={ev._id}
                        onClick={() => {
                          if (ev.link && !isCanceled) {
                            window.open(ev.link, "_blank");
                          }
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                          border: "1px solid #E5E7EB",
                          marginBottom: "8px",
                          cursor:
                            ev.link && !isCanceled ? "pointer" : "default",
                          backgroundColor: isCanceled ? "#FEF2F2" : "#F9FAFB",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {ev.student || "Aluno(a)"}
                          </span>

                          <span
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "999px",
                              backgroundColor: isCanceled
                                ? "#FECACA"
                                : "#DCFCE7",
                              color: isCanceled ? "#991B1B" : "#166534",
                              textTransform: "uppercase",
                            }}
                          >
                            {ev.status}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            fontFamily: "Plus Jakarta Sans",
                            fontSize: "11px",
                            color: "#4B5563",
                          }}
                        >
                          <span>
                            {ev.time || "--:--"} • {ev.duration || 60} min
                          </span>
                          {ev.category && (
                            <span
                              style={{
                                fontSize: "10px",
                                padding: "1px 6px",
                                borderRadius: "999px",
                                border: "1px solid #E5E7EB",
                              }}
                            >
                              {ev.category}
                            </span>
                          )}
                        </div>

                        {ev.description && (
                          <span
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontSize: "11px",
                              color: "#6B7280",
                              marginTop: "2px",
                            }}
                          >
                            {ev.description}
                          </span>
                        )}
                        {ev.link && !isCanceled && (
                          <span
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontSize: "11px",
                              color: isCanceled ? "#9CA3AF" : partnerColor(),
                              textDecoration: "underline",
                              marginTop: "2px",
                            }}
                          >
                            Entrar na aula
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
