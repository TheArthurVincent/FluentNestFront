import React, { FC } from "react";
import { Link } from "react-router-dom";
import { TrophyIcon, UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import {
  BookIcon,
  GearIcon,
  NotebookIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

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
      path: "/licoes",
    },
    {
      label: "Ranking",
      icon: <TrophyIcon color="#030303" weight="bold" size={20} />,
      path: "/ranking",
    },
    {
      label: "Materiais de Aula",
      icon: <BookIcon color="#030303" weight="bold" size={20} />,
      path: "/materiais",
    },
    {
      label: "Perfil",
      icon: <UserCircleIcon color="#030303" weight="bold" size={20} />,
      path: "/perfil",
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
    <nav aria-label="Menu inferior">
      <ul
        style={{
          display: "grid",
          gap: "24px",
          padding: 0,
          margin: 0,
        }}
      >
        {menuItems.map((item, index) => (
          <li
            key={index}
            style={{
              listStyleType: "none",
              display: isDesktop && item.justBottom ? "none" : "flex",
              alignItems: "center",
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
