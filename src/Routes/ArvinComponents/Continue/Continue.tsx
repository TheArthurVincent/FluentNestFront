import React, { FC, useEffect, useState } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import {
  backDomain,
  formatDateBr,
} from "../../../Resources/UniversalComponents";
import { PresentationIcon } from "@phosphor-icons/react";

interface ContinueProps {
  actualHeaders?: any;
  studentId?: string;
  isDesktop?: boolean;
}

export const Continue: FC<ContinueProps> = ({
  actualHeaders,
  studentId,
  isDesktop,
}) => {
  const [NXTCLASS, setNXTCLASS] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());
  const [thePermissions, setPermissions] = useState<any>("");
  const [NEXT3, setNEXT3] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>("");
  const [student, setStudent] = useState<any>("");

  const fetchLastClassId = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("loggedIn") || '""');
    setPermissions(user.permissions);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/next-event/${user.id}`,
        {
          headers: actualHeaders,
        }
      );
      console.log("Response Next Event:", response);
      if (response.data.nextEvent) {
        setNXTCLASS(response.data.nextEvent);
      } else {
        setNXTCLASS("");
      }

      if (response.data.nextThreeEvents) {
        setNEXT3(response.data.nextThreeEvents);
      } else {
        setNEXT3([]);
      }

      if (response.data.teacherName) {
        setTeacher(response.data.teacherName);
      }

      if (response.data.nextEvent && response.data.nextEvent.student) {
        setStudent(response.data.nextEvent.student);
      }
    } catch (error) {
      console.error("Erro ao buscar próxima aula:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados quando studentId/headers mudarem
  useEffect(() => {
    console.log("studentId, actualHeaders", studentId, actualHeaders);
    fetchLastClassId();
  }, [studentId, actualHeaders]);

  // Atualiza "now" periodicamente para o "ao vivo" funcionar em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30_000); // a cada 30s
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  // Cálculos de horário e "ao vivo"
  let isLive = false;
  let endTimeStr = "";

  if (NXTCLASS && NXTCLASS.date && NXTCLASS.time && NXTCLASS.duration != null) {
    const [year, month, day] = NXTCLASS.date.split("-").map(Number);
    const [hour, minute] = NXTCLASS.time.split(":").map(Number);

    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + NXTCLASS.duration * 60_000);

    endTimeStr = formatTime(end);
    isLive = now >= start && now <= end;
  }

  // Usa _id ou id, dependendo do que o backend mandar
  const eventId = NXTCLASS?._id || NXTCLASS?.id;
  const hasNextClass = !!eventId;

  const href = hasNextClass ? `my-calendar/event/${eventId}` : "/my-calendar";

  const buttonLabel = (() => {
    if (loading) return "Carregando...";
    if (!hasNextClass) return "Acessar calendário";
    if (isLive) return "Entrar na aula ao vivo";
    return "Acessar próxima aula";
  })();

  const titleLine = (() => {
    if (!hasNextClass) return "Nenhuma próxima aula encontrada";
    const who = thePermissions === "student" ? student : teacher;
    if (!who) return "Próxima aula agendada";
    return thePermissions == "student"
      ? `Aula com ${teacher}`
      : `Aula com ${student}`;
  })();

  const timeLine = (() => {
    if (!hasNextClass || !NXTCLASS.date || !NXTCLASS.time) return "";
    const dateBr = formatDateBr ? formatDateBr(NXTCLASS.date) : NXTCLASS.date;
    return `${dateBr} • ${NXTCLASS.time}${
      endTimeStr ? ` - ${endTimeStr}` : ""
    }`;
  })();

  return (
    <div
      style={{
        border: `1px solid ${partnerColor()}50`,
        backgroundImage: `linear-gradient(180deg, ${partnerColor()}15 70%, ${partnerColor()}05 100%)`,
        borderRadius: "16px",
        marginTop: isDesktop ? 0 : 16,
        padding: "24px 24px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Cabeçalho: ícone + título + live badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <PresentationIcon size={20} color={"#030303"} weight="bold" />
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "4%",
              color: "#030303",
            }}
          >
            {isLive ? "Ao vivo" : "Próxima aula"}
          </span>
        </div>

        {isLive && (
          <span
            style={{
              borderRadius: "999px",
              fontSize: "12px",
              backgroundColor: partnerColor(),
              color: "white",
              fontWeight: 500,
              padding: "6px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i
              className="fa fa-circle"
              style={{ fontSize: 8, marginRight: 0 }}
            />
            Ao vivo
          </span>
        )}
      </div>

      {/* Informações da aula */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontSize: isDesktop ? 18 : 16,
            color: "#030303",
          }}
        >
          {loading ? "Carregando próxima aula..." : titleLine}
        </span>

        {timeLine && !loading && (
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
              fontSize: 13,
              color: "#606060",
            }}
          >
            {timeLine}
          </span>
        )}
      </div>

      {/* Botão principal */}
      <a
        target={isDesktop ? "_blank" : "_self"}
        href={href}
        style={{
          textDecoration: "none",
          padding: "14px 12px",
          borderRadius: "8px",
          border: `1px solid ${partnerColor()}45`,
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "fit-content",
          gap: "8px",
          textAlign: "center",
          cursor: "pointer",
          width: isDesktop ? "fit-content" : "100%",
          backgroundColor: `${partnerColor()}30`,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontSize: 14,
          color: "#030303",
        }}
      >
        {buttonLabel}
        <i className="fa fa-chevron-right" />
      </a>

      {/* Próximos eventos (apenas para teacher/superadmin) */}
      {(thePermissions === "teacher" || thePermissions === "superadmin") &&
        NEXT3.length > 1 && (
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontSize: 14,
                color: "#030303",
              }}
            >
              Próximos eventos
            </span>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {NEXT3.slice(1).map((ev, index) => {
                const evId = ev._id || ev.id;

                return (
                  <div
                    key={evId || index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <a
                      target={isDesktop ? "_blank" : "_self"}
                      href={`my-calendar/event/${evId}`}
                      style={{
                        textDecoration: "none",
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 500,
                        fontSize: 13,
                        color: "#030303",
                      }}
                    >
                      {ev.student || ev.teacherName || "Aluno"}
                    </a>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#606060",
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 500,
                      }}
                    >
                      {ev.date ? ev.date : ""} ({ev.time})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};
