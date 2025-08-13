import React from "react";
import { alwaysBlack, alwaysWhite, logoPartner } from "../../Styles/Styles";
import { useUserContext } from "../SelectLanguage/SelectLanguage";

interface AppFooterIn {
  see: boolean;
}
export default function AppFooter({ see }: AppFooterIn) {
  const { UniversalTexts } = useUserContext();
  
  return (
    <footer
      className="footer no-print"
      style={{
        display: see ? "flex" : "none",
        fontSize: "11px",
        marginTop: "2rem",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 2rem",
        width: "100%",
        borderTop: "1px solid #e2e8f0",
        flexWrap: "wrap",
        gap: "1rem"
      }}
    >
      {/* Logo */}
      <img
        src="https://ik.imagekit.io/vjz75qw96/assets/icons/Ingl%C3%AAs%20de%20Neg%C3%B3cios%20(Miniatura%20do%20YouTube)%20(3).png?updatedAt=1754392979150"
        alt="ARVIN Logo"
        style={{
          height: "1.5rem",
          width: "auto",
          opacity: "0.7",
          objectFit: "contain",
          filter: "brightness(0.7)",
        }}
      />

      {/* Center Links */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <a
          href="/faq"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: "500",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
        >
          {UniversalTexts?.faq || "FAQ"}
        </a>
        <a
          href="/meu-perfil"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: "500",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
        >
          {UniversalTexts?.myProfile || "Meu Perfil"}
        </a>
      </div>

      {/* Copyright */}
      <span style={{ fontSize: "10px", color: "#9ca3af" }}>
        © 2025 ARVIN • {UniversalTexts?.language === "EN" ? "All rights reserved" : "Todos os direitos reservados"}
      </span>
    </footer>
  );
}
