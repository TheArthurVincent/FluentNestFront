// Routes/ArvinComponents/Students/sections/StudentTodayClassesCard.tsx
import React, { FC } from "react";
import { GraduationCapIcon } from "@phosphor-icons/react";
import { TodayClass } from "../types/studentsTypes";
import { cardBase, cardTitle, pillStatus } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";

interface StudentTodayClassesCardProps {
  classes: TodayClass[];
}

export const StudentTodayClassesCard: FC<StudentTodayClassesCardProps> = ({
  classes,
}) => {
  return (
    <div style={cardBase}>
      <div style={cardTitle}>
        <GraduationCapIcon size={18} weight="bold" color="#111827" />
        <span>Aulas de hoje</span>
      </div>

      {classes.length === 0 ? (
        <span
          style={{
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          Nenhuma aula cadastrada para hoje. (Mock – depois conectar à API)
        </span>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10,
            fontSize: 13,
          }}
        >
          {classes.map((cls) => (
            <div
              key={cls.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                borderRadius: 8,
                backgroundColor: `${partnerColor()}10`,
              }}
            >
              <div style={{ display: "grid", gap: 2 }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {cls.time} · {cls.type}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                  }}
                >
                  {cls.day} · Online
                </span>
              </div>
              <span style={pillStatus}>{cls.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
