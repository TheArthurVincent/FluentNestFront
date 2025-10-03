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
export const CourseCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;
  padding: 0.2rem;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f3f3f3;
    img {
      transform: scale(1.1);
      filter: grayscale(100%);
    }
  }

  img {
    border-radius: 4px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    margin-right: 1rem;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  p {
    flex-grow: 1;
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
  }
`;
