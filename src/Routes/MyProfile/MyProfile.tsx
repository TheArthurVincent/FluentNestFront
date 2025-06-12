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
  const { UniversalTexts } = useUserContext();

  const [user, setUser] = useState<User>({} as User);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
        alert("Assinatura cancelada com sucesso.");
        setShowModal(false);
        updateInfo();
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
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <i className="fa fa-refresh" aria-hidden="true" />
                  </ArvinButton>
                  <HOne>{UniversalTexts.myProfile}</HOne>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                      paddingBottom: "1.5rem",
                    }}
                  >
                    <img
                      style={{
                        width: "8rem",
                        height: "8rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      className="box-shadow-white"
                      src={user.picture}
                      alt="Profile"
                    />
                    <ul>
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
                !user.subscriptionAsaas ? (
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
                  <Button
                    style={{
                      color: "#fff",
                      backgroundColor: "#138017",
                      padding: "0.75rem 2rem",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => editStudentPassword()}
                  >
                    {UniversalTexts.save}
                  </Button>
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
