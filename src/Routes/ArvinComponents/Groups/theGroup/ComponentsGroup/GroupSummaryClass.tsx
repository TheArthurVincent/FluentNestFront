// Routes/ArvinComponents/Groups/GroupSummaryCard.tsx
import React, { FC, useEffect } from "react";
import { ClipboardTextIcon } from "@phosphor-icons/react";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";

export const GroupSummaryCard: FC<{
  totalStudents: number;
  group: any;
  totalClasses: number;
}> = ({ totalStudents, group, totalClasses }) => {
  useEffect(() => {
    console.log("Group in SummaryCard:", group.studentIds);
  }, [group]);

  return (
    <div style={cardBase}>
      {/* Header padrão Arvin */}
      <div style={cardTitle}>
        <ClipboardTextIcon size={18} weight="bold" color="#111827" />
        <span>Resumo da turma</span>
      </div>

      {/* Conteúdo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          rowGap: 8,
          marginTop: 12,
          fontSize: 13,
          color: "#0f172a",
        }}
      >
        <div>
          👥{" "}
          <strong>
            {totalStudents} aluno{totalStudents === 1 ? "" : "s"}
          </strong>
        </div>

        <div>
          📚{" "}
          <strong>
            {totalClasses} aula
            {totalClasses === 1 ? "" : "s"} em grupo
          </strong>
        </div>
      </div>
    </div>
  );
};
