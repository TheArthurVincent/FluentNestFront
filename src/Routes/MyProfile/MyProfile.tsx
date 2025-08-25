import React, { useEffect, useState } from "react";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  updateInfo,
} from "../../Resources/UniversalComponents";
import { partnerColor, textTitleFont } from "../../Styles/Styles";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { User } from "./types.MyProfile";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import Countdown from "../Ranking/RankingComponents/Countdown";
import { AvatarUpload } from "./Pic";
import { isArthurVincent } from "../../App";
import { HOne } from "../../Resources/Components/RouteBox";
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "16px",
    padding: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
    border: "1px solid #e8eaed",
    maxWidth: "480px",
    textAlign: "center" as const,
  },
  button: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  modernSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    border: "1px solid #e8eaed",
    padding: "24px",
    marginBottom: "16px",
  },
  profileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f1f3f5",
    fontSize: "14px",
  },
  profileLabel: {
    color: "#6c757d",
    fontWeight: "500",
    textTransform: "uppercase" as const,
    fontSize: "11px",
    letterSpacing: "0.5px",
  },
  profileValue: {
    color: "#2c3e50",
    fontWeight: "500",
    textAlign: "right" as const,
  },
};

export function MyProfile({ headers }: HeadersProps) {
  //@ts-ignore
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.username).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const { UniversalTexts } = useUserContext();
  const [user, setUser] = useState<User>({} as User);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState({
  name: "",
  lastname: "",
  doc: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
});

useEffect(() => {
  if (user) {
    setEditData({
      name: user.name || "",
      lastname: user.lastname || "",
      doc: user.doc || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }
}, [user]);


const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setEditData((prev) => ({ ...prev, [name]: value }));
};

const saveEditProfile = async () => {
  try {
    await axios.put(
      `${backDomain}/api/v1/students/${user.id}`,
      { ...editData },
      { headers: actualHeaders }
    );
    notifyAlert("Dados atualizados com sucesso!", partnerColor());
    updateInfo(user.id, headers);
    setShowEditModal(false);
    window.location.reload();
  } catch (err) {
    notifyAlert("Erro ao atualizar dados.");
  }
};

  const resizeAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Erro no canvas");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Converte com qualidade reduzida (de 0.5 a 0.9 é razoável)
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% da qualidade
        const base64WithoutPrefix = resizedBase64.replace(
          /^data:image\/jpeg;base64,/,
          ""
        );

        resolve(base64WithoutPrefix);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const uploadStudentPhoto = async (file: File): Promise<string> => {
    const base64 = await resizeAndConvertToBase64(file);

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/upload-picture/${user.id}`,
        { file: base64 }
      );

      return response.data.pictureUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw error;
    }
  };

  const actualHeaders = headers || {};

  const editStudentPassword = async (): Promise<void> => {
    if (newPassword === confirmPassword) {
      setNewPassword(newPassword);
    } else {
      alert("As senhas são diferentes");
      return;
    }

    try {
      await axios.put(
        `${backDomain}/api/v1/studentperspassword/${user.id}`,
        { newPassword },
        { headers: actualHeaders }
      );
      notifyAlert("Senha editada com sucesso!", "#000");
      setConfirmPassword("");
      setNewPassword("");
    } catch (error) {
      onLoggOut();
      notifyAlert("Erro ao editar senha");
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const getLoggedUser: User = JSON.parse(
        localStorage.getItem("loggedIn") || ""
      );
      setUser(getLoggedUser);
      setLoading(false);
    } catch (e) {
      console.log(e);
      onLoggOut();
    }
  }, []);

  const myProfileList = [
    { title: UniversalTexts.name, data: user.name + " " + user.lastname },
    { title: UniversalTexts.document, data: user.doc },
    { title: UniversalTexts.phoneNumber, data: user.phoneNumber },
    { title: UniversalTexts.email, data: user.email },
    { title: UniversalTexts.username, data: user.username },
    {
      title: UniversalTexts.dateOfBirth,
      data: formatDateBr(
        new Date(user.dateOfBirth).setDate(
          new Date(user.dateOfBirth).getDate() + 1
        )
      ),
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const cancelSubscription = async () => {
    if (user.subscriptionAsaas) {
      try {
        await axios.delete(
          `${backDomain}/api/v1/asaas/cancel-subscription/${user.id}`
        );
        notifyAlert("Assinatura cancelada com sucesso.");
        updateInfo(user.id, headers);
        setTimeout(() => {
          window.location.reload();
        }, 200);
        setShowModal(false);
      } catch (err) {
        console.error(err);
        alert("Erro ao cancelar a assinatura.");
      }
    } else if (user.paymentId) {
      notifyAlert(
        "Fale comigo por WhatsApp, e prosseguiei com seu cancelamento. :)"
      );
      setTimeout(() => {
        window.location.assign("https://wa.me/5511915857807");
      }, 2000);
    }
  };

  return (
    <div
      style={{
        width: "1000px",
        maxWidth: "93vw",
      }}
    >
      {headers ? (
        // @ts-ignore
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "24px 16px",
            backgroundColor: "#fafbfc",
            minHeight: "100vh",
          }}
        >
          <Helmets text="My Profile" />
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress style={{ color: partnerColor() }} />
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div style={styles.modernSection}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ textAlign: "right", marginBottom: "12px" }}>
  <button
    onClick={() => setShowEditModal(true)}
    style={{
      padding: "8px 16px",
      fontSize: "13px",
      fontWeight: "500",
      backgroundColor: partnerColor(),
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
  >
    Editar Dados
  </button>
</div>

{/* Modal de edição */}
{showEditModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1001,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "32px 24px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ marginBottom: "18px", fontSize: "18px", fontWeight: 600 }}>
        Editar Dados Pessoais
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveEditProfile();
        }}
        style={{ display: "grid", gap: "14px" }}
      >
        <TextField
          label="Nome"
          name="name"
          value={editData.name}
          onChange={handleEditChange}
          fullWidth
          size="small"
        />
        <TextField
          label="Sobrenome"
          name="lastname"
          value={editData.lastname}
          onChange={handleEditChange}
          fullWidth
          size="small"
        />
        <TextField
          label="Telefone"
          name="phoneNumber"
          value={editData.phoneNumber}
          onChange={handleEditChange}
          fullWidth
          size="small"
        />
        <TextField
          label="Email"
          name="email"
          value={editData.email}
          onChange={handleEditChange}
          fullWidth
          size="small"
        />
        <TextField
          label="Nascimento"
          name="dateOfBirth"
          type="date"
          value={editData.dateOfBirth}
          onChange={handleEditChange}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <div style={{ display: "flex", gap: "12px", marginTop: "10px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: partnerColor(),
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
                  <div>
                    <HOne>{UniversalTexts.myProfile}</HOne>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "14px",
                        margin: "0",
                      }}
                    >
                      Gerencie suas informações pessoais
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert("Atualizando Perfil");
                      updateInfo(user.id, headers);
                      window.location.reload();
                    }}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i
                      className="fa fa-refresh"
                      aria-hidden="true"
                      style={{ marginRight: "6px" }}
                    />
                    Atualizar
                  </button>
                </div>

                <AvatarUpload
                  user={user}
                  setUser={setUser}
                  uploadStudentPhoto={uploadStudentPhoto}
                />
              </div>

              {/* Profile Information */}
              <div style={styles.modernSection}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: "0 0 20px 0",
                  }}
                >
                  Informações Pessoais
                </h2>

                {isArthurVincent && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      {user.tutoree && isArthurVincent && (
                        <div>
                          <span style={styles.profileLabel}>
                            🎁 Código promocional
                          </span>
                          <p
                            style={{
                              margin: "4px 0 0 0",
                              fontSize: "12px",
                              color: "#6c757d",
                            }}
                          >
                            Recomende a plataforma para ganhar{" "}
                            <strong>20% de desconto</strong> nos 3 primeiros
                            meses!
                          </p>
                        </div>
                      )}
                      <button
                        onClick={copyToClipboard}
                        style={{
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          border: "none",
                          borderRadius: "6px",
                          backgroundColor: partnerColor(),
                          color: "#fff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {user.username}
                        {copied && (
                          <span style={{ marginLeft: "8px", fontSize: "10px" }}>
                            ✓ Copiado!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  {myProfileList.map((item, index) => (
                    <div key={index} style={styles.profileItem}>
                      <span style={styles.profileLabel}>{item.title}</span>
                      <span style={styles.profileValue}>{item.data}</span>
                    </div>
                  ))}

                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Aluno Particular</span>
                    <span
                      style={{
                        ...styles.profileValue,
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        backgroundColor: user.tutoree ? "#e8f5e8" : "#f1f3f5",
                        color: user.tutoree ? "#388e3c" : "#6c757d",
                      }}
                    >
                      {user.tutoree ? "Sim" : "Não"}
                    </span>
                  </div>

                  {user.tutoree && isArthurVincent && (
                    <div
                      style={{ ...styles.profileItem, borderBottom: "none" }}
                    >
                      <span style={styles.profileLabel}>Google Drive</span>
                      <a
                        href={user.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: partnerColor(),
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Acessar Drive →
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {/* Subscription Management */}
              <div style={styles.modernSection}>
                {user.askedToCancel && (
                  <div style={styles.container}>
                    <div style={styles.card}>
                      <Countdown
                        text="Você ainda pode usar a plataforma até."
                        targetDate={new Date(user.limitDate)}
                      />
                      <button
                        onClick={() =>
                          window.location.assign("https://wa.me/5511915857807")
                        }
                        style={styles.button}
                      >
                        Solicite a reativação do seu cadastro
                      </button>
                    </div>
                  </div>
                )}

                {new Date(user.limitCancelDate) > new Date() &&
                !user.subscriptionAsaas &&
                !user.tutoree ? (
                  <div style={styles.container}>
                    <div style={styles.card}>
                      <Countdown
                        text="Você ainda pode solicitar seu reembolso."
                        targetDate={new Date(user.limitCancelDate)}
                      />
                      <button
                        onClick={() =>
                          window.location.assign("https://wa.me/5511915857807")
                        }
                        style={styles.button}
                      >
                        💬 Solicitar Reembolso via WhatsApp
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {!user.askedToCancel && !user.tutoree && (
                      <div style={{ textAlign: "center" }}>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            margin: "0 0 16px 0",
                          }}
                        >
                          Gerenciar Assinatura
                        </h3>
                        <button
                          onClick={() => setShowModal(true)}
                          style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Cancelar Minha Assinatura
                        </button>
                      </div>
                    )}
                  </>
                )}

                {showModal && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        background: "#fff",
                        padding: "32px",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "400px",
                        textAlign: "center",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                      }}
                    >
                      <h2
                        style={{
                          marginBottom: "24px",
                          color: "#dc3545",
                          fontSize: "18px",
                          fontWeight: "600",
                        }}
                      >
                        Tem certeza que deseja cancelar sua assinatura?
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() => setShowModal(false)}
                          style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Não
                        </button>
                        <button
                          onClick={cancelSubscription}
                          style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Sim
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div style={styles.modernSection}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: "0 0 20px 0",
                  }}
                >
                  Alterar Senha
                </h2>

                <div style={{ display: "grid", gap: "16px" }}>
                  <TextField
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder={UniversalTexts.newPassword}
                    type="password"
                    required
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#fafbfc",
                        "& fieldset": { borderColor: "#e8eaed" },
                        "&:hover fieldset": { borderColor: "#c3c4c7" },
                        "&.Mui-focused fieldset": {
                          borderColor: partnerColor(),
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6c757d",
                        fontSize: "14px",
                      },
                    }}
                  />

                  <TextField
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder={UniversalTexts.confirmNewPassword}
                    type="password"
                    required
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#fafbfc",
                        "& fieldset": { borderColor: "#e8eaed" },
                        "&:hover fieldset": { borderColor: "#c3c4c7" },
                        "&.Mui-focused fieldset": {
                          borderColor: partnerColor(),
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6c757d",
                        fontSize: "14px",
                      },
                    }}
                  />

                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <button
                      onClick={() => editStudentPassword()}
                      style={{
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: partnerColor(),
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {UniversalTexts.save}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            color: "#6c757d",
          }}
        >
          Nenhum usuário logado
        </div>
      )}
    </div>
  );
}

export default MyProfile;
