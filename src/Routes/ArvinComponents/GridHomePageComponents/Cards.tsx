import React, { FC } from "react";
import { partnerColor } from "../../../Styles/Styles";
import {
  BookOpenIcon,
  CardsIcon,
  FilesIcon,
} from "@phosphor-icons/react/dist/ssr";

interface StudyCardsProps {
  isDesktop?: boolean;
}

export const StudyCards: FC<StudyCardsProps> = ({ isDesktop }) => {
  const items = [
    {
      title: "Materiais de estudos",
      href: "/teaching-materials",
      icon: <BookOpenIcon size={20} weight="bold" color={partnerColor()} />,
    },
    {
      title: "Flashcards",
      href: "/flash-cards",
      icon: <CardsIcon size={20} weight="bold" color={partnerColor()} />,
    },
    {
      title: "Mineração de Sentenças",
      href: "/sentence-mining",
      icon: <FilesIcon size={20} weight="bold" color={partnerColor()} />,
    },
  ];

  return (
    <>
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            color: "#030303",
          }}
        >
          <BookOpenIcon size={20} color={"#030303"} weight="bold" />
          <span>Áreas de estudo</span>
        </span>
      </span>

      <div
        style={{
          display: "grid",
          marginTop: "16px",
          gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              border: "1px solid #E3E8F0",
              borderRadius: "12px",
              background: "#ffffff",
              padding: "16px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              minHeight: "120px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: `${partnerColor()}14`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>

            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "13px",
                fontWeight: 700,
                color: "#030303",
                lineHeight: 1.4,
              }}
            >
              {item.title}
            </span>

            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "flex",
                color: partnerColor(),
                alignItems: "center",
                gap: "8px",
                marginTop: "auto",
              }}
            >
              Acessar
              <i className="fa fa-chevron-right" />
            </span>
          </a>
        ))}
      </div>
    </>
  );
};
