import React, {  useState } from "react";
import "font-awesome/css/font-awesome.min.css";
import Helmets from "../../Resources/Helmets";
import { backDomain } from "../../Resources/UniversalComponents";
import axios from "axios";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import { partnerColor } from "../../Styles/Styles";
import { TextField } from "@mui/material";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";

function ResetPasswordFinalChange() {
  const [Password, setPassword] = useState<string>("");
  const [Password1, setPassword1] = useState<string>("");

  const handleSendPassword = async () => {
    const str = window.location.pathname;
    const match = str.split("/");
    const id = match ? match[2] : null;

    try {
      var response = await axios.put(
        `${backDomain}/api/v1/resetpasswordfinal/${id}`,
        {
          newPassword: Password,
        }
      );
      setTimeout(() => {
        notifyAlert(response.data.message, partnerColor());
        setTimeout(() => {
          window.location.assign("/login");
        }, 1000);
      }, 500);
    } catch (error: any) {
      console.log(error);
      notifyAlert(error.response.data.message);
    }
  };
  return (
    <RouteDiv
      style={{
        maxWidth: "20rem",
        margin: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          overflow: "hidden",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "10px",
          }}
        >
          <Helmets text={"Reset Password"} />
          <TextField
            label="Nova senha"
            name="Nova senha"
            type="password"
            value={Password}
            onChange={(event: any) => setPassword(event.target.value)}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: partnerColor(),
                },
                "&:hover fieldset": {
                  borderColor: partnerColor(),
                },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
                "& label": {
                  color: partnerColor(),
                },
                "& label.Mui-focused": {
                  color: partnerColor(),
                },
              },
            }}
          />
          <TextField
            value={Password1}
            onChange={(event: any) => setPassword1(event.target.value)}
            id="name"
            placeholder="Confirmar Nova Senha"
            type="password"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: partnerColor(),
                },
                "&:hover fieldset": {
                  borderColor: partnerColor(),
                },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
                "& label": {
                  color: partnerColor(),
                },
                "& label.Mui-focused": {
                  color: partnerColor(),
                },
              },
            }}
          />

          <ArvinButton
            style={{
              display: "flex",
              marginLeft: "auto",
              cursor: Password1 !== Password ? "not-allowed" : "pointer",
              backgroundColor:
                Password1 !== Password ? "gray" : partnerColor(),
            }}
            disabled={Password1 !== Password}
            onClick={handleSendPassword}
          >
            Alterar Senha
          </ArvinButton>
        </div>
      </div>
    </RouteDiv>
  );
}

export default ResetPasswordFinalChange;
