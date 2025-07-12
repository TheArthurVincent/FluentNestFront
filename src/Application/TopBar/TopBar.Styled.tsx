import styled from "styled-components";
import {
  partnerColor,
  transparentBlack,
  alwaysWhite,
} from "../../Styles/Styles";

export const TopBarContainer = styled.header.attrs({
  className: "box-shadow-black",
})`
  top: 0;
  z-index: 7;
  position: fixed;
  background-color: ${alwaysWhite()};
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  padding: 6px;
  width: 100%;
  height: 40px;
  @media print {
    display: none;
  }
`;

export const TopBarVerticalContainer = styled.header`
  top: 0;
  left: 0;
  z-index: 8;
  position: fixed;
  background-color: ${alwaysWhite()};
  justify-content: center;
  justify-items: center;
  align-items: center;
  display: grid;
  padding: 1px;
  height: 100%;
  width: 90px;
  @media (max-width: 1380px) {
    display: none;
  }
  @media print {
    display: none;
  }
`;

export const TopBarNavigation = styled.div`
  text-align: center;
  gap: 2rem;
  display: flex;
  z-index: 4;
  font-size: 11px;
  padding: 5px;
  align-items: center;
  justify-content: space-evenly;
  list-style: none;
`;
export const TopBarNavigationBurger = styled.div.attrs({
  className: "box-shadow-black",
})`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${alwaysWhite()};
  padding: 2rem 1.5rem;
  border-right: 1px solid ${partnerColor()};
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &.smooth {
    animation-name: slideInLeftNoOpacity;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
  }

  a {
    text-decoration: none;
    color: ${"#000"};
    font-weight: 600;
    font-size: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    transition: color 0.3s, background-color 0.3s, padding-left 0.3s,
      transform 0.3s;

    &:hover {
      background-color: #eee;
      color: #fff;
      padding-left: 1.8rem;
      transform: translateX(5px);
    }

    &.active {
      color: ${partnerColor()};
      border-left: 4px solid ${partnerColor()};
      padding-left: calc(1rem - 4px);
    }
  }
`;

export const BackgroundClick = styled.div`
  position: fixed;
  display: none;
  left: -30rem;
  z-index: 5;
  background-color: ${transparentBlack()};
  min-height: 10000vh;
  min-width: 10000vw;
`;

export const LinkItem = styled.li`
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  &:active {
    font-weight: 600;
  }
`;

export const LogoStyle = styled.div`
  display: block;
  @media (max-width: 1380px) {
    display: none;
  }
`;

export const Hamburguer = styled.div`
  display: none;
  font-weight: 900;
  font-size: 1.9rem;
  cursor: pointer;
  &:hover {
    color: ${"#000"};
  }
  @media (max-width: 1380px) {
    display: block;
  }
`;
