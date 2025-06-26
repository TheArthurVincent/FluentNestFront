import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
0% {
  transform: translate(-50%, -40%) rotate(0deg);
}
100% {
  transform: translate(-50%, -40%) rotate(360deg);
}
`;

export const DivCardLevel = styled.div`
  position: relative;
  width: 7rem;
  height: 7rem;
  margin: auto;
  @media (max-width: 1380px) {
    display: none;
  }
`;

export const DivCardBlogLevel = styled.div`
  position: relative;
  width: 7rem;
  height: 7rem;
  margin: auto;
`;
export const ExternalDivCardBlogLevel = styled.div`
  color: black;
  padding: 12px 8px;
  display: grid;
  text-align: center;
  min-height: 400px;
  font-size: 14px;
  justify-content: center;
`;
export const DivDisapearBig = styled.div`
  margin-top: 0.3rem;
  @media (max-width: 1380px) {
    display: none;
  }
`;
export const DivSeeBig = styled.div`
  display: none;
  font-size: 10px;
  @media (max-width: 1380px) {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    align-self: center;
  }
`;

export const DivSeeBlogBig = styled.div`
  display: none;
  font-size: 0.8rem;
`;

export const LevelCardComponent = styled.div`
  padding: 8px;
  display: grid;
  text-align: center;
  background-color: white;
  min-width: 155px;
  font-size: 14px;
  justify-content: center;
  text-align: center;
`;

export const NewLevelCardComponent = styled.div`
  padding: 12px 8px;
  display: grid;
  position: sticky;
  top: 60px;
  border-radius: 6px;
  text-align: center;
  color: white;
  min-width: 200px;
  height: 300px;
  font-size: 14px;
  justify-content: center;
  text-align: center;
  @media (max-width: 1380px) {
    width: 93vw;
    display: flex;
    padding: 10spx;
    height: 1.5rem;
  }
`;

export const TextLevelCard = styled.div`
  position: relative;
  top: 30%;
  left: 0%;
  @media (max-width: 1380px) {
    position: static;
    align-items: center;
  }
`;

export const TextLevelBlogCard = styled.div`
  position: relative;
  top: 30%;
  left: 0%;
`;

export const LevelCardLevel = styled.img`
  width: 12rem;
  height: 12rem;
  object-fit: cover;
  top: 50%;
  position: absolute;
  left: 50%;
  z-index: 3;
  transform: translate(-50%, -40%);
  animation: ${spinAnimation} 1s ease-out forwards;
  @media (max-width: 1380px) {
    top: 26.5%;
    left: -40%;
    width: 6rem;
    height: 6rem;
  }
  @media (max-width: 487px) {
    left: 13%;
  }
`;

export const LevelCardBlogLevel = styled.img`
  width: 18rem;
  height: 18rem;
  object-fit: cover;
  top: 50%;
  left: 50%;
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -40%);
  animation: ${spinAnimation} 1s ease-out forwards;
`;
export const LevelCardPhotoLevel = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 17%;
  left: 0%;
  @media (max-width: 487px) {
    left: -15%;
  }
`;

export const LevelCardPhotoBlogLevel = styled.img`
  width: 11rem;
  height: 11rem;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: -5%;
  left: -28%;
`;
