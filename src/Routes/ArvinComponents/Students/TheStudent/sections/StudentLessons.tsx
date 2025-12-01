// Routes/ArvinComponents/Students/sections/StudentLessonsCard.tsx
import React, { FC } from "react";
import { UserCheckIcon } from "@phosphor-icons/react";
import { cardBase, cardTitle } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";

interface StudentLessonsCardProps {
  student: string;
}

export const StudentLessonsCard: FC<StudentLessonsCardProps> = ({
  student,
}) => {
  return (
    <div style={cardBase}>
      <div style={cardTitle}>
        <UserCheckIcon size={18} weight="bold" color="#111827" />
        <span>Aulas Dadas</span>
      </div>
      <a
        href={"/students/" + student + "/classes"}
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
        {"Acessar aulas do aluno"}
        <i className="fa fa-chevron-right" />
      </a>
    </div>
  );
};
