import React from "react";
import { LogoSVG } from "../../Resources/UniversalComponents";
import { HOne } from "../../Resources/Components/RouteBox";
import { partnerColor } from "../../Styles/Styles";

export const generateUsername = (
  name: string,
  lastname: string,
  dateOfBirth: string
) => {
  const sanitize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

  const first = sanitize(name);
  const last = sanitize(lastname).slice(0, 3);
  const year = dateOfBirth ? new Date(dateOfBirth).getDate() : "";
  const month = dateOfBirth ? new Date(dateOfBirth).getFullYear() : "";

  return `${first}${year}${last}${month}`;
};

export const myLogoDone = LogoSVG("#000", partnerColor(), 3);
export default function EmailCheck() {
  return (
    <div
      style={{
        height: "500px",
        width: "500px",
        display: "flex",
        margin: "auto",
        marginTop: "10rem",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "20px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <HOne
        style={{
          fontSize: "2rem",
          marginBottom: "20px",
        }}
      >
        Pagamento Aprovado! Verifique seu e-mail
      </HOne>
      {myLogoDone}
      <a
        href="/login"
        style={{
          marginLeft: "auto",
          padding: "10px",
          fontSize: "16px",
          backgroundColor: partnerColor(),
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          marginTop: "20px",
          textDecoration: "none",
        }}
      >
        Login
      </a>
    </div>
  );
}
