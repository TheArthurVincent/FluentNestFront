import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

interface NewStudentModalProps {
  headers?: Record<string, string>;
  id: string;
}

interface FormDataState {
  name: string;
  lastname: string;
  fee: number;
  email: string;
  dateOfBirth: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

const switchTrackBase: React.CSSProperties = {
  width: 44,
  height: 24,
  borderRadius: 6,
  position: "relative",
  border: "1px solid #e2e8f0",
  transition: "background-color 180ms ease",
  cursor: "pointer",
  flexShrink: 0,
};

const switchThumbBase: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 6,
  background: "#fff",
  position: "absolute",
  top: 1.5,
  transition: "transform 180ms ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
};

const switchRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  background: "#fff",
  marginTop: 8,
};

export const NewStudentModal: FC<NewStudentModalProps> = ({ headers, id }) => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    lastname: "",
    fee: 0,
    email: "",
    dateOfBirth: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [includeThisMonth, setIncludeThisMonth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "fee" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      fee: 0,
      dateOfBirth: "",
      cpf: "",
      password: "",
      confirmPassword: "",
    });
    setIncludeThisMonth(true);
  };

  const validateForm = () => {
    const { name, lastname, email, password, confirmPassword, fee } = formData;

    if (!name || !lastname || !email || !password || !confirmPassword) {
      notifyAlert("Preencha todos os campos obrigatórios!");
      return false;
    }

    if (!fee && fee !== 0) {
      notifyAlert("Preencha a mensalidade!");
      return false;
    }

    if (password !== confirmPassword) {
      notifyAlert("As senhas não coincidem!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const newStudent = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      fee: formData.fee,
      includeThisMonth,
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/newstudentbyteacher/${id}`,
        newStudent,
        { headers: headers || {} },
      );
      resetForm();
      notifyAlert(
        `Usuário cadastrado com sucesso! ${response.data.message}`,
        "green",
      );
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      notifyAlert(
        `Erro ao cadastrar aluno ${formData.name}. ${
          error?.response?.data?.message || ""
        }`,
        partnerColor(),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const formFields: {
    label: string;
    type: string;
    key: keyof FormDataState;
    required?: boolean;
  }[] = [
    { label: "Nome", type: "text", key: "name", required: true },
    { label: "Sobrenome", type: "text", key: "lastname", required: true },
    { label: "Mensalidade", type: "number", key: "fee", required: true },
    { label: "E-mail", type: "email", key: "email", required: true },
    {
      label: "Data de Nascimento",
      type: "date",
      key: "dateOfBirth",
      required: true,
    },
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
      <button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: partnerColor(),
          color: "#fff",
          fontWeight: 600,
          borderRadius: 6,
          textTransform: "none",
          padding: "8px 18px",
        }}
      >
        + Novo Aluno
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <span style={{ fontFamily: "Lato", fontWeight: 600 }}>
            Novo Aluno
          </span>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              padding: "0.5rem 0",
            }}
          >
            <form className="grid-2-1" onSubmit={handleSubmit}>
              {formFields.map(({ label, type, key, required }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#555",
                    }}
                  >
                    {label}{" "}
                    {required && <span style={{ color: "#e74c3c" }}>*</span>}
                  </label>

                  <input
                    type={type}
                    value={formData[key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(key, e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      borderColor: formData[key] ? partnerColor() : "#ddd",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = partnerColor())
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = formData[key]
                        ? partnerColor()
                        : "#ddd")
                    }
                    maxLength={key === "cpf" ? 11 : undefined}
                  />

                  {key === "fee" && (
                    <div style={switchRowStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {includeThisMonth
                            ? "Incluir este mês"
                            : "Não incluir este mês"}
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-pressed={includeThisMonth}
                        onClick={() => setIncludeThisMonth((prev) => !prev)}
                        style={{
                          ...switchTrackBase,
                          backgroundColor: includeThisMonth
                            ? partnerColor()
                            : "#e5e7eb",
                        }}
                      >
                        <span
                          style={{
                            ...switchThumbBase,
                            left: 2,
                            transform: includeThisMonth
                              ? "translateX(20px)"
                              : "translateX(0px)",
                          }}
                        />
                      </button>
                    </div>
                  )}
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
                  fontWeight: 600,
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
                    &nbsp;Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </button>
            </form>
          </div>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default NewStudentModal;
