// Routes/ArvinComponents/Groups/GroupDangerZoneCard.tsx
import React, { FC, useState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";

export const GroupDangerZoneCard: FC<{ onDeleteGroup: () => void }> = ({
  onDeleteGroup,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div
      style={{
        ...cardBase,
        background: "#fef2f2",
        border: "1px solid #fecaca",
      }}
    >
      {/* Título estilizado */}
      <div style={{ ...cardTitle, color: "#b91c1c" }}>
        <WarningCircle size={18} weight="bold" color="#b91c1c" />
        <span>Zona de perigo</span>
      </div>

      <p
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "#7f1d1d",
          lineHeight: 1.4,
        }}
      >
        Excluir esta turma irá remover o vínculo dos alunos com este grupo.
        <br />
        <strong>Esta ação não pode ser desfeita.</strong>
      </p>

      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "8px 0",
            borderRadius: 999,
            background: "#dc2626",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            fontSize: 12,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Excluir turma
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button
            onClick={onDeleteGroup}
            style={{
              width: "100%",
              padding: "8px 0",
              borderRadius: 999,
              background: "#b91c1c",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              fontSize: 12,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Confirmar exclusão
          </button>

          <button
            onClick={() => setShowDeleteConfirm(false)}
            style={{
              width: "100%",
              padding: "8px 0",
              borderRadius: 999,
              background: "#e5e7eb",
              color: "#111827",
              fontWeight: 600,
              border: "none",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
