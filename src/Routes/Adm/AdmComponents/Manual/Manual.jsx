import React from "react";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";

export function Manual() {
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    margin: "20px 0",
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  const tableHeaderStyle = {
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
        }}
      >
        Manual do Aluno
      </HOne>

      <HTwo>Acesso às Ferramentas:</HTwo>
      <p>Plataforma do Curso</p>

      <HTwo>Aulas Extras (Coletivas - 2 SEMANAS X MÊS)</HTwo>
      <p>Segunda, às 20:00 [Business / Conversation]</p>
      <p>
        * Funcionam como reposição para feriados e eventuais faltas do aluno.
      </p>
      <HTwo>Política de Cancelamento:</HTwo>
      <ul>
        <li>
          Cancelamento de uma Aula Particular: Se o aluno informar 24 horas
          antes, há possibilidade de reposição em algum sábado às 7h (há fila).
        </li>
        <li>Cancelamento do Curso: Avise com 1 mês de antecedência.</li>
      </ul>

      <HTwo>Horário das Aulas Particulares:</HTwo>
      <p>1, 2 ou 3 aulas na semana (55 minutos cada)</p>

      <HTwo>Valores:</HTwo>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, ...tableHeaderStyle }}>1 Aula</th>
            <th style={{ ...thStyle, ...tableHeaderStyle }}>2 Aulas</th>
            <th style={{ ...thStyle, ...tableHeaderStyle }}>3 Aulas</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>R$ 310</td>
            <td style={tdStyle}>R$ 510</td>
            <td style={tdStyle}>R$ 800</td>
          </tr>
        </tbody>
      </table>

      <HTwo>Lembre-se:</HTwo>
      <ul>
        <li>Esteja preparado para suas aulas.</li>
        <li>Comunique qualquer cancelamento com antecedência.</li>
        <li>
          Aproveite as aulas extras como uma oportunidade de aprendizado
          adicional.
        </li>
      </ul>
    </div>
  );
}

export default Manual;
