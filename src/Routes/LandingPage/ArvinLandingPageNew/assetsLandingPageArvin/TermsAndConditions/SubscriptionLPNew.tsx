import React, { useState } from "react";

export default function TeacherSignupSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+55",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ confirmPassword?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      return setFormData((prev) => ({ ...prev, phone: formatBrPhone(value) }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          name === "confirmPassword" || name === "password"
            ? getPasswordError(
                name === "password" ? value : formData.password,
                name === "confirmPassword" ? value : formData.confirmPassword
              )
            : undefined,
      }));
    }
  };

  const getPasswordError = (pwd: string, confirm: string) => {
    if (!confirm) return undefined;
    if (pwd !== confirm) return "As senhas não coincidem.";
    return undefined;
  };

  // Formata telefone BR (11 9 3046 2094)
  function formatBrPhone(input: string) {
    const digits = input.replace(/\D/g, "").slice(0, 11);
    const ddd = digits.slice(0, 2);
    const nine = digits.slice(2, 3);
    const p1 = digits.slice(3, 7);
    const p2 = digits.slice(7, 11);
    let out = "";
    if (ddd) out += ddd;
    if (nine) out += (out ? " " : "") + nine;
    if (p1) out += " " + p1;
    if (p2) out += " " + p2;
    return out;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pwdError = getPasswordError(
      formData.password,
      formData.confirmPassword
    );
    if (pwdError) {
      setErrors((prev) => ({ ...prev, confirmPassword: pwdError }));
      return;
    }

    const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
    console.log("Cadastro enviado:", { ...formData, phone: fullPhone });
  };

  return (
    <section
      style={{ width: "100%", margin: "0 auto", boxSizing: "border-box" }}
    >
      <style>{`
        .ts-wrap {
          max-width: 850px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 16px;
          display: grid;
          gap: 24px;
          box-sizing: border-box;
        }
        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .row-2, .row-3 {
            grid-template-columns: 1fr;
          }
        }
        .phone-wrap {
          display: grid;
          gap: 8px;
          grid-template-columns: 0.3fr 1fr;
          align-items: center;
          width: 100%;
        }
        .ts-select {
          min-width: 80px;
          flex-shrink: 0;
        }
        .ts-input, .ts-select {
          border: 1px solid #C3D4E9;
          border-radius: 8px;
          padding: 10px 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #101721;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .ts-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #101721;
          margin-bottom: 6px;
        }
        .ts-btn {
          background-color: #ED5914;
          color: #FFFFFF;
          border: none;
          border-radius: 30px;
          padding: 14px 40px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: -0.02em;
          transition: background 0.3s ease;
        }
        .ts-btn:hover { background-color: #cf4c10; }
      `}</style>

      <div className="ts-wrap">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontSize: 12,
              color: "#ED5914",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            CADASTRE-SE
          </div>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontSize: 24,
              color: "#101721",
              margin: 0,
            }}
          >
            Comece a pagar apenas na próxima fatura!
          </p>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 400,
              fontSize: 14,
              color: "#596780",
              marginTop: 8,
            }}
          >
            Preencha seus dados abaixo para começar a usar o Arvin.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          {/* Nome + Sobrenome */}
          <div className="row-2">
            <div style={{ display: "grid" }}>
              <label htmlFor="firstName" className="ts-label">
                Nome
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="ts-input"
              />
            </div>
            <div style={{ display: "grid" }}>
              <label htmlFor="lastName" className="ts-label">
                Sobrenome
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="ts-input"
              />
            </div>
          </div>

          {/* E-mail + Telefone + Nascimento */}
          <div className="row-3">
            <div style={{ display: "grid" }}>
              <label htmlFor="email" className="ts-label">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="ts-input"
              />
            </div>
            <div style={{ display: "grid" }}>
              <label htmlFor="birthDate" className="ts-label">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="ts-input"
              />
            </div>

            <div style={{ display: "grid" }}>
              <label className="ts-label">Telefone</label>
              <div className="phone-wrap">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="ts-select"
                >
                  <option value="+55">+55 (BR)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+34">+34 (ES)</option>
                  <option value="+351">+351 (PT)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="11 9 3046 2094"
                  className="ts-input"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          {/* Senha + Confirmar Senha */}
          <div className="row-2">
            <div style={{ display: "grid" }}>
              <label htmlFor="password" className="ts-label">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="ts-input"
              />
            </div>
            <div style={{ display: "grid" }}>
              <label htmlFor="confirmPassword" className="ts-label">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="ts-input"
              />
              {errors.confirmPassword && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#FF4423",
                    marginTop: 4,
                    fontFamily: "Plus Jakarta Sans",
                  }}
                >
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Botão */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" className="ts-btn">
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
