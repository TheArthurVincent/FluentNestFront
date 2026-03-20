import React, { useState } from "react";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import ListeningExercise from "./ListeningComponents/ListeningExercise";
import { newArvinTitleStyle } from "../ArvinComponents/Students/Students";

interface ListeningProps {
  headers: MyHeadersType | null;
  onChange: any;
  isDesktop: boolean;
  change: boolean;
}
const Listening = ({
  headers,
  onChange,
  isDesktop,
  change,
}: ListeningProps) => {
  useState<number>(0);

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
            }}
          >
            <span style={newArvinTitleStyle}>Listening</span>
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
          borderRadius: "6px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
        }}
      >
        <Helmets text="Listening Exercise" />
        <ListeningExercise
          onChange={onChange}
          change={change}
          headers={headers}
        />
      </div>
    </div>
  );
};

export default Listening;
