import React, { FC, useState } from "react";
import { logoPartner } from "../../../Styles/Styles";
import { NotificationsArvin } from "./Notifications/NotificationsArvin";
import { ArvinSideDownBar } from "./SideDownBar/SideDownBar";

interface ArvinTopBarProps {
  appLoaded?: boolean;
  admin?: boolean;
  isDesktop: boolean;
  showLeftBar: boolean;
}

export const ArvinTopBar: FC<ArvinTopBarProps> = ({
  isDesktop,
  appLoaded,
  admin,showLeftBar
}) => {
  const studentPicture =
    JSON.parse(localStorage.getItem("loggedIn") || "{}").picture || "";

  // controla se o sidebar está “fininho” (apenas ícones)
  const [collapsed, setCollapsed] = useState(false);

  if (isDesktop && showLeftBar) {
    // ===== Sidebar à esquerda (PC) =====
    return (
      <div
        style={{
          padding: "16px 20px 16px 16px",
          zIndex: 100,
        }}
      >
        <aside
          style={{
            borderRadius: "16px",
            position: "sticky",
            top: 0,
            left: 0,
            width: collapsed ? 72 : 260, // largura menor quando colapsado
            height: "90vh",
            backgroundColor: "#ffffff",
            display: "flex",
            border: "1px solid #E3E8F0",
            flexDirection: "column",
            transition: "width 0.2s ease-in-out",
          }}
        >
          {/* Topo do sidebar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              padding: 16,
              paddingBottom: 8,
              borderBottom: "2px solid #EEF2F7",
              gap: 8,
            }}
          >
            {/* Logo só aparece quando NÃO está colapsado */}
            {!collapsed && (
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
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Notification sempre no topo */}
              <NotificationsArvin appLoaded={appLoaded} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              border: "1px solid #E3E8F0",
              background: "white",
              cursor: "pointer",
              height: 20,
              position: "fixed",
              width: 20,
              borderRadius: 12,
              zIndex: 100,
              color: "#000000",
              transform: `${
                collapsed ? "translateY(35px)" : "translateY(56px)"
              } ${collapsed ? "translateX(56px)" : "translateX(225px)"}`,
              display: "flex",
            }}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <i
                className="fa fa-expand"
                style={{
                  color: "#030303",
                }}
              />
            ) : (
              <i
                className="fa fa-compress"
                style={{
                  color: "#030303",
                }}
              />
            )}
          </button>

          {/* Navegação vertical */}
          <div
            style={{
              padding: "16px",
            }}
          >
            <ArvinSideDownBar
              admin={admin}
              isDesktop={isDesktop}
              collapsed={collapsed}
            />
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
          zIndex: 5,
          justifyItems: "center",
          boxShadow: " rgba(155, 155, 155, 0.07) 0px 5px 5px",
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
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <NotificationsArvin isDesktop={isDesktop} appLoaded={appLoaded} />
          <img
            onClick={() => {
              window.location.assign("/my-profile");
            }}
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
          />
        </div>
      </div>
    </>
  );
};
