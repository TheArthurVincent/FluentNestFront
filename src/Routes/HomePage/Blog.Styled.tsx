import styled from "styled-components";
import { alwaysWhite, lightGreyColor } from "../../Styles/Styles";

export const DivModal = styled.div`
  position: fixed;
  z-index: 100;
  background-color: ${alwaysWhite()};
  padding: 1rem;
  width: 70vw;
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
  @media (max-width: 1000px) {
    display: none;
  }
`;
export const IFrameVideoBlog = styled.iframe`
  min-width: 800px;
  min-height: 420px;
  box-sizing: border-box;
  margin-top: 1rem;
  margin-right: auto;
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
  @media (max-width: 750px) {
    min-width: 610px;
    min-height: 315px;
  }
  @media (max-width: 700px) {
    min-width: 550px;
    min-height: 285px;
  }
  @media (max-width: 650px) {
    min-width: 525px;
    min-height: 265px;
  }
  @media (max-width: 600px) {
    min-width: 450px;
    min-height: 300px;
  }
  @media (max-width: 500px) {
    min-width: 350px;
    min-height: 200px;
  }
  @media (max-width: 400px) {
    min-width: 300px;
    min-height: 170px;
  }
`;

export const IFrameAsaas = styled.iframe`
  min-width: 800px;
  min-height: 420px;
  margin-top: 1rem;
  margin-right: auto;
  margin-left: auto;
  box-sizing: border-box;
  position: relative;
  border: none;
  @media (max-width: 1500px) {
    min-width: 700px;
    min-height: 360px;
  }
  @media (max-width: 1380px) {
    min-width: 550px;
    min-height: 285px;
  }
  @media (max-width: 615px) {
    min-width: 525px;
    min-height: 265px;
  }
  @media (max-width: 580px) {
    min-width: 450px;
    min-height: 300px;
  }
  @media (max-width: 500px) {
    min-width: 350px;
    min-height: 200px;
  }
`;

export const IFrameVideoPannel = styled.iframe`
  min-width: 800px;
  min-height: 420px;
  margin: auto;
  margin-top: 1rem;
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
  @media (max-width: 740px) {
    min-width: 610px;
    min-height: 315px;
  }
  @media (max-width: 700px) {
    min-width: 550px;
    min-height: 285px;
  }
  @media (max-width: 615px) {
    min-width: 525px;
    min-height: 265px;
  }
  @media (max-width: 580px) {
    min-width: 450px;
    min-height: 300px;
  }
  @media (max-width: 500px) {
    min-width: 350px;
    min-height: 200px;
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
