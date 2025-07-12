import styled from "styled-components";
import {
  alwaysWhite,
  alwaysBlack,
  lightGreyColor,
  partnerColor,
} from "../../../Styles/Styles";

export const CoursesListContainer = styled.div`
  display: flex;
  height: 100vh;
  border-right: ridge 5px ${partnerColor()};
  position: fixed;
  top: 0rem;
  z-index: 10;
  transition: left 0.3s ease-out;
`;

export const CoursesListTitleContainer = styled.div`
  color: ${"#000"};
  background-color: ${alwaysWhite()};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const CoursesList = styled.ul`
  height: fit-content;
`;

export const CoursesListItem = styled.li`
  background-color: ${alwaysWhite()};
  color: ${alwaysBlack()};
  list-style: none;
  margin: 2px;
  align-items: center;
  padding: 0.2rem 0.5rem;
  display: flex;
  align-items: left;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background-color: ${alwaysWhite()};
    color: ${alwaysBlack()};
  }
`;

export const CoursesListInnerInnerContainer = styled.div`
  max-height: 95vh;
  overflow-y: auto;
`;
export const CoursesListInnerContainer = styled.div`
  width: 290px;
  border-radius: 0 20px 20px 0;
  display: grid;
  max-height: 99.9vh;
  overflow-y: auto;
  padding: 1px;
  flex-direction: column;
  background-color: ${lightGreyColor()};
  padding: 2px;
  justify-content: space-between;
`;

export const ArrowStyle = styled.span`
  font-weight: 900;
  font-size: 1.2rem;
  margin: 0;
`;
