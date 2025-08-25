import React from "react";
import { onLoggOut } from "../../Resources/UniversalComponents";
import { logoPartner, partnerColor } from "../../Styles/Styles";

function TopBarResponsible() {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #e8eaed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 32px",
        height: "64px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={logoPartner()}
          alt="Arvin Logo"
          style={{ height: "38px", objectFit: "contain" }}
        />
      </div>
      {/* Logout Button */}
      <button
        onClick={onLoggOut}
        style={{
          padding: "10px 22px",
          background: partnerColor(),
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
          boxShadow: "0 1px 4px #0001",
          transition: "background 0.2s",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default TopBarResponsible;
