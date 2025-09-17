import React, { useState } from "react";
import axios from "axios";
import {
  backDomain,
  isValidCPF,
  UpgradeGoldButton,
} from "../../../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../../Styles/Styles";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne } from "../../../../../Resources/Components/RouteBox";

export function NewResponsible({ headers, id, flag, setFlag }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    dateOfBirth: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [upload, setUpload] = useState(true);
  const [goldVisible, setGoldVisible] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      dateOfBirth: "",
      cpf: "",
      password: "",
      confirmPassword: "",
    });
    setUpload((prev) => !prev);
  };

  const validateForm = () => {
    const { name, lastname, email, password, cpf, confirmPassword } = formData;

    if (!name || !lastname || !email || !password || !confirmPassword) {
      notifyAlert("Preencha todos os campos obrigatórios!");
      return false;
    }

    if (!isValidCPF(cpf)) {
      notifyAlert("CPF inválido!");
      return false;
    }

    if (password !== confirmPassword) {
      notifyAlert("As senhas não coincidem!");
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
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      responsible: true,
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/responsible/${id}`,
        newStudent,
        { headers }
      );
      resetForm();
      notifyAlert(
        `Usuário cadastrado com sucesso! ${response.data.message}`,
        "green"
      );
      setFlag(!flag);
    } catch (error) {
      notifyAlert(error.response?.data?.message, partnerColor());
      setGoldVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const formFields = [
    { label: "Nome", type: "text", key: "name", required: true },
    { label: "Sobrenome", type: "text", key: "lastname", required: true },
    { label: "Telefone", type: "text", key: "phoneNumber", required: true },
    { label: "E-mail", type: "email", key: "email", required: true },
    { label: "Data de Nascimento", type: "date", key: "dateOfBirth" },
    { label: "CPF", type: "text", key: "cpf", required: true },
    { label: "Senha", type: "password", key: "password", required: true },
    {
      label: "Confirme a Senha",
      type: "password",
      key: "confirmPassword",
      required: true,
    },
  ];

  return (
    <>
      <div
        style={{
          maxWidth: "90%",
          margin: "1rem auto",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <HOne> Novo pai ou responsável</HOne>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {formFields.map(({ label, type, key, required }) => (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#555",
                }}
              >
                {label}{" "}
                {required && <span style={{ color: "#e74c3c" }}>*</span>}
              </label>
              <input
                type={type}
                value={formData[key]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (key === "cpf") {
                    value = value.replace(/\D/g, ""); // Remove tudo que não for número
                  }
                  handleChange(key)({ target: { value } });
                }}
                onPaste={(e) => {
                  if (key === "cpf") {
                    e.preventDefault();
                    const pasted = e.clipboardData
                      .getData("Text")
                      .replace(/\D/g, "");
                    handleChange(key)({ target: { value: pasted } });
                  }
                }}
                style={{
                  ...inputStyle,
                  borderColor: formData[key] ? partnerColor() : "#ddd",
                }}
                onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                onBlur={(e) =>
                  (e.target.style.borderColor = formData[key]
                    ? partnerColor()
                    : "#ddd")
                }
                maxLength={key === "cpf" ? 11 : undefined}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#ccc" : partnerColor(),
              color: "#fff",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} style={{ color: "#fff" }} />
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        {goldVisible && <UpgradeGoldButton />}
      </div>
    </>
  );
}

export default NewResponsible;
