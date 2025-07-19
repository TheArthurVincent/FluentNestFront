(function ensureWhiteLabel() {
  try {
    const wl = localStorage.getItem("whiteLabel");
    if (!wl) {
      // Monta objeto padrão
      const defaultWL = {
        backgroundType: "color",
        color: "rgba(236, 236, 236, 1)",
        backgroundColor: "rgba(188, 221, 248, 1)",
        contrastColor: "#eee",
        backgroundImage:
          "https://ik.imagekit.io/vjz75qw96/assets/icons/eagbggg?updatedAt=1749920491769",
        logo: "https://ik.imagekit.io/vjz75qw96/logos/arvin-platform-final?updatedAt=1752033415166",
        textGeneralFont: "Lato",
        textTitleFont: "Athiti",
      };
      localStorage.setItem("whiteLabel", JSON.stringify(defaultWL));
      console.log("[App] WhiteLabel padrão criado no localStorage.");
    }
  } catch (err) {
    console.error("[App] Erro ao garantir whiteLabel no localStorage:", err);
  }
})();

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
  textPrimaryColorContrast,
  logoPartner,
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
  currentUrl.includes("arthurvincent") ||
  currentUrl.includes("portal") ||
  currentUrl.includes("staging");

export var getWhiteLabel = (() => {
  try {
    const wl = localStorage.getItem("whiteLabel");
    if (wl) {
      const parsed = JSON.parse(wl);
      return {
        backgroundType: parsed.backgroundType ?? backgroundType(),
        color: parsed.color ?? partnerColor(),
        backgroundColor: parsed.backgroundColor ?? theBackgroundColor(),
        contrastColor: parsed.contrastColor ?? textPrimaryColorContrast(),
        backgroundImage: parsed.backgroundImage ?? backgroundImage(),
        logo: parsed.logo ?? logoPartner(),
        textGeneralFont: parsed.textGeneralFont ?? textGeneralFont(),
        textTitleFont: parsed.textTitleFont ?? textTitleFont(),
      };
    }
  } catch (err) {
    console.error("[App] Erro ao fazer parse do whiteLabel:", err);
  }
  // Se não existe ou erro, retorna todos os padrões
  return {
    backgroundType: backgroundType(),
    color: partnerColor(),
    backgroundColor: theBackgroundColor(),
    contrastColor: textPrimaryColorContrast(),
    backgroundImage: backgroundImage(),
    logo: logoPartner(),
    textGeneralFont: textGeneralFont(),
    textTitleFont: textTitleFont(),
  };
})();

export var localStorageLoggedIn = (() => {
  try {
    const li = localStorage.getItem("loggedIn");
    if (li) {
      const parsed = JSON.parse(li);
      return parsed;
    }
    return {};
  } catch (err) {
    return {};
  }
})();

export var verifyToken = () => {
  try {
    var token = localStorage.getItem("authorization");
    return token;
  } catch (err) {
    console.error("[App] Erro ao buscar token:", err);
    return null;
  }
};

var authorization: string = authorizationToken();
var headers: MyHeadersType = {
  Authorization: authorization,
};

function App() {
  var [_StudentId, setStudentId] = useState<string>("");

  useEffect(() => {
    try {
      console.log("[App] isArvin?", isArvin);
      console.log("[App] isArthurVincent?", isArthurVincent);
      console.log("[App] isLocalHost?", isLocalHost);
    } catch (err) {
      console.error("[App] Erro nos logs iniciais:", err);
    }
  }, []);

  try {
    if (isArthurVincent) {
      document.body.style.backgroundImage = `url("https://ik.imagekit.io/vjz75qw96/assets/icons/eagbggg?updatedAt=1749920491769")`;
    } else if (isArvin || isLocalHost) {
      if (backgroundType() == "color") {
        document.body.style.backgroundColor = theBackgroundColor();
      } else {
        document.body.style.backgroundImage = `url(${backgroundImage()})`;
      }
    }
  } catch (err) {
    console.error("[App] Erro ao definir background:", err);
  }

  useEffect(() => {
    try {
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
          console.log("[App] ID do estudante setado:", id);
        } catch (error) {
          console.error(
            "[App] Erro ao fazer parse do JSON do usuário:",
            error,
            user
          );
        }
      }
    } catch (err) {
      console.error("[App] Erro no useEffect de estilos e usuário:", err);
    }
  }, []);

  var routes = [
    {
      path: "/login",
      element: (() => {
        try {
          return verifyToken() ? <Redirect to={"/"} /> : <Login />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /login:", err);
          return <Login />;
        }
      })(),
    },
    {
      path: "/*",
      element: (() => {
        try {
          return verifyToken() ? (
            <HomePage headers={headers} />
          ) : (
            <Redirect to={isArvin ? "/login" : "/cadastre-se"} />
          );
        } catch (err) {
          console.error("[App] Erro ao definir rota /*:", err);
          return <NotFound />;
        }
      })(),
    },
    {
      path: "/cadastre-se",
      element: (() => {
        try {
          return isArvin ? <Login /> : <LandingPage />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /cadastre-se:", err);
          return <Login />;
        }
      })(),
    },
    {
      path: "/signup",
      element: (() => {
        try {
          return isArvin ? <Login /> : <LandingPage />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /signup:", err);
          return <Login />;
        }
      })(),
    },
    {
      path: "/message",
      element: (() => {
        try {
          return verifyToken() ? <MessageDrive /> : <Login />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /message:", err);
          return <Login />;
        }
      })(),
    },
    {
      path: "*",
      element: (() => {
        try {
          return verifyToken() ? <NotFound /> : <Login />;
        } catch (err) {
          console.error("[App] Erro ao definir rota *:", err);
          return <Login />;
        }
      })(),
    },
    {
      path: "/verify-email",
      element: <EmailCheck />,
    },
    {
      path: "/signup-privatestudent",
      element: <SignUp />,
    },
    {
      path: "/signup-teacher",
      element: <SignUpTeacher />,
    },
    {
      path: "/request-reset-password",
      element: <RequestResetPassword />,
    },
    {
      path: "/material-do-video",
      element: <SendMail />,
    },
    {
      path: "/reset-password/*",
      element: <ResetPasswordFinalChange />,
    },
    {
      path: "/feenotuptodate",
      element: <FeeNotUpToDate />,
    },
  ];

  return (
    <UserProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            try {
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            } catch (err) {
              console.error(
                `[App] Erro ao renderizar rota ${route.path}:`,
                err
              );
              return null;
            }
          })}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
