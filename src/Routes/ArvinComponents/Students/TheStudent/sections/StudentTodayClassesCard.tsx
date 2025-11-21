// StudentTodayClassesCard.tsx
import React, { FC, useEffect, useState } from "react";
import { GraduationCapIcon } from "@phosphor-icons/react";
import { TodayClass } from "../types/studentsTypes";
import { cardBase, cardTitle } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";
import axios from "axios";
import {
  backDomain,
  formatDateBr,
} from "../../../../../Resources/UniversalComponents";

interface StudentTodayClassesCardProps {
  classes: TodayClass[];
  student?: any;
  actualHeaders?: any;
}

export const StudentTodayClassesCard: FC<StudentTodayClassesCardProps> = ({
  classes,
  student,
  actualHeaders,
}) => {
  const [NXTCLASS, setNXTCLASS] = useState<any>("");
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<any>("");
  const [now, setNow] = useState<Date>(new Date());

  const tutoringDays = student?.tutoringDays || [];

  // ================================
  //  FETCH Próxima aula
  // ================================
  const fetchLastClassId = async () => {
    if (!student?.id) return;
    setLoadingNext(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/next-event/${student.id}`,
        { headers: actualHeaders }
      );

      if (response.data.nextEvent) setNXTCLASS(response.data.nextEvent);
      if (response.data.teacherName) setTeacher(response.data.teacherName);

      setLoadingNext(false);
    } catch (error) {
      setLoadingNext(false);
    }
  };

  useEffect(() => {
    fetchLastClassId();
  }, [student?.id]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // ================================
  //  LÓGICA "AO VIVO"
  // ================================
  let isLive = false;
  let endTimeStr = "";

  if (NXTCLASS && NXTCLASS.date && NXTCLASS.time && NXTCLASS.duration) {
    const [Y, M, D] = NXTCLASS.date.split("-").map(Number);
    const [h, m] = NXTCLASS.time.split(":").map(Number);
    const start = new Date(Y, M - 1, D, h, m);
    const end = new Date(start.getTime() + NXTCLASS.duration * 60000);
    endTimeStr = `${String(end.getHours()).padStart(2, "0")}:${String(
      end.getMinutes()
    ).padStart(2, "0")}`;
    isLive = now >= start && now <= end;
  }

  // ================================
  //  DIA SEMANAL FIXO
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
      {/* ================================ */}
      {/*   BLOCO 1 — PRÓXIMA AULA         */}
      {/* ================================ */}

      <div style={cardTitle}>
        <GraduationCapIcon size={18} weight="bold" color="#111827" />
        <span>Próxima aula de {student?.name || "aluno(a)"}</span>
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
        {!loadingNext && NXTCLASS ? (
          <>
            <span style={{ fontSize: 14, color: "#606060" }}>
              {formatDateBr(NXTCLASS.date)}
              <br />
              {NXTCLASS.time}
              {endTimeStr && ` - ${endTimeStr}`}
            </span>
          </>
        ) : (
          <span style={{ color: "#606060" }}>Carregando próxima aula...</span>
        )}
      </div>

      <a
        href={NXTCLASS ? NXTCLASS.link : "/my-calendar"}
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

      {/* ================================ */}
      {/*   BLOCO 2 — AULAS FIXAS         */}
      {/* ================================ */}

      {tutoringDays.length > 0 && (
        <>
          <div
            style={{
              marginTop: 22,
              ...cardTitle,
            }}
          >
            <GraduationCapIcon size={18} weight="bold" color="#111827" />
            <span>Aulas fixas de {student?.name || "aluno(a)"}</span>
          </div>

          <div
            style={{
              display: "grid",
              gap: 6,
            }}
          >
            {tutoringDays.map((td: any) => {
              const dayName = dayMap[td.day] || td.day;
              return (
                <div
                  key={td.id}
                  style={{
                    borderLeft: `4px solid ${partnerColor()}`,
                    marginTop: 12,
                    paddingLeft: 12,
                    display: "flex",
                    justifyContent: "space-between",
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

                    <span style={{ fontSize: 12, color: "#606060" }}>
                      Duração: {td.duration} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
