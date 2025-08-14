import React, { useState } from "react";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import axios from "axios";
import { backDomain } from "../../Resources/UniversalComponents";
import { myLogoDone } from "../NewStudentAsaas/EmailCheck";
import { Alert, TextField } from "@mui/material";
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7",
        }}
      >
        <form
          onSubmit={submitMail}
          style={{
            backgroundColor: "#fff",
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
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
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            <button
              style={{ marginLeft: "auto" }}
              type="submit"
              disabled={loading}
            >
              Receber material do vídeo!
            </button>
            <br />
            <button
              style={{ marginLeft: "auto" }}
              type="button"
              onClick={() => {
                window.location.assign("/cadastre-se");
              }}
              disabled={loading}
            >
              {"Cadastrar-me na plataforma"}
            </button>
          </div>
          {success && <Alert severity="success">Enviado com sucesso!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </form>
      </div>
    </RouteDiv>
  );
}

export default SendMail;
