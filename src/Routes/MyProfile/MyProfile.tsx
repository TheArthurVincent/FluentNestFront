import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  backDomain,
  formatDateBr,
  formatDateBrWithHour,
  onLoggOut,
  updateInfo,
} from "../../Resources/UniversalComponents";
import { partnerColor, textpartnerColorContrast } from "../../Styles/Styles";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { User } from "./types.MyProfile";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import Countdown from "../Ranking/RankingComponents/Countdown";
import { AvatarUpload } from "./Pic";
import RankingTimelineArvin from "./RankingHistory/RankingTimelineArvin";
import { newArvinTitleStyle } from "../ArvinComponents/Groups/Groups";
import InstallPWA2 from "../../Components/InstallPWA2";

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
    borderRadius: "6px",
    border: "1px solid #e8eaed",
    maxWidth: "480px",
    textAlign: "center" as const,
  },
  button: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: partnerColor(),
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  modernSection: {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    border: "1px solid #e8eaed",
    padding: "24px",
    marginBottom: "16px",
  },
  profileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
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

/* ===============================
   Hook responsivo
   =============================== */
const useIsDesktop = (bp = 700) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > bp : true,
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return isDesktop;
};

/* ===============================
   Portal para colar modal no body
   =============================== */
const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
};

export function MyProfile({
  headers,
  change,
  setChange,
}: HeadersProps & {
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // @ts-ignore
  const { UniversalTexts } = useUserContext();
  const isDesktop = useIsDesktop(700);

  const baseBtnStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    borderRadius: 6,
    fontSize: isDesktop ? 12 : 14,
    cursor: "pointer",
    margin: isDesktop ? "0 4px" : "4px 0",
    width: isDesktop ? "auto" : "100%",
  };

  const basePrimaryBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    border: `1px solid ${partnerColor()}`,
    background: partnerColor(),
    color: "#fff",
  };

  const [user, setUser] = useState<User>({} as User);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const actualHeaders = headers || {};

  const saveEditProfile = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/students/${user.id}`,
        { ...editData },
        { headers: actualHeaders },
      );
      notifyAlert("Dados atualizados com sucesso!", partnerColor());
      updateInfo(user.id, headers);
      setShowEditModal(false);
      window.location.reload();
    } catch (err) {
      notifyAlert("Erro ao atualizar dados.");
    }
  };

  const today = new Date();
  const hasSubscription = !!(user.subscriptionAsaas || user.paymentId);
  const isSubscriptionActive =
    user.limitDate && new Date(user.limitDate) > today;

  const subscriptionStatus = user.askedToCancel
    ? "Cancelamento solicitado"
    : isSubscriptionActive
      ? "Ativa"
      : "Inativa";

  const subscriptionType = user.subscriptionAsaas
    ? "Assinatura recorrente (cartão)"
    : user.paymentId
      ? "Pagamento único / plano à vista"
      : "Nenhuma assinatura encontrada";

  const subscriptionInfoList = [
    {
      title: "Status",
      data: subscriptionStatus,
    },
    {
      title: "Tipo de Assinatura",
      data: subscriptionType,
    },
    {
      title: "Data limite de acesso",
      data: user.limitDate
        ? formatDateBrWithHour(user.limitDate)
        : "Não informado",
    },
    // {
    //   title: "Data limite para cancelamento",
    //   data: user.limitCancelDate
    //     ? formatDateBrWithHour(user.limitCancelDate)
    //     : "Não informado",
    // },
  ];

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

        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        const base64WithoutPrefix = resizedBase64.replace(
          /^data:image\/jpeg;base64,/,
          "",
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
        { file: base64 },
      );

      return response.data.pictureUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw error;
    }
  };

  const editStudentPassword = async (): Promise<void> => {
    if (newPassword !== confirmPassword) {
      alert("As senhas são diferentes");
      return;
    }

    try {
      await axios.put(
        `${backDomain}/api/v1/studentperspassword/${user.id}`,
        { newPassword },
        { headers: actualHeaders },
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
        localStorage.getItem("loggedIn") || "",
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
          new Date(user.dateOfBirth).getDate() + 1,
        ),
      ),
    },
  ];

  const cancelSubscription = async () => {
    if (user.subscriptionAsaas) {
      try {
        await axios.delete(
          `${backDomain}/api/v1/asaas-teacher/cancel-subscription/${user.id}`,
        );
        notifyAlert("Assinatura cancelada com sucesso.");
        updateInfo(user.id, headers);
        setTimeout(() => {
          updateInfo(user.id, headers);
          window.location.reload();
        }, 200);
        setShowModal(false);
      } catch (err) {
        console.error(err);
        alert("Erro ao cancelar a assinatura.");
      }
    } else if (user.paymentId) {
      notifyAlert(
        "Fale comigo por WhatsApp, e prosseguirei com seu cancelamento. :)",
      );
      setTimeout(() => {
        window.location.assign("https://wa.me/5511915857807");
      }, 2000);
    }
  };

  return (
    <div>
      {/* MODAIS NO BODY VIA PORTAL */}
      {showPasswordModal && (
        <ModalPortal>
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
              zIndex: 1002,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "32px 24px",
                borderRadius: "6px",
                width: "90%",
                maxWidth: "400px",
              }}
            >
              <h2
                style={{
                  marginBottom: "18px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Alterar Senha
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editStudentPassword();
                  setShowPasswordModal(false);
                }}
                style={{ display: "grid", gap: "14px" }}
              >
                <TextField
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  label={UniversalTexts.newPassword}
                  type="password"
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  label={UniversalTexts.confirmNewPassword}
                  type="password"
                  required
                  fullWidth
                  size="small"
                />
                <div
                  style={{
                    display: "flex",
                    gap: isDesktop ? "12px" : 0,
                    marginTop: "10px",
                    justifyContent: "center",
                    flexDirection: isDesktop ? "row" : "column",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    style={{
                      ...baseBtnStyle,
                      background: "#6c757d",
                      border: "1px solid #6c757d",
                      color: "#fff",
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={basePrimaryBtnStyle}>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {showEditModal && (
        <ModalPortal>
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
                borderRadius: "6px",
                width: "90%",
                maxWidth: "400px",
              }}
            >
              <h2
                style={{
                  marginBottom: "18px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
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
                <div
                  style={{
                    display: "flex",
                    gap: isDesktop ? "12px" : 0,
                    marginTop: "10px",
                    justifyContent: "center",
                    flexDirection: isDesktop ? "row" : "column",
                    width: "100%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      ...baseBtnStyle,
                      background: "#6c757d",
                      border: "1px solid #6c757d",
                      color: "#fff",
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={basePrimaryBtnStyle}>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {showModal && (
        <ModalPortal>
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
                borderRadius: "6px",
                width: "90%",
                maxWidth: "400px",
                textAlign: "center",
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
                  gap: isDesktop ? "12px" : 0,
                  flexDirection: isDesktop ? "row" : "column",
                  width: "100%",
                }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    ...baseBtnStyle,
                    background: "#28a745",
                    border: "1px solid #28a745",
                    color: "#fff",
                  }}
                >
                  Não
                </button>
                <button
                  onClick={cancelSubscription}
                  style={{
                    ...baseBtnStyle,
                    background: "#dc3545",
                    border: "1px solid #dc3545",
                    color: "#fff",
                  }}
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span style={newArvinTitleStyle}>Meu Perfil</span>
          </section>
        </div>
      )}

      <div style={{ fontFamily: "Plus Jakarta Sans" }}>
        <div
          style={{
            margin: "auto",
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 600,
            fontStyle: "SemiBold",
            fontSize: "14px",
          }}
        >
          {headers ? (
            <div
              style={{
                padding: "16px 0",
                marginBottom: "40px",
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
                  {/* Seção de perfil */}
                  <div style={styles.modernSection}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: isDesktop ? "center" : "flex-start",
                        gap: 12,
                        flexDirection: isDesktop ? "row" : "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: isDesktop ? "auto" : "100%",
                          justifyContent: isDesktop ? "flex-end" : "stretch",
                        }}
                      >
                        <button
                          onClick={() => {
                            alert("Atualizando Perfil");
                            updateInfo(user.id, headers);
                            window.location.reload();
                          }}
                          style={basePrimaryBtnStyle}
                          title="Atualizar"
                        >
                          <i
                            className="fa fa-refresh"
                            aria-hidden="true"
                            style={{ marginRight: "6px" }}
                          />
                          Atualizar
                        </button>
                      </div>
                    </div>

                    <AvatarUpload
                      user={user}
                      setUser={setUser}
                      change={change}
                      headers={headers}
                      _StudentId={user.id}
                      uploadStudentPhoto={uploadStudentPhoto}
                    />
                  </div>

                  {/* Informações pessoais */}
                  <div style={styles.modernSection}>
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        margin: "0 0 20px 0",
                      }}
                    >
                      Informações Pessoais
                    </h2>

                    <div>
                      <div
                        style={{
                          ...styles.profileItem,
                          borderBottom: "none",
                        }}
                      >
                        <span
                          style={{
                            ...styles.profileLabel,
                            fontWeight: 1000,
                            fontSize: "16px",
                          }}
                        >
                          Minha Pasta
                        </span>
                        <a
                          href={user.googleDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: partnerColor(),
                            fontWeight: 1000,
                            textDecoration: "none",
                            fontSize: "16px",
                          }}
                        >
                          Acessar Minha Pasta →
                        </a>
                      </div>
                      {myProfileList.map((item, index) => (
                        <div key={index} style={styles.profileItem}>
                          <span style={styles.profileLabel}>{item.title}</span>
                          <span style={styles.profileValue}>{item.data}</span>
                        </div>
                      ))}

                      <div style={styles.profileItem}>
                        <span style={styles.profileLabel}>
                          Aluno Particular
                        </span>
                        <span
                          style={{
                            ...styles.profileValue,
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            backgroundColor: user.tutoree
                              ? "#e8f5e8"
                              : "#f1f3f5",
                            color: user.tutoree ? "#388e3c" : "#6c757d",
                          }}
                        >
                          {user.tutoree ? "Sim" : "Não"}
                        </span>
                      </div>
                    </div>

                    {/* Botões ações perfil */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: isDesktop ? "flex-end" : "stretch",
                        gap: isDesktop ? 6 : 10,
                        marginTop: "16px",
                        flexDirection: isDesktop ? "row" : "column",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={() => setShowEditModal(true)}
                        style={{
                          ...basePrimaryBtnStyle,
                          background: partnerColor(),
                          border: `1px solid ${partnerColor()}`,
                          color: textpartnerColorContrast(),
                        }}
                      >
                        Editar Dados
                      </button>

                      <button
                        onClick={() => setShowPasswordModal(true)}
                        style={{
                          ...baseBtnStyle,
                          background: "#2c3e50",
                          border: "1px solid #2c3e50",
                          color: "#fff",
                        }}
                      >
                        Alterar Senha
                      </button>
                    </div>
                  </div>

                  {user.askedToCancel && (
                    <div style={styles.modernSection}>
                      <div style={styles.container}>
                        <div style={styles.card}>
                          <button
                            onClick={() =>
                              window.location.assign(
                                "https://wa.me/5511972369299",
                              )
                            }
                            style={styles.button}
                          >
                            Solicite a reativação do seu cadastro
                          </button>
                          <Countdown
                            targetDate={new Date(user.limitDate)}
                            text={`Você e seus alunos podem continuar acessando o Arvin até ${formatDateBrWithHour(
                              user.limitDate,
                            )}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {user.permissions === "students" && (
                <RankingTimelineArvin
                  headers={headers}
                  id={user.id}
                  name={user.name}
                  permissions={user.permissions}
                />
              )}

              {user.permissions !== "students" && (
                <div style={styles.modernSection}>
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 0 20px 0",
                    }}
                  >
                    Informações De Assinatura
                  </h2>

                  {!hasSubscription ? (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        margin: 0,
                      }}
                    >
                      Nenhuma assinatura ativa foi encontrada para este usuário.
                    </p>
                  ) : (
                    <>
                      <div>
                        {subscriptionInfoList.map((item, index) => (
                          <div key={index} style={styles.profileItem}>
                            <span style={styles.profileLabel}>
                              {item.title}
                            </span>
                            <span style={styles.profileValue}>{item.data}</span>
                          </div>
                        ))}

                        <div style={styles.profileItem}>
                          <span style={styles.profileLabel}>Situação</span>
                          <span
                            style={{
                              ...styles.profileValue,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              backgroundColor: user.askedToCancel
                                ? "#fff3cd"
                                : isSubscriptionActive
                                  ? "#e8f5e8"
                                  : "#f8d7da",
                              color: user.askedToCancel
                                ? "#856404"
                                : isSubscriptionActive
                                  ? "#388e3c"
                                  : "#721c24",
                            }}
                          >
                            {subscriptionStatus}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: isDesktop ? "flex-end" : "stretch",
                          gap: isDesktop ? 6 : 10,
                          marginTop: "16px",
                          flexDirection: isDesktop ? "row" : "column",
                          width: "100%",
                        }}
                      >
                        {/* {isSubscriptionActive && !user.askedToCancel && (
                          <button
                            onClick={() => setShowModal(true)}
                            style={{
                              ...baseBtnStyle,
                              background: "#dc3545",
                              border: "1px solid #dc3545",
                              color: "#fff",
                            }}
                          >
                            Cancelar Assinatura
                          </button>
                        )} */}

                        <button
                          onClick={() =>
                            window.location.assign(
                              "https://wa.me/5511972369299",
                            )
                          }
                          style={{
                            ...basePrimaryBtnStyle,
                            background: partnerColor(),
                            border: `1px solid ${partnerColor()}`,
                            color: textpartnerColorContrast(),
                          }}
                        >
                          Falar com o suporte para cancelar Assinatura
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          color: "#6c757d",
        }}
      >
        <InstallPWA2 />
      </div>
    </div>
  );
}

export default MyProfile;
