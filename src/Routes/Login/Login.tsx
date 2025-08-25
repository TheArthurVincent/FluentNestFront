import React, { useState } from "react";
import {
  logoPartner,
  partnerColor,
  textGeneralFont,
} from "../../Styles/Styles";
import { backDomain } from "../../Resources/UniversalComponents";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import { Alert, CircularProgress, Grid, TextField } from "@mui/material";
import Helmets from "../../Resources/Helmets";
import { NavLink } from "react-router-dom";
import { isArvin } from "../../App";

export function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fail, setFail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [button, setButton] = useState<any>("Entrar");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFail(false);
    setLoading(true);

    setButton(<CircularProgress style={{ color: "grey" }} />);

    try {
      const response = await axios.post(`${backDomain}/api/v1/studentlogin/`, {
        email,
        password,
      });
      const { token, loggedIn, notifications, whiteLabel } = response.data;
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");

      if (localStorage.getItem("authorization")) {
        localStorage.removeItem("authorization");
      }

      if (localStorage.getItem("loggedIn")) {
        localStorage.removeItem("loggedIn");
      }

      localStorage.setItem("authorization", `${token}`);
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      localStorage.setItem("whiteLabel", JSON.stringify(whiteLabel));

      setButton("Sucesso");
      window.location.assign("/");
      // window.location.reload();
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      setFail(true);
      setButton("Entrar");
    }
  };

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
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                padding: "5rem",
                backgroundColor: "#fff",
                maxWidth: "fit-content",
                margin: "auto",
                borderRadius: "6px",
              }}
              className="box-shadow-white"
            >
              {!loading && (
                <>
                  <img
                    src={logoPartner()}
                    alt="arvin logo"
                    style={{
                      margin: "auto",
                      height: "6rem",
                      width: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Grid item xs={12}>
                    <Grid item xs={12}>
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
                            "& fieldset": { borderColor: "#555" },
                            "&:hover fieldset": { borderColor: "#555" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#555",
                            },
                          },
                          "& label": { color: "#555" },
                          "& label.Mui-focused": { color: "#555" },
                        }}
                      />
                    </Grid>
                    <br />
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
                          "& fieldset": { borderColor: "#555" },
                          "&:hover fieldset": { borderColor: "#555" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#555",
                          },
                        },
                        "& label": { color: "#555" },
                        "& label.Mui-focused": { color: "#555" },
                      }}
                    />
                  </Grid>
                </>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "right",
                }}
              >
                <button
                  color={partnerColor()}
                  style={{
                    marginLeft: "auto",
                    marginBottom: "2rem",
                  }}
                  type="submit"
                >
                  {button}
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <NavLink
                  style={{
                    padding: "10px",
                    minWidth: "30px",
                    margin: "0 3px",
                    backgroundColor: "#eee",
                    color: "#000",
                    fontFamily: textGeneralFont(),
                    fontSize: "10px",
                    textDecoration: "none",
                    borderRadius: " 6px",
                    border: "none",
                    maxWidth: "fit-content",
                  }}
                  to="/request-reset-password"
                >
                  Esqueci minha senha
                </NavLink>
                <NavLink
                  style={{
                    padding: "10px",
                    minWidth: "30px",
                    textDecoration: "none",
                    margin: "0 3px",
                    backgroundColor: "#eee",
                    color: "#000",
                    fontFamily: textGeneralFont(),
                    fontSize: "10px",
                    borderRadius: " 6px",
                    border: "none",
                    maxWidth: "fit-content",
                  }}
                  to={isArvin ? "/" : "/signup"}
                >
                  Cadastre-se
                </NavLink>
              </div>
            </form>
            <Alert
              style={{
                maxWidth: "20rem",
                margin: "auto",
                display: fail ? "block" : "none",
              }}
              severity="error"
            >
              Credenciais inválidas!
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
