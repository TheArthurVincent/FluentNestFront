import React, { FC, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  TopBarContainer,
  TopBarNavigation,
  TopBarNavigationBurger,
  BackgroundClick,
  Hamburguer,
} from "./TopBar.Styled";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  SpanHover,
} from "../../Resources/UniversalComponents";

import { useUserContext } from "../SelectLanguage/SelectLanguage";
import {
  logoPartner,
  partnerColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import { LinkItem } from "./TopBarTypes";
import { SpanDisapear } from "../../Routes/HomePage/Blog.Styled";
import axios from "axios";
import { Modal } from "@mui/material";
import { HThree, HTwo } from "../../Resources/Components/RouteBox";
import socket, { registerUser } from "./socket";
import { isArthurVincent, isArvin } from "../../App";

export const TopBar: FC = () => {
  const [visible, setVisible] = useState<string>("none");
  const context = useUserContext();
  const { handleLanguageChange, UniversalTexts } = context || {
    handleLanguageChange: () => {},
    UniversalTexts: {},
  };
  const [permissions, setPermissions] = useState<string>("");
  const [theNotifications, setNotifications] = useState<number>(0);
  const [id, setid] = useState<string>("");
  var [myNotifications, setMyNotifications] = useState<any>([]);

  const updateNumberOfNotifications = async (id: any) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/numberofnotifications/${id}`,
      );

      const notifications = response.data.notifications;
      const listOfNotifications = response.data.listOfNotifications;

      localStorage.setItem("notifications", JSON.stringify(notifications));
      setNotifications(notifications);
      setMyNotifications(listOfNotifications);
      registerUser(id);
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };
  const handleSeeAll = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/notificationsseeall/${id}`,
      );
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  useEffect(() => {
    const handler = () => updateNumberOfNotifications(id);
    socket.on("receive_notification", handler);
    return () => {
      socket.off("receive_notification", handler);
    };
  }, [id]); // ou []

  const updateViewed = async (id: any) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/notification/${id}`,
      );
    } catch (error) {
      console.log(error, "Erro ao atualizar dados");
    }
  };

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setPermissions(logged.permissions);
    setid(logged.id);
    const saved = JSON.parse(localStorage.getItem("notifications") || "0");
    setNotifications(saved || 0);
  }, []);

  useEffect(() => {
    const handler = () => updateNumberOfNotifications(id);
    socket.on("receive_notification", handler);
    return () => {
      socket.off("receive_notification", handler);
    };
  }, [id]);

  const toAdm: LinkItem[] = [
    {
      title: "Adm",
      endpoint: "/adm-businessmanagement",
      icon: "cog",
      display: "none",
    },
  ];
  const toTutoree: LinkItem[] = [];

  const allLinksForUser = [
    {
      title: UniversalTexts.homeworkAndLessons,
      endpoint: "/my-homework-and-lessons",
      icon: "pencil",
      display: "block",
    },
    {
      title: UniversalTexts.theCourses,
      endpoint: "/teaching-materials",
      icon: "address-book-o",
      display: "block",
      isLearning: true,
    },
    {
      title: "Flashcards",
      endpoint: "/flash-cards",
      icon: "clone",
      display: "block",
      isLearning: true,
    },
    {
      title: UniversalTexts.vocabulary,
      endpoint: "/sentence-mining",
      icon: "search",
      display:
        permissions == "teacher" ||
        permissions == "superadmin" ||
        isArthurVincent
          ? "block"
          : "none",
      isLearning: true,
    },
    {
      title: UniversalTexts.calendar,
      endpoint: "/my-calendar",
      icon: "calendar",
      display: "block",
    },
    {
      title: "Ranking",
      endpoint: "/ranking",
      icon: "th-list",
      display: "block",
    },
    {
      title: UniversalTexts.myProfile,
      endpoint: "/my-profile",
      display: "block",
      icon: "user-o",
    },
  ];

  const learningLinks = allLinksForUser
    .filter((link) => link.isLearning)
    .map((link: any, index: number) => {
      return link.endpoint;
    });
  const tutoreeLinks = toTutoree.map((link: any, index: number) => {
    return link.endpoint;
  });

  var [dropdownNotificationsVisible, setDropdownNotificationsVisible] =
    useState<boolean>(false);

  const linksToShow = [...tutoreeLinks, ...learningLinks];

  const handleVisible = () => {
    setVisible(visible === "flex" ? "none" : "flex");
  };
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<any>({});

  const openModal = (notification: any) => {
    setSelectedNotification(notification);
    updateViewed(notification._id);

    setModalOpen(true);
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false); // Estado do modal
  const handleClose = () => {
    updateNumberOfNotifications(id);
    setModalOpen(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    p: 4,
    borderRadius: "6px",
    textAlign: "center",
  };

  // Don't render until context is ready
  if (!context || !UniversalTexts) {
    return <div>Loading...</div>;
  }

  return (
    <TopBarContainer>
      <Hamburguer
        style={{
          color: partnerColor(),
        }}
        onClick={handleVisible}
      >
        ☰
      </Hamburguer>
      <SpanDisapear>
        <Link to="/">
          <img
            style={{
              height: "3rem",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
            src={logoPartner()}
            alt=""
          />
        </Link>
      </SpanDisapear>
      <TopBarNavigationBurger
        onClick={handleVisible}
        style={{ display: visible }}
      >
        <div
          style={{
            display: "grid",
            gap: "3px",
            alignItems: "center",
          }}
        >
          <NavLink
            style={{
              color: location.pathname.includes("home") ? "#000" : "#000",
              paddingBottom: "5px",
              borderBottom: location.pathname.includes("home")
                ? `solid 1px ${"#000"}`
                : "none",
              textDecoration: "none",
            }}
            to="/"
          >
            <span
              style={{
                textAlign: "center",
              }}
            >
              {UniversalTexts.homePage}
            </span>
          </NavLink>

          {allLinksForUser.map((link, index) => {
            return (
              <NavLink
                key={index}
                style={{
                  color: location.pathname.includes(link.endpoint)
                    ? partnerColor()
                    : "#000",
                  paddingBottom: "5px",
                  cursor: location.pathname.includes(link.endpoint)
                    ? "default"
                    : "pointer",
                  display: link.display,
                  textDecoration: "none",
                }}
                to={link.endpoint}
              >
                <span
                  style={{
                    textAlign: "center",
                  }}
                >
                  {link.title}
                </span>
              </NavLink>
            );
          })}
          {toTutoree.map((link, index) => {
            return (
              <NavLink
                key={index}
                style={{
                  color: location.pathname.includes(link.endpoint)
                    ? partnerColor()
                    : "#000",
                  paddingBottom: "5px",
                  cursor: location.pathname.includes(link.endpoint)
                    ? "default"
                    : "pointer",
                  display: link.display,
                  textDecoration: "none",
                }}
                to={link.endpoint}
              >
                <span
                  style={{
                    textAlign: "center",
                  }}
                >
                  {link.title}
                </span>
              </NavLink>
            );
          })}
        </div>

        <div
          style={{
            display:
              permissions == "superadmin"
                ? "block"
                : permissions == "teacher"
                  ? "block"
                  : "none",
          }}
        >
          {toAdm.map((link, index) => {
            return (
              <NavLink
                style={{
                  color: location.pathname.includes(link.endpoint)
                    ? partnerColor()
                    : "#000",
                  paddingBottom: "5px",

                  cursor: location.pathname.includes(link.endpoint)
                    ? "default"
                    : "pointer",
                  textDecoration: "none",
                }}
                key={index}
                to={link.endpoint}
              >
                <span
                  style={{
                    textAlign: "center",
                  }}
                >
                  {link.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </TopBarNavigationBurger>
      <BackgroundClick onClick={handleVisible} style={{ display: visible }} />
      <SpanDisapear>
        <TopBarNavigation>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <SpanHover
                  style={{
                    cursor: "pointer",
                    color: linksToShow.some((link) =>
                      location.pathname.includes(link),
                    )
                      ? partnerColor()
                      : "#000",
                  }}
                >
                  <i className="fa fa-book" /> {UniversalTexts.learning}
                </SpanHover>
                {dropdownVisible && (
                  <div
                    style={{
                      position: "absolute",
                      background: "white",
                      boxShadow:
                        "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                      borderRadius: "6px",
                      padding: "8px",
                      width: "180px",
                      top: "100%",
                      left: "-70%",
                    }}
                  >
                    {allLinksForUser
                      .filter((link) => link.isLearning)
                      .map((link: any, index: any) => (
                        <NavLink
                          key={index}
                          to={link.endpoint}
                          style={{
                            margin: "5px",
                            color: location.pathname.includes(link.endpoint)
                              ? partnerColor()
                              : "#000",
                            paddingBottom: "5px",
                            display: link.display,
                            cursor: location.pathname.includes(link.endpoint)
                              ? "default"
                              : "pointer",
                            textDecoration: "none",
                          }}
                        >
                          <SpanHover>
                            <i className={`fa fa-${link.icon}`} />
                            {link.title}
                          </SpanHover>
                        </NavLink>
                      ))}
                    {toTutoree.map((link, index) => {
                      return (
                        <NavLink
                          key={index}
                          style={{
                            margin: "5px",
                            color: location.pathname.includes(link.endpoint)
                              ? partnerColor()
                              : "#000",
                            paddingBottom: "5px",
                            cursor: location.pathname.includes(link.endpoint)
                              ? "default"
                              : "pointer",
                            textDecoration: "none",
                          }}
                          to={link.endpoint}
                        >
                          <SpanHover>
                            <i className={`fa fa-${link.icon}`} />
                            {link.title}
                          </SpanHover>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {allLinksForUser
              .filter((link) => !link.isLearning)
              .map((link, index) => {
                return (
                  <NavLink
                    key={index}
                    style={{
                      margin: "5px",
                      color: location.pathname.includes(link.endpoint)
                        ? partnerColor()
                        : "#000",
                      paddingBottom: "5px",

                      cursor: location.pathname.includes(link.endpoint)
                        ? "default"
                        : "pointer",
                      textDecoration: "none",
                    }}
                    to={link.endpoint}
                  >
                    <SpanHover>
                      <i className={`fa fa-${link.icon}`} />
                      {link.title}
                    </SpanHover>
                  </NavLink>
                );
              })}
            {(permissions === "superadmin" || permissions === "teacher") &&
              toAdm.map((link, index) => {
                return (
                  <NavLink
                    key={index}
                    style={{
                      color: location.pathname.includes(link.endpoint)
                        ? partnerColor()
                        : "#000",
                      textDecoration: "none",
                      paddingBottom: "5px",
                      borderBottom: location.pathname.includes(link.endpoint)
                        ? `solid 1px ${"#000"}`
                        : "none",
                    }}
                    to={link.endpoint}
                  >
                    <SpanHover>
                      <i className={`fa fa-${link.icon}`} />
                      {link.title}
                    </SpanHover>
                  </NavLink>
                );
              })}
          </div>
        </TopBarNavigation>
      </SpanDisapear>

      <div
        onClick={() => {
          setDropdownNotificationsVisible(!dropdownNotificationsVisible);
          handleSeeAll();
        }}
        style={{ display: "flex", gap: "2rem", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              position: "relative",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            <i className="fa fa-bell" style={{ fontSize: "1rem" }} />
            {theNotifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "11px",
                  right: "-9px",
                  backgroundColor: "red",
                  color: "white",
                  fontSize: "8px",
                  fontWeight: "bold",
                  padding: "3px",
                  borderRadius: "50%",
                  minWidth: "5px",
                  minHeight: "5px",
                  textAlign: "center",
                }}
              >
                {theNotifications > 99 ? "99+" : theNotifications}
              </span>
            )}

            {dropdownNotificationsVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "-184px",
                  background: "white",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                  borderRadius: "6px",
                  padding: "10px",
                  minWidth: "250px",
                  zIndex: 100000000,
                }}
              >
                {myNotifications.length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      maxHeight: "300px",
                      overflow: "auto",
                      padding: "2px",
                      margin: 0,
                    }}
                  >
                    {myNotifications.map((notification: any, index: number) => (
                      <li
                        key={index}
                        onClick={() => {
                          openModal(notification);
                        }}
                        style={{
                          listStyle: "none",
                          padding: "5px",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: !notification.isViewed
                            ? "#eee"
                            : "#fff",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          {formatDateBr(notification.date)}
                        </p>
                        {notification.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, textAlign: "center" }}>
                    No notifications
                  </p>
                )}
              </div>
            )}
          </div>
          <div
            onClick={() => {
              updateNumberOfNotifications(id);
              setDropdownNotificationsVisible(!dropdownNotificationsVisible);
            }}
            style={{
              display: dropdownNotificationsVisible ? "block" : "none",
              position: "fixed",
              top: 0,
              left: 0,
              width: "1000000000000px",
              height: "10000000000px",
              zIndex: 100000,
            }}
          />
        </div>
        <Modal sx={modalStyle} open={modalOpen} onClose={handleClose}>
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <button onClick={handleClose}>✕</button>
            <Link target="_blank" to={selectedNotification.link}>
              <HTwo>{selectedNotification.message}</HTwo>
            </Link>
            <HThree>{formatDateBr(selectedNotification.date)}</HThree>
          </div>
        </Modal>
        {/* <form>
          <select
            id="language"
            name="language"
            onChange={(e) => handleLanguageChange(e.target.value)}
            defaultValue="pt"
          >
            <option value="pt">PT-BR</option>
            <option value="en">EN-US</option>
          </select>
        </form> */}
        <button
          onClick={onLoggOut}
          style={{
            backgroundColor: partnerColor(),
            color: textPrimaryColorContrast(),
          }}
        >
          {UniversalTexts.leaveButton}
        </button>
      </div>
    </TopBarContainer>
  );
};
