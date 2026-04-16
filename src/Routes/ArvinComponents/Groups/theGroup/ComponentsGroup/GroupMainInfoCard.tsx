import React, { FC } from "react";
import { SquaresFourIcon } from "@phosphor-icons/react";
import { GroupItem } from "./GroupHeader";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";

export const GroupMainInfoCard: FC<{
  group: GroupItem;
  onChangeName: (name: string) => void;
  onChangeDescription: (description: string) => void;
  onChangePersonalComment: (comment: string) => void;
}> = ({
  group,
  onChangeName,
  onChangeDescription,
  onChangePersonalComment,
}) => {
  return (
    <div style={cardBase}>
      {/* Título no padrão Arvin */}
      <div style={cardTitle}>
        <SquaresFourIcon size={18} weight="bold" color="#111827" />
        <span>Dados da turma</span>
      </div>

      {/* Nome da turma */}
      <input
        className="no-focus"
        style={{
          width: "100%",
          backgroundColor: "#f8fafc",
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          fontWeight: 600,
          fontSize: 14,
          padding: "8px 10px",
          marginTop: 14,
          marginBottom: 10,
          outline: "none",
          color: "#111827",
        }}
        type="text"
        placeholder="Nome da turma"
        value={group.name || ""}
        onChange={(e) => onChangeName(e.target.value)}
      />

      {/* Descrição */}
      <input
        className="no-focus"
        style={{
          width: "100%",
          backgroundColor: "#f8fafc",
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          fontWeight: 400,
          fontSize: 13,
          padding: "8px 10px",
          outline: "none",
          color: "#374151",
        }}
        type="text"
        placeholder="Descrição da turma"
        value={group.description || ""}
        onChange={(e) => onChangeDescription(e.target.value)}
      />
      {/* Descrição */}
      <input
        className="no-focus"
        style={{
          width: "100%",
          backgroundColor: "#f8fafc",
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          fontWeight: 400,
          fontSize: 13,
          padding: "8px 10px",
          outline: "none",
          color: "#374151",
        }}
        type="text"
        placeholder="Comentário pessoal"
        value={group.personalComment || ""}
        onChange={(e) => onChangePersonalComment(e.target.value)}
      />
    </div>
  );
};
