import React, { useState } from "react";
import { primaryColor, secondaryColor, textFont } from "../../Styles/Styles";
import {
  InputField,
  LogoSVG,
  backDomain,
} from "../../Resources/UniversalComponents";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import Helmets from "../../Resources/Helmets";
import { NavLink } from "react-router-dom";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";

export function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fail, setFail] = useState<boolean>(false);
  const [button, setButton] = useState<any>("Entrar");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFail(false);

    setButton(<CircularProgress style={{ color: secondaryColor() }} />);

    try {
      const response = await axios.post(`${backDomain}/api/v1/studentlogin/`, {
        email,
        password,
      });
      const { token, loggedIn, notifications } = response.data;
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
      setButton("Sucesso");
      window.location.assign("/");
    } catch (error) {
      setFail(true);
      setButton("Entrar");
    }
  };

  const myLogo = LogoSVG(primaryColor(), secondaryColor(), 2.5);

  const handleCheckout = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/create-plan`);
      const { checkoutUrl } = response.data;
      // window.location.href = checkoutUrl;
      console.log(checkoutUrl);
    } catch (e) {
      console.log(e);
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
              {myLogo}
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
                        "& fieldset": {
                          borderColor: secondaryColor(), // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: secondaryColor(), // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: secondaryColor(), // quando focado
                        },
                        "& label": {
                          color: secondaryColor(), // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: secondaryColor(), // cor quando o label está flutuando
                        },
                      },
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
                      "& fieldset": {
                        borderColor: secondaryColor(), // cor normal
                      },
                      "&:hover fieldset": {
                        borderColor: secondaryColor(), // ao passar o mouse
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: secondaryColor(), // quando focado
                      },
                      "& label": {
                        color: secondaryColor(), // cor padrão do label
                      },
                      "& label.Mui-focused": {
                        color: secondaryColor(), // cor quando o label está flutuando
                      },
                    },
                  }}
                />
              </Grid>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "right",
                }}
              >
                <ArvinButton
                  style={{
                    marginLeft: "auto",
                    marginBottom: "2rem",
                    backgroundColor: "#eee",
                    color: primaryColor(),
                  }}
                  type="submit"
                >
                  {button}
                </ArvinButton>
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
                    color: primaryColor(),
                    fontFamily: textFont(),
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
                    color: primaryColor(),
                    fontFamily: textFont(),
                    fontSize: "10px",
                    borderRadius: " 6px",
                    border: "none",
                    maxWidth: "fit-content",
                  }}
                  to="/signup"
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
