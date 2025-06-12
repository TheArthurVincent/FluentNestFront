import React, { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  updateInfo,
} from "../../Resources/UniversalComponents";
import { alwaysBlack, secondaryColor } from "../../Styles/Styles";
import { NavLink } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { User } from "./types.MyProfile";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { SpanDisapear } from "../Blog/Blog.Styled";
import { notifyError } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import Countdown from "../Ranking/RankingComponents/Countdown";
import { AvatarUpload } from "./Pic";
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#f9f9f9",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    textAlign: "center",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#25D366", // cor do WhatsApp
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
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
  useEffect(() => {
    console.log("fileInputRef.current:", fileInputRef.current);
  }, []);

  const [user, setUser] = useState<User>({} as User);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = React.useRef<any>(null);

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
      setConfirmPassword("");
      setNewPassword("");
      alert("Senha editada com sucesso!");
    } catch (error) {
      onLoggOut();
      alert("Erro ao editar senha");
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const getLoggedUser: User = JSON.parse(
        localStorage.getItem("loggedIn") || ""
      );
      setUser(getLoggedUser);
      console.log(getLoggedUser);
      console.log(user);
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
    { title: UniversalTexts.dateOfBirth, data: formatDateBr(user.dateOfBirth) },
  ];

  const [showModal, setShowModal] = useState(false);

  const cancelSubscription = async () => {
    if (user.subscriptionAsaas) {
      try {
        await axios.delete(
          `${backDomain}/api/v1/asaas/cancel-subscription/${user.id}`
        );
        notifyError("Assinatura cancelada com sucesso.");
        setShowModal(false);
        updateInfo(user.id, headers);
      } catch (err) {
        console.error(err);
        alert("Erro ao cancelar a assinatura.");
      }
      console.log("user.paymentId", user.paymentId, "cancel payment refund");
    } else if (user.paymentId) {
      notifyError(
        "Fale comigo por WhatsApp, e prosseguiei com seu cancelamento. :)"
      );
      setTimeout(() => {
        window.location.assign("https://wa.me/5511915857807");
      }, 2000);
      console.log("user.paymentId", user.paymentId, "cancel payment refund");
    }
  };

  return (
    <>
      {headers ? (
        <RouteDiv className="grid-flex">
          <Helmets text="My Profile" />
          {loading ? (
            <CircularProgress style={{ color: secondaryColor() }} />
          ) : (
            <>
              <div>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    color: alwaysBlack(),
                    padding: "1rem",
                    backgroundColor: "#f7f9fc",
                    borderRadius: "6px",
                  }}
                  className="box-shadow-white"
                >
                  <ArvinButton
                    onClick={() => {
                      alert("Atualizando Perfil");
                      updateInfo(user.id, headers);
                      window.location.reload();
                    }}
                    color="navy"
                    style={{
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <i className="fa fa-refresh" aria-hidden="true" />
                  </ArvinButton>
                  <HOne>{UniversalTexts.myProfile}</HOne>
                  <AvatarUpload
                    user={user}
                    setUser={setUser}
                    uploadStudentPhoto={uploadStudentPhoto}
                  />
                </div>
              </div>
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  marginTop: "2rem",
                }}
                className="box-shadow-white"
              >
                <ul>
                  <li
                    style={{
                      listStyle: "none",
                      padding: "1rem",
                      margin: "1rem 0",
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      color: "#333",
                      position: "relative",
                    }}
                  >
                    <strong>🎁 Seu código promocional:</strong>{" "}
                    <button
                      onClick={copyToClipboard}
                      style={{
                        marginLeft: "1rem",
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: secondaryColor(),
                        color: "#fff",
                      }}
                    >
                      {user.username}
                    </button>
                    {copied && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.9rem",
                          color: "green",
                        }}
                      >
                        Copiado!
                      </span>
                    )}
                    <br />
                    <span style={{ display: "block", marginTop: "0.5rem" }}>
                      Recomende a plataforma a um amigo e ganhe{" "}
                      <strong>R$ 50,00 de desconto</strong> na sua próxima
                      mensalidade!
                    </span>
                  </li>
                  {myProfileList.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        listStyle: "none",
                        padding: "0.5rem 0",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        color: "#333",
                      }}
                    >
                      <SpanDisapear>
                        <b>{item.title}: </b>
                      </SpanDisapear>

                      <span>{item.data}</span>
                    </li>
                  ))}
                  <li
                    style={{
                      listStyle: "none",
                      padding: "0.5rem 0",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                      color: "#333",
                    }}
                  >
                    Tutoree/Aluno Particular? {user.tutoree ? "Yes" : "No"}
                  </li>

                  {user.tutoree && (
                    <li
                      style={{
                        listStyle: "none",
                        padding: "0.5rem 0",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        color: "#333",
                      }}
                    >
                      <NavLink to={user.googleDriveLink} target="blank">
                        {UniversalTexts.googleDriveLink}
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  marginTop: "2rem",
                }}
                className="box-shadow-white"
              >
                {user.askedToCancel && (
                  <div style={styles.container}>
                    {/* @ts-ignore */}
                    <div style={styles.card}>
                      <Countdown
                        text="Você ainda pode usar a plataforma até."
                        targetDate={new Date(user.limitDate)}
                      />
                      <ArvinButton
                        onClick={() =>
                          window.location.assign("https://wa.me/5511915857807")
                        }
                        style={styles.button}
                      >
                        Solicite a reativação do seu cadastro
                      </ArvinButton>
                    </div>
                  </div>
                )}
                {new Date(user.limitCancelDate) > new Date() &&
                !user.subscriptionAsaas &&
                !user.tutoree ? (
                  <div style={styles.container}>
                    {/* @ts-ignore */}
                    <div style={styles.card}>
                      <Countdown
                        text="Você ainda pode solicitar seu reembolso."
                        targetDate={new Date(user.limitCancelDate)}
                      />
                      <ArvinButton
                        onClick={() =>
                          window.location.assign("https://wa.me/5511915857807")
                        }
                        style={styles.button}
                      >
                        💬 Solicitar Reembolso via WhatsApp
                      </ArvinButton>
                    </div>
                  </div>
                ) : (
                  <>
                    {!user.askedToCancel && !user.tutoree && (
                      <>
                        <ArvinButton
                          onClick={() => setShowModal(true)}
                          color="red"
                        >
                          Cancelar Minha Assinatura
                        </ArvinButton>
                      </>
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
                        padding: "2rem",
                        borderRadius: "8px",
                        width: "90%",
                        maxWidth: "400px",
                        textAlign: "center",
                      }}
                    >
                      <h2
                        style={{
                          marginBottom: "1.5rem",
                          color: "#d32f2f",
                        }}
                      >
                        Tem certeza que deseja cancelar sua assinatura?
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <ArvinButton
                          onClick={() => setShowModal(false)}
                          color="green"
                        >
                          Não
                        </ArvinButton>
                        <ArvinButton onClick={cancelSubscription} color="red">
                          Sim
                        </ArvinButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: "2rem",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  marginTop: "2rem",
                }}
                className="box-shadow-white"
              >
                <form style={{ textAlign: "center" }}>
                  <HOne>{UniversalTexts.newPassword}</HOne>
                  <input
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder={UniversalTexts.newPassword}
                    type="password"
                    className="inputs-style"
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      width: "100%",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder={UniversalTexts.confirmNewPassword}
                    type="password"
                    className="inputs-style"
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      width: "100%",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                  <ArvinButton onClick={() => editStudentPassword()}>
                    {UniversalTexts.save}
                  </ArvinButton>
                </form>
              </div>
            </>
          )}
        </RouteDiv>
      ) : (
        <RouteDiv>Nenhum usuário logado</RouteDiv>
      )}
    </>
  );
}

export default MyProfile;
