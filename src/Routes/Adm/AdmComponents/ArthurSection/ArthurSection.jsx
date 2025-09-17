import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Modal,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function ArthurSection({ headers }) {
  const [resetVisible, setResetVisible] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const handleShowResetMonth = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };
  const handleResetMonth = async () => {
    const headersBack = {
      authorization: headers.Authorization,
    };
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/resetmonthscoresecurethepoints`,
        null,
        { headers: headersBack }
      );
      setResetVisible(true);
      setTimeout(() => {
        setHasReset(true);
      }, 800);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notifyAlert("Erro ao resetar");
    }
  };
  const handleResetUsers = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = getLoggedUser.id;

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/upload/${userId}`,
        { headers }
      );
      notifyAlert(response.data.message, "rgba(0, 140, 255, 1)");
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      notifyAlert(error, "rgba(255, 0, 0, 1)");
    }
  };
  const handleLogoutAllUsers = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = getLoggedUser.id;

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/logoutall/${userId}`,
        { headers }
      );
      notifyAlert(response.data.message, "rgba(0, 140, 255, 1)");
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      notifyAlert(error, "rgba(255, 0, 0, 1)");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
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
              borderRadius: "10px",
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
              ⚠️ Confirmar Ação
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
                variant="contained"
                onDoubleClick={() => handleResetMonth()}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#ffffff",
                  fontWeight: "500",
                  padding: "10px 24px",
                  borderRadius: "6px",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(220,53,69,0.2)",
                  minWidth: "100px",
                }}
              >
                Sim, Resetar
              </button>
              <button
                variant="outlined"
                onMouseOver={() => handleShowResetMonth()}
                onClick={() => handleShowResetMonth()}
                style={{
                  borderColor: "#6c757d",
                  color: "#6c757d",
                  fontWeight: "500",
                  padding: "10px 24px",
                  borderRadius: "6px",
                  textTransform: "none",
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
                ✅ Pontuações do mês resetadas com sucesso!
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArthurSection;
