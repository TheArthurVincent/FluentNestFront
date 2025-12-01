import React from "react";
import { Outlet } from "react-router-dom";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import ListOfStudentsHWToClick from "./StudentsHWList";

type HWUpProps = HeadersProps & {
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

export function HWUp({
  actualHeaders,
  change,
  setChange,
  isDesktop,
}: HWUpProps) {
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
            <span style={newArvinTitleStyle}>Lição de Casa</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <ListOfStudentsHWToClick
          headers={actualHeaders}
          actualHeaders={actualHeaders}
          change={change}
          setChange={setChange}
          isDesktop={isDesktop}
        />
      </div>
      {isDesktop && (
        <div
          style={{
            minHeight: 200,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default HWUp;
