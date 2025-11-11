import React, { FC } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  TrophyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  BookIcon,
  CardsIcon,
  GearIcon,
  NotebookIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { partnerColor } from "../../../../Styles/Styles";

interface ArvinSideDownBarProps {
  appLoaded?: boolean;
  isDesktop?: boolean;
}

export const ArvinSideDownBar: FC<ArvinSideDownBarProps> = ({
  isDesktop,
  appLoaded,
}) => {
  const menuItems = [
    {
      label: "Lições & Aula",
      icon: <NotebookIcon color="#030303" weight="bold" size={20} />,
      path: "/my-homework-and-lessons",
    },
    {
      label: "Ranking",
      icon: <TrophyIcon color="#030303" weight="bold" size={20} />,
      path: "/ranking",
    },
    {
      label: "Materiais de Aula",
      icon: <BookIcon color="#030303" weight="bold" size={20} />,
      path: "/teaching-materials",
    },
    {
      label: "Flashcards",
      icon: <CardsIcon color="#030303" weight="bold" size={20} />,
      path: "/flash-cards",
    },
    {
      label: "Calendário",
      icon: <CalendarIcon color="#030303" weight="bold" size={20} />,
      path: "/my-calendar",
    },
    {
      label: "Perfil",
      icon: <UserCircleIcon color="#030303" weight="bold" size={20} />,
      path: "/my-profile",
    },
    {
      label: "Configurações",
      icon: <GearIcon color="#030303" weight="bold" size={20} />,
      path: "/configuracoes",
      justBottom: true,
    },
    {
      label: "Sair",
      icon: <SignOutIcon color="#030303" weight="bold" size={20} />,
      path: "/logout",
      justBottom: true,
    },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // <-- separa topo e base
        padding: "12px 0",
      }}
      aria-label="Menu inferior"
    >
      <ul
        style={{
          display: "grid",
          padding: 0,
          margin: 0,
        }}
      >
        {menuItems.map((item, index) => (
          <li
            key={index}
            style={{
              listStyleType: "none",
              display: isDesktop && item.justBottom ? "none" : "grid",
              alignItems: "center",
              borderRadius: "8px",
              padding: "8px 12px",
              backgroundColor: window.location.href.includes(item.path)
                ? `${partnerColor()}09`
                : "transparent",
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = `${partnerColor()}09`;
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = "transparent";
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
              {item.icon}
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 600,
                  fontStyle: "SemiBold",
                  fontSize: 14,
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#030303",
                  marginLeft: "12px",
                }}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul
        style={{
          display: "grid",
          // gap: "24px",
          padding: 0,
          margin: 0,
          marginTop: "45vh",
        }}
      >
        {menuItems.map((item, index) => (
          <li
            key={index}
            style={{
              listStyleType: "none",
              display: isDesktop && item.justBottom ? "grid" : "none",
              alignItems: "center",
              borderRadius: "8px",
              padding: "8px 12px",
              backgroundColor: window.location.href.includes(item.path)
                ? `${partnerColor()}09`
                : "transparent",
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = `${partnerColor()}09`;
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = "transparent";
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
              {item.icon}
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 600,
                  fontStyle: "SemiBold",
                  fontSize: 14,
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#030303",
                  marginLeft: "12px",
                }}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
