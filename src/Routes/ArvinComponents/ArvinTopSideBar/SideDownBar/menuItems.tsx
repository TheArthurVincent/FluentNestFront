import {
  BookIcon,
  CalendarIcon,
  CardsIcon,
  EarIcon,
  FeatherIcon,
  GearIcon,
  MoneyIcon,
  NotebookIcon,
  ScreencastIcon,
  SignOutIcon,
  SparkleIcon,
  TrophyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import React, { FC } from "react";
import { onLoggOut } from "../../../../Resources/UniversalComponents";
import { Link } from "react-router-dom";
import { ShovelIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";

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
        borderRadius: "8px",
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

const studentId = JSON.parse(localStorage.getItem("loggedIn") || "null")?.id;
const permissions = JSON.parse(
  localStorage.getItem("loggedIn") || "null",
)?.permissions;

export const menuItems: MenuItem[] = [
  {
    label: "Início",
    father: null,
    Icon: SparkleIcon,
    justBottom: false,
    path: "/",
    isMobile: true,
    orderMobile: 1,
    showSideBarOnly: true,
    orderSideBar: 0,
    showInBottomBar: false,
  },
  {
    label: "Calendário",
    Icon: CalendarIcon,
    father: null,
    orderMobile: 3,
    path: "/my-calendar",
    showInBottomBar: false,
    isMobile: true,
    orderSideBar: 1,
    justBottom: false,
  },
  {
    label: "Alunos",
    Icon: UserIcon,
    father: "Alunos",
    orderSideBar: 2,
    path: "/students",
    showInBottomBar: true,
    justBottom: false,
    admin: true,
    isMobile: false,
  },
  {
    label: "Turmas",
    orderSideBar: 3,
    father: "Alunos",
    Icon: UsersIcon,
    showInBottomBar: true,
    justBottom: false,
    admin: true,
    path: "/groups",
    isMobile: false,
  },
  {
    label: "Responsáveis",
    orderSideBar: 4,
    father: "Alunos",
    showInBottomBar: true,
    justBottom: false,
    admin: true,
    Icon: FeatherIcon,
    path: "/responsibles",
    isMobile: false,
  },
  {
    label: "Aulas Passadas",
    showInBottomBar: !!studentId,
    father: "Alunos",
    orderSideBar: 5,
    justBottom: false,
    Icon: ScreencastIcon,
    isJustStudent: true,
    path: permissions == "student" ? `/classes/${studentId}` : "/classes",
    isMobile: false,
  },
  {
    showInBottomBar: false,
    label: "Lições de Casa",
    father: "Alunos",
    Icon: NotebookIcon,
    path:
      permissions == "student"
        ? `/my-homework-and-lessons/${studentId}`
        : "/homework",
    isMobile: true,
    justBottom: false,
    orderSideBar: 6,
    orderMobile: 4,
  },
  {
    label: "Ranking",
    showInBottomBar: true,
    father: "Alunos",
    orderSideBar: 7,
    Icon: TrophyIcon,
    path: "/ranking",
    justBottom: false,
    isMobile: false,
  },
  {
    label: "Finanças",
    orderSideBar: 8,
    father: "Gestão",
    showInBottomBar: true,
    justBottom: false,
    admin: true,
    Icon: MoneyIcon,
    path: "/finance",
    isMobile: false,
  },
  {
    label: "Configurações",
    father: "Gestão",
    orderSideBar: 9,
    Icon: GearIcon,
    path: "/adm-businessmanagement",
    justBottom: false,
    showInBottomBar: true,
    admin: true,
  },
  {
    label: "Perfil",
    Icon: UserCircleIcon,
    justBottom: false,
    orderSideBar: 10,
    father: "Gestão",
    showInBottomBar: true,
    path: "/my-profile",
  },
  {
    label: "Flashcards",
    Icon: CardsIcon,
    father: "Estudos",
    path: "/flash-cards",
    orderSideBar: 11,
    orderMobile: 2,
    isMobile: true,
    showInBottomBar: false,
    justBottom: false,
  },
  {
    label: "Escuta & Pronúncia",
    Icon: EarIcon,
    orderSideBar: 12,
    father: "Estudos",
    path: "/listening",
    orderMobile: 5,
    isMobile: false,
    showInBottomBar: false,
    justBottom: false,
  },
  {
    label: "Mineração de Sentenças",
    Icon: ShovelIcon,
    father: "Estudos",
    orderSideBar: 13,
    path: "/sentence-mining",
    orderMobile: 5.1,
    isMobile: false,
    showInBottomBar: false,
    justBottom: false,
  },
  {
    label: "Materiais",
    father: "Estudos",
    Icon: BookIcon,
    path: "/teaching-materials",
    orderSideBar: 14,
    isMobile: false,
    showInBottomBar: false,
    justBottom: false,
  },
  {
    label: "Sair",
    Icon: SignOutIcon,
    orderSideBar: 15,
    path: "/login",
    showInBottomBar: true,
    justBottom: true,
    isMobile: false,
  },
];
