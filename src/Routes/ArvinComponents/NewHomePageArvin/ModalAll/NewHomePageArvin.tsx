// ModalShowAllCORINGA.tsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import {
  backDomain,
  updateInfo,
} from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { User } from "../../../MyProfile/types.MyProfile";

type EditData = {
  name: string;
  lastname: string;
  doc: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string; // yyyy-mm-dd
};

type Props = {
  onClose: () => void;
  universalWarning: boolean;
  user: User;
  headers?: Record<string, any>;
  isDesktop: boolean;

  // opcional: se você quiser reagir no pai sem dar reload
  onSaved?: (updated: EditData) => void;
};

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
};

export default function ModalShowAllCORINGA({
  onClose,
  user,
  headers,
  universalWarning,
  isDesktop,
  onSaved,
}: Props) {
  const baseBtnStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    borderRadius: 4,
    fontSize: isDesktop ? 12 : 14,
    cursor: "pointer",
    margin: isDesktop ? "0 4px" : "4px 0",
    width: isDesktop ? "auto" : "100%",
  };

  const basePrimaryBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    border: `1px solid ${partnerColor()}`,
    background: partnerColor(),
    color: "#fff",
  };

  const [editData, setEditData] = useState<EditData>({
    name: "",
    lastname: "",
    doc: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (!user) return;

    setEditData({
      name: user.name || "",
      lastname: user.lastname || "",
      doc: user.doc || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }, [user, open]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveUNIVERSALWARNING = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/universal-warning/${user.id}`,
        {},
        { headers: headers || {} },
      );

      onSaved?.(editData);

      onClose();
      window.location.reload();
    } catch (err) {
      notifyAlert("Erro ao atualizar dados.");
    }
  };

  const saveEditProfile = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/students/${user.id}`,
        { ...editData },
        { headers: headers || {} },
      );

      notifyAlert("Dados atualizados com sucesso!", partnerColor());
      updateInfo(user.id, headers);
    } catch (err) {
      notifyAlert("Erro ao atualizar dados.");
    }
  };

  if (!universalWarning) return null;
  return (
    <ModalPortal>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1001,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "32px 24px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{
              marginBottom: "18px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Precisamos que você atualize seus dados pessoais
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEditProfile();
              saveUNIVERSALWARNING();
            }}
            style={{ display: "grid", gap: "14px" }}
          >
            <TextField
              label="Nome"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Sobrenome"
              name="lastname"
              value={editData.lastname}
              onChange={handleEditChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Telefone"
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleEditChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Nascimento"
              name="dateOfBirth"
              type="date"
              value={editData.dateOfBirth}
              onChange={handleEditChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <div
              style={{
                display: "flex",
                gap: isDesktop ? "12px" : 0,
                marginTop: "10px",
                justifyContent: "center",
                flexDirection: isDesktop ? "row" : "column",
                width: "100%",
              }}
            >
              <button type="submit" style={basePrimaryBtnStyle}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
