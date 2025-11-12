import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";

type MyHomePageProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
};
export function MyHomePage({ headers, change, setChange }: MyHomePageProps) {
  return (
    <div
      style={{
        paddingTop: 29,
        paddingBottom: 17,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "8px",
          fontSize: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            fontStyle: "SemiBold",
            fontSize: 24,
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Início
        </span>
      </section>
      <input type="text" name="" id="" />
    </div>
  );
}

export default MyHomePage;
