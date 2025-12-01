try {
  const wl = localStorage.getItem("whiteLabel");
  if (!wl) {
    const defaultWL = {
      color: "#ed5914",
      contrastColor: "#eee",
      logo: "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Profile-White.png?updatedAt=1756235005135",
    };
    localStorage.setItem("whiteLabel", JSON.stringify(defaultWL));
  }
} catch (err) {
  console.warn("[App] WhiteLabel localStorage falhou:", err);
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Application/SelectLanguage/SelectLanguage";
import { MessageDrive } from "./Routes/Message/Message";
import { authorizationToken } from "./App.Styled";
import { MyHeadersType } from "./Resources/types.universalInterfaces";
import {
  partnerColor,
  textPrimaryColorContrast,
  logoPartner,
} from "./Styles/Styles";
import HomePage from "./Routes/HomePage";
import NotFound from "./Routes/NotFound/NotFound";
import RequestResetPassword from "./Routes/ChangePassword/RequestResetPassword";
import ResetPasswordFinalChange from "./Routes/ChangePassword/ResetPasswordFinalChange";
import SignUp from "./Routes/SignUp/SignUp";
import EmailCheck from "./Routes/NewStudentAsaas/EmailCheck";
import FeeNotUpToDate from "./Routes/FeeNotUpToDate";
import Redirect from "./Redirect";
import SendMail from "./Routes/LeadsCapture/LeadsCapture";
import SignUpTeacher from "./Routes/SignUp/SignUpTeacher";
import HomePageResponsibleArea from "./Routes/ResponsibleArea/HomePageResponsibleArea";
import SubscriptionExpired from "./Routes/SubscriptionExpired";
import ArvinLandingPageNew from "./Routes/LandingPage/ArvinLandingPageNew/ArvinLandingPageNew";
import InstallPWA from "./Components/InstallPWA";
import NotificationManager from "./Components/NotificationManager";
import LoginComponent from "./Routes/LoginComponent/LoginComponent";
import ArvinNewHomePage from "./Routes/ArvinNewHomePage";
import StudentPage from "./Routes/ArvinComponents/Students/TheStudent/TheStudent";

export var currentUrl = window.location.href;
export var isLocalHost = currentUrl.includes("localhost");
export var isStaging = currentUrl.includes("staging");
export var isArthurVincent =
  currentUrl.includes("arthurvincent") || isStaging || isLocalHost;
export var isArvin = currentUrl.includes("arvinplatform");
export var isPortal = currentUrl.includes("portal");
export var isArvinLandingPage = isArvin && !isPortal;

export var getWhiteLabel = (() => {
  try {
    const wl = localStorage.getItem("whiteLabel");
    if (wl) {
      const parsed = JSON.parse(wl);
      return {
        color: parsed.color ?? partnerColor(),
        contrastColor: parsed.contrastColor ?? textPrimaryColorContrast(),
        logo: parsed.logo ?? logoPartner(),
      };
    }
  } catch (err) {
    console.error("[App] Erro ao fazer parse do whiteLabel:", err);
  }
  // Se não existe ou erro, retorna todos os padrões
  return {
    color: partnerColor(),
    contrastColor: textPrimaryColorContrast(),
    logo: logoPartner(),
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

// Função para decodificar JWT no browser (sem dependências externas)
function decodeJWT(token: string) {
  try {
    // Dividir o token em suas partes
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decodificar a parte do payload (segunda parte)
    const payload = parts[1];

    // Adicionar padding se necessário (Base64 URL decode)
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    // Decodificar base64
    const decoded = atob(base64);

    // Converter para objeto JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
}

export var verifyToken = () => {
  try {
    var token = localStorage.getItem("authorization");
    if (!token || token.trim() === "") {
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Verificar se o token tem o formato correto (3 partes separadas por pontos)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.warn("[App] Token JWT não possui formato válido");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Decodificar o JWT para verificar se ainda é válido
    const decodedToken = decodeJWT(token);
    if (!decodedToken || typeof decodedToken !== "object") {
      console.warn("[App] Token JWT não pode ser decodificado");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Verificar se o token tem as propriedades mínimas necessárias
    if (!decodedToken.exp) {
      console.warn("[App] Token JWT não possui data de expiração");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Verificar se o token expirou
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      console.warn("[App] Token JWT expirado");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Verificar se o token ainda não é válido (nbf - not before)
    if (decodedToken.nbf && decodedToken.nbf > currentTime) {
      console.warn("[App] Token JWT ainda não é válido");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    // Verificar se o token foi emitido no futuro (iat - issued at)
    if (decodedToken.iat && decodedToken.iat > currentTime + 300) {
      // 5 minutos de tolerância para diferenças de relógio
      console.warn("[App] Token JWT emitido no futuro");
      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("studentData");
      return false;
    }

    console.log("[App] Token JWT válido...");
    return true;
  } catch (err) {
    console.error("[App] Erro ao verificar token:", err);
    return false;
  }
};

// Função para validar o token com o servidor (opcional, para validação mais rigorosa)
export var verifyTokenWithServer = async () => {
  try {
    const token = localStorage.getItem("authorization");
    if (!verifyToken()) {
      return false;
    }

    // Importar axios de forma dinâmica para evitar problemas de dependência circular
    const { default: axios } = await import("axios");
    const { isDev } = await import("./Resources/UniversalComponents");
    const backDomain = isDev();

    const response = await axios.get(`${backDomain}/api/v1/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (err) {
    console.error("[App] Erro ao verificar token com servidor:", err);
    return false;
  }
};

var authorization: string = authorizationToken();
var headers: MyHeadersType = {
  Authorization: authorization,
};

function App() {
  var [_StudentId, setStudentId] = useState<string>("");

  const [isResponsible, setIsResponsible] = useState<boolean>(false);

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
      ["h1", "h2"].forEach((tag) => {
        const el = document.querySelector(tag);
        if (el && el instanceof HTMLElement) {
          el.style.color = partnerColor();
        }
      });

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
            <ArvinNewHomePage headers={headers} />
          ) : (
            <Redirect to={"/login"} />
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
        return <ArvinLandingPageNew />;
      })(),
    },
    {
      path: "/login2",
      element: <LoginComponent />,
    },
    {
      path: "/login",
      element: (() => {
        try {
          return verifyToken() ? <Redirect to={"/"} /> : <LoginComponent />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /login:", err);
          return <LoginComponent />;
        }
      })(),
    },
    {
      path: "/cadastre-se",
      element: <Redirect to={"/login"} />,
    },
    {
      path: "/message",
      element: (() => {
        try {
          return verifyToken() ? <MessageDrive /> : <LoginComponent />;
        } catch (err) {
          console.error("[App] Erro ao definir rota /message:", err);
          return <LoginComponent />;
        }
      })(),
    },
    {
      path: "*",
      element: (() => {
        try {
          return verifyToken() ? <NotFound /> : <LoginComponent />;
        } catch (err) {
          console.error("[App] Erro ao definir rota *:", err);
          return <LoginComponent />;
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
        {/* <InstallPWA /> */}
        <NotificationManager />
      </Router>
    </UserProvider>
  );
}

export default App;
