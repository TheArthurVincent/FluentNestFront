import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { ShapesIcon } from "@phosphor-icons/react/dist/ssr";
interface FlashcardsReviewProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const FlashcardsReview: FC<FlashcardsReviewProps> = ({
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
          <ShapesIcon size={20} color={"#030303"} weight="bold" />
          <span>Revisão de Flashcards</span>
        </span>
      </span>
      <div></div>
    </>
  );
};
