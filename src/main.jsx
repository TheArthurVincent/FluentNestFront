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

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Inicializar OneSignal após o carregamento da página
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Aguardar 2 segundos para não atrasar o carregamento inicial
    setTimeout(() => {
      initializeOneSignal();
    }, 2000);
  });
}
