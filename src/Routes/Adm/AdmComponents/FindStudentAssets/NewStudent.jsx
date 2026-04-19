import React, { useState } from "react";
import axios from "axios";
import {
  backDomain,
  UpgradeGoldButton,
} from "../../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import FindStudent from "./FindStudent";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne } from "../../../../Resources/Components/RouteBox";

export function AllStudents({ headers, id, plan }) {
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
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/newteachersubscription/${id}`,
        newStudent,
        { headers }
      );
      resetForm();
      notifyAlert(
        `Usuário cadastrado com sucesso! ${response.data.message}`,
        "green"
      );
    } catch (error) {
      notifyAlert(
        `Erro ao cadastrar aluno ${formData.name}. ${error.response.data.message}`,
        partnerColor()
      );
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
    { label: "E-mail", type: "email", key: "email", required: true },
    { label: "Data de Nascimento", type: "date", key: "dateOfBirth" },
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
      {/* <FindStudent
        plan={plan}
        isResponsble={false}
        id={id}
        uploadStatus={upload}
        headers={headers}
      /> */}
      <div
        style={{
          maxWidth: "90%",
          margin: "1rem auto",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        <h1>New Teacher</h1>
        <form className="grid-2-1" onSubmit={handleSubmit}>
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
                  handleChange(key)({ target: { value } });
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
          <div />
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
        {/* {goldVisible && <UpgradeGoldButton />} */}
      </div>
    </>
  );
}

export default AllStudents;
