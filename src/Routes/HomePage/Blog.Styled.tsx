import styled from "styled-components";
import { alwaysWhite, lightGreyColor, primaryColor } from "../../Styles/Styles";

export const DivModal = styled.div`
  position: fixed;
  z-index: 100;
  background-color: ${alwaysWhite()};
  padding: 1rem;
  width: 50vw;
  height: 30rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 2px 10px 4px #ccc;
`;

export const InternDivModal = styled.div`
  display: grid;
  gap: 2px;
  margin: auto;
`;

export const EventsCardsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export const EventsCard = styled.div`
  display: grid;
  gap: 0.5rem;
  max-width: 25rem;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
  background-color: ${lightGreyColor()};
`;

export const SpanDisapear = styled.span`
  padding: 3px;
  font-size: 1rem;
  font-weight: 400;
  padding: "0.2rem 0.6rem";
  @media (max-width: 1200px) {
    display: none;
  }
`;
export const IFrameVideoBlog = styled.iframe`
  min-width: 950px;
  min-height: 500px;
  margin-right: auto;
  margin-left: auto;
  box-sizing: border-box;
  position: relative;
  border: none;
  @media (max-width: 1155px) {
    margin-right: auto;
    margin-left: auto;
  }
  @media (max-width: 975px) {
    min-width: 930px;
    min-height: 450px;
  }
  @media (max-width: 900px) {
    min-width: 850px;
    min-height: 435px;
  }
  @media (max-width: 835px) {
    min-width: 780px;
    min-height: 400px;
  }
  @media (max-width: 775px) {
    min-width: 700px;
    min-height: 360px;
  }
  @media (max-width: 715px) {
    min-width: 660px;
    min-height: 340px;
  }
  @media (max-width: 662px) {
    min-width: 610px;
    min-height: 315px;
  }
  @media (max-width: 605px) {
    min-width: 550px;
    min-height: 285px;
  }
  @media (max-width: 575px) {
    min-width: 535px;
    min-height: 225px;
  }
  @media (max-width: 565px) {
    min-width: 525px;
    min-height: 265px;
  }
  @media (max-width: 555px) {
    min-width: 515px;
    min-height: 260px;
  }
  @media (max-width: 545px) {
    min-width: 505px;
    min-height: 255px;
  }
  @media (max-width: 535px) {
    min-width: 490px;
    min-height: 250px;
  }
  @media (max-width: 525px) {
    min-width: 480px;
    min-height: 240px;
  }
  @media (max-width: 515px) {
    min-width: 475px;
    min-height: 240px;
  }
  @media (max-width: 505px) {
    min-width: 465px;
    min-height: 235px;
  }
  @media (max-width: 495px) {
    min-width: 455px;
    min-height: 235px;
  }
  @media (max-width: 475px) {
    min-width: 435px;
    min-height: 222px;
  }
  @media (max-width: 465px) {
    min-width: 425px;
    min-height: 215px;
  }
  @media (max-width: 445px) {
    min-width: 405px;
    min-height: 210px;
  }
  @media (max-width: 435px) {
    min-width: 400px;
    min-height: 200px;
  }
  @media (max-width: 425px) {
    min-width: 380px;
    min-height: 195px;
  }
  @media (max-width: 405px) {
    min-width: 370px;
    min-height: 189px;
  }
`;
export const IFrameAsaas = styled.iframe`
  min-width: 800px;
  min-height: 420px;
  margin-top: 1rem;
  margin-right: auto;
  box-sizing: border-box;
  margin-left: auto;
  position: relative;
  border: none;
  @media (max-width: 860px) {
    min-width: 700px;
    min-height: 360px;
  }
  @media (max-width: 780px) {
    min-width: 660px;
    min-height: 340px;
  }
  @media (max-width: 720px) {
    min-width: 610px;
    min-height: 315px;
  }
  @media (max-width: 700px) {
    min-width: 550px;
    min-height: 285px;
  }
  @media (max-width: 600px) {
    min-width: 525px;
    min-height: 265px;
  }
  @media (max-width: 500px) {
    min-width: 350px;
    min-height: 200px;
  }
`;

export const IFrameVideoPannel = styled.iframe`
  min-width: 37vw;
  min-height: 62vh;

  margin-right: auto;
  margin-left: auto;
  box-sizing: border-box;
  position: relative;
  border: none;
  @media (max-width: 2000px) {
    min-width: 37vw;
    min-height: 50vh;
  }

  @media (max-width: 1200px) {
    min-width: 90vw;
    min-height: 60vh;
  }
  @media (max-width: 900px) {
    min-width: 90vw;
    min-height: 55vh;
  }
  @media (max-width: 800px) {
    min-width: 90vw;
    min-height: 50vh;
  }
  @media (max-width: 700px) {
    min-width: 90vw;
    min-height: 45vh;
  }
  @media (max-width: 600px) {
    min-width: 90vw;
    min-height: 40vh;
  }
  @media (max-width: 480px) {
    min-width: 85vw;
    min-height: 25vh;
  }
  @media (max-width: 400px) {
    min-width: 90vw;
    min-height: 30vh;
  }
`;

export const ImgBlog = styled.img`
  margin-top: 0;
  margin-right: auto;
  margin-left: auto;
  object-position: center;
  max-height: auto;
  width: 40%;
`;

export const Disapear = styled.span`
  @media (max-width: 900px) {
    display: none;
  }
`;
export const DivPost = styled.div`
  display: grid;
  // justify-content: center;
  // flex-direction: column;
  max-width: 650px;
`;
