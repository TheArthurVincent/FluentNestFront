import React, { useState } from "react";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import axios from "axios";
import { backDomain } from "../../Resources/UniversalComponents";
import { myLogoDone } from "../NewStudentAsaas/EmailCheck";
import { Alert, Box, Grid, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";
import { primaryColor, secondaryColor, textGeneralFont } from "../../Styles/Styles";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import Helmets from "../../Resources/Helmets";

export function SendMail() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`${backDomain}/api/v1/sendmaillead`, {
        name,
        email,
        lastname: "Lead Mail",
        phoneNumber: "123",
      });
      setSuccess(true);
      setName("");
      setEmail("");
    } catch (err: any) {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteDiv>
      <Helmets text={"Peça seu conteúdo!"} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7",
        }}
      >
        <Box
          component="form"
          onSubmit={submitMail}
          sx={{
            p: { xs: 2, sm: 4 },
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
          className="box-shadow-white"
        >
          {myLogoDone}
          <TextField
            label="Nome"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: secondaryColor() },
                "&:hover fieldset": { borderColor: secondaryColor() },
                "&.Mui-focused fieldset": { borderColor: secondaryColor() },
              },
              "& label": { color: secondaryColor() },
              "& label.Mui-focused": { color: secondaryColor() },
            }}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: secondaryColor() },
                "&:hover fieldset": { borderColor: secondaryColor() },
                "&.Mui-focused fieldset": { borderColor: secondaryColor() },
              },
              "& label": { color: secondaryColor() },
              "& label.Mui-focused": { color: secondaryColor() },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <ArvinButton
              style={{
                marginLeft: "auto",
              }}
            >
              Receber material do vídeo!
            </ArvinButton>
            <br />
            <ArvinButton
              style={{
                marginLeft: "auto",
              }}
              onClick={() => {
                window.location.assign("/cadastre-se");
              }}
              disabled={loading}
            >
              {"Cadastrar-me na plataforma"}
            </ArvinButton>
          </Box>
          {success && <Alert severity="success">Enviado com sucesso!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
    </RouteDiv>
  );
}

export default SendMail;
