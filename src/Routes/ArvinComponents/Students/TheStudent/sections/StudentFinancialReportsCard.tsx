// Routes/ArvinComponents/Students/sections/StudentFinancialReportsCard.tsx
import React, { FC } from "react";
import { MoneyIcon } from "@phosphor-icons/react";
import { FinancialReport } from "../types/studentsTypes";
import { cardBase, cardTitle } from "../types/studentPage.styles";

interface StudentFinancialReportsCardProps {
  financialReports: FinancialReport[];
  formatDate: (iso?: string) => string;
}

export const StudentFinancialReportsCard: FC<
  StudentFinancialReportsCardProps
> = ({ financialReports, formatDate }) => {
  const hasReports = financialReports && financialReports.length > 0;

  return (
    <div
      style={{
        ...cardBase,
        maxWidth: "100%",
        overflow: "hidden", // garante que nada saia do card
      }}
    >
      <div style={cardTitle}>
        <MoneyIcon size={18} weight="bold" color="#111827" />
        <span>Financeiro</span>
      </div>
      {hasReports ? (
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto", // scroll só dentro do card se precisar
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              color: "#4A5568",
              tableLayout: "fixed", // ajuda a tabela a se ajustar
              // 🔴 removido o minWidth: 480
            }}
          >
            <thead>
              <tr>
                <Th>Mês</Th>
                <Th>Descrição</Th>
                <Th>Valor</Th>
                <Th>Pago</Th>
              </tr>
            </thead>
            <tbody>
              {financialReports.map((fr) => (
                <tr key={fr._id}>
                  <Td>{fr.month}</Td>
                  <Td>{fr.description}</Td>
                  <Td>R$ {fr.amount}</Td>
                  <Td>{fr.paidFor ? "✅" : "⚠️"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <span
          style={{
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          Nenhum lançamento financeiro registrado.
        </span>
      )}
    </div>
  );
};

const Th: FC<{ children: React.ReactNode }> = ({ children }) => (
  <th
    style={{
      textAlign: "left",
      padding: "6px 4px",
      borderBottom: "2px solid #E2E8F0",
    }}
  >
    {children}
  </th>
);

const Td: FC<{ children: React.ReactNode }> = ({ children }) => (
  <td
    style={{
      padding: "6px 4px",
      borderBottom: "1px solid #EDF2F7",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </td>
);
