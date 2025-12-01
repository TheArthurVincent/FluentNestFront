// Routes/ArvinComponents/Students/sections/StudentHWCard.tsx
import React, { FC } from "react";
import { UserCheckIcon } from "@phosphor-icons/react";
import { cardBase, cardTitle } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";

interface StudentHWCardProps {
  student: string;
}

export const StudentHWCard: FC<StudentHWCardProps> = ({ student }) => {
  return (
    <div style={cardBase}>
      <div
        style={{
          ...cardTitle,
        }}
      >
        <UserCheckIcon size={18} weight="bold" color="#111827" />
        <span>Lições de Casa</span>
      </div>
      <a
        href={"/my-homework-and-lessons/" + student}
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
        {"Acessar lições de casa do aluno"}
        <i className="fa fa-chevron-right" />
      </a>
    </div>
  );
};
