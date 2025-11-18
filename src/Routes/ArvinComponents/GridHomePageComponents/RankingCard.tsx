import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { TrophyIcon } from "@phosphor-icons/react";
import StudentsRanking from "./RankingItems/RankingItems";
interface RankingCardProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const RankingCard: FC<RankingCardProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
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
            fontWeight: "600",
            color: "#030303",
          }}
        >
          <TrophyIcon size={20} color={"#030303"} weight="bold" />
          <span>Ranking</span>
        </span>
      </span>
      <div>
        <StudentsRanking headers={actualHeaders} />
      </div>
      <div>
        <a
          href="/ranking"
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            marginTop: "20px",
            fontSize: "12px",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "flex",
            color: partnerColor(),
            alignItems: "center",
            gap: "8px",
          }}
        >
          Ver ranking completo
          <i className="fa fa-chevron-right" />
        </a>
      </div>
    </>
  );
};
