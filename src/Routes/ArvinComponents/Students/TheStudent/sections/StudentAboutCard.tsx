// Routes/ArvinComponents/Students/sections/StudentAboutCard.tsx
import React, { FC } from "react";
import { UserCheckIcon } from "@phosphor-icons/react";
import { StudentItem } from "../types/studentsTypes";
import { cardBase, cardTitle } from "../types/studentPage.styles";

interface StudentAboutCardProps {
  student: StudentItem;
  formatDate: (iso?: string) => string;
}

export const StudentAboutCard: FC<StudentAboutCardProps> = ({
  student,
  formatDate,
}) => {
  return (
    <div style={cardBase}>
      <div style={cardTitle}>
        <UserCheckIcon size={18} weight="bold" color="#111827" />
        <span>Sobre o aluno</span>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          fontSize: 13,
          color: "#4B5563",
        }}
      >
        <div>
          <strong style={{ fontSize: 12, color: "#9CA3AF" }}>Descrição</strong>
          <p
            style={{
              margin: "4px 0 0 0",
              lineHeight: 1.5,
            }}
          >
            {student.fullname} é aluno do plano {student.plan?.toUpperCase()}{" "}
            com {student.weeklyClasses || 0} aula(s) por semana. Nível{" "}
            {student.level || "—"} e idioma de estudo {student.language || "—"}.
          </p>
        </div>

        <div>
          <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
            Educação / Plano
          </strong>
          <ul
            style={{
              margin: "6px 0 0 16px",
              padding: 0,
              lineHeight: 1.5,
            }}
          >
            <li>Plano: {student.plan?.toUpperCase()}</li>
            <li>Nível atual: {student.level || "—"}</li>
            <li>Aulas semanais: {student.weeklyClasses || 0}</li>
          </ul>
        </div>

        <div>
          <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
            Experiências / Progresso
          </strong>
          <ul
            style={{
              margin: "6px 0 0 16px",
              padding: 0,
              lineHeight: 1.5,
            }}
          >
            <li>Total de pontos: {student.totalScore}</li>
            <li>
              Maior streak de flashcards: {student.flashcardsLongestStreak || 0}{" "}
              dia(s)
            </li>
            <li>
              Último dia de review: {formatDate(student.lastDayFlashcardReview)}
            </li>
          </ul>
        </div>

        <div>
          <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
            Informações financeiras
          </strong>
          <ul
            style={{
              margin: "6px 0 0 16px",
              padding: 0,
              lineHeight: 1.5,
            }}
          >
            <li>Mensalidade: R$ {student.fee}</li>
            <li>Fee em dia: {student.feeUpToDate ? "Sim ✅" : "Não ⚠️"}</li>
            <li>
              Pagamento via cartão: {student.creditCardPayment ? "Sim" : "Não"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
