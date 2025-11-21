// Routes/ArvinComponents/Students/sections/StudentHeader.tsx
import React, { FC } from "react";

interface StudentHeaderProps {
  title: string;
  email?: string;
  style?: React.CSSProperties;
}

export const StudentHeader: FC<StudentHeaderProps> = ({
  title,
  email,
  style,
}) => {
  return (
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
        <span style={style}>{title}</span>
        {/* <span>{email}</span> */}
      </section>
    </div>
  );
};
