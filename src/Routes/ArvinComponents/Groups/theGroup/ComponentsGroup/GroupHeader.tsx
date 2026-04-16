import React, { FC } from "react";
import { newArvinTitleStyle } from "../../Groups";

export type GroupItem = {
  _id: string;
  name?: string;
  personalComment?: string;
  description?: string;
  studentIds?: Array<{ _id?: string } | string>;
};

export const GroupHeader: FC<{ group: GroupItem; isDesktop?: boolean }> = ({
  group,
  isDesktop,
}) => {
  if (!isDesktop) return null;

  return (
    <header
      style={{
        paddingTop: 24,
        paddingBottom: 16,
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
        <div>
          <div style={newArvinTitleStyle}>{group.name || "Turma sem nome"}</div>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 13,
              color: "#64748b",
              marginTop: 4,
            }}
          >
            {group.description || "Adicione uma descrição para esta turma"}
          </div>
        </div>
      </section>
    </header>
  );
};
