import React from "react";
import ReactDOM from "react-dom/client";
import "./Styles/styles.css";
import App from "./App";
import { initializeOneSignal } from "./services/oneSignalConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// NÃO registrar Service Worker manual - deixar VitePWA gerenciar
// O VitePWA já está configurado no vite.config.js e gerencia automaticamente

// Inicializar OneSignal após o carregamento da página
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Aguardar 2 segundos para não atrasar o carregamento inicial
    setTimeout(() => {
      initializeOneSignal();
    }, 2000);
  });
}
