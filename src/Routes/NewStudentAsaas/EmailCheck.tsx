import React from "react";
import { LogoSVG } from "../../Resources/UniversalComponents";
import { HOne } from "../../Resources/Components/RouteBox";
import { logoPartner, partnerColor } from "../../Styles/Styles";

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

export const myLogoDone = logoPartner();

export default function EmailCheck() {
  return (
    <div
      style={{
        height: "500px",
        width: "500px",
        display: "flex",
        margin: "auto",
        marginTop: "2rem",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "4px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
        }}
      >
        Pagamento Aprovado! <br />
        Verifique seu e-mail
      </h1>
      <img
        src={myLogoDone}
        alt="arvin logo"
        style={{
          margin: "auto",
          height: "6rem",
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />
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
          borderRadius: "4px",
          marginTop: "20px",
          textDecoration: "none",
        }}
      >
        Login
      </a>
    </div>
  );
}
