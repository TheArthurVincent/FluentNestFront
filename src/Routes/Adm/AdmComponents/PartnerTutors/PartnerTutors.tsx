import axios from "axios";
import React, { useEffect, useState } from "react";
import { newArvinTitleStyle } from "../../../ArvinComponents/NewHomePageArvin/NewHomePageArvin";

export function PartnerTutors({
  headers,
  isDesktop,
  id,
}: {
  headers: any;
  isDesktop: boolean;
  id: string;
}) {
  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {/* Título da página (desktop) */}
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
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
            <span style={newArvinTitleStyle}>Partner Tutors</span>
          </section>
        </div>
      )}
    </div>
  );
}

export default PartnerTutors;
