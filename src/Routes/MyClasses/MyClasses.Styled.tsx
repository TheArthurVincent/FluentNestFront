import styled from "styled-components";
import {
  alwaysBlack,
  lightGreyColor,
  partnerColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";

export const EventsCardsContainer = styled.div`
  display: grid;
  gap: 1rem;
  justify-content: center;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const EventsCard = styled.div`
  display: grid;
  gap: 1rem;
  justify-content: center;
  text-align: center;
  padding: 1rem 0;
  background-color: ${lightGreyColor()};
`;

export const HThree = styled.h3`
  padding: 0.5rem;
  margin: 0.5rem 0;
  color: ${"#000"};
  @media (max-width: 900px) {
    margin: 10px auto;
  }
  @media (max-width: 500px) {
    max-width: 22rem;
  }
`;

export const HThreeModule = styled.h3`
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  cursor: pointer;
  color: ${"#000"};
  background-color: #f8f8f8;
  border-left: 5px solid ${"#000"};
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 6px;
  transition: background-color 0.1s ease, color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    color: ${partnerColor()};
  }

  @media (max-width: 900px) {
    font-size: 1.1rem;
    padding: 0.5rem;
    margin: 0.75rem 0;
  }

  @media (max-width: 500px) {
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
`;

export const H3FAQ = styled.h3`
  padding: 0.5rem;
  margin: 0.5rem;
  background-color: ${"#000"};
  color: ${textPrimaryColorContrast()};
  @media (max-width: 900px) {
    margin: 10px auto;
  }
  @media (max-width: 500px) {
    max-width: 22rem;
  }
  &:hover {
    background-color: ${alwaysBlack()};
    color: ${partnerColor()};
    transition: 0.2s;
  }
`;
export const DivAppear = styled.div`
  &.smooth {
    animation-name: slideUpDown;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
  }
`;

export const ClassBox = styled.div`
  display: grid;
  gap: 0.5rem;
  justify-content: space-evenly;
  padding-bottom: 4rem;
  border-bottom: solid 1px ${"#000"};
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const TransectionMenu = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  justify-content: space-between;
  @media (max-width: 1000px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;
