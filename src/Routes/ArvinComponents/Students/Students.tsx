import React from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import ListOfStudentsToClick from "./ListOfStudents/ListOfStudentsToClick";
import { Outlet } from "react-router-dom";

type StudentsProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  myId?: string;
  actualHeaders?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Lato",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};

export function Students({
  actualHeaders,
  change,
  setChange,
  myId,
  isDesktop,
}: StudentsProps) {
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
            <span style={newArvinTitleStyle}>Alunos</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Lato",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          margin: !isDesktop ? "12px" : "0px",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <ListOfStudentsToClick
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

export default Students;
