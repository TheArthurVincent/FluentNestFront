import React, { useState } from "react";
import "font-awesome/css/font-awesome.min.css";
import Helmets from "../../Resources/Helmets";
import { backDomain, InputField } from "../../Resources/UniversalComponents";
import axios from "axios";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { RouteDiv } from "../../Resources/Components/RouteBox";

function ResetPasswordFinalChange() {
  const [Password, setPassword] = useState<string>("");
  const [Password1, setPassword1] = useState<string>("");

  const handleSendPassword = async () => {
    const str = window.location.pathname;
    const match = str.split("/");
    const id = match ? match[2] : null;
    console.log(id);

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/resetpasswordfinal/${id}`,
        {
          newPassword: Password,
        }
      );
      setTimeout(() => {
        alert("Senha alterada");
        window.location.assign("/login");
      }, 500);
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };
  return (
    <div
      style={{
        backgroundColor: "white",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "10px",
        }}
      >
        <Helmets text={"Reset Password"} />
        <form onSubmit={handleSendPassword}>
          <InputField
            value={Password}
            onChange={(event: any) => setPassword(event.target.value)}
            id="name"
            placeholder="Nova Senha"
            type="password"
          />{" "}
          <InputField
            value={Password1}
            onChange={(event: any) => setPassword1(event.target.value)}
            id="name"
            placeholder="Confirmar Nova Senha"
            type="password"
          />
          <ArvinButton
            type="submit"
            style={{
              display: "flex",
              marginLeft: "auto",
            }}
            disabled={Password1 !== Password}
          >
            Alterar Senha
          </ArvinButton>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordFinalChange;
