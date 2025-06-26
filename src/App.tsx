import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Application/SelectLanguage/SelectLanguage";
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
import SignUp from "./Routes/SignUp/SignUp";
import EmailCheck from "./Routes/NewStudentAsaas/EmailCheck";
import FeeNotUpToDate from "./Routes/FeeNotUpToDate";
import LandingPage from "./Routes/LandingPage/LandingPage";
import Redirect from "./Redirect";

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
      document.body.style.backgroundColor = "#000";
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

  const isOriginal = (): boolean => {
    const currentUrl = window.location.href;

    if (currentUrl.includes("portal.arthurvincent")) {
      // if (currentUrl.includes("localhost:51")) { // teste local
      // Remove apenas chaves relacionadas ao portal
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("portal") || key === "authorization") {
          localStorage.removeItem(key);
          console.log(`Removed key: ${key}`);
        } else {
          console.log(`Not key: ${key}`);
        }
      });
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (isOriginal()) {
      const currentPath = window.location.pathname;
      window.location.assign(`http://arthurvincent.com.br${currentPath}`);
      console.log(`http://arthurvincent.com.br${currentPath}`);
    }
  }, []);

  const routes = [
    {
      path: "/login",
      element: verifyToken() ? <Redirect /> : <Login />,
    },
    {
      path: "/*",
      element: verifyToken() ? <HomePage headers={headers} /> : <LandingPage />,
    },
    {
      path: "/cadastre-se",
      element: <LandingPage />,
    },
    { path: "/message", element: verifyToken() ? <MessageDrive /> : <Login /> },
    { path: "*", element: verifyToken() ? <NotFound /> : <Login /> },
    { path: "/signup", element: <NewStudentAsaas /> },
    { path: "/verify-email", element: <EmailCheck /> },
    { path: "/signup-privatestudent", element: <SignUp /> },
    { path: "/request-reset-password", element: <RequestResetPassword /> },
    { path: "/reset-password/*", element: <ResetPasswordFinalChange /> },
    { path: "/feenotuptodate", element: <FeeNotUpToDate /> },
  ];

  return (
    <UserProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
