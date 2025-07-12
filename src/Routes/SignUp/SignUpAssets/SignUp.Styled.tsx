import React from "react";
import { SignUp } from "./types.SignUp";
import { partnerColor, textTitleFont } from "../../../Styles/Styles";

export function InputFieldSignUp({
  value,
  onChange,
  id,
  placeholder,
  type,
}: SignUp) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: textTitleFont(),
        justifyContent: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          paddingBottom: "2px",
          fontWeight: 500,
          fontFamily: textTitleFont(),
        }}
      >
        {placeholder}
      </p>
      <input
        style={{
          padding: "0.5rem",
          fontSize: "15px",
          fontWeight: 500,
          border: `1px solid ${partnerColor()}`,
          width: "90%",
        }}
        value={value}
        onChange={onChange}
        id={id}
        placeholder={placeholder}
        type={type}
        required
      />
    </div>
  );
}
