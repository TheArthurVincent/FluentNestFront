import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { notifyAlert } from "../../../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { backDomain } from "../../../../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../../../../Styles/Styles";

interface NewHomeworkModalProps {
  headers?: Record<string, string>;
  /** studentID da rota (req.params.studentID) */
  studentID: string;
  /** eventID usado no body (req.body.eventID) */
  eventID: string;
  /** Se quiser sobrescrever a URL padrão */
  postUrl?: string;
  /** Callback após criação, recebe o array `homeworks` retornado pelo backend */
  onHomeworkCreated?: (homeworks: any[]) => void;
  /** Label do botão que abre o modal */
  buttonLabel?: string;
}

interface HomeworkFormState {
  description: string;
  dueDate: string; // yyyy-mm-dd (input type="date")
}

export const NewHomeworkModal: FC<NewHomeworkModalProps> = ({
  headers,
  studentID,
  eventID,
  postUrl,
  onHomeworkCreated,
  buttonLabel = "+ Novo Homework",
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HomeworkFormState>({
    description: "",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const handleChange = (
    field: keyof HomeworkFormState,
    value: string,
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      dueDate: "",
    });
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      notifyAlert("A descrição do homework é obrigatória.");
      return false;
    }
    // if (!eventID) {
    //   notifyAlert(
    //     "Evento inválido. Atualize a página ou selecione a aula novamente."
    //   );
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const url =
      postUrl ||
      `${backDomain}/api/v1/homework/${encodeURIComponent(studentID)}`;

    const payload: {
      description: string;
      dueDate?: Date;
      eventID: string;
    } = {
      description: formData.description.trim(),
      eventID: "",
    };

    if (formData.dueDate) {
      // converte yyyy-mm-dd para Date (o backend aceita string/Date e faz o cast)
      payload.dueDate = new Date(formData.dueDate);
    }

    try {
      const response = await axios.post(url, payload, {
        headers: headers || {},
      });

      const createdHomeworks = response?.data?.homeworks || [];
      notifyAlert("Homework criado com sucesso.", "green");

      if (onHomeworkCreated) {
        onHomeworkCreated(createdHomeworks);
      }

      resetForm();
      setOpen(false);
    } catch (error: any) {
      const msgBackend =
        error?.response?.data?.error || error?.response?.data?.message || "";
      notifyAlert(`Erro ao criar homework. ${msgBackend}`, partnerColor());
    } finally {
      setIsLoading(false);
    }
  };

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
        {buttonLabel}
      </Button>

      {/* Modal (MUI Dialog usa Portal grudado no body) */}
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
            Novo Homework
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
            <h1>Criar tarefa de casa</h1>

            <form className="grid-1" onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#555",
                  }}
                >
                  Descrição do homework{" "}
                  <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange("description", e.target.value)
                  }
                  style={{
                    ...inputStyle,
                    minHeight: "120px",
                    resize: "vertical",
                    borderColor: formData.description ? partnerColor() : "#ddd",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) =>
                    (e.target.style.borderColor = formData.description
                      ? partnerColor()
                      : "#ddd")
                  }
                  placeholder="Descreva claramente a tarefa que o aluno deve fazer."
                />
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#555",
                  }}
                >
                  Data de entrega (opcional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("dueDate", e.target.value)
                  }
                  style={{
                    ...inputStyle,
                    borderColor: formData.dueDate ? partnerColor() : "#ddd",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = partnerColor())}
                  onBlur={(e) =>
                    (e.target.style.borderColor = formData.dueDate
                      ? partnerColor()
                      : "#ddd")
                  }
                />
                <small style={{ color: "#777", fontSize: "12px" }}>
                  Se você não escolher uma data, o sistema usará 7 dias a partir
                  de hoje.
                </small>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  disabled={isLoading || !formData.description.trim()}
                  style={{
                    backgroundColor:
                      isLoading || !formData.description.trim()
                        ? "#ccc"
                        : partnerColor(),
                    color: "#fff",
                    padding: "12px 18px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      isLoading || !formData.description.trim()
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} style={{ color: "#fff" }} />
                      &nbsp;Criando...
                    </>
                  ) : (
                    "Criar Homework"
                  )}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>

        <DialogActions />
      </Dialog>
    </>
  );
};

export default NewHomeworkModal;
