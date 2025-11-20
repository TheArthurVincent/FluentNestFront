// Routes/ArvinComponents/Students/sections/StudentMainCard.tsx
import React, { FC } from "react";
import { StudentItem } from "../types/studentsTypes";
import { cardBase } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";

interface StudentMainCardProps {
  student: StudentItem;
}

export const StudentMainCard: FC<StudentMainCardProps> = ({ student }) => {
  return (
    <div style={cardBase}>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E0ECFF 0%, #F4E8FF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {student.picture ? (
            <img
              src={student.picture}
              alt={student.fullname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: partnerColor(),
              }}
            >
              {student.name?.[0]}
            </span>
          )}
        </div>
        <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {student.fullname}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            Plano {student.plan?.toUpperCase()} · Nível {student.level || "-"}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#9CA3AF",
            }}
          >
            ID: {student.id}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          paddingTop: 10,
          borderTop: "1px dashed #E5E7EB",
          display: "grid",
          gap: 8,
          fontSize: 13,
          color: "#4B5563",
        }}
      >
        <Row label="Email" value={student.email} />
        <Row label="Telefone" value={student.phoneNumber || "-"} />
        <Row label="Endereço" value={student.address || "-"} />
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              width: 60,
              fontWeight: 600,
              color: "#9CA3AF",
            }}
          >
            Drive
          </span>
          <span style={{ flex: 1 }}>
            {student.googleDriveLink ? (
              <a
                href={student.googleDriveLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: partnerColor(),
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Abrir pasta
              </a>
            ) : (
              "-"
            )}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          style={{
            borderRadius: 8,
            padding: "8px 16px",
            border: "none",
            backgroundColor: partnerColor(),
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Editar aluno
        </button>
      </div>
    </div>
  );
};

const Row: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 8 }}>
    <span
      style={{
        width: 60,
        fontWeight: 600,
        color: "#9CA3AF",
      }}
    >
      {label}
    </span>
    <span style={{ flex: 1 }}>{value}</span>
  </div>
);
