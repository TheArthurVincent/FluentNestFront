import styled from "styled-components";
import {
  alwaysWhite,
  primaryColor,
  primaryColor2,
  secondaryColor,
  secondaryColor2,
  textGeneralFont,
  textTitleFont,
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
  background: ${(props) => (props.color ? props.color : secondaryColor())};
  color: ${(props) =>
    props.colorContrast === "white" ? "black" : alwaysWhite()};
  padding: 10px;
  min-width: 30px;
  margin: 0 3px;
  cursor: ${(props) =>
    props.cursor === "not-allowed" ? "not-allowed" : "pointer"};
  display: inline;
  font-family: ${textGeneralFont()};
  border-radius: 6px;
  border: none;
  max-width: fit-content;
  &:hover {
    background: linear-gradient(
      to left,
      ${(props) => (props.colorGradient ? props.colorGradient : props.color)} 0%,
      ${(props) => (props.color ? props.color : secondaryColor())} 100%
    );
    border-radius: 6px;
  }
  &:active {
    font-weight: 500;
    box-shadow: inset 1px 1px 10px 1px #ddd;
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
    ${(props) => props.firstcolor || primaryColor()} 0%,
    ${(props) => props.secondcolor || props.firstcolor || primaryColor2()} 50%
  );
  color: ${(props) => props.textcolor || alwaysWhite()};
  padding: 5px 1.2rem;
  font-family: ${textTitleFont()};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: inline;
  max-width: fit-content;
  font-weight: 600;
  &:hover {
    background: linear-gradient(
      to left,
      ${(props) => props.firstcolor || primaryColor()} 0%,
      ${(props) => props.secondcolor || props.firstcolor || primaryColor2()}
        100%
    );

    box-shadow: 1px 1px 10px 1px #bbb;
    border-radius: 6px;
  }

  &:active {
    font-weight: 500;
    box-shadow: inset 1px 1px 10px 1px #ddd;
  }
`;
