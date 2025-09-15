import React from "react";

interface AppFooterIn {
  see: boolean;
}
export default function AppFooter({ see }: AppFooterIn) {
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
        justifyContent: "space-around",
        padding: "0.75rem 2rem",
        width: "100%",
        borderTop: "1px solid #e2e8f0",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <img
        src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Horizontal-Black.png?updatedAt=1756124444679"
        alt="ARVIN Logo"
        style={{
          height: "1.5rem",
          width: "auto",
          opacity: "0.7",
          objectFit: "contain",
        }}
      />
      <span
        style={{
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        © 2025 ARVIN • This Platform is powered by DOXA TECH Serviços de
        Software Ltda. All rights reserved
      </span>
    </footer>
  );
}
