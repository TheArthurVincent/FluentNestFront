import React, { useState } from "react";
import { HOne } from "../../../../Resources/Components/RouteBox";
import axios from "axios";
import {
  backDomain,
  isValidCPF,
} from "../../../../Resources/UniversalComponents";
import { CircularProgress, TextField } from "@mui/material";
import FindStudent from "./FindStudent";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";
import { notifyError } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function AllStudents({ headers, id }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    dateOfBirth: new Date(),
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [upload, setUpload] = useState(true);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      dateOfBirth: new Date(),
      cpf: "",
      password: "",
      confirmPassword: "",
    });
    setUpload((prev) => !prev);
    notifyError("Usuário cadastrado com sucesso!", "green");
  };

  const validateForm = () => {
    const { name, lastname, email, password, cpf, confirmPassword } = formData;
    if (!name || !lastname || !email || !password || !confirmPassword) {
      notifyError("Preencha todos os campos obrigatórios!", "red");
      return false;
    }

    const isValid = isValidCPF(cpf)
    if (!isValid) {
      notifyError("CPF inválido!", "red");
      return false;
    }

    if (password !== confirmPassword) {
      notifyError("As senhas não coincidem!", "red");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const newStudent = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      doc: formData.cpf,
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      await axios.post(
        `${backDomain}/api/v1/newstudentbyteacher/${id}`,
        newStudent,
        { headers }
      );
      resetForm();
    } catch (error) {
      console.error(error);
      notifyError("Erro ao cadastrar aluno: " + error.message, "red");
    } finally {
      setIsLoading(false);
    }
  };

  const formContainerStyle = {
    margin: "2rem",
    flexDirection: "column",
    display: "flex",
    gap: "1rem",
  };

  return (
    <>
      <FindStudent id={id} uploadStatus={upload} headers={headers} />
      {/* //new student */}
      <div style={formContainerStyle}>
        <h1
          style={{
            fontFamily: textTitleFont(),
            color: partnerColor(),
            fontSize: "1.8rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Novo Aluno
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr",
          }}
        >
          {[
            { label: "Nome", type: "text", key: "name" },
            { label: "Sobrenome", type: "text", key: "lastname" },
            { label: "E-mail", type: "email", key: "email" },
            { label: "Data de Nascimento", type: "date", key: "dateOfBirth" },
            {
              label: "CPF",
              type: "number",
              key: "cpf",
              inputProps: { maxLength: 11 },
            },
            { label: "Senha", type: "password", key: "password" },
            {
              label: "Confirme a Senha",
              type: "password",
              key: "confirmPassword",
            },
          ].map(({ label, inputProps, type, key }) => (
            <TextField
              key={key}
              label={label}
              type={type}
              fullWidth
              variant="outlined"
              value={formData[key]}
              onChange={handleChange(key)}
              InputLabelProps={type === "date" ? { shrink: true } : {}}
              inputProps={inputProps ? inputProps : {}}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: partnerColor() },
                  "&:hover fieldset": { borderColor: partnerColor() },
                  "&.Mui-focused fieldset": {
                    borderColor: partnerColor(),
                  },
                },
                "& label": { color: partnerColor() },
                "& label.Mui-focused": { color: partnerColor() },
              }}
              variant="outlined"
            />
          ))}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: partnerColor(),
              color: "#fff",
              padding: "12px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} style={{ color: "#fff" }} />
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default AllStudents;
