import React, { useState } from "react";
import NewResponsible from "./ResponsibleFiles/NewResponsible";
import AllResponsibles from "./ResponsibleFiles/AllResponsibles";
import { newArvinTitleStyle } from "../../../ArvinComponents/SearchMaterials/SearchMaterials";

export function ResponsibleMainFile({ headers, id, isDesktop }) {
  const [flag, setFlag] = useState(false);

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
            <span style={newArvinTitleStyle}>Responsáveis</span>
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
        <AllResponsibles
          headers={headers}
          id={id}
          flag={flag}
          setFlag={setFlag}
        />
        <NewResponsible
          headers={headers}
          id={id}
          flag={flag}
          setFlag={setFlag}
        />
      </div>
    </div>
  );
}

export default ResponsibleMainFile;
