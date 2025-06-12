import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { backDomain, LogoSVG } from "../../Resources/UniversalComponents";
import { HOne, HTwo } from "../../Resources/Components/RouteBox";
import { notifyError } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import {
  primaryColor,
  secondaryColor,
  secondaryColor2,
} from "../../Styles/Styles";
import { HThree } from "../MyClasses/MyClasses.Styled";
import { TextField, Grid, CircularProgress } from "@mui/material";

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

export default function Cadastro() {
  const [form, setForm] = useState({
    name: "",
    promoCode: "",
    lastname: "",
    username: "",
    phoneNumber: "",
    doc: "",
    email: "",
    dateOfBirth: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    addressNumber: "",
    zip: "",
    password: "",
    confirmPassword: "",
    creditCardNumber: "",
    creditCardHolderName: "",
    creditCardExpiryMonth: "",
    creditCardExpiryYear: "",
    creditCardCcv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "PIX">(
    "CREDIT_CARD"
  );
  const [installments, setInstallments] = useState(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [usernameEdited, setUsernameEdited] = useState<string>("");

  useEffect(() => {
    if (
      form.name &&
      form.lastname &&
      form.dateOfBirth &&
      form.username.trim() === "" &&
      usernameEdited.trim() === ""
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
      const response = await axios.post(`${backDomain}/api/v1/cadastro`, {
        ...form,
        planType: selectedPlan,
        paymentMethod,
        installments:
          selectedPlan === "yearly" && paymentMethod === "CREDIT_CARD"
            ? installments
            : 1,
      });

      if (paymentMethod === "PIX") {
        window.location.assign("/feenotuptodate"); // ✅ página personalizada
        return;
      }

      notifyError(`Pagamento aprovado!`, "green");
      setTimeout(() => {
        window.location.assign("/verify-email");
      }, 1000);
    } catch (err: any) {
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
      notifyError(err.response?.data?.message || "Tente novamente");
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
      padding: "10px",
    },
    planContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      justifyContent: "center",
    },
    planCard: {
      flex: 1,
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#fafafa",
    },
    form: {
      display: "flex",
      gap: "5px",
      flexDirection: "column",
      width: "100%",
      maxWidth: "900px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "5px",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: " 1fr",
      gap: "5px",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "5px",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    input: {
      marginBottom: "10px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      marginLeft: "auto",
      padding: "10px",
      fontSize: "16px",
      backgroundColor: secondaryColor(),
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      marginTop: "20px",
      textDecoration: "none",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    responsiveGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "5px",
    },
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = form.zip.replace(/\D/g, "");
      if (cleanCep.length !== 8) return;

      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );

        if (response.data.erro) {
          notifyError("CEP não encontrado.");
          return;
        }

        const { logradouro, bairro, localidade, uf } = response.data;

        setForm((prev) => ({
          ...prev,
          address: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
        }));
      } catch (error) {
        notifyError("Erro ao buscar endereço.");
        console.error("Erro ViaCEP:", error);
      }
    };

    fetchAddress();
  }, [form.zip]);
  const myLogo = LogoSVG(primaryColor(), secondaryColor(), 3);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const planCardBase = {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const selectedStyle = {
    border: `2px solid ${secondaryColor()}`,
    backgroundColor: secondaryColor2(),
  };

  const unselectedStyle = {
    border: "1px solid #ccc",
    backgroundColor: "#fafafa",
  };

  const isSelected = (plan: string) =>
    selectedPlan === plan
      ? {
          border: `2px solid ${secondaryColor()}`,
          backgroundColor: secondaryColor2(),
        }
      : {
          border: "1px solid #ccc",
        };
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          {/* 📌 COLUNA 1 - DADOS PESSOAIS */}
          <div style={styles.column}>
            <a
              style={styles.button}
              href="https://portal.arthurvincent.com.br/"
              target="_blank"
            >
              Já sou aluno
            </a>
            <span style={{ margin: "auto" }}>{myLogo}</span>
            <HTwo>Dados Pessoais</HTwo>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sobrenome"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
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

              <Grid item xs={12}>
                <TextField
                  label="E-mail"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
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
              <Grid item xs={12}>
                <TextField
                  label="Código de recomentação (opcional)"
                  name="promoCode"
                  type="promoCode"
                  value={form.promoCode}
                  onChange={handleChange}
                  required={false}
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

              <Grid item xs={12}>
                <TextField
                  label="Número de telefone com DDD"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
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
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="CPF ou CNPJ"
                  name="doc"
                  value={form.doc}
                  onChange={handleChange}
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

              <Grid item xs={12}>
                <TextField
                  label="Data de nascimento"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
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
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nome de usuário"
                  name="username"
                  value={form.username}
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
                  InputProps={{
                    readOnly: true,
                    style: { backgroundColor: "#f0f0f0", color: "#555" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Senha"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
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

              <Grid item xs={12}>
                <TextField
                  label="Confirme sua senha"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
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
            </Grid>
          </div>
        </div>

        {/* 📌 COLUNA 2 - ENDEREÇO */}
        <div style={styles.grid}>
          <div style={styles.column}>
            <HTwo>Plano</HTwo>
            {/* Plan Selection Cards */}
            <div style={styles.planContainer}>
              <div
                style={{ ...styles.planCard, ...isSelected("monthly") }}
                onClick={() => {
                  handlePlanSelect("monthly");
                  setPaymentMethod("CREDIT_CARD");
                }}
              >
                <HThree>89,99/mês</HThree>
              </div>
              <div
                style={{ ...styles.planCard, ...isSelected("yearly") }}
                onClick={() => handlePlanSelect("yearly")}
              >
                <HThree>749,99/ano</HThree>
              </div>
            </div>
            {selectedPlan === "yearly" && (
              <>
                <HTwo>Método de Pagamento</HTwo>
                <div style={styles.planContainer}>
                  <div
                    //@ts-ignore
                    style={{
                      ...planCardBase,
                      ...(paymentMethod === "CREDIT_CARD"
                        ? selectedStyle
                        : unselectedStyle),
                    }}
                    onClick={() => setPaymentMethod("CREDIT_CARD")}
                  >
                    <HThree>Cartão (parcelável)</HThree>
                  </div>
                  <div
                    //@ts-ignore
                    style={{
                      ...planCardBase,
                      ...(paymentMethod === "PIX"
                        ? selectedStyle
                        : unselectedStyle),
                    }}
                    onClick={() => setPaymentMethod("PIX")}
                  >
                    <HThree>Pix à vista</HThree>
                  </div>
                </div>
              </>
            )}

            {selectedPlan === "yearly" && paymentMethod === "CREDIT_CARD" && (
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="installments">Parcelas:</label>
                <input
                  type="number"
                  id="installments"
                  name="installments"
                  value={installments}
                  onChange={(e) =>
                    setInstallments(
                      Math.min(Math.max(Number(e.target.value), 1), 12)
                    )
                  }
                  min={1}
                  max={12}
                  style={styles.input}
                />
                <p
                  style={{ fontSize: "14px", color: "#333", marginTop: "5px" }}
                >
                  {installments}x de{" "}
                  <strong>
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(749.99 / installments)}
                  </strong>
                </p>
              </div>
            )}

            {paymentMethod === "CREDIT_CARD" && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Número do Cartão"
                    name="creditCardNumber"
                    value={form.creditCardNumber}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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
                    inputProps={{ maxLength: 19, inputMode: "numeric" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Nome Impresso no Cartão"
                    name="creditCardHolderName"
                    value={form.creditCardHolderName}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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

                <Grid item xs={6}>
                  <TextField
                    label="Mês de Expiração (MM)"
                    name="creditCardExpiryMonth"
                    value={form.creditCardExpiryMonth}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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
                    inputProps={{ maxLength: 2, inputMode: "numeric" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Ano de Expiração (AAAA)"
                    name="creditCardExpiryYear"
                    value={form.creditCardExpiryYear}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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
                    inputProps={{ maxLength: 4, inputMode: "numeric" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="CVV"
                    name="creditCardCcv"
                    value={form.creditCardCcv}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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
                    inputProps={{ maxLength: 4, inputMode: "numeric" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="CEP"
                    name="zip"
                    value={form.zip}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 8) {
                        setForm({ ...form, zip: value });
                      }
                    }}
                    required={paymentMethod === "CREDIT_CARD"}
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
                    inputProps={{ maxLength: 8, inputMode: "numeric" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Rua"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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

                <Grid item xs={6}>
                  <TextField
                    label="Número"
                    name="addressNumber"
                    value={form.addressNumber}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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

                <Grid item xs={6}>
                  <TextField
                    label="Bairro"
                    name="neighborhood"
                    value={form.neighborhood}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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

                <Grid item xs={6}>
                  <TextField
                    label="Cidade"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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

                <Grid item xs={6}>
                  <TextField
                    label="Estado (UF)"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required={paymentMethod === "CREDIT_CARD"}
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
              </Grid>
            )}
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? <CircularProgress /> : "Cadastrar"}
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
