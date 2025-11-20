import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  updateInfo,
  updateScore,
} from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import ListOfGroupsToClick from "./ListOfGroupsToClick/ListOfGroupsToClick";

type TurmasProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};

export function Turmas({
  actualHeaders,
  change,
  setChange,
  isDesktop,
}: TurmasProps) {
  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>Turmas</span>
          </section>
        </div>
      )}
      <div
        style={{
          columnCount: isDesktop ? 2 : 1, // 2 colunas no desktop, 1 no celular
          columnGap: "16px",
          marginTop: "32px",
          paddingBottom: "64px",
        }}
      >
        <ListOfGroupsToClick
          actualHeaders={actualHeaders}
          headers={actualHeaders}
          change={change}
          setChange={setChange}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
}

export default Turmas;
