// WhiteLabel: protege localStorage
try {
  const wl = localStorage.getItem("whiteLabel");
  if (!wl) {
    const defaultWL = {
      backgroundType: "color",
      color: "#ed5914",
      backgroundColor: "#e7e7e7ff",
      contrastColor: "#eee",
      backgroundImage: "",
      logo: "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Profile-White.png?updatedAt=1756235005135",
      textGeneralFont: "Roboto",
      textTitleFont: "Teko",
    };
    localStorage.setItem("whiteLabel", JSON.stringify(defaultWL));
  }
} catch (err) {
  // Não trava a página
  console.warn("[App] WhiteLabel localStorage falhou:", err);
}

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
import LandingPageArvin from "./Routes/LandingPage/LandingPageArvin";
import HomePageResponsibleArea from "./Routes/ResponsibleArea/HomePageResponsibleArea";
import SubscriptionExpired from "./Routes/SubscriptionExpired";

export var currentUrl = window.location.href;
export var isLocalHost = currentUrl.includes("localhost");
export var isArthurVincent =
  currentUrl.includes("arthurvincent") ||
  currentUrl.includes("staging") ||
  isLocalHost;
export var isArvin = currentUrl.includes("arvinplatform");
export var isPortal = currentUrl.includes("portal");
export var isArvinLandingPage = isArvin && !isPortal;
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

  // Protege manipulação do DOM
  try {
    document.body.style.backgroundColor = theBackgroundColor();
    document.body.style.backgroundImage = "";
  } catch (err) {
    console.warn("[App] Erro ao definir background:", err);
  }

  const [isResponsible, setIsResponsible] = useState<boolean>(false);
  useEffect(() => {}, []);

  useEffect(() => {
    try {
      const user = localStorage.getItem("loggedIn");

      try {
        const user = localStorage.getItem("loggedIn");
        if (user) {
          const userHereJSON = JSON.parse(user);
          if (userHereJSON.responsible) {
            setIsResponsible(true);
          }
        }
      } catch (err) {
        console.warn("[App] Erro ao verificar responsável:", err);
      }
      // Aplica fontes apenas se existir
      document.body.style.fontFamily = textGeneralFont();
      // Aplica em h1/h2 apenas se existir
      ["h1", "h2"].forEach((tag) => {
        const el = document.querySelector(tag);
        if (el && el instanceof HTMLElement) {
          el.style.fontFamily = textTitleFont();
          el.style.color = partnerColor();
        }
      });
      // Aplica em input/select apenas se existir
      const inputEl = document.querySelector("input");
      if (inputEl) inputEl.style.fontFamily = textGeneralFont();
      const selectEl = document.querySelector("select");
      if (selectEl) selectEl.style.fontFamily = textTitleFont();

      if (user) {
        try {
          const { id } = JSON.parse(user);
          if (id && id !== _StudentId) setStudentId(id);
        } catch (error) {
          console.warn(
            "[App] Erro ao fazer parse do JSON do usuário:",
            error,
            user
          );
        }
      }
    } catch (err) {
      // Não trava a página
      console.warn("[App] Erro no useEffect de estilos e usuário:", err);
    }
  }, []);

  var routes = [
    {
      path: "/*",
      element: (() => {
        try {
          return isArvinLandingPage ? (
            <Redirect to={"/lp"} />
          ) : verifyToken() ? (
            <HomePage headers={headers} />
          ) : (
            <Redirect to={isLocalHost ? "/login" : "/cadastre-se"} />
          );
        } catch (err) {
          console.error("[App] Erro ao definir rota /*:", err);
          return <NotFound />;
        }
      })(),
    },

    {
      path: "/lp",
      element: (() => {
        return <LandingPageArvin />;
      })(),
    },
    {
      path: "/cadastre-se",
      element: (() => {
        try {
          return isPortal ? <Login /> : <LandingPage />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /cadastre-se:", err);
          return <Login />;
        }
      })(),
    },
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
      path: "/signup",
      element: (() => {
        try {
          return <Login />;
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
    {
      path: "/subscription-expired",
      element: <SubscriptionExpired />,
    },
  ];
  var routesResponsible = [
    {
      path: "/",

      element: (() => {
        try {
          return verifyToken() ? (
            <HomePageResponsibleArea headers={headers} />
          ) : isArvinLandingPage ? (
            <Redirect to={"/lp"} />
          ) : (
            <Redirect to={"/login"} />
          );
        } catch (err) {
          console.error("[App] Erro ao definir rota /*:", err);
          return <NotFound />;
        }
      })(),
    },
  ];

  return (
    <UserProvider>
      <Router>
        <Routes>
          {(isResponsible ? routesResponsible : routes).map((route, index) => {
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
