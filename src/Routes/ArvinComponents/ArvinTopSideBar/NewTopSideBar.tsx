import React, { FC } from "react";
import { logoPartner } from "../../../Styles/Styles";
import { NotificationsArvin } from "./Notifications/NotificationsArvin";
import { ArvinSideDownBar } from "./SideDownBar/SideDownBar";
import { useIsDesktop } from "../../ArvinNewHomePage";

interface ArvinTopBarProps {
  appLoaded?: boolean;
  admin?: boolean;
}

export const ArvinTopBar: FC<ArvinTopBarProps> = ({ appLoaded, admin }) => {
  const isDesktop = useIsDesktop(700);
  const studentPicture =
    JSON.parse(localStorage.getItem("loggedIn") || "{}").picture || "";

  if (isDesktop) {
    // ===== Sidebar à esquerda (PC) =====
    return (
      <div
        style={{
          padding: "16px",
          zIndex: 100,
        }}
      >
        <aside
          style={{
            borderRadius: "16px",
            position: "sticky",
            top: 0,
            left: 0,
            width: 260,
            height: "90vh",
            backgroundColor: "#ffffff",
            display: "flex",
            border: "1px solid #E3E8F0",
            flexDirection: "column",
          }}
        >
          {/* Topo do sidebar: logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              paddingBottom: 8,
              borderBottom: "2px solid #EEF2F7",
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
          <div style={{ padding: "16px" }}>
            <ArvinSideDownBar admin={admin} isDesktop={isDesktop} />
          </div>
        </aside>
      </div>
    );
  }

  // ===== Topbar 100% (Mobile) =====
  return (
    <>
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
          <NotificationsArvin isDesktop={isDesktop} appLoaded={appLoaded} />
          <img
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "27px",
            }}
            src={
              studentPicture ||
              "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
            }
            alt=""
          />{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};
