import React, { FC, useEffect, useState } from "react";
import { logoPartner } from "../../../Styles/Styles";
import { NotificationsArvin } from "./Notifications/NotificationsArvin";
import { ArvinSideDownBar } from "./SideDownBar/SideDownBar";

interface ArvinTopBarProps {
  appLoaded?: boolean;
}

/** Hook simples para detectar desktop (largura > 700px) */
const useIsDesktop = (breakpoint = 700) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
};

export const ArvinTopBar: FC<ArvinTopBarProps> = ({ appLoaded }) => {
  const isDesktop = useIsDesktop(700);
  const studentPicture =
    JSON.parse(localStorage.getItem("loggedIn") || "{}").picture || "";

  if (isDesktop) {
    // ===== Sidebar à esquerda (PC) =====
    return (
      <>
        <aside
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            height: "100vh",
            width: 260,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #E3E8F0",
            boxShadow: "0px 5px 100px rgba(155, 155, 155, 0.12)",
            display: "flex",
            flexDirection: "column",
            padding: 16,
            gap: 16,
          }}
        >
          {/* Topo do sidebar: logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 8,
              borderBottom: "1px solid #EEF2F7",
            }}
          >
            <img
              style={{
                height: 48,
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
              src={logoPartner()}
              alt="Logo"
            />
            <NotificationsArvin appLoaded={appLoaded} />
          </div>
          {/* Navegação vertical (seu componente de navegação inferior pode ser usado aqui como coluna) */}
          <div style={{ marginTop: 8 }}>
            <ArvinSideDownBar appLoaded={appLoaded} />
          </div>

          {/* Espaçador para “empurrar” conteúdo extra para o fim */}
          <div style={{ flex: 1 }} />

          {/* Rodapé opcional do sidebar */}
          <div
            style={{
              fontSize: 12,
              color: "#65748C",
              paddingTop: 8,
              borderTop: "1px solid #EEF2F7",
              textAlign: "center",
            }}
          >
            v1.0
          </div>
        </aside>
      </>
    );
  }

  // ===== Topbar 100% (Mobile) =====
  return (
    <>
      {" "}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderBottom: "1px solid #E3E8F0",
          borderRadius: "0px 0px 16px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          justifyItems: "center",
          boxShadow: "0px 5px 100px rgba(155, 155, 155, 0.3)",
        }}
      >
        {" "}
        <img
          style={{
            height: "48px",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
          }}
          src={logoPartner()}
          alt=""
        />{" "}
        <div style={{ display: "flex", alignItems: "center" }}>
          {" "}
          <NotificationsArvin
            isDesktop={isDesktop}
            appLoaded={appLoaded}
          />{" "}
          <img
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "27px",
            }}
            src={studentPicture}
            alt=""
          />{" "}
        </div>{" "}
      </div>{" "}
      <ArvinSideDownBar appLoaded={appLoaded} />{" "}
    </>
  );
};
