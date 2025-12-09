import React, { useEffect, useState, FormEvent } from "react";
import { HOne } from "../Resources/Components/RouteBox";
import { partnerColor } from "../Styles/Styles";
import { myLogoDone } from "./NewStudentAsaas/EmailCheck";
import {
  formatDateBrWithHour,
  onLoggOut,
  backDomain,
} from "../Resources/UniversalComponents";
import Countdown from "./Ranking/RankingComponents/Countdown";
import { User } from "./MyProfile/types.MyProfile";
import axios from "axios";

interface PaymentForm {
  planType: "monthly" | "annual";
  paymentMethod: "CREDIT_CARD" | "PIX";
  planTier: "gold" | "pro";
  installments: number | "";
  dateOfBirth: string;
  doc: string;
  zip: string;
  state: string;
  phoneNumber: string;
  city: string;
  neighborhood: string;
  address: string;
  addressNumber: string;
  creditCardNumber: string;
  creditCardHolderName: string;
  creditCardExpiryMonth: string;
  creditCardExpiryYear: string;
  creditCardCcv: string;
}

export function SubscriptionExpired() {
  const [user, setUser] = useState<User>({} as User);
  const [form, setForm] = useState<PaymentForm>({
    planType: "monthly",
    paymentMethod: "CREDIT_CARD",
    phoneNumber: "",
    planTier: "gold",
    installments: 1,
    dateOfBirth: "",
    doc: "",
    zip: "",
    state: "",
    city: "",
    neighborhood: "",
    address: "",
    addressNumber: "",
    creditCardNumber: "",
    creditCardHolderName: "",
    creditCardExpiryMonth: "",
    creditCardExpiryYear: "",
    creditCardCcv: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pixUrl, setPixUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loggedIn") || "";
      const getLoggedUser: User = JSON.parse(stored);
      setUser(getLoggedUser);
      // if (new Date(getLoggedUser.limitDate) > new Date()) {
      //   window.location.assign("/");
      // }
    } catch (e) {
      console.log(e);
      onLoggOut();
    }
  }, []);

  // máscara de telefone (00) 00000-0000 ou (00) 0000-0000
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11); // máximo 11 dígitos
    if (!digits) return "";

    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      // até 10 dígitos -> padrão fixo
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    // 11 dígitos -> celular
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box" as const,
    },
    container: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
    card: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "16px",
      padding: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      maxWidth: "480px",
      width: "100%",
      textAlign: "center" as const,
      boxSizing: "border-box" as const,
    },
    button: {
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 500,
      backgroundColor: partnerColor(),
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textDecoration: "none",
    },
    modernSection: {
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      marginTop: "16px",
      width: "100%",
      boxSizing: "border-box" as const,
    },
    form: {
      width: "100%",
      marginTop: "16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    field: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "flex-start",
      textAlign: "left" as const,
      width: "100%",
    },
    label: {
      fontSize: "13px",
      marginBottom: "4px",
    },
    input: {
      width: "100%",
      padding: "8px",
      boxSizing: "border-box" as const,
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    radioRow: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "8px",
    },
    helperText: {
      fontSize: "12px",
      opacity: 0.8,
      marginTop: "4px",
    },
    error: {
      fontSize: "13px",
      color: "#b00020",
      marginTop: "8px",
    },
    success: {
      fontSize: "13px",
      marginTop: "8px",
    },
    pixLink: {
      marginTop: "8px",
      fontSize: "13px",
      wordBreak: "break-all" as const,
    },
  };

  const handleChange =
    (field: keyof PaymentForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "installments"
          ? e.target.value === ""
            ? ""
            : Number(e.target.value)
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value as any }));
    };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setForm((prev) => ({ ...prev, phoneNumber: formatted }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setErrorMessage(
        "Não foi possível identificar o seu usuário. Faça login novamente."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPixUrl(null);

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/cadastro-teacher-existing-student/${user.id}`,
        {
          paymentMethod: form.paymentMethod,
          planType: form.planType,
          installments:
            form.paymentMethod === "CREDIT_CARD" && form.planType === "annual"
              ? form.installments || 1
              : 1,
          dateOfBirth: form.dateOfBirth,
          doc: form.doc,
          neighborhood: form.neighborhood,
          state: form.state,
          address: form.address,
          addressNumber: form.addressNumber,
          zip: form.zip,
          city: form.city,
          phoneNumber: form.phoneNumber, // envia com máscara; o backend sanitiza
          creditCardNumber:
            form.paymentMethod === "CREDIT_CARD" ? form.creditCardNumber : "",
          creditCardHolderName:
            form.paymentMethod === "CREDIT_CARD"
              ? form.creditCardHolderName
              : "",
          creditCardExpiryMonth:
            form.paymentMethod === "CREDIT_CARD"
              ? form.creditCardExpiryMonth
              : "",
          creditCardExpiryYear:
            form.paymentMethod === "CREDIT_CARD"
              ? form.creditCardExpiryYear
              : "",
          creditCardCcv:
            form.paymentMethod === "CREDIT_CARD" ? form.creditCardCcv : "",
        }
      );

      setSuccessMessage(
        "Pagamento/assinatura criado com sucesso. Assim que o pagamento for confirmado, seu acesso será liberado."
      );
      const payment = response.data?.payment;
      if (form.paymentMethod === "PIX" && payment?.invoiceUrl) {
        setPixUrl(payment.invoiceUrl);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Erro ao processar pagamento. Tente novamente ou fale com o suporte.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
      window.location.assign("/");
    }
  };

  const showCardFields = form.paymentMethod === "CREDIT_CARD";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <button onClick={onLoggOut}>Sair</button>

          <img
            src={myLogoDone}
            alt="arvin logo"
            style={{
              margin: "auto",
              height: "4rem",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />

          <h1>Sua assinatura está desativada!</h1>

          <p style={{ fontSize: "18px", marginTop: "20px" }}>
            Para renovar seu pagamento, você pode falar com nosso suporte ou
            preencher os dados abaixo para gerar um novo pagamento.
          </p>

          {user.askedToCancel && (
            <div style={styles.modernSection}>
              <button
                onClick={() =>
                  window.location.assign("https://wa.me/5511972369299")
                }
                style={styles.button}
              >
                Solicite a reativação do seu cadastro
              </button>

              <Countdown
                targetDate={new Date(user.limitDate)}
                text={`Sua plataforma expirou em ${formatDateBrWithHour(
                  user.limitDate
                )}`}
              />
            </div>
          )}

          {!user.askedToCancel && (
            <div style={styles.modernSection}>
              <HOne>Renovar assinatura</HOne>

              <form style={styles.form} onSubmit={handleSubmit}>
                {/* TIPO DE PLANO */}
                <div style={styles.field}>
                  <label style={styles.label}>Tipo de plano</label>
                  <div style={styles.radioRow}>
                    <label>
                      <input
                        type="radio"
                        value="monthly"
                        checked={form.planType === "monthly"}
                        onChange={handleChange("planType")}
                      />{" "}
                      Mensal (cartão de crédito)
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="annual"
                        checked={form.planType === "annual"}
                        onChange={handleChange("planType")}
                      />{" "}
                      Anual
                    </label>
                  </div>
                  <div style={styles.helperText}>
                    Plano mensal: cobrança recorrente no cartão. Plano anual:
                    pagamento único (Pix ou cartão).
                  </div>
                </div>

                {/* MÉTODO DE PAGAMENTO */}
                <div style={styles.field}>
                  <label style={styles.label}>Forma de pagamento</label>
                  <div style={styles.radioRow}>
                    <label>
                      <input
                        type="radio"
                        value="CREDIT_CARD"
                        checked={form.paymentMethod === "CREDIT_CARD"}
                        onChange={handleChange("paymentMethod")}
                      />{" "}
                      Cartão de crédito
                    </label>
                    {form.planType === "annual" && (
                      <label>
                        <input
                          type="radio"
                          value="PIX"
                          checked={form.paymentMethod === "PIX"}
                          onChange={handleChange("paymentMethod")}
                        />{" "}
                        Pix (anual)
                      </label>
                    )}
                  </div>
                </div>

                {/* PARCELAS – só faz sentido anual no cartão */}
                {form.planType === "annual" &&
                  form.paymentMethod === "CREDIT_CARD" && (
                    <div style={styles.field}>
                      <label style={styles.label}>
                        Parcelar R$ {(799.99).toFixed(2).replace(".", ",")} em
                        até 10x sem juros
                      </label>

                      <select
                        value={form.installments}
                        onChange={handleChange("installments")}
                        style={styles.input as React.CSSProperties}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (n) => {
                            const perInstallment = 799.99 / n;
                            return (
                              <option key={n} value={n}>
                                {n}x de R${" "}
                                {perInstallment.toFixed(2).replace(".", ",")}{" "}
                                sem juros
                              </option>
                            );
                          }
                        )}
                      </select>

                      <div style={styles.helperText}>
                        Valor total: R$ {(799.99).toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  )}

                {/* DADOS PESSOAIS */}
                <div style={styles.field}>
                  <label style={styles.label}>CPF</label>
                  <input
                    type="text"
                    value={form.doc}
                    onChange={handleChange("doc")}
                    style={styles.input}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Telefone/Celular</label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={handlePhoneChange}
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Data de nascimento</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange("dateOfBirth")}
                    style={styles.input}
                  />
                </div>

                {/* ENDEREÇO */}
                <div style={styles.field}>
                  <label style={styles.label}>CEP</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={handleChange("zip")}
                    style={styles.input}
                    placeholder="00000-000"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Endereço</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={handleChange("address")}
                    style={styles.input}
                    placeholder="Rua, avenida..."
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Número</label>
                  <input
                    type="text"
                    value={form.addressNumber}
                    onChange={handleChange("addressNumber")}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Bairro</label>
                  <input
                    type="text"
                    value={form.neighborhood}
                    onChange={handleChange("neighborhood")}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Cidade</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Estado (UF)</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={handleChange("state")}
                    style={styles.input}
                    placeholder="SP"
                  />
                </div>

                {/* CARTÃO DE CRÉDITO */}
                {showCardFields && (
                  <>
                    <div style={styles.field}>
                      <label style={styles.label}>
                        Nome completo no cartão
                      </label>
                      <input
                        type="text"
                        value={form.creditCardHolderName}
                        onChange={handleChange("creditCardHolderName")}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Número do cartão</label>
                      <input
                        type="text"
                        value={form.creditCardNumber}
                        onChange={handleChange("creditCardNumber")}
                        style={styles.input}
                        placeholder="Só números"
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Validade (mês / ano)</label>
                      <div style={styles.radioRow}>
                        <input
                          type="text"
                          value={form.creditCardExpiryMonth}
                          onChange={handleChange("creditCardExpiryMonth")}
                          style={styles.input}
                          placeholder="MM"
                        />
                        <input
                          type="text"
                          value={form.creditCardExpiryYear}
                          onChange={handleChange("creditCardExpiryYear")}
                          style={styles.input}
                          placeholder="AAAA"
                        />
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>CVV</label>
                      <input
                        type="password"
                        value={form.creditCardCcv}
                        onChange={handleChange("creditCardCcv")}
                        style={styles.input}
                        placeholder="3 dígitos"
                      />
                    </div>
                  </>
                )}

                {errorMessage && <div style={styles.error}>{errorMessage}</div>}

                {successMessage && (
                  <div style={styles.success}>{successMessage}</div>
                )}

                {pixUrl && (
                  <div style={styles.pixLink}>
                    Link para pagamento via Pix:{" "}
                    <a href={pixUrl} target="_blank" rel="noreferrer">
                      {pixUrl}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  style={styles.button}
                  disabled={submitting}
                >
                  {submitting ? "Processando..." : "Gerar pagamento"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionExpired;
