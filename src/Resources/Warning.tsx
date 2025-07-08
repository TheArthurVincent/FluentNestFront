import React from "react";

interface WarningTextProps {
  text: string;
}

const WarningText: React.FC<WarningTextProps> = ({ text }) => {
  return (
    <div
      style={{
        borderRadius: "6px",
        padding: "1rem",
        textAlign: "center",
        margin: "1rem",
        marginRight: "auto",
        marginLeft: "auto",
        display: "grid",
        maxWidth: "15rem",
        gap: "1rem",
      }}
    >
      <span
        style={{
          fontSize: "2rem",
          borderRadius: "6px",
          backgroundColor: "#FF2214",
          color: "#FFF",
        }}
      >
        ⚠
      </span>
      <span
        style={{
          fontSize: "1.1rem",
          borderRadius: "6px",
          color: "#FF2214",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default WarningText;
