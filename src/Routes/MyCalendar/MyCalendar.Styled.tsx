import styled from "styled-components";
import {
  darkGreyColor,
  lightGreyColor,
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
export const StyledDiv = styled.div`
  padding: 0px 0px 10px 0px;
  margin: 10px auto;
  border: 1px solid ${lightGreyColor()};
  width: 10vw;
  height: 61vh;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 1380px) {
    min-width: 20vw;
  }
  @media (max-width: 900px) {
    min-width: 30vw;
  }
`;
export const CourseItem = styled.div`
  background-color: ${lightGreyColor()};
  padding: 3rem;
  text-align: center;
  border: none;
  color: ${"#000"};
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${"#000"};
    color: ${textpartnerColorContrast()};
    font-weight: 700;
  }
`;
export const ItemItem = styled.i`
  background-color: ${lightGreyColor()};
  padding: 3rem;
  text-align: center;
  border: none;
  color: ${"#000"};
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${"#000"};
    color: ${textpartnerColorContrast()};
    font-weight: 700;
  }
`;
export const CourseCard = styled.div`
  color: black;
  text-align: center;
  gap: 0.5rem;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  background-color: ${lightGreyColor()};
  height: 16rem;
  width: 14rem;
  padding: 1rem 0.2rem;
  flex-direction: column;
  transition: 0.3s;
  img {
    transition: 0.3s;
    filter: grayscale(100%);
  }
  &:hover {
    box-shadow: 2px 2px 10px 1px ${darkGreyColor()};
    img {
      filter: grayscale(0%);
    }
  }
`;
