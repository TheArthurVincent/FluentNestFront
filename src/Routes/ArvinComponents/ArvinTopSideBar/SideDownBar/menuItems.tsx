import {
  BookIcon,
  CardsIcon,
  SignOutIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import React, { FC } from "react";
import { onLoggOut } from "../../../../Resources/UniversalComponents";
import { Link } from "react-router-dom";
import { ShovelIcon } from "@phosphor-icons/react/dist/ssr";

export type MenuItem = {
  label: string;
  father?: string | null;
  showInBottomBar?: boolean;
  path: string;
  Icon: any;
  justBottom?: boolean;
  admin?: boolean;
  isMobile?: boolean;
  isJustStudent?: boolean;
  orderMobile?: number;
  currentPath?: string;
  showSideBarOnly?: boolean;
  bgActive?: string;
  orderSideBar?: number;
};

export const ItemRow: FC<{
  item: MenuItem;
  admin?: boolean;
  currentPath: string;
  bgActive: string;
  isJustStudent?: boolean;
  baseTextColor: string;
  partnerColor: () => string;
  collapsed?: boolean;
}> = ({
  item,
  admin,
  currentPath,
  bgActive,
  baseTextColor,
  partnerColor,
  collapsed,
}) => {
  // normaliza removendo barra final (exceto a raiz)
  const normalize = (p: string) => p.replace(/\/+$/, "") || "/";

  const curr = normalize(currentPath);
  const target = normalize(item.path);

  // ativo: exato ou subrota (ex.: /ranking e /ranking/top10)
  const active =
    target === "/"
      ? curr === "/"
      : curr === target || curr.startsWith(`${target}/`);

  const showItem = item.admin ? !!admin : true;

  return (
    <li
      onClick={() => {
        if (item.label === "Sair") onLoggOut();
      }}
      style={{
        listStyleType: "none",
        display: showItem ? "grid" : "none",
        alignItems: "center",
        borderRadius: "6px",
        padding: collapsed ? "10px 0" : "8px 12px",
        backgroundColor: active ? bgActive : "transparent",
        transition:
          "background-color 0.15s ease-in-out, padding 0.15s ease-in-out",
        justifyItems: collapsed ? "center" : "stretch",
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
          justifyContent: collapsed ? "center" : "flex-start",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <item.Icon
          color={active ? partnerColor() : baseTextColor}
          weight="bold"
          size={20}
        />
        {!collapsed && (
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
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );
};

export const menuItems: MenuItem[] = [
  {
    label: "Início",
    Icon: SparkleIcon,
    path: "/",
    justBottom: false,
    isMobile: true,
    orderMobile: 0,
    orderSideBar: 0,
    showSideBarOnly: true,
    showInBottomBar: false,
  },
  {
    label: "Materiais",
    Icon: BookIcon,
    path: "/teaching-materials",
    justBottom: false,
    isMobile: true,
    father: "English",
    orderMobile: 1,
    orderSideBar: 1,
    showSideBarOnly: true,
    showInBottomBar: false,
  },
  {
    label: "Flashcards",
    Icon: CardsIcon,
    path: "/flash-cards",
    justBottom: false,
    isMobile: true,
    orderMobile: 2,
    orderSideBar: 2,
    father: "English",
    showSideBarOnly: true,
    showInBottomBar: false,
  },
  {
    label: "Mineração",
    Icon: ShovelIcon,
    path: "/sentence-mining",
    justBottom: false,
    isMobile: true,
    orderMobile: 3,
    father: "English",
    orderSideBar: 3,
    showSideBarOnly: true,
    showInBottomBar: false,
  },
  {
    label: "Sair",
    Icon: SignOutIcon,
    orderSideBar: 4,
    orderMobile: 4,
    path: "/login",
    justBottom: false,
    isMobile: true,
    showSideBarOnly: true,
    showInBottomBar: false,
  },
];
