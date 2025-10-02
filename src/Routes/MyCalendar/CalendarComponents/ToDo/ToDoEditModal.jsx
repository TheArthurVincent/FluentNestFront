import React, { useState } from "react";
import axios from "axios";
import { partnerColor, textpartnerColorContrast } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

function ToDoModal() {
  return (
    <>

    <button>________</button>
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: partnerColor,
        color: textpartnerColorContrast,
        padding: "20px",
        borderRadius: "6px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      oi
    </div>
  </>
  );
}

export default ToDoModal;
