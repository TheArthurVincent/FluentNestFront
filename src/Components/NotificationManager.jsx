import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { OneSignalService } from "../services/oneSignalConfig";
import styled from "styled-components";

const NotificationManager = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();

    // Mostrar prompt após 5 segundos se não estiver inscrito
    const timer = setTimeout(() => {
      if (!isSubscribed && permission === "default") {
        setShowPrompt(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const subscribed = await OneSignalService.isSubscribed();
      const id = await OneSignalService.getUserId();
      const perm = await OneSignalService.getNotificationPermission();

      setIsSubscribed(subscribed);
      setUserId(id);
      setPermission(perm);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const success = await OneSignalService.requestPermission();

      if (success) {
        // Adicionar tags básicas do usuário
        await OneSignalService.setTags({
          fonte: "pwa",
          plataforma: "web",
          dataInscricao: new Date().toISOString(),
          idioma: navigator.language || "pt-BR",
        });

        // Enviar evento de conversão
        await OneSignalService.sendOutcome("notification_subscribed");

        await checkSubscriptionStatus();
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Erro ao inscrever:", error);
      alert("Erro ao ativar notificações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm("Deseja realmente desativar as notificações?")) {
      return;
    }

    setLoading(true);
    try {
      await OneSignalService.unsubscribe();
      await checkSubscriptionStatus();
      setShowPrompt(false);
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao desativar notificações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Salvar no localStorage para não mostrar por 7 dias
    const dismissedUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "notification-prompt-dismissed",
      dismissedUntil.toString()
    );
  };

  // Verificar se o prompt foi dispensado recentemente
  useEffect(() => {
    const dismissed = localStorage.getItem("notification-prompt-dismissed");
    if (dismissed) {
      const dismissedUntil = parseInt(dismissed);
      if (Date.now() < dismissedUntil) {
        setShowPrompt(false);
      }
    }
  }, []);

  // Não mostrar nada se já negou ou se está inscrito
  if (permission === "denied" || (isSubscribed && !showPrompt)) {
    return null;
  }

  return (
    <>
      {/* Prompt de Inscrição */}
      {showPrompt && !isSubscribed && permission !== "denied" && (
        <PromptContainer>
          <PromptContent>
            <CloseButton onClick={handleDismiss} aria-label="Fechar">
              ✕
            </CloseButton>

            <IconContainer>
              <BellIcon>🔔</BellIcon>
              <PulseRing />
            </IconContainer>

            <TextContent>
              <Title>Ativar Notificações Push?</Title>
              <Description>
                Receba lembretes de aulas, novidades e conteúdos exclusivos do{" "}
                <strong>ARVIN</strong>
              </Description>
              <Benefits>
                <Benefit>✓ Novas aulas disponíveis</Benefit>
                <Benefit>✓ Lembretes de exercícios</Benefit>
                <Benefit>✓ Conteúdos exclusivos</Benefit>
              </Benefits>
            </TextContent>

            <ButtonGroup>
              <Button onClick={handleSubscribe} primary disabled={loading}>
                {loading ? "Ativando..." : "🔔 Sim, quero receber!"}
              </Button>
              <Button onClick={handleDismiss} disabled={loading}>
                Agora não
              </Button>
            </ButtonGroup>

            <PrivacyNote>Você pode cancelar a qualquer momento</PrivacyNote>
          </PromptContent>
        </PromptContainer>
      )}

      {/* Badge de Status (quando inscrito) */}
      {isSubscribed && (
        <StatusBadge>
          <BadgeContent>
            <CheckIcon>✓</CheckIcon>
            <BadgeText>Notificações ativadas</BadgeText>
            <SettingsButton
              onClick={handleUnsubscribe}
              title="Desativar notificações"
            >
              ⚙️
            </SettingsButton>
          </BadgeContent>
        </StatusBadge>
      )}
    </>
  );
};

// Styled Components
const PromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 420px;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes slideIn {
    from {
      transform: translateX(500px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    bottom: 10px;
    max-width: none;
  }
`;

const PromptContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const BellIcon = styled.div`
  font-size: 56px;
  z-index: 2;
  animation: bellRing 2s ease-in-out infinite;

  @keyframes bellRing {
    0%,
    100% {
      transform: rotate(0deg);
    }
    10%,
    30% {
      transform: rotate(-10deg);
    }
    20%,
    40% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(0deg);
    }
  }
`;

const PulseRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const Description = styled.p`
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;

  strong {
    font-weight: 700;
  }
`;

const Benefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const Benefit = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  padding-left: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) =>
    props.primary
      ? `
    background: white;
    color: #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:hover:not(:disabled) { 
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover:not(:disabled) { 
      background: rgba(255, 255, 255, 0.3);
    }
  `}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrivacyNote = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: -8px;
`;

const StatusBadge = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
  }
`;

const BadgeContent = styled.div`
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
`;

const CheckIcon = styled.span`
  font-size: 18px;
  width: 24px;
  height: 24px;
  background: white;
  color: #11998e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const BadgeText = styled.span`
  flex: 1;
`;

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

export default NotificationManager;
