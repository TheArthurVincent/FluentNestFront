import React, { FC, useState, useMemo } from "react";
import { partnerColor } from "../../../Styles/Styles";
import { CalendarIcon } from "@phosphor-icons/react/dist/ssr";

interface CalendarCardProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const CalendarCard: FC<CalendarCardProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
  // ====== STATE PARA O SELECT ======
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

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
  }, [selectedMonth]);

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
          gridTemplateColumns: "repeat(7, 1fr)",
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
    </>
  );
};
