import styled from "styled-components";
import {
  alwaysWhite,
  partnerColor,
  textGeneralFont,
} from "../../Styles/Styles";

interface ButtonProps {
  firstcolor?: string;
  secondcolor?: string;
  textcolor?: string;
}

interface ArvinButtonProps {
  color?: string;
  colorContrast?: string;
  colorGradient?: string;
  cursor?: string;
}

export const ArvinButton = styled.button<ArvinButtonProps>`
  background: ${(props) => (props.color ? props.color : partnerColor())};
  color: ${(props) =>
    props.colorContrast === "white" ? "black" : alwaysWhite()};
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &:active {
    font-weight: 200;
  }
`;

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, ""); // remove tudo que não é número
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }

  return cpf; // retorna original se não for válido
}
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, ""); // Remove tudo que não for número
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}.${match[3]}-${match[4]}`;
  }

  return phone; // Retorna original se não bater com o padrão
}

export const MyButton = styled.button<ButtonProps>`
  background: linear-gradient(
    to left,
    ${(props) => props.firstcolor || "#000"} 0%,
    ${(props) => props.secondcolor || props.firstcolor || "#5c5c5c"} 50%
  );
  color: ${(props) => props.textcolor || alwaysWhite()};
  padding: 5px 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline;
  max-width: fit-content;
  font-weight: 600;
  &:hover {
    background: linear-gradient(
      to left,
      ${(props) => props.firstcolor || "#000"} 0%,
      ${(props) => props.secondcolor || props.firstcolor || "#5c5c5c"} 100%
    );

    box-shadow: 1px 1px 10px 1px #bbb;
    border-radius: 4px;
  }

  &:active {
    font-weight: 500;
    box-shadow: inset 1px 1px 10px 1px #ddd;
  }
`;
