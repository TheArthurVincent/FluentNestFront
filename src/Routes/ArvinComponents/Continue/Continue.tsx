import React, { FC } from "react";
import { logoPartner, partnerColor } from "../../../Styles/Styles";
interface ContinueProps {
  appLoaded?: boolean;
}

export const Continue: FC<ContinueProps> = ({ appLoaded }) => {
  return (
    <div
      style={{
        padding: "32px",
        border: `1px solid ${partnerColor()}50`,
        backgroundImage: `linear-gradient(180deg, ${partnerColor()}15 70%, ${partnerColor()}05 100%)`,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "start",
        justifyContent: "space-between",
        justifyItems: "center",
      }}
    >
      <p
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 700,
          fontStyle: "Bold",
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: "4%",
          textTransform: "uppercase",
          color: partnerColor(),
        }}
      >
        PLANO DO DIA
      </p>
      <div>
        <p
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontStyle: "Bold",
            fontSize: 28,
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#030303",
          }}
        >
          Continue de onde parou
        </p>
        <p
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            fontStyle: "SemiBold",
            fontSize: 14,
            marginTop: 8,
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#65748C",
          }}
        >
          Retome sua última aula e mantenha o foco na meta de hoje.
        </p>
        <a
          href=""
          style={{
            textDecoration: "none",
            padding: "16px 11px",
            borderRadius: "8px",
            border: `1px solid ${partnerColor()}45`,
            marginTop: 16,
            display: "flex",
            cursor: "pointer",
            width: "fit-content",
            backgroundColor: `${partnerColor()}20`,
          }}
        >
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#030303",
            }}
          >
            Última aula acessada
          </span>
        </a>
      </div>
    </div>
  );
};
