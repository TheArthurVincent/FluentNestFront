import React, { useEffect, useState } from "react";
import { HOne } from "../Resources/Components/RouteBox";
import { partnerColor } from "../Styles/Styles";
import { myLogoDone } from "./NewStudentAsaas/EmailCheck";
import {
  formatDateBrWithHour,
  onLoggOut,
} from "../Resources/UniversalComponents";
import Countdown from "./Ranking/RankingComponents/Countdown";
import { User } from "./MyProfile/types.MyProfile";

export function SubscriptionExpired() {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    try {
      var getLoggedUser: User = JSON.parse(
        localStorage.getItem("loggedIn") || ""
      );
      setUser(getLoggedUser);
      if (new Date(getLoggedUser.limitDate) > new Date()) {
        window.location.assign("/");
      }
    } catch (e) {
      console.log(e);
      onLoggOut();
    }
  }, []);
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
      boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
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
  return (
    <div
      style={{
        height: "500px",
        width: "500px",
        display: "flex",
        margin: "auto",
        marginTop: "10rem",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "20px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
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
      <HOne>Sua assinatura está desativada!</HOne>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Para renovar seu pagamento, entre em contato conosco:
      </p>

      {user.askedToCancel && (
        <div style={styles.modernSection}>
          <div style={styles.container}>
            <div style={styles.card}>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionExpired;
