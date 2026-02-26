import React from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import ListOfGroupsToClick from "./ListOfGroupsToClick/ListOfGroupsToClick";
import { Outlet } from "react-router-dom";

type TurmasProps = HeadersProps & {
  change?: boolean;
  setChange?: (value: boolean) => void;
  isDesktop: boolean;
  actualHeaders?: any | null;
  id?: string | number;
};

export const newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
} as const;

export function Turmas({
  actualHeaders,
  change,
  setChange,
  isDesktop,
  id,
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

      {/* Card principal – igual ao Students */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <ListOfGroupsToClick
          actualHeaders={actualHeaders || null}
          change={change}
          setChange={setChange}
          isDesktop={isDesktop}
          id={id}
          headers={null}
        />
      </div>

      {isDesktop && (
        <div
          style={{
            minHeight: 200,
          }}
        >
          {/* se você quiser usar o Groups antigo como detalhe, pode colocar via rota aninhada */}
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Turmas;
