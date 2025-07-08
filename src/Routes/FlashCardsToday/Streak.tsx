import React from "react";
import { motion } from "framer-motion";
import { partnerColor } from "../../Styles/Styles";

interface StreakProps {
  streak: number;
  message: string;
}

export const Streak: React.FC<StreakProps> = ({ streak, message }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#e0e0e0",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "5px",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            backgroundColor: partnerColor(),
            borderRadius: "12px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${(streak / 400) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p
        style={{
          marginTop: "10px",
          fontSize: "12px",
          fontStyle: "italic",
        }}
      >
        <div
          style={{
            padding: "10px",
          }}
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </p>
    </div>
  );
};
