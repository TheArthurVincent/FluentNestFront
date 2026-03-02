// Routes/ArvinComponents/Groups/GroupHistoryCard.tsx (ajuste o path se preciso)
import React, { FC } from "react";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { partnerColor } from "../../../../../Styles/Styles";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";

export type GroupClassEvent = {
  _id?: string;
  status?: string;
  category?: string;
  date?: string;
  time?: string;
  duration?: number;
  description?: string;
  video?: string;
  importantLink?: string;
};

interface GroupHistoryCardProps {
  totalClasses: number;
  lastClass?: GroupClassEvent;
  loadingHistory: boolean;
  onNavigateHistory: () => void;
  formatDate: (dateStr?: string) => string;
}

export const GroupHistoryCard: FC<GroupHistoryCardProps> = ({
  totalClasses,
  lastClass,
  loadingHistory,
  onNavigateHistory,
  formatDate,
}) => {
  return (
    <div style={cardBase}>
      {/* Título no mesmo padrão do StudentLessonsCard */}
      <div style={cardTitle}>
        <ClockCounterClockwise size={18} weight="bold" color="#111827" />
        <span>Histórico de aulas da turma</span>
      </div>

      {loadingHistory ? (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          Carregando histórico...
        </div>
      ) : (
        <>
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#4b5563",
            }}
          >
            Esta turma possui{" "}
            <strong>
              {totalClasses} aula
              {totalClasses === 1 ? "" : "s"} da turma
            </strong>{" "}
            registradas.
          </p>

          {lastClass && (
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                fontSize: 11,
                color: "#111827",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Última aula registrada
              </div>

              <div>
                <strong>
                  {formatDate(lastClass.date)}{" "}
                  {lastClass.time && `• ${lastClass.time}`}
                </strong>
              </div>

              {lastClass.status && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: "#4b5563",
                  }}
                >
                  Status: <strong>{lastClass.status}</strong>
                </div>
              )}

              {lastClass.description && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    color: "#4b5563",
                  }}
                >
                  {lastClass.description}
                </div>
              )}
            </div>
          )}

          {/* Botão no mesmo "clima" do link do StudentLessonsCard */}
          <button
            type="button"
            onClick={onNavigateHistory}
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              padding: "8px 0",
              borderRadius: 999,
              border: `1px solid ${partnerColor()}`,
              backgroundColor: "transparent",
              color: partnerColor(),
              fontWeight: 700,
              fontSize: 12,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Ver histórico completo
            <i className="fa fa-chevron-right" />
          </button>
        </>
      )}
    </div>
  );
};
