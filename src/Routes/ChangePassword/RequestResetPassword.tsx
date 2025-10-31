import React, { useState } from "react";
import { logoPartner, partnerColor } from "../../Styles/Styles";
import { backDomain } from "../../Resources/UniversalComponents";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import Helmets from "../../Resources/Helmets";
import { HOne } from "../../Resources/Components/RouteBox";
import { NavLink } from "react-router-dom";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { isArthurVincent, isArvin } from "../../App";

function RequestResetPassword() {
  const [email, setEmail] = useState<string>("");

  const handleSendPassword = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/resetpassword/${email}`,
        {
          isArthurVincent,
          isArvin,
        }
      );
      notifyAlert(response.data.message, partnerColor());
      setTimeout(() => {
        window.location.assign("/login");
      }, 2500);
    } catch (error: any) {
      window.alert(error.response.data.message);
      setEmail("");
    }
  };

  const myLogo = logoPartner();

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Helmets text={"Login"} />
      <div style={{ width: "100vw" }}>
        <div style={{ margin: "auto" }}>
          <div style={{ alignItems: "center", display: "grid" }}>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                padding: "5rem",
                backgroundColor: "#fff",
                maxWidth: "fit-content",
                margin: "auto",
                borderRadius: "4px",
              }}
              className="box-shadow-white"
            >
              <img
                src={myLogo}
                alt="arvin logo"
                style={{
                  margin: "auto",
                  height: "4rem",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
              <HOne>Altere sua senha</HOne>
              <TextField
                label="E-mail"
                name="email"
                type="email"
                value={email}
                onChange={(event: any) => setEmail(event.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: partnerColor(), // cor normal
                    },
                    "&:hover fieldset": {
                      borderColor: partnerColor(), // ao passar o mouse
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: partnerColor(), // quando focado
                    },
                    "& label": {
                      color: partnerColor(), // cor padrão do label
                    },
                    "& label.Mui-focused": {
                      color: partnerColor(), // cor quando o label está flutuando
                    },
                  },
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleSendPassword}
                  disabled={email == "" ? true : false}
                  style={{
                    backgroundColor: "#eee",
                    color: "#000",
                    marginLeft: "auto",
                  }}
                >
                  Enviar{" "}
                </Button>
              </div>
              <NavLink to="/">Voltar ao Login</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestResetPassword;
