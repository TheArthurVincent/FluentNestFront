import styled from "styled-components";
import {
  lightGreyColor,
  partnerColor,
  textpartnerColorContrast,
} from "../../Styles/Styles";

export const CoursesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const CourseItem = styled.div`
  background-color: ${partnerColor()};
  padding: 3rem;
  text-align: center;
  border: none;
  color: ${textpartnerColorContrast()};
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${textpartnerColorContrast()};
    color: ${partnerColor()};
    font-weight: 700;
  }
`;
export const CourseCard = styled.div`
  color: ${lightGreyColor()};
  text-align: center;
  display: flex;
  height: 20rem;
  width: 15rem;
  padding: 1rem 0.2rem;
  flex-direction: column;
  transition: 0.1s;
  img {
    filter: grayscale(100%);
    transition: filter 0.1s;
  }
  &:hover {
    box-shadow: 1px 1px 10px 1px #aaa;
    img {
      filter: grayscale(0%);
    }
    &:active {
      box-shadow: inset 1px 1px 10px 1px #aaa;
    }
  }
`;
