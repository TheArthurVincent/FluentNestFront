import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Application/SelectLanguage/SelectLanguage";
import { MessageDrive } from "./Routes/Message/Message";
import { authorizationToken } from "./App.Styled";
import { MyHeadersType } from "./Resources/types.universalInterfaces";
import {
  backgroundImage,
  backgroundType,
  partnerColor,
  textGeneralFont,
  textTitleFont,
  theBackgroundColor,
} from "./Styles/Styles";
import Login from "./Routes/Login/Login";
import HomePage from "./Routes/HomePage";
import NotFound from "./Routes/NotFound/NotFound";
import RequestResetPassword from "./Routes/ChangePassword/RequestResetPassword";
import ResetPasswordFinalChange from "./Routes/ChangePassword/ResetPasswordFinalChange";
import SignUp from "./Routes/SignUp/SignUp";
import EmailCheck from "./Routes/NewStudentAsaas/EmailCheck";
import FeeNotUpToDate from "./Routes/FeeNotUpToDate";
import LandingPage from "./Routes/LandingPage/LandingPage";
import Redirect from "./Redirect";
import SendMail from "./Routes/LeadsCapture/LeadsCapture";
import SignUpTeacher from "./Routes/SignUp/SignUpTeacher";

export var currentUrl = window.location.href;
export var isArvin = currentUrl.includes("arvinplatform");
export var isLocalHost = currentUrl.includes("localhost");
export var isArthurVincent =
  currentUrl.includes("arthurvincent") || currentUrl.includes("portal") || currentUrl.includes("staging");
export var getWhiteLabel = JSON.parse(
  localStorage.getItem("whiteLabel") || "{}"
);
export var localStorageLoggedIn = JSON.parse(
  localStorage.getItem("loggedIn") || "{}"
);

export var verifyToken = () => {
  var token = localStorage.getItem("authorization");
  return token;
};

var authorization: string = authorizationToken();
var headers: MyHeadersType = {
  Authorization: authorization,
};

function App() {
  var [_StudentId, setStudentId] = useState<string>("");
  useEffect(() => {
    console.log("isArvin?", isArvin);
    console.log("isArthurVincent?", isArthurVincent);
    console.log("isLocalHost?", isLocalHost);
  }, []);
  if (isArthurVincent) {
    document.body.style.backgroundImage = `url("https://ik.imagekit.io/vjz75qw96/assets/icons/eagbggg?updatedAt=1749920491769")`;
  } else if (isArvin || isLocalHost) {
    backgroundType() == "color"
      ? (document.body.style.backgroundColor = theBackgroundColor())
      : (document.body.style.backgroundImage = `url(${backgroundImage()})`);
  }
  useEffect(() => {
    var user = localStorage.getItem("loggedIn");

    var textElement = document.querySelector("body");

    if (textElement) {
      textElement.style.fontFamily = textGeneralFont();
    }

    var hOne = document.querySelector("h1");

    if (hOne) {
      hOne.style.fontFamily = textTitleFont();
      hOne.style.color = partnerColor();
    }

    var hTwo = document.querySelector("h2");
    if (hTwo) {
      hTwo.style.fontFamily = textTitleFont();
      hTwo.style.color = partnerColor();
    }

    var inputElement = document.querySelector("input");
    if (inputElement) {
      inputElement.style.fontFamily = textGeneralFont();
    }

    var selectElement = document.querySelector("select");
    if (selectElement) {
      selectElement.style.fontFamily = textTitleFont();
    }

    var h1Element = document.querySelector("h1");
    if (h1Element) {
      h1Element.style.fontFamily = textTitleFont();
    }

    if (user) {
      try {
        var { id } = JSON.parse(user);
        setStudentId(id || _StudentId);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    }
  }, []);

  // var isOriginal = (): boolean => {
  //   var currentUrl = window.location.href;

  //   if (currentUrl.includes("portal.arthurvincent")) {
  //     // if (currentUrl.includes("localhost:51")) { // teste local
  //     // Remove apenas chaves relacionadas ao portal
  //     Object.keys(localStorage).forEach((key) => {
  //       if (key.includes("portal") || key === "authorization") {
  //         localStorage.removeItem(key);
  //         console.log(`Removed key: ${key}`);
  //       } else {
  //         console.log(`Not key: ${key}`);
  //       }
  //     });
  //     return true;
  //   }

  //   return false;
  // };

  // useEffect(() => {
  //   if (isOriginal()) {
  //     var currentPath = window.location.pathname;
  //     console.log(`http://arthurvincent.com.br${currentPath}`);
  //   }
  // }, []);

  var routes = [
    {
      path: "/login",
      element: verifyToken() ? <Redirect to={"/"} /> : <Login />,
    },
    {
      path: "/*",
      element: verifyToken() ? (
        <HomePage headers={headers} />
      ) : (
        <Redirect to={isArvin ? "/login" : "/cadastre-se"} />
      ),
    },
    {
      path: "/cadastre-se",
      element: isArvin ? <Login /> : <LandingPage />,
    },
    { path: "/signup", element: isArvin ? <Login /> : <LandingPage /> },
    { path: "/message", element: verifyToken() ? <MessageDrive /> : <Login /> },
    { path: "*", element: verifyToken() ? <NotFound /> : <Login /> },
    { path: "/verify-email", element: <EmailCheck /> },
    { path: "/signup-privatestudent", element: <SignUp /> },
    { path: "/signup-teacher", element: <SignUpTeacher /> },
    { path: "/request-reset-password", element: <RequestResetPassword /> },
    { path: "/material-do-video", element: <SendMail /> },
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
