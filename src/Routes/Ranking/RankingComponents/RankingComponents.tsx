import styled from "styled-components";
import { alwaysWhite, lightGreyColor } from "../../../Styles/Styles";
import { formatDate } from "../../../Resources/UniversalComponents";

export const FlexAdjust = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
  @media (max-width: 800px) {
    justify-content: center;
    flex-direction: column;
  }
`;

export const Disapear = styled.span`
  @media (max-width: 800px) {
    display: none;
  }
`;
export const CenterRightToggle = styled.p`
  text-align: right;
  @media (max-width: 800px) {
    text-align: center;
  }
`;
const d = new Date();
export const monthInQuestion = (
  formatDate(d).split(" ")[0] +
  "/" +
  formatDate(d).split(" ")[2]
).split(",")[0];

export const DivHover = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0.5rem 0;
  margin: 2px auto;
  background-color: ${alwaysWhite()};
  padding: 5px 10px;
  border: solid 1px ${lightGreyColor()};
  &:hover {
    background-color: ${lightGreyColor()};
    transition: 0.2s;
  }
  @media (max-width: 800px) {
    justify-content: center;
    flex-direction: column;
  }
`;
