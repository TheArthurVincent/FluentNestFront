import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function ArthurSection({ headers }) {
  const ADMIN_ACTIONS_PASSWORD = import.meta.env.VITE_ADMIN_ACTIONS_PASSWORD;

  const [resetVisible, setResetVisible] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // Modal de proteção
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);

  const handleOpenAdminModal = () => {
    setAdminModalOpen(true);
    setAdminError("");
    setAdminPassword("");
  };

  const handleCloseAdminModal = () => {
    setAdminModalOpen(false);
    setAdminError("");
    setAdminPassword("");
  };

  const handleUnlock = async () => {
    setAdminError("");
    setUnlockLoading(true);

    // pequeno delay só pra dar feedback visual
    setTimeout(() => {
      const ok = adminPassword === ADMIN_ACTIONS_PASSWORD;
      if (!ok) {
        setAdminError(
          "Senha incorreta. Se você não é o Arthur, não pode acessar essa área.",
        );
        setUnlockLoading(false);
        return;
      }

      setAdminUnlocked(true);
      setUnlockLoading(false);
      setAdminModalOpen(false);
      notifyAlert("Ações administrativas liberadas.", "rgba(0, 140, 255, 1)");
    }, 250);
  };

  const handleLock = () => {
    setAdminUnlocked(false);
    setIsConfirmVisible(false);
    setResetVisible(false);
    setHasReset(false);
    notifyAlert("Ações administrativas bloqueadas.", "rgba(255, 140, 0, 1)");
  };

  const handleShowResetMonth = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };

  const handleResetMonth = async () => {
    const headersBack = { authorization: headers.Authorization };
    try {
      await axios.put(
        `${backDomain}/api/v1/resetmonthscoresecurethepoints`,
        null,
        { headers: headersBack },
      );
      setResetVisible(true);
      setTimeout(() => setHasReset(true), 800);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      notifyAlert("Erro ao resetar", partnerColor());
    }
  };

  const handleResetUsers = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = getLoggedUser.id;

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/upload/${userId}`,
        { headers },
      );
      notifyAlert(response.data.message, "rgba(0, 140, 255, 1)");
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      notifyAlert(String(error), "rgba(255, 0, 0, 1)");
    }
  };

  const handleResetTokens = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = getLoggedUser.id;

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/reset-tokens/${userId}`,
        { headers },
      );
      notifyAlert(response.data.message, "rgba(0, 140, 255, 1)");
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      notifyAlert(String(error), "rgba(255, 0, 0, 1)");
    }
  };

  const handleLogoutAllUsers = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = getLoggedUser.id;

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/logoutall/${userId}`,
        { headers },
      );
      notifyAlert(response.data.message, "rgba(0, 140, 255, 1)");
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      notifyAlert(String(error), "rgba(255, 0, 0, 1)");
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {!adminUnlocked ? (
        <button onClick={handleOpenAdminModal}>Abrir ações admin</button>
      ) : (
        <button onClick={handleLock}>Bloquear ações admin</button>
      )}

      <Modal open={adminModalOpen} onClose={handleCloseAdminModal}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <Paper
            elevation={3}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "20px",
              borderRadius: "6px",
            }}
          >
            <Typography style={{ fontWeight: 700, marginBottom: 10 }}>
              Ações administrativas
            </Typography>

            <Typography style={{ fontSize: 13, color: "#6c757d" }}>
              Digite a senha para liberar os botões.
            </Typography>

            <div style={{ marginTop: 14 }}>
              <TextField
                fullWidth
                type="password"
                label="Senha"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUnlock();
                }}
                error={Boolean(adminError)}
                helperText={adminError || " "}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "6px",
              }}
            >
              <button onClick={handleCloseAdminModal}>Cancelar</button>

              <button
                onClick={handleUnlock}
                disabled={unlockLoading || !adminPassword}
                style={{
                  background: "#111",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "6px",
                }}
              >
                {unlockLoading ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <CircularProgress size={14} />
                    Validando
                  </span>
                ) : (
                  "Desbloquear"
                )}
              </button>
            </div>
          </Paper>
        </div>
      </Modal>

      {adminUnlocked && (
        <>
          <button onDoubleClick={handleResetTokens}>Reset Tokens</button>
          <button onDoubleClick={handleResetUsers}>Reset Users</button>
          <button onDoubleClick={handleLogoutAllUsers}>Logout All Users</button>
          <button onDoubleClick={() => handleShowResetMonth()}>
            Resetar pontuações do mês
          </button>

          <div style={{ display: hasReset ? "none" : "block" }}>
            <div style={{ display: isConfirmVisible ? "block" : "none" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "24px",
                  borderRadius: "6px",
                  marginTop: "20px",
                  border: "1px solid #ffeaa7",
                  boxShadow: "0 2px 8px rgba(255,193,7,0.1)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    color: "#856404",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "16px",
                  }}
                >
                  Confirmar Ação
                </Typography>

                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "14px",
                    marginBottom: "24px",
                    lineHeight: "1.5",
                  }}
                >
                  Tem certeza que deseja resetar pontuações do mês?
                  <br />
                  <small style={{ color: "#856404" }}>
                    Esta ação irá zerar todas as pontuações mensais dos alunos.
                  </small>
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onDoubleClick={() => handleResetMonth()}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#ffffff",
                      fontWeight: "500",
                      padding: "10px 24px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(220,53,69,0.2)",
                      minWidth: "100px",
                    }}
                  >
                    Sim, Resetar
                  </button>

                  <button
                    onClick={() => handleShowResetMonth()}
                    style={{
                      borderColor: "#6c757d",
                      color: "#6c757d",
                      fontWeight: "500",
                      padding: "10px 24px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      minWidth: "100px",
                    }}
                  >
                    Cancelar
                  </button>
                </div>

                <div
                  style={{
                    display: resetVisible ? "block" : "none",
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#d4edda",
                    borderRadius: "6px",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  <Typography
                    style={{
                      color: "#155724",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Pontuações do mês resetadas com sucesso!
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ArthurSection;
