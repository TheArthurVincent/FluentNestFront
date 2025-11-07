import styled from "styled-components";
import { textPrimaryColorContrast } from "../../Styles/Styles";

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
  background-color: #eee;
  padding: 3rem;
  border: none;
  color: ${"#000"};
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${"#000"};
    color: ${textPrimaryColorContrast()};
    font-weight: 700;
  }
`;

