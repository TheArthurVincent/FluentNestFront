import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  updateInfo,
  updateScore,
} from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import ListOfStudentsToClick from "./ListOfStudents/ListOfStudentsToClick";
import { ArvinTopBar } from "../ArvinTopSideBar/NewTopSideBar";
import { Outlet } from "react-router-dom";

type StudentsProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  myId?: string;
  actualHeaders?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
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
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "95%",
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
            minHeight: 300,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Students;
