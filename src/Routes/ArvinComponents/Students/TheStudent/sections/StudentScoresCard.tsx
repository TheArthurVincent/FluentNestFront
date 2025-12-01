// Routes/ArvinComponents/Students/sections/StudentScoresCard.tsx
import React, { FC } from "react";
import { ChartBarIcon } from "@phosphor-icons/react";
import { StudentItem } from "../types/studentsTypes";
import { cardBase, cardTitle } from "../types/studentPage.styles";

interface StudentScoresCardProps {
  student: StudentItem;
}

export const StudentScoresCard: FC<StudentScoresCardProps> = ({ student }) => {
  return (
    <div style={cardBase}>
      <div style={cardTitle}>
        <ChartBarIcon size={18} weight="bold" color="#111827" />
        <span>Scores & Flashcards</span>
      </div>
      <div
        style={{
          display: "grid",
          gap: 6,
          fontSize: 13,
          color: "#4B5563",
        }}
      >
        <span>
          <strong>Total Score:</strong> {student.totalScore}
        </span>
        <span>
          <strong>Monthly Score:</strong> {student.monthlyScore}
        </span>
        <span>
          <strong>Lições feitas:</strong> {student.homeworkAssignmentsDone}
        </span>
        <span>
          <strong>Reviews hoje:</strong> {student.flashCardsReviewsToday}
        </span>
      </div>
    </div>
  );
};
