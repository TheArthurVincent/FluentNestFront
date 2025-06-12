import styled from "styled-components";

export const FormList = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: left;
  align-items: center;

  @media (max-width: 1350px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const FormList2 = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
  justify-content: left;
  align-items: center;
`;
