// Routes/ArvinComponents/Students/sections/StudentStatsStrip.tsx
import React, { FC } from "react";
import { StudentItem } from "../types/studentsTypes";
import {
  statCardBase,
  statLabel,
  statValue,
} from "../types/studentPage.styles";

interface StudentStatsStripProps {
  student: StudentItem;
}

export const StudentStatsStrip: FC<StudentStatsStripProps> = ({ student }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}
    >
      <div style={statCardBase}>
        <span style={statLabel}>Score total</span>
        <span style={statValue}>{student.totalScore}</span>
      </div>
      <div style={statCardBase}>
        <span style={statLabel}>Score mensal</span>
        <span style={statValue}>{student.monthlyScore}</span>
      </div>
      <div style={statCardBase}>
        <span style={statLabel}>Lições feitas</span>
        <span style={statValue}>{student.homeworkAssignmentsDone || 0}</span>
      </div>
      <div style={statCardBase}>
        <span style={statLabel}>Reviews hoje</span>
        <span style={statValue}>{student.flashCardsReviewsToday || 0}</span>
      </div>
    </div>
  );
};
