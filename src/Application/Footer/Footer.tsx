import React from "react";
import { alwaysBlack, alwaysWhite, logoPartner } from "../../Styles/Styles";

interface AppFooterIn {
  see: boolean;
}
export default function AppFooter({ see }: AppFooterIn) {
  const myLogo = logoPartner();
  return (
    <footer
      className="footer no-print"
      style={{
        display: see ? "flex" : "none",
        fontSize: "12px",
        backgroundColor: alwaysWhite(),
        color: alwaysBlack(),
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: "0.5rem",
        width: "100%",
      }}
    >
      <img
        src={myLogo}
        alt="arvin logo"
        style={{
          margin: "auto",
          height: "3rem",
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />
      <span>
        This platform is powered by ARVIN ENGLISH SCHOOL © Some rights reserved{" "}
        <br />
        Arthur Vincent
        <br />
        +55 11 91585-7807
      </span>
    </footer>
  );
}
