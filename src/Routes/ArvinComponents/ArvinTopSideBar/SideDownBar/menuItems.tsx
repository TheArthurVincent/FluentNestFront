import {
  BookIcon,
  CalendarIcon,
  CardsIcon,
  GearIcon,
  NotebookIcon,
  SignOutIcon,
  SparkleIcon,
  TrophyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import React, { FC } from "react";
import { onLoggOut } from "../../../../Resources/UniversalComponents";
import { Link } from "react-router-dom";

export type MenuItem = {
  label: string;
  showInBottomBar?: boolean;
  path: string;
  Icon: any;
  justBottom?: boolean;
  admin?: boolean;
  isMobile?: boolean;
  orderMobile?: number;
  currentPath?: string;
  bgActive?: string;
};

export const ItemRow: FC<{
  item: MenuItem;
  admin?: boolean;
  currentPath: string;
  bgActive: string;
  baseTextColor: string;
  partnerColor: () => string;
}> = ({ item, admin, currentPath, bgActive, baseTextColor, partnerColor }) => {
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
export const menuItems: MenuItem[] = [
  {
    label: "Início",
    Icon: SparkleIcon,
    justBottom: false,
    path: "/home",
    isMobile: true,
    orderMobile: 1,
    showInBottomBar: false,
  },
  {
    showInBottomBar: true,
    justBottom: false,
    label: "Lições & Aula",
    Icon: NotebookIcon,
    path: "/my-homework-and-lessons",
    isMobile: false,
  },
  {
    label: "Ranking",
    showInBottomBar: true,
    Icon: TrophyIcon,
    path: "/ranking",
    justBottom: false,
    isMobile: false,
  },
  {
    showInBottomBar: false,
    label: "Materiais",
    Icon: BookIcon,
    path: "/teaching-materials",
    isMobile: true,
    justBottom: false,
    orderMobile: 4,
  },
  {
    label: "Flashcards",
    Icon: CardsIcon,
    showInBottomBar: false,

    path: "/flash-cards",
    isMobile: true,
    orderMobile: 2,
    justBottom: false,
  },
  {
    label: "Calendário",
    Icon: CalendarIcon,
    path: "/my-calendar",
    showInBottomBar: false,

    isMobile: true,
    orderMobile: 3,
    justBottom: false,
  },
  {
    label: "Perfil",
    Icon: UserCircleIcon,
    justBottom: false,
    showInBottomBar: true,
    path: "/my-profile",
  },
  {
    label: "Configurações",
    Icon: GearIcon,
    path: "/adm-businessmanagement",
    justBottom: true,
    showInBottomBar: true,
    admin: true,
  },
  {
    label: "Sair",
    Icon: SignOutIcon,
    path: "/login",
    showInBottomBar: true,
    justBottom: true,
    isMobile: false,
  },
];
