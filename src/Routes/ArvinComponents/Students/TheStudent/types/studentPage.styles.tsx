// Routes/ArvinComponents/Students/StudentPage.styles.ts
import React from "react";
import { partnerColor } from "../../../../../Styles/Styles";

export const cardBase: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: 6,
  padding: 18,
  border: "1px solid #E5E7EB",
};

export const cardTitle: React.CSSProperties = {
  fontFamily: "Lato",
  fontWeight: 700,
  fontSize: 14,
  color: "#111827",
  marginBottom: 10,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export const pillStatus: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 6,
  // backgroundColor: `${partnerColor()}20`,
  // color: partnerColor(),
};

export const statCardBase: React.CSSProperties = {
  borderRadius: 6,
  padding: 12,
  backgroundColor: `${partnerColor()}10`,
  display: "grid",
  gap: 4,
};

export const statLabel: React.CSSProperties = {
  fontSize: 11,
  color: "#4B5563",
  fontWeight: 500,
};

export const statValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#111827",
};
