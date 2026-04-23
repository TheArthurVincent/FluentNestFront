// Routes/ArvinComponents/Students/sections/GroupTodayClassesCard.tsx
import React, { FC, useEffect, useState } from "react";
import { GraduationCapIcon } from "@phosphor-icons/react";
import { partnerColor } from "../../../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../../../Resources/UniversalComponents";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";
import { GroupTutoringEditorModal } from "../../../../MyCalendar/CalendarComponents/NewRecurringEventCalendar/NewRecurringEventCalendarGroup";

interface GroupTodayClassesCardProps {
  group?: any;
  actualHeaders?: any;
}

export const GroupTodayClassesCard: FC<GroupTodayClassesCardProps> = ({
  group,
  actualHeaders,
}) => {
  const [NXTCLASS, setNXTCLASS] = useState<any>("");
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<any>("");
  const [now, setNow] = useState<Date>(new Date());

  const tutoringDays = group?.tutoringDays || [];

  // ================================
  //  Buscar próxima aula (next-event)
  // ================================
  const fetchLastClassId = async () => {
    if (!group?._id) return;
    setLoadingNext(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/next-event/${group._id}`,
        {
          headers: actualHeaders,
        },
      );

      if (response.data.nextEvent) {
        setNXTCLASS(response.data.nextEvent);
      }
      if (response.data.teacherName) {
        setTeacher(response.data.teacherName);
      }

      setLoadingNext(false);
    } catch (error) {
      setLoadingNext(false);
    }
  };

  useEffect(() => {
    fetchLastClassId();
  }, [group?.id]);

  // Atualiza “now” para o selo "Ao vivo"
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  // ================================
  //  Lógica "ao vivo" / horário final
  // ================================
  let isLive = false;
  let endTimeStr = "";

  if (NXTCLASS && NXTCLASS.date && NXTCLASS.time && NXTCLASS.duration) {
    const [Y, M, D] = NXTCLASS.date.split("-").map(Number);
    const [h, m] = NXTCLASS.time.split(":").map(Number);
    const start = new Date(Y, M - 1, D, h, m);
    const end = new Date(start.getTime() + NXTCLASS.duration * 60_000);

    const pad = (n: number) => String(n).padStart(2, "0");
    endTimeStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
    isLive = now >= start && now <= end;
  }

  // ================================
  //  Dia da semana PT-BR
  // ================================
  const dayMap: Record<string, string> = {
    Mon: "Seg",
    Tue: "Ter",
    Wed: "Qua",
    Thu: "Qui",
    Fri: "Sex",
    Sat: "Sáb",
    Sun: "Dom",
  };

  return (
    <div style={cardBase}>
      {/* ====================================== */}
      {/*   BLOCO 1 – PRÓXIMA AULA              */}
      {/* ====================================== */}
      <div style={cardTitle}>
        <GraduationCapIcon size={18} weight="bold" color="#111827" />
        <span>Próxima aula</span>
      </div>

      <div
        style={{
          marginTop: 12,
          borderLeft: `4px solid ${partnerColor()}`,
          paddingLeft: 12,
          display: "grid",
          gap: 6,
        }}
      >
        {loadingNext ? (
          <span style={{ color: "#606060", fontSize: 14 }}>
            Carregando próxima aula...
          </span>
        ) : NXTCLASS ? (
          <>
            <span
              style={{
                fontWeight: 700,
                color: "#030303",
                fontSize: 16,
              }}
            >
              Aula com {teacher || "professor(a)"}{" "}
            </span>

            <span
              style={{
                fontSize: 14,
                color: "#606060",
              }}
            >
              {NXTCLASS.date}
              <br />
              {NXTCLASS.time}
              {endTimeStr && ` - ${endTimeStr}`}
            </span>

            {isLive && (
              <span
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: partnerColor(),
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <i
                  className="fa fa-circle"
                  style={{ fontSize: 8, marginRight: 2 }}
                />
                Ao vivo agora
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "#606060", fontSize: 14 }}>
            Nenhuma próxima aula encontrada.
          </span>
        )}
      </div>
      <a
        href={NXTCLASS ? "/my-calendar/event/" + NXTCLASS._id : "/my-calendar"}
        style={{
          marginTop: 14,
          display: "flex",
          fontWeight: 700,
          color: partnerColor(),
          textDecoration: "none",
          fontSize: 12,
          textTransform: "uppercase",
          alignItems: "center",
          gap: 6,
        }}
      >
        {NXTCLASS ? "Acessar aula" : "Acessar calendário"}
        <i className="fa fa-chevron-right" />
      </a>
      <>
        <div
          style={{
            marginTop: 24,
            ...cardTitle,
          }}
        >
          <GraduationCapIcon size={18} weight="bold" color="#111827" />
          <span>Aulas fixas</span>
        </div>

        {tutoringDays.length > 0 ? (
          <div
            style={{
              marginTop: 12,
              borderLeft: `4px solid ${partnerColor()}`,
              paddingLeft: 12,
              display: "grid",
              gap: 8,
            }}
          >
            {tutoringDays.map((td: any) => {
              const dayName = dayMap[td.day] || td.day;

              return (
                <div
                  key={td.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "grid" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#030303",
                        fontSize: 14,
                      }}
                    >
                      {td.time} · {dayName}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#606060",
                      }}
                    >
                      Duração: {td.duration} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <span
            style={{
              borderLeft: `4px solid ${partnerColor()}`,
              color: "#606060",
              fontSize: 14,
              paddingLeft: 12,
            }}
          >
            Crie aulas fixas para este aluno
          </span>
        )}
      </>
      {/* <ModalEditClassesGroup group={group} actualHeaders={actualHeaders} /> */}
      <GroupTutoringEditorModal
        group={group}
        actualHeaders={actualHeaders}
        onUpdated={() => {
          fetchLastClassId();
        }}
      />
    </div>
  );
};
