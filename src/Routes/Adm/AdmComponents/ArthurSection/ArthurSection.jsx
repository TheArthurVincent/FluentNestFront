import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
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

  return (
    <div>
      <button onClick={handleResetUsers}>Reset Users</button>
    </div>
  );
}

export default ArthurSection;
