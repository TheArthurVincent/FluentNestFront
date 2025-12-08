import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";

const InstallPromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 9999;
  max-width: 90%;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const InstallButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
  }
`;

const DismissButton = styled.button`
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

function isMobileDevice() {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

const InstallPWA2 = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobile = isMobileDevice();
    setIsMobile(mobile);

    // se não for mobile, nem segue
    if (!mobile) return;

    // não mostrar se o usuário já instalou
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS PWA
      window.navigator.standalone === true;

    if (isStandalone) return;

    // não mostrar se usuário recusou recentemente (7 dias)
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDaysInMs) {
        return;
      }
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstallPrompt(false);

    if (outcome === "dismissed") {
      localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // só renderiza se:
  // - for mobile
  // - e tivermos permissão pra mostrar
  if (!isMobile || !showInstallPrompt) {
    return null;
  }

  if (typeof document === "undefined") return null;

  // PORTAL: cola o fixed direto no documento principal
  return createPortal(
    <div>
      <div>
        <strong>Instalar ARVIN</strong>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
          Instale o app para acesso rápido
        </p>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <InstallButton onClick={handleInstallClick}>Instalar</InstallButton>
        <DismissButton onClick={handleDismiss}>Agora não</DismissButton>
      </div>
    </div>,
    document.body
  );
};

export default InstallPWA2;
