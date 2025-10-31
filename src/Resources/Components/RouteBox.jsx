import styled, { keyframes } from "styled-components";
import {
  textPrimaryColorContrast,
  alwaysWhite,
  alwaysBlack,
  transparentWhite,
  partnerColor,
} from "../../Styles/Styles";

export const RouteSizeControlBox = styled.div`
  max-width: 93vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3.5rem;
  margin-bottom: 9rem;
  &.smooth {
    animation-name: slideInLeft;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
  }
`;

export const RouteDiv = styled.div.attrs({
  className: "box-shadow-black smooth",
})`
  background-color: ${alwaysWhite()};
  border-radius: 4px;
  padding: 1rem;
  width: 95vw;
  height: 100%;
  overflow: auto;
`;
export const RouteDivCalendar = styled.div.attrs({
  className: "box-shadow-black smooth",
})`
  background-color: ${alwaysWhite()};
  border-radius: 4px;
  padding: 0.5rem;
  width: 95vw;
  height: 100%;
`;

export const RouteDivCourses = styled.div.attrs({
  className: "box-shadow-black smooth",
})`
  background-color: ${alwaysWhite()};
  border-radius: 4px;
  padding: 0.5rem;
  margin-right: auto;
  margin-left: auto;
  height: 100%;
  width: 95vw;
`;

export const OverFlow = styled.div`
  max-height: 15rem,
  overflow: auto,
  @media (max-width: 500px) {
    max-height: 2rem,
    font-size: 0.6rem;
    max-width:10ch;
}
  `;
export const BlogRouteSizeControlBox = styled.div`
  display: flex;
  margin: 15px;
  margin-top: 60px;
  margin-bottom: 22px;
  gap: 0.2rem;
  max-width: 75vw;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  align-items: top;
  @media (max-width: 1000px) {
    flex-direction: column-reverse;
    align-items: center;
  }
  @media (max-width: 600px) {
    max-width: 68vw;
  }
  &.smooth {
    animation-name: slideInLeft;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
  }
`;

export const SpanIcon = styled.span`
  font-size: 1px;
  text-decoration: underline;
  color: ${alwaysWhite()};
  opacity: 0.8;
  transition: 0.3s;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 1;
    gap: 0.2rem;
    font-size: 0.8rem;
    padding: 5px;
    border-radius: 4px;
    background-color: ${alwaysBlack()};
  }
`;
export const BlogPostTitle = styled.div`
  padding: 0rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 650px) {
    margin: 3px;
  }
`;

export const HOne = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: ${partnerColor()};
  margin: 12px 0;
`;

export const HTwo = styled.h2`
  font-size: 1.2rem;
  color: ${partnerColor()};
  font-weight: 500;
  padding: 0.6rem;
  margin-bottom: 1rem;
  @media (max-width: 1700px) {
    text-align: center;
    margin-top: 1rem;
  }
  @media (max-width: 650px) {
    padding: 3px;
    margin: 3px;
  }
`;

export const HThree = styled.h3`
  font-size: 1rem;
  padding: 6px;
  @media (max-width: 750px) {
    padding: 3px;
    margin: 5px;
  }
`;

export const NextTutoringsDiv = styled.div`
  margin-right: auto;
  margin-left: auto;
  background-color: ${alwaysWhite()};
  color: ${alwaysBlack()};
  padding: 0.5rem;
  margin: 0 auto;
  min-width: 260px;
`;
export const NextLive = styled.div`
  background-color: ${alwaysWhite()};
  padding: 0.5rem;
  min-width: 260px;
  @media (max-width: 500px) {
    min-width: 160px;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;
export const DivFont = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  @media (max-width: 500px) {
    font-size: 1rem;
  }
`;

const changeColors = (color1, color2) => keyframes`
  0% {
    background-color: ${color1};
  }
  50% {
    background-color: ${color2};
  }
  100% {
    background-color: ${color1};
  }
`;
export const AnimatedLi = styled.li`
  padding: 0.2rem 1rem;
  margin-bottom: 5px;
  list-style: none;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  display: grid;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-radius: 4px;
  height: 100%; /* Garante altura uniforme */
`;

export const AnimatedLi3 = styled.li`
  padding: 0.2rem 1rem;
  margin-bottom: 5px;
  list-style: none;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  display: grid;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background: #f9f9f9;
  border: 2px solid #000;
  border-radius: 4px;
  height: 100%; /* Garante altura uniforme */
`;
export const AnimatedLi2 = styled.li`
  padding: 0.5rem 1rem;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} ${({ index }) => index * 0.3}s forwards;

  @media (max-width: 500px) {
    font-size: 1rem;
  }
`;

export const BackgroundClickBlog = styled.div`
  position: fixed;
  z-index: 5;
  background-color: ${transparentWhite()};
  height: 100000vh;
  width: 100000vw;
`;
