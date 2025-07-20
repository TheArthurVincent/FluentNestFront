import React, { FC, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { TopBarVerticalContainer, TopBarNavigation } from "./TopBar.Styled";
import { SpanHover } from "../../Resources/UniversalComponents";
import { useUserContext } from "../SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { ItemSideBarProps, ItemTopBarProps, LinkItem } from "./TopBarTypes";

export const TopBarVertical: FC<ItemSideBarProps> = ({
  theGoogleDriveLink,
}) => {
  const [visible, setVisible] = useState<string>("none");
  const { handleLanguageChange, UniversalTexts } = useUserContext();
  const [permissions, setPermissions] = useState<string>("");
  const [seeItems, setSeeItems] = useState(true);

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setPermissions(getLoggedUser.permissions);
  }, []);

  const toAdm: LinkItem[] = [
    {
      title: "Adm",
      endpoint: "/adm-businessmanagement",
      icon: "cog",
      display: "none",
    },
  ];

  const allLinksForUser = [
    {
      title: UniversalTexts.calendar,
      endpoint: "/my-calendar",
      icon: "calendar",
      display: "block",
      isExternal: false,
    },
    {
      title: UniversalTexts.homework,
      endpoint: "/homework",
      isExternal: false,
      icon: "book",
      display: "block",
    },
    {
      title: "Flashcards",
      isExternal: false,
      endpoint: "/flash-cards",
      icon: "clone",
      display: "block",
    },
    {
      title: "Ranking",
      isExternal: false,
      endpoint: "/ranking",
      icon: "th-list",
      display: "block",
    },
    {
      title: UniversalTexts.myClasses,
      isExternal: false,
      endpoint: "/my-classes",
      icon: "user",
      display: "block",
    },
    {
      isExternal: false,
      title: UniversalTexts.theCourses,
      endpoint: "/english-courses",
      icon: "address-book-o",
      display: "block",
    },
    {
      title: UniversalTexts.myProfile,
      isExternal: false,
      endpoint: "/my-profile",
      display: "block",
      icon: "user-o",
    },
    {
      title: UniversalTexts.personalFolder,
      isExternal: true,
      endpoint: `/${theGoogleDriveLink}`,
      display: "block",
      icon: "folder",
    },
  ];

  const location = useLocation();
  return (
    <TopBarVerticalContainer>
      <TopBarNavigation>
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {allLinksForUser.map((link, index) => {
            return link.isExternal ? (
              <a
                key={index}
                href={link.endpoint}
                style={{
                  display: seeItems ? "flex" : "none",
                  color: "#000",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SpanHover>
                  <i className={`fa fa-${link.icon}`} />
                  {link.title}
                </SpanHover>
              </a>
            ) : (
              <Link
                key={index}
                style={{
                  display: seeItems ? "flex" : "none",
                  color: location.pathname.includes(link.endpoint)
                    ? partnerColor()
                    : "#000",
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
              </Link>
            );
          })}
          {permissions === "superadmin" &&
            seeItems &&
            toAdm.map((link, index) => {
              return (
                <NavLink
                  key={index}
                  style={{
                    color: location.pathname.includes(link.endpoint)
                      ? partnerColor()
                      : "#000",
                    textDecoration: "none",
                  }}
                  to={link.endpoint}
                >
                  <SpanHover>
                    <i className={`fa fa-${link.icon}`} />
                    {link.title}{" "}
                  </SpanHover>
                </NavLink>
              );
            })}
        </div>
      </TopBarNavigation>
    </TopBarVerticalContainer>
  );
};
