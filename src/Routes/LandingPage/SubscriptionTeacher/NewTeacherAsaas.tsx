import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { backDomain } from "../../../Resources/UniversalComponents";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress, Grid, TextField } from "@mui/material";
import TermsAndConditions from "./assets/TermsAndConditions/TermsAndConditions";
import {
  planCardBase,
  selectedStyle,
  styles,
  unselectedStyle,
  formatDate,
  formatPhoneNumber,
  formatCPF,
  formatBRL,
  yearlyPrice,
  monthlyPrice,
  inputStyle,
  inputFields,
  requiredIfCC,
  getWhatsAppLink,
  TIER_META,
  FEATURES,
  FieldName,
  theTitle,
} from "./styles";

export default function TeacherSubscription() {
  // const [form, setForm] = useState({
  //   name: "Jonathan",
  //   lastname: "Michael Doe",
  //   promoCode: "63",
  //   phoneNumber: "11930303030",
  //   doc: "729.157.020-47",
  //   email: "nocidi4795@kwifa.com",
  //   dateOfBirth: "10/10/2025",
  //   address: "Rua Nelia",
  //   neighborhood: "Embu",
  //   city: "Embu das Artes",
  //   state: "SP",
  //   addressNumber: "63",
  //   zip: "06703794",
  //   password: "63456789",
  //   confirmPassword: "63456789",
  //   creditCardNumber: "5397 2566 6440 3902",
  //   creditCardHolderName: "John Doe",
  //   creditCardExpiryMonth: "01",
  //   creditCardExpiryYear: "2026",
  //   creditCardCcv: "420",
  // });

  const [termsValid, setTermsValid] = useState(false);
  const [termsMeta, setTermsMeta] = useState<{
    agreed: boolean;
    scrolledToEnd: boolean;
    signedAtISO: string | null;
    termsVersion: string;
    termsHash: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    promoCode: "",
    lastname: "",
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
  const [planTier, setPlanTier] = useState<"silver" | "gold">("gold");
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
    if (loading) return;

    setLoading(true);
    setError("");

    // ===== Helpers locais =====
    const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");
    const normalizeDOB = (s: string) => {
      // "DD/MM/AAAA" -> "AAAA-MM-DD"
      const m = (s || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      return m ? `${m[3]}-${m[2]}-${m[1]}` : s;
    };
    const isEmail = (s: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());

    const nowYear = new Date().getFullYear();

    // ===== Check Termos =====
    if (!termsValid) {
      const msg =
        "Você precisa ler e aceitar os Termos e Condições para continuar.";
      setError(msg);
      notifyAlert(msg, "red");
      setLoading(false);
      return;
    }

    // ===== Validações comuns =====
    if (!form?.name || !form?.lastname) {
      const msg = "Informe nome e sobrenome.";
      setError(msg);
      notifyAlert(msg, "red");
      setLoading(false);
      return;
    }

    if (!isEmail(form.email || "")) {
      const msg = "Informe um e-mail válido.";
      setError(msg);
      notifyAlert(msg, "red");
      setLoading(false);
      return;
    }

    if ((form.password || "").length < 8) {
      const msg = "A senha deve ter pelo menos 8 caracteres.";
      setError(msg);
      notifyAlert(msg, "red");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      const msg = "As senhas não coincidem.";
      setError(msg);
      notifyAlert(msg, "red");
      setLoading(false);
      return;
    }

    // ===== Validações específicas: Cartão =====
    if (paymentMethod === "CREDIT_CARD") {
      const ccNum = onlyDigits(form.creditCardNumber);
      const ccHolder = (form.creditCardHolderName || "").trim();
      const mm = (form.creditCardExpiryMonth || "").trim();
      const yy = Number((form.creditCardExpiryYear || "").trim());
      const cvv = onlyDigits(form.creditCardCcv);
      const zip = onlyDigits(form.zip);

      if (ccNum.length < 13 || ccNum.length > 19) {
        const msg = "Número do cartão inválido.";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (!ccHolder) {
        const msg = "Informe o nome impresso no cartão.";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (!/^(0[1-9]|1[0-2])$/.test(mm)) {
        const msg = "Mês de expiração inválido (use MM).";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (!Number.isInteger(yy) || yy < nowYear || yy > nowYear + 25) {
        const msg = "Ano de expiração inválido.";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (cvv.length < 3 || cvv.length > 4) {
        const msg = "CVV inválido.";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (zip.length !== 8) {
        const msg = "CEP inválido (8 dígitos).";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
      if (
        !form.address ||
        !form.neighborhood ||
        !form.city ||
        !form.state ||
        !form.addressNumber
      ) {
        const msg = "Endereço incompleto.";
        setError(msg);
        notifyAlert(msg, "red");
        setLoading(false);
        return;
      }
    }

    // ===== Parcelas seguras =====
    const safeInstallments =
      selectedPlan === "yearly" && paymentMethod === "CREDIT_CARD"
        ? Math.min(Math.max(Number(installments || 1), 1), 6)
        : 1;

    // ===== Normalizações antes do envio =====
    const payload = {
      ...form,
      doc: onlyDigits(form.doc || ""), // CPF
      phoneNumber: onlyDigits(form.phoneNumber || ""),
      zip: onlyDigits(form.zip || ""),
      dateOfBirth: normalizeDOB(form.dateOfBirth || ""),
      planType: selectedPlan as "monthly" | "yearly",
      paymentMethod, // "CREDIT_CARD" | "PIX"
      planTier, // "silver" | "gold"
      installments: safeInstallments,
      termsConsent: termsMeta ?? undefined, // {agreed, scrolledToEnd, signedAtISO, termsVersion, termsHash}
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/cadastro-teacher`,
        payload
      );
      console.log(response.data);
      if (paymentMethod === "PIX") {
        // Via PIX (fluxo fora do submit na sua UI, mas deixamos seguro)
        window.location.assign("/feenotuptodate");
        return;
      }
      // Cartão aprovado
      notifyAlert("Pagamento aprovado!", "green");
      setTimeout(() => {
        window.location.assign("/verify-email");
      }, 1000);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Tente novamente";
      setError(apiMessage);
      notifyAlert(apiMessage, "red");
      console.error(apiMessage);
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.column}>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              flex: 2,
            }}
          >
            <article
              style={{
                maxWidth: "600px",
                flex: 1,
                minWidth: "300px",
              }}
            >
              <h1 style={theTitle}>Cadastre-se</h1>
              <div
                style={styles.planButtonsRow}
                role="radiogroup"
                aria-label="Seleção de planos"
              >
                {(["silver", "gold"] as const).map((tier) => {
                  const meta = TIER_META[tier];
                  const selected = planTier === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPlanTier(tier)}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        setPlanTier(tier)
                      }
                      style={{
                        ...styles.tierButtonMinimal,
                        ...(selected ? styles.cardSelected : {}),
                        borderColor: selected ? "#ed5914" : "#e5e7eb",
                        backgroundColor: meta.bg,
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {selected && (
                        <span
                          style={{
                            backgroundColor: "#ed5914",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          Selecionado
                        </span>
                      )}
                      <span>
                        <img
                          src={meta.img}
                          alt={`${meta.title} Plan`}
                          style={{
                            ...styles.img,
                            pointerEvents: "none",
                          }}
                        />
                        <div style={styles.tierTitle}>{meta.title}</div>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div style={styles.detailsPanel}>
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    fontSize: 25,
                    color: "#111827",
                    textAlign: "center",
                  }}
                >
                  {TIER_META[planTier].title}
                  <span
                    style={{
                      fontWeight: "normal",
                    }}
                  >
                    {" "}
                    | {formatBRL(TIER_META[planTier].price / 10)}/mês •{" "}
                    {formatBRL(TIER_META[planTier].price)}/ano
                  </span>
                </h2>
                <ul
                  style={{
                    textAlign: "center",
                    listStyleType: "none",
                    padding: 0,
                    fontSize: 14,
                    marginBottom: 10,
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {FEATURES[planTier].map((feat, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: 6,
                        padding: "10px",
                        borderRadius: "4px",
                        listStyleType: "none",
                        backgroundColor: "#fff",
                        minWidth: "200px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <strong>{feat.title}</strong>
                      <br />
                      <div>
                        {feat.value && (
                          <span style={{ fontStyle: "italic" }}>
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
                            (feat.status === "Sim" ? "✔ Sim" : "✘ Não")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            <article
              style={{
                maxWidth: "1100px",
                flex: 1,
                minWidth: "300px",
              }}
            >
              <h1 style={theTitle}>Período</h1>
              <div style={styles.planContainer}>
                <div
                  style={{ ...styles.planCard, ...isSelected("monthly") }}
                  onClick={() => {
                    handlePlanSelect("monthly");
                    setPaymentMethod("CREDIT_CARD"); // mantém sua lógica
                  }}
                >
                  <p>{formatBRL(monthlyPrice(planTier))}/mês</p>
                </div>
                <div
                  style={{ ...styles.planCard, ...isSelected("yearly") }}
                  onClick={() => handlePlanSelect("yearly")}
                >
                  <p>{formatBRL(yearlyPrice(planTier))}/ano em até 6x</p>
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
                {selectedPlan === "yearly" &&
                  paymentMethod === "CREDIT_CARD" && (
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
                        style={{
                          fontSize: "14px",
                          color: "#333",
                          marginTop: "5px",
                        }}
                      >
                        {installments}x de{" "}
                        <strong>
                          {formatBRL(yearlyPrice(planTier) / installments)}
                        </strong>
                      </p>
                    </div>
                  )}
                {paymentMethod === "CREDIT_CARD" && (
                  <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>
                    {inputFields.map((field) => {
                      const fullRow = new Set<FieldName>([
                        "address",
                        "creditCardNumber",
                        "creditCardHolderName",
                      ]);
                      const isFull = fullRow.has(field.name);

                      return (
                        <Grid
                          item
                          key={field.name}
                          // celular: sempre 12 colunas
                          xs={12}
                          // tablet/desktop: 6 colunas (duas por linha), exceto os full
                          sm={isFull ? 12 : 6}
                          md={isFull ? 12 : 6}
                        >
                          <TextField
                            size="small"
                            fullWidth
                            label={field.label}
                            name={field.name}
                            type={field.type ?? "text"}
                            value={form[field.name]}
                            onChange={
                              field.name === "zip"
                                ? (e) => {
                                    const onlyDigits = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    if (onlyDigits.length <= 8)
                                      setForm((prev) => ({
                                        ...prev,
                                        zip: onlyDigits,
                                      }));
                                  }
                                : handleChange
                            }
                            required={
                              paymentMethod === "CREDIT_CARD" &&
                              requiredIfCC.has(field.name)
                            }
                            inputProps={field.inputProps}
                            sx={{
                              ...inputStyle,
                              // inputs ainda menores no mobile (estilo checkout)
                              "& .MuiOutlinedInput-root": {
                                ...inputStyle["& .MuiOutlinedInput-root"],
                                "@media (max-width:600px)": {
                                  fontSize: "0.85rem",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                ...inputStyle["& .MuiInputLabel-root"],
                                "@media (max-width:600px)": {
                                  fontSize: "0.8rem",
                                },
                              },
                            }}
                          />
                        </Grid>
                      );
                    })}
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
                        window.location.assign(getWhatsAppLink(selectedPlan));
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
                <TermsAndConditions
                  onValidityChange={(valid, data) => {
                    setTermsValid(valid);
                    setTermsMeta(data);
                  }}
                />
                {paymentMethod !== "PIX" && (
                  <button
                    type="submit"
                    style={{
                      ...styles.button,
                      backgroundColor:
                        loading || !termsValid ? "grey" : "#ed5914",
                      cursor:
                        loading || !termsValid ? "not-allowed" : "pointer",
                    }}
                    disabled={loading || !termsValid}
                  >
                    {loading ? (
                      <CircularProgress style={{ color: "#ed5914" }} />
                    ) : (
                      "Cadastrar"
                    )}
                  </button>
                )}
              </>
            </article>
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </form>
    </div>
  );
}
