import React from "react";
import { HOne } from "../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../Styles/Styles";
import { myLogoDone } from "./NewStudentAsaas/EmailCheck";
import { ArvinButton } from "../Resources/Components/ItemsLibrary";
import { onLoggOut } from "../Resources/UniversalComponents";

export function FeeNotUpToDate() {
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
      <ArvinButton onClick={onLoggOut}>Sair</ArvinButton>
      <img
        src={myLogoDone}
        alt="arvin logo"
        style={{
          margin: "auto",
          height: "4rem",
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />
      <HOne>Falta pouco para utilizar a plataforma!</HOne>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Para finalizar seu pagamento, entre em contato conosco:
      </p>
      <a
        href="https://wa.me/5511915857807"
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: "30px",
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: partnerColor(),
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "18px",
        }}
      >
        Falar com a gente no WhatsApp
      </a>
    </div>
  );
}

export default FeeNotUpToDate;
