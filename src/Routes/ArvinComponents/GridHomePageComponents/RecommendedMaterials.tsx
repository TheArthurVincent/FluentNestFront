import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import {
  BooksIcon,
  ChartBarIcon,
  FileTextIcon,
  PresentationIcon,
} from "@phosphor-icons/react";
interface RecommendedMaterialsProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const RecommendedMaterials: FC<RecommendedMaterialsProps> = ({
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
          <BooksIcon size={20} color={"#030303"} weight="bold" />
          <span>Materiais Recomendados</span>
        </span>
      </span>
      <div></div>
    </>
  );
};
