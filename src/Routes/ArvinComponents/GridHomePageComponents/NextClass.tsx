import React, { FC, useEffect, useState } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { PresentationIcon } from "@phosphor-icons/react";

interface NextClassProps {
  actualHeaders?: any;
  studentId?: string;
  isDesktop?: boolean;
}

export const NextClass: FC<NextClassProps> = ({
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
    if (!studentId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/next-event/${studentId}`,
        {
          headers: actualHeaders,
        }
      );
      console.log("Response Next Event:", response.data);
      if (response.data.nextEvent) {
        setNXTCLASS(response.data.nextEvent);
      }
      if (response.data.nextThreeEvents) {
        setNEXT3(response.data.nextThreeEvents);
      }

      if (response.data.teacherName) {
        setTeacher(response.data.teacherName);
      }
      if (response.data.nextEvent && response.data.nextEvent.student) {
        setStudent(response.data.nextEvent.student);
      }
      if (response.data.permissions) {
        setPermissions(response.data.permissions);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Atualiza "now" periodicamente para o "ao vivo" funcionar em tempo real
  useEffect(() => {
    fetchLastClassId();
  }, [studentId]);

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

  return (
    <>
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
            fontWeight: "600",
            color: "#030303",
          }}
        >
          <PresentationIcon size={20} color={"#030303"} weight="bold" />
          <span>Próxima aula</span>
        </span>
        {isLive && (
          <span
            style={{
              borderRadius: "16px",
              fontSize: "12px",
              backgroundColor: partnerColor(),
              color: "white",
              fontWeight: "500",
              padding: "8px 12px",
            }}
          >
            <i className="fa fa-circle" style={{ marginRight: "6px" }} />
            Ao vivo
          </span>
        )}
      </span>
      <div
        style={{
          marginTop: "20px",
          borderLeft: `4px solid ${partnerColor()}`,
          padding: "0px 12px",
        }}
      >
        {loading || NXTCLASS === "" ? (
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontStyle: "Bold",
              fontSize: "16px",
              lineHeight: "100%",
              color: "#030303",
              letterSpacing: "0%",
            }}
          >
            Verificar no Calendário
          </span>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "16px",
                lineHeight: "100%",
                color: "#030303",
                letterSpacing: "0%",
              }}
            >
              {thePermissions == "teacher" || thePermissions == "superadmin"
                ? `Aula com ${student}`
                : `Aula com ${teacher}`}
            </span>
            {/* Horário inicial - horário final (duração em min) */}
            <span
              style={{
                marginTop: "4px",
                fontSize: "14px",
                color: "#606060",
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                letterSpacing: "0%",
              }}
            >
              {NXTCLASS.date}
              <br />
              {NXTCLASS.time}
              {endTimeStr && ` - ${endTimeStr}`}
            </span>
          </div>
        )}
      </div>

      <a
        target={isDesktop ? "_blank" : "_self"}
        href={NXTCLASS ? `my-calendar/event/${NXTCLASS._id}` : "/my-calendar"}
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 700,
          fontStyle: "Bold",
          marginTop: "20px",
          fontSize: "12px",
          lineHeight: "100%",
          textTransform: "uppercase",
          letterSpacing: "0%",
          cursor: "pointer",
          textDecoration: "none",
          display: "flex",
          color: partnerColor(),
          alignItems: "center",
          gap: "8px",
        }}
      >
        {loading || !NXTCLASS ? "Acessar calendário" : "Acessar aula"}{" "}
        <i className="fa fa-chevron-right" />
      </a>
      {(thePermissions === "teacher" || thePermissions === "superadmin") &&
        NEXT3.length > 1 && (
          <div style={{ marginTop: "20px" }}>
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontSize: "16px",
                color: "#030303",
              }}
            >
              Próximos eventos
            </span>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {NEXT3.slice(1).map((ev, index) => (
                <div
                  key={ev._id + index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <a
                    target={isDesktop ? "_blank" : "_self"}
                    href={`my-calendar/event/${ev._id}`}
                    style={{
                      textDecoration: "none",
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#030303",
                    }}
                  >
                    {ev.student || ev.teacherName || "Aluno"}
                  </a>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#606060",
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                    }}
                  >
                    {ev.date ? ev.date : ""} ({ev.time})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
};
