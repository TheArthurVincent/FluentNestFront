import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { backDomain } from "../../Resources/UniversalComponents";
import { HOne, HTwo } from "../../Resources/Components/RouteBox";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor, textTitleFont } from "../../Styles/Styles";

export const generateUsername = (
  name: string,
  lastname: string,
  dateOfBirth: string
) => {
  const sanitize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

  const first = sanitize(name);
  const last = sanitize(lastname).slice(0, 3);
  const year = dateOfBirth ? new Date(dateOfBirth).getDate() : "";
  const month = dateOfBirth ? new Date(dateOfBirth).getFullYear() : "";

  return `${first}${year}${last}${month}`;
};

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    phoneNumber: "",
    doc: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const response = await axios.post(`${backDomain}/api/v1/studentlogin/`, {
        email: form.email,
        password: form.password,
      });
      const { token, loggedIn, notifications } = response.data;
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
      window.location.assign("/");
    } catch (error) {
      window.location.assign("/login");
    }
  };
  const [usernameEdited, setUsernameEdited] = useState<string>("");

  useEffect(() => {
    if (
      form.name &&
      form.lastname &&
      form.dateOfBirth &&
      form.username.trim() === ""
    ) {
      const newUsername = generateUsername(
        form.name,
        form.lastname,
        form.dateOfBirth
      );
      setUsernameEdited(newUsername);
      setForm((prev) => ({ ...prev, username: newUsername }));
    }
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(`${backDomain}/api/v1/students`, form);

      notifyAlert(`Registrado!`, "green");

      setTimeout(() => {
        login();
      }, 1000);
    } catch (err: any) {
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
      const errorMessage = err.response
        ? err.response.data.message
        : "Tente novamente";
      notifyAlert(errorMessage);
      console.log(errorMessage, err);
    } finally {
      setLoading(false);
    }
  };

  const styles: any = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    form: {
      display: "flex",
      gap: "10px",
      flexDirection: "column",
      width: "100%",
      maxWidth: "900px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "6px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    input: {
      marginBottom: "10px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      marginTop: "20px",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    responsiveGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
  };

  const [booleanLeadsCapture, setLeadsCapture] = useState<boolean>(true);
  const leadsCapture = async () => {
    if (
      booleanLeadsCapture &&
      form.name !== "" &&
      form.lastname !== "" &&
      form.phoneNumber !== "" &&
      form.email !== ""
    ) {
      try {
        const theContent = {
          name: form.name,
          lastname: form.lastname,
          phoneNumber: form.phoneNumber,
          email: form.email,
        };
        const response = await axios.post(
          `${backDomain}/api/v1/leads`,
          theContent
        );
        setLeadsCapture(false);
      } catch (error) {
        console.error("Erro ao capturar lead", error);
      }
    }
  };

  useEffect(() => {
    const allFilled =
      form.name.trim() !== "" &&
      form.lastname.trim() !== "" &&
      form.phoneNumber.trim().length >= 11 &&
      form.email.trim().includes("@");

    if (booleanLeadsCapture && allFilled) {
      leadsCapture();
    }
  }, [form.name, form.lastname, form.phoneNumber, form.email]);

  return (
    <div style={styles.container}>
      <HOne>Cadastro</HOne>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          {/* 📌 COLUNA 1 - DADOS PESSOAIS */}
          <div style={styles.column}>
            <HTwo>Dados Pessoais</HTwo>
            <div style={styles.grid2}>
              <input
                type="text"
                name="name"
                placeholder="Nome"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="lastname"
                placeholder="Sobrenome"
                value={form.lastname}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="number"
                name="phoneNumber"
                placeholder="Número de telefone com DDD"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="doc"
                placeholder="CPF ou CNPJ"
                value={form.doc}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="date"
                name="dateOfBirth"
                placeholder="Data de nascimento"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="username"
                placeholder="Nome de usuário (Gerado automaticamente)"
                value={form.username}
                readOnly
                style={{
                  ...styles.input,
                  backgroundColor: "#f0f0f0",
                  color: "#555",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
