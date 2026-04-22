import React, { useEffect, useState } from "react";
import { logoPartner, partnerColor } from "../../Styles/Styles";
import { backDomain } from "../../Resources/UniversalComponents";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import { Alert, CircularProgress, Grid, TextField } from "@mui/material";
import Helmets from "../../Resources/Helmets";
import { NavLink } from "react-router-dom";
import { isArvin, isLocalHost } from "../../App";
import { handleLoginSuccess } from "../../services/oneSignalLoginIntegration";

export function LoginComponent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fail, setFail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [button, setButton] = useState<any>("Entrar");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFail(false);
    setLoading(true);
    setButton(<CircularProgress style={{ color: partnerColor() }} />);
    try {
      const response = await axios.post(`${backDomain}/api/v1/studentlogin/`, {
        email,
        password,
      });
      const { token, loggedIn, notifications, whiteLabel } = response.data;
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("selectedStudentID");
      if (localStorage.getItem("authorization")) {
        localStorage.removeItem("authorization");
      }
      if (localStorage.getItem("loggedIn")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("selectedStudentID");
      }
      localStorage.setItem("authorization", `${token}`);
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      const subDomain = window.location.hostname.split(".")[0];
      await handleLoginSuccess(loggedIn, subDomain);
      setButton("Sucesso");
      window.location.assign("/");
    } catch (error) {
      setLoading(false);
      setFail(true);
      setButton("Entrar");
    }
  };

  useEffect(() => {
    const keysToDrop = [
      "loggedIn",
      "selectedStudentID",
      "authorization",
      "notifications",
      "voiceGender",
      "voiceLang",
      "voiceOption",
      "flashcardsToday",
      "lastFlashcardReviewed",
    ];
    keysToDrop.forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        background: "linear-gradient(180deg, #101721 60%, #fff 40%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      <Helmets text={"Login"} />
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          padding: "40px 32px 32px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={logoPartner()}
          alt="arvin logo"
          style={{
            height: "64px",
            width: "auto",
            marginBottom: "24px",
            objectFit: "contain",
          }}
        />
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
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
                "& fieldset": { borderColor: partnerColor() },
                "&:hover fieldset": { borderColor: partnerColor() },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
              },
              "& label": { color: "#101721" },
              "& label.Mui-focused": { color: partnerColor() },
            }}
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: partnerColor() },
                "&:hover fieldset": { borderColor: partnerColor() },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
              },
              "& label": { color: "#101721" },
              "& label.Mui-focused": { color: partnerColor() },
            }}
          />
          <button
            type="submit"
            style={{
              background: partnerColor(),
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              padding: "14px 0",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "-2%",
              width: "100%",
              marginTop: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(237,89,20,0.10)",
              transition: "all 0.2s",
            }}
            disabled={loading}
          >
            {button}
          </button>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: "18px",
            gap: "8px",
          }}
        >
          <NavLink
            style={{
              padding: "10px 18px",
              backgroundColor: "#f3f5f7",
              color: "#101721",
              fontSize: "13px",
              textDecoration: "none",
              borderRadius: "30px",
              border: "none",
              fontWeight: 600,
              maxWidth: "fit-content",
            }}
            to="/request-reset-password"
          >
            Esqueci minha senha
          </NavLink>
          {(isArvin || isLocalHost) && (
            <NavLink
              style={{
                padding: "10px 18px",
                backgroundColor: "#f3f5f7",
                color: "#101721",
                fontSize: "13px",
                textDecoration: "none",
                borderRadius: "30px",
                border: "none",
                fontWeight: 600,
                maxWidth: "fit-content",
              }}
              to={"/lp"}
            >
              Cadastre-se
            </NavLink>
          )}
        </div>
        <Alert
          style={{
            maxWidth: "20rem",
            margin: "24px auto 0 auto",
            display: fail ? "block" : "none",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
          severity="error"
        >
          Credenciais inválidas!
        </Alert>
      </div>
    </div>
  );
}

export default LoginComponent;
