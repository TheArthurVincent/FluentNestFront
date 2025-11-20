import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  backDomain,
  UpgradeGoldButton,
} from "../../../../Resources/UniversalComponents";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne } from "../../../../Resources/Components/RouteBox";

interface NewStudentModalProps {
  headers?: Record<string, string>;
  id: string;
}

interface FormDataState {
  name: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

export const NewStudentModal: FC<NewStudentModalProps> = ({ headers, id }) => {
  const [formData, setFormData] = useState<FormDataState>({
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
  const [open, setOpen] = useState(false); // controla o modal

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    const { name, lastname, email, password, confirmPassword } = formData;

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
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/newstudentbyteacher/${id}`,
        newStudent,
        { headers: headers || {} }
      );
      resetForm();
      notifyAlert(
        `Usuário cadastrado com sucesso! ${response.data.message}`,
        "green"
      );
      setOpen(false); // fecha o modal após sucesso
      window.location.reload();
    } catch (error: any) {
      notifyAlert(
        `Erro ao cadastrar aluno ${formData.name}. ${
          error?.response?.data?.message || ""
        }`,
        partnerColor()
      );
      setGoldVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
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
      {/* Botão que abre o modal */}
      <Button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: partnerColor(),
          color: "#fff",
          fontWeight: 600,
          borderRadius: 999,
          textTransform: "none",
          padding: "8px 18px",
        }}
      >
        + Novo Aluno
      </Button>

      {/* Modal */}
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
          <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600 }}>
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
            <HOne>Cadastro rápido</HOne>
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
                </div>
              ))}

              {/* Espaço para alinhar botão na grid */}
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
                  borderRadius: "4px",
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
            {goldVisible && <UpgradeGoldButton />}
          </div>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default NewStudentModal;
