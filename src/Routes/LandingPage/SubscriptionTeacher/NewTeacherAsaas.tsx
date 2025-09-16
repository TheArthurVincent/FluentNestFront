import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { backDomain } from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { IFrameAsaas } from "../../HomePage/Blog.Styled";
import { CircularProgress, Grid, TextField } from "@mui/material";
import silver from "./assets/teacherssilver.png";
import gold from "./assets/goldteacher.png";
import { HOne } from "../../../Resources/Components/RouteBox";
import { fontSize, fontWeight } from "@mui/system";

function formatDate(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 8); // Remove non-digits and limit to 8 characters
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];
    let formatted = day;
    if (month) formatted += "/" + month;
    if (year) formatted += "/" + year;
    return formatted;
  }
  return cleaned;
}
function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}.${match[3]}-${match[4]}`;
  }
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 3) return `(${cleaned.slice(0, 2)}) ${cleaned[2]}`;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)}.${cleaned.slice(
      3
    )}`;
  if (cleaned.length <= 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)}.${cleaned.slice(
      3,
      7
    )}-${cleaned.slice(7)}`;
  return value;
}

function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
    6,
    9
  )}-${cleaned.slice(9)}`;
}

export default function TeacherSubscription() {
  // const [form, setForm] = useState({
  //   name: "",
  //   promoCode: "",
  //   lastname: "",
  //   phoneNumber: "",
  //   doc: "",
  //   email: "",
  //   dateOfBirth: "",
  //   address: "",
  //   neighborhood: "",
  //   city: "",
  //   state: "",
  //   addressNumber: "",
  //   zip: "",
  //   password: "",
  //   confirmPassword: "",
  //   creditCardNumber: "",
  //   creditCardHolderName: "",
  //   creditCardExpiryMonth: "",
  //   creditCardExpiryYear: "",
  //   creditCardCcv: "",
  // });

  const [form, setForm] = useState({
    name: "Jonathan",
    lastname: "Michael Doe",
    promoCode: "63",
    phoneNumber: "11930303030",
    doc: "729.157.020-47",
    email: "nocidi4795@kwifa.com",
    dateOfBirth: "10/10/2025",
    address: "Rua Nelia",
    neighborhood: "Embu",
    city: "Embu das Artes",
    state: "SP",
    addressNumber: "63",
    zip: "06703794",
    password: "63456789",
    confirmPassword: "63456789",
    creditCardNumber: "5397 2566 6440 3902",
    creditCardHolderName: "John Doe",
    creditCardExpiryMonth: "01",
    creditCardExpiryYear: "2026",
    creditCardCcv: "420",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "PIX">(
    "CREDIT_CARD"
  );

  // novos estados
  const [planTier, setPlanTier] = useState<"silver" | "gold">("silver");

  // preços centralizados
  const PRICES = {
    silver: { monthly: 89.99, yearly: 899.99 },
    gold: { monthly: 149.99, yearly: 1499.99 }, // ajuste aqui se o Gold tiver preço diferente
  };

  // helpers
  const monthlyPrice = PRICES[planTier].monthly;
  const yearlyPrice = PRICES[planTier].yearly;

  const formatBRL = (v: number) =>
    Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      v
    );

  const [installments, setInstallments] = useState(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const formattedPhone = formatPhoneNumber(value);
      setForm((prev) => ({ ...prev, [name]: formattedPhone }));
    } else if (name === "doc") {
      const formattedDoc = formatCPF(value);
      setForm((prev) => ({ ...prev, [name]: formattedDoc }));
    } else if (name === "dateOfBirth") {
      const formattedDate = formatDate(value);
      setForm((prev) => ({ ...prev, [name]: formattedDate }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      setError("As senhas não coincidem.");
      notifyAlert("As senhas não coincidem.", "red");
      return;
    }

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/cadastro-teacher`,
        {
          ...form,
          planType: selectedPlan,
          paymentMethod,
          planTier,
          installments:
            selectedPlan === "yearly" && paymentMethod === "CREDIT_CARD"
              ? installments
              : 1,
        }
      );

      if (paymentMethod === "PIX") {
        window.location.assign("/feenotuptodate");
        return;
      }

      notifyAlert(`Pagamento aprovado!`, "green");
      setTimeout(() => {
        window.location.assign("/verify-email");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message);
      notifyAlert(err.response?.data?.message || "Tente novamente");
      console.log(err.response?.data?.message || "Tente novamente");
    } finally {
      setLoading(false);
    }
  };

  const styles: any = {
    cardBase: {
      position: "relative",
      borderRadius: 14,
      padding: 16,
      boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
      transition:
        "transform .18s ease, box-shadow .18s ease, border-color .18s",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      minHeight: 190,
      userSelect: "none",
      outline: "none",
    },
    cardSelected: {
      border: "1px solid #ed5914",
      boxShadow: "0 10px 22px #ff510048",
    },
    img: {
      width: 150,
      height: 150,
      objectFit: "contain",
    },
    price: {
      fontSize: 16,
      color: "#475569",
      marginTop: 6,
    },
    badge: {
      position: "absolute",
      top: 10,
      right: 10,
      fontSize: 11,
      background: "#ed5914",
      color: "#fff",
      borderRadius: "10px",
      padding: "4px 8px",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    },
    planContainer: {
      display: "grid",
      gap: "20px",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      justifyContent: "center",
      marginBottom: "20px",
    },
    planContainer2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 16,
      alignItems: "stretch",
    },
    planCard: {
      flex: 1,
      padding: "20px",
      borderRadius: "5px",
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
      backgroundColor: "#ed5914",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      marginTop: "20px",
      textDecoration: "none",
    },
    error: {
      color: "red",
      fontSize: 20,
      fontWeight: "600",
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
          notifyAlert("CEP não encontrado.");
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
        notifyAlert("Erro ao buscar endereço.");
        console.error("Erro ViaCEP:", error);
      }
    };

    fetchAddress();
  }, [form.zip]);
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
    border: `2px solid #ed5914`,
    backgroundColor: "#ed5914",
    color: "#fff",
  };

  const unselectedStyle = {
    border: "1px solid #ccc",
    backgroundColor: "#fafafa",
  };

  const isSelected = (plan: string) =>
    selectedPlan === plan
      ? {
          border: `2px solid #ed5914`,
          color: "#fff",
          backgroundColor: "#ed5914",
        }
      : {
          border: "1px solid #ccc",
        };

  type PlanCardProps = {
    tier: "silver" | "gold";
    title: string;
    imgSrc: string;
    monthly: number;
    yearly: number;
    bgColor: string;
    selected: boolean;
    features: any;
    onSelect: () => void;
  };

  const FEATURES: Record<
    "silver" | "gold",
    { title: string; value: string | number; status?: string | number }[]
  > = {
    silver: [
      { title: "Limite de alunos", value: 30 },
      { title: "Aulas prontas para lecionar", value: "", status: "Sim" },
      { title: "Gerenciamento de alunos", value: "", status: "Sim" },
      {
        title: "Curso para professores particulares",
        value: "",
        status: "Sim",
      },
      { title: "Limite de revisão de flashcards/dia", value: 25 },
      { title: "Área de responsáveis", value: "", status: "Não" },
      // { title: "Mineração de sentenças (você e alunos)", value: "5 ao todo" },
      // { title: "Listening exercise", value: "", status: "Não" },
      // { title: "Cadastro de subteachers", value: "", status: "Não" },
      { title: "Emissão de contratos", value: "", status: "Não" },
      {
        title: "Personalização Visual da Plataforma",
        value: "",
        status: "Não",
      },
      { title: "Emissão de recibos", value: "", status: "Não" },
      { title: "Assistente de IA", value: "20 tokens/mês" },
    ],
    gold: [
      { title: "Limite de alunos", value: "Sem limites" },
      { title: "Aulas prontas para lecionar", value: "", status: "Sim" },
      { title: "Gerenciamento de alunos", value: "", status: "Sim" },
      {
        title: "Curso para professores particulares",
        value: "",
        status: "Sim",
      },
      { title: "Limite de revisão de flashcards/dia", value: "Sem limites" },
      { title: "Área de responsáveis", value: "", status: "Sim" },
      // { title: "Mineração de sentenças (você e alunos)", value: "30/mês" },
      // { title: "Listening exercise", value: "", status: "Sim" },
      // { title: "Cadastro de subteachers", value: "", status: "Sim" },
      { title: "Emissão de contratos", value: "", status: "Sim" },
      {
        title: "Personalização Visual da Plataforma",
        value: "",
        status: "Sim",
      },
      { title: "Emissão de recibos", value: "", status: "Sim" },
      { title: "Assistente de IA", value: "1.000 tokens/mês" },
    ],
  };

  function PlanCard({
    tier,
    title,
    imgSrc,
    monthly,
    yearly,
    selected,
    bgColor,
    onSelect,
    features,
  }: PlanCardProps) {
    const [hovered, setHovered] = React.useState(false);
    return (
      <div
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.cardBase,
          ...(selected ? styles.cardSelected : {}),
          transform:
            hovered && !selected ? "translateY(-2px)" : "translateY(0)",
          borderColor:
            hovered && !selected ? "#cbd5e1" : selected ? "#ed5914" : "#e5e7eb",
          background: bgColor,
        }}
      >
        {selected && <span style={styles.badge}>Selecionado</span>}
        <p>{title}</p>
        <img src={imgSrc} alt={`${title} Plan`} style={{ ...styles.img }} />
        <ul
          style={{
            textAlign: "center",
            listStyleType: "none",
            padding: 0,
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {Array.isArray(features) &&
            features.map((feat, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: 6,
                  padding: "2px 10px",
                  borderRadius: "5px",
                  listStyleType: "none",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong>{feat.title}</strong>
                <br />
                <div>
                  {feat.value && (
                    <span
                      style={{
                        fontStyle: "italic",
                      }}
                    >
                      {feat.value}{" "}
                    </span>
                  )}
                  <span
                    style={{
                      color: feat.status === "Sim" ? "green" : "red",
                      fontWeight: 600,
                    }}
                  >
                    {feat.status &&
                      (feat.status === "Sim" ? "✔ Sim" : " ✘ Não")}
                  </span>
                </div>
              </li>
            ))}
        </ul>
        <div style={styles.price}>
          {formatBRL(monthly)}/mês • {formatBRL(yearly)}/ano em até 6x
        </div>
      </div>
    );
  }

  const getWhatsAppLink = () => {
    const message = `Olá, gostaria de fazer o pagamento da plataforma Arvin no plano ${selectedPlan} Gold à vista via PIX.`;
    return `https://wa.me/5511972369299?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.column}>
          <h1
            style={{
              fontFamily: "Teko, sans-serif",
              fontSize: "32px",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            Cadastre-se
          </h1>
          {/* <IFrameAsaas src="https://www.youtube.com/embed/qUiHhLsyiIw" /> */}
          {/* <h2>Plano</h2> */}
          <div
            style={styles.planContainer}
            role="radiogroup"
            aria-label="Seleção de planos"
          >
            <PlanCard
              tier="silver"
              title="Silver"
              bgColor="#c0c0c055"
              imgSrc={silver}
              monthly={PRICES.silver.monthly}
              yearly={PRICES.silver.yearly}
              selected={planTier === "silver"}
              features={FEATURES.silver} // <-- aqui
              onSelect={() => setPlanTier("silver")}
            />

            <PlanCard
              bgColor="#ffd90064"
              tier="gold"
              title="Gold"
              imgSrc={gold}
              monthly={PRICES.gold.monthly}
              yearly={PRICES.gold.yearly}
              selected={planTier === "gold"}
              features={FEATURES.gold} // <-- aqui
              onSelect={() => setPlanTier("gold")}
            />
          </div>
          <h2>Período</h2>
          <div style={styles.planContainer}>
            <div
              style={{ ...styles.planCard, ...isSelected("monthly") }}
              onClick={() => {
                handlePlanSelect("monthly");
                setPaymentMethod("CREDIT_CARD"); // mantém sua lógica
              }}
            >
              <p>{formatBRL(monthlyPrice)}/mês</p>
            </div>

            <div
              style={{ ...styles.planCard, ...isSelected("yearly") }}
              onClick={() => handlePlanSelect("yearly")}
            >
              <p>{formatBRL(yearlyPrice)}/ano em até 6x</p>
            </div>
          </div>
          <>
            {selectedPlan === "yearly" && (
              <>
                <h2>Método de Pagamento</h2>
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
                    <p>Cartão (parcelável)</p>
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
                    <p>Pix à vista</p>
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
                      Math.min(Math.max(Number(e.target.value), 1), 6)
                    )
                  }
                  min={1}
                  max={6}
                  style={styles.input}
                />
                <p
                  style={{ fontSize: "14px", color: "#333", marginTop: "5px" }}
                >
                  {installments}x de{" "}
                  <strong>{formatBRL(yearlyPrice / installments)}</strong>
                </p>
              </div>
            )}

            {paymentMethod === "CREDIT_CARD" && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Nome"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <TextField
                    label="Sobrenome"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <TextField
                    label="E-mail"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                    inputProps={{ inputMode: "email" }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <TextField
                    label="Data de Nascimento (DD/MM/AAAA)"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ maxLength: 10, inputMode: "numeric" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <TextField
                    label="CPF"
                    name="doc"
                    value={form.doc}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ maxLength: 15, inputMode: "numeric" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                    inputProps={{ maxLength: 19, inputMode: "numeric" }}
                  />
                </Grid>
                <Grid item xs={6}>
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                    inputProps={{ maxLength: 8, inputMode: "numeric" }}
                  />
                </Grid>
                <Grid item xs={6}>
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
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
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>
                <br />
                <Grid item xs={6}>
                  <TextField
                    label="Senha (mínimo 8 caracteres)"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    type="password"
                    inputProps={{ maxLength: 15 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <TextField
                    label="Confirme sua Senha (mínimo 8 caracteres)"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    type="password"
                    inputProps={{ maxLength: 15 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ed5914", // cor normal
                        },
                        "&:hover fieldset": {
                          borderColor: "#ed5914", // ao passar o mouse
                        },
                        "&.Mui-focused fieldset": {
                          color: "#ed5914", // quando focado
                          borderColor: "#ed5914", // quando focado
                        },
                        "& label": {
                          color: "#ed5914", // cor padrão do label
                        },
                        "& label.Mui-focused": {
                          color: "#ed5914", // cor quando o label está flutuando
                        },
                      },
                    }}
                  />
                </Grid>{" "}
              </Grid>
            )}

            {paymentMethod === "PIX" && (
              <div
                style={{
                  padding: "3rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <span
                  onClick={() => {
                    window.location.assign(getWhatsAppLink());
                  }}
                  style={{
                    backgroundColor: "#25D366",
                    color: "white",
                    padding: "12px 18px",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  Para fazer o pagamento à vista, fale com nossa equipe por
                  WhatsApp!
                </span>
              </div>
            )}
            {paymentMethod !== "PIX" && (
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? (
                  <CircularProgress style={{ color: "#ed5914" }} />
                ) : (
                  "Cadastrar"
                )}
              </button>
            )}
          </>
          {/* <div
            style={{
              padding: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <button
              onClick={() => window.location.assign(getWhatsAppLink())}
              style={{
                backgroundColor: "#25D366",
                color: "white",
                padding: "12px 18px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              Fale com nossa equipe por WhatsApp!
            </button>
          </div> */}
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </form>
    </div>
  );
}
