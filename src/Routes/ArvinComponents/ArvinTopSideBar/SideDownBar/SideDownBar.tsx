import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { partnerColor } from "../../../../Styles/Styles";
import { onLoggOut } from "../../../../Resources/UniversalComponents";
import { MenuItem, menuItems } from "./menuItems";

interface ArvinSideDownBarProps {
  isDesktop?: boolean;
  admin?: boolean;
}

export const ArvinSideDownBar: FC<ArvinSideDownBarProps> = ({
  isDesktop,
  admin,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const bgActive = `${partnerColor()}09`; // usa alpha baixo para bg ativo
  const baseTextColor = "#030303";

  const ItemRow: FC<{ item: MenuItem }> = ({ item }) => {
    console.log(
      item,
      item,
      admin,
      item.admin ? (admin ? "grid" : "none") : "grid"
    );
    const active = currentPath.startsWith(item.path);
    return (
      <li
        onClick={() => {
          if (item.label === "Sair") {
            onLoggOut();
          } else {
            null;
          }
        }}
        style={{
          listStyleType: "none",
          display: item.admin ? (admin ? "grid" : "none") : "grid",
          alignItems: "center",
          borderRadius: "8px",
          padding: "8px 12px",
          backgroundColor: active ? bgActive : "transparent",
          transition: "background-color 0.15s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = bgActive;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = active
            ? bgActive
            : "transparent";
        }}
      >
        <Link
          to={item.path}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <item.Icon
            // Ícone fica colorido quando ativo; caso contrário, preto padrão
            color={active ? partnerColor() : baseTextColor}
            weight="bold"
            size={20}
          />
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: baseTextColor,
              marginLeft: "12px",
            }}
          >
            {item.label}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      aria-label="Menu inferior"
    >
      {/* Topo: todos, exceto os marcados como justBottom (no desktop) */}
      <ul
        style={{
          display: "grid",
          padding: 0,
          margin: 0,
          gap: 6,
        }}
      >
        {menuItems
          .filter((item) => !(isDesktop && item.justBottom))
          .map((item, idx) => (
            <ItemRow key={`${item.path}-${idx}`} item={item} />
          ))}
      </ul>

      {/* Base: apenas os marcados como justBottom (somente no desktop) */}
      <ul
        style={{
          display: isDesktop ? "grid" : "none",
          padding: 0,
          margin: 0,
          gap: 6,
          marginTop: "45vh",
        }}
      >
        {menuItems
          .filter((item) => item.justBottom)
          .map((item, idx) => (
            <ItemRow key={`bottom-${item.path}-${idx}`} item={item} />
          ))}
      </ul>
    </nav>
  );
};
