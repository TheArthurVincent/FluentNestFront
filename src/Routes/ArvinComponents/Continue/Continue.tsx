import React, { FC } from "react";
import { logoPartner } from "../../../Styles/Styles";
interface ArvinTopBarProps {
  appLoaded?: boolean;
}

export const ArvinTopBar: FC<ArvinTopBarProps> = ({ appLoaded }) => {
  const studentPicture =
    JSON.parse(localStorage.getItem("loggedIn") || "{}").picture || "";
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
        boxShadow: "0px 5px 100px rgba(155, 155, 155, 0.3)",
      }}
    >
      <img
        style={{
          height: "48px",
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
        }}
        src={logoPartner()}
        alt=""
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginLeft: "27px",
          }}
          src={studentPicture}
          alt=""
        />
      </div>
    </div>
  );
};
