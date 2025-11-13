import React, { FC } from "react";
import { logoPartner } from "../../../Styles/Styles";
interface ContinueProps {
  appLoaded?: boolean;
}

export const Continue: FC<ContinueProps> = ({ appLoaded }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderBottom: "1px solid #E3E8F0",
        borderRadius: "0px 0px 16px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        justifyItems: "center",
      }}
    >
      Continue de onde parou
    </div>
  );
};
