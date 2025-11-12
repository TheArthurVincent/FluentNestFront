import styled from "styled-components";
import { partnerColor } from "../../Styles/Styles";

/* =========================
   Grids e cartões
   ========================= */

export const EventsCardsContainer = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  align-items: stretch;
  width: 100%;
  max-width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const EventsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

/* =========================
   Títulos
   ========================= */

export const HThree = styled.h3`
  margin: 8px 0 0;
  padding: 8px 0;
  color: #000;
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.1rem);
  font-weight: 600;
  line-height: 1.25;

  @media (max-width: 900px) {
    margin: 10px 0 0;
  }

  @media (max-width: 500px) {
    max-width: 100%;
  }
`;

/* Cabeçalho “abrível” de módulo — liso, sem sombra, com borda lateral */
export const HThreeModule = styled.h3`
  padding: 12px 14px;
  margin: 12px 0;
  cursor: pointer;
  color: #000;
  background-color: #ffffff;
  border-left: 3px solid ${partnerColor()};
  border-radius: 10px;
  border: 1px solid #e3e8f0;
  font-size: 1.05rem;
  font-weight: 700;
  transition: background-color 0.12s ease, color 0.12s ease;

  &:hover {
    background-color: #eeeeee05;
    color: ${partnerColor()};
  }

  &:focus-visible {
    outline: 2px solid ${partnerColor()};
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    font-size: 1.05rem;
    padding: 10px 12px;
    margin: 10px 0;
  }

  @media (max-width: 500px) {
    font-size: 1rem;
    padding: 10px 12px;
    margin: 8px 0;
  }
`;

/* FAQ destacado, mas minimalista */
export const H3FAQ = styled.h3`
  padding: 10px 12px;
  margin: 8px 0;
  background-color: #000;
  color: white;
  border-radius: 10px;
  border: 1px solid #111827;

  &:hover {
    background-color: #000;
    color: ${partnerColor()};
    transition: color 0.15s ease;
  }

  @media (max-width: 900px) {
    margin: 10px 0;
  }

  @media (max-width: 500px) {
    max-width: 100%;
  }
`;

/* =========================
   Aparição suave opcional
   ========================= */

export const DivAppear = styled.div`
  &.smooth {
    animation-name: slideUpDown;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
  }
`;

/* =========================
   Listagem de aulas / caixas
   ========================= */

export const ClassBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e3e8f0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================
   Barra de ações / filtros
   ========================= */

export const TransectionMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 12px 0;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;
