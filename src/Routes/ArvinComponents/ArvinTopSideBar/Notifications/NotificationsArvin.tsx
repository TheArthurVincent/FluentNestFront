import React, { FC, useEffect, useRef, useState } from "react";
import { BellIcon } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import {
  backDomain,
  formatDateBr,
  registerUser,
} from "../../../../Resources/UniversalComponents";
import { Modal } from "@mui/material";
import { Link } from "react-router-dom";

/* =========================================================
   UI TOKENS (cores, raios, sombras) — NÃO ALTERAR ESTILO
   ========================================================= */
const UI = {
  bg: "#ffffff",
  border: "#E3E8F0",
  text: "#0f172a",
  subtext: "#65748C",
  radiusLg: 16,
  radiusSm: 8,
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 10px 20px rgba(2,6,23,0.06)",
};

/* =========================================================
   COMPONENTE
   ========================================================= */
type NotificationsArvinProps = {
  appLoaded?: boolean;
};

export const NotificationsArvin: FC<NotificationsArvinProps> = ({
  appLoaded,
}) => {
  /* ---------------- State ---------------- */
  // Visibilidade do dropdown (popover) com a lista de notificações.
  const [dropdownNotificationsVisible, setDropdownNotificationsVisible] =
    useState(false);

  // ID do usuário logado (obtido do localStorage).
  const { id } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  // Contador para badge (total de notificações não lidas).
  const [theNotifications, setTheNotifications] = useState(0);

  // Lista de notificações retornadas pelo backend.
  const [myNotifications, setMyNotifications] = useState<any[]>([]);

  // Notificação selecionada para abrir no modal.
  const [selectedNotification, setSelectedNotification] = useState<any>({});

  // Visibilidade do modal de “Notificação”.
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Ref para detectar clique fora do popover.
  const popoverRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- API: Atualiza contador e lista ---------------- */
  const updateNumberOfNotifications = async (userId: any) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/numberofnotifications/${userId}`
      );

      const notifications = response.data.notifications; // número p/ badge
      const listOfNotifications = response.data.listOfNotifications; // lista p/ dropdown

      localStorage.setItem("notifications", JSON.stringify(notifications));
      setTheNotifications(notifications);
      setMyNotifications(listOfNotifications);

      // Registro do usuário (mantido conforme lógica existente)
      registerUser(userId);
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  useEffect(() => {
    updateNumberOfNotifications(id);
  }, [id, appLoaded]);

  /* ---------------- API: Marca uma notificação como 'visualizada' ---------------- */
  const updateViewed = async (notificationId: any) => {
    try {
      await axios.put(`${backDomain}/api/v1/notification/${notificationId}`);
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  /* ---------------- API: Marca todas como 'vistas' ---------------- */
  const handleSeeAll = async () => {
    try {
      await axios.put(`${backDomain}/api/v1/notificationsseeall/${id}`);
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  /* ---------------- Handlers (cliques / interações) ---------------- */
  // Fecha o modal e atualiza contadores/listas.
  const handleClose = () => {
    updateNumberOfNotifications(id);
    setModalOpen(false);
  };

  // Abre modal de uma notificação específica e marca-a como vista.
  const openModal = (notification: any) => {
    setSelectedNotification(notification);
    updateViewed(notification._id);
    setModalOpen(true);
    setDropdownNotificationsVisible(false);
  };

  /* ---------------- Efeito: Clique-fora para fechar dropdown ----------------
     Mantido o comportamento original: sempre que houver 'mousedown', chamamos
     handleSeeAll(); e se o clique for fora do popover enquanto ele estiver aberto,
     fechamos o dropdown e atualizamos as notificações.
  ----------------------------------------------------------------------------- */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownNotificationsVisible &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        updateNumberOfNotifications(id);
        setDropdownNotificationsVisible(false);
      }
      handleSeeAll();
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownNotificationsVisible]);

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {/* --------- POPOVER / DROPDOWN DE NOTIFICAÇÕES --------- */}
        <div
          ref={popoverRef}
          style={{ position: "relative", display: "inline-block" }}
        >
          {/* Botão do sino (abre/fecha dropdown) + badge */}
          <div
            onClick={() => {
              setDropdownNotificationsVisible(!dropdownNotificationsVisible);
              updateNumberOfNotifications(id);
            }}
            aria-haspopup="menu"
            aria-expanded={dropdownNotificationsVisible}
            style={{
              position: "relative",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            <BellIcon weight="bold" color="#65748C" size={24} />

            {theNotifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: 15,
                  backgroundColor: "red",
                  color: "white",
                  fontSize: 8,
                  fontWeight: 700,
                  width: 14,
                  height: 14,
                  padding: "1px",
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1px",
                }}
              >
                {theNotifications > 10 ? "10+" : theNotifications}
              </span>
            )}
          </div>

          {/* Conteúdo do dropdown (lista) */}
          {dropdownNotificationsVisible && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: 50,
                right: "-70px",
                background: UI.bg,
                border: `1px solid ${UI.border}`,
                borderRadius: UI.radiusLg,
                padding: 12,
                minWidth: 320,
                maxWidth: 360,
                boxShadow: UI.shadow,
                zIndex: 100000000,
              }}
            >
              {/* Cabeçalho do dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  padding: "4px 4px 8px",
                  borderBottom: `1px solid ${UI.border}`,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: UI.text }}>
                  Notificações
                </span>
                <button
                  onClick={() => setDropdownNotificationsVisible(false)}
                  style={{
                    border: `1px solid ${UI.border}`,
                    background: UI.bg,
                    borderRadius: 8,
                    fontSize: 12,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Fechar
                </button>
              </div>

              {/* Lista de notificações */}
              {myNotifications.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    maxHeight: 320,
                    overflow: "auto",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {myNotifications.map((n: any, i: number) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: 6,
                        listStyle: "none",
                      }}
                    >
                      <button
                        onClick={() => openModal(n)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: n.isViewed ? UI.bg : "#F1F5F9",
                          border: `1px solid ${UI.border}`,
                          borderRadius: 12,
                          padding: "10px 12px",
                          cursor: "pointer",
                          transition: "background 120ms ease",
                        }}
                      >
                        <p
                          style={{ margin: 0, fontSize: 11, color: UI.subtext }}
                        >
                          {formatDateBr(n.date)}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: 13,
                            color: UI.text,
                          }}
                        >
                          {n.message}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    margin: "6px 2px 2px",
                    textAlign: "center",
                    color: UI.subtext,
                    fontSize: 13,
                  }}
                >
                  No notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/* --------- MODAL: DETALHE DA NOTIFICAÇÃO --------- */}
        <Modal
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            transform: "translate(-50%, -50%)",
            bgcolor: "UI.bg", // mantido como estava
            boxShadow: UI.shadow,
            p: 0,
            borderRadius: `${UI.radiusLg}px`,
            outline: "none",
          }}
          open={modalOpen}
          onClose={handleClose}
        >
          <div
            style={{
              backgroundColor: UI.bg,
              display: "flex",
              flexDirection: "column",
              maxWidth: 400,
              margin: "auto",
              maxHeight: "80vh",
              top: "50%",
              transform: "translateY(100%)",
              border: `1px solid ${UI.border}`,
              borderRadius: UI.radiusLg,
              overflow: "hidden",
            }}
          >
            {/* Header do modal */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${UI.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: UI.text }}>
                Notificação
              </span>
              <button
                onClick={handleClose}
                style={{
                  border: `1px solid ${UI.border}`,
                  background: UI.bg,
                  borderRadius: 8,
                  fontSize: 12,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Corpo do modal */}
            <div style={{ padding: 16 }}>
              {selectedNotification?.link ? (
                <Link target="_blank" to={selectedNotification.link}>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: 16,
                      color: UI.text,
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedNotification.message}
                  </h2>
                </Link>
              ) : (
                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: 16,
                    color: UI.text,
                    lineHeight: 1.3,
                  }}
                >
                  {selectedNotification.message}
                </h2>
              )}

              <h3
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 500,
                  color: UI.subtext,
                }}
              >
                {formatDateBr(selectedNotification.date)}
              </h3>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
