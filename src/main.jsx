import React from "react";
import ReactDOM from "react-dom/client";
import "./Styles/styles.css";
import App from "./App";
import { initializeOneSignal } from "./services/oneSignalConfig";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
// ReactDOM.createRoot(document.getElementById("root")).render(<App />);

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      initializeOneSignal();
    }, 2000);
  });
}
