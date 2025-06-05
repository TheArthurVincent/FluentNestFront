import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Application/SelectLanguage/SelectLanguage";
import { SignUp } from "./Routes/SignUp/SignUp";
import { MessageDrive } from "./Routes/Message/Message";
import { authorizationToken } from "./App.Styled";
import { MyHeadersType } from "./Resources/types.universalInterfaces";
import { textFont, textTitleFont } from "./Styles/Styles";
import Login from "./Routes/Login/Login";
import HomePage from "./Routes/HomePage";
import NotFound from "./Routes/NotFound/NotFound";
import RequestResetPassword from "./Routes/ChangePassword/RequestResetPassword";
import ResetPasswordFinalChange from "./Routes/ChangePassword/ResetPasswordFinalChange";
import NewStudentAsaas from "./Routes/NewStudentAsaas/NewStudentAsaas";

export const verifyToken = () => {
  const token = localStorage.getItem("authorization");
  return token;
};
const authorization: string = authorizationToken();
const headers: MyHeadersType = {
  Authorization: authorization,
};

function App() {
  const [_StudentId, setStudentId] = useState<string>("");

  const checkLocalBackground = () => {
    if (window.location.hostname === "localhost") {
      document.body.style.backgroundColor = "#444";
    } else if (
      window.location.hostname === "arvin-staging.9kwq6c.easypanel.host" ||
      window.location.hostname.includes("easypanel")
    ) {
      document.body.style.backgroundColor = "#f0f0f0";
    }
  };
  useEffect(() => {
    checkLocalBackground();

    const user = localStorage.getItem("loggedIn");

    const textElement = document.querySelector("div");
    if (textElement) {
      textElement.style.fontFamily = textFont();
    }

    const inputElement = document.querySelector("input");
    if (inputElement) {
      inputElement.style.fontFamily = textFont();
    }

    const selectElement = document.querySelector("select");
    if (selectElement) {
      selectElement.style.fontFamily = textTitleFont();
    }

    const h1Element = document.querySelector("h1");
    if (h1Element) {
      h1Element.style.fontFamily = textTitleFont();
    }

    if (user) {
      try {
        const { id } = JSON.parse(user);
        setStudentId(id || _StudentId);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    }
  }, []);

  const routes = [
    { path: "/login", element: <Login /> },
    {
      path: "/*",
      element: verifyToken() ? <HomePage headers={headers} /> : <Login />,
    },
    { path: "/message", element: verifyToken() ? <MessageDrive /> : <Login /> },
    { path: "*", element: verifyToken() ? <NotFound /> : <Login /> },
    { path: "/signup", element: <NewStudentAsaas /> },
    { path: "/signup-privatestudent", element: <SignUp /> },
    { path: "/request-reset-password", element: <RequestResetPassword /> },
    { path: "/reset-password/*", element: <ResetPasswordFinalChange /> },
  ];

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
