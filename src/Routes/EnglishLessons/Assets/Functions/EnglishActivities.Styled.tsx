import styled from "styled-components";
import { alwaysBlack, alwaysWhite } from "../../../../Styles/Styles";

export const ImgLesson = styled.img`
  width: 100%;
  max-width: 12rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  margin: 1rem auto;
  object-position: center;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  @media (max-width: 500px) {
    max-width: 15rem;
  }
  @media print {
    box-shadow: 1px 1px 12px 3px white;
  }
`;

export const LiSentence = styled.li`
  list-style: none;
  margin-bottom: 10px;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 4px;
  background-color: none;

  &:hover {
    box-shadow: 1px 1px 12px 3px white;
    background-color: #eee;
  }

  @media print {
    box-shadow: 1px 1px 12px 3px white;
  }
`;

export const RouteDivNotes = styled.div`
  background-color: ${alwaysWhite()};
  border-radius: 4px;
  color: ${alwaysBlack()};
  padding: 0.5rem;
  position: sticky;
  top: 50px;
  left: 0;
  box-shadow: 1px 1px 5px 1px #777;
  background-color: white;
  transition: right 0.3s ease;
  margin: 5px;
  margin-top: 15px;

  @media (max-width: 800px) {
    margin: 0;
  }
`;

interface UlSentencesProps {
  grid: number;
}

export const UlSentences = styled.ul<UlSentencesProps>`
  padding: 0.5rem;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: ${(props) =>
    props.grid == 3
      ? "1fr 1fr 1fr"
      : props.grid == 4
      ? "1fr 1fr 1fr 1fr"
      : props.grid == 2
      ? "1fr 1fr"
      : "1fr"};
  @media (max-width: 750px) {
    grid-template-columns: ${(props) => (props.grid >= 3 ? "1fr 1fr" : "1fr")};
  }
`;

export const LiGridImageLessons = styled.li`
  display: grid;
  list-style: none;
  margin-bottom: 10px;
`;
export const UlGridImageLessons = styled.ul`
  padding: 1rem;
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  @media (max-width: 690px) {
    grid-template-columns: 1fr;
  }
`;
export const LessonSizeControlBox = styled.div`
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  max-width: 90vw;
  justify-content: center;

  gap: 5px;
  margin-bottom: 9rem;
  &.smooth {
    animation-name: slideInLeft;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
  }
  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column-reverse;
    max-width: 100vw;
  }
`;
