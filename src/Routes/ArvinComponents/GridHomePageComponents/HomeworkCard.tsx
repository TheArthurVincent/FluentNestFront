import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { FileTextIcon } from "@phosphor-icons/react";
interface HomeworkCardProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const HomeworkCard: FC<HomeworkCardProps> = ({
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
          <FileTextIcon size={20} color={"#030303"} weight="bold" />
          <span>Trabalhos de casa</span>
        </span>
      </span>
      <div></div>
    </>
  );
};
