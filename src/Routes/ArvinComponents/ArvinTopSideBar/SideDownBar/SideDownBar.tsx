import React, { FC } from "react";
import { useLocation } from "react-router-dom";
import { partnerColor } from "../../../../Styles/Styles";
import { ItemRow, menuItems } from "./menuItems";

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
            <ItemRow
              key={`side-${item.path}-${idx}`}
              item={item}
              admin={admin}
              currentPath={currentPath}
              bgActive={bgActive}
              baseTextColor={baseTextColor}
              partnerColor={partnerColor}
            />
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
            <ItemRow
              key={`bottom-${item.path}-${idx}`}
              item={item}
              admin={admin}
              currentPath={currentPath}
              bgActive={bgActive}
              baseTextColor={baseTextColor}
              partnerColor={partnerColor}
            />
          ))}
      </ul>
    </nav>
  );
};
